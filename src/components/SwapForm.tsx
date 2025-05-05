'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const LBX_MINT = 'CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1';

type QuoteResponse = {
  outAmount: string;
};

function formatNumberInput(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function parseFormattedNumber(value: string) {
  return value.replace(/,/g, '');
}

export default function SwapForm() {
  const [fromToken, setFromToken] = useState<'USDC' | 'LBXO'>('USDC');
  const [toToken, setToToken] = useState<'LBXO' | 'USDC'>('LBXO');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<string>('0.00');
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const inputMint = fromToken === 'USDC' ? USDC_MINT : LBX_MINT;
  const outputMint = toToken === 'LBXO' ? LBX_MINT : USDC_MINT;

  const fetchQuote = useCallback(async (amountToQuote: string) => {
    const rawAmount = Math.floor(Number(parseFormattedNumber(amountToQuote)) * 10 ** 6);
    if (!rawAmount || rawAmount <= 0) return;
    try {
      const url = `https://lite-api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${rawAmount}&slippageBps=300&restrictIntermediateTokens=true`;
      const response = await fetch(url);
      const data = await response.json();
      const decimals = toToken === 'LBXO' ? 9 : 6;
      const outAmount = Number(data.outAmount) / 10 ** decimals;
      setQuoteAmount(outAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }));
      setQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuoteAmount('Error');
      setQuote(null);
    }
  }, [inputMint, outputMint, toToken]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuote(amount);
    }, 500);
    return () => clearTimeout(timer);
  }, [amount, fetchQuote]);

  const handleSwap = () => {
    setFromToken((prev) => (prev === 'USDC' ? 'LBXO' : 'USDC'));
    setToToken((prev) => (prev === 'LBXO' ? 'USDC' : 'LBXO'));
    setAmount('');
    setQuote(null);
    setQuoteAmount('0.00');
  };

  const showMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 12000);
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatNumberInput(raw);
    setAmount(formatted);
  };

  const executeSwap = async () => {
    if (!publicKey || !signTransaction) return showMessage('⚠️ Connect a wallet compatible with signTransaction.');
    if (!amount || Number(parseFormattedNumber(amount)) <= 0) return showMessage('⚠️ Please enter a valid amount.');

    setLoading(true);
    setIsProcessing(true);
    setSuccessMessage(null);

    try {
      await fetchQuote(amount);
      if (!quote) return showMessage('⚠️ Failed to generate updated quote.');

      const response = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: publicKey.toBase58(),
          dynamicComputeUnitLimit: true,
          dynamicSlippage: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error ${response.status}: ${JSON.stringify(error)}`);
      }

      const swapData = await response.json();
      const transaction = VersionedTransaction.deserialize(Buffer.from(swapData.swapTransaction, 'base64'));

      const signedTx = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: true,
        maxRetries: 2,
      });

      const confirmation = await connection.confirmTransaction(txid, 'finalized');

      if (confirmation.value.err) {
        throw new Error(`Transaction error:\n${JSON.stringify(confirmation.value.err)}\nhttps://solscan.io/tx/${txid}`);
      } else {
        showMessage(
          `🚀 Swap completed successfully!\n🔗 ` +
          `<a href="https://solscan.io/tx/${txid}" target="_blank" class="underline text-[var(--foreground)] font-semibold">View on Solscan</a>`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Swap error:', error);
        showMessage(error.message || 'Unexpected error during swap.');
      } else {
        console.error('Unknown swap error:', error);
        showMessage('Unexpected error.');
      }
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  return (
    <>
  {/* Loading Overlay */}
  {isProcessing && (
    <div className="fixed inset-0 z-50 bg-[var(--background)]/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[var(--background)] text-[var(--foreground)] px-6 py-6 rounded-2xl shadow-xl text-center animate-pulse w-full max-w-sm">
        <div className="text-xl sm:text-2xl font-bold mb-2">🛠️ Processing Swap</div>
        <div className="text-sm sm:text-base text-[var(--foreground)]/60">
          Please wait while we complete your transaction...
        </div>
      </div>
    </div>
  )}

  {/* Main Card */}
  <div className="bg-[var(--background)] shadow-lg rounded-3xl p-5 sm:p-8 w-full max-w-xl mx-auto border border-[var(--border)] transition-all">
    <h2 className="text-center text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-6">
      🔁 Token Swap
    </h2>

    {/* Success Message */}
    {successMessage && (
      <div
        ref={messageRef}
        className="bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] px-4 py-4 rounded-xl mb-6 text-sm sm:text-base animate-fade-in"
      >
        <div dangerouslySetInnerHTML={{ __html: successMessage.replace(/\n/g, '<br />') }} />
      </div>
    )}

    {/* From Token */}
    <div className="mb-4">
      <label className="block text-sm sm:text-base font-medium text-[var(--foreground)] mb-2">
        You send
      </label>
      <div className="flex justify-between items-center border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--background)]/70">
        <span className="font-bold text-[var(--foreground)]">{fromToken}</span>
        <input
          type="text"
          placeholder="0.00"
          className="bg-transparent text-right text-[var(--foreground)] text-2xl sm:text-3xl font-bold w-full ml-4 focus:outline-none tracking-wider placeholder:text-[var(--foreground)]/40"
          value={amount}
          onChange={handleInputChange}
          disabled={loading}
        />
      </div>
    </div>

    {/* Action Button */}
    <div className="flex justify-center my-4">
      <button
        onClick={handleSwap}
        className="text-[var(--foreground)] hover:opacity-80 text-base sm:text-lg font-semibold px-5 py-2 rounded-full bg-[var(--border)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition"
        disabled={loading}
      >
        🔄 Swap
      </button>
    </div>

    {/* To Token */}
    <div className="mb-6">
      <label className="block text-sm sm:text-base font-medium text-[var(--foreground)] mb-2">
        You receive
      </label>
      <div className="flex justify-between items-center border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--background)]/70">
        <span className="font-bold text-[var(--foreground)]">{toToken}</span>
        <div className="text-right text-[var(--foreground)] text-2xl sm:text-3xl font-bold w-full ml-4 tracking-wider">
          {loading ? '...' : quoteAmount}
        </div>
      </div>
    </div>

    {/* Confirm Swap Button */}
    <button
      disabled={!amount || parseFloat(parseFormattedNumber(amount)) <= 0 || !quote || loading}
      onClick={executeSwap}
      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base sm:text-lg font-semibold py-3 rounded-full hover:brightness-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading
        ? toToken === 'LBXO'
          ? 'Buying LBXO...'
          : 'Selling LBXO...'
        : '✅ Execute Swap'}
    </button>
  </div>
</>

  );
}  
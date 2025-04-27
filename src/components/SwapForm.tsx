'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const LBX_MINT = 'CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1';

type QuoteResponse = {
  outAmount: string;
};

export default function SwapForm() {
  // --- código de controle, sem mudanças ---
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

  const fetchQuote = useCallback(async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    try {
      setLoading(true);
      const rawAmount = Math.floor(Number(amount) * 10 ** 6);
      const url = `https://lite-api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${rawAmount}&slippageBps=50&restrictIntermediateTokens=true`;
      const response = await fetch(url);
      const data = await response.json();
      const decimals = toToken === 'LBXO' ? 9 : 6;
      const outAmount = Number(data.outAmount) / 10 ** decimals;
      setQuoteAmount(outAmount.toFixed(4));
      setQuote(data);
    } catch (error) {
      console.error('Erro ao buscar quote:', error);
      setQuoteAmount('Erro');
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [amount, inputMint, outputMint, toToken]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

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

  const executeSwap = async () => {
    if (!publicKey || !signTransaction) return showMessage('⚠️ Conecte uma carteira compatível com signTransaction.');
    if (!amount || Number(amount) <= 0) return showMessage('⚠️ Insira um valor válido.');

    setLoading(true);
    setIsProcessing(true);
    setSuccessMessage(null);

    try {
      await fetchQuote();
      if (!quote) return showMessage('⚠️ Falha ao gerar a cotação atualizada.');

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
        throw new Error(`Erro ${response.status}: ${JSON.stringify(error)}`);
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
        throw new Error(`Erro de transação:\n${JSON.stringify(confirmation.value.err)}\nhttps://solscan.io/tx/${txid}`);
      } else {
        showMessage(
          `🚀 Swap realizado com sucesso!\n🔗 ` +
          `<a href="https://solscan.io/tx/${txid}" target="_blank" class="underline text-blue-400 font-semibold">Ver no Solscan</a>`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao executar swap:', error);
        showMessage(error.message || 'Erro inesperado ao executar swap.');
      } else {
        console.error('Erro desconhecido ao executar swap:', error);
        showMessage('Erro inesperado.');
      }
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  return (
    <>
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-black text-white px-6 py-6 rounded-2xl shadow-xl text-center animate-pulse max-w-sm">
            <div className="text-2xl font-bold mb-2">🛠️ Processando swap...</div>
            <div className="text-sm text-gray-400">Aguarde alguns instantes... 🔄</div>
          </div>
        </div>
      )}

      <div className="bg-gray-900 shadow-xl rounded-2xl p-6 md:p-10 w-full max-w-xl mx-auto relative border border-gray-600">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Swap de Tokens</h2>

        {successMessage && (
          <div
            ref={messageRef}
            className="bg-green-100 border border-green-400 text-green-800 px-4 py-4 rounded-xl mb-6 text-sm animate-fade-in"
          >
            <div dangerouslySetInnerHTML={{ __html: successMessage.replace(/\n/g, '<br />') }} />
          </div>
        )}

        {/* Formulário De */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-1">De</label>
          <div className="flex justify-between items-center border border-gray-500 rounded-xl px-4 py-3 bg-gray-800">
            <span className="font-bold text-green-400">{fromToken}</span>
            <input
              type="number"
              placeholder="0.00"
              className="bg-transparent text-right text-green-400 text-3xl font-bold w-full ml-4 focus:outline-none tracking-widest"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-center my-4">
          <button
            onClick={handleSwap}
            className="text-white hover:text-green-400 text-lg font-medium flex items-center gap-2"
            disabled={loading}
          >
            🔁 Inverter tokens
          </button>
        </div>

        {/* Formulário Para */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-1">Para</label>
          <div className="flex justify-between items-center border border-gray-500 rounded-xl px-4 py-3 bg-gray-800">
            <span className="font-bold text-green-400">{toToken}</span>
            <div className="text-right text-green-400 text-3xl font-bold w-full ml-4 tracking-widest">
              {loading ? '...' : quoteAmount}
            </div>
          </div>
        </div>

        <button
          disabled={!amount || parseFloat(amount) <= 0 || !quote || loading}
          onClick={executeSwap}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold py-3 rounded-full hover:from-green-600 hover:to-green-700 transition disabled:opacity-50"
        >
          {loading
            ? toToken === 'LBXO'
              ? 'Comprando LBXO...'
              : 'Vendendo LBXO...'
            : 'Executar Swap'}
        </button>
      </div>
    </>
  );
}

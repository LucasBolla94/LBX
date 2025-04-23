'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const LBX_MINT = 'LBX3EEwzxu2mbj7n5Mm3rjXoA4dQbaNX6YnQXPV6CAe';

type QuoteResponse = {
  outAmount: string;
  // Você pode adicionar mais campos conforme necessidade
};

export default function SwapForm() {
  const [fromToken, setFromToken] = useState<'USDC' | 'LBX'>('USDC');
  const [toToken, setToToken] = useState<'LBX' | 'USDC'>('LBX');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<string>('0.00');
  const [loading, setLoading] = useState(false);
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const inputMint = fromToken === 'USDC' ? USDC_MINT : LBX_MINT;
  const outputMint = toToken === 'LBX' ? LBX_MINT : USDC_MINT;

  const fetchQuote = useCallback(async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    try {
      setLoading(true);
      const rawAmount = Math.floor(Number(amount) * 10 ** 6); // Assume USDC ou LBX com 6 decimais
      const url = `https://lite-api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${rawAmount}&slippageBps=50&restrictIntermediateTokens=true`;
      const response = await fetch(url);
      const data = await response.json();

      const decimals = toToken === 'LBX' ? 9 : 6;
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
    const f = fromToken;
    setFromToken(toToken);
    setToToken(f);
    setAmount('');
    setQuote(null);
    setQuoteAmount('0.00');
  };

  const executeSwap = async () => {
    if (!publicKey || !signTransaction) return alert('Conecte uma carteira compatível com signTransaction.');
    if (!amount || Number(amount) <= 0) return alert('Insira um valor válido.');

    try {
      setLoading(true);
      await fetchQuote(); // Atualiza cotação

      if (!quote) return alert('Falha ao gerar a cotação atualizada.');

      const response = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
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
        alert(`✅ Swap realizado com sucesso!\n🔗 https://solscan.io/tx/${txid}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao executar swap:', error);
        alert(error.message || 'Erro inesperado ao executar swap.');
      } else {
        console.error('Erro desconhecido ao executar swap:', error);
        alert('Erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Swap de Tokens</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">De</label>
        <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-xl">
          <span className="font-bold text-gray-800 mr-auto">{fromToken}</span>
          <input
            type="number"
            placeholder="0.00"
            className="bg-transparent text-right w-32 text-gray-900 text-2xl font-semibold focus:outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex justify-center my-4">
        <button
          onClick={handleSwap}
          className="text-gray-500 hover:text-gray-800 transition"
          disabled={loading}
        >
          🔁 Inverter
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">Para</label>
        <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-xl">
          <span className="font-bold text-gray-800">{toToken}</span>
          <div className="text-right w-32 text-gray-900 text-2xl font-semibold">
            {loading ? '...' : quoteAmount}
          </div>
        </div>
      </div>

      <button
        disabled={!amount || parseFloat(amount) <= 0 || !quote || loading}
        onClick={executeSwap}
        className="w-full bg-green-600 text-white text-lg font-semibold py-3 rounded-full hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? 'Processando...' : 'Executar Swap'}
      </button>
    </div>
  );
}

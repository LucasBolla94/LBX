'use client';

import React, { useEffect, useState } from 'react';

const LBX_MINT = 'CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export default function PriceLbx() {
  const [price, setPrice] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const fetchPrice = async () => {
    try {
      const amount = 1 * 10 ** 9;
      const url = `https://lite-api.jup.ag/swap/v1/quote?inputMint=${LBX_MINT}&outputMint=${USDC_MINT}&amount=${amount}&slippageBps=50`;
      const res = await fetch(url);

      if (!res.ok) {
        console.error('Erro na resposta da API:', await res.text());
        setError(true);
        return;
      }

      const data = await res.json();
      const usdcValue = Number(data.outAmount) / 10 ** 6;

      setPrice(usdcValue);
      setTimestamp(new Date().toLocaleTimeString());
      setError(false);
    } catch (err) {
      console.error('Erro ao buscar preço do LBX:', err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-100 py-6 px-4 md:px-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 max-w-3xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
        {/* Ícone + Token */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl shadow-inner">
            💰
          </div>
          <div>
            <p className="text-sm text-gray-500">Preço Atual</p>
            <p className="font-semibold text-lg text-gray-800">1 LBX One</p>
          </div>
        </div>

        {/* Valor */}
        <div className="flex flex-col items-end">
          {error ? (
            <p className="text-red-600 font-semibold text-base">Erro ao carregar</p>
          ) : price !== null ? (
            <p className="text-3xl font-bold text-green-600 tracking-tight">
              ${price.toFixed(4)}
            </p>
          ) : (
            <p className="text-base text-gray-400 italic">Carregando...</p>
          )}
          {timestamp && !error && (
            <p className="text-xs text-gray-400 mt-1">Atualizado às {timestamp}</p>
          )}
        </div>
      </div>
    </section>
  );
}

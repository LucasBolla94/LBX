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
    <section className="w-full px-4 sm:px-6 lg:px-20 py-8 bg-[var(--background)]">
      <div className="w-full max-w-3xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-md px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* Ícone + Token */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--border)] flex items-center justify-center text-[var(--foreground)] text-2xl shadow-inner">
            💰
          </div>
          <div>
            <p className="font-semibold text-lg sm:text-xl text-[var(--foreground)]">$LBXO</p>
          </div>
        </div>

        {/* Valor */}
        <div className="flex flex-col items-center sm:items-end">
          {error ? (
            <p className="text-[var(--foreground)] font-semibold text-base sm:text-lg">Error</p>
          ) : price !== null ? (
            <p className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-widest">
              ${price.toFixed(6)}
            </p>
          ) : (
            <p className="text-base sm:text-lg text-[var(--foreground)]/70 italic">Loading...</p>
          )}
          {timestamp && !error && (
            <p className="text-xs sm:text-sm text-[var(--foreground)]/60 mt-1">
              Update at {timestamp}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

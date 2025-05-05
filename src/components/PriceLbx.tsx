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
        console.error('API error:', await res.text());
        setError(true);
        return;
      }

      const data = await res.json();
      const usdcValue = Number(data.outAmount) / 10 ** 6;

      setPrice(usdcValue);
      setTimestamp(new Date().toLocaleTimeString());
      setError(false);
    } catch (err) {
      console.error('Failed to fetch LBXO price:', err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 py-10 bg-[var(--background)]">
      <div className="max-w-3xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-md p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10 transition-all">
        
        {/* Left: Token Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--border)] flex items-center justify-center text-2xl shadow-inner">
            💰
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">$LBXO Token</h2>
            <p className="text-sm text-[var(--foreground)]/70 leading-tight">
              Current real-time price based on the Jupiter DEX aggregator
            </p>
          </div>
        </div>

        {/* Right: Price Info */}
        <div className="text-center sm:text-right">
          {error ? (
            <p className="text-[var(--foreground)] text-lg font-medium">Error loading price</p>
          ) : price !== null ? (
            <>
              <p className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-wide">
                ${price.toFixed(6)}
              </p>
              <p className="text-xs text-[var(--foreground)]/60 mt-1">
                Updated at {timestamp}
              </p>
            </>
          ) : (
            <p className="text-base text-[var(--foreground)]/70 italic animate-pulse">Loading...</p>
          )}
        </div>
      </div>

      {/* Info note below */}
      <p className="mt-4 text-center text-xs text-[var(--foreground)]/50">
        The price shown updates automatically every 30 seconds based on real market quotes.
      </p>
    </section>
  );
}

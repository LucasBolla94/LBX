'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const WALLET_ADDRESS = 'CLobMTimtY5ExtHTqk1fJkZ1xCUpgLWWYFFMmWoLRGKe';
const MINT_USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a';

export default function ReservUSDC() {
  const minReserve = 1_000;
  const maxReserve = 100_000;

  const [reserve, setReserve] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReserve = async () => {
      try {
        const response = await fetch(RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByOwner',
            params: [WALLET_ADDRESS, { mint: MINT_USDC }, { encoding: 'jsonParsed' }],
          }),
        });

        const json = await response.json();
        const accounts = json.result?.value;

        if (accounts?.length > 0) {
          const amount = accounts[0].account.data.parsed.info.tokenAmount.uiAmount;
          setReserve(amount);
        } else {
          setReserve(0);
        }
      } catch (err) {
        console.error('Failed to fetch USDC reserve:', err);
        setReserve(0);
      } finally {
        setLoading(false);
      }
    };

    fetchReserve();
  }, []);

  const percentage = Math.min((reserve / maxReserve) * 100, 100);
  const minMarkPercent = (minReserve / maxReserve) * 100;
  const clampedLeft = Math.min(Math.max(minMarkPercent, 5), 95);

  const formattedReserve = Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(reserve);

  return (
    <section className="w-full px-4 sm:px-6 py-10">
      <div className="max-w-3xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-3xl shadow-lg p-6 sm:p-10">
        <div className="flex flex-col items-center gap-3">
          <Image src="/usdc.png" alt="USDC Logo" width={40} height={40} />
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--foreground)]">
            💰 USDC Reserve Monitoring
          </h2>
          <p className="text-sm sm:text-base text-center text-[var(--foreground)]/70 mt-1">
            This reserve is used as a safety net for operations, emergencies, or strategic actions voted by the community.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-xs sm:text-sm font-medium text-[var(--foreground)] mb-2 px-1">
            <span>$0</span>
            <span>Target: $100K</span>
          </div>

          <div className="relative w-full h-8 bg-[var(--border)]/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-700 ease-in-out rounded-l-full"
              style={{ width: `${percentage}%` }}
            />

            {/* Minimum Mark */}
            <div
              className="absolute top-0 h-full flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold z-10"
              style={{ left: `${clampedLeft}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-[2px] h-6 bg-yellow-400" />
              <div className="mt-1 text-yellow-400 bg-[var(--background)] px-1 rounded-sm whitespace-nowrap">
                Min: $1K
              </div>
            </div>
          </div>
        </div>

        {/* Reserve Value */}
        <div className="flex flex-col items-center justify-center mt-6">
          <p className="text-sm sm:text-base font-medium text-[var(--foreground)]/80 mb-1">
            Current USDC Reserve:
          </p>
          <p className="text-3xl sm:text-4xl font-bold font-mono text-[var(--foreground)] tracking-wide">
            {loading ? 'Loading...' : `$${formattedReserve} USDC`}
          </p>
          <p className="text-xs text-[var(--foreground)]/60 mt-2 text-center">
            This amount is visible on-chain and actively monitored by the LBX Group.
          </p>
        </div>
      </div>
    </section>
  );
}

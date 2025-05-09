'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// ✅ CONFIGURAÇÕES FÁCEIS DE AJUSTAR
const MIN_RESERVE_SOL = 10;     // 🔧 Altere aqui o mínimo
const MAX_RESERVE_SOL = 1000;   // 🔧 Altere aqui o máximo

const WALLET_ADDRESS = 'CLobMTimtY5ExtHTqk1fJkZ1xCUpgLWWYFFMmWoLRGKe';
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a';

export default function ReservSol() {
  const [solAvailable, setSolAvailable] = useState<number>(0);
  const [solStaked, setSolStaked] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSolReserve = async () => {
      try {
        // Get available SOL
        const balanceRes = await fetch(RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getBalance',
            params: [WALLET_ADDRESS],
          }),
        });

        const balanceJson = await balanceRes.json();
        const solBalance = balanceJson.result?.value ?? 0;
        setSolAvailable(solBalance / 1e9); // lamports → SOL

        // Get staked SOL
        const stakeRes = await fetch(RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getProgramAccounts',
            params: [
              'Stake11111111111111111111111111111111111111',
              {
                encoding: 'jsonParsed',
                filters: [
                  {
                    memcmp: {
                      offset: 12,
                      bytes: WALLET_ADDRESS,
                    },
                  },
                ],
              },
            ],
          }),
        });

        const stakeJson = await stakeRes.json();
        const accounts = stakeJson.result ?? [];

        let totalStaked = 0;
        for (const acc of accounts) {
          const stake = acc.account.data.parsed.info.stake?.delegation?.stake;
          if (stake) totalStaked += stake;
        }

        setSolStaked(totalStaked / 1e9); // lamports → SOL
      } catch (err) {
        console.error('Failed to fetch SOL reserve:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSolReserve();
  }, []);

  const total = solAvailable + solStaked;
  const percentage = Math.min((total / MAX_RESERVE_SOL) * 100, 100);
  const minMarkPercent = (MIN_RESERVE_SOL / MAX_RESERVE_SOL) * 100;
  const clampedLeft = Math.min(Math.max(minMarkPercent, 5), 95);

  const format = (n: number) =>
    Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <section className="w-full px-4 sm:px-6 py-10">
      <div className="max-w-3xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-3xl shadow-lg p-6 sm:p-10">
        <div className="flex flex-col items-center gap-3">
          <Image src="/sol.png" alt="SOL Logo" width={40} height={40} />
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--foreground)]">
            ⚡ SOL Reserve Monitoring
          </h2>
          <p className="text-sm sm:text-base text-center text-[var(--foreground)]/70 mt-1">
            This SOL reserve includes both available balance and native stake delegated on-chain.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-xs sm:text-sm font-medium text-[var(--foreground)] mb-2 px-1">
            <span>0 SOL</span>
            <span>Target: {MAX_RESERVE_SOL.toLocaleString()} SOL</span>
          </div>

          <div className="relative w-full h-8 bg-[var(--border)]/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-700 ease-in-out rounded-l-full"
              style={{ width: `${percentage}%` }}
            />

            {/* Minimum Mark */}
            <div
              className="absolute top-0 h-full flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold z-10"
              style={{ left: `${clampedLeft}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-[2px] h-6 bg-yellow-400" />
              <div className="mt-1 text-yellow-400 bg-[var(--background)] px-1 rounded-sm whitespace-nowrap">
                Min: {MIN_RESERVE_SOL} SOL
              </div>
            </div>
          </div>
        </div>

        {/* Reserve Values */}
        <div className="flex flex-col items-center justify-center mt-6 gap-2">
          <p className="text-sm font-medium text-[var(--foreground)]/80">Available Balance:</p>
          <p className="text-xl font-mono font-bold text-[var(--foreground)]">
            {loading ? 'Loading...' : `${format(solAvailable)} SOL`}
          </p>

          <p className="text-sm font-medium text-[var(--foreground)]/80 mt-4">Staked Balance:</p>
          <p className="text-xl font-mono font-bold text-[var(--foreground)]">
            {loading ? 'Loading...' : `${format(solStaked)} SOL`}
          </p>

          <p className="text-sm font-medium text-[var(--foreground)]/80 mt-4">Total Reserve:</p>
          <p className="text-3xl sm:text-4xl font-bold font-mono text-[var(--foreground)] tracking-wide">
            {loading ? 'Loading...' : `${format(total)} SOL`}
          </p>

          <p className="text-xs text-[var(--foreground)]/60 mt-2 text-center">
            Both available and staked SOL are tracked and visible on-chain for full transparency.
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const WALLET_ADDRESS = "5ArPQSA9vM7sukJzsFdkEnUzG5NALCDDcEm6Li5VoZRS";
const MINT_USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // Token USDC na Solana
const RPC = "https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a";

export default function ReservUSDC() {
  const minReserve = 1_000;
  const maxReserve = 100_000;

  const [reserve, setReserve] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReserve = async () => {
      try {
        const response = await fetch(RPC, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getTokenAccountsByOwner",
            params: [
              WALLET_ADDRESS,
              { mint: MINT_USDC },
              { encoding: "jsonParsed" },
            ],
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
        console.error("Failed to fetch USDC reserve:", err);
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

  const formattedReserve = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(reserve);

  return (
    <div className="w-full max-w-2xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 shadow-md mt-12">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--foreground)] mb-6 flex items-center justify-center gap-2">
        <span className="text-yellow-400">💰</span> USDC Reserve Status
      </h2>

      {/* Scale */}
      <div className="flex justify-between text-xs sm:text-sm text-[var(--foreground)] font-medium mb-2 px-1">
        <span>$0</span>
        <span>$100K USDC</span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-8 bg-[var(--border)]/30 rounded-full overflow-hidden">
        {/* Filled portion */}
        <div
          className="h-full bg-purple-600 animate-pulse transition-all duration-700 ease-in-out rounded-l-full"
          style={{ width: `${percentage}%` }}
        ></div>

        {/* Min. required marker with safe bounds */}
        <div
          className="absolute top-0 h-full flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold z-10"
          style={{ left: `${clampedLeft}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-[2px] h-6 bg-yellow-400" />
          <div className="mt-1 text-yellow-400 bg-[var(--background)] px-1 rounded-sm whitespace-nowrap">
            Min: $1K
          </div>
        </div>
      </div>

      {/* Total reserve info */}
      <div className="flex flex-col items-center justify-center mt-6">
        <Image
          src="/usdc.png"
          alt="USDC Logo"
          width={36}
          height={36}
          className="mb-2"
        />
        <p className="text-sm sm:text-base font-semibold text-[var(--foreground)]">
          Total Reserve:{" "}
          <span className="font-mono">
            {loading ? "Loading..." : `$${formattedReserve} USDC`}
          </span>
        </p>
      </div>
    </div>
  );
}

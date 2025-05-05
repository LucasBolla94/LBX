"use client";

import { useState } from "react";

export default function HoldersRewards() {
  const [amount, setAmount] = useState<number>(0);
  const [rewardToken, setRewardToken] = useState<"LBXO" | "USDC" | "SOL">("LBXO");

  // Taxas anuais por token
  const annualYields: Record<"LBXO" | "USDC" | "SOL", number> = {
    LBXO: 1.0,
    USDC: 0.13,
    SOL: 0.06,
  };

  // Controle de ativação por token
  const enabledRewards: Record<"LBXO" | "USDC" | "SOL", boolean> = {
    LBXO: true,
    USDC: false,
    SOL: false, // Exemplo: desativado
  };

  const annualYield = annualYields[rewardToken];
  const isEnabled = enabledRewards[rewardToken];

  const dailyRate = annualYield / 365;
  const dailyEarnings = isEnabled ? amount * dailyRate : 0;

  const formattedEarnings =
    rewardToken === "USDC"
      ? dailyEarnings.toFixed(6)
      : dailyEarnings.toFixed(9);

  return (
    <div className="w-full max-w-md mx-auto mt-12 bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--foreground)] mb-6">
        🎁 Stake Rewards Estimator
      </h2>

      {/* Input - $LBXO */}
      <div className="bg-[var(--border)]/10 p-4 rounded-lg mb-6">
        <label className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
          $LBXO (Staked)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter LBXO amount"
          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--foreground)]"
        />
      </div>

      {/* Token Selector - Rewards */}
      <div className="bg-[var(--border)]/10 p-4 rounded-lg mb-6">
        <label className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
          Rewards
        </label>
        <select
          value={rewardToken}
          onChange={(e) => setRewardToken(e.target.value as "LBXO" | "USDC" | "SOL")}
          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--foreground)]"
        >
          <option value="LBXO">LBXO</option>
          <option value="USDC">USDC</option>
          <option value="SOL">SOL</option>
        </select>
      </div>

      {/* Resultado */}
      <div className="bg-[var(--border)]/10 p-4 rounded-lg border border-[var(--border)]">
        {isEnabled ? (
          <>
            <p className="text-center text-sm text-[var(--foreground)] mb-1">
              Estimated daily return:
            </p>
            <p className="text-center text-lg font-bold text-[var(--foreground)]">
              {formattedEarnings} {rewardToken}
            </p>
            <p className="text-xs text-center text-[var(--foreground)]/60 mt-2">
              Based on an annual yield of {(annualYield * 100).toFixed(2)}%.
            </p>
          </>
        ) : (
          <p className="text-center text-sm font-medium text-red-500">
            Staking unavailable at the moment
          </p>
        )}
      </div>
    </div>
  );
}

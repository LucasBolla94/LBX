"use client";

import { useState } from "react";

// 🎯 Tabela de Recompensas Progressivas (pode ser facilmente alterada)
export const rewardRanges = [
  { min: 1, max: 99, multiplier: 50 },
  { min: 100, max: 499, multiplier: 100 },
  { min: 500, max: Infinity, multiplier: 200 },
];

export default function PromoCalculator() {
  const [referrals, setReferrals] = useState<number>(0);

  // Cálculo progressivo: aplica faixas corretamente
  const getProgressiveReferralReward = (count: number): number => {
    let remaining = count;
    let total = 0;

    for (const range of rewardRanges) {
      if (remaining <= 0) break;

      const rangeSize =
        range.max === Infinity ? remaining : Math.min(remaining, range.max - range.min + 1);

      if (referrals >= range.min) {
        total += rangeSize * range.multiplier;
        remaining -= rangeSize;
      }
    }

    return total;
  };

  const referralReward = getProgressiveReferralReward(referrals);

  return (
    <div className="w-full max-w-md mx-auto mt-12 bg-[var(--background)] border border-[var(--border)] rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--foreground)] mb-4">
        🧮 Invite Reward Calculator
      </h2>

      <p className="text-sm sm:text-base text-center text-[var(--foreground)]/80 mb-6">
        Want to know how much <strong>$LBXO</strong> you’ll earn by inviting friends?
        Enter how many people will use your referral link below, and we’ll calculate it for you.
      </p>

      <div className="bg-[var(--border)]/10 p-4 rounded-lg border border-[var(--border)] mb-6 text-sm text-[var(--foreground)]">
        <p className="font-semibold mb-2">📊 How the rewards work:</p>
        <ul className="list-disc list-inside space-y-1">
          {rewardRanges.map((range, index) => (
            <li key={index}>
              {range.min} {range.max !== Infinity ? `to ${range.max}` : "+"} referrals →{" "}
              <strong>{range.multiplier} $LBXO</strong> <em>per person</em>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[var(--foreground)]/70">
          Rewards are calculated progressively. Example: if you invite 105 people,
          the first 99 are paid at 50 LBXO each, and the next 6 at 100 LBXO each.
        </p>
      </div>

      {/* Campo para entrada de quantidade de convites */}
      <div className="bg-[var(--border)]/10 p-4 rounded-lg mb-4">
        <label className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
          👥 How many people will use your link?
        </label>
        <input
          type="number"
          min={0}
          value={referrals}
          onChange={(e) => setReferrals(Number(e.target.value))}
          placeholder="Enter number of invited users"
          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--foreground)]"
        />
      </div>

      {/* Resultado visível */}
      {referrals > 0 && (
        <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg p-4 text-center">
          <p className="text-sm">Your estimated reward:</p>
          <p className="text-2xl font-bold my-1">
            {referralReward.toLocaleString()} $LBXO
          </p>
          <p className="text-xs text-green-700">
            Based on a progressive calculation using the reward tiers.
          </p>
        </div>
      )}
    </div>
  );
}

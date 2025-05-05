"use client";

import { FaWallet, FaArrowUp, FaUsers, FaCoins } from "react-icons/fa";
import { MdOutlineInsights } from "react-icons/md";

export default function RevenueDistribution() {
  return (
    <section className="w-full px-4 mt-12">
      <div className="max-w-4xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-lg p-6 sm:p-10 text-[var(--foreground)]">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <MdOutlineInsights className="text-xl sm:text-2xl" />
          Revenue Distribution – LBX Group
        </h2>

        {/* Intro */}
        <p className="text-base sm:text-lg leading-relaxed text-center mb-10 max-w-3xl mx-auto">
          Every month, revenue generated from the group&apos;s main wallet is split into two key paths: 
          <strong> reinvestment</strong> for growth and <strong>rewards</strong> for $LBXO holders.
        </p>

        {/* Two Columns */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10">
          {/* Reinvestment */}
          <div className="flex-1 bg-[var(--border)]/10 border border-[var(--border)] rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FaArrowUp className="text-purple-600 text-lg" />
              <h3 className="text-lg sm:text-xl font-semibold">50% Reinvested in the Fund</h3>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              Half of all monthly revenue is reinvested into the group&apos;s treasury to:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm sm:text-base">
              <li>Boost passive income strategies</li>
              <li>Reinforce liquidity positions</li>
              <li>Secure long-term sustainability</li>
            </ul>
          </div>

          {/* Holder Distribution */}
          <div className="flex-1 bg-[var(--border)]/10 border border-[var(--border)] rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FaUsers className="text-yellow-500 text-lg" />
              <h3 className="text-lg sm:text-xl font-semibold">50% Distributed to Holders</h3>
            </div>
            <p className="text-sm sm:text-base leading-relaxed">
              The other half is distributed to $LBXO holders through:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm sm:text-base">
              <li>Staking programs <FaCoins className="inline ml-1 text-yellow-400" /></li>
              <li>Token appreciation support</li>
              <li>Community farming & incentives</li>
              <li>Voting-based initiatives</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <p className="text-base sm:text-lg leading-relaxed text-center max-w-3xl mx-auto mt-2">
          <FaWallet className="inline mb-1 mr-1 text-sm" />
          All decisions about rewards are made through <strong>community voting</strong> inside our Dashboard. 
          Transparency and shared governance are fundamental to our growth model.
        </p>
      </div>
    </section>
  );
}

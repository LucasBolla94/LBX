"use client";

import Image from "next/image";
import { FaBalanceScale, FaBullhorn, FaChartPie } from "react-icons/fa";

export default function VoteExplain() {
  return (
    <section className="w-full px-4 mt-12">
      <div className="max-w-4xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-lg p-6 sm:p-10 text-[var(--foreground)]">
        
        {/* Title with token image */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center text-center mb-8">
          <Image
            src="/shield.png"
            alt="LBXO Token"
            width={48}
            height={48}
            className="rounded-full"
          />
          <h2 className="text-2xl sm:text-3xl font-bold">
            Governance Voting – LBXO Holders
          </h2>
        </div>

        {/* Section 1 – How it works */}
        <div className="mb-10">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
            <FaBalanceScale className="text-purple-500" />
            How Voting Works
          </h3>
          <p className="text-base leading-relaxed">
            The LBX Group creates voting proposals (called “vote pools”) related to strategic decisions, 
            community rewards, or ecosystem improvements.
            These proposals are carefully prepared by the leadership team and then made available to $LBXO holders through our official Dashboard.
          </p>
        </div>

        {/* Section 2 – Vote Weight */}
        <div className="mb-10">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
            <FaChartPie className="text-blue-500" />
            Weighted Voting Based on Your $LBXO Balance
          </h3>
          <p className="text-base leading-relaxed">
            Your voting power is based on the amount of $LBXO you hold in your wallet, 
            relative to the total circulating supply. The more tokens you hold, the greater your influence.
          </p>

          <div className="mt-4 bg-[var(--border)]/10 border border-[var(--border)] rounded-lg p-4 text-sm sm:text-base leading-relaxed">
            <strong>Example:</strong>  
            <br />
            Total supply in circulation: <strong>50,000,000 LBXO</strong><br />
            Your wallet: <strong>5,000,000 LBXO</strong><br />
            <span className="text-green-500 font-semibold">→ Your vote carries 10% of the total decision weight</span>
          </div>
        </div>

        {/* Section 3 – Communication & Transparency */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
            <FaBullhorn className="text-yellow-500" />
            Transparent Communication
          </h3>
          <p className="text-base leading-relaxed">
            All voting events are announced in advance through our official communication channels. 
            Our goal is full transparency, allowing every holder to stay informed and engaged.
          </p>
        </div>
      </div>
    </section>
  );
}

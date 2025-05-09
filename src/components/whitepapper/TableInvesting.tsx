"use client";

import { useState } from "react";
import {
  FaLock,
  FaWater,
  FaRocket,
  FaExchangeAlt,
  FaRecycle,
  FaWallet,
  /*FaSearchDollar,*/
} from "react-icons/fa";

export default function TableInvesting() {
 /* const walletAddress = "CLobMTimtY5ExtHTqk1fJkZ1xCUpgLWWYFFMmWoLRGKe";
  const portfolioLink = `https://portfolio.jup.ag/portfolio/${walletAddress}`;*/

  const rows = [
    {
      icon: <FaLock className="text-purple-600" />,
      category: "Native Stake (SOL)",
      percent: "20%",
      description: "Secured staking of native SOL to support the network and earn stable rewards.",
    },
    {
      icon: <FaWater className="text-blue-500" />,
      category: "Marinade (mSOL)",
      percent: "20%",
      description: "Delegated SOL staking via Marinade to maximize returns and decentralization.",
    },
    {
      icon: <FaRocket className="text-orange-500" />,
      category: "JitoSOL",
      percent: "20%",
      description: "Liquid staking through Jito to capture MEV rewards and maintain flexibility.",
    },
    {
      icon: <FaExchangeAlt className="text-teal-500" />,
      category: "Liquidity Pools",
      percent: "20%",
      description: "Providing liquidity in DEXs to generate yield and strengthen token presence.",
    },
    {
      icon: <FaRecycle className="text-green-600" />,
      category: "LBXO Buyback",
      percent: "10%",
      description: "Tokens are periodically repurchased to support price and reduce circulation.",
    },
    {
      icon: <FaWallet className="text-yellow-500" />,
      category: "USDC Reserve",
      percent: "10%",
      description: "Stable reserve held in USDC to handle unexpected events or opportunities.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="w-full px-4 mt-10">
      {/* Wallet Info 
      <div className="max-w-3xl mx-auto mb-8 bg-[var(--background)] border border-[var(--border)] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-sm sm:text-base text-[var(--foreground)] font-medium break-all">
          <span className="block sm:inline font-semibold">LBX Group Wallet:</span>{" "}
          <span className="font-mono">{walletAddress}</span>
        </div>
        <a
          href={portfolioLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-md bg-[var(--border)] text-[var(--foreground)] text-sm font-semibold hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors flex items-center gap-2"
        >
          <FaSearchDollar /> View Portfolio
        </a>
      </div>*/}

      {/* Title & Description */}
      <div className="max-w-3xl mx-auto text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          LBX Group Capital Allocation
        </h1>
        <p className="text-base sm:text-lg leading-relaxed text-[var(--foreground)]">
          Funds received from NFT sales, donations, and external investments are allocated strategically to ensure security, diversification, and sustainable growth.
        </p>
      </div>

      {/* Table */}
      <div className="max-w-3xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-xl overflow-hidden shadow">
        {rows.map((row, idx) => {
          const isActive = activeIndex === idx;

          return (
            <div
              key={idx}
              className={`transition-all duration-300 border-b last:border-none border-[var(--border)] cursor-pointer ${
                isActive ? "bg-[var(--border)]/10" : "hover:bg-[var(--border)]/5"
              }`}
              onClick={() => setActiveIndex(isActive ? null : idx)}
            >
              <div className="flex justify-between items-center px-4 py-4 sm:py-5">
                <div className="flex items-center gap-2 text-sm sm:text-base font-medium">
                  {row.icon}
                  {row.category}
                </div>
                <span className="text-sm sm:text-base font-semibold text-right">{row.percent}</span>
              </div>
              {isActive && (
                <div className="px-4 pb-4 text-sm sm:text-base text-[var(--foreground)] leading-relaxed">
                  {row.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

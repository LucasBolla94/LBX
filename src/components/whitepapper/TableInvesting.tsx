"use client";

import { useState } from "react";

export default function TableInvesting() {
  const rows = [
    { category: "Stake Nativo (SOL)", percent: "20%" },
    { category: "MSOL (Marinade)", percent: "20%" },
    { category: "JitoSOL", percent: "20%" },
    { category: "Pool de Liquidez", percent: "20%" },
    { category: "Recompra de LBXO", percent: "10%" },
    { category: "Reserva em USDC", percent: "10%" },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const walletAddress = "5ArPQSA9vM7sukJzsFdkEnUzG5NALCDDcEm6Li5VoZRS";
  const portfolioLink = `https://portfolio.jup.ag/portfolio/${walletAddress}`;

  return (
    <div className="w-full overflow-x-auto mt-6">
      {/* Wallet container */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border border-[var(--border)] bg-[var(--background)] rounded-lg p-4 shadow-sm">
          <div className="text-sm sm:text-base text-[var(--foreground)] break-all font-medium">
            <span className="block sm:inline">LBX Group Wallet:</span>{" "}
            <span className="font-mono text-sm block sm:inline">
              {walletAddress}
            </span>
          </div>
          <a
            href={portfolioLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md bg-[var(--border)] text-[var(--foreground)] text-sm font-semibold hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
          >
            View Portfolio
          </a>
        </div>
      </div>

      {/* Section Title + Description */}
      <div className="max-w-2xl mx-auto text-center mb-6 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          📊 Capital Allocation – LBX Group
        </h1>
        <p className="text-base leading-relaxed text-[var(--foreground)]">
          Every contribution received by the project wallet (NFT sales, donations, or external capital)
          is allocated using the following strategy to ensure security, diversification, and long-term growth:
        </p>
      </div>

      {/* Allocation Table */}
      <div className="inline-block min-w-full max-w-2xl mx-auto align-middle border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="min-w-full text-[var(--foreground)] text-sm sm:text-base">
          <thead className="bg-[var(--background)]">
            <tr>
              <th className="text-left px-4 py-3 border-b border-[var(--border)] font-semibold">
                Category
              </th>
              <th className="text-left px-4 py-3 border-b border-[var(--border)] font-semibold">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isActive = activeIndex === idx;
              return (
                <tr
                  key={idx}
                  className={`border-b border-[var(--border)] transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[var(--border)]/20"
                      : "hover:bg-[var(--border)]/10"
                  }`}
                  onClick={() => setActiveIndex(isActive ? null : idx)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">{row.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.percent}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

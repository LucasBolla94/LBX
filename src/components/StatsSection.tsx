'use client';

import React from 'react';
import Holders from './Holders';
import Supply from './Supply';
import { FaChartPie, FaLock, FaLeaf, FaUsers } from 'react-icons/fa';

export default function StatsSection() {
  return (
    <section className="bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-20">
      <div className="max-w-5xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-3xl shadow-lg p-6 sm:p-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-[var(--foreground)]">
        
        {/* Total Supply */}
        <div className="flex flex-col items-center">
          <FaChartPie className="text-2xl sm:text-3xl mb-2 text-purple-500" />
          <Supply />
          <p className="text-sm text-[var(--foreground)]/70">Total Supply</p>
        </div>

        {/* Stake */}
        <div className="flex flex-col items-center">
          <FaLeaf className="text-2xl sm:text-3xl mb-2 text-green-500" />
          <p className="font-bold text-lg sm:text-xl">Available</p>
          <p className="text-sm text-[var(--foreground)]/70">Staking Program</p>
        </div>

        {/* Holders */}
        <div className="flex flex-col items-center">
          <FaUsers className="text-2xl sm:text-3xl mb-2 text-yellow-500" />
          <Holders />
          <p className="text-sm text-[var(--foreground)]/70">Current Holders</p>
        </div>

        {/* Farm */}
        <div className="flex flex-col items-center">
          <FaLock className="text-2xl sm:text-3xl mb-2 text-red-500" />
          <p className="font-bold text-lg sm:text-xl">Unavailable</p>
          <p className="text-sm text-[var(--foreground)]/70">Farming Locked</p>
        </div>
      </div>
    </section>
  );
}

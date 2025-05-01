'use client';

import React from 'react';

export default function IntroSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-20 py-10 sm:py-16 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] flex flex-col md:flex-row items-center justify-between max-w-screen-xl mx-auto">
      <div className="max-w-xl text-center md:text-left">
        <p className="uppercase text-sm sm:text-base tracking-widest text-green-400 font-semibold">
          Decentralized Finance
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4 leading-snug">
          Learn About LBXO and How You Can Grow With It
        </h1>
        <p className="text-base sm:text-lg mt-6 text-[var(--foreground)]/70 leading-relaxed">
          LBX Group converts USDC into long-term growth through staking and farm strategies. With fixed supply, locked liquidity, and full transparency, $LBXO holders receive passive income, governance power, and a stake in a real crypto-driven economy.
        </p>
        <div className="mt-8 flex justify-center md:justify-start">
          <a
            href="https://app.streamflow.finance/staking/solana/mainnet/E24fr7a6DySmvmnDiVfuNUGM1rBqHrXLMxdkHU8HuiSC"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition text-base sm:text-lg"
          >
            Stake
          </a>
        </div>
      </div>
    </section>
  );
}

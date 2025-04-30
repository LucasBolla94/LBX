'use client';

import React from 'react';

export default function IntroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)]">
      <div className="max-w-xl">
        <p className="uppercase text-sm tracking-widest text-green-400 font-semibold">
          Decentralized Finance
        </p>
        <h1 className="text-3xl md:text-3xl font-bold mt-4">
          Learn About LBXO and How You Can Grow With It
        </h1>
        <p className="text-lg mt-6 text-[var(--foreground)]/70">
        LBX Group converts USDC into long-term growth through staking and farm strategies. With fixed supply, locked liquidity, and full transparency, $LBXO holders receive passive income, governance power, and a stake in a real crypto-driven economy.
        </p>
        <div className="mt-8 flex gap-4">
          <a
            href="https://app.streamflow.finance/staking/solana/mainnet/E24fr7a6DySmvmnDiVfuNUGM1rBqHrXLMxdkHU8HuiSC"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
          >
            Stake
          </a>
        </div>
      </div>
    </section>
  );
}

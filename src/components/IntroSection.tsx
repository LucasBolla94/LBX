// /components/IntroSection.tsx
import React from 'react';

export default function IntroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-white">
      <div className="max-w-xl">
        <p className="uppercase text-sm tracking-widest text-green-700 font-semibold">Decentralized Finance</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
        LBXO: Scarce and Programmed to Generate Real Value.
        </h1>
        <p className="text-lg text-gray-700 mt-6">
        LBX Group transforms USDC into opportunities: generate yield, participate in decision-making, and enjoy real liquidity within a sustainable ecosystem.
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
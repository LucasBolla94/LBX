'use client';

import React from 'react';

export default function IntroSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-20 py-12 sm:py-20 bg-[var(--background)] border border-[var(--border)] rounded-3xl text-[var(--foreground)] max-w-7xl mx-auto shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Text Content */}
        <div className="max-w-2xl text-center md:text-left">
          <p className="uppercase text-sm sm:text-base tracking-widest text-green-500 font-semibold">
            Decentralized Finance
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mt-4">
            Grow Your Future With <span className="text-green-500">$LBXO</span>
          </h1>

          <p className="text-base sm:text-lg mt-6 text-[var(--foreground)]/70 leading-relaxed">
            LBX Group transforms stable assets like USDC into long-term growth using staking, farming, and liquidity strategies. With fixed supply, locked liquidity, and community governance, holders benefit from passive income and decentralized decision-making.
          </p>

          <div className="mt-8 flex justify-center md:justify-start">
            <a
              href="https://app.streamflow.finance/staking/solana/mainnet/E24fr7a6DySmvmnDiVfuNUGM1rBqHrXLMxdkHU8HuiSC"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition text-base sm:text-lg shadow-md"
            >
              🚀 Stake Now
            </a>
          </div>
        </div>

        {/* Optional: you can place an image or token icon on the right in future */}
        {/* <div className="w-full h-64 md:h-auto bg-gray-800 rounded-xl"></div> */}
        
      </div>
    </section>
  );
}

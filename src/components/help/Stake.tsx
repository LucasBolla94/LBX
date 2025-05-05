'use client';

import React from 'react';

export default function Stake() {
  return (
    <section className="w-full max-w-4xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-3xl shadow-md px-6 py-10 text-[var(--foreground)]">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">📈 What is Staking?</h2>

      <p className="text-base sm:text-lg leading-relaxed text-[var(--foreground)]/80 mb-6">
        Imagine staking like putting your money into a high-interest savings account. Instead of leaving your tokens idle in your wallet, you can lock them for a period and earn passive rewards — just like earning interest at a bank.
      </p>

      <p className="text-base sm:text-lg leading-relaxed text-[var(--foreground)]/80 mb-6">
        By staking your <strong>$LBXO</strong>, you help secure the network and contribute to the project’s stability. In return, you receive regular reward payouts. It’s a smart way to make your tokens work for you.
      </p>

      <p className="text-base sm:text-lg leading-relaxed text-[var(--foreground)]/80 mb-6">
        You can unstake whenever you want (depending on the pool rules), and you keep full control of your funds. It’s simple, safe, and rewarding — perfect even for beginners!
      </p>

      <div className="mt-8 text-center">
        <p className="text-base font-semibold text-[var(--foreground)] mb-2">🎥 Watch the video tutorial:</p>
        <div className="aspect-w-16 aspect-h-9 w-full max-w-2xl mx-auto">
          <iframe
            className="w-full h-64 sm:h-96 rounded-xl border border-[var(--border)]"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="What is Staking - LBXO Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

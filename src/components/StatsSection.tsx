'use client';

import React from 'react';
import Holders from './Holders'; // Importa o novo componente

export default function StatsSection() {
  return (
    <section className="bg-[var(--background)] py-12 px-6 md:px-20">
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-lg p-6 md:p-10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-[var(--foreground)]">
        <div>
          <p className="font-semibold text-lg text-[var(--foreground)]">50M. $LBXO</p>
          <p className="text-sm mt-1 text-[var(--foreground)]/70">Total Supply</p>
        </div>
        <div>
          <p className="font-semibold text-lg text-[var(--foreground)]">Available</p>
          <p className="text-sm mt-1 text-[var(--foreground)]/70">Stake</p>
        </div>
        <div>
          <Holders />
          <p className="text-sm mt-1 text-[var(--foreground)]/70">Holders</p>
        </div>
        <div>
          <p className="font-semibold text-lg text-[var(--foreground)]">Unavailable</p>
          <p className="text-sm mt-1 text-[var(--foreground)]/70">Farm</p>
        </div>
      </div>
    </section>
  );
}

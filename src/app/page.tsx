'use client';

import React from 'react';
import IntroSection from '@/components/IntroSection';
import StatsSection from '@/components/StatsSection';
import SwapForm from '@/components/SwapForm';
import PriceLbx from '@/components/PriceLbx';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Preço centralizado no topo */}
      <section className="w-full px-4 sm:px-6 lg:px-20 py-8 max-w-screen-xl mx-auto">
        <PriceLbx />
      </section>
  
      {/* Intro + Swap lado a lado no desktop, empilhados no mobile */}
      <section className="w-full px-4 sm:px-6 lg:px-20 py-10 sm:py-16 max-w-screen-xl mx-auto flex flex-col lg:flex-row lg:justify-between gap-10">
        <div className="w-full lg:w-1/2">
          <IntroSection />
        </div>
        <div className="w-full lg:w-1/2">
          <SwapForm />
        </div>
      </section>
  
      {/* Estatísticas abaixo */}
      <StatsSection />
    </div>
  );
}  
'use client';

import React from 'react';
import IntroSection from '@/components/IntroSection';
import StatsSection from '@/components/StatsSection';
import SwapForm from '@/components/SwapForm';
import PriceLbx from '@/components/PriceLbx';

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      {/* Seção combinada com Stake e Swap lado a lado */}
      <section className="flex flex-col md:flex-row items-center gap-10 px-4 md:px-20 py-16">
        <div className="md:w-1/2">
          <IntroSection />
        </div>
        <div className="md:w-1/2">
          <SwapForm />
        </div>
        <div>
          <PriceLbx />
        </div>
      </section>

      {/* Estatísticas do projeto */}
      <StatsSection />
    </div>
  );
}

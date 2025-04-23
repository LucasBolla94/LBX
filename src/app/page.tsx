'use client';

import React from 'react';
import IntroSection from '@/components/IntroSection';
import StatsSection from '@/components/StatsSection';
import SwapForm from '@/components/SwapForm';
import WalletButton from '@/components/WalletButton'; // aqui está o componente dinâmico seguro
import PriceLbx from '@/components/PriceLbx';

export default function Home() {
  return (
    <>
      {/* Seção combinada com Stake e Swap lado a lado */}
      <section className="flex flex-col md:flex-row gap-10 px-4 md:px-20 py-16 bg-white">
        <div className="md:w-1/2">
          <IntroSection />
        </div>
        <div className="md:w-1/2">
          <WalletButton />
          <SwapForm />
        </div>
        <div>
          <PriceLbx />
        </div>
      </section>

      {/* Estatísticas do projeto */}
      <StatsSection />
    </>
  );
}

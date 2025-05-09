'use client';

import IntroLbx from '@/components/whitepapper/IntroLbx';
import ReservExplain from '@/components/whitepapper/ReservExplain';
import ReservLbx from '@/components/whitepapper/ReservLbx';
import ReservUSDC from '@/components/whitepapper/ReservUsdc';
import TableInvesting from '@/components/whitepapper/TableInvesting';
import RevenueDistribution from '@/components/whitepapper/RevenueDistribution';
import VoteExplain from '@/components/whitepapper/VoteExplain';
import ReservSol from '@/components/whitepapper/ReservSol';

export default function WhitepaperPage() {
  return (
    <main className="w-full px-4 sm:px-6 py-12 text-[var(--foreground)] bg-[var(--background)]">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Introdução */}
        <section>
          <IntroLbx />
        </section>

        {/* Reservas */}
        <section className="space-y-8">
          <ReservExplain />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReservLbx />
            <ReservSol />
            <ReservUSDC />
          </div>
        </section>

        {/* Alocação de Capital */}
        <section>
          <TableInvesting />
        </section>

        {/* Distribuição de Rendimentos */}
        <section>
          <RevenueDistribution />
        </section>

        {/* Explicação sobre Votação */}
        <section>
          <VoteExplain />
        </section>
      </div>
    </main>
  );
}

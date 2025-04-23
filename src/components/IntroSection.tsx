// /components/IntroSection.tsx
import React from 'react';

export default function IntroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-white">
      <div className="max-w-xl">
        <p className="uppercase text-sm tracking-widest text-green-700 font-semibold">Financeiro Descentralizado</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
          Renda real com o token LBX
        </h1>
        <p className="text-lg text-gray-700 mt-6">
          O LBX Group transforma USDC em oportunidades: gere rendimento, participe de decisões e tenha liquidez real em um ecossistema sustentável.
        </p>
        <div className="mt-8 flex gap-4">
          <a
            href="https://app.streamflow.finance"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
          >
            Stakar LBX
          </a>
        </div>
      </div>
    </section>
  );
}
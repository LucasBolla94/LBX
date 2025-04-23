// /components/StatsSection.tsx
import React from 'react';

export default function StatsSection() {
  return (
    <section className="bg-gray-100 py-12 px-6 md:px-20">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <p className="text-green-600 font-semibold text-lg">30,000 LBX</p>
          <p className="text-sm text-gray-600 mt-1">Supply Inicial</p>
        </div>
        <div>
          <p className="text-green-600 font-semibold text-lg">10,000 LBX</p>
          <p className="text-sm text-gray-600 mt-1">Em Stake</p>
        </div>
        <div>
          <p className="text-green-600 font-semibold text-lg">128</p>
          <p className="text-sm text-gray-600 mt-1">Holders</p>
        </div>
        <div>
          <p className="text-green-600 font-semibold text-lg">300 USDC</p>
          <p className="text-sm text-gray-600 mt-1">Em Liquidez</p>
        </div>
      </div>
    </section>
  );
}

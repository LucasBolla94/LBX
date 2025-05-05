// src/app/airdrop/page.tsx

import AirDropAmount from "@/components/AirDropAmount";
import AirdropReg from "@/components/AirdropReg";
import PromoCalculator from "@/components/PromoCalculator";

export default function AirdropPage() {
  return (
    <main className="flex flex-col sm:flex-row justify-center sm:items-start items-center w-full min-h-screen bg-[var(--background)] p-6 gap-10">
      
      {/* Coluna da esquerda: Total acumulado + calculadora */}
      <div className="w-full max-w-md flex flex-col gap-6">
        <AirDropAmount />
        <PromoCalculator />
      </div>

      {/* Coluna da direita: Registro e link de referência */}
      <div className="w-full max-w-md">
        <AirdropReg />
      </div>

    </main>
  );
}

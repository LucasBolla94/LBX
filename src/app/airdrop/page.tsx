// src/app/airdrop/page.tsx

import AirDropAmount from "@/components/AirDropAmount";
import AirdropReg from "@/components/AirdropReg";

export default function AirdropPage() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-[var(--background)] p-4 gap-10">
      {/* Total acumulado com largura fixa */}
      <div className="w-full max-w-lg">
        <AirDropAmount />
      </div>

      {/* Form de registro/referral com largura fixa */}
      <div className="w-full max-w-lg">
        <AirdropReg />
      </div>
    </main>
  );
}

import Airdrop from "@/components/Airdrop";
import AirDropAmount from "@/components/AirDropAmount";

export default function AirdropPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 space-y-10">
      {/* Exibe o total de airdrop acumulado no topo */}
      <AirDropAmount />

      <Airdrop />
    </main>
  );
}

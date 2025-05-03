import TableInvesting from "@/components/whitepapper/TableInvesting";
import IntroLbx from "@/components/whitepapper/IntroLbx";
import ReservLbx from "@/components/ReservLbx";
import ReservUSDC from "@/components/ReservUsdc";
import HoldersRewards from "@/components/HoldersRewards";

export default function WhitepaperPage() {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 text-[var(--foreground)] bg-[var(--background)]">
      <IntroLbx />

      {/* Reserva entre a introdução e a alocação de capital */}
      <ReservLbx />
      <ReservUSDC />
      <TableInvesting />
      <HoldersRewards />

      {/* Placeholder for future components */}
      <div className="mt-12">
        {/* Example: <ProfitDistributionTable /> */}
      </div>
    </main>
  );
}

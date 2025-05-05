import TableInvesting from "@/components/whitepapper/TableInvesting";
import IntroLbx from "@/components/whitepapper/IntroLbx";
import ReservLbx from "@/components/whitepapper/ReservLbx";
import ReservUSDC from "@/components/whitepapper/ReservUsdc";
import ReservExplain from "@/components/whitepapper/ReservExplain";
import RevenueDistribution from "@/components/whitepapper/RevenueDistribution";
import VoteExplain from "@/components/whitepapper/VoteExplain";

export default function WhitepaperPage() {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 text-[var(--foreground)] bg-[var(--background)]">
      <IntroLbx />

      {/* Reserva entre a introdução e a alocação de capital */}
      <ReservExplain />
      <ReservLbx />
      <ReservUSDC />
      <TableInvesting />

      {/* Placeholder for future components */}
      <div className="mt-12">
        {/* Example: <ProfitDistributionTable /> */}
        <RevenueDistribution />
        <VoteExplain />
      </div>
    </main>
  );
}

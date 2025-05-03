import TableInvesting from "@/components/whitepapper/TableInvesting";
import IntroLbx from "@/components/whitepapper/IntroLbx";
import ReservLbx from "@/components/ReservLbx";
import ReservUSDC from "@/components/ReservUsdc";

export default function WhitepaperPage() {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 text-[var(--foreground)] bg-[var(--background)]">
      <IntroLbx />

      {/* Reserva entre a introdução e a alocação de capital */}
      <ReservLbx />
      <ReservUSDC />

      <h1 className="text-2xl sm:text-3xl font-bold text-center mt-16 mb-8">
        📊 Capital Allocation – LBX Group
      </h1>

      <p className="text-base leading-relaxed mb-4 text-center">
        Every contribution received by the project wallet (NFT sales, donations, or external capital)
        is allocated using the following strategy to ensure security, diversification, and long-term growth:
      </p>

      <TableInvesting />

      {/* Placeholder for future components */}
      <div className="mt-12">
        {/* Example: <ProfitDistributionTable /> */}
      </div>
    </main>
  );
}

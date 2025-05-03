"use client";

import Image from "next/image";

export default function IntroLbx() {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 bg-[var(--background)] text-[var(--foreground)] text-center rounded-lg shadow-md">
      {/* Logo with animation */}
      <div className="flex justify-center mb-6">
        <Image
          src="/logo.png"
          alt="LBX Group Logo"
          width={80}
          height={80}
          className="animate-pulse"
        />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold mb-4">Welcome to LBX Group</h2>

      <p className="text-base sm:text-lg leading-relaxed mb-4">
        LBX Group is a project built on the Solana network, focused on sustainable growth,
        passive income generation, and the appreciation of its token, <strong>$LBXO</strong>.
      </p>

      <p className="text-base sm:text-lg leading-relaxed mb-4">
        We currently operate with decentralized principles: locked liquidity, a fixed supply token,
        and public portfolio management. All decisions and actions are clearly communicated through our official channels,
        maintaining full transparency and community trust.
      </p>

      <p className="text-base sm:text-lg leading-relaxed">
        Our model is flexible. As the project grows, we’re open to evolving our structure —
        including the possibility of establishing a legal entity in crypto-friendly jurisdictions like Dubai,
        if it brings strategic value to the group and the community.
      </p>
    </section>
  );
}

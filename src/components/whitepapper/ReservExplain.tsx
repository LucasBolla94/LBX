"use client";

export default function ReservExplain() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-lg mt-12 text-[var(--foreground)]">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        💼 Understanding the LBX Group Reserve
      </h2>

      <div className="space-y-6 text-base sm:text-lg leading-relaxed tracking-wide">
        <p>
          The <strong>LBX Group</strong> maintains a strategic reserve of both <strong>$LBXO</strong> and <strong>USDC</strong> in our official fund wallet.
        </p>

        <p>
          This reserve plays a key role in ensuring the <strong>stability, controlled growth, and long-term value</strong> of our token and ecosystem.
        </p>

        <div className="bg-[var(--border)]/10 rounded-xl p-4 sm:p-5">
          <p className="font-semibold mb-2">🔐 $LBXO Reserve:</p>
          <p>
            We hold between <strong>3 million and 10 million LBXO</strong> tokens in reserve. This amount is used to:
          </p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>🧩 Add liquidity to new DEXs when needed</li>
            <li>📈 Support strategic market actions</li>
            <li>🛡️ Provide stability during volatile periods</li>
          </ul>
        </div>

        <div className="bg-[var(--border)]/10 rounded-xl p-4 sm:p-5">
          <p className="font-semibold mb-2">💵 USDC Reserve:</p>
          <p>
            We also maintain a USDC reserve with a <strong>minimum of $1,000</strong> and a <strong>target of $100,000</strong>. This reserve helps us:
          </p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>⚙️ Cover unexpected operational costs</li>
            <li>🚀 Take advantage of strategic opportunities</li>
            <li>🤝 Make important decisions together with our holders</li>
          </ul>
        </div>

        <p>
          📢 <strong>Transparency is our priority:</strong> Any action involving the reserve will always be <strong>communicated through our official channels</strong>. We operate with full visibility to earn and maintain your trust.
        </p>
      </div>
    </div>
  );
}

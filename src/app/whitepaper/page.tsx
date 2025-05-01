// app/whitepaper/page.tsx

export default function WhitepaperPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-base leading-relaxed text-[var(--foreground)] bg-[var(--background)]">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-12">
        📄 Whitepaper – LBX Group
      </h1>

      {/* 1. Introduction */}
      <section className="mb-10 border-b border-[var(--border)] pb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">1. Introduction</h2>
        <p>
          <strong>LBX Group</strong> created the <strong>LBX One ($LBXO)</strong> token as a scarce, decentralized, and sustainable asset focused on generating real yield. The entire operation is transparent, long-term oriented, and committed to delivering fair returns to holders.
        </p>
      </section>

      {/* 2. Token Structure */}
      <section className="mb-10 border-b border-[var(--border)] pb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">2. Token Structure</h2>
        <p>
          <strong>Token Name:</strong> LBXO<br />
          <strong>Blockchain:</strong> Solana<br />
          <strong>Total Supply:</strong> 50 million (fixed, no future minting)
        </p>
      </section>

      {/* 3. Liquidity and Security */}
      <section className="mb-10 border-b border-[var(--border)] pb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">3. Liquidity and Security</h2>
        <p>
          All liquidity provided by the group is <strong>permanently locked</strong>. NFTs and LP control tokens are <strong>burned</strong>, making it impossible to withdraw liquidity. Every process is recorded and shared on our official social media.
        </p>
      </section>

      {/* 4. Revenue Engine */}
      <section className="mb-10 border-b border-[var(--border)] pb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">4. Revenue Engine</h2>
        <p>Monthly rewards are generated through a revenue engine composed of:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Native SOL staking</li>
          <li>JitoSOL and Marinade (mSOL)</li>
          <li>DeFi lending platforms</li>
          <li>Liquidity pools (e.g., SOL/USDC and stablecoin strategies)</li>
        </ul>
        <p className="mt-4">Yield distribution:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>50%</strong> reinvested in the engine</li>
          <li><strong>50%</strong> allocated by community voting</li>
        </ul>
        <p className="mt-4">
          The group may maintain a reserve of up to <strong>20%</strong> of the total supply, with a minimum of <strong>5%</strong>. No tokens were pre-allocated. All reserves are acquired through yield and voted on by the community.
        </p>
      </section>

      {/* 5. Governance */}
      <section className="mb-10 border-b border-[var(--border)] pb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">5. Governance</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Dashboard access: minimum 1,000 LBXO</li>
          <li>Voting eligibility: minimum 100,000 LBXO</li>
          <li>Voting power based on % of total supply (50M)</li>
          <li>At least one vote per month is required</li>
          <li>The group proposes; the community decides</li>
          <li>Off-chain voting to start, on-chain governance planned</li>
        </ul>
      </section>

      {/* 6. Transparency and Philosophy */}
      <section className="mb-10 border-b border-[var(--border)] pb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">6. Transparency and Philosophy</h2>
        <p>
          All group transactions are executed through the official wallet:
        </p>
        <p className="mt-2 font-mono text-sm break-all">
          5ArPQSA9vM7sukJzsFdkEnUzG5NALCDDcEm6Li5VoZRS
        </p>
        <p className="mt-4">
          No profits will ever be used for personal gain. 100% of the yield is reinvested. Every action is publicly communicated through our official channels.
        </p>
      </section>

      {/* 7. Roadmap */}
      <section className="mb-10 border-b border-[var(--border)] pb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">7. Roadmap</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Reach $2,000 in locked liquidity on Raydium</li>
          <li>Launch off-chain governance dashboard</li>
          <li>Develop open-source smart contracts for automation</li>
          <li>List on major DEXs and CEXs</li>
          <li>Lock 10% of the total supply for 2 years (starting Jan 2027)</li>
        </ul>
      </section>

      {/* 8. NFT Program */}
      <section className="mb-10 border-b border-[var(--border)] pb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">8. NFT Program</h2>
        <p>
          NFTs will be launched to raise additional treasury capital when approved by the community. Benefits include:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Reward boosts for holders</li>
          <li>Early access to new features</li>
          <li>Performance-based airdrops</li>
          <li>Exclusive raffles (SOL, USDC, LBXO prizes)</li>
        </ul>
        <p className="mt-4">
          NFT sale distribution: <strong>70%</strong> to treasury, <strong>30%</strong> to liquidity and buybacks.
        </p>
      </section>

      {/* 9. Risks */}
      <section className="mb-10 border-b border-[var(--border)] pb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">9. Risks</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Market Risk:</strong> SOL/USDC volatility</li>
          <li><strong>Liquidity Risk:</strong> Low trading volume may cause instability</li>
          <li><strong>Platform Risk:</strong> Vulnerabilities in external DeFi platforms</li>
          <li><strong>Operational Risk:</strong> Human errors until automation is complete</li>
          <li><strong>Governance Risk:</strong> Community decisions may misalign with long-term vision</li>
          <li><strong>Smart Contract Risk:</strong> Possible vulnerabilities despite audits</li>
          <li><strong>Regulatory Risk:</strong> Legal changes could impact operations</li>
        </ul>
      </section>

      {/* 10. Official Channels */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">10. Official Channels</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Website: <a href="https://lbxgroup.online" target="_blank" className="underline">lbxgroup.online</a></li>
          <li>Twitter (X): <a href="https://x.com/lbxone" target="_blank" className="underline">@lbxone</a></li>
          <li>Telegram Channel: <a href="https://t.me/lbxone" target="_blank" className="underline">t.me/lbxone</a></li>
          <li>Community Chat: <a href="https://t.me/lbxonegroup" target="_blank" className="underline">t.me/lbxonegroup</a></li>
        </ul>
      </section>
    </main>
  );
}

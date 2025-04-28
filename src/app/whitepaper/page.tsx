// app/whitepaper/page.tsx

export default function WhitepaperPage() {
  return (
    <main
      className="max-w-4xl mx-auto px-6 py-12"
      style={{ color: 'var(--foreground)' }}
    >
      <h1 className="text-4xl font-bold text-center mb-12">
        📄 Whitepaper - LBX Group
      </h1>

      {/* 1. Introduction */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="text-base leading-relaxed">
          <strong>LBX Group</strong> was created to offer a scarce, decentralized token powered by a real revenue engine. Our mission is to build a solid and transparent ecosystem, delivering constant value to holders through simple, efficient, and public financial strategies.
        </p>
      </section>

      {/* 2. Token Structure */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">2. Token Structure</h2>
        <p className="text-base leading-relaxed">
          <strong>Token Name:</strong> LBXO<br />
          <strong>Blockchain:</strong> Solana<br />
          <strong>Total Supply:</strong> 50 million LBXO (fixed, no future minting)<br />
        </p>
      </section>

      {/* 3. Liquidity and Security */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">3. Liquidity and Security</h2>
        <p className="text-base leading-relaxed">
          LBXO currently operates two liquidity pools: <strong>LBXO/USDC</strong> and <strong>LBXO/SOL</strong>.
          All liquidity provided by LBX Group is <strong>locked forever</strong> and the control NFTs have been <strong>burned</strong>.
          No one can remove the liquidity, ensuring full security for the community.
        </p>
      </section>

      {/* 4. Revenue Engine */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">4. Revenue Engine</h2>
        <p className="text-base leading-relaxed">
          The LBX Group manages a revenue wallet that generates yield through native SOL staking.
          Distribution of revenues:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed">
          <li><strong>50%</strong> is reinvested to grow the staking portfolio.</li>
          <li><strong>50%</strong> is used to support LBXO growth (buybacks, burns, liquidity addition), decided by the community.</li>
        </ul>
        <p className="text-base leading-relaxed mt-4">
          Buybacks are performed progressively to avoid gaps and excessive arbitrage opportunities. Future automation will be deployed using open-source smart contracts.
        </p>
      </section>

      {/* 5. Governance */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">5. Governance</h2>
        <p className="text-base leading-relaxed">
          Governance decisions are made by the community:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed">
          <li>Any holder with at least <strong>500,000 LBXO</strong> can vote.</li>
          <li>Voting power is proportional to the holder&apos;s share of the total supply.</li>
          <li>Voting events will initially occur off-chain via our dashboard, and later on-chain via smart contracts.</li>
        </ul>
      </section>

      {/* 6. Transparency and Future Plans */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">6. Transparency and Future Plans</h2>
        <p className="text-base leading-relaxed">
          Financial balances and important updates will be published regularly on our website, Twitter, and Telegram channels.
          Future plans include the launch of smart contracts to automate reinvestments, buybacks, and governance, with open-source transparency.
        </p>
      </section>

      {/* 7. Roadmap */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">7. Roadmap</h2>
        <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed">
          <li>Reach $2,000 USD locked liquidity on Raydium (estimated between September and December 2025).</li>
          <li>Launch off-chain community voting via Dashboard (1 month after reaching $2,000 locked liquidity).</li>
          <li>Develop and deploy smart contracts for automation (scheduled for the first half of 2026).</li>
          <li>List LBXO on larger decentralized and centralized exchanges (starting from the second half of 2026).</li>
          <li>Lock 10% of supply for 2 years starting January 7, 2027.</li>
        </ul>
      </section>

      {/* 8. NFT Program */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">8. NFT Program</h2>
        <p className="text-base leading-relaxed">
          To strengthen the ecosystem, LBX Group will launch exclusive NFTs designed to boost the project&apos;s treasury and offer special benefits to holders.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed mt-4">
          <li><strong>Yield Boosts:</strong> Extra rewards in staking pools for NFT holders.</li>
          <li><strong>Early Access:</strong> Priority access to new features and pools.</li>
          <li><strong>Special Airdrops:</strong> Participation in airdrops tied to project profits.</li>
          <li><strong>Exclusive Raffles:</strong> Access to raffles distributing SOL, USDC, or LBXO prizes.</li>
        </ul>
        <p className="text-base leading-relaxed mt-4">
          70% of NFT sale revenues will be directed to grow the project&apos;s treasury and 30% will be used to support liquidity and buybacks. Full transparency will be maintained through public updates.
        </p>
      </section>

      {/* 9. Risks */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">9. Risks</h2>
        <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed">
          <li><strong>Market Risk:</strong> Price fluctuations in SOL and USDC can impact LBXO&apos;s price.</li>
          <li><strong>Liquidity Risk:</strong> Low trading volume could cause price volatility.</li>
          <li><strong>Platform Security Risk:</strong> Vulnerabilities in external platforms could affect operations.</li>
          <li><strong>Operational Risk:</strong> Manual wallet operations present potential human error risks until full automation.</li>
          <li><strong>Governance Risk:</strong> Community decisions might not always align with long-term best interests.</li>
          <li><strong>Smart Contract Risk:</strong> Future contracts may still be vulnerable despite testing.</li>
          <li><strong>Regulatory Risk:</strong> Regulatory changes could impact token accessibility or operation.</li>
        </ul>
      </section>

      {/* 10. Official Channels */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">10. Official Channels</h2>
        <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed">
          <li>Website: <a href="https://lbxgroup.online/" className="underline" target="_blank" rel="noopener noreferrer">https://lbxgroup.online/</a></li>
          <li>Twitter (X): <a href="https://x.com/lbxone" className="underline" target="_blank" rel="noopener noreferrer">@lbxone</a></li>
          <li>Telegram Channel: <a href="https://t.me/lbxone" className="underline" target="_blank" rel="noopener noreferrer">https://t.me/lbxone</a></li>
          <li>Telegram Community Chat: <a href="https://t.me/lbxonegroup" className="underline" target="_blank" rel="noopener noreferrer">https://t.me/lbxonegroup</a></li>
        </ul>
      </section>
    </main>
  );
}

// app/whitepaper/page.tsx

export default function WhitepaperPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-primary mb-12">
        📄 Whitepaper - LBX Group
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">1. Introduction</h2>
        <p className="text-base leading-relaxed">
          <strong>LBX Group</strong> was created to offer a scarce, decentralized token powered by a real revenue engine. Our mission is to build a solid and transparent ecosystem, delivering constant value to holders through simple, efficient, and public financial strategies.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">2. Token Structure</h2>
        <p className="text-base leading-relaxed">
          <strong>Token Name:</strong> LBXO<br />
          <strong>Blockchain:</strong> Solana<br />
          <strong>Total Supply:</strong> 50 million LBXO (fixed, no future minting)<br />
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">3. Liquidity and Security</h2>
        <p className="text-base leading-relaxed">
          LBXO currently operates two liquidity pools: <strong>LBXO/USDC</strong> and <strong>LBXO/SOL</strong>. 
          All liquidity provided by LBX Group is <strong>locked forever</strong> and the control NFTs have been <strong>burned</strong>.
          No one can remove the liquidity, ensuring full security for the community.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">4. Revenue Engine</h2>
        <p className="text-base leading-relaxed">
          The LBX Group manages a revenue wallet that collects yields 1-2 times per month.
          Distribution of revenues:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed">
          <li><strong>50%</strong> is reinvested to grow the portfolio.</li>
          <li><strong>50%</strong> is used to buy back LBXO on the open market.</li>
        </ul>
        <p className="text-base leading-relaxed mt-4">
          This creates constant buying pressure and increases scarcity over time.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">5. Governance</h2>
        <p className="text-base leading-relaxed">
          Governance decisions are made by the community:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed">
          <li>Any holder with at least <strong>500,000 LBXO</strong> can vote.</li>
          <li>Voting power is proportional to the holder’s share of the total supply.</li>
          <li>Voting events will be announced through official channels and occur as needed.</li>
        </ul>
        <p className="text-base leading-relaxed mt-4">
          The community decides how the repurchased LBXO will be used: adding liquidity, burning tokens, or allocating to staking pools.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">6. Transparency and Future Plans</h2>
        <p className="text-base leading-relaxed">
          All financial balances and important updates will be published regularly on our website, Twitter, and Telegram channels.
          In the future, the group plans to implement smart contracts to automate reinvestment and buyback operations, enhancing transparency even further.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">7. Roadmap</h2>
        <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed">
          <li>Grow the revenue engine.</li>
          <li>Expand liquidity to stabilize the token.</li>
          <li>Develop and deploy smart contracts for automation.</li>
          <li>List LBXO on larger decentralized and centralized exchanges.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">8. Official Channels</h2>
        <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed">
          <li>Website: <a href="https://lbxgroup.online/" className="text-primary underline" target="_blank" rel="noopener noreferrer">https://lbxgroup.online/</a></li>
          <li>Twitter (X): <a href="https://x.com/lbxone" className="text-primary underline" target="_blank" rel="noopener noreferrer">@lbxone</a></li>
          <li>Telegram Channel: <a href="https://t.me/lbxone" className="text-primary underline" target="_blank" rel="noopener noreferrer">https://t.me/lbxone</a></li>
          <li>Telegram Community Chat: <a href="https://t.me/lbxonegroup" className="text-primary underline" target="_blank" rel="noopener noreferrer">https://t.me/lbxonegroup</a></li>
        </ul>
      </section>
    </main>
  );
}

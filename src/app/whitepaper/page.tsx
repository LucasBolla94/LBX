// app/whitepaper/page.tsx

export default function WhitepaperPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-primary mb-12">
        📄 Whitepaper - LBX Group
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">1. Resumo Executivo</h2>
        <p className="text-base leading-relaxed">
          O <strong>LBX Group</strong> é uma comunidade focada em proteger o patrimônio dos seus membros contra a desvalorização de moedas fiduciárias, utilizando stablecoins como o USDC. Através de estratégias seguras na blockchain Solana, buscamos gerar rendimento real e sustentável, além de valorizar o token LBX.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">2. Visão Geral do Projeto</h2>
        <p className="text-base leading-relaxed">
          Democratizamos o acesso ao universo cripto com segurança, educação e suporte direto à comunidade. Nosso foco são iniciantes, que encontram no LBX uma forma simples e transparente de participar do ecossistema cripto.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">3. Modelo Econômico</h2>
        <p className="text-base leading-relaxed">
          O token LBX é emitido somente quando há entrada real de USDC. 50% dos lucros são reinvestidos automaticamente, enquanto os outros 50% são decididos pela comunidade via votação. Nosso crescimento é sempre 100% lastreado.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">4. Utilidade do Token</h2>
        <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed">
          <li><strong>Valorização:</strong> Crescimento do valor conforme o fundo aumenta.</li>
          <li><strong>Stake:</strong> Recompensas para quem bloqueia LBX.</li>
          <li><strong>Governança:</strong> Participação em decisões importantes do grupo.</li>
          <li><strong>Área Exclusiva:</strong> Acesso a funções premium para holders.</li>
          <li><strong>Futuro:</strong> Pagamentos com LBX e cartões para sócios.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">5. Estratégia de Investimento</h2>
        <p className="text-base leading-relaxed">
          Até atingirmos 50.000 USDC, 100% do capital será alocado em estratégias conservadoras. Após isso, até 20% poderá ser usado em ativos de risco moderado, sempre com controle, transparência e foco na preservação do patrimônio.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">6. Governança</h2>
        <p className="text-base leading-relaxed">
          Quem possui 100.000 LBX ou mais pode votar. O peso do voto é proporcional ao supply. Votações duram 5 dias, são divulgadas no site e nos canais oficiais. Apenas propostas produtivas são aceitas, garantindo seriedade no processo.
        </p>
      </section>

      <footer className="mt-16 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} LBX Group. Todos os direitos reservados.
      </footer>
    </main>
  );
}

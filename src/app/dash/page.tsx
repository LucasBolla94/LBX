'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { PublicKey } from '@solana/web3.js';
import LoadPage from '@/components/LoadPage';
import Portfolio from '@/components/dash/Portfolio';
import RewardAirDrop from '@/components/dash/RewardAirDrop';
import PoolVote from '@/components/dash/PoolVote';

const MINT_LBXO = new PublicKey('CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1');
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a';

export default function DashPage() {
  const wallet = useWallet();
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [notAllowed, setNotAllowed] = useState<boolean>(false);

  useEffect(() => {
    const checkBalance = async () => {
      if (!wallet.publicKey) return;

      try {
        const response = await fetch(RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByOwner',
            params: [
              wallet.publicKey.toBase58(),
              { mint: MINT_LBXO.toBase58() },
              { encoding: 'jsonParsed' },
            ],
          }),
        });

        const data = await response.json();

        if (data.result && data.result.value.length > 0) {
          const tokenAccount = data.result.value[0];
          const uiAmount = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
          setBalance(uiAmount);
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error('Error fetching LBXO balance:', error);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    if (wallet.connected) {
      checkBalance();
    }
  }, [wallet.connected, wallet.publicKey]);

  useEffect(() => {
    if (!loading && wallet.connected && balance < 100) {
      setNotAllowed(true);
      const timer = setTimeout(() => {
        router.push('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, wallet.connected, balance, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)] text-[var(--foreground)]">
        Loading...
      </div>
    );
  }

  if (!wallet.connected) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)] text-[var(--foreground)]">
        Please connect your wallet.
      </div>
    );
  }

  if (notAllowed) {
    return <LoadPage />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 sm:px-6 py-10">
      {/* Cabeçalho do Painel */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          🧑‍💻 LBXO Dashboard
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--foreground)]/70">
          Manage your portfolio, rewards, and community votes.
        </p>
      </div>
  
      {/* Conteúdo principal */}
      <div className="flex flex-col gap-10 items-center w-full">
        
        {/* Portfolio */}
        <div className="w-full max-w-4xl px-2 sm:px-4">
          <Portfolio />
        </div>
  
        {/* Recompensas de Referência */}
        <div className="w-full max-w-4xl px-2 sm:px-4">
          <RewardAirDrop />
        </div>
  
        {/* Seção de Votação */}
        <div className="w-full max-w-7xl px-2 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-6">
            📢 Community Votes
          </h2>
          <PoolVote />
        </div>
      </div>
    </div>
  );
}  
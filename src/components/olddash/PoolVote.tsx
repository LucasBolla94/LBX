'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { FaTimesCircle, FaWallet } from 'react-icons/fa';
import ModelPool from '@/components/olddash/ModelPool';
import WarningsPools from '@/components/olddash/WarningsPools';

type Pool = {
  id: string;
  startDate: string;
  endDate: string;
  question: string;
  options: string[];
  createdAt: string;
  petition?: string;
};

const LBX_MINT = new PublicKey('CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1');
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a';

export default function PoolVote() {
  const wallet = useWallet();
  const [pools, setPools] = useState<Pool[]>([]);
  const [balance, setBalance] = useState(0);
  const [minToVote, setMinToVote] = useState(10000); // fallback
  const [loading, setLoading] = useState(true);

  // MOCK: resultados (votos por opção) por pool
  const resultsMock: number[] = [1500000, 500000, 250000]; // exemplo fixo

  // MOCK: votos do usuário (simulado para todos os pools como undefined)
  const voteMock = undefined; // ou um objeto com balanceLBXO e selectedOption

  const totalSupply = 100_000_000; // pode ser buscado dinamicamente se quiser

  const handleVote = (poolId: string, option: number) => {
    console.log('Votou em:', poolId, 'opção', option);
  };

  const handleRevote = (poolId: string) => {
    console.log('Revotou em:', poolId);
  };

  const handleChangeVote = (poolId: string, option: number) => {
    console.log('Alterou voto para:', option, 'na pool', poolId);
  };

  useEffect(() => {
    const fetchMinVote = async () => {
      try {
        const ref = doc(db, 'config', 'min-vote');
        const snap = await getDoc(ref);
        const val = snap.data()?.value;
        if (typeof val === 'number') setMinToVote(val);
      } catch (err) {
        console.error('Erro ao buscar min-vote:', err);
      }
    };
    fetchMinVote();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet.connected || !wallet.publicKey) return;

      try {
        const res = await fetch(RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByOwner',
            params: [
              wallet.publicKey.toBase58(),
              { mint: LBX_MINT.toBase58() },
              { encoding: 'jsonParsed' },
            ],
          }),
        });
        const json = await res.json();
        const amt = json.result?.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
        setBalance(amt);
      } catch (err) {
        console.error('Erro ao buscar saldo LBXO:', err);
        setBalance(0);
      }
    };

    fetchBalance();
  }, [wallet.connected, wallet.publicKey]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'Pools'), (snap) => {
      const arr: Pool[] = [];
      snap.forEach((doc) => {
        arr.push({ id: doc.id, ...(doc.data() as Omit<Pool, 'id'>) });
      });
      setPools(arr);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center text-sm text-[var(--foreground)]/80 gap-2 p-4">
        <FaWallet className="animate-spin" />
        <span>Loading Pools and Balance...</span>
      </div>
    );
  }

  if (!wallet.connected || balance < minToVote) {
    return (
      <div className="text-center max-w-md mx-auto mt-10 px-6 py-4 border border-yellow-300 bg-yellow-100 text-yellow-800 rounded-xl flex flex-col items-center gap-2">
        <FaTimesCircle className="text-2xl" />
        <p className="text-sm sm:text-base font-medium">
          You need at least <strong>{minToVote.toLocaleString()} $LBXO</strong> in your wallet to view or vote in the Pools.
        </p>
        <p className="text-xs text-yellow-700/80">
          Current balance: {balance.toLocaleString()} $LBXO
        </p>
      </div>
    );
  }

  return (
    <>
      <WarningsPools />

      <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6">
        {pools.map((pool) => (
          <ModelPool
            key={pool.id}
            pool={pool}
            balance={balance}
            vote={voteMock}
            results={resultsMock.slice(0, pool.options.length)}
            totalSupply={totalSupply}
            minToVote={minToVote}
            walletConnected={wallet.connected}
            onVote={(idx) => handleVote(pool.id, idx)}
            onRevote={() => handleRevote(pool.id)}
            onChangeVote={(idx) => handleChangeVote(pool.id, idx)}
          />
        ))}
      </section>
    </>
  );
}

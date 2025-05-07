'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase'; // ajuste esse path conforme seu projeto
import { FiLock } from 'react-icons/fi';

const MINT_LBXO = new PublicKey('CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1');
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a';

export default function DashboardAccessButton({ minimal }: { minimal?: boolean }) {
  const wallet = useWallet();
  const router = useRouter();

  const [balance, setBalance] = useState<number>(0);
  const [minRequired, setMinRequired] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMinRequired = async () => {
      const docRef = doc(db, 'config', 'min-dash');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setMinRequired(snap.data().value || 0);
      }
    };

    fetchMinRequired();
  }, []);

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
              { encoding: "jsonParsed" }
            ],
          }),
        });

        const json = await response.json();
        const tokenAccounts = json?.result?.value;
        const amount = tokenAccounts?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
        setBalance(amount);
      } catch {
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    if (wallet.connected) {
      checkBalance();
    }
  }, [wallet.connected, wallet.publicKey]);

  const handleClick = () => {
    if (wallet.connected && balance >= minRequired) {
      router.push('/dash');
    }
  };

  if (loading) {
    return (
      <div className="w-full text-center text-sm sm:text-base text-[var(--foreground)]">
        Checking balance...
      </div>
    );
  }

  if (!wallet.connected) {
    return (
      <div className="w-full text-center text-sm sm:text-base text-[var(--foreground)]">
        Connect your wallet to access
      </div>
    );
  }

  if (balance < minRequired) {
    return (
      <div className="flex items-center justify-center gap-2 text-center text-sm sm:text-base text-[var(--foreground)]">
        <FiLock className="text-xl" />
        <span>You need at least {minRequired} LBXO to access the Dashboard</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full sm:w-auto text-center rounded-full shadow-md transition-all duration-300 ease-in-out hover:scale-105
        text-[var(--background)] bg-[var(--foreground)] hover:opacity-90
        ${minimal ? 'px-4 py-2 text-base' : 'px-6 py-3 text-sm sm:text-base font-semibold'}`}
    >
      {minimal ? '🔒' : '🔒 Access Dashboard'}
    </button>
  );
}

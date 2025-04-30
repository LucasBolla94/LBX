'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/navigation';

const MINT_LBXO = new PublicKey('CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1');
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a';

export default function DashboardAccessButton({ minimal }: { minimal?: boolean }) {
  const wallet = useWallet();
  const router = useRouter();

  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkLBXOBalance = async () => {
      if (!wallet.publicKey) return;

      setLoading(true);

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

        const data = await response.json();

        if (data.result && data.result.value.length > 0) {
          const tokenAccount = data.result.value[0];
          const uiAmount = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
          console.log(`LBXO Balance detected: ${uiAmount}`);
          setBalance(uiAmount);
        } else {
          console.log('No LBXO token account found for wallet.');
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
      checkLBXOBalance();
    }
  }, [wallet.connected, wallet.publicKey]);

  const handleClick = () => {
    if (wallet.connected && balance >= 1_000) {
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

  if (balance < 100) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center text-[var(--foreground)] text-sm sm:text-base gap-1 sm:gap-2 text-center">
        <span>Need at least 100 LBXO to access the Dashboard</span>
        <span className="text-lg">❓</span>
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

'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { PublicKey } from '@solana/web3.js';
import LoadPage from '@/components/LoadPage';

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
          headers: {
            'Content-Type': 'application/json',
          },
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
    if (!loading && wallet.connected && balance < 500_000) {
      setNotAllowed(true);
      const timer = setTimeout(() => {
        router.push('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, wallet.connected, balance, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!wallet.connected) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Please connect your wallet.
      </div>
    );
  }

  if (notAllowed) {
    return <LoadPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Aqui você vai adicionar os componentes do dashboard depois */}
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard!</h1>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/navigation';

const MINT_LBXO = new PublicKey('CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1');
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a';

export default function DashboardAccessButton() {
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
  }, [wallet.publicKey, wallet.connected]);

  if (loading) {
    return <div className="text-center text-sm text-gray-500">Checking Balance...</div>;
  }

  if (!wallet.connected) {
    return null;
  }

  if (balance < 500_000) {
    return (
      <div className="flex items-center text-gray-500 text-sm space-x-1">
        <span>Need 500k LBXO to DashBoard</span>
        <span className="text-lg">❓</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/dashboard')}
      className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg hover:scale-105"
    >
      🔐 Access Dashboard
    </button>
  );
}

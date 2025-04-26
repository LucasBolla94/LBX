'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount, getMint } from '@solana/spl-token';
import { useRouter } from 'next/navigation';

const MINT_LBXO = new PublicKey('CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1');
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a';

export default function DashboardAccessButton() {
  const wallet = useWallet();
  const router = useRouter();

  const [balance, setBalance] = useState<bigint>(0n);
  const [decimals, setDecimals] = useState<number>(6);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkTokenBalance = async () => {
      if (!wallet.publicKey) return;

      setLoading(true);
      const connection = new Connection(RPC);
      const ata = await getAssociatedTokenAddress(MINT_LBXO, wallet.publicKey, true);

      try {
        const account = await getAccount(connection, ata);
        const mintInfo = await getMint(connection, MINT_LBXO);

        setBalance(account.amount);
        setDecimals(mintInfo.decimals);
      } catch (error) {
        console.error('Error fetching LBXO balance:', error);
        setBalance(0n);
      } finally {
        setLoading(false);
      }
    };

    if (wallet.connected) {
      checkTokenBalance();
    }
  }, [wallet.publicKey, wallet.connected]);

  const formattedBalance = Number(balance) / Math.pow(10, decimals);
  const hasMinimumLBXO = balance >= BigInt(500_000 * Math.pow(10, decimals) / 1_000_000);

  if (!wallet.connected || loading) {
    return null;
  }

  if (!hasMinimumLBXO) {
    return null;
  }

  return (
    <button
      onClick={() => router.push('/dashboard')}
      className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg hover:scale-105"
    >
      🔐 Access Dashboard
    </button>
  );
}

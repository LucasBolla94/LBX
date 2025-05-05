'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { FaSyncAlt } from 'react-icons/fa';

const LBX_MINT = 'CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a';

export default function Portfolio() {
  const wallet = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [price, setPrice] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingPrice, setLoadingPrice] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet.publicKey) return;
      setLoadingBalance(true);

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
              { mint: LBX_MINT },
              { encoding: 'jsonParsed' }
            ],
          }),
        });

        const data = await response.json();

        if (data.result?.value?.length > 0) {
          const tokenAccount = data.result.value[0];
          const uiAmount = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount || 0;
          setBalance(uiAmount);
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error('Error fetching LBXO balance:', error);
        setBalance(0);
      } finally {
        setLoadingBalance(false);
      }
    };

    if (wallet.connected) {
      fetchBalance();
    }
  }, [wallet.connected, wallet.publicKey]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const amount = 1 * 10 ** 9;
        const url = `https://lite-api.jup.ag/swap/v1/quote?inputMint=${LBX_MINT}&outputMint=${USDC_MINT}&amount=${amount}&slippageBps=50`;
        const res = await fetch(url);
        if (!res.ok) return;

        const data = await res.json();
        const usdcValue = Number(data.outAmount) / 10 ** 6;
        setPrice(usdcValue);
      } catch (error) {
        console.error('Erro ao buscar preço do LBX:', error);
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30_000);
    return () => clearInterval(interval);
  }, []);

  const portfolioValue = price !== null ? balance * price : 0;

  return (
    <section className="w-full max-w-4xl mx-auto p-6 sm:p-10 bg-[var(--background)] border border-[var(--border)] rounded-3xl shadow-xl">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-4 text-center mb-10">
        <Image src="/shield.png" alt="$LBXO Logo" width={60} height={60} />
        <h1 className="text-2xl sm:text-3xl font-bold">Your LBXO Portfolio</h1>
        <p className="text-sm sm:text-base text-[var(--foreground)]/70 max-w-xl">
          Track your total $LBXO balance and its current value in USDC. 
          Updated live every 30 seconds based on Jupiter’s market price.
        </p>
      </div>

      {/* Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 text-center">
        {/* LBXO Balance */}
        <div className="bg-[var(--border)]/10 border border-[var(--border)] rounded-xl p-6">
          <p className="text-sm sm:text-base mb-2 text-[var(--foreground)]/70">Token Balance</p>
          {loadingBalance ? (
            <p className="text-3xl font-bold animate-pulse">Loading...</p>
          ) : (
            <p className="text-3xl font-extrabold">
              {balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-base font-medium">$LBXO</span>
            </p>
          )}
        </div>

        {/* USDC Value */}
        <div className="bg-[var(--border)]/10 border border-[var(--border)] rounded-xl p-6">
          <p className="text-sm sm:text-base mb-2 text-[var(--foreground)]/70">Estimated USDC Value</p>
          {loadingPrice || loadingBalance ? (
            <p className="text-3xl font-bold animate-pulse">Loading...</p>
          ) : (
            <p className="text-3xl font-extrabold text-green-500">
              ${portfolioValue.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-center items-center text-xs sm:text-sm text-[var(--foreground)]/50 gap-2">
        <FaSyncAlt className="animate-spin-slow" />
        Data refreshes every 30 seconds automatically
      </div>
    </section>
  );
}

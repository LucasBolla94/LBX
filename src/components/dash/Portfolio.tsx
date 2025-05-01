'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

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

        if (data.result && data.result.value.length > 0) {
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

        if (!res.ok) {
          console.error('Erro na resposta da API:', await res.text());
          return;
        }

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
    <section className="w-full max-w-4xl mx-auto p-6 sm:p-8 bg-[var(--background)] rounded-3xl shadow-lg border border-[var(--border)] flex flex-col gap-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--foreground)]">
        📈 Your Portfolio
      </h2>
  
      <div className="flex flex-col sm:flex-row justify-between items-center gap-10 sm:gap-8">
        {/* Balance */}
        <div className="flex flex-col items-center text-center">
          <p className="text-base sm:text-lg text-[var(--foreground)]/70">Your Balance</p>
          {loadingBalance ? (
            <p className="text-[var(--foreground)] text-3xl font-bold animate-pulse">Loading...</p>
          ) : (
            <p className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)]">
              {balance.toLocaleString()}
              <span className="text-[var(--foreground)]/70 text-lg ml-1">$LBXO</span>
            </p>
          )}
        </div>
  
        {/* Value */}
        <div className="flex flex-col items-center text-center">
          <p className="text-base sm:text-lg text-[var(--foreground)]/70">Value in USDC</p>
          {loadingPrice || loadingBalance ? (
            <p className="text-[var(--foreground)] text-3xl font-bold animate-pulse">Loading...</p>
          ) : (
            <p className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)]">
              ${portfolioValue.toFixed(2)}
            </p>
          )}
        </div>
      </div>
  
      <p className="text-xs text-center text-[var(--foreground)]/50 mt-2">
        Data updates automatically every 30 seconds
      </p>
    </section>
  );
}
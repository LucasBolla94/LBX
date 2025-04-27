'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

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
    <section className="w-full max-w-4xl mx-auto p-6 sm:p-8 bg-black rounded-3xl shadow-lg border border-green-500 flex flex-col gap-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-400 text-center">📈 Your Portfolio</h2>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center">
          <p className="text-lg text-gray-400">Your Balance</p>
          {loadingBalance ? (
            <p className="text-white text-3xl font-bold animate-pulse">Loading...</p>
          ) : (
            <p className="text-green-300 text-4xl font-extrabold">{balance.toLocaleString()} <span className="text-green-500">$LBXO</span></p>
          )}
        </div>

        <div className="flex flex-col items-center">
          <p className="text-lg text-gray-400">Value in USDC</p>
          {loadingPrice || loadingBalance ? (
            <p className="text-white text-3xl font-bold animate-pulse">Loading...</p>
          ) : (
            <p className="text-green-300 text-4xl font-extrabold">${portfolioValue.toFixed(2)}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-center text-gray-600 mt-4">Data updates automatically every 30 seconds</p>
    </section>
  );
}

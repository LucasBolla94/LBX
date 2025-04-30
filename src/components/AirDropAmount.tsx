'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WALLET_ADDRESS = '4iCbY1phLX2Z2Fhxap7jbiE2AJLcPiyCzfeYgZXZm83Y';
const LBX_MINT = 'CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1';
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a';

export default function AirDropAmount() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLBXOBalance = async () => {
    try {
      const response = await fetch(RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenAccountsByOwner',
          params: [
            WALLET_ADDRESS,
            { mint: LBX_MINT },
            { encoding: 'jsonParsed' },
          ],
        }),
      });

      const data = await response.json();

      if (data.result && data.result.value.length > 0) {
        const tokenAccount = data.result.value[0];
        const uiAmount = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
        setBalance(uiAmount);
        setError(null);
      } else {
        setBalance(0);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching LBXO balance:', err);
      setError('Failed to load balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLBXOBalance();
    const intervalId = window.setInterval(fetchLBXOBalance, 15_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const formatAmount = (value: number) =>
    value.toLocaleString('en-US', { maximumFractionDigits: 2 });

  const getFontSize = (value: number) => {
    if (value >= 1_000_000_000) return 'text-3xl sm:text-4xl';
    if (value >= 10_000_000) return 'text-4xl sm:text-5xl';
    return 'text-5xl sm:text-6xl';
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto p-6 bg-[var(--background)] border border-[var(--border)] rounded-3xl shadow-2xl flex flex-col items-center text-center">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--foreground)] mb-4">
        Balance from Official Rewards Wallet
      </h3>

      {loading ? (
        <p className="text-[var(--foreground)] text-base sm:text-lg animate-pulse">
          Loading...
        </p>
      ) : error ? (
        <p className="text-red-400 text-base sm:text-lg">{error}</p>
      ) : (
        <div className="relative h-16 sm:h-20 md:h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={balance}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex items-end space-x-2"
            >
              <span
                className={`font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)] ${
                  balance !== null ? getFontSize(balance) : 'text-4xl sm:text-5xl'
                }`}
              >
                {balance !== null ? formatAmount(balance) : '0'}
              </span>
              <span className="text-base sm:text-lg md:text-xl font-semibold text-[var(--foreground)]">
                $LBXO
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

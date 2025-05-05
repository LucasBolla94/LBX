'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface BtnWithdrawProps {
  reward: number;
  disabled: boolean;
  refCount: number; // Quantidade de pessoas indicadas
}

export default function BtnWithdraw({ reward, disabled, refCount }: BtnWithdrawProps) {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!wallet.publicKey) {
      alert('Connect your wallet first.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/request-withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: wallet.publicKey.toBase58(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Withdrawal request sent successfully!');
      } else {
        console.error('API error:', data.error);
        alert('Failed to request withdrawal. Please try again.');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Failed to request withdrawal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-6">
      {/* ✅ Aviso sempre visível */}
      <div className="bg-yellow-100 text-yellow-800 text-sm sm:text-base rounded-md px-4 py-3 mb-4 max-w-md mx-auto border border-yellow-300">
        <strong>Notice:</strong> To be eligible for withdrawal, you need to invite at least <strong>3 people</strong> using your referral link.
        <br />
        This helps us grow the community and keep the rewards fair for everyone.
        <div className="mt-2 text-xs text-yellow-700">
          You currently have <strong>{refCount}</strong> referral{refCount !== 1 ? 's' : ''}.
        </div>
      </div>

      {/* ✅ Botão só aparece se tiver 3 ou mais indicações */}
      {refCount >= 3 && (
        <button
          onClick={handleWithdraw}
          className="w-full sm:w-auto px-6 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] border border-[var(--border)] font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={reward <= 0 || loading || disabled}
        >
          {loading
            ? 'Processing...'
            : disabled
              ? 'Withdrawal Requested'
              : 'Withdraw'}
        </button>
      )}
    </div>
  );
}

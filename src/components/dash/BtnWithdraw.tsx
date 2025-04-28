'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface BtnWithdrawProps {
  reward: number;
  disabled: boolean; // NOVO: se o botão deve estar desativado
}

export default function BtnWithdraw({ reward, disabled }: BtnWithdrawProps) {
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
    <button
      onClick={handleWithdraw}
      className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-green-400 via-purple-500 to-green-400 text-black font-bold shadow-md hover:opacity-90 transition disabled:opacity-50"
      disabled={reward <= 0 || loading || disabled} // Aqui agora considera também o disabled externo
    >
      {loading ? 'Processing...' : disabled ? 'Withdrawal Requested' : 'Withdraw'}
    </button>
  );
}

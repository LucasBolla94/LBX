'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { rewardRanges } from '@/utils/rewardTable'; // novo arquivo

export default function RewardAirDrop() {
  const wallet = useWallet();
  const [newUsers, setNewUsers] = useState<number | null>(null);
  const [reward, setReward] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!wallet.publicKey) return;
      setLoading(true);

      try {
        const walletAddress = wallet.publicKey.toBase58();
        const refDoc = await getDoc(doc(db, 'reffer', walletAddress));

        if (refDoc.exists()) {
          const data = refDoc.data();
          const users = data?.newusers || 0;
          setNewUsers(users);

          // Novo cálculo proporcional
          let remaining = users;
          let totalReward = 0;

          for (const range of rewardRanges) {
            const take = Math.min(remaining, range.upTo - (totalReward > 0 ? rewardRanges[rewardRanges.indexOf(range) - 1]?.upTo || 0 : 0));
            if (take > 0) {
              totalReward += take * range.multiplier;
              remaining -= take;
            }
          }

          setReward(totalReward);
        } else {
          setNewUsers(0);
          setReward(0);
        }
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (wallet.connected) {
      fetchReferralData();
    }
  }, [wallet.connected, wallet.publicKey]);

  return (
    <section className="w-full max-w-md mx-auto bg-black border border-green-500 rounded-3xl p-6 flex flex-col items-center shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 via-purple-500 to-green-400 text-transparent bg-clip-text mb-6">
        🎁 AirDrop Reward
      </h2>

      {loading ? (
        <p className="text-white animate-pulse">Loading...</p>
      ) : (
        <>
          <p className="text-gray-400 text-lg mb-2">New Users Referred:</p>
          <p className="text-green-400 text-4xl font-bold">{newUsers}</p>

          <div className="my-6 w-full h-px bg-gradient-to-r from-green-400 via-purple-500 to-green-400" />

          <p className="text-gray-400 text-lg mb-2">Total Reward:</p>
          <p className="text-green-300 text-5xl font-extrabold">{reward.toLocaleString()} $LBXO</p>

          <p className="text-xs text-gray-500 mt-6">Rewards update automatically as new users join.</p>
        </>
      )}
    </section>
  );
}

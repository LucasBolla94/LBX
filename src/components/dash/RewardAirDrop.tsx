'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import BtnWithdraw from '@/components/dash/BtnWithdraw';

export default function RewardAirDrop() {
  const wallet = useWallet();
  const [newUsers, setNewUsers] = useState<number | null>(null);
  const [reward, setReward] = useState<number>(0);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [payRequest, setPayRequest] = useState<boolean>(false);
  const [withdrawRequested, setWithdrawRequested] = useState<boolean>(false);

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
          const userBalance = data?.balance || 0;
          const userPayRequest = data?.payrequest || false;

          setNewUsers(users);
          setBalance(userBalance);
          setPayRequest(userPayRequest);
          setWithdrawRequested(userPayRequest);
        } else {
          setNewUsers(0);
          setBalance(0);
          setPayRequest(false);
          setWithdrawRequested(false);
        }

        const q = query(collection(db, 'reffer-transfer'), where('walletAddress', '==', walletAddress));
        const querySnapshot = await getDocs(q);

        let totalAmount = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalAmount += data.amount || 0;
        });

        setReward(totalAmount);

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

          <p className="text-gray-400 text-lg mb-2">Total Already Withdrawn</p>
          <p className="text-green-300 text-5xl font-extrabold">{reward.toLocaleString()} $LBXO</p>

          <div className="mt-6" />
          <p className="text-gray-400 text-lg mb-2">Total Available to Withdraw:</p>
          <p className="text-green-300 text-4xl font-bold">{balance?.toLocaleString() || 0} $LBXO</p>

          <p className="text-xs text-gray-500 mt-6 mb-4">Rewards update automatically as new users join.</p>

          {/* Botão Withdraw */}
          <div className="flex flex-col items-center">
            {/* REMOVE o onClick daqui para não dar erro */}
            <BtnWithdraw reward={balance || 0} disabled={payRequest || (balance || 0) < 500} />

            {withdrawRequested && (
              <div className="mt-4 text-green-400 text-sm bg-green-900 bg-opacity-30 rounded-xl px-4 py-2 shadow-md animate-pulse">
                🎉 Withdrawal Request Successful! We’ll process it soon.
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

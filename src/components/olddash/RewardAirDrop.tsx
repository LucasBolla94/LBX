'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import BtnWithdraw from '@/components/olddash/BtnWithdraw';
import RefLink from '@/components/olddash/RefLink';
import WithdrawTime from '@/components/olddash/WithdrawTime';
import { FaUsers, FaGift, FaCoins, FaCheckCircle } from 'react-icons/fa';

export default function RewardAirDrop() {
  const wallet = useWallet();
  const [newUsers, setNewUsers] = useState<number | null>(null);
  const [reward, setReward] = useState<number>(0);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [payRequest, setPayRequest] = useState<boolean>(false);
  const [withdrawRequested, setWithdrawRequested] = useState<boolean>(false);
  const [refferCode, setRefferCode] = useState<string>('');

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
          const code = data?.refferCode || '';

          setNewUsers(users);
          setBalance(userBalance);
          setPayRequest(userPayRequest);
          setWithdrawRequested(userPayRequest);
          setRefferCode(code);
        } else {
          setNewUsers(0);
          setBalance(0);
          setPayRequest(false);
          setWithdrawRequested(false);
          setRefferCode('');
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
    <section className="w-full max-w-xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--foreground)] mb-8 flex items-center justify-center gap-2">
        <FaGift className="text-pink-500" /> Referral Rewards
      </h2>

      {loading ? (
        <p className="text-[var(--foreground)] animate-pulse text-center text-base sm:text-lg">
          Loading your rewards...
        </p>
      ) : (
        <>
          {/* Referred Users */}
          <div className="flex flex-col items-center text-center mb-6">
            <FaUsers className="text-blue-500 text-2xl mb-1" />
            <p className="text-sm sm:text-base text-[var(--foreground)]/70">New Users Referred</p>
            <p className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
              {newUsers}
            </p>
          </div>

          {/* Withdrawn Total */}
          <div className="flex flex-col items-center text-center mb-6">
            <FaCoins className="text-yellow-500 text-2xl mb-1" />
            <p className="text-sm sm:text-base text-[var(--foreground)]/70">Total Already Withdrawn</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-[var(--foreground)]">
              {reward.toLocaleString()} $LBXO
            </p>
          </div>

          {/* Withdrawable */}
          <div className="flex flex-col items-center text-center mb-6">
            <FaCoins className="text-green-500 text-2xl mb-1" />
            <p className="text-sm sm:text-base text-[var(--foreground)]/70">Available to Withdraw</p>
            <p className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
              {balance?.toLocaleString() || 0} $LBXO
            </p>
          </div>

          <p className="text-xs text-[var(--foreground)]/50 text-center mb-4">
            Rewards are updated automatically as new users join your referral link.
          </p>

          {/* Referral Link */}
          {refferCode && <RefLink refferCode={refferCode} />}

          {/* Countdown */}
          <WithdrawTime />

          {/* Withdraw Button and Confirmation */}
          <div className="flex flex-col items-center mt-6 w-full">
            <BtnWithdraw
              reward={balance || 0}
              disabled={payRequest || (balance || 0) < 500}
              refCount={newUsers || 0}
            />

            {withdrawRequested && (
              <div className="mt-4 text-[var(--foreground)] text-sm border border-[var(--border)] bg-[var(--background)]/50 rounded-xl px-4 py-3 shadow-md text-center flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Withdrawal request received. We will process it shortly.
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

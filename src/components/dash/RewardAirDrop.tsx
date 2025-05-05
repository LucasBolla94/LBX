'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import BtnWithdraw from '@/components/dash/BtnWithdraw';
import RefLink from '@/components/dash/RefLink';
import WithdrawTime from '@/components/dash/WithdrawTime';

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
    <section className="w-full max-w-md mx-auto bg-[var(--background)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--foreground)] mb-6">
        🎁 Rewards
      </h2>

      {loading ? (
        <p className="text-[var(--foreground)] animate-pulse text-base sm:text-lg">Loading...</p>
      ) : (
        <>
          <p className="text-[var(--foreground)]/70 text-base sm:text-lg mb-2 text-center">
            New Users Referred:
          </p>
          <p className="text-[var(--foreground)] text-3xl sm:text-4xl font-bold">{newUsers}</p>

          <div className="my-6 w-full h-px bg-[var(--border)]" />

          <p className="text-[var(--foreground)]/70 text-base sm:text-lg mb-2 text-center">
            Total Already Withdrawn
          </p>
          <p className="text-[var(--foreground)] text-4xl sm:text-5xl font-extrabold text-center">
            {reward.toLocaleString()} $LBXO
          </p>

          <div className="mt-6" />

          <p className="text-[var(--foreground)]/70 text-base sm:text-lg mb-2 text-center">
            Total Available to Withdraw:
          </p>
          <p className="text-[var(--foreground)] text-3xl sm:text-4xl font-bold text-center">
            {balance?.toLocaleString() || 0} $LBXO
          </p>

          <p className="text-xs text-[var(--foreground)]/50 mt-6 mb-4 text-center">
            Rewards update automatically as new users join.
          </p>

          {/* Referral Link */}
          {refferCode && <RefLink refferCode={refferCode} />}

          {/* Countdown */}
          <WithdrawTime />

          {/* Withdraw Button and Warning */}
          <div className="flex flex-col items-center">
            <BtnWithdraw
              reward={balance || 0}
              disabled={payRequest || (balance || 0) < 500}
              refCount={newUsers || 0}
            />

            {withdrawRequested && (
              <div className="mt-4 text-[var(--foreground)] text-sm border border-[var(--border)] bg-[var(--background)]/50 rounded-xl px-4 py-2 shadow-md text-center">
                🎉 Withdrawal Request Successful! We’ll process it soon.
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

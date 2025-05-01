// src/components/dash/PoolVote.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where
} from 'firebase/firestore';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

type Pool = {
  id: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  question: string;
  options: string[];
  createdAt: string;
  petition?: string;
};

const LBX_MINT = new PublicKey('CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1');
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a';
const MIN_TO_VOTE = 10_000;
const TOTAL_SUPPLY = 50_000_000;

export default function PoolVote() {
  const wallet = useWallet();
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [balance, setBalance] = useState(0);
  const [resultsBalances, setResultsBalances] = useState<Record<string, number[]>>({});

  // 1) load pools
  useEffect(() => {
    getDocs(collection(db, 'Pools'))
      .then(snap => {
        const arr: Pool[] = [];
        snap.forEach(d => {
          arr.push({ id: d.id, ...(d.data() as Omit<Pool, 'id'>) });
        });
        setPools(arr);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 2) fetch on-chain LBXO balance
  useEffect(() => {
    const pk = wallet.publicKey;
    if (!pk) {
      setBalance(0);
      return;
    }
    (async () => {
      try {
        const res = await fetch(RPC, {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({
            jsonrpc:'2.0', id:1, method:'getTokenAccountsByOwner',
            params:[
              pk.toBase58(),
              { mint: LBX_MINT.toBase58() },
              { encoding:'jsonParsed' }
            ]
          })
        });
        const json = await res.json();
        const amt = json.result?.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
        setBalance(amt);
      } catch {
        setBalance(0);
      }
    })();
  }, [wallet.connected, wallet.publicKey]);

  // 3) check votes & tally balances
  useEffect(() => {
    const pk = wallet.publicKey;
    if (!pk) return;
    const address = pk.toBase58();
    const votesCol = collection(db, 'Votes');

    pools.forEach(pool => {
      // did user vote?
      getDocs(query(votesCol,
        where('walletAddress','==',address),
        where('poolId','==',pool.id)
      )).then(snap => {
        if (!snap.empty) setVoted(v => ({ ...v, [pool.id]: true }));
      });

      // tally balances
      getDocs(query(votesCol, where('poolId','==',pool.id)))
        .then(snap => {
          const sums = new Array(pool.options.length).fill(0);
          snap.forEach(d => {
            const data = d.data();
            const idx = data.selectedOption;
            const bal = data.balanceLBXO || 0;
            if (typeof idx === 'number' && sums[idx] !== undefined) {
              sums[idx] += bal;
            }
          });
          setResultsBalances(r => ({ ...r, [pool.id]: sums }));
        })
        .catch(console.error);
    });
  }, [wallet.connected, wallet.publicKey, pools]);

  const handleVote = async (pool: Pool, idx: number) => {
    const pk = wallet.publicKey;
    if (!pk || balance < MIN_TO_VOTE || voted[pool.id]) return;
    const address = pk.toBase58();
    try {
      await addDoc(collection(db, 'Votes'), {
        walletAddress: address,
        balanceLBXO: balance,
        selectedOption: idx,
        poolId: pool.id,
        dateStamp: new Date().toISOString()
      });
      setVoted(v => ({ ...v, [pool.id]: true }));
      setResultsBalances(r => {
        const prev = r[pool.id] || new Array(pool.options.length).fill(0);
        prev[idx] += balance;
        return { ...r, [pool.id]: prev };
      });
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center text-[var(--foreground)]">
        Loading pools...
      </div>
    );
  }
  if (!pools.length) {
    return (
      <div className="h-40 flex items-center justify-center text-[var(--foreground)]/50">
        No voting pools available.
      </div>
    );
  }

  return (
    <section className="w-full grid gap-8 sm:grid-cols-2 lg:grid-cols-3 p-6 bg-[var(--background)]">
      {pools.map(pool => {
        const sums = resultsBalances[pool.id] || new Array(pool.options.length).fill(0);
        const weightPct = ((balance / TOTAL_SUPPLY) * 100).toFixed(4);
        const now = Date.now();
        const start = Date.parse(pool.startDate);
        const end = Date.parse(pool.endDate);
        const progress = end > start ? Math.min(1, Math.max(0, (now - start) / (end - start))) : 0;

        return (
          <div
            key={pool.id}
            className="flex flex-col justify-between bg-[var(--background)] border border-[var(--border)]
                       rounded-2xl p-6 shadow hover:shadow-lg transition-shadow duration-200"
          >
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              {pool.question}
            </h3>

            {!voted[pool.id] ? (
              balance >= MIN_TO_VOTE ? (
                <div className="space-y-3">
                  {pool.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleVote(pool, i)}
                      className="w-full py-2 font-medium text-[var(--background)] bg-[var(--foreground)]
                                 rounded-full hover:bg-opacity-90 transition duration-150"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-[var(--foreground)]/80
                                border border-[var(--border)] bg-[var(--background)]/50 p-3 rounded-lg">
                  ⚠️ Need <strong>{MIN_TO_VOTE.toLocaleString()}</strong> LBXO. Short by{' '}
                  <strong>{(MIN_TO_VOTE - balance).toLocaleString()}</strong>.
                </div>
              )
            ) : (
              <div className="space-y-4">
                {pool.options.map((opt, i) => {
                  const pct = ((sums[i] / TOTAL_SUPPLY) * 100).toFixed(2);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[var(--foreground)]">
                        <span>{opt}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--foreground)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="mt-2 text-center text-xs text-[var(--foreground)]/60">
                  Your vote weight: <strong>{weightPct}%</strong> of total supply
                </div>
              </div>
            )}

            {/* Deadline bar & pool info */}
            <div className="mt-6 space-y-3">
              <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--foreground)] transition-width duration-500"
                  style={{ width: `${(progress * 100).toFixed(2)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--foreground)]/60">
                <span>Start: {new Date(start).toLocaleDateString()}</span>
                <span>End: {new Date(end).toLocaleDateString()}</span>
              </div>
              <div className="text-xs text-[var(--foreground)]/70 space-y-1">
                <div>Created: {pool.createdAt}</div>
                {pool.petition && <div>Petition: {pool.petition}</div>}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

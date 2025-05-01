'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

type Pool = {
  id: string;
  startDate: string;
  endDate: string;
  question: string;
  options: string[];
  createdAt: string;
  petition?: string;
};

export default function PoolVote() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Pools'));
        const poolsData: Pool[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          poolsData.push({
            id: doc.id,
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            question: data.question || '',
            options: data.options || [],
            createdAt: data.createdAt || '',
            petition: data.petition || '',
          });
        });

        setPools(poolsData);
      } catch (error) {
        console.error('Error fetching pools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-white">
        Loading pools...
      </div>
    );
  }

  if (pools.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-400">
        No voting pools available.
      </div>
    );
  }

  return (
    <section className="w-full flex flex-wrap justify-center gap-6 p-4 sm:p-6 bg-[var(--background)]">
      {pools.map((pool) => (
        <div
          key={pool.id}
          className="w-full max-w-md bg-[var(--background)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
        >
          <h3 className="text-lg sm:text-xl font-bold text-center text-[var(--foreground)]">
            {pool.question}
          </h3>
  
          <div className="flex flex-col gap-3 mt-2">
            {pool.options.map((option, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 bg-[var(--foreground)] text-[var(--background)] font-semibold rounded-full hover:opacity-90 transition-all duration-200"
              >
                {option}
              </button>
            ))}
          </div>
  
          <div className="text-xs text-[var(--foreground)]/70 mt-4 space-y-1">
            <p><span className="font-semibold">Start:</span> {pool.startDate}</p>
            <p><span className="font-semibold">End:</span> {pool.endDate}</p>
            {pool.petition && (
              <p><span className="font-semibold">Petition:</span> {pool.petition}</p>
            )}
            <p><span className="font-semibold">Created:</span> {pool.createdAt}</p>
          </div>
        </div>
      ))}
    </section>
  );
}  
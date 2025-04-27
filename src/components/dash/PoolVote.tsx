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
    <section className="w-full flex flex-wrap justify-center gap-6 p-4">
      {pools.map((pool) => (
        <div
          key={pool.id}
          className="w-80 md:w-96 bg-black border-2 border-gradient-to-r from-green-400 via-purple-500 to-green-400 rounded-2xl p-6 flex flex-col gap-4 shadow-xl hover:scale-105 transition-transform duration-300"
        >
          <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 via-purple-500 to-green-400 bg-clip-text text-transparent text-center">
            {pool.question}
          </h3>

          <div className="flex flex-col gap-2">
            {pool.options.map((option, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-purple-600 text-white font-semibold rounded-full hover:brightness-110 transition"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-400 mt-4">
            <p><strong>Start:</strong> {pool.startDate}</p>
            <p><strong>End:</strong> {pool.endDate}</p>
            {pool.petition && <p><strong>Petition:</strong> {pool.petition}</p>}
            <p className="mt-2"><strong>Created:</strong> {pool.createdAt}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

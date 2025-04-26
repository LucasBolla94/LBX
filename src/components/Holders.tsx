'use client';

import React, { useEffect, useState } from 'react';

export default function Holders() {
  const [holdersCount, setHoldersCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchHolders() {
      try {
        const response = await fetch('https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'lbx-holders',
            method: 'getTokenAccounts',
            params: {
              mint: 'CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1',
              page: 1,
              limit: 1000,
              options: {
                showZeroBalance: false // apenas quem tem saldo
              }
            },
          }),
        });

        const data = await response.json();

        if (data.result && data.result.token_accounts) {
          setHoldersCount(data.result.token_accounts.length);
        } else {
          console.error('Unexpected API response', data);
          setHoldersCount(0);
        }

      } catch (error) {
        console.error('Error fetching holders:', error);
        setHoldersCount(null);
      }
    }

    fetchHolders();
  }, []);

  if (holdersCount === null) {
    return <p className="text-green-600 font-semibold text-lg">Loading...</p>;
  }

  return (
    <p className="text-green-600 font-semibold text-lg">{holdersCount}</p>
  );
}

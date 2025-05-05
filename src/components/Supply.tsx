'use client';

import React, { useEffect, useState } from 'react';

export default function Supply() {
  const [supply, setSupply] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSupply() {
      try {
        const response = await fetch('https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenSupply',
            params: ['CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1'],
          }),
        });

        const data = await response.json();
        const { amount, decimals } = data.result?.value || {};

        if (amount && decimals !== undefined) {
          const rawValue = Number(amount) / 10 ** decimals;
          const formatted = Math.floor(rawValue).toLocaleString('en-US');
          setSupply(formatted);
        } else {
          setSupply('0');
        }
      } catch (error) {
        console.error('Error fetching supply:', error);
        setSupply(null);
      }
    }

    fetchSupply();
  }, []);

  return (
    <p className="font-bold text-lg sm:text-xl text-[var(--foreground)]">
      {supply === null ? 'Loading...' : `${supply} $LBXO`}
    </p>
  );
}

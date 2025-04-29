'use client';

import { useState } from 'react';

interface RefLinkProps {
  refferCode: string;
}

export default function RefLink({ refferCode }: RefLinkProps) {
  const [copied, setCopied] = useState(false);
  const link = `https://lbxgroup.online/ref/${refferCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="w-full mt-6 flex flex-col items-center">
      <p className="text-gray-400 text-sm mb-2">Your Referral Link:</p>
      <div className="w-full bg-gray-800 rounded-xl p-4 flex items-center justify-between shadow-md">
        <span className="text-green-300 text-sm truncate">{link}</span>
        <button
          onClick={handleCopy}
          className="ml-4 bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-4 rounded-xl text-sm transition-all"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

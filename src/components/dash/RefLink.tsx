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
    <div className="w-full mt-6 flex flex-col items-center gap-4">
  <p className="text-[var(--foreground)]/70 text-base sm:text-lg text-center">Your Referral Link:</p>

  <div className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
    <span className="text-[var(--foreground)] text-base sm:text-lg truncate w-full">{link}</span>

    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className="bg-[var(--foreground)] hover:opacity-90 text-[var(--background)] font-semibold py-2 px-4 rounded-xl text-sm sm:text-base transition-all"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  </div>

  {copied && (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[var(--foreground)] text-[var(--background)] text-sm sm:text-base px-6 py-3 rounded-xl shadow-xl transition-opacity duration-300 animate-fade-in-out z-50">
      ✅ Copied to clipboard!
    </div>
  )}
</div>
  );
}

'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)] bg-cover bg-center" style={{ backgroundImage: 'url("/shield.png")' }}>
      <div className="animate-pulse text-[var(--foreground)] text-xl sm:text-2xl font-bold bg-black/70 px-6 py-4 rounded-xl shadow-lg border border-[var(--border)]">
        🔄 Loading...
      </div>
    </div>
  );
}

'use client';

import { FaTelegramPlane } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function NoPromo() {
  return (
    <section className="w-full max-w-xl mx-auto text-center bg-[var(--background)] border border-[var(--border)] rounded-3xl shadow-md p-6 sm:p-10 text-[var(--foreground)]">
      {/* Título */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">📢 No Promotions Available</h1>

      {/* Texto explicativo */}
      <p className="text-base sm:text-lg text-[var(--foreground)]/80 leading-relaxed mb-6">
        At the moment, <strong>LBX Group</strong> has no active promotions or airdrops running. 
        However, we regularly launch new campaigns to reward our community and expand our ecosystem.
      </p>

      <p className="text-base sm:text-lg text-[var(--foreground)]/80 leading-relaxed mb-6">
        Stay tuned through our official channels so you don't miss any future updates or opportunities to earn rewards.
      </p>

      {/* Links para canais de comunicação */}
      <div className="flex justify-center gap-6 mt-6">
        <a
          href="https://x.com/lbxone"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-base sm:text-lg font-semibold text-[var(--foreground)] hover:text-blue-400 transition"
        >
          <FaXTwitter className="text-xl sm:text-2xl" />
          Follow on X
        </a>

        <a
          href="https://t.me/lbxone"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-base sm:text-lg font-semibold text-[var(--foreground)] hover:text-blue-500 transition"
        >
          <FaTelegramPlane className="text-xl sm:text-2xl" />
          Join Telegram
        </a>
      </div>
    </section>
  );
}

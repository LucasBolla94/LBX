'use client';

import { FaTelegramPlane, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // ✅ Novo ícone do X (Twitter)

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--background)] py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Texto */}
        <p className="text-[var(--foreground)] text-sm sm:text-base text-center sm:text-left tracking-wide">
          © {new Date().getFullYear()} LBX Group. All rights reserved.
        </p>

        {/* Ícones sociais */}
        <div className="flex gap-4 text-[var(--foreground)] text-xl">
          <a href="https://t.me/lbxone" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
            <FaTelegramPlane className="hover:text-blue-400 transition-colors" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="hover:text-pink-500 transition-colors" />
          </a>
          <a href="https://x.com/lbxone" target="_blank" rel="noopener noreferrer" aria-label="X">
            <FaXTwitter className="hover:text-sky-400 transition-colors" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <FaTiktok className="hover:text-white transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  );
}

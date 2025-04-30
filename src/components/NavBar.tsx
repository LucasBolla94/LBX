'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import WalletButton from './WalletButton';
import DashboardAccessButton from './DashboardAccessButton';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[var(--background)] shadow-md px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-2 sm:gap-0 relative text-[var(--foreground)]">
      
      {/* Logo que abre o menu */}
      <div className="flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
          <Image
            src="/logo.png"
            alt="LBX Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </button>
      </div>

      {/* Links de navegação (desktop) */}
      <div className="hidden sm:flex flex-wrap gap-6 text-base sm:text-lg justify-center">
        <Link href="/" className="hover:text-primary text-[var(--foreground)] transition">Home</Link>
        <Link href="/whitepaper" className="hover:text-primary text-[var(--foreground)] transition">Whitepaper</Link>
      </div>

      {/* Botões lado a lado */}
      <div className="flex items-center justify-center gap-4">
        {/* Versão normal no PC */}
        <div className="hidden sm:block">
          <DashboardAccessButton />
        </div>
        {/* Versão minimal no mobile */}
        <div className="sm:hidden">
          <DashboardAccessButton minimal />
        </div>
        <WalletButton />
      </div>

      {/* Menu aberto no mobile com animação */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-4 right-4 bg-[var(--background)] text-[var(--foreground)] rounded-xl shadow-lg p-4 flex flex-col gap-6 sm:hidden z-50 text-base"
          >
            <Link
              href="/"
              className="hover:text-primary text-[var(--foreground)] transition"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/whitepaper"
              className="hover:text-primary text-[var(--foreground)] transition"
              onClick={() => setMenuOpen(false)}
            >
              Whitepaper
            </Link>
            {/* New Links here */}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

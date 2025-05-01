'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import WalletButton from './WalletButton';
import DashboardAccessButton from './DashboardAccessButton';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // modo claro por padrão

  // Recupera o tema salvo no localStorage ao carregar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Aplica as cores e salva o tema no localStorage
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--background', isDarkMode ? '#000000' : '#ffffff');
    root.style.setProperty('--foreground', isDarkMode ? '#ffffff' : '#000000');
    root.style.setProperty('--border', isDarkMode ? '#333333' : '#cccccc');

    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <nav className="w-full bg-[var(--background)] shadow-md px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-2 sm:gap-0 relative text-[var(--foreground)]">

      {/* Logo */}
      <div className="flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
          <Image src="/logo.png" alt="LBX Logo" width={40} height={40} className="rounded-full" />
        </button>
      </div>

      {/* Links desktop */}
      <div className="hidden sm:flex flex-wrap gap-6 text-base sm:text-lg justify-center">
        <Link href="/" className="hover:text-primary text-[var(--foreground)] transition">Home</Link>
        <Link href="/whitepaper" className="hover:text-primary text-[var(--foreground)] transition">Whitepaper</Link>
        <Link href="/promo" className="hover:text-primary text-[var(--foreground)] transition">Rewards</Link>
      </div>

      {/* Ações (botões + switch) */}
      <div className="flex items-center justify-center gap-4">
        {/* Switch de tema visível em todas as telas */}
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-base">{isDarkMode ? '🌙' : '🌞'}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-full" />
          </label>
        </div>

        {/* Botão Dashboard completo em desktop */}
        <div className="hidden sm:block">
          <DashboardAccessButton />
        </div>

        {/* Botão Dashboard minimal no mobile */}
        <div className="sm:hidden">
          <DashboardAccessButton minimal />
        </div>

        {/* Wallet */}
        <WalletButton />
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-4 right-4 bg-[var(--background)] text-[var(--foreground)] rounded-xl shadow-lg p-4 flex flex-col gap-6 sm:hidden z-50 text-base"
          >
            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-primary transition">Home</Link>
            <Link href="/whitepaper" onClick={() => setMenuOpen(false)} className="hover:text-primary transition">Whitepaper</Link>
            <Link href="/promo" onClick={() => setMenuOpen(false)} className="hover:text-primary transition">Rewards</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

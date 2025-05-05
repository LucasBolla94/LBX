'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import WalletButton from './WalletButton';
import DashboardAccessButton from './DashboardAccessButton';
import VisitCounter from './Count';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background', isDarkMode ? '#000000' : '#ffffff');
    root.style.setProperty('--foreground', isDarkMode ? '#ffffff' : '#000000');
    root.style.setProperty('--border', isDarkMode ? '#333333' : '#cccccc');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <nav className="w-full bg-[var(--background)] shadow-md px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-2 sm:gap-0 relative text-[var(--foreground)] z-50">
      <VisitCounter />

      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="focus:outline-none">
          <Image src="/logo.png" alt="LBX Logo" width={40} height={40} className="rounded-full" />
        </Link>
      </div>

      {/* Links desktop */}
      <div className="hidden sm:flex flex-wrap gap-6 text-base sm:text-lg justify-center">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <Link href="/whitepaper" className="hover:text-primary transition">Whitepaper</Link>
        <Link href="/promo" className="hover:text-primary transition">Rewards</Link>
        <Link href="/help" className="hover:text-primary transition">Help</Link>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        {/* Dark mode switch */}
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-base">{isDarkMode ? '🌙' : '🌞'}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all" />
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-full" />
          </label>
        </div>

        <div className="hidden sm:block">
          <DashboardAccessButton />
        </div>

        <div className="sm:hidden">
          <DashboardAccessButton minimal />
        </div>

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
            className="absolute top-20 left-4 right-4 bg-[var(--background)] text-[var(--foreground)] rounded-xl shadow-lg p-4 flex flex-col gap-6 sm:hidden text-base z-50"
          >
            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-primary transition">Home</Link>
            <Link href="/whitepaper" onClick={() => setMenuOpen(false)} className="hover:text-primary transition">Whitepaper</Link>
            <Link href="/promo" onClick={() => setMenuOpen(false)} className="hover:text-primary transition">Rewards</Link>
            <Link href="/help" onClick={() => setMenuOpen(false)} className="hover:text-primary transition">Help</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

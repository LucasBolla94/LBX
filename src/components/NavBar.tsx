'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import WalletButton from './WalletButton';
import DashboardAccessButton from './DashboardAccessButton';
import VisitCounter from './Count';
import { FaBars, FaTimes } from 'react-icons/fa';

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
  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <nav className="w-full bg-[var(--background)] shadow-md px-4 sm:px-6 py-3 flex items-center justify-between relative z-50 text-[var(--foreground)]">
      <VisitCounter />

      {/* Logo + Hamburger button (for mobile) */}
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          onClick={toggleMenu}
          className="flex items-center gap-2 sm:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <Image src="/logo.png" alt="LBX Logo" width={40} height={40} className="rounded-full" />
          {menuOpen ? (
            <FaTimes className="text-xl" />
          ) : (
            <FaBars className="text-xl" />
          )}
        </button>

        {/* Desktop logo only */}
        <Link href="/" className="hidden sm:block">
          <Image src="/logo.png" alt="LBX Logo" width={40} height={40} className="rounded-full" />
        </Link>
      </div>

      {/* Desktop links */}
      <div className="hidden sm:flex gap-6 text-base sm:text-lg">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <Link href="/whitepaper" className="hover:text-primary transition">Whitepaper</Link>
        <Link href="/promo" className="hover:text-primary transition">Rewards</Link>
        <Link href="/help" className="hover:text-primary transition">Help</Link>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Theme switch */}
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

        {/* Dashboard + Wallet */}
        <div className="hidden sm:block">
          <DashboardAccessButton />
        </div>
        <div className="sm:hidden">
          <DashboardAccessButton minimal />
        </div>
        <WalletButton />
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-[var(--background)] text-[var(--foreground)] shadow-lg rounded-b-xl py-6 px-6 flex flex-col gap-6 sm:hidden z-40"
          >
            <Link href="/" onClick={toggleMenu} className="hover:text-primary transition">Home</Link>
            <Link href="/whitepaper" onClick={toggleMenu} className="hover:text-primary transition">Whitepaper</Link>
            <Link href="/promo" onClick={toggleMenu} className="hover:text-primary transition">Rewards</Link>
            <Link href="/help" onClick={toggleMenu} className="hover:text-primary transition">Help</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

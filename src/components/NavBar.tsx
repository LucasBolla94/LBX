'use client';

import Link from 'next/link';
import WalletButton from './WalletButton';
import DashboardAccessButton from './DashboardAccessButton';

export default function NavBar() {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-primary">LBX Group</div>
      <div className="space-x-4 text-sm">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <Link href="/whitepaper" className="hover:text-primary transition">Whitepaper</Link>
        <DashboardAccessButton />
      </div>
      <div>
        <WalletButton />
      </div>
    </nav>
  );
}

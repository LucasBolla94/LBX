'use client';

import Image from 'next/image';

export default function LoadPage() {
  return (
    <div className="w-screen h-screen bg-black flex flex-col justify-center items-center px-6">
      <div className="flex flex-col items-center animate-pulse">
        <Image
          src="/logo.png"
          alt="Logo"
          width={180}
          height={180}
          className="mb-8 drop-shadow-lg"
        />
        <p className="text-center text-2xl md:text-3xl font-bold tracking-wide leading-relaxed bg-gradient-to-r from-green-400 via-purple-500 to-green-400 text-transparent bg-clip-text">
          You need 500,000 $LBXO<br/>to access the Dashboard,<br/>limited to holders.
        </p>
      </div>
    </div>
  );
}

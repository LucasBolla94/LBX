'use client';

export default function Footer() {
  return (
    <footer className="w-full h-20 flex items-center justify-center border-t border-gray-600 bg-black">
      <p className="text-white text-lg tracking-wider text-center">
        © {new Date().getFullYear()} LBX Group. All rights reserved.
      </p>
    </footer>
  );
}

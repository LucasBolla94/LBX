'use client';

export default function Footer() {
  return (
    <footer className="w-full h-20 flex items-center justify-center border-t border-gray-600 bg--background">
      <p className="text--foreground text-lg tracking-wider text-center">
        © {new Date().getFullYear()} LBX Group. All rights reserved.
      </p>
    </footer>
  );
}

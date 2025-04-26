export default function Footer() {
  return (
    <footer className="w-full h-16 flex items-center justify-center border-t text-sm text-gray-500 bg-white">
      <p>© {new Date().getFullYear()} LBX Group. All rights reserved.</p>
    </footer>
  );
}

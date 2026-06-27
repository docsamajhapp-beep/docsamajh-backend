'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 py-4 px-6 md:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FF5500]">
            <span className="text-white font-extrabold text-base">D</span>
          </div>
          <span className="font-extrabold text-xl text-gray-900 tracking-tight">
            Doc<span className="text-[#FF5500]">Samajh</span>
          </span>
        </Link>

        {/* Made for India Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#FF5500]/20 bg-[#FF5500]/5 text-[#FF5500] font-semibold text-xs md:text-sm">
          <span>🇮🇳</span> Made for India
        </div>
      </div>
    </header>
  );
}

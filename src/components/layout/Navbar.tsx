'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale } from 'lucide-react';

const navItems = [
  { name: '首页', href: '/' },
  { name: '法律咨询', href: '/consultation' },
  { name: '文书翻译', href: '/translation' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#1e40af] rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1e40af]">桂律通</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-[#1e40af] bg-blue-50'
                    : 'text-gray-700 hover:text-[#1e40af] hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

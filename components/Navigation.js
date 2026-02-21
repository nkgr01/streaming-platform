'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <span className="text-3xl">🎬</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              StreamingPlatform
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/">
            <span className="text-white hover:text-blue-400 transition-colors cursor-pointer font-semibold">
              Accueil
            </span>
          </Link>
          <Link href="/discover">
            <span className="text-white hover:text-purple-400 transition-colors font-semibold">
              🌟 Découvrir
            </span>
          </Link>
          <Link href="/trending">
            <span className="text-white hover:text-red-400 transition-colors font-semibold">
              🔥 Tendances
            </span>
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>

        {isMounted && isOpen && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 border-b border-gray-700 p-6 md:hidden">
            <div className="space-y-4">
              <Link href="/">
                <span className="block text-white hover:text-blue-400 transition-colors cursor-pointer font-semibold">
                  Accueil
                </span>
              </Link>
              <Link href="/discover">
                <span className="block text-white hover:text-purple-400 transition-colors font-semibold">
                  🌟 Découvrir
                </span>
              </Link>
              <Link href="/trending">
                <span className="block text-white hover:text-red-400 transition-colors font-semibold">
                  🔥 Tendances
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

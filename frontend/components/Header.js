'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold hover:text-gray-300 transition flex items-center">
            <span className="bg-white text-gray-800 rounded-lg px-2 py-1 mr-2">DSM</span>
            <span className="hidden sm:inline">eventos</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`hover:text-gray-300 transition flex items-center space-x-1 ${
                pathname === '/' ? 'text-white' : ''
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Eventos</span>
            </Link>
            
            {isLoggedIn && (
              <>
                <Link 
                  href="/seus-eventos" 
                  className={`px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 transition ${
                    pathname === '/seus-eventos' ? 'bg-white/10' : 'hover:text-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Seus Eventos</span>
                </Link>
                
                <Link 
                  href="/criar-eventos" 
                  className={`hover:text-gray-300 transition flex items-center space-x-1 ${
                    pathname === '/criar-eventos' ? 'text-white' : ''
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Criar Evento</span>
                </Link>
                
                <Link 
                  href="/perfil" 
                  className={`hover:text-gray-300 transition flex items-center space-x-1 ${
                    pathname === '/perfil' ? 'text-white' : ''
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Perfil</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition font-semibold shadow-md"
                >
                  Sair
                </button>
              </>
            )}
            
            {!isLoggedIn && (
              <>
                <Link 
                  href="/login" 
                  className="hover:text-gray-300 transition px-4 py-2 rounded-lg"
                >
                  Login
                </Link>
                <Link 
                  href="/criar-conta" 
                  className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg transition font-semibold shadow-md"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4 space-y-2">
            <Link 
              href="/" 
              className="block px-4 py-2 hover:bg-white/10 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Eventos
            </Link>
            
            {isLoggedIn && (
              <>
                <Link 
                  href="/seus-eventos" 
                  className="block px-4 py-2 hover:bg-white/10 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Seus Eventos
                </Link>
                <Link 
                  href="/criar-eventos" 
                  className="block px-4 py-2 hover:bg-white/10 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Criar Evento
                </Link>
                <Link 
                  href="/perfil" 
                  className="block px-4 py-2 hover:bg-white/10 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Perfil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  Sair
                </button>
              </>
            )}
            
            {!isLoggedIn && (
              <>
                <Link 
                  href="/login" 
                  className="block px-4 py-2 hover:bg-white/10 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/criar-conta" 
                  className="block px-4 py-2 bg-white text-gray-800 hover:bg-gray-100 rounded-lg transition font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Criar Conta
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

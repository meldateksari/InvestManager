'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition"
      >
        <div className="hidden md:block">
          <span className="text-gray-700">{user?.firstName || 'Kullanıcı'}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white text-sm">
            {user?.firstName?.[0]?.toUpperCase() || 'K'}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link 
            href="/profile" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profilim
          </Link>
          <Link 
            href="/account" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Hesap Ayarları
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 
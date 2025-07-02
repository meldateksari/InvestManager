'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Dışarı tıklanınca menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  // Animation configurations
  const menuAnimation = {
    initial: { opacity: 0, scale: 0.95, y: -10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
    transition: { duration: 0.2 }
  };

  const itemAnimation = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.15 }
  };

  const menuItems = [
    {
      href: '/profile',
      label: 'Profilim',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      href: '/portfolio',
      label: 'Portföyüm',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={toggleMenu}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100/50 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="hidden md:block">
          <motion.span 
            className="text-gray-700 font-medium"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {user?.firstName || 'Kullanıcı'}
          </motion.span>
        </div>
        <motion.div 
          className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-md"
          animate={{
            boxShadow: isOpen 
              ? "0 8px 25px -5px rgba(59, 130, 246, 0.4)" 
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          transition={{ duration: 0.2 }}
        >
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt="Profil" 
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-semibold">
              {user?.firstName?.[0]?.toUpperCase() || 'K'}
            </span>
          )}
        </motion.div>
        
        {/* Dropdown indicator */}
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
          className="hidden md:block"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              {...menuAnimation}
              className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50 overflow-hidden"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* User info header */}
              <motion.div
                {...itemAnimation}
                className="px-4 py-3 border-b border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profil" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-semibold">
                        {user?.firstName?.[0]?.toUpperCase() || 'K'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Kullanıcı'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </motion.div>

              {/* Menu items */}
              <div className="py-1">
                {menuItems.map((item, index) => (
                  <motion.div 
                    key={item.href}
                    {...itemAnimation}
                    transition={{ ...itemAnimation.transition, delay: index * 0.05 }}
                  >
                    <Link 
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors duration-150 group"
                    >
                      <span className="text-gray-400 group-hover:text-gray-600 transition-colors duration-150">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Separator */}
                <motion.div 
                  {...itemAnimation}
                  transition={{ ...itemAnimation.transition, delay: 0.1 }}
                  className="border-t border-gray-100 my-1"
                />
                
                {/* Logout button */}
                <motion.div 
                  {...itemAnimation}
                  transition={{ ...itemAnimation.transition, delay: 0.15 }}
                >
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors duration-150 group"
                  >
                    <span className="text-red-400 group-hover:text-red-600 transition-colors duration-150">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </span>
                    <span className="font-medium">Çıkış Yap</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu; 
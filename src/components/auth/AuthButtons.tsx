'use client';

import { useState } from 'react';
import Link from 'next/link';
import SignUpModal from '../modals/SignUpModal';
import LoginModal from '../modals/LoginModal';
import { useAuth } from '../../context/AuthContext';
import UserMenu from '../navbar/UserMenu';

const AuthButtons = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, loading } = useAuth();

  const toggleModals = () => {
    setIsSignUpOpen(!isSignUpOpen);
    setIsLoginOpen(!isLoginOpen);
  };

  // Loading durumunda boş div döndür
  if (loading) {
    return <div className="h-8" />;
  }

  // Kullanıcı giriş yapmışsa Portföy butonu ve UserMenu'yü göster
  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Link 
          href="/portfolio"
          className="bg-accent text-light px-4 py-2 rounded-md hover:bg-accent/90 transition-colors font-medium"
        >
          My Portfolio
        </Link>
        <UserMenu />
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa login/signup butonlarını göster
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setIsLoginOpen(true)}
        className="text-main hover:text-heading"
      >
        Login
      </button>
      <button
        onClick={() => setIsSignUpOpen(true)}
        className="bg-accent text-light px-4 py-2 rounded-md hover:bg-accent/90"
      >
        Sign Up
      </button>

      {isSignUpOpen && (
        <SignUpModal 
          isOpen={isSignUpOpen} 
          onClose={() => setIsSignUpOpen(false)}
          onToggleModal={toggleModals}
        />
      )}
      {isLoginOpen && (
        <LoginModal 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)}
          onToggleModal={toggleModals}
        />
      )}
    </div>
  );
};

export default AuthButtons; 
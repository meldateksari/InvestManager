'use client';

import { useState } from 'react';
import SignUpModal from '../modals/SignUpModal';
import LoginModal from '../modals/LoginModal';
import { useAuth } from '@/app/context/AuthContext';
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

  // Kullanıcı giriş yapmışsa UserMenu'yü göster
  if (user) {
    return <UserMenu />;
  }

  // Kullanıcı giriş yapmamışsa login/signup butonlarını göster
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setIsLoginOpen(true)}
        className="text-gray-600 hover:text-gray-900"
      >
        Giriş Yap
      </button>
      <button
        onClick={() => setIsSignUpOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Kayıt Ol
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
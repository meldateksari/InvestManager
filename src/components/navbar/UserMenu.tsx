'use client';

import { useAuth } from '../../context/AuthContext';
import LanguageSwitch from './LanguageSwitch';

export default function UserMenu() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-4">
      <LanguageSwitch />
      <button
        onClick={logout}
        className="text-main hover:text-heading transition-colors"
      >
        Çıkış Yap
      </button>
    </div>
  );
} 
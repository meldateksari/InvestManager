'use client';

import React, { createContext, useContext, useState } from 'react';
import enTranslations from '../../locales/en.json';
import trTranslations from '../../locales/tr.json';

type LanguageContextType = {
  translations: typeof enTranslations;
  toggleLanguage: () => void;
  currentLang: string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState('tr'); // Varsayılan dil Türkçe

  const translations = currentLang === 'tr' ? trTranslations : enTranslations;

  const toggleLanguage = () => {
    setCurrentLang(currentLang === 'tr' ? 'en' : 'tr');
  };

  return (
    <LanguageContext.Provider value={{ translations, toggleLanguage, currentLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 
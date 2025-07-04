'use client';

import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function LanguageSwitch() {
  const { currentLang, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{currentLang.toUpperCase()}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-[10px] opacity-60"
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30"
            />
            
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute right-0 mt-1 py-1 w-16 bg-white rounded-md shadow-lg border border-gray-100 z-40"
            >
              {['tr', 'en'].map((lang) => (
                <motion.button
                  key={lang}
                  onClick={() => {
                    if (lang !== currentLang) {
                      toggleLanguage();
                    }
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-center w-full px-2 py-1 text-sm
                    ${lang === currentLang ? 'text-blue-500 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                  whileHover={{ x: 2 }}
                >
                  {lang.toUpperCase()}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 
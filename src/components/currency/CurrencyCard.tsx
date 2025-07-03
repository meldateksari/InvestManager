'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CurrencyCardProps } from '../../types/currency';

const CurrencyCard: React.FC<CurrencyCardProps> = React.memo(({ currency, onClick }) => {
  const isPositive = currency.changePercent >= 0;
  
  // Döviz koduna göre emoji/icon belirleme
  const getCurrencyIcon = React.useCallback((code: string) => {
    const icons: Record<string, string> = {
      'USD': '🇺🇸',
      'EUR': '🇪🇺',
      'GBP': '🇬🇧',
      'JPY': '🇯🇵',
      'CHF': '🇨🇭',
      'CAD': '🇨🇦',
      'AUD': '🇦🇺',
      'SEK': '🇸🇪',
      'NOK': '🇳🇴',
      'DKK': '🇩🇰',
      'CNY': '🇨🇳',
      'RUB': '🇷🇺',
      'SAR': '🇸🇦',
      'KWD': '🇰🇼',
      'QAR': '🇶🇦',
      'AED': '🇦🇪'
    };
    return icons[code] || '💱';
  }, []);

  const formatCurrency = React.useCallback((value: number) => {
    if (value < 1) {
      return value.toFixed(4);
    } else if (value < 10) {
      return value.toFixed(3);
    } else {
      return value.toFixed(2);
    }
  }, []);

  // Memoize edilen değerler
  const currencyIcon = React.useMemo(() => getCurrencyIcon(currency.code), [currency.code, getCurrencyIcon]);
  const formattedSelling = React.useMemo(() => formatCurrency(currency.selling), [currency.selling, formatCurrency]);
  const formattedBuying = React.useMemo(() => formatCurrency(currency.buying), [currency.buying, formatCurrency]);
  const formattedTime = React.useMemo(() => 
    new Date(currency.updateTime).toLocaleTimeString('tr-TR'), 
    [currency.updateTime]
  );

  const handleClick = React.useCallback(() => {
    onClick?.(currency);
  }, [onClick, currency]);

  return (
    <motion.div
      layout
      initial={false}
      animate={{ 
        opacity: 1,
        scale: 1,
        transition: { duration: 0.2 }
      }}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      className={`bg-card rounded-2xl shadow-soft border border-gray-100 p-5 cursor-pointer transition-all duration-300 hover:shadow-soft-lg hover:border-accent/20 ${
        onClick ? 'hover:bg-accent/2' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{currencyIcon}</span>
          <div>
            <h3 className="font-bold text-heading text-sm">{currency.code}</h3>
            <p className="text-xs text-muted truncate max-w-[100px]">{currency.name}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${isPositive ? 'text-success' : 'text-red-600'}`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-xs font-medium">
            {isPositive ? '+' : ''}{currency.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <motion.div 
          className="flex items-center justify-between"
          key={`selling-${currency.selling}`}
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-xs text-muted">Satış:</span>
          <span className="font-bold text-lg text-heading">
            ₺{formattedSelling}
          </span>
        </motion.div>
        
        <motion.div 
          className="flex items-center justify-between"
          key={`buying-${currency.buying}`}
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-xs text-muted">Alış:</span>
          <span className="font-medium text-sm text-main">
            ₺{formattedBuying}
          </span>
        </motion.div>

        <motion.div 
          className="flex items-center justify-between"
          key={`change-${currency.change}`}
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-xs text-muted">Değişim:</span>
          <span className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-red-600'}`}>
            {currency.change}
          </span>
        </motion.div>
      </div>

      <div className="mt-3 pt-2 border-t border-muted/20">
        <div className="text-xs text-muted text-center">
          Son güncelleme: {formattedTime}
        </div>
      </div>
    </motion.div>
  );
});

// Display name for debugging
CurrencyCard.displayName = 'CurrencyCard';

export default CurrencyCard; 
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CurrencyCardProps } from '../../types/currency';

const CurrencyCard: React.FC<CurrencyCardProps> = ({ currency, onClick }) => {
  const isPositive = currency.changePercent >= 0;
  
  // Döviz koduna göre emoji/icon belirleme
  const getCurrencyIcon = (code: string) => {
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
  };

  const formatCurrency = (value: number) => {
    if (value < 1) {
      return value.toFixed(4);
    } else if (value < 10) {
      return value.toFixed(3);
    } else {
      return value.toFixed(2);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      className={`bg-card rounded-2xl shadow-soft border border-gray-100 p-5 cursor-pointer transition-all duration-300 hover:shadow-soft-lg hover:border-accent/20 ${
        onClick ? 'hover:bg-accent/2' : ''
      }`}
      onClick={() => onClick?.(currency)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCurrencyIcon(currency.code)}</span>
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
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Satış:</span>
          <span className="font-bold text-lg text-heading">
            ₺{formatCurrency(currency.selling)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Alış:</span>
          <span className="font-medium text-sm text-main">
            ₺{formatCurrency(currency.buying)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Değişim:</span>
          <span className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-red-600'}`}>
            {currency.change}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-muted/20">
        <div className="text-xs text-muted text-center">
          Son güncelleme: {new Date(currency.updateTime).toLocaleTimeString('tr-TR')}
        </div>
      </div>
    </motion.div>
  );
};

export default CurrencyCard; 
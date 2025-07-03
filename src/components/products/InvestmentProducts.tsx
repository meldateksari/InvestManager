'use client';

import { useState } from 'react';
import { useSymbols, Symbol } from '../../hooks/useSymbols';
import { motion, AnimatePresence } from 'framer-motion';

interface InvestmentProductsProps {
  onRefresh?: () => void;
}

export default function InvestmentProducts({ onRefresh }: InvestmentProductsProps) {
  const { symbols, loading, error, lastUpdate, fetchSymbols, getSymbolsByCategory } = useSymbols();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', label: 'Tümü', icon: '📊' },
    { key: 'currency', label: 'Döviz', icon: '💱' },
    { key: 'crypto', label: 'Kripto', icon: '🪙' },
    { key: 'metal', label: 'Metal', icon: '🥇' },
    { key: 'stock', label: 'Hisse', icon: '📈' }
  ];

  // Filtrelenmiş sembolleri al
  const filteredSymbols = () => {
    let filtered = selectedCategory === 'all' ? symbols : getSymbolsByCategory(selectedCategory);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(symbol => 
        symbol.symbol.toLowerCase().includes(query) ||
        symbol.name.toLowerCase().includes(query) ||
        symbol.description.toLowerCase().includes(query)
      );
    }
    
    return filtered.slice(0, 8); // İlk 8 sonucu göster
  };

  const handleRefresh = () => {
    fetchSymbols();
    onRefresh?.();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Yatırım Ürünleri</h3>
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="h-5 w-20 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Yatırım Ürünleri</h3>
        <div className="flex items-center space-x-2">
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              {lastUpdate.toLocaleTimeString('tr-TR')}
            </span>
          )}
          <button
            onClick={handleRefresh}
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Yenile"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span className="text-amber-600">⚠️</span>
            <span className="text-sm text-amber-700">{error}</span>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.key
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Sembol veya isim ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredSymbols().map((symbol) => (
            <SymbolCard key={symbol.id} symbol={symbol} />
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredSymbols().length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">🔍</div>
          <p className="text-gray-500">Sonuç bulunamadı</p>
          <p className="text-sm text-gray-400">Farklı bir arama terimi deneyin</p>
        </div>
      )}
    </div>
  );
}

interface SymbolCardProps {
  symbol: Symbol;
}

function SymbolCard({ symbol }: SymbolCardProps) {
  const isPositive = symbol.changePercent > 0;
  const isNegative = symbol.changePercent < 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{symbol.icon}</span>
          <div>
            <p className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
              {symbol.symbol}
            </p>
            <p className="text-xs text-gray-500 line-clamp-1">
              {symbol.name}
            </p>
          </div>
        </div>
        
        {/* Category Badge */}
        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryStyle(symbol.category)}`}>
          {getCategoryLabel(symbol.category)}
        </span>
      </div>

      {/* Price */}
      <div className="space-y-1">
        <p className="text-lg font-semibold text-gray-900">
          {typeof symbol.price === 'number' 
            ? symbol.price.toLocaleString('tr-TR') 
            : symbol.price
          }
        </p>
        
        {/* Change */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
          }`}>
            {symbol.change}
          </span>
          
          <span className={`text-xs px-2 py-1 rounded-full ${
            isPositive 
              ? 'bg-green-100 text-green-800' 
              : isNegative 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-800'
          }`}>
            {isPositive ? '+' : ''}{symbol.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Hacim</span>
          <span className="font-medium">{symbol.volume}</span>
        </div>
      </div>
    </motion.div>
  );
}

function getCategoryStyle(category: string): string {
  const styles: Record<string, string> = {
    currency: 'bg-blue-100 text-blue-700',
    crypto: 'bg-purple-100 text-purple-700',
    metal: 'bg-yellow-100 text-yellow-700',
    stock: 'bg-green-100 text-green-700',
    other: 'bg-gray-100 text-gray-700'
  };
  return styles[category] || styles.other;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    currency: 'Döviz',
    crypto: 'Kripto',
    metal: 'Metal',
    stock: 'Hisse',
    other: 'Diğer'
  };
  return labels[category] || 'Diğer';
} 
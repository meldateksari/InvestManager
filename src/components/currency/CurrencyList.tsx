'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Search, Filter, AlertCircle, Clock } from 'lucide-react';
import { CurrencyListProps, CurrencyRate } from '../../types/currency';
import CurrencyCard from './CurrencyCard';

interface ExtendedCurrencyListProps extends CurrencyListProps {
  refreshing?: boolean; // Yenileme durumu için yeni prop
}

const CurrencyList: React.FC<ExtendedCurrencyListProps> = ({ 
  currencies, 
  loading = false, 
  refreshing = false,
  error = null, 
  onRefresh,
  onCurrencySelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rate' | 'change'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyRate | null>(null);

  // Filtreleme ve sıralama
  const filteredAndSortedCurrencies = React.useMemo(() => {
    let filtered = currencies.filter(currency =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'rate':
          aValue = a.rate;
          bValue = b.rate;
          break;
        case 'change':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue, 'tr') 
          : bValue.localeCompare(aValue, 'tr');
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [currencies, searchTerm, sortBy, sortOrder]);

  const handleSort = (field: 'name' | 'rate' | 'change') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCurrencyClick = (currency: CurrencyRate) => {
    setSelectedCurrency(currency);
    // Eğer onCurrencySelect prop'u varsa, döviz kodunu gönder
    onCurrencySelect?.(currency.code);
  };

  // Sadece ilk yüklemede loading ekranı göster
  if (loading && currencies.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted">Döviz kurları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-heading">Canlı Döviz Kurları</h2>
          <p className="text-muted mt-1">Türk Lirası karşısındaki güncel kurlar</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-accent text-light px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Yenileniyor...' : 'Yenile'}</span>
          </motion.button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="text-yellow-800 font-medium">Uyarı</p>
            <p className="text-yellow-700 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Döviz ara (örn: Dolar, USD)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-muted/30 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-card"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-muted" />
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
              setSortBy(field);
              setSortOrder(order);
            }}
            className="border border-muted/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent bg-card text-main"
          >
            <option value="name-asc">İsme göre (A-Z)</option>
            <option value="name-desc">İsme göre (Z-A)</option>
            <option value="rate-desc">Kuruna göre (Yüksek-Düşük)</option>
            <option value="rate-asc">Kuruna göre (Düşük-Yüksek)</option>
            <option value="change-desc">Değişime göre (En çok artan)</option>
            <option value="change-asc">Değişime göre (En çok düşen)</option>
          </select>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center justify-center text-sm text-gray-500">
        <Clock className="w-4 h-4 mr-2" />
        <span>Son güncelleme: {new Date().toLocaleString('tr-TR')}</span>
        {refreshing && (
          <span className="ml-2 flex items-center text-blue-600">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Güncelleniyor...
          </span>
        )}
      </div>

      {/* Currency Grid */}
      <AnimatePresence>
        {filteredAndSortedCurrencies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sonuç bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinizi değiştirip tekrar deneyin.</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredAndSortedCurrencies.map((currency, index) => (
              <motion.div
                key={currency.code}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <CurrencyCard
                  currency={currency}
                  onClick={handleCurrencyClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Currency Detail Modal */}
      <AnimatePresence>
        {selectedCurrency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCurrency(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">
                  {selectedCurrency.code === 'USD' ? '🇺🇸' : 
                   selectedCurrency.code === 'EUR' ? '🇪🇺' : 
                   selectedCurrency.code === 'GBP' ? '🇬🇧' : '💱'}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedCurrency.name}</h3>
                <p className="text-gray-600">{selectedCurrency.code}/TRY</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Satış Fiyatı</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ₺{selectedCurrency.selling.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-blue-600 mb-1">Alış</div>
                    <div className="font-semibold text-blue-900">
                      ₺{selectedCurrency.buying.toFixed(4)}
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 text-center ${
                    selectedCurrency.changePercent >= 0 
                      ? 'bg-green-50 text-green-900' 
                      : 'bg-red-50 text-red-900'
                  }`}>
                    <div className={`text-xs mb-1 ${
                      selectedCurrency.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Değişim
                    </div>
                    <div className="font-semibold">
                      {selectedCurrency.changePercent >= 0 ? '+' : ''}
                      {selectedCurrency.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={() => setSelectedCurrency(null)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencyList; 
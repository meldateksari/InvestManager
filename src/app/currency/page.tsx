'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Globe, Clock, BarChart3 } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';
import CurrencyList from '../../components/currency/CurrencyList';
import TradingViewChart from '../../components/tradingView/TradingViewChart';
import { currencyToTradingViewSymbol, formatSymbolName } from '../../utils/currencyUtils';

const CurrencyPage = () => {
  const { currencies, loading, refresh } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>('USD');
  const [showChart, setShowChart] = React.useState(true); // Varsayılan olarak açık

  // En çok yükselen ve düşenleri hesapla
  const topGainers = React.useMemo(() => {
    return [...currencies]
      .filter(c => c.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 3);
  }, [currencies]);

  const topLosers = React.useMemo(() => {
    return [...currencies]
      .filter(c => c.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 3);
  }, [currencies]);

  const averageChange = React.useMemo(() => {
    if (currencies.length === 0) return 0;
    const sum = currencies.reduce((acc, curr) => acc + curr.changePercent, 0);
    return sum / currencies.length;
  }, [currencies]);

  // Seçilen dövizin bilgilerini al
  const selectedCurrencyData = React.useMemo(() => {
    return currencies.find(c => c.code === selectedCurrency);
  }, [currencies, selectedCurrency]);

  // Döviz seçim handler'ı
  const handleCurrencySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    // Grafik zaten açık, sadece sembolü değiştir
    if (!showChart) {
      setShowChart(true);
    }
    
    // Grafik alanına yumuşak scroll
    setTimeout(() => {
      const chartElement = document.getElementById('currency-chart');
      if (chartElement) {
        chartElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <span className="text-gray-300">→</span>
              <h1 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Globe className="w-6 h-6 text-blue-600" />
                <span>Exchange Rates</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>Updates every 30 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Anlık Döviz Kurları
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Türk Lirası karşısında tüm major dövizlerin güncel kurlarını takip edin. 
            Veriler gerçek zamanlı olarak güncellenmektedir.
          </p>
          
          {/* Quick Chart Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {['USD', 'EUR', 'GBP', 'JPY'].map((code) => (
              <motion.button
                key={code}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCurrencySelect(code)}
                className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">{code} Grafiği</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Live Chart Section */}
        {showChart && selectedCurrencyData && (
          <motion.div
            id="currency-chart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {formatSymbolName(selectedCurrency, selectedCurrencyData.name)} Grafiği
                  </h3>
                  <p className="text-sm text-gray-600">
                    Anlık fiyat hareketleri ve teknik analiz
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ₺{selectedCurrencyData.rate.toFixed(4)}
                  </div>
                  <div className={`text-sm font-medium ${
                    selectedCurrencyData.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedCurrencyData.changePercent >= 0 ? '+' : ''}{selectedCurrencyData.changePercent.toFixed(2)}%
                  </div>
                </div>
                <button
                  onClick={() => setShowChart(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden">
              <TradingViewChart
                symbol={currencyToTradingViewSymbol(selectedCurrency)}
                height={500}
                theme="light"
                interval="15"
                locale="tr"
              />
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        {!loading && currencies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {/* Ortalama Değişim */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ortalama Değişim</h3>
                <TrendingUp className={`w-6 h-6 ${averageChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div className={`text-2xl font-bold ${averageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {averageChange >= 0 ? '+' : ''}{averageChange.toFixed(2)}%
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Tüm dövizlerin ortalama performansı
              </p>
            </div>

            {/* En Çok Yükselen */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">En Çok Yükselen</h3>
                <div className="text-2xl">📈</div>
              </div>
              {topGainers.length > 0 ? (
                <div className="space-y-2">
                  {topGainers.map((currency, index) => (
                    <div key={currency.code} className="flex items-center justify-between cursor-pointer hover:bg-green-50 p-1 rounded" onClick={() => handleCurrencySelect(currency.code)}>
                      <span className="text-sm font-medium text-gray-700">
                        {index + 1}. {currency.code}
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        +{currency.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Yükselen döviz yok</p>
              )}
            </div>

            {/* En Çok Düşen */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-red-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">En Çok Düşen</h3>
                <div className="text-2xl">📉</div>
              </div>
              {topLosers.length > 0 ? (
                <div className="space-y-2">
                  {topLosers.map((currency, index) => (
                    <div key={currency.code} className="flex items-center justify-between cursor-pointer hover:bg-red-50 p-1 rounded" onClick={() => handleCurrencySelect(currency.code)}>
                      <span className="text-sm font-medium text-gray-700">
                        {index + 1}. {currency.code}
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        {currency.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Düşen döviz yok</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Currency List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <CurrencyList
            currencies={currencies}
            loading={loading}
            onRefresh={refresh}
            onCurrencySelect={handleCurrencySelect}
          />
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Döviz Kurları Hakkında
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Bilmeniz Gerekenler
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Kurlar 30 saniyede bir otomatik güncellenir
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Alış ve satış fiyatları farklı gösterilir
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Günlük değişim yüzdesi hesaplanır
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Tüm fiyatlar Türk Lirası bazındadır
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Önemli Uyarılar
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    Kurlar yatırım tavsiyesi değildir
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    İşlem yapmadan önce güncel kurları kontrol edin
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    Banka kurları farklılık gösterebilir
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    Yatırım kararlarınızı uzman görüşü alarak verin
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CurrencyPage; 
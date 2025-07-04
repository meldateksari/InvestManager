'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Globe, RefreshCw, Calculator } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCurrency } from '../../hooks/useCurrency';
import { useSymbols } from '../../hooks/useSymbols';
import { useLanguage } from '../../context/LanguageContext';

// Currency flag helper function
const getCurrencyFlag = (currencyCode: string): string => {
  const flags: Record<string, string> = {
    'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵',
    'CHF': '🇨🇭', 'CAD': '🇨🇦', 'AUD': '🇦🇺', 'SEK': '🇸🇪',
    'NOK': '🇳🇴', 'DKK': '🇩🇰', 'CNY': '🇨🇳', 'RUB': '🇷🇺',
    'SAR': '🇸🇦', 'KWD': '🇰🇼', 'QAR': '🇶🇦', 'AED': '🇦🇪'
  };
  return flags[currencyCode] || '💱';
};

const InvestmentSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'investments' | 'currencies'>('currencies');
  const router = useRouter();
  const { currencies, loading: currencyLoading, refresh } = useCurrency();
  const { symbols, loading: symbolsLoading, fetchSymbols } = useSymbols();
  const { translations } = useLanguage();

  const selectedCurrencies = currencies.slice(0, 8);
  const displaySymbols = symbols.slice(0, 8);

  const itemsPerView = 3;
  const maxIndex = Math.max(0, displaySymbols.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleProductClick = (symbol: any) => {
    const slug = symbol.name.toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/ö/g, 'o')
      .replace(/\s+/g, '-');
    router.push(`/invest/${slug}`);
  };

  const handleRefresh = () => {
    if (activeTab === 'investments') {
      fetchSymbols();
    } else {
      refresh();
    }
  };

  return (
    <div className="relative w-full bg-gray-400/40 backdrop-blur-lg backdrop-filter py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-light mb-4">
            {translations.currency.live_market.title}
          </h2>
          <p className="text-xl text-light/90 mb-6">
            {translations.currency.live_market.subtitle}
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div className="bg-light/10 backdrop-blur-md rounded-xl p-1 inline-flex">
              <button
                onClick={() => setActiveTab('currencies')}
                className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium flex items-center space-x-2 ${
                  activeTab === 'currencies'
                    ? 'bg-card text-heading shadow-modern'
                    : 'text-light hover:bg-light/10'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>{translations.currency.live_market.exchange_rates}</span>
              </button>
              <button
                onClick={() => setActiveTab('investments')}
                className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
                  activeTab === 'investments'
                    ? 'bg-card text-heading shadow-modern'
                    : 'text-light hover:bg-light/10'
                }`}
              >
                {translations.currency.live_market.market_data}
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <AnimatePresence mode="wait">
          {activeTab === 'currencies' ? (
            <motion.div
              key="currencies"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Currency Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-light">{translations.currency.live_market.exchange_rates}</h3>
                <div className="flex items-center space-x-4">
                  <motion.button
                    onClick={() => router.push('/currency-converter')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-black hover:bg-black/80 text-white rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl border border-gray-700"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>{translations.currency.converter}</span>
                  </motion.button>
                  <button
                    onClick={handleRefresh}
                    disabled={currencyLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-light/10 hover:bg-light/20 rounded-lg transition-colors text-light disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${currencyLoading ? 'animate-spin' : ''}`} />
                    <span>{translations.currency.live_market.refresh}</span>
                  </button>
                  <Link
                    href="/currency"
                    className="px-4 py-2 bg-card hover:bg-card/90 text-heading rounded-lg transition-colors shadow-modern"
                  >
                    {translations.currency.live_market.view_all}
                  </Link>
                </div>
              </div>

              {/* Currency Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currencyLoading ? (
                  [...Array(8)].map((_, i) => (
                    <div key={`currency-skeleton-${i}`} className="bg-light/10 backdrop-blur-md rounded-xl p-4 animate-pulse">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-light/20 rounded-full"></div>
                        <div>
                          <div className="h-4 w-16 bg-light/20 rounded mb-1"></div>
                          <div className="h-3 w-12 bg-light/20 rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 w-20 bg-light/20 rounded"></div>
                        <div className="h-4 w-16 bg-light/20 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  selectedCurrencies.map((currency, index) => (
                    <motion.div
                      key={`currency-${currency.code || currency.name || index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-light/25 backdrop-blur-md rounded-2xl p-5 hover:bg-light/35 transition-all duration-300 cursor-pointer group border border-light/15 shadow-lg hover:shadow-2xl"
                      onClick={() => router.push('/currency')}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">
                          {getCurrencyFlag(currency.code)}
                        </span>
                        <div>
                          <h4 className="text-light font-semibold text-sm group-hover:text-light/80 transition-colors">
                            {currency.code}
                          </h4>
                          <p className="text-light/80 text-xs">
                            {currency.name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-light font-bold">
                            {typeof currency.buying === 'string' ? parseFloat(currency.buying).toFixed(4) : currency.buying.toFixed(4)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            currency.changePercent > 0 
                              ? 'bg-green-500/20 text-green-300' 
                              : currency.changePercent < 0 
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {currency.changePercent > 0 ? '+' : ''}{currency.changePercent.toFixed(2)}%
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-xs text-light/80">
                          {currency.changePercent > 0 ? (
                            <TrendingUp className="w-3 h-3 text-success" />
                          ) : currency.changePercent < 0 ? (
                            <TrendingDown className="w-3 h-3 text-red-400" />
                          ) : null}
                          <span>
                            {currency.changePercent > 0 ? '+' : ''}{currency.change}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Currency Footer */}
              {!currencyLoading && selectedCurrencies.length > 0 && (
                <div className="mt-6 text-center">
                  <p className="text-light/80 text-sm">
                    {translations.currency.live_market.last_updated}: {new Date().toLocaleTimeString('en-US')}
                  </p>
                </div>
              )}
            </motion.div>
          ) : activeTab === 'investments' ? (
            <motion.div
              key="investments"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                disabled={symbolsLoading}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm text-light p-3 rounded-full transition-all duration-300 hover:scale-110 hover:bg-light/20 disabled:opacity-50 bg-light/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                disabled={symbolsLoading}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm text-light p-3 rounded-full transition-all duration-300 hover:scale-110 hover:bg-light/20 disabled:opacity-50 bg-light/10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slider */}
              <div className="overflow-hidden mx-4">
                {symbolsLoading ? (
                  // Loading skeleton
                  <div className="flex gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={`skeleton-${i}`} className="flex-shrink-0 w-1/3" style={{ minWidth: `calc(33.333% - 1rem)` }}>
                        <div className="backdrop-blur-md rounded-2xl p-6 border animate-pulse bg-light/10 border-light/20">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-light/20 rounded"></div>
                            <div className="w-16 h-4 bg-light/20 rounded"></div>
                          </div>
                          <div className="w-32 h-6 bg-light/20 rounded mb-2"></div>
                          <div className="w-24 h-8 bg-light/20 rounded mb-2"></div>
                          <div className="w-20 h-4 bg-light/20 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    className="flex gap-4"
                    animate={{
                      x: `-${currentIndex * (100 / itemsPerView)}%`
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  >
                    {displaySymbols.map((symbol, index) => (
                      <motion.div
                        key={`symbol-${symbol.id || symbol.symbol || index}`}
                        className="flex-shrink-0 w-1/3"
                        style={{ minWidth: `calc(33.333% - 1rem)` }}
                        onHoverStart={() => setHoveredItem(symbol.id || symbol.symbol || `symbol-${index}`)}
                        onHoverEnd={() => setHoveredItem(null)}
                        whileHover={{ 
                          scale: 1.05,
                          zIndex: 10
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <div className="relative">
                          {/* Main Card */}
                          <motion.div
                            className="backdrop-blur-md rounded-2xl p-6 border transition-all duration-300 cursor-pointer bg-light/25 border-light/20"
                            whileHover={{
                              boxShadow: "0 25px 50px -12px rgba(49, 130, 206, 0.25)",
                              borderColor: '#3182CE'
                            }}
                            onClick={() => handleProductClick(symbol)}
                          >
                            {/* Icon and Symbol */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-4xl">{symbol.icon}</div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-light/80">
                                  {symbol.symbol}
                                </div>
                              </div>
                            </div>

                            {/* Product Name */}
                            <h3 className="text-light text-xl font-bold mb-2">
                              {symbol.name}
                            </h3>

                            {/* Price */}
                            <div className="text-2xl font-bold text-light mb-2">
                              {typeof symbol.price === 'number' 
                                ? symbol.price.toLocaleString('tr-TR') 
                                : symbol.price
                              }
                            </div>

                            {/* Change */}
                            <div className="flex items-center space-x-2">
                              {symbol.changePercent >= 0 ? (
                                <TrendingUp className="w-4 h-4 text-success" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-400" />
                              )}
                              <span
                                className={`font-medium ${
                                  symbol.changePercent >= 0
                                    ? 'text-success'
                                    : 'text-red-400'
                                }`}
                              >
                                {symbol.change}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-light/80 text-sm mt-3 opacity-75">
                              {symbol.description}
                            </p>
                          </motion.div>

                          {/* Expanded Details on Hover */}
                          <AnimatePresence>
                            {hoveredItem === (symbol.id || symbol.symbol || `symbol-${index}`) && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl p-4 shadow-modern-lg border border-muted/20 z-20"
                              >
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-muted">24h High:</span>
                                    <div className="font-semibold text-heading">
                                      {symbol.high24h}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-muted">24h Low:</span>
                                    <div className="font-semibold text-heading">
                                      {symbol.low24h}
                                    </div>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-muted">24h Volume:</span>
                                    <div className="font-semibold text-heading">
                                      {symbol.volume}
                                    </div>
                                  </div>
                                </div>
                                
                                <button className="w-full mt-3 bg-accent text-light py-2 rounded-lg hover:bg-accent/90 transition-colors">
                                  View Details
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Dots Indicator */}
              {!symbolsLoading && displaySymbols.length > itemsPerView && (
                <div className="flex justify-center space-x-2 mt-8">
                  {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-blue-400 scale-125'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Refresh Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleRefresh}
                  disabled={symbolsLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${symbolsLoading ? 'animate-spin' : ''}`} />
                  <span>{translations.currency.live_market.refresh}</span>
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InvestmentSlider; 
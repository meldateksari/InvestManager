'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, RefreshCw, TrendingUp, TrendingDown, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ConversionResult {
  success: boolean;
  result: {
    base: string;
    to: string;
    amount: number;
    convertedAmount: number;
    rate: number;
  };
}

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState<number>(1);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' }
  ];

  const convertCurrency = async () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/currency-convert?base=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      );

      if (!response.ok) {
        throw new Error('Failed to convert currency');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to convert currency. Please try again.');
      console.error('Conversion error:', err);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  useEffect(() => {
    if (amount > 0) {
      const timer = setTimeout(() => {
        convertCurrency();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [fromCurrency, toCurrency, amount]);

  const getCurrencyInfo = (code: string) => {
    return currencies.find(c => c.code === code) || { code, name: code, flag: '💱' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => router.back()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Currency Converter</h1>
                <p className="text-sm text-gray-600">Real-time exchange rates</p>
              </div>
            </div>
            <Link 
              href="/"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200/50"
        >
          {/* Title Section */}
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Convert Your Money
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Get the latest exchange rates and convert currencies instantly
            </motion.p>
          </div>

          {/* Converter Form */}
          <div className="space-y-6">
            {/* Amount Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </motion.div>

            {/* Currency Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* From Currency */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700">
                  From
                </label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium bg-white"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Swap Button */}
              <div className="flex items-end justify-center md:col-span-2 md:order-2">
                <motion.button
                  onClick={swapCurrencies}
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors mb-2"
                >
                  <ArrowLeftRight className="w-6 h-6 text-blue-600" />
                </motion.button>
              </div>

              {/* To Currency */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-2 md:order-3"
              >
                <label className="block text-sm font-medium text-gray-700">
                  To
                </label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium bg-white"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>

            {/* Convert Button */}
            <motion.button
              onClick={convertCurrency}
              disabled={loading || !amount}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ArrowLeftRight className="w-5 h-5" />
                  <span>Convert Currency</span>
                </>
              )}
            </motion.button>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl"
                >
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Conversion Result</h3>
                    
                    <div className="flex items-center justify-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">From</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {getCurrencyInfo(result.result.base).flag} {result.result.amount.toLocaleString()} {result.result.base}
                        </p>
                      </div>
                      
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      >
                        <ArrowLeftRight className="w-6 h-6 text-blue-600" />
                      </motion.div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600">To</p>
                        <p className="text-2xl font-bold text-green-600">
                          {getCurrencyInfo(result.result.to).flag} {result.result.convertedAmount.toLocaleString()} {result.result.to}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Exchange Rate: 1 {result.result.base} = {result.result.rate.toFixed(4)} {result.result.to}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last updated: {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/50">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Real-time Rates</h3>
            <p className="text-gray-600 text-sm">
              Get the most up-to-date exchange rates from reliable financial sources.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/50">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Accurate Conversions</h3>
            <p className="text-gray-600 text-sm">
              Precise calculations based on current market rates for reliable results.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/50">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <ArrowLeftRight className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy to Use</h3>
            <p className="text-gray-600 text-sm">
              Simple and intuitive interface for quick currency conversions.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CurrencyConverter; 
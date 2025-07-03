'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BarChart3, TrendingUp, Globe, Bitcoin, Building2 } from 'lucide-react';
import TradingViewChart from './TradingViewChart';
import { 
  getInvestmentSymbol, 
  detectSymbolType, 
  formatSymbolName,
  currencyToTradingViewSymbol 
} from '../../utils/currencyUtils';

interface LiveMarketDataProps {
  defaultSymbol?: string;
  defaultType?: 'stock' | 'crypto' | 'forex' | 'commodity';
  className?: string;
}

const LiveMarketData: React.FC<LiveMarketDataProps> = ({ 
  defaultSymbol = 'USD',
  defaultType = 'forex',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const [symbolType, setSymbolType] = useState<'stock' | 'crypto' | 'forex' | 'commodity'>(defaultType);
  const [showChart, setShowChart] = useState(true);

  // Popüler semboller
  const popularSymbols = {
    forex: [
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' },
      { code: 'GBP', name: 'British Pound' },
      { code: 'JPY', name: 'Japanese Yen' }
    ],
    crypto: [
      { code: 'BTC', name: 'Bitcoin' },
      { code: 'ETH', name: 'Ethereum' },
      { code: 'BNB', name: 'Binance Coin' },
      { code: 'ADA', name: 'Cardano' }
    ],
    stock: [
      { code: 'AAPL', name: 'Apple Inc.' },
      { code: 'GOOGL', name: 'Alphabet Inc.' },
      { code: 'MSFT', name: 'Microsoft' },
      { code: 'TSLA', name: 'Tesla Inc.' }
    ],
    commodity: [
      { code: 'GOLD', name: 'Gold' },
      { code: 'SILVER', name: 'Silver' },
      { code: 'OIL', name: 'Crude Oil' },
      { code: 'BRENT', name: 'Brent Oil' }
    ]
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const detectedType = detectSymbolType(searchTerm);
    setSymbolType(detectedType);
    setSelectedSymbol(searchTerm.toUpperCase());
    setShowChart(true);
  };

  const handleSymbolSelect = (symbol: string, type: 'stock' | 'crypto' | 'forex' | 'commodity') => {
    setSelectedSymbol(symbol);
    setSymbolType(type);
    setShowChart(true);
  };

  const getTradingViewSymbol = () => {
    if (symbolType === 'forex') {
      return currencyToTradingViewSymbol(selectedSymbol);
    }
    return getInvestmentSymbol(selectedSymbol, symbolType);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'forex': return <Globe className="w-5 h-5" />;
      case 'crypto': return <Bitcoin className="w-5 h-5" />;
      case 'stock': return <Building2 className="w-5 h-5" />;
      case 'commodity': return <TrendingUp className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'forex': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'crypto': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'stock': return 'text-green-600 bg-green-50 border-green-200';
      case 'commodity': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header ve Arama */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Live Market Data</h2>
              <p className="text-sm text-gray-600">View charts for stocks, crypto, forex and commodities</p>
            </div>
          </div>
        </div>

        {/* Arama Kutusu */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search symbol (e.g: AAPL, BTC, EUR, GOLD)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Show Chart
          </motion.button>
        </div>

        {/* Popüler Semboller */}
        <div className="space-y-4">
          {Object.entries(popularSymbols).map(([type, symbols]) => (
            <div key={type}>
              <div className="flex items-center space-x-2 mb-3">
                {getTypeIcon(type)}
                <h3 className="font-medium text-gray-900 capitalize">
                  {type === 'forex' ? 'Forex' : 
                   type === 'crypto' ? 'Crypto' :
                   type === 'stock' ? 'Stocks' : 'Commodities'}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {symbols.map((symbol) => (
                  <motion.button
                    key={symbol.code}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSymbolSelect(symbol.code, type as any)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${getTypeColor(type)} hover:scale-105`}
                  >
                    {symbol.code}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grafik */}
      {showChart && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {getTypeIcon(symbolType)}
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {formatSymbolName(selectedSymbol)} 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getTypeColor(symbolType)}`}>
                    {symbolType.toUpperCase()}
                  </span>
                </h3>
                <p className="text-sm text-gray-600">
                  Real-time price movements and technical analysis
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowChart(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="rounded-lg overflow-hidden">
            <TradingViewChart
              symbol={getTradingViewSymbol()}
              height={500}
              theme="light"
              interval="15"
              locale="tr"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LiveMarketData; 
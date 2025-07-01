'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InvestmentProduct {
  id: number;
  name: string;
  symbol: string;
  price: string;
  change: string;
  changePercent: number;
  icon: string;
  description: string;
  volume: string;
  high24h: string;
  low24h: string;
}

const InvestmentSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const router = useRouter();
  
  const investmentProducts: InvestmentProduct[] = [
    {
      id: 1,
      name: "Altın",
      symbol: "XAU/TRY",
      price: "2.847,50 ₺",
      change: "+2.45%",
      changePercent: 2.45,
      icon: "🥇",
      description: "Güvenli liman yatırımı",
      volume: "125M ₺",
      high24h: "2.851,20 ₺",
      low24h: "2.820,10 ₺"
    },
    {
      id: 2,
      name: "Bitcoin",
      symbol: "BTC/TRY",
      price: "2.874.650 ₺",
      change: "+5.21%",
      changePercent: 5.21,
      icon: "₿",
      description: "Dijital altın",
      volume: "2.5B ₺",
      high24h: "2.890.000 ₺",
      low24h: "2.750.000 ₺"
    },
    {
      id: 3,
      name: "Dolar",
      symbol: "USD/TRY",
      price: "34,25 ₺",
      change: "-0.12%",
      changePercent: -0.12,
      icon: "$",
      description: "Küresel rezerv para birimi",
      volume: "890M ₺",
      high24h: "34,45 ₺",
      low24h: "34,18 ₺"
    },
    {
      id: 4,
      name: "Euro",
      symbol: "EUR/TRY",
      price: "36,89 ₺",
      change: "+0.75%",
      changePercent: 0.75,
      icon: "€",
      description: "Avrupa para birimi",
      volume: "670M ₺",
      high24h: "37,02 ₺",
      low24h: "36,65 ₺"
    },
    {
      id: 5,
      name: "Ethereum",
      symbol: "ETH/TRY",
      price: "125.450 ₺",
      change: "+3.87%",
      changePercent: 3.87,
      icon: "Ξ",
      description: "Akıllı kontrat platformu",
      volume: "1.8B ₺",
      high24h: "128.000 ₺",
      low24h: "119.500 ₺"
    },
    {
      id: 6,
      name: "Gümüş",
      symbol: "XAG/TRY",
      price: "32,45 ₺",
      change: "+1.87%",
      changePercent: 1.87,
      icon: "🥈",
      description: "Endüstriyel değerli metal",
      volume: "85M ₺",
      high24h: "32,89 ₺",
      low24h: "31,95 ₺"
    },
    {
      id: 7,
      name: "Sterlin",
      symbol: "GBP/TRY",
      price: "43,12 ₺",
      change: "-0.34%",
      changePercent: -0.34,
      icon: "£",
      description: "İngiliz para birimi",
      volume: "450M ₺",
      high24h: "43,45 ₺",
      low24h: "42,88 ₺"
    },
    {
      id: 8,
      name: "Dogecoin",
      symbol: "DOGE/TRY",
      price: "4,67 ₺",
      change: "+8.92%",
      changePercent: 8.92,
      icon: "🐕",
      description: "Meme coin",
      volume: "650M ₺",
      high24h: "4,89 ₺",
      low24h: "4,25 ₺"
    }
  ];

  const itemsPerView = 3;
  const maxIndex = Math.max(0, investmentProducts.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleProductClick = (productName: string) => {
    const slug = productName.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ö/g, 'o');
    router.push(`/invest/${slug}`);
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Canlı Piyasa Verileri
          </h2>
          <p className="text-xl text-blue-200">
            Gerçek zamanlı fiyatlar ve güncel yatırım fırsatları
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slider */}
          <div className="overflow-hidden mx-4">
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
              {investmentProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="flex-shrink-0 w-1/3"
                  style={{ minWidth: `calc(33.333% - 1rem)` }}
                  onHoverStart={() => setHoveredItem(product.id)}
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
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 cursor-pointer"
                      whileHover={{
                        boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                      }}
                      onClick={() => handleProductClick(product.name)}
                    >
                      {/* Icon and Symbol */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{product.icon}</div>
                        <div className="text-right">
                          <div className="text-blue-200 text-sm font-medium">
                            {product.symbol}
                          </div>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-white text-xl font-bold mb-2">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="text-2xl font-bold text-white mb-2">
                        {product.price}
                      </div>

                      {/* Change */}
                      <div className="flex items-center space-x-2">
                        {product.changePercent >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span
                          className={`font-medium ${
                            product.changePercent >= 0
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {product.change}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-blue-200 text-sm mt-3 opacity-75">
                        {product.description}
                      </p>
                    </motion.div>

                    {/* Expanded Details on Hover */}
                    <AnimatePresence>
                      {hoveredItem === product.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl p-4 shadow-2xl border border-gray-200 z-20"
                        >
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">24s Yüksek:</span>
                              <div className="font-semibold text-gray-900">
                                {product.high24h}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">24s Düşük:</span>
                              <div className="font-semibold text-gray-900">
                                {product.low24h}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-500">24s Hacim:</span>
                              <div className="font-semibold text-gray-900">
                                {product.volume}
                              </div>
                            </div>
                          </div>
                          
                          <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Yatırım Yap
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-400 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSlider; 
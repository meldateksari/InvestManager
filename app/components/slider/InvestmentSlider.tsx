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
      name: "Gold",
      symbol: "XAU/USD",
      price: "$2,847.50",
      change: "+2.45%",
      changePercent: 2.45,
      icon: "🥇",
      description: "Safe haven investment",
      volume: "$125M",
      high24h: "$2,851.20",
      low24h: "$2,820.10"
    },
    {
      id: 2,
      name: "Bitcoin",
      symbol: "BTC/USD",
      price: "$94,650",
      change: "+5.21%",
      changePercent: 5.21,
      icon: "₿",
      description: "Digital gold",
      volume: "$2.5B",
      high24h: "$96,000",
      low24h: "$91,500"
    },
    {
      id: 3,
      name: "Dollar",
      symbol: "DXY",
      price: "106.25",
      change: "-0.12%",
      changePercent: -0.12,
      icon: "$",
      description: "Global reserve currency",
      volume: "$890M",
      high24h: "106.45",
      low24h: "106.18"
    },
    {
      id: 4,
      name: "Euro",
      symbol: "EUR/USD",
      price: "1.0889",
      change: "+0.75%",
      changePercent: 0.75,
      icon: "€",
      description: "European currency",
      volume: "$670M",
      high24h: "1.0902",
      low24h: "1.0865"
    },
    {
      id: 5,
      name: "Ethereum",
      symbol: "ETH/USD",
      price: "$3,450",
      change: "+3.87%",
      changePercent: 3.87,
      icon: "Ξ",
      description: "Smart contract platform",
      volume: "$1.8B",
      high24h: "$3,600",
      low24h: "$3,295"
    },
    {
      id: 6,
      name: "Silver",
      symbol: "XAG/USD",
      price: "$32.45",
      change: "+1.87%",
      changePercent: 1.87,
      icon: "🥈",
      description: "Industrial precious metal",
      volume: "$85M",
      high24h: "$32.89",
      low24h: "$31.95"
    },
    {
      id: 7,
      name: "British Pound",
      symbol: "GBP/USD",
      price: "1.2612",
      change: "-0.34%",
      changePercent: -0.34,
      icon: "£",
      description: "British currency",
      volume: "$450M",
      high24h: "1.2645",
      low24h: "1.2588"
    },
    {
      id: 8,
      name: "Dogecoin",
      symbol: "DOGE/USD",
      price: "$0.467",
      change: "+8.92%",
      changePercent: 8.92,
      icon: "🐕",
      description: "Meme coin",
      volume: "$650M",
      high24h: "$0.489",
      low24h: "$0.425"
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
    <div className="relative w-full bg-gradient-to-br from-dark-navy via-accent-bg to-dark-blue py-16" style={{
      background: 'linear-gradient(135deg, var(--color-dark-navy) 0%, var(--color-medium-blue) 50%, var(--color-dark-blue) 100%)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Live Market Data
          </h2>
          <p className="text-xl text-blue-200">
            Real-time prices and current investment opportunities
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm text-light p-3 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/20"
            style={{
              backgroundColor: 'rgba(250, 250, 255, 0.1)'
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm text-light p-3 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/20"
            style={{
              backgroundColor: 'rgba(250, 250, 255, 0.1)'
            }}
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
                      className="backdrop-blur-md rounded-2xl p-6 border transition-all duration-300 cursor-pointer"
                      style={{
                        backgroundColor: 'rgba(250, 250, 255, 0.1)',
                        borderColor: 'rgba(250, 250, 255, 0.2)'
                      }}
                      whileHover={{
                        boxShadow: "0 25px 50px -12px rgba(39, 52, 105, 0.25)",
                        borderColor: 'var(--color-light-purple)'
                      }}
                      onClick={() => handleProductClick(product.name)}
                    >
                      {/* Icon and Symbol */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{product.icon}</div>
                        <div className="text-right">
                          <div className="text-sm font-medium" style={{ color: 'var(--color-light-purple)' }}>
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
                              <span className="text-gray-500">24h High:</span>
                              <div className="font-semibold text-gray-900">
                                {product.high24h}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">24h Low:</span>
                              <div className="font-semibold text-gray-900">
                                {product.low24h}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-500">24h Volume:</span>
                              <div className="font-semibold text-gray-900">
                                {product.volume}
                              </div>
                            </div>
                          </div>
                          
                          <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Invest Now
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
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
  purchaseDate: string;
}

const PortfolioPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [totalProfitLossPercent, setTotalProfitLossPercent] = useState(0);

  // Örnek portföy verileri (gerçek uygulamada API'den gelecek)
  useEffect(() => {
    if (user) {
      const mockPortfolio: PortfolioItem[] = [
        {
          id: '1',
          name: 'Bitcoin',
          symbol: 'BTC',
          icon: '₿',
          quantity: 0.5,
          buyPrice: 2800000,
          currentPrice: 2874650,
          totalValue: 1437325,
          profitLoss: 37325,
          profitLossPercent: 2.66,
          purchaseDate: '2024-01-15'
        },
        {
          id: '2',
          name: 'Altın',
          symbol: 'XAU',
          icon: '🥇',
          quantity: 100,
          buyPrice: 2800,
          currentPrice: 2847.50,
          totalValue: 284750,
          profitLoss: -525,
          profitLossPercent: -1.88,
          purchaseDate: '2024-02-01'
        },
        {
          id: '3',
          name: 'Ethereum',
          symbol: 'ETH',
          icon: 'Ξ',
          quantity: 2,
          buyPrice: 120000,
          currentPrice: 125450,
          totalValue: 250900,
          profitLoss: 10900,
          profitLossPercent: 4.54,
          purchaseDate: '2024-01-20'
        },
        {
          id: '4',
          name: 'Dolar',
          symbol: 'USD',
          icon: '$',
          quantity: 1000,
          buyPrice: 34.10,
          currentPrice: 34.25,
          totalValue: 34250,
          profitLoss: 150,
          profitLossPercent: 0.44,
          purchaseDate: '2024-02-10'
        }
      ];

      setPortfolioData(mockPortfolio);
      
      const total = mockPortfolio.reduce((sum, item) => sum + item.totalValue, 0);
      const totalProfit = mockPortfolio.reduce((sum, item) => sum + item.profitLoss, 0);
      const totalProfitPercent = ((totalProfit / (total - totalProfit)) * 100);
      
      setTotalBalance(total);
      setTotalProfitLoss(totalProfit);
      setTotalProfitLossPercent(totalProfitPercent);
    }
  }, [user]);

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-gray-900">
                InvestWise
              </Link>
              <span className="text-gray-300">→</span>
              <h1 className="text-lg font-semibold text-gray-700">Portföyüm</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hoş geldin, {user.firstName}!</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Portföy Özeti</h2>
            <button
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isBalanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              <span>{isBalanceVisible ? 'Gizle' : 'Göster'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100">Toplam Değer</span>
                <DollarSign className="w-6 h-6 text-blue-200" />
              </div>
              <div className="text-3xl font-bold">
                {isBalanceVisible ? formatCurrency(totalBalance) : '••••••'}
              </div>
            </div>

            <div className={`rounded-xl p-6 text-white ${
              totalProfitLoss >= 0 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80">Günlük Kar/Zarar</span>
                {totalProfitLoss >= 0 ? 
                  <ArrowUpRight className="w-6 h-6 text-white/80" /> : 
                  <ArrowDownRight className="w-6 h-6 text-white/80" />
                }
              </div>
              <div className="text-2xl font-bold">
                {isBalanceVisible ? (
                  <>
                    {formatCurrency(Math.abs(totalProfitLoss))}
                    <span className="text-lg ml-2">
                      ({totalProfitLoss >= 0 ? '+' : '-'}{Math.abs(totalProfitLossPercent).toFixed(2)}%)
                    </span>
                  </>
                ) : '••••••'}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-100">Toplam Ürün</span>
                <PieChart className="w-6 h-6 text-purple-200" />
              </div>
              <div className="text-3xl font-bold">
                {portfolioData.length}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Yatırımlarım</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Varlık
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Miktar
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Alış Fiyatı
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Güncel Fiyat
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Toplam Değer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Kar/Zarar
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Alış Tarihi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {portfolioData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.buyPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.currentPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {isBalanceVisible ? formatCurrency(item.totalValue) : '••••••'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center space-x-1 ${
                        item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.profitLoss >= 0 ? 
                          <TrendingUp className="w-4 h-4" /> : 
                          <TrendingDown className="w-4 h-4" />
                        }
                        <span className="text-sm font-medium">
                          {isBalanceVisible ? (
                            <>
                              {formatCurrency(Math.abs(item.profitLoss))}
                              <div className="text-xs">
                                ({item.profitLoss >= 0 ? '+' : '-'}{Math.abs(item.profitLossPercent).toFixed(2)}%)
                              </div>
                            </>
                          ) : '••••••'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.purchaseDate)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link
            href="/"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Yeni Yatırım</h3>
                <p className="text-sm text-gray-600">Portföyünüze yeni ürün ekleyin</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <PieChart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analiz Raporu</h3>
                <p className="text-sm text-gray-600">Detaylı performans analizi</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">İşlem Geçmişi</h3>
                <p className="text-sm text-gray-600">Tüm alım-satım işlemleri</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PortfolioPage; 
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../hooks/useCurrency';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface Investment {
  id: string;
  category: 'altin' | 'hisse' | 'fon' | 'coin';
  name: string;
  symbol: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  purchaseDate: string;
  purchaseLocation: string;
  notes?: string;
  createdAt: Date;
}

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  category: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
  investments: Investment[];
}

interface CategoryData {
  category: string;
  value: number;
  percentage: number;
  color: string;
  icon: string;
}

const CATEGORIES = [
      { id: 'altin', name: 'Gold', icon: '🥇' },
    { id: 'hisse', name: 'Stocks', icon: '📈' },
    { id: 'fon', name: 'Funds', icon: '💼' },
  { id: 'coin', name: 'Cryptocurrency', icon: '₿' }
];

const PortfolioPage = () => {
  const { user, loading } = useAuth();
  const { currencies, getCurrencyByCode } = useCurrency();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [totalProfitLossPercent, setTotalProfitLossPercent] = useState(0);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    category: 'altin' as Investment['category'],
    name: '',
    symbol: '',
    quantity: 0,
    unitPrice: 0,
    purchaseDate: '',
    purchaseLocation: '',
    notes: ''
  });

  // Firebase'den yatırımları getir (users/{userId}/investments subcollection)
  useEffect(() => {
    if (!user) return;

    const investmentsRef = collection(db, `users/${user.uid}/investments`);
    const q = query(investmentsRef, orderBy('purchaseDate', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const investmentsList: Investment[] = [];
      snapshot.forEach((doc) => {
        investmentsList.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        } as Investment);
      });
      setInvestments(investmentsList);

      // Mevcut tarihleri çıkar
      const dates = [...new Set(investmentsList.map(inv => inv.purchaseDate))].sort((a, b) => b.localeCompare(a));
      setAvailableDates(dates);
    });

    return () => unsubscribe();
  }, [user]);

  // Tarih filtreleme
  useEffect(() => {
    if (selectedDate) {
      setFilteredInvestments(investments.filter(inv => inv.purchaseDate === selectedDate));
    } else {
      setFilteredInvestments(investments);
    }
  }, [investments, selectedDate]);

  // Portföy verilerini hesapla
  useEffect(() => {
    if (investments.length === 0) {
      setPortfolioData([]);
      setTotalBalance(0);
      setTotalProfitLoss(0);
      setTotalProfitLossPercent(0);
      setCategoryData([]);
      return;
    }

    // Yatırımları kategorilere göre grupla
    const groupedInvestments = investments.reduce((acc, investment) => {
      const key = `${investment.symbol}_${investment.name}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(investment);
      return acc;
    }, {} as Record<string, Investment[]>);

    // Gerçek zamanlı fiyatları al
    const getCurrentPrice = (symbol: string): number => {
      // Kripto paralar için mock fiyatlar (API entegrasyonu gerekecek)
      if (symbol === 'BTC') return 2874650;
      if (symbol === 'ETH') return 125450;
      if (symbol === 'XAU') return 2847.50; // Altın için
      
      // Döviz kurları için gerçek veriler
      const currency = getCurrencyByCode(symbol);
      if (currency) {
        return currency.selling; // Satış fiyatını kullan
      }
      
      // Fallback: %2 artış varsay
      return 0;
    };

    const portfolioItems: PortfolioItem[] = Object.entries(groupedInvestments).map(([key, invs]) => {
      const firstInv = invs[0];
      const totalQuantity = invs.reduce((sum, inv) => sum + inv.quantity, 0);
      const totalCost = invs.reduce((sum, inv) => sum + inv.totalCost, 0);
      const avgBuyPrice = totalCost / totalQuantity;
      
      // Gerçek zamanlı fiyat al
      const currentPrice = getCurrentPrice(firstInv.symbol) || avgBuyPrice * 1.02;
      const totalValue = totalQuantity * currentPrice;
      const profitLoss = totalValue - totalCost;
      const profitLossPercent = (profitLoss / totalCost) * 100;

      const categoryInfo = CATEGORIES.find(cat => cat.id === firstInv.category);

      return {
        id: key,
        name: firstInv.name,
        symbol: firstInv.symbol,
        icon: categoryInfo?.icon || '💰',
        category: categoryInfo?.name || 'Diğer',
        quantity: totalQuantity,
        avgBuyPrice,
        currentPrice,
        totalValue,
        profitLoss,
        profitLossPercent,
        investments: invs
      };
    });

    setPortfolioData(portfolioItems);
    
    const total = portfolioItems.reduce((sum, item) => sum + item.totalValue, 0);
    const totalProfit = portfolioItems.reduce((sum, item) => sum + item.profitLoss, 0);
    const totalProfitPercent = total > 0 ? (totalProfit / (total - totalProfit)) * 100 : 0;
    
    setTotalBalance(total);
    setTotalProfitLoss(totalProfit);
    setTotalProfitLossPercent(totalProfitPercent);

    // Kategori verilerini hesapla
    const categoryTotals = portfolioItems.reduce((acc, item) => {
      const categoryInfo = CATEGORIES.find(cat => cat.name === item.category);
      const categoryId = categoryInfo?.id || 'other';
      
      if (!acc[categoryId]) {
        acc[categoryId] = {
          category: item.category,
          value: 0,
          percentage: 0,
          color: '',
          icon: categoryInfo?.icon || '💰'
        };
      }
      acc[categoryId].value += item.totalValue;
      return acc;
    }, {} as Record<string, CategoryData>);

    // Renkleri ata
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const categoryArray = Object.values(categoryTotals).map((cat, index) => ({
      ...cat,
      percentage: total > 0 ? (cat.value / total) * 100 : 0,
      color: colors[index % colors.length]
    }));

    setCategoryData(categoryArray);
  }, [investments]);

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleAddInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const totalCost = formData.quantity * formData.unitPrice;
      
      // users/{userId}/investments subcollection'a ekle
      await addDoc(collection(db, `users/${user.uid}/investments`), {
        category: formData.category,
        name: formData.name,
        symbol: formData.symbol.toUpperCase(),
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
        totalCost,
        purchaseDate: formData.purchaseDate,
        purchaseLocation: formData.purchaseLocation,
        notes: formData.notes,
        createdAt: new Date()
      });

      // Form'u temizle
      setFormData({
        category: 'altin',
        name: '',
        symbol: '',
        quantity: 0,
        unitPrice: 0,
        purchaseDate: '',
        purchaseLocation: '',
        notes: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Yatırım eklenirken hata oluştu:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvestment || isSubmitting || !user) return;

    setIsSubmitting(true);
    try {
      const totalCost = formData.quantity * formData.unitPrice;
      
      await updateDoc(doc(db, `users/${user.uid}/investments`, editingInvestment.id), {
        category: formData.category,
        name: formData.name,
        symbol: formData.symbol.toUpperCase(),
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
        totalCost,
        purchaseDate: formData.purchaseDate,
        purchaseLocation: formData.purchaseLocation,
        notes: formData.notes
      });

      setEditingInvestment(null);
      setFormData({
        category: 'altin',
        name: '',
        symbol: '',
        quantity: 0,
        unitPrice: 0,
        purchaseDate: '',
        purchaseLocation: '',
        notes: ''
      });
    } catch (error) {
      console.error('Yatırım güncellenirken hata oluştu:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInvestment = async (investmentId: string) => {
    if (!confirm('Bu yatırımı silmek istediğinizden emin misiniz?') || !user) return;

    try {
      await deleteDoc(doc(db, `users/${user.uid}/investments`, investmentId));
    } catch (error) {
      console.error('Yatırım silinirken hata oluştu:', error);
    }
  };

  const startEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setFormData({
      category: investment.category,
      name: investment.name,
      symbol: investment.symbol,
      quantity: investment.quantity,
      unitPrice: investment.unitPrice,
      purchaseDate: investment.purchaseDate,
      purchaseLocation: investment.purchaseLocation,
      notes: investment.notes || ''
    });
  };

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

  const CircularProgress = ({ 
    percentage, 
    size = 120, 
    strokeWidth = 8, 
    color = '#3B82F6',
    children 
  }: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    children: React.ReactNode;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (Math.abs(percentage) / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  };

  const chartData = {
    labels: categoryData.map(cat => cat.category),
    datasets: [
      {
        data: categoryData.map(cat => cat.value),
        backgroundColor: categoryData.map(cat => cat.color),
        borderColor: categoryData.map(cat => cat.color),
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const percentage = ((value / totalBalance) * 100).toFixed(1);
            return `${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%'
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
              <h1 className="text-lg font-semibold text-gray-700">My Portfolio</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.firstName}!</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'portfolio'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab('investments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'investments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Investments
              </button>
            </nav>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Portfolio Summary - New Design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 mb-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Portfolio Summary</h2>
                  <button
                    onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {isBalanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    <span>{isBalanceVisible ? 'Hide' : 'Show'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Sol taraf - Circular Progress Indicators */}
                  <div className="space-y-8">
                    {/* Toplam Değer */}
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center space-x-6"
                    >
                      <CircularProgress 
                        percentage={100} 
                        size={100} 
                        color="#3B82F6"
                      >
                        <div className="text-center">
                          <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Total</div>
                        </div>
                      </CircularProgress>
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Total Portfolio Value</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {isBalanceVisible ? formatCurrency(totalBalance) : '••••••'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {portfolioData.length} different investments
                        </div>
                      </div>
                    </motion.div>

                    {/* Kar/Zarar */}
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center space-x-6"
                    >
                      <CircularProgress 
                        percentage={totalProfitLossPercent} 
                        size={100} 
                        color={totalProfitLoss >= 0 ? "#10B981" : "#EF4444"}
                      >
                        <div className="text-center">
                          {totalProfitLoss >= 0 ? 
                            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" /> : 
                            <TrendingDown className="w-6 h-6 text-red-600 mx-auto mb-1" />
                          }
                          <div className={`text-xs font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(1)}%
                          </div>
                        </div>
                      </CircularProgress>
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Total Profit/Loss</div>
                        <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {isBalanceVisible ? (
                            `${totalProfitLoss >= 0 ? '+' : ''}${formatCurrency(totalProfitLoss)}`
                          ) : '••••••'}
                        </div>
                        <div className={`text-sm ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {totalProfitLoss >= 0 ? 'Profit' : 'Loss'} status
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Sağ taraf - Category Distribution Chart */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative"
                  >
                    {categoryData.length > 0 ? (
                      <div className="relative">
                        <div className="w-80 h-80 mx-auto relative">
                          <Doughnut data={chartData} options={chartOptions} />
                          {/* Merkez metni */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <PieChart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <div className="text-sm font-medium text-gray-600">Category</div>
                              <div className="text-sm text-gray-500">Distribution</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Kategori Listesi */}
                        <div className="mt-6 space-y-3">
                          {categoryData.map((category, index) => (
                            <motion.div
                              key={category.category}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                <span className="text-lg">{category.icon}</span>
                                <span className="font-medium text-gray-900">{category.category}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900">
                                  {isBalanceVisible ? formatCurrency(category.value) : '••••••'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {category.percentage.toFixed(1)}%
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="w-80 h-80 mx-auto flex items-center justify-center bg-gray-50 rounded-full">
                        <div className="text-center">
                          <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <div className="text-gray-500">No data yet</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
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
                  <h3 className="text-xl font-bold text-gray-900">Portfolio Details</h3>
                </div>

                {portfolioData.length === 0 ? (
                  <div className="p-8 text-center">
                    <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">You don't have any investments yet</h3>
                    <p className="text-gray-600 mb-4">Add your first investment from the My Investments tab</p>
                    <button
                      onClick={() => setActiveTab('investments')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Investment
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Asset
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Avg. Purchase Price
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Current Price
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Total Value
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Profit/Loss
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
                                  <div className="text-sm text-gray-500">{item.symbol} • {item.category}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(item.avgBuyPrice)}
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
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'investments' && (
            <motion.div
              key="investments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Add Investment Button and Date Filter */}
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New Investment</span>
                </button>

                {/* Date Filter */}
                <div className="flex items-center space-x-3">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Dates</option>
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {formatDate(date)}
                      </option>
                    ))}
                  </select>
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate('')}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Add/Edit Investment Form */}
              {(showAddForm || editingInvestment) && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {editingInvestment ? 'Edit Investment' : 'Add New Investment'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingInvestment(null);
                        setFormData({
                          category: 'altin',
                          name: '',
                          symbol: '',
                          quantity: 0,
                          unitPrice: 0,
                          purchaseDate: '',
                          purchaseLocation: '',
                          notes: ''
                        });
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={editingInvestment ? handleEditInvestment : handleAddInvestment} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as Investment['category'] })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                          required
                        >
                          {CATEGORIES.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Yatırım Adı
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-600"
                          placeholder="Örn: Bitcoin, Gram Altın"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Sembol/Kod
                        </label>
                        <input
                          type="text"
                          value={formData.symbol}
                          onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-600"
                          placeholder="Örn: BTC, XAU"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Miktar
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-600"
                          placeholder="Miktar girin"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Birim Fiyat (₺)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.unitPrice}
                          onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-600"
                          placeholder="Birim fiyat girin"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Alış Tarihi
                        </label>
                        <input
                          type="date"
                          value={formData.purchaseDate}
                          onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Alış Yeri
                        </label>
                        <input
                          type="text"
                          value={formData.purchaseLocation}
                          onChange={(e) => setFormData({ ...formData, purchaseLocation: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-600"
                          placeholder="Örn: Binance, Ziraat Bankası, BtcTurk"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Notlar (Opsiyonel)
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-600"
                          rows={3}
                          placeholder="Ek notlarınız..."
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-gray-600">
                        <strong>Toplam Maliyet: </strong>
                        {formatCurrency(formData.quantity * formData.unitPrice)}
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>{isSubmitting ? 'Kaydediliyor...' : editingInvestment ? 'Güncelle' : 'Kaydet'}</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Investments List */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedDate ? `${formatDate(selectedDate)} Tarihindeki Yatırımlarım` : 'Tüm Yatırımlarım'}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {filteredInvestments.length} yatırım
                    </span>
                  </div>
                </div>

                {filteredInvestments.length === 0 ? (
                  <div className="p-8 text-center">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedDate ? 'Bu tarihte yatırımınız yok' : 'Henüz yatırımınız yok'}
                    </h3>
                    <p className="text-gray-600">
                      {selectedDate 
                        ? 'Farklı bir tarih seçin veya bu tarihe yatırım ekleyin' 
                        : 'İlk yatırımınızı eklemek için yukarıdaki butonu kullanın'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Yatırım
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Miktar
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Birim Fiyat
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Toplam Maliyet
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Alış Tarihi
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Alış Yeri
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredInvestments.map((investment, index) => {
                          const categoryInfo = CATEGORIES.find(cat => cat.id === investment.category);
                          return (
                            <motion.tr
                              key={investment.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">{categoryInfo?.icon || '💰'}</span>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{investment.name}</div>
                                    <div className="text-sm text-gray-500">{investment.symbol} • {categoryInfo?.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {investment.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(investment.unitPrice)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(investment.totalCost)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(investment.purchaseDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {investment.purchaseLocation}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => startEdit(investment)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteInvestment(investment.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PortfolioPage; 
'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Calendar, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

interface ProductData {
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
  marketCap: string;
  about: string;
  features: string[];
  riskLevel: string;
  category: string;
}

const InvestmentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const products: Record<string, ProductData> = {
    'gold': {
      name: "Altın",
      symbol: "XAU/TRY",
      price: "2.847,50 ₺",
      change: "+2.45%",
      changePercent: 2.45,
      icon: "🥇",
      description: "Güvenli liman yatırımı",
      volume: "125M ₺",
      high24h: "2.851,20 ₺",
      low24h: "2.820,10 ₺",
      marketCap: "45B ₺",
      about: "Altın, tarihin en eski ve güvenilir yatırım araçlarından biridir. Enflasyona karşı koruma sağlar ve ekonomik belirsizlik dönemlerinde değer kazanır. Portföy çeşitlendirmesi için ideal bir seçenektir.",
      features: [
        "Enflasyona karşı koruma",
        "Güvenli liman yatırımı",
        "Likidite yüksek",
        "Küresel kabul görmüş"
      ],
      riskLevel: "Düşük",
      category: "Değerli Metaller"
    },
    'bitcoin': {
      name: "Bitcoin",
      symbol: "BTC/TRY",
      price: "2.874.650 ₺",
      change: "+5.21%",
      changePercent: 5.21,
      icon: "₿",
      description: "Dijital altın",
      volume: "2.5B ₺",
      high24h: "2.890.000 ₺",
      low24h: "2.750.000 ₺",
      marketCap: "1.2T ₺",
      about: "Bitcoin, ilk ve en bilinen kripto para birimidir. Blockchain teknolojisi üzerine kurulu olan Bitcoin, merkezi otoriteye ihtiyaç duymayan dijital bir para sistemidir. Sınırlı arzı ile dijital altın olarak da bilinir.",
      features: [
        "Merkezi olmayan yapı",
        "Sınırlı arz (21 milyon)",
        "Blockchain güvenliği",
        "7/24 işlem imkanı"
      ],
      riskLevel: "Yüksek",
      category: "Kripto Para"
    },
    'dollar': {
      name: "Dolar",
      symbol: "USD/TRY",
      price: "34,25 ₺",
      change: "-0.12%",
      changePercent: -0.12,
      icon: "$",
      description: "Küresel rezerv para birimi",
      volume: "890M ₺",
      high24h: "34,45 ₺",
      low24h: "34,18 ₺",
      marketCap: "∞",
      about: "ABD Doları, dünya ekonomisinin temel para birimidir. Uluslararası ticarette yaygın olarak kullanılır ve güvenli yatırım aracı olarak görülür. Türk Lirası karşısında değer kazanma potansiyeli taşır.",
      features: [
        "Küresel rezerv para",
        "Yüksek likidite",
        "Güvenli yatırım",
        "Kolay erişim"
      ],
      riskLevel: "Düşük",
      category: "Döviz"
    },
    'euro': {
      name: "Euro",
      symbol: "EUR/TRY",
      price: "36,89 ₺",
      change: "+0.75%",
      changePercent: 0.75,
      icon: "€",
      description: "Avrupa para birimi",
      volume: "670M ₺",
      high24h: "37,02 ₺",
      low24h: "36,65 ₺",
      marketCap: "∞",
      about: "Euro, Avrupa Birliği'nin resmi para birimidir. 19 ülkede kullanılan Euro, küresel ticarette ikinci en çok kullanılan para birimidir. Avrupa ekonomisinin güçlü temelleri ile desteklenir.",
      features: [
        "AB'nin resmi parası",
        "Güçlü ekonomik temel",
        "Yüksek stabilite",
        "Geniş kabul alanı"
      ],
      riskLevel: "Düşük",
      category: "Döviz"
    },
    'ethereum': {
      name: "Ethereum",
      symbol: "ETH/TRY",
      price: "125.450 ₺",
      change: "+3.87%",
      changePercent: 3.87,
      icon: "Ξ",
      description: "Akıllı kontrat platformu",
      volume: "1.8B ₺",
      high24h: "128.000 ₺",
      low24h: "119.500 ₺",
      marketCap: "650B ₺",
      about: "Ethereum, akıllı kontratlar ve merkezi olmayan uygulamalar için bir platform sunar. DeFi, NFT ve Web3 ekosisteminin temelini oluşturur. Sürekli geliştirilen teknolojisi ile kripto dünyasında önemli bir yere sahiptir.",
      features: [
        "Akıllı kontratlar",
        "DeFi ekosistemi",
        "NFT desteği",
        "Sürekli geliştirme"
      ],
      riskLevel: "Yüksek",
      category: "Kripto Para"
    },
    'silver': {
      name: "Gümüş",
      symbol: "XAG/TRY",
      price: "32,45 ₺",
      change: "+1.87%",
      changePercent: 1.87,
      icon: "🥈",
      description: "Endüstriyel değerli metal",
      volume: "85M ₺",
      high24h: "32,89 ₺",
      low24h: "31,95 ₺",
      marketCap: "18B ₺",
      about: "Gümüş, hem yatırım hem de endüstriyel kullanım alanı olan değerli bir metaldir. Elektronik, tıp ve güneş panelleri gibi sektörlerde yoğun kullanımı nedeniyle talep artış potansiyeli yüksektir.",
      features: [
        "Endüstriyel kullanım",
        "Değerli metal",
        "Altına alternatif",
        "Güneş enerjisi talebi"
      ],
      riskLevel: "Orta",
      category: "Değerli Metaller"
    },
    'sterlin': {
      name: "Sterlin",
      symbol: "GBP/TRY",
      price: "43,12 ₺",
      change: "-0.34%",
      changePercent: -0.34,
      icon: "£",
      description: "İngiliz para birimi",
      volume: "450M ₺",
      high24h: "43,45 ₺",
      low24h: "42,88 ₺",
      marketCap: "∞",
      about: "İngiliz Sterlini, dünyanın en eski para birimlerinden biridir. Londra'nın küresel finans merkezi olması nedeniyle güçlü bir konuma sahiptir. Brexit sonrası yeni dinamiklerle şekillenmektedir.",
      features: [
        "Tarihi para birimi",
        "Londra finans merkezi",
        "Güçlü ekonomi",
        "Yüksek likidite"
      ],
      riskLevel: "Orta",
      category: "Döviz"
    },
    'dogecoin': {
      name: "Dogecoin",
      symbol: "DOGE/TRY",
      price: "4,67 ₺",
      change: "+8.92%",
      changePercent: 8.92,
      icon: "🐕",
      description: "Meme coin",
      volume: "650M ₺",
      high24h: "4,89 ₺",
      low24h: "4,25 ₺",
      marketCap: "85B ₺",
      about: "Dogecoin, başlangıçta şaka olarak oluşturulmuş bir kripto paradır. Ancak güçlü topluluk desteği ve ünlü isimlerin ilgisi ile popülerlik kazanmıştır. Ödemeler için kullanımı yaygınlaşmaktadır.",
      features: [
        "Güçlü topluluk",
        "Ödeme aracı",
        "Hızlı işlemler",
        "Düşük komisyon"
      ],
      riskLevel: "Çok Yüksek",
      category: "Kripto Para"
    }
  };

  const product = products[slug];

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Düşük': return 'text-green-600 bg-green-100';
      case 'Orta': return 'text-yellow-600 bg-yellow-100';
      case 'Yüksek': return 'text-orange-600 bg-orange-100';
      case 'Çok Yüksek': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Geri Dön</span>
            </button>
            <h1 className="text-xl font-bold">InvestWise</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="text-6xl">{product.icon}</div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-xl text-gray-600">{product.symbol}</p>
                <p className="text-lg text-gray-500 mt-1">{product.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900 mb-2">{product.price}</div>
              <div className="flex items-center justify-end space-x-2">
                {product.changePercent >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
                <span className={`text-xl font-semibold ${
                  product.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.change}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">24s Yüksek</p>
              <p className="text-lg font-semibold text-gray-900">{product.high24h}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">24s Düşük</p>
              <p className="text-lg font-semibold text-gray-900">{product.low24h}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">24s Hacim</p>
              <p className="text-lg font-semibold text-gray-900">{product.volume}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Piyasa Değeri</p>
              <p className="text-lg font-semibold text-gray-900">{product.marketCap}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hakkında</h2>
              <p className="text-gray-700 leading-relaxed">{product.about}</p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Temel Özellikler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Investment Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Yatırım İşlemleri</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  Satın Al
                </button>
                <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                  Sat
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  Favorilere Ekle
                </button>
              </div>
            </motion.div>

            {/* Risk & Category */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Yatırım Bilgileri</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Risk Seviyesi</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(product.riskLevel)}`}>
                    {product.riskLevel}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Kategori</p>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Market Hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Piyasa Saatleri</h3>
              <div className="space-y-2">
                {product.category === "Kripto Para" ? (
                  <p className="text-green-600 font-semibold">🟢 7/24 Açık</p>
                ) : (
                  <>
                    <p className="text-gray-700">Pazartesi - Cuma</p>
                    <p className="text-gray-700">09:00 - 18:00</p>
                    <p className="text-orange-600 font-semibold">⏰ Şu anda açık</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetailPage; 
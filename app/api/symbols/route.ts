import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // API anahtarını al
  const apiKey = process.env.COLLECTAPI_KEY || '0udzN6GhaeQOJ3pLiS7Gim:6awak8XLcTu6n8wWjb9j0D';
  
  if (!apiKey || apiKey === 'your_token') {
    console.log('CollectAPI anahtarı bulunamadı, mock data kullanılıyor');
    return getMockSymbolsData();
  }

  try {
    const response = await fetch('https://api.collectapi.com/economy/liveBorsa', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `apikey ${apiKey}`
      }
    });

    if (!response.ok) {
      console.error(`CollectAPI LiveBorsa Error: ${response.status} - ${response.statusText}`);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.result) {
      console.error('CollectAPI liveBorsa geçersiz response döndürdü:', data);
      throw new Error('Invalid API response');
    }
    
    // Borsa verilerini işle
    const processedData = data.result.map((stock: any) => {
      // Hisse senedi bilgilerini al
      const stockCode = stock.code || stock.symbol || '';
      const stockName = stock.text || stock.name || stockCode;
      const lastPrice = stock.lastprice || stock.price || '0';
      const changeRate = stock.changerate || stock.change || '0';
      const changeAmount = stock.diff || stock.changeAmount || '0';
      
      // Kategori ve ikon belirleme
      let category = 'stock';
      let icon = '📈';
      
      // BIST endekslerini ayırt et
      if (stockCode.includes('XU') || stockCode === 'BIST100' || stockCode === 'BIST30') {
        category = 'index';
        icon = '📊';
      } else if (stockCode.includes('BANK') || stockName.toLowerCase().includes('bank')) {
        category = 'banking';
        icon = '🏦';
      } else if (stockCode.includes('TEKNO') || stockName.toLowerCase().includes('teknoloji')) {
        category = 'technology';
        icon = '💻';
      } else if (stockName.toLowerCase().includes('enerji') || stockName.toLowerCase().includes('elektrik')) {
        category = 'energy';
        icon = '⚡';
      }
      
      return {
        id: stock.id || stockCode,
        symbol: stockCode,
        name: stockName,
        category,
        icon,
        description: getStockDescription(stockCode, stockName),
        price: formatPrice(lastPrice),
        change: formatChange(changeAmount),
        changePercent: parseFloat(changeRate) || 0,
        volume: stock.hacim || stock.volume || 'N/A',
        high24h: stock.max || stock.high || lastPrice,
        low24h: stock.min || stock.low || lastPrice,
        updateTime: new Date().toISOString()
      };
    });

    return NextResponse.json({
      success: true,
      data: processedData,
      timestamp: new Date().toISOString(),
      source: 'CollectAPI LiveBorsa'
    });

  } catch (error) {
    console.error('LiveBorsa API Error:', error);
    return getMockSymbolsData();
  }
}

function getSymbolIcon(symbol: string): string {
  const icons: Record<string, string> = {
    'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵',
    'CHF': '🇨🇭', 'CAD': '🇨🇦', 'AUD': '🇦🇺', 'TRY': '🇹🇷'
  };
  
  for (const [code, icon] of Object.entries(icons)) {
    if (symbol.includes(code)) return icon;
  }
  return '💱';
}

function getCryptoIcon(symbol: string): string {
  const icons: Record<string, string> = {
    'BTC': '₿', 'ETH': 'Ξ', 'DOGE': '🐕', 'ADA': '🔷', 
    'LTC': 'Ł', 'XRP': '💧', 'DOT': '🔴'
  };
  
  for (const [code, icon] of Object.entries(icons)) {
    if (symbol.includes(code)) return icon;
  }
  return '🪙';
}

function getMetalIcon(symbol: string): string {
  if (symbol.includes('XAU') || symbol.toLowerCase().includes('gold')) return '🥇';
  if (symbol.includes('XAG') || symbol.toLowerCase().includes('silver')) return '🥈';
  if (symbol.toLowerCase().includes('platinum')) return '⚪';
  return '🏗️';
}

function getStockDescription(stockCode: string, stockName: string): string {
  // BIST endeksleri
  if (stockCode.includes('XU') || stockCode === 'BIST100') return 'BIST 100 Endeksi';
  if (stockCode === 'BIST30') return 'BIST 30 Endeksi';
  
  // Sektörel açıklamalar
  if (stockCode.includes('BANK') || stockName.toLowerCase().includes('bank')) {
    return 'Bankacılık Sektörü';
  }
  if (stockCode.includes('TEKNO') || stockName.toLowerCase().includes('teknoloji')) {
    return 'Teknoloji Sektörü';
  }
  if (stockName.toLowerCase().includes('enerji') || stockName.toLowerCase().includes('elektrik')) {
    return 'Enerji Sektörü';
  }
  if (stockName.toLowerCase().includes('turizm') || stockName.toLowerCase().includes('otel')) {
    return 'Turizm Sektörü';
  }
  if (stockName.toLowerCase().includes('inşaat') || stockName.toLowerCase().includes('yapı')) {
    return 'İnşaat Sektörü';
  }
  
  return 'Borsa İstanbul Hissesi';
}

function formatPrice(price: any): string {
  if (!price || price === '0') return 'N/A';
  
  const numPrice = parseFloat(price.toString().replace(',', '.'));
  if (isNaN(numPrice)) return price.toString();
  
  return numPrice.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' ₺';
}

function formatChange(change: any): string {
  if (!change || change === '0') return '0.00';
  
  const numChange = parseFloat(change.toString().replace(',', '.'));
  if (isNaN(numChange)) return change.toString();
  
  const sign = numChange >= 0 ? '+' : '';
  return sign + numChange.toFixed(2);
}

function getMockSymbolsData() {
  // Mock data - Türk borsa verilerine benzer
  const mockStocks = [
    {
      id: 'bist100',
      symbol: 'XU100',
      name: 'BIST 100',
      category: 'index',
      icon: '📊',
      description: 'BIST 100 Endeksi',
      price: '9.845,67 ₺',
      change: '+125.45',
      changePercent: 1.29,
      volume: '12.5B',
      high24h: '9.867,23 ₺',
      low24h: '9.720,12 ₺',
      updateTime: new Date().toISOString()
    },
    {
      id: 'tuprs',
      symbol: 'TUPRS',
      name: 'Tüpraş',
      category: 'energy',
      icon: '⚡',
      description: 'Enerji Sektörü',
      price: '156,20 ₺',
      change: '+3.80',
      changePercent: 2.49,
      volume: '125M',
      high24h: '158,50 ₺',
      low24h: '152,40 ₺',
      updateTime: new Date().toISOString()
    },
    {
      id: 'akbnk',
      symbol: 'AKBNK',
      name: 'Akbank',
      category: 'banking',
      icon: '🏦',
      description: 'Bankacılık Sektörü',
      price: '45,68 ₺',
      change: '-0.92',
      changePercent: -1.97,
      volume: '89M',
      high24h: '46,60 ₺',
      low24h: '45,20 ₺',
      updateTime: new Date().toISOString()
    },
    {
      id: 'thyao',
      symbol: 'THYAO',
      name: 'THY',
      category: 'stock',
      icon: '✈️',
      description: 'Havayolu Sektörü',
      price: '298,50 ₺',
      change: '+12.30',
      changePercent: 4.30,
      volume: '67M',
      high24h: '302,00 ₺',
      low24h: '286,20 ₺',
      updateTime: new Date().toISOString()
    },
    {
      id: 'sahol',
      symbol: 'SAHOL',
      name: 'Sabancı Holding',
      category: 'stock',
      icon: '🏢',
      description: 'Holding Sektörü',
      price: '28,94 ₺',
      change: '+0.56',
      changePercent: 1.97,
      volume: '45M',
      high24h: '29,20 ₺',
      low24h: '28,38 ₺',
      updateTime: new Date().toISOString()
    },
    {
      id: 'asels',
      symbol: 'ASELS',
      name: 'Aselsan',
      category: 'technology',
      icon: '💻',
      description: 'Teknoloji Sektörü',
      price: '89,75 ₺',
      change: '+2.15',
      changePercent: 2.45,
      volume: '34M',
      high24h: '91,20 ₺',
      low24h: '87,60 ₺',
      updateTime: new Date().toISOString()
    },
    {
      id: 'kchol',
      symbol: 'KCHOL',
      name: 'Koç Holding',
      category: 'stock',
      icon: '🏢',
      description: 'Holding Sektörü',
      price: '156,80 ₺',
      change: '-2.40',
      changePercent: -1.51,
      volume: '28M',
      high24h: '159,20 ₺',
      low24h: '155,60 ₺',
      updateTime: new Date().toISOString()
    },
    {
      id: 'tcell',
      symbol: 'TCELL',
      name: 'Turkcell',
      category: 'technology',
      icon: '📱',
      description: 'Teknoloji Sektörü',
      price: '52,30 ₺',
      change: '+1.80',
      changePercent: 3.57,
      volume: '42M',
      high24h: '53,10 ₺',
      low24h: '50,50 ₺',
      updateTime: new Date().toISOString()
    }
  ];

  return NextResponse.json({
    success: false,
    data: mockStocks,
    error: 'CollectAPI anahtarı bulunamadı. Demo borsa verileri gösteriliyor.',
    timestamp: new Date().toISOString(),
    source: 'Mock LiveBorsa Data'
  });
} 
/**
 * Döviz kodlarını TradingView sembollerine dönüştürür
 */
export const currencyToTradingViewSymbol = (currencyCode: string): string => {
  // Döviz kodunu büyük harfe çevir
  const code = currencyCode.toUpperCase();
  
  // Döviz kod mappingi - TradingView format: EXCHANGE:BASE_QUOTE
  const currencyMap: Record<string, string> = {
    'USD': 'FX_IDC:USDTRY',
    'EUR': 'FX_IDC:EURTRY',
    'GBP': 'FX_IDC:GBPTRY',
    'JPY': 'FX_IDC:JPYTRY',
    'CHF': 'FX_IDC:CHFTRY',
    'CAD': 'FX_IDC:CADTRY',
    'AUD': 'FX_IDC:AUDTRY',
    'SEK': 'FX_IDC:SEKTRY',
    'NOK': 'FX_IDC:NOKTRY',
    'DKK': 'FX_IDC:DKKTRY',
    'RUB': 'FX_IDC:RUBTRY',
    'SAR': 'FX_IDC:SARTRY',
    'KWD': 'FX_IDC:KWDTRY',
    'AED': 'FX_IDC:AEDTRY',
    'CNY': 'FX_IDC:CNYTRY',
    'INR': 'FX_IDC:INRTRY',
    'KRW': 'FX_IDC:KRWTRY',
    'SGD': 'FX_IDC:SGDTRY',
    'HKD': 'FX_IDC:HKDTRY',
    'THB': 'FX_IDC:THBTRY',
    'MXN': 'FX_IDC:MXNTRY',
    'ZAR': 'FX_IDC:ZARTRY',
    'BRL': 'FX_IDC:BRLTRY',
    'PLN': 'FX_IDC:PLNTRY',
    'HUF': 'FX_IDC:HUFTR',
    'CZK': 'FX_IDC:CZKTRY',
    'RON': 'FX_IDC:RONTRY',
    'BGN': 'FX_IDC:BGNTRY',
    'HRK': 'FX_IDC:HRKTRY',
    'ISK': 'FX_IDC:ISKTRY',
    'ILS': 'FX_IDC:ILSTRY',
    'EGP': 'FX_IDC:EGPTRY',
    'JOD': 'FX_IDC:JODTRY',
    'LBP': 'FX_IDC:LBPTRY',
    'QAR': 'FX_IDC:QARTRY',
    'BHD': 'FX_IDC:BHDTRY',
    'OMR': 'FX_IDC:OMRTRY',
    'IRR': 'FX_IDC:IRRTRY',
    'PKR': 'FX_IDC:PKRTRY',
    'AFN': 'FX_IDC:AFNTRY',
    'AZN': 'FX_IDC:AZNTRY',
    'GEL': 'FX_IDC:GELTRY',
    'AMD': 'FX_IDC:AMDTRY',
    'UZS': 'FX_IDC:UZSTRY',
    'KZT': 'FX_IDC:KZTTRY',
    'KGS': 'FX_IDC:KGSTRY',
    'TJS': 'FX_IDC:TJSTRY',
    'TMT': 'FX_IDC:TMTTRY',
    'MNT': 'FX_IDC:MNTTRY'
  };

  // Eğer mapping'de varsa o symbolu döndür, yoksa varsayılan format kullan
  return currencyMap[code] || `FX_IDC:${code}TRY`;
};

/**
 * Genel yatırım sembollerini TradingView formatına dönüştürür
 */
export const getInvestmentSymbol = (symbol: string, type: 'stock' | 'crypto' | 'forex' | 'commodity' = 'stock'): string => {
  const upperSymbol = symbol.toUpperCase();
  
  switch (type) {
    case 'crypto':
      return `BINANCE:${upperSymbol}USDT`;
    case 'forex':
      return currencyToTradingViewSymbol(upperSymbol);
    case 'commodity':
      // Emtia sembollerini belirli exchange'lerle eşleştir
      const commodityMap: Record<string, string> = {
        'GOLD': 'TVC:GOLD',
        'SILVER': 'TVC:SILVER',
        'OIL': 'TVC:USOIL',
        'BRENT': 'TVC:UKOIL',
        'COPPER': 'COMEX:HG1!',
        'PLATINUM': 'NYMEX:PL1!',
        'PALLADIUM': 'NYMEX:PA1!',
        'NATURALGAS': 'NYMEX:NG1!',
        'WHEAT': 'CBOT:ZW1!',
        'CORN': 'CBOT:ZC1!',
        'SOYBEAN': 'CBOT:ZS1!'
      };
      return commodityMap[upperSymbol] || `TVC:${upperSymbol}`;
    case 'stock':
    default:
      // Hisse senetleri için exchange mapping
      const stockMap: Record<string, string> = {
        // BIST100 hisseleri
        'AKBNK': 'BIST:AKBNK',
        'ARCLK': 'BIST:ARCLK',
        'ASELS': 'BIST:ASELS',
        'BIMAS': 'BIST:BIMAS',
        'EREGL': 'BIST:EREGL',
        'GARAN': 'BIST:GARAN',
        'HALKB': 'BIST:HALKB',
        'ISCTR': 'BIST:ISCTR',
        'KCHOL': 'BIST:KCHOL',
        'KOZAL': 'BIST:KOZAL',
        'KOZAA': 'BIST:KOZAA',
        'PETKM': 'BIST:PETKM',
        'SAHOL': 'BIST:SAHOL',
        'SISE': 'BIST:SISE',
        'TCELL': 'BIST:TCELL',
        'THYAO': 'BIST:THYAO',
        'TKFEN': 'BIST:TKFEN',
        'TOASO': 'BIST:TOASO',
        'TUPRS': 'BIST:TUPRS',
        'VAKBN': 'BIST:VAKBN',
        'YKBNK': 'BIST:YKBNK',
        // US stocks
        'AAPL': 'NASDAQ:AAPL',
        'GOOGL': 'NASDAQ:GOOGL',
        'MSFT': 'NASDAQ:MSFT',
        'AMZN': 'NASDAQ:AMZN',
        'TSLA': 'NASDAQ:TSLA',
        'META': 'NASDAQ:META',
        'NVDA': 'NASDAQ:NVDA',
        'NFLX': 'NASDAQ:NFLX',
        'AMD': 'NASDAQ:AMD',
        'INTC': 'NASDAQ:INTC'
      };
      
      return stockMap[upperSymbol] || `NASDAQ:${upperSymbol}`;
  }
};

/**
 * Sembol türünü tahmin eder
 */
export const detectSymbolType = (symbol: string): 'stock' | 'crypto' | 'forex' | 'commodity' => {
  const upperSymbol = symbol.toUpperCase();
  
  // Crypto sembolleri
  const cryptos = ['BTC', 'ETH', 'BNB', 'ADA', 'XRP', 'SOL', 'DOT', 'AVAX', 'MATIC', 'LINK'];
  if (cryptos.includes(upperSymbol)) return 'crypto';
  
  // Emtia sembolleri
  const commodities = ['GOLD', 'SILVER', 'OIL', 'BRENT', 'COPPER', 'PLATINUM', 'PALLADIUM'];
  if (commodities.includes(upperSymbol)) return 'commodity';
  
  // Döviz kodları (3 haneli)
  if (upperSymbol.length === 3 && /^[A-Z]{3}$/.test(upperSymbol)) {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'SEK', 'NOK'];
    if (currencies.includes(upperSymbol)) return 'forex';
  }
  
  return 'stock';
};

/**
 * Sembol adını güzelleştirir
 */
export const formatSymbolName = (symbol: string, currencyName?: string): string => {
  if (currencyName) return currencyName;
  
  const upperSymbol = symbol.toUpperCase();
  
  const nameMap: Record<string, string> = {
    'USD': 'Amerikan Doları',
    'EUR': 'Euro',
    'GBP': 'İngiliz Sterlini',
    'JPY': 'Japon Yeni',
    'CHF': 'İsviçre Frangı',
    'CAD': 'Kanada Doları',
    'AUD': 'Avustralya Doları',
    'AAPL': 'Apple Inc.',
    'GOOGL': 'Alphabet Inc.',
    'MSFT': 'Microsoft Corporation',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation',
    'GOLD': 'Altın',
    'SILVER': 'Gümüş',
    'OIL': 'Ham Petrol',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum'
  };
  
  return nameMap[upperSymbol] || symbol;
}; 
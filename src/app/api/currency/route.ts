import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // API anahtarını al (environment variable'dan veya direkt kullan)
  const apiKey = process.env.COLLECTAPI_KEY || '0udzN6GhaeQOJ3pLiS7Gim:6awak8XLcTu6n8wWjb9j0D';
  
  if (!apiKey || apiKey === 'your_token') {
    console.log('CollectAPI anahtarı bulunamadı, mock data kullanılıyor');
    return getMockData();
  }

  try {
    const response = await fetch('https://api.collectapi.com/economy/allCurrency', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `apikey ${apiKey}`
      }
    });

    if (!response.ok) {
      console.error(`CollectAPI Error: ${response.status} - ${response.statusText}`);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.result) {
      console.error('CollectAPI geçersiz response döndürdü:', data);
      throw new Error('Invalid API response');
    }
    
    // Türk Lirası karşısındaki kurları filtrele ve düzenle
    const processedData = data.result.map((currency: any) => ({
      code: currency.code,
      name: currency.name,
      rate: parseFloat(currency.selling || currency.buying),
      buying: parseFloat(currency.buying),
      selling: parseFloat(currency.selling),
      change: currency.change || '0',
      changePercent: parseFloat(currency.rate || '0'),
      updateTime: new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: processedData,
      timestamp: new Date().toISOString(),
      source: 'CollectAPI'
    });

  } catch (error) {
    console.error('Currency API Error:', error);
    return getMockData();
  }
}

function getMockData() {
  // Daha gerçekçi ve dinamik mock data
  const baseRates = {
    USD: { base: 34.25, name: 'Amerikan Doları' },
    EUR: { base: 36.89, name: 'Euro' },
    GBP: { base: 43.12, name: 'İngiliz Sterlini' },
    JPY: { base: 0.2245, name: 'Japon Yeni' },
    CHF: { base: 38.75, name: 'İsviçre Frangı' },
    CAD: { base: 24.85, name: 'Kanada Doları' },
    AUD: { base: 21.45, name: 'Avustralya Doları' },
    SEK: { base: 3.12, name: 'İsveç Kronu' },
    NOK: { base: 3.08, name: 'Norveç Kronu' },
    DKK: { base: 4.95, name: 'Danimarka Kronu' },
    CNY: { base: 4.71, name: 'Çin Yuanı' },
    RUB: { base: 0.35, name: 'Rus Rublesi' },
    SAR: { base: 9.13, name: 'Suudi Arabistan Riyali' },
    KWD: { base: 111.45, name: 'Kuveyt Dinarı' },
    QAR: { base: 9.40, name: 'Katar Riyali' },
    AED: { base: 9.32, name: 'BAE Dirhemi' }
  };

  const mockData = Object.entries(baseRates).map(([code, info]) => {
    // Rastgele küçük değişimler ekle (-2% ile +2% arası)
    const changePercent = (Math.random() - 0.5) * 4; // -2 ile +2 arası
    const currentRate = info.base * (1 + changePercent / 100);
    const buying = currentRate * 0.998; // %0.2 spread
    const selling = currentRate * 1.002; // %0.2 spread
    
    return {
      code,
      name: info.name,
      rate: parseFloat(selling.toFixed(4)),
      buying: parseFloat(buying.toFixed(4)),
      selling: parseFloat(selling.toFixed(4)),
      change: changePercent >= 0 ? `+${Math.abs(changePercent * currentRate / 100).toFixed(2)}` : `-${Math.abs(changePercent * currentRate / 100).toFixed(2)}`,
      changePercent: parseFloat(changePercent.toFixed(2)),
      updateTime: new Date().toISOString()
    };
  });

  return NextResponse.json({
    success: false,
    data: mockData,
    error: 'CollectAPI anahtarı bulunamadı. Demo veriler gösteriliyor.',
    timestamp: new Date().toISOString(),
    source: 'Mock Data'
  });
} 
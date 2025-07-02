import { useState, useEffect, useCallback } from 'react';
import { CurrencyRate, CurrencyResponse } from '../types/currency';

export const useCurrency = () => {
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCurrencies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/currency');
      const data: CurrencyResponse = await response.json();
      
      if (data.success) {
        setCurrencies(data.data);
        setLastUpdated(new Date());
      } else {
        setError(data.error || 'Döviz kurları alınamadı');
        // Hata durumunda da mock data'yı kullan
        setCurrencies(data.data);
      }
    } catch (err) {
      setError('Ağ hatası: Döviz kurları yüklenemedi');
      console.error('Currency fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  // 30 saniyede bir otomatik güncelleme
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrencies();
    }, 30000); // 30 saniye

    return () => clearInterval(interval);
  }, [fetchCurrencies]);

  // Belirli bir dövizi bulma
  const getCurrencyByCode = useCallback((code: string): CurrencyRate | undefined => {
    return currencies.find(currency => currency.code === code);
  }, [currencies]);

  // Manuel yenileme
  const refresh = useCallback(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return {
    currencies,
    loading,
    error,
    lastUpdated,
    refresh,
    getCurrencyByCode
  };
}; 
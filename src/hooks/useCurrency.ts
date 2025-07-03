import { useState, useEffect, useCallback } from 'react';
import { CurrencyRate, CurrencyResponse } from '../types/currency';

export const useCurrency = () => {
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchCurrencies = useCallback(async (isManualRefresh = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else if (isManualRefresh) {
        setRefreshing(true);
      }
      
      setError(null);
      
      const response = await fetch('/api/currency');
      const data: CurrencyResponse = await response.json();
      
      if (data.success) {
        setCurrencies(data.data);
        setLastUpdated(new Date());
      } else {
        setError(data.error || 'Döviz kurları alınamadı');
        setCurrencies(data.data);
      }
    } catch (err) {
      setError('Ağ hatası: Döviz kurları yüklenemedi');
      console.error('Currency fetch error:', err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      } else if (isManualRefresh) {
        setRefreshing(false);
      }
    }
  }, [isInitialLoad]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isInitialLoad) {
        fetchCurrencies(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchCurrencies, isInitialLoad]);

  const getCurrencyByCode = useCallback((code: string): CurrencyRate | undefined => {
    return currencies.find(currency => currency.code === code);
  }, [currencies]);

  const refresh = useCallback(() => {
    fetchCurrencies(true);
  }, [fetchCurrencies]);

  return {
    currencies,
    loading,
    refreshing,
    error,
    lastUpdated,
    refresh,
    getCurrencyByCode
  };
}; 
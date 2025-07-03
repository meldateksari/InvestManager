import { useState, useEffect } from 'react';

export interface Symbol {
  id: string;
  symbol: string;
  name: string;
  category: 'index' | 'stock' | 'banking' | 'technology' | 'energy' | 'other';
  icon: string;
  description: string;
  price: string | number;
  change: string;
  changePercent: number;
  volume: string;
  high24h: string;
  low24h: string;
  updateTime: string;
}

export interface SymbolsResponse {
  success: boolean;
  data: Symbol[];
  error?: string;
  timestamp: string;
  source: string;
}

export function useSymbols() {
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchSymbols = async () => {
    try {
      setError(null);
      const response = await fetch('/api/symbols');
      const data: SymbolsResponse = await response.json();
      
      if (data.success) {
        setSymbols(data.data);
        setLastUpdate(new Date());
      } else {
        setSymbols(data.data); // Mock data de kullanılabilir
        setError(data.error || 'API hatası oluştu');
      }
    } catch (err) {
      console.error('Symbols fetch error:', err);
      setError('Veriler yüklenirken hata oluştu');
      setSymbols([]); // Boş array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymbols();
    
    // Her 60 saniyede bir güncelle (symbols daha az değişir)
    const interval = setInterval(fetchSymbols, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Kategoriye göre sembolleri filtrele
  const getSymbolsByCategory = (category: string) => {
    return symbols.filter(symbol => symbol.category === category);
  };

  // En çok yükselenler
  const getTopGainers = (limit: number = 5) => {
    return [...symbols]
      .filter(s => s.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, limit);
  };

  // En çok düşenler
  const getTopLosers = (limit: number = 5) => {
    return [...symbols]
      .filter(s => s.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, limit);
  };

  // Sembol arama
  const searchSymbols = (query: string) => {
    if (!query.trim()) return symbols;
    
    const lowerQuery = query.toLowerCase();
    return symbols.filter(symbol => 
      symbol.symbol.toLowerCase().includes(lowerQuery) ||
      symbol.name.toLowerCase().includes(lowerQuery) ||
      symbol.description.toLowerCase().includes(lowerQuery)
    );
  };

  // ID'ye göre sembol bul
  const getSymbolById = (id: string) => {
    return symbols.find(symbol => symbol.id === id);
  };

  return {
    symbols,
    loading,
    error,
    lastUpdate,
    fetchSymbols,
    getSymbolsByCategory,
    getTopGainers,
    getTopLosers,
    searchSymbols,
    getSymbolById
  };
} 
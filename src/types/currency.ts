export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  buying: number;
  selling: number;
  change: string;
  changePercent: number;
  updateTime: string;
}

export interface CurrencyResponse {
  success: boolean;
  data: CurrencyRate[];
  timestamp: string;
  error?: string;
}

export interface CurrencyCardProps {
  currency: CurrencyRate;
  onClick?: (currency: CurrencyRate) => void;
}

export interface CurrencyListProps {
  currencies: CurrencyRate[];
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
} 
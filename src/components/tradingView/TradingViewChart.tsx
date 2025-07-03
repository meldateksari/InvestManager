'use client';
import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
  height?: number;
  theme?: 'light' | 'dark';
  interval?: string;
  locale?: string;
  className?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingViewChart({ 
  symbol,
  height = 400,
  theme = 'light',
  interval = 'D',
  locale = 'tr',
  className = ''
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TradingView script'i zaten yüklü mü kontrol et
    if (window.TradingView) {
      createWidget();
      return;
    }

    // Script'i yükle
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      createWidget();
    };
    
    // Script'i sadece bir kez ekle
    if (!document.querySelector('script[src="https://s3.tradingview.com/tv.js"]')) {
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup - container'ı temizle
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, height, theme, interval, locale]);

  const createWidget = () => {
    if (!containerRef.current || !window.TradingView) return;

    // Container'ı temizle
    containerRef.current.innerHTML = '';

    // Benzersiz ID oluştur
    const containerId = `tradingview-widget-${Math.random().toString(36).substr(2, 9)}`;
    containerRef.current.id = containerId;

    try {
      new window.TradingView.widget({
        width: '100%',
        height: height,
        symbol: symbol,
        interval: interval,
        timezone: 'Europe/Istanbul',
        theme: theme,
        style: '1',
        locale: locale,
        toolbar_bg: theme === 'light' ? '#f1f3f6' : '#1e1e1e',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerId,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        calendar: false,
        hide_volume: false,
        support_host: 'https://www.tradingview.com'
      });
    } catch (error) {
      console.error('TradingView widget oluşturulurken hata:', error);
    }
  };

  return (
    <div className={`tradingview-widget-container ${className}`}>
      <div 
        ref={containerRef}
        className="w-full rounded-lg overflow-hidden bg-white border border-gray-200"
        style={{ height: `${height}px` }}
      />
    </div>
  );
} 
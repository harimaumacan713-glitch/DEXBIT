import React, { useState, useEffect } from 'react';
import { ChevronRight, TrendingUp, ChevronDown } from 'lucide-react';

export default function PortfolioScreen({ setCurrentScreen }: { setCurrentScreen: (screen: string) => void }) {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await res.json();
        const newPrice = parseFloat(data.price);
        
        setCurrentPrice(prevPrice => {
          if (prevPrice !== 0) {
            if (newPrice > prevPrice) setPriceFlash('up');
            else if (newPrice < prevPrice) setPriceFlash('down');
            setTimeout(() => setPriceFlash(null), 500);
          }
          return newPrice;
        });
      } catch (e) {
        console.error('Failed to fetch price', e);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 3000);
    return () => clearInterval(interval);
  }, []);

  // Initial state logic: amount and avgPrice are 0
  const assets = [
    { code: 'BTC', amount: 0, avgPrice: 0, currentPrice: currentPrice },
  ];

  const calculatedAssets = assets.map(asset => {
    const invested = asset.amount * asset.avgPrice;
    const marketValue = asset.amount * asset.currentPrice;
    const pnl = marketValue - invested;
    const gain = invested > 0 ? (pnl / invested) * 100 : 0;
    return { ...asset, invested, marketValue, pnl, gain };
  });

  const totalInvested = calculatedAssets.reduce((acc, a) => acc + a.invested, 0);
  const totalMarketValue = calculatedAssets.reduce((acc, a) => acc + a.marketValue, 0);
  const totalPnl = totalMarketValue - totalInvested;
  const totalGain = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
  const tradingBalance = 2801641;
  const totalEquity = tradingBalance + totalMarketValue;

  const formatPnl = (val: number) => {
    if (val === 0) return '0';
    return (val > 0 ? '+' : '') + val.toLocaleString('id-ID', {maximumFractionDigits: 0});
  };

  const getPnlColor = (val: number) => {
    if (val > 0) return 'text-[#00a85a]';
    if (val < 0) return 'text-red-600';
    return 'text-gray-900';
  };

  const getGainColor = (val: number) => {
    if (val > 0) return 'text-[#00a85a]';
    if (val < 0) return 'text-red-600';
    return 'text-gray-500'; // Gray for 0%
  };

  return (
    <>
      <div className="w-full h-[calc(100vh-70px)] bg-gray-50 flex flex-col overflow-y-auto pb-4">
        <div className="flex px-4 py-3 border-b border-gray-200 bg-white items-center justify-between">
          <div className="flex">
            <span className="flex items-center gap-1 text-[14px] font-bold text-[#00a85a] border-b-2 border-[#00a85a] pb-1 mr-6">
              STOCKS
            </span>
            <span className="text-[14px] font-medium text-gray-400 mr-6">ORDER</span>
            <span className="text-[14px] font-medium text-gray-400">HISTORY</span>
          </div>
        </div>

        <div className="px-4 py-4 flex-1">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div>
                <p className="text-[10px] text-gray-400">Trading Balance</p>
                <p className="text-[14px] font-bold text-gray-900">{tradingBalance.toLocaleString('id-ID', {maximumFractionDigits: 0})}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Invested</p>
                <p className="text-[14px] font-bold text-gray-900">{totalInvested.toLocaleString('id-ID', {maximumFractionDigits: 0})}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Open</p>
                <p className="text-[14px] font-bold text-gray-900">0</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div>
                <p className="text-[10px] text-gray-400">P&L</p>
                <p className={`text-[14px] font-bold ${getPnlColor(totalPnl)}`}>{formatPnl(totalPnl)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Gain</p>
                <p className={`text-[14px] font-bold ${getGainColor(totalGain)}`}>{totalGain === 0 ? '0.00%' : `${totalGain > 0 ? '+' : ''}${totalGain.toFixed(2)}%`}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Total Equity</p>
                <p className="text-[14px] font-bold text-gray-900">{totalEquity.toLocaleString('id-ID', {maximumFractionDigits: 0})}</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-between text-[12px] text-gray-600 border-t border-gray-100 pt-3 mt-1">
               <span className="flex items-center gap-1 font-semibold text-gray-500"><TrendingUp className="w-3 h-3"/> View Performance</span>
               <ChevronRight className="w-4 h-4 text-gray-400"/>
            </button>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-4 text-[10px] text-gray-400 mb-2 px-1">
              <span className="text-left">Code<br/>Amount</span>
              <span className="text-right">Invested<br/>Avg Price</span>
              <span className="text-right">Market<br/>Current Price</span>
              <span className="text-right">P&L<br/>Gain</span>
            </div>
            {calculatedAssets.map((asset, i) => (
              <div key={i} className="grid grid-cols-4 items-center py-3 border-t border-gray-100 px-1 bg-white">
                <div className="text-left">
                  <p className="text-[13px] font-bold text-gray-900">{asset.code} <span className="text-[8px] bg-purple-100 text-purple-600 px-0.5 rounded">C</span></p>
                  <p className="text-[10px] text-gray-400">{asset.amount.toFixed(8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-gray-900">{asset.invested.toLocaleString('id-ID', {maximumFractionDigits: 0})}</p>
                  <p className="text-[10px] text-gray-400">{asset.avgPrice.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-gray-900">{asset.marketValue.toLocaleString('id-ID', {maximumFractionDigits: 0})}</p>
                  <p className={`text-[10px] ${priceFlash === 'up' ? 'text-[#00a85a]' : priceFlash === 'down' ? 'text-red-600' : 'text-gray-500'}`}>{asset.currentPrice > 0 ? asset.currentPrice.toLocaleString('id-ID', {maximumFractionDigits: 0}) : 'Loading...'}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[11px] font-bold ${getPnlColor(asset.pnl)}`}>{formatPnl(asset.pnl)}</p>
                  <p className={`text-[10px] ${getGainColor(asset.gain)}`}>{asset.gain === 0 ? '0.00%' : `${asset.gain > 0 ? '+' : ''}${asset.gain.toFixed(2)}%`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div 
        style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '70px', zIndex: 999, backgroundColor: '#ffffff', borderTop: '1px solid #eeeeee' }}
        className="flex justify-between items-center px-6"
      >
        <button onClick={() => setCurrentScreen('dashboard')} className="flex flex-col items-center gap-[5px]">
          <svg className="w-[26px] h-[26px] text-[#9ba4b5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="text-[11px] font-medium text-[#9ba4b5]">Watchlist</span>
        </button>
        <button className="flex flex-col items-center gap-[5px]">
          <svg className="w-[26px] h-[26px] text-[#9ba4b5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="3.5" ry="3.5" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="16" y2="14" />
          </svg>
          <span className="text-[11px] font-medium text-[#9ba4b5]">Stream</span>
        </button>
        <button onClick={() => setCurrentScreen('search')} className="flex flex-col items-center gap-[5px]">
          <svg className="w-[26px] h-[26px] text-[#9ba4b5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16" y2="16" />
          </svg>
          <span className="text-[11px] font-medium text-[#9ba4b5]">Search</span>
        </button>
        <button className="flex flex-col items-center gap-[5px]">
          <svg className="w-[26px] h-[26px] text-[#9ba4b5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-[11px] font-medium text-[#9ba4b5]">Chat</span>
        </button>
        <button onClick={() => setCurrentScreen('portfolio')} className="flex flex-col items-center gap-[5px]">
          <svg className="w-[26px] h-[26px] text-[#00a85a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v9h9" />
          </svg>
          <span className="text-[11px] font-semibold text-[#00a85a]">Portfolio</span>
        </button>
      </div>
    </>
  );
}

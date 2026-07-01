import React, { useState, useEffect } from 'react';
import { ChevronRight, TrendingUp, ChevronDown } from 'lucide-react';

export default function PortfolioScreen({
  setCurrentScreen,
  tradingBalance,
  assets,
  orders = [],
  history = [],
  onCancelOrder,
  onTransactionClick
}: {
  setCurrentScreen: (screen: string) => void;
  tradingBalance: number;
  assets: any[];
  orders?: any[];
  history?: any[];
  onCancelOrder?: (orderId: string) => void;
  onTransactionClick?: (transaction: any) => void;
}) {
  const [activeTab, setActiveTab] = useState<'stocks' | 'order' | 'history'>('stocks');
  const FALLBACK_PRICES: Record<string, number> = {
    BTC: 96500.00,
    ETH: 3450.00,
    BNB: 612.50,
    SOL: 182.20,
    XRP: 1.12,
    ADA: 0.58,
    DOGE: 0.22,
    AVAX: 28.50,
    DOT: 6.10,
    MATIC: 0.52,
    LINK: 18.40,
    UNI: 7.80,
    LTC: 84.30
  };

  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>(FALLBACK_PRICES);
  const [priceFlashes, setPriceFlashes] = useState<Record<string, 'up' | 'down'>>({});

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('/api/prices');
        if (!res.ok) throw new Error(`Proxy responded with status ${res.status}`);
        const data: {symbol: string, price: string}[] = await res.json();
        
        const priceMap: Record<string, number> = {};
        data.forEach(item => {
           if (item.symbol.endsWith('USDT')) {
               const code = item.symbol.replace('USDT', '');
               priceMap[code] = parseFloat(item.price);
           }
        });
        
        setCurrentPrices(prev => {
          const newFlashes: Record<string, 'up' | 'down'> = {};
          let flashChanged = false;
          
          assets.forEach(asset => {
             const newPrice = priceMap[asset.code];
             if (newPrice && prev[asset.code]) {
                 if (newPrice > prev[asset.code]) { newFlashes[asset.code] = 'up'; fillFlashChanged(); }
                 else if (newPrice < prev[asset.code]) { newFlashes[asset.code] = 'down'; fillFlashChanged(); }
             }
             function fillFlashChanged() {
               flashChanged = true;
             }
          });
          
          if (flashChanged) {
             setPriceFlashes(newFlashes);
             setTimeout(() => setPriceFlashes({}), 500);
          }
          
          return { ...prev, ...priceMap };
        });
      } catch (e) {
        console.warn('Failed to fetch prices through proxy in PortfolioScreen, maintaining fallbacks:', e);
      }
    };

    if (assets.length > 0) {
        fetchPrice();
        const interval = setInterval(fetchPrice, 3000);
        return () => clearInterval(interval);
    }
  }, [assets]);

  const IDR_RATE = 16000;

  const calculatedAssets = assets.map(asset => {
    const currentPriceUSDT = currentPrices[asset.code] || asset.avgPrice;
    const currentPriceIDR = currentPriceUSDT * IDR_RATE;
    const avgPriceIDR = asset.avgPrice * IDR_RATE;
    
    const invested = asset.amount * avgPriceIDR;
    const marketValue = asset.amount * currentPriceIDR;
    const pnl = marketValue - invested;
    const gain = invested > 0 ? (pnl / invested) * 100 : 0;
    return { ...asset, currentPrice: currentPriceIDR, avgPriceIDR, invested, marketValue, pnl, gain };
  });

  const totalInvested = calculatedAssets.reduce((acc, a) => acc + a.invested, 0);
  const totalMarketValue = calculatedAssets.reduce((acc, a) => acc + a.marketValue, 0);
  const totalPnl = totalMarketValue - totalInvested;
  const totalGain = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
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
            <span 
              onClick={() => setActiveTab('stocks')}
              className={`text-[14px] pb-1 mr-6 cursor-pointer select-none ${activeTab === 'stocks' ? 'font-bold text-[#00a85a] border-b-2 border-[#00a85a]' : 'font-medium text-gray-400'}`}
            >
              STOCKS
            </span>
            <span 
              onClick={() => setActiveTab('order')}
              className={`text-[14px] pb-1 mr-6 cursor-pointer select-none ${activeTab === 'order' ? 'font-bold text-[#00a85a] border-b-2 border-[#00a85a]' : 'font-medium text-gray-400'}`}
            >
              ORDER
            </span>
            <span 
              onClick={() => setActiveTab('history')}
              className={`text-[14px] pb-1 cursor-pointer select-none ${activeTab === 'history' ? 'font-bold text-[#00a85a] border-b-2 border-[#00a85a]' : 'font-medium text-gray-400'}`}
            >
              HISTORY
            </span>
          </div>
        </div>

        <div className="px-4 py-4 flex-1">
          {activeTab === 'stocks' && (
            <>
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
                    <p className="text-[14px] font-bold text-gray-900">{assets.length}</p>
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
                {calculatedAssets.length === 0 ? (
                  <div className="bg-white rounded-xl py-12 border border-gray-200 text-center text-gray-400 text-sm shadow-sm">
                    Belum ada aset di portfolio
                  </div>
                ) : (
                  calculatedAssets.map((asset, i) => (
                    <div key={i} className="grid grid-cols-4 items-center py-3 border-t border-gray-100 px-1 bg-white cursor-pointer hover:bg-gray-50" onClick={() => {
                       const lastTransaction = history.find(h => h.symbol === asset.code) || { ...asset, id: 'n/a', orderType: 'market', timestamp: Date.now(), price: asset.avgPrice, amount: asset.amount };
                       onTransactionClick && onTransactionClick(lastTransaction);
                    }}>
                      <div className="text-left">
                        <p className="text-[13px] font-bold text-gray-900">{asset.code} <span className="text-[8px] bg-purple-100 text-purple-600 px-0.5 rounded">C</span></p>
                        <p className="text-[10px] text-gray-400">{asset.amount.toFixed(8)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-gray-900">{asset.invested.toLocaleString('id-ID', {maximumFractionDigits: 0})}</p>
                        <p className="text-[10px] text-gray-400">{asset.avgPriceIDR.toLocaleString('id-ID', {maximumFractionDigits: 0})}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-gray-900">{asset.marketValue.toLocaleString('id-ID', {maximumFractionDigits: 0})}</p>
                        <p className={`text-[10px] ${priceFlashes[asset.code] === 'up' ? 'text-[#00a85a]' : priceFlashes[asset.code] === 'down' ? 'text-red-600' : 'text-gray-500'}`}>{asset.currentPrice > 0 ? asset.currentPrice.toLocaleString('id-ID', {maximumFractionDigits: 0}) : 'Loading...'}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[11px] font-bold ${getPnlColor(asset.pnl)}`}>{formatPnl(asset.pnl)}</p>
                        <p className={`text-[10px] ${getGainColor(asset.gain)}`}>{asset.gain === 0 ? '0.00%' : `${asset.gain > 0 ? '+' : ''}${asset.gain.toFixed(2)}%`}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'order' && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-gray-400 mb-1 tracking-wider uppercase">Open Limit Orders</h3>
              {orders.filter(o => o.status === 'open').length === 0 ? (
                <div className="bg-white rounded-xl p-8 border border-gray-200 text-center text-gray-400 text-sm shadow-sm">
                  Tidak ada order limit yang aktif
                </div>
              ) : (
                orders.filter(o => o.status === 'open').map((order) => {
                  const limitPriceIDR = order.price * IDR_RATE;
                  const totalEstIDR = order.amount * limitPriceIDR * (order.type === 'buy' ? 1.001 : 0.999);
                  return (
                    <div key={`${order.id}-${order.timestamp}`} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col gap-2 text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${order.type === 'buy' ? 'bg-[#00a85a]/10 text-[#00a85a]' : 'bg-[#da304a]/10 text-[#da304a]'}`}>
                            {order.type === 'buy' ? 'Buy' : 'Sell'}
                          </span>
                          <span className="text-[13px] font-bold text-gray-900">{order.symbol}</span>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded capitalize">{order.orderType}</span>
                        </div>
                        {onCancelOrder && (
                          <button 
                            onClick={() => onCancelOrder(order.id)}
                            className="text-[11px] font-bold text-[#da304a] hover:underline"
                          >
                            Batal
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-1 text-[11px]">
                        <div>
                          <p className="text-gray-400">Price (Limit)</p>
                          <p className="font-bold text-gray-800">Rp {limitPriceIDR.toLocaleString('id-ID', {maximumFractionDigits: 0})}</p>
                          <p className="text-[10px] text-gray-400">${order.price.toLocaleString('en-US')}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Jumlah (Amount)</p>
                          <p className="font-bold text-gray-800">{order.amount.toFixed(8)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400">Total (Est)</p>
                          <p className="font-bold text-gray-800">Rp {totalEstIDR.toLocaleString('id-ID', {maximumFractionDigits: 0})}</p>
                        </div>
                      </div>
                      <div className="text-[9px] text-gray-400 text-right mt-1">
                        {new Date(order.timestamp).toLocaleString('id-ID')}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-gray-400 mb-1 tracking-wider uppercase">Transaction History</h3>
              {history.length === 0 ? (
                <div className="bg-white rounded-xl p-8 border border-gray-200 text-center text-gray-400 text-sm shadow-sm">
                  Belum ada riwayat transaksi
                </div>
              ) : (
                history.map((item) => (
                  <div key={`${item.id}-${item.timestamp}`} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col gap-2 text-left cursor-pointer hover:bg-gray-50" onClick={() => onTransactionClick && onTransactionClick(item)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${item.type === 'buy' ? 'bg-[#00a85a]/10 text-[#00a85a]' : 'bg-[#da304a]/10 text-[#da304a]'}`}>
                          {item.type === 'buy' ? 'Buy' : 'Sell'}
                        </span>
                        <span className="text-[13px] font-bold text-gray-900">{item.symbol}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded capitalize">{item.orderType}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(item.timestamp).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-1 text-[11px]">
                      <div>
                        <p className="text-gray-400">Executed Price</p>
                        <p className="font-bold text-gray-800">Rp {(item.price * IDR_RATE).toLocaleString('id-ID', {maximumFractionDigits: 0})}</p>
                        <p className="text-[10px] text-gray-400">${item.price.toLocaleString('en-US')}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Jumlah (Amount)</p>
                        <p className="font-bold text-gray-800">{item.amount.toFixed(8)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400">Total Cost/Revenue</p>
                        <p className={`font-bold ${item.type === 'buy' ? 'text-red-600' : 'text-[#00a85a]'}`}>
                          {item.type === 'buy' ? '-' : '+'}Rp {item.totalIDR.toLocaleString('id-ID', {maximumFractionDigits: 0})}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
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
        <button onClick={() => setCurrentScreen('stream')} className="flex flex-col items-center gap-[5px]">
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

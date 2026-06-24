import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, Clock, TrendingUp, Activity, PlusCircle, PieChart as PieChartIcon, Moon } from 'lucide-react';
import { createChart, ColorType, CrosshairMode, LineStyle, AreaSeries } from 'lightweight-charts';
import { User } from 'firebase/auth';

// --- Icons ---
const CatLogo = () => (
  <svg width="26" height="26" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#a0c4ff"/>
    <path d="M30 45 L35 30 L45 40" fill="white"/>
    <path d="M70 45 L65 30 L55 40" fill="white"/>
    <circle cx="50" cy="65" r="28" fill="white"/>
    <circle cx="40" cy="60" r="4" fill="#333"/>
    <circle cx="60" cy="60" r="4" fill="#333"/>
    <path d="M45 70 Q50 75 55 70" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
);

const BottomNav = ({ currentScreen, setCurrentScreen }: { currentScreen: string, setCurrentScreen: (screen: string) => void }) => (
  <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-between items-center px-6 pt-3 pb-7 z-50">
    <button onClick={() => setCurrentScreen('dashboard')} className="flex flex-col items-center gap-[5px]">
      <svg className={`w-[26px] h-[26px] ${currentScreen === 'dashboard' ? 'text-[#00a85a]' : 'text-[#9ba4b5]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span className={`text-[11px] ${currentScreen === 'dashboard' ? 'font-semibold text-[#00a85a]' : 'font-medium text-[#9ba4b5]'}`}>Watchlist</span>
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
      <svg className={`w-[26px] h-[26px] ${currentScreen === 'search' ? 'text-[#00a85a]' : 'text-[#9ba4b5]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16" y2="16" />
      </svg>
      <span className={`text-[11px] ${currentScreen === 'search' ? 'font-semibold text-[#00a85a]' : 'font-medium text-[#9ba4b5]'}`}>Search</span>
    </button>
    <button className="flex flex-col items-center gap-[5px]">
      <svg className="w-[26px] h-[26px] text-[#9ba4b5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span className="text-[11px] font-medium text-[#9ba4b5]">Chat</span>
    </button>
    <button className="flex flex-col items-center gap-[5px]">
      <svg className="w-[26px] h-[26px] text-[#9ba4b5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v9h9" />
      </svg>
      <span className="text-[11px] font-medium text-[#9ba4b5]">Portfolio</span>
    </button>
  </div>
);

// --- Lightweight Chart Component ---
const ChartComponent = ({ data, isPositive }: { data: any[], isPositive: boolean }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#A3A3A3',
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { visible: false },
        },
        crosshair: {
          mode: CrosshairMode.Magnet,
          vertLine: { visible: false },
          horzLine: { visible: false },
        },
        rightPriceScale: {
          visible: false,
        },
        timeScale: {
          visible: false,
        },
        handleScroll: false,
        handleScale: false,
      });

      const series = chart.addSeries(AreaSeries, {
        lineColor: isPositive ? '#00a85a' : '#da304a',
        topColor: isPositive ? 'rgba(0, 168, 90, 0.2)' : 'rgba(218, 48, 74, 0.2)',
        bottomColor: isPositive ? 'rgba(0, 168, 90, 0)' : 'rgba(218, 48, 74, 0)',
        lineWidth: 1.5,
      });

      if (data.length > 0) {
        series.setData(data);
        
        // Add previous close reference line
        const prevClose = data[0].value;
        series.createPriceLine({
          price: prevClose,
          color: '#c4c4c4',
          lineWidth: 1,
          lineStyle: LineStyle.Dotted,
          axisLabelVisible: false,
          title: '',
        });
      }

      chart.timeScale().fitContent();

      chartRef.current = chart;
      seriesRef.current = series;

      return () => {
        chart.remove();
      };
    }
  }, []); // Mount only

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.applyOptions({
        lineColor: isPositive ? '#00a85a' : '#da304a',
        topColor: isPositive ? 'rgba(0, 168, 90, 0.2)' : 'rgba(218, 48, 74, 0.2)',
        bottomColor: isPositive ? 'rgba(0, 168, 90, 0)' : 'rgba(218, 48, 74, 0)',
      });
      seriesRef.current.setData(data);
    }
  }, [data, isPositive]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />;
};

// --- API Fetchers ---
const fetchCoinGeckoData = async () => {
  try {
    const coins = ['bitcoin', 'ethereum', 'ripple', 'solana', 'binancecoin'];
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins.join(',')}&order=market_cap_desc`);
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error: any) {
    if (error?.message === 'Failed to fetch') {
      // Ignore
    } else {
      console.error("Error fetching CoinGecko data:", error);
    }
    return [];
  }
};

const fetchBitcoinChart = async () => {
  try {
    // 5m intervals for 24h = 288 data points
    const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=5m&limit=288');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.map((kline: any) => ({
      time: Math.floor(kline[0] / 1000) + 25200, // convert ms to s and adjust timezone roughly if needed, LW charts prefers UTC
      value: parseFloat(kline[4]) // Close price
    }));
  } catch (error: any) {
    if (error?.message === 'Failed to fetch') {
      // Ignore
    } else {
      console.error("Error fetching BTC chart:", error);
    }
    return [];
  }
};

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  change24hPercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number;
  fdv: number;
}

export default function SearchScreen({ user, setCurrentScreen, setSelectedCoin }: { user: User | null, setCurrentScreen: (s: string) => void, setSelectedCoin?: (s: string) => void }) {
  const [coinsMap, setCoinsMap] = useState<Record<string, CoinData>>({});
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    let ws: WebSocket;

    const initData = async () => {
      const [cgData, chart] = await Promise.all([
        fetchCoinGeckoData(),
        fetchBitcoinChart()
      ]);

      const initialMap: Record<string, CoinData> = {};
      cgData.forEach((c: any) => {
        initialMap[c.symbol.toUpperCase()] = {
          id: c.id,
          symbol: c.symbol.toUpperCase(),
          name: c.name,
          image: c.image,
          price: c.current_price,
          change24h: c.price_change_24h,
          change24hPercent: c.price_change_percentage_24h,
          open: c.current_price, 
          high: c.high_24h,
          low: c.low_24h,
          volume: c.total_volume,
          marketCap: c.market_cap,
          fdv: c.fully_diluted_valuation || 0,
        };
      });

      setCoinsMap(initialMap);
      setChartData(chart);

      // Connect Binance WebSocket for real-time updates
      ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/xrpusdt@ticker/solusdt@ticker/bnbusdt@ticker');
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const data = message.data;
        
        if (data && data.e === '24hrTicker') {
          const symbol = data.s.replace('USDT', '');
          
          setCoinsMap(prev => {
            const coin = prev[symbol];
            if (!coin) return prev;
            
            return {
              ...prev,
              [symbol]: {
                ...coin,
                price: parseFloat(data.c),
                change24h: parseFloat(data.p),
                change24hPercent: parseFloat(data.P),
                open: parseFloat(data.o),
                high: parseFloat(data.h),
                low: parseFloat(data.l),
                volume: parseFloat(data.q), // Quote asset volume (in USD roughly)
              }
            };
          });

          // Live update the chart for BTC
          if (symbol === 'BTC') {
            setChartData(prev => {
              if (prev.length === 0) return prev;
              const newChart = [...prev];
              // Update the last candle with current price
              const lastCandle = newChart[newChart.length - 1];
              newChart[newChart.length - 1] = { time: lastCandle.time, value: parseFloat(data.c) };
              return newChart;
            });
          }
        }
      };
    };

    initData();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const formatNumber = (num: number, maximumFractionDigits = 2) => {
    if (num === undefined || num === null) return '0.00';
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits,
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatCompactNumber = (num: number) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('en-US', {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 2
    }).format(num);
  };

  const btcData = coinsMap['BTC'];
  const isPositive = btcData?.change24hPercent >= 0;
  
  const previousClose = chartData.length > 0 ? chartData[0].value : 0;
  const high24h = btcData?.high || (chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 0);
  const low24h = btcData?.low || (chartData.length > 0 ? Math.min(...chartData.map(d => d.value)) : 0);

  // Ordered trending list
  const trendingList = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP'].map(sym => coinsMap[sym]).filter(Boolean);

  return (
    <div className="w-full h-full flex flex-col bg-white relative">
      {/* Top Bar */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <CatLogo />
          )}
        </div>
        <div className="flex-1 h-10 bg-gray-100 rounded-full flex items-center px-4">
          <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search crypto, symbol, or username" 
            className="bg-transparent border-none outline-none text-[13px] text-gray-800 w-full placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between px-4 border-b border-gray-100">
        <button className="py-3 px-2 border-b-2 border-[#00a85a] text-[#00a85a] text-[11px] font-bold tracking-wide">MARKET</button>
        <button className="py-3 px-2 border-b-2 border-transparent text-gray-500 text-[11px] font-semibold tracking-wide">GLOBAL</button>
        <button className="py-3 px-2 border-b-2 border-transparent text-gray-500 text-[11px] font-semibold tracking-wide flex items-center gap-1">
          NEW COINS
          <span className="bg-[#1a73e8] text-white text-[8px] font-bold px-1 rounded-sm leading-tight">New</span>
        </button>
        <button className="py-3 px-2 border-b-2 border-transparent text-gray-500 text-[11px] font-semibold tracking-wide">TRENDING DEFI</button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {/* Main Index (BTC) */}
        <div 
          onClick={() => setSelectedCoin && setSelectedCoin('BTC')}
          className="px-5 pt-5 pb-3 flex justify-between items-start cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-[#2b3139] text-white text-[12px] font-bold px-2 py-0.5 rounded-[3px]">
              BTC
            </div>
            <span className="text-[18px] font-bold text-[#2b3139]">
              {btcData ? formatNumber(btcData.price) : '---'}
            </span>
            <div className={`flex items-center text-[12px] font-medium ${isPositive ? 'text-[#00a85a]' : 'text-[#da304a]'}`}>
              {btcData ? (
                <>
                  {isPositive ? '+' : ''}{formatNumber(btcData.change24h)} ({isPositive ? '+' : ''}{btcData.change24hPercent.toFixed(2)}%)
                </>
              ) : ''}
            </div>
          </div>
          <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* Chart Area */}
        <div className="w-full h-[180px] mt-2 relative">
          {chartData.length > 0 ? (
            <ChartComponent data={chartData} isPositive={isPositive} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#00a85a] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Chart Y-Axis Labels */}
          {chartData.length > 0 && (
            <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-400 py-2 pointer-events-none">
              <span>{formatNumber(high24h, 0)}</span>
              <span>{formatNumber(previousClose, 0)}</span>
              <span>{formatNumber(low24h, 0)}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="px-5 py-4">
          <div className="flex border border-gray-200 rounded-lg p-3 bg-[#fafafa]">
            {/* Intraday */}
            <div className="flex-1 border-r border-gray-200 pr-3">
              <h3 className="text-[11px] font-semibold text-gray-500 mb-2">Intraday</h3>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] text-gray-600">Open</span>
                <span className={`text-[11px] font-medium ${btcData?.open > previousClose ? 'text-[#00a85a]' : 'text-[#da304a]'}`}>
                  {btcData ? formatNumber(btcData.open) : '-'}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] text-gray-600">High</span>
                <span className="text-[11px] font-medium text-[#00a85a]">
                  {formatNumber(high24h)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] text-gray-600">Low</span>
                <span className="text-[11px] font-medium text-[#da304a]">
                  {formatNumber(low24h)}
                </span>
              </div>
            </div>
            
            {/* All Market */}
            <div className="flex-1 pl-3">
              <h3 className="text-[11px] font-semibold text-gray-500 mb-2">All Market</h3>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] text-gray-600">Vol 24h</span>
                <span className="text-[11px] font-medium text-[#da304a]">
                  {btcData ? formatCompactNumber(btcData.volume) : '-'}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] text-gray-600">Mkt Cap</span>
                <span className="text-[11px] font-medium text-[#da304a]">
                  {btcData ? formatCompactNumber(btcData.marketCap) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] text-gray-600">FDV</span>
                <span className="text-[11px] font-medium text-[#da304a]">
                  {btcData ? formatCompactNumber(btcData.fdv) : '-'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00a85a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>

        {/* Shortcut Icons */}
        <div className="border-t border-gray-100 mt-2 bg-white pt-5 pb-3">
          <div className="flex items-start justify-between gap-3 overflow-x-auto px-5 scrollbar-hide">
            
            {/* Menu 1: Running Trade */}
            <div className="flex flex-col items-center gap-2.5 min-w-[72px]">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#f5f4f8]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8461ab" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="14" cy="12" r="7" />
                  <path d="M14 9v3l2 2" />
                  <path d="M5 10h4" />
                  <path d="M4 14h4" />
                </svg>
              </div>
              <span className="text-[11px] text-gray-500 font-normal text-center leading-[1.2]">Running<br/>Trade</span>
            </div>

            {/* Menu 2: Top Broker */}
            <div className="flex flex-col items-center gap-2.5 min-w-[72px]">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#ebfceb]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3ab55a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 8, 13 8, 14 17, 12 20, 10 17" fill="none"/>
                  <path d="M8 8L5 5" />
                  <path d="M16 8l3-3" />
                  <path d="M9 8l3-2 3 2" />
                </svg>
              </div>
              <span className="text-[11px] text-gray-500 font-normal text-center leading-[1.2]">Top<br/>Broker</span>
            </div>

            {/* Menu 3: Broker Activity */}
            <div className="flex flex-col items-center gap-2.5 min-w-[72px] relative">
              <div className="absolute -top-1.5 right-0 bg-[#d53a6d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] z-10 tracking-wide">New</div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#fcf3f6]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d53a6d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6" width="16" height="12" rx="2" />
                  <path d="M6 14l3-3 2 2 4-4" />
                  <path d="M13 10h2v2" />
                  <polygon points="15.5 14, 17.5 14, 18 19, 16.5 21, 15 19" fill="#fcf3f6" stroke="#d53a6d" />
                  <path d="M15.5 14l1-1.5 1 1.5" fill="#fcf3f6" />
                </svg>
              </div>
              <span className="text-[11px] text-gray-500 font-normal text-center leading-[1.2]">Broker<br/>Activity</span>
            </div>

            {/* Menu 4: Top Stock */}
            <div className="flex flex-col items-center gap-2.5 min-w-[72px]">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#fef3e9]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c78a25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13h4v7h-4z" />
                  <path d="M6 16h4v4h-4z" />
                  <path d="M14 17h4v3h-4z" />
                  <path d="M12 5v3" />
                  <rect x="11" y="8" width="2" height="3" fill="none" />
                  <path d="M12 11v2" />
                </svg>
              </div>
              <span className="text-[11px] text-gray-500 font-normal text-center leading-[1.2]">Top<br/>Stock</span>
            </div>

            {/* Menu 5: Insider Activity */}
            <div className="flex flex-col items-center gap-2.5 min-w-[72px]">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#f2f6fa]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1f8cc3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="8" width="16" height="12" rx="2" />
                  <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M10 12h5l-1.5-1.5" />
                  <path d="M14 15H9l1.5-1.5" />
                </svg>
              </div>
              <span className="text-[11px] text-gray-500 font-normal text-center leading-[1.2]">Insider<br/>Activity</span>
            </div>

          </div>
        </div>

        <div className="h-2 bg-gray-50 mb-4 w-full"></div>

        {/* Trending Section */}
        <div className="px-5">
          <h2 className="text-[14px] font-bold text-[#2b3139] mb-4">Trending</h2>
          
          <div className="flex flex-col">
            {trendingList.length > 0 ? trendingList.map((coin, index) => {
              const isCoinPositive = coin.change24hPercent >= 0;
              return (
                <div 
                  key={coin.id} 
                  onClick={() => setSelectedCoin && setSelectedCoin(coin.symbol)}
                  className={`flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 ${index !== trendingList.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-[#2b3139]">{coin.symbol}</span>
                      <span className="text-[11px] text-gray-400">{coin.name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[14px] font-bold text-[#2b3139]">
                      ${formatNumber(coin.price, 4)}
                    </span>
                    <span className={`text-[12px] font-medium ${isCoinPositive ? 'text-[#00a85a]' : 'text-[#da304a]'}`}>
                      {isCoinPositive ? '+' : ''}{formatNumber(coin.change24h)} ({isCoinPositive ? '+' : ''}{coin.change24hPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div className="py-4 text-center text-sm text-gray-500">Loading trending...</div>
            )}
          </div>
        </div>

      </div>

      <BottomNav currentScreen="search" setCurrentScreen={setCurrentScreen} />
      
      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-[4px] bg-gray-300 rounded-full z-50"></div>
    </div>
  );
}


import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Share2, Star, AlarmClock, ChevronDown, Moon, Settings2, LineChart as LineChartIcon, Edit, Info, ChevronRight, CalendarDays, X, Plus, Lock, Activity, BarChart3 } from 'lucide-react';
import { createChart, ColorType, CrosshairMode, LineStyle, AreaSeries, LineSeries } from 'lightweight-charts';
import { getFinancialDataForSymbol, convertToPercentage, getBalanceSheetData, getCashFlowData } from './financialData';

const symbolToId: Record<string, string> = {
  'BTC': 'bitcoin', 'ETH': 'ethereum', 'BNB': 'binancecoin', 'SOL': 'solana', 'XRP': 'ripple',
  'ADA': 'cardano', 'DOGE': 'dogecoin', 'AVAX': 'avalanche-2', 'DOT': 'polkadot', 'MATIC': 'matic-network',
  'LINK': 'chainlink', 'UNI': 'uniswap', 'LTC': 'litecoin'
};

const formatNumber = (num: number | undefined | null, maxDec = 2) => {
  if (num == null) return '-';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: maxDec, minimumFractionDigits: 0 }).format(num);
};

const formatCompact = (num: number | undefined | null) => {
    if (num == null) return '-';
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short", maximumFractionDigits: 2 }).format(num);
}

const formatCompactFlow = (num: number) => {
  if (num === 0) return '0';
  const isNeg = num < 0;
  const absNum = Math.abs(num);
  let formatted = '';
  if (absNum >= 1e12) formatted = (absNum / 1e12).toFixed(0) + ' T';
  else if (absNum >= 1e9) formatted = (absNum / 1e9).toFixed(0) + ' B';
  else if (absNum >= 1e6) formatted = (absNum / 1e6).toFixed(0) + ' M';
  else if (absNum >= 1e3) formatted = (absNum / 1e3).toFixed(0) + ' K';
  else formatted = absNum.toFixed(0);
  
  return isNeg ? `(${formatted})` : formatted;
}

const ChartComponent = ({ data, isPositive, prevClose }: { data: any[], isPositive: boolean, prevClose: number }) => {
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
          vertLine: { labelBackgroundColor: '#9ba4b5' },
          horzLine: { labelBackgroundColor: '#9ba4b5' },
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
        lineWidth: 2,
      });

      if (data.length > 0) {
        series.setData(data);
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

const BrokerDistributionSankey = () => {
  const leftNodes = [
    { id: 'XL', name: 'XL', val: '231.10 B', color: '#9d4edd', height: 30, top: 0 },
    { id: 'CC', name: 'CC', val: '', color: '#00a85a', height: 9, top: 34 },
    { id: 'AK', name: 'AK', val: '', color: '#da304a', height: 9, top: 45 },
    { id: 'YP', name: 'YP', val: '', color: '#da304a', height: 9, top: 56 },
    { id: 'YU', name: 'YU', val: '', color: '#da304a', height: 9, top: 67 },
    { id: 'MG', name: 'MG', val: '', color: '#9d4edd', height: 9, top: 78 },
    { id: 'XC', name: 'XC', val: '', color: '#9d4edd', height: 9, top: 89 },
  ];

  const rightNodes = [
    { id: 'XL', name: 'XL', val: '43.43 B', color: '#9d4edd', height: 12, top: 0 },
    { id: 'CC', name: 'CC', val: '22.28 B', color: '#00a85a', height: 12, top: 15 },
    { id: 'AK', name: 'AK', val: '26.77 B', color: '#da304a', height: 12, top: 30 },
    { id: 'YP', name: 'YP', val: '16.06 B', color: '#da304a', height: 12, top: 45 },
    { id: 'XC', name: 'XC', val: '8.24 B', color: '#9d4edd', height: 12, top: 60 },
    { id: 'MG', name: 'MG', val: '12.97 B', color: '#9d4edd', height: 12, top: 75 },
    { id: 'IF', name: 'IF', val: '7.12 B', color: '#9d4edd', height: 12, top: 90 },
  ];

  const flows = [
    { from: 15, to: 6, width: 10, color: '#9d4edd' },
    { from: 15, to: 21, width: 5, color: '#00a85a' },
    { from: 15, to: 36, width: 8, color: '#da304a' },
    { from: 15, to: 51, width: 4, color: '#da304a' },
    { from: 15, to: 66, width: 3, color: '#9d4edd' },
    { from: 15, to: 81, width: 3, color: '#9d4edd' },
    { from: 15, to: 96, width: 2, color: '#9d4edd' },
    { from: 38.5, to: 21, width: 4, color: '#00a85a' },
    { from: 49.5, to: 36, width: 4, color: '#da304a' },
    { from: 60.5, to: 51, width: 3, color: '#da304a' },
    { from: 71.5, to: 51, width: 2, color: '#da304a' },
    { from: 82.5, to: 81, width: 4, color: '#9d4edd' },
    { from: 93.5, to: 66, width: 2, color: '#9d4edd' },
  ];

  return (
    <div className="w-full relative h-[250px] my-2 select-none">
      {/* Column Titles */}
      <div className="absolute top-[-22px] left-0 right-0 flex justify-between px-1">
        <span className="text-[11px] font-bold text-[#00a85a]">Buyer</span>
        <span className="text-[11px] font-bold text-[#da304a]">Seller</span>
      </div>

      {/* SVG Flow lines in the middle */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <g opacity="0.32">
          {flows.map((flow, i) => (
            <path
              key={i}
              d={`M 15,${flow.from} C 45,${flow.from} 55,${flow.to} 80,${flow.to}`}
              fill="none"
              stroke={flow.color}
              strokeWidth={flow.width * 0.4}
              strokeLinecap="round"
            />
          ))}
        </g>
      </svg>

      {/* Left Column Nodes */}
      <div className="absolute left-0 top-0 bottom-0 w-[15%] flex flex-col justify-between">
        {leftNodes.map((node) => (
          <div 
            key={node.id} 
            className="absolute left-0 w-full flex items-center"
            style={{ 
              top: `${node.top}%`, 
              height: `${node.height}%`,
            }}
          >
            {/* The vertical colored bar on the far left */}
            <div 
              className="w-1.5 h-full rounded-r-[2px]" 
              style={{ backgroundColor: node.color }}
            />
            {/* Label / Badge */}
            {node.id === 'XL' ? (
              <div className="absolute left-3 bg-gray-100 border border-gray-200/60 rounded px-1.5 py-0.5 flex items-center gap-1 shadow-sm whitespace-nowrap z-20">
                <span className="text-[9px] font-bold text-gray-800">XL</span>
                <span className="text-[9px] font-semibold text-gray-500">231.10 B</span>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-gray-700 ml-2.5">{node.name}</span>
            )}
          </div>
        ))}
      </div>

      {/* Right Column Nodes */}
      <div className="absolute right-0 top-0 bottom-0 w-[20%] flex flex-col justify-between">
        {rightNodes.map((node) => (
          <div 
            key={node.id} 
            className="absolute right-0 w-full flex items-center justify-end"
            style={{ 
              top: `${node.top}%`, 
              height: `${node.height}%`,
            }}
          >
            {/* Labels aligned to the right */}
            <div className="mr-2.5 flex items-center gap-1 text-[9px] font-semibold text-gray-500 whitespace-nowrap">
              <span>{node.val}</span>
              <span className="font-bold text-gray-800">{node.name}</span>
            </div>
            {/* The vertical colored bar on the far right */}
            <div 
              className="w-1.5 h-full rounded-l-[2px]" 
              style={{ backgroundColor: node.color }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const BrokerFlowChart = ({ data }: { data: any[] }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#A3A3A3',
          fontSize: 10,
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { color: '#f0f0f0' },
        },
        crosshair: {
          mode: CrosshairMode.Magnet,
        },
        rightPriceScale: {
          visible: true,
          borderColor: '#f0f0f0',
        },
        leftPriceScale: {
          visible: true,
          borderColor: '#f0f0f0',
        },
        timeScale: {
          visible: true,
          borderColor: '#f0f0f0',
          timeVisible: true,
        },
      });

      const priceSeries = chart.addSeries(LineSeries, {
        color: '#00a85a',
        lineWidth: 2,
        priceScaleId: 'right',
      });
      
      const largeWhaleSeries = chart.addSeries(LineSeries, {
        color: '#e63946', // red
        lineWidth: 2,
        priceScaleId: 'left',
        priceFormat: {
          type: 'custom',
          formatter: formatCompactFlow,
        },
      });
      
      const sharksSeries = chart.addSeries(LineSeries, {
        color: '#9d4edd', // purple
        lineWidth: 2,
        priceScaleId: 'left',
        priceFormat: {
          type: 'custom',
          formatter: formatCompactFlow,
        },
      });
      
      const retailSeries = chart.addSeries(LineSeries, {
        color: '#ffb703', // yellow
        lineWidth: 2,
        priceScaleId: 'left',
        priceFormat: {
          type: 'custom',
          formatter: formatCompactFlow,
        },
      });

      if (data.length > 0) {
        priceSeries.setData(data);
        
        let lFlow = 0;
        let sFlow = 0;
        let rFlow = 0;
        const basePrice = data[0].value;
        
        const lWhaleData = data.map((d, i) => {
           lFlow += (Math.random() - 0.45) * 5 * 1e9;
           return { time: d.time, value: lFlow };
        });
        const sharkData = data.map((d, i) => {
           sFlow += (Math.random() - 0.5) * 3 * 1e9;
           return { time: d.time, value: sFlow };
        });
        const retailData = data.map((d, i) => {
           rFlow += (Math.random() - 0.55) * 4 * 1e9;
           return { time: d.time, value: rFlow };
        });
        
        largeWhaleSeries.setData(lWhaleData);
        sharksSeries.setData(sharkData);
        retailSeries.setData(retailData);
      }

      chart.timeScale().fitContent();
      chartRef.current = chart;

      return () => {
        chart.remove();
      };
    }
  }, [data]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />;
};

const BottomNav = ({ currentScreen, setCurrentScreen }: { currentScreen: string, setCurrentScreen: (screen: string) => void }) => (
  <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-between items-center px-6 pt-2 pb-6 z-[999]">
    <button onClick={() => setCurrentScreen('dashboard')} className="flex flex-col items-center gap-[5px]">
      <svg className={`w-[26px] h-[26px] ${currentScreen === 'dashboard' ? 'text-[#00a85a]' : 'text-[#9ba4b5]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span className={`text-[11px] ${currentScreen === 'dashboard' ? 'font-semibold text-[#00a85a]' : 'font-medium text-[#9ba4b5]'}`}>Watchlist</span>
    </button>
    <button onClick={() => setCurrentScreen('stream')} className="flex flex-col items-center gap-[5px]">
      <svg className={`w-[26px] h-[26px] ${currentScreen === 'stream' ? 'text-[#00a85a]' : 'text-[#9ba4b5]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="3.5" ry="3.5" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="16" y2="14" />
      </svg>
      <span className={`text-[11px] ${currentScreen === 'stream' ? 'font-semibold text-[#00a85a]' : 'font-medium text-[#9ba4b5]'}`}>Stream</span>
    </button>
    <button onClick={() => setCurrentScreen('search')} className="flex flex-col items-center gap-[5px]">
      <svg className={`w-[26px] h-[26px] ${currentScreen === 'assetDetail' ? 'text-[#00a85a]' : 'text-[#9ba4b5]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16" y2="16" />
      </svg>
      <span className={`text-[11px] ${currentScreen === 'assetDetail' ? 'font-semibold text-[#00a85a]' : 'font-medium text-[#9ba4b5]'}`}>Search</span>
    </button>
    <button className="flex flex-col items-center gap-[5px]">
      <svg className="w-[26px] h-[26px] text-[#9ba4b5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span className="text-[11px] font-medium text-[#9ba4b5]">Chat</span>
    </button>
    <button onClick={() => setCurrentScreen('portfolio')} className="flex flex-col items-center gap-[5px]">
      <svg className="w-[26px] h-[26px] text-[#9ba4b5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v9h9" />
      </svg>
      <span className="text-[11px] font-medium text-[#9ba4b5]">Portfolio</span>
    </button>
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-[4px] bg-gray-300 rounded-full z-50 pointer-events-none"></div>
  </div>
);

export default function AssetDetailScreen({ symbol, onBack, setCurrentScreen }: { symbol: string, onBack: () => void, setCurrentScreen: (s: string) => void }) {
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
  const [coinInfo, setCoinInfo] = useState<any>(null);
  const [ticker, setTicker] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [orderbook, setOrderbook] = useState<{bids: any[], asks: any[]}>({ bids: [], asks: [] });
  const [history, setHistory] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('1D');
  const [monthlyReturns, setMonthlyReturns] = useState<any>({});
  const [accumulationRange, setAccumulationRange] = useState('1D');
  
  // Tab and Financial states
  const [activeTab, setActiveTab] = useState('ORDERBOOK');
  const [financialSubTab, setFinancialSubTab] = useState<'Laba Rugi' | 'Neraca' | 'Arus Kas'>('Laba Rugi');
  const [financialPeriod, setFinancialPeriod] = useState<'Annual' | 'Quarterly'>('Annual');
  const [financialUnit, setFinancialUnit] = useState<'$' | '%'>('$');
  const [collapsedRows, setCollapsedRows] = useState<Record<string, boolean>>({
    'Beban Usaha': false,
    'Penghasilan/Beban Lain-Lain': false,
    'Laba Bersih Yang Dapat Diatribusikan Kepada': false
  });
  
  // Whale Flow state
  const [flows, setFlows] = useState({
      whale: { buy: 65, sell: 35 },
      medium: { buy: 48, sell: 52 },
      retail: { buy: 40, sell: 60 }
  });

  const binanceSymbol = `${symbol.toLowerCase()}usdt`;
  const cgId = symbolToId[symbol.toUpperCase()] || symbol.toLowerCase();

  useEffect(() => {
    if (!cgId) return;

    // 1. Fetch initial CoinGecko Info
    fetch(`https://api.coingecko.com/api/v3/coins/${cgId}?localization=false&tickers=false&community_data=false&developer_data=false`)
      .then(res => {
        if (!res.ok) throw new Error(`CoinGecko fetch failed: ${res.status}`);
        return res.json();
      })
      .then(data => setCoinInfo(data))
      .catch(err => {
         console.warn("Error fetching CoinGecko info, using fallback info:", err);
         setCoinInfo({
           name: symbol,
           image: { large: `https://assets.coingecko.com/coins/images/1/large/${cgId}.png` }
         });
      });

    // 2. Fetch Historical Data for Heatmap and History table
    fetch(`https://api.coingecko.com/api/v3/coins/${cgId}/market_chart?vs_currency=usd&days=365`)
      .then(res => {
        if (!res.ok) throw new Error(`CoinGecko historical fetch failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const prices = data.prices || [];
        const vols = data.total_volumes || [];
        
        // History table (last 5 days)
        const histTable = [];
        for(let i=prices.length-1; i>=Math.max(0, prices.length-5); i-=1) {
           if (i > 0) {
             const change = ((prices[i][1] - prices[i-1][1]) / prices[i-1][1]) * 100;
             histTable.push({
               date: new Date(prices[i][0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }),
               price: prices[i][1],
               change,
               vol: vols[i][1]
             });
           }
        }
        setHistory(histTable);

        // Heatmap data
        const monthlyData: any = {};
        prices.forEach((p: any) => {
            const d = new Date(p[0]);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            if(!monthlyData[key]) monthlyData[key] = { first: p[1], last: p[1] };
            monthlyData[key].last = p[1];
        });
        
        const finalReturns: any = {};
        Object.keys(monthlyData).forEach(k => {
            const [y, m] = k.split('-');
            if (!finalReturns[y]) finalReturns[y] = Array(12).fill(null);
            finalReturns[y][parseInt(m)] = ((monthlyData[k].last - monthlyData[k].first) / monthlyData[k].first) * 100;
        });
        setMonthlyReturns(finalReturns);
      })
      .catch(err => {
         console.warn("Error fetching CoinGecko historical data, generating mock data:", err);
         const now = Date.now();
         const mockHist = [];
         const mockMonthlyReturns: any = {};
         const currentP = FALLBACK_PRICES[symbol.toUpperCase()] || 100;
         for(let i=0; i<5; i++) {
           const d = new Date(now - i*24*60*60*1000);
           const p = currentP * (1 + (Math.random() - 0.5) * 0.05);
           mockHist.push({
             date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }),
             price: p,
             change: (Math.random() - 0.5) * 4,
             vol: p * 12345
           });
         }
         setHistory(mockHist);
         
         const currentYear = new Date().getFullYear().toString();
         mockMonthlyReturns[currentYear] = Array(12).fill(null).map(() => (Math.random() - 0.5) * 15);
         setMonthlyReturns(mockMonthlyReturns);
      });
  }, [cgId]);

  useEffect(() => {
    // Chart fetcher (Binance klines)
    let interval = '5m';
    let limit = 288; // 1D
    if (timeRange === '1W') { interval = '1h'; limit = 168; }
    if (timeRange === '1M') { interval = '4h'; limit = 180; }
    if (timeRange === '3M') { interval = '1d'; limit = 90; }
    if (timeRange === '1Y') { interval = '1d'; limit = 365; }
    if (timeRange === 'All') { interval = '1w'; limit = 200; }
    
    fetch(`https://api.binance.com/api/v3/klines?symbol=${binanceSymbol.toUpperCase()}&interval=${interval}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
         const formatted = data.map((d: any) => ({
             time: Math.floor(d[0]/1000) + 25200, 
             value: parseFloat(d[4])
         }));
         setChartData(formatted);
      })
      .catch(err => {
         console.warn("Binance chart fetch failed, using fallback simulated trend:", err);
         const nowSecs = Math.floor(Date.now() / 1000);
         const mockChart = [];
         let price = FALLBACK_PRICES[symbol.toUpperCase()] || 100;
         const stepSecs = interval === '5m' ? 300 : interval === '1h' ? 3600 : interval === '4h' ? 14400 : 86400;
         for (let i = limit; i >= 0; i--) {
           price += (Math.random() - 0.49) * (price * 0.015);
           mockChart.push({
             time: nowSecs - (i * stepSecs),
             value: parseFloat(price.toFixed(2))
           });
         }
         setChartData(mockChart);
      });
  }, [timeRange, binanceSymbol]);

  useEffect(() => {
    // WebSockets
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${binanceSymbol}@ticker/${binanceSymbol}@depth10@100ms/${binanceSymbol}@trade`);
    
    let wBuy=0, wSell=0, mBuy=0, mSell=0, rBuy=0, rSell=0;

    ws.onmessage = (event) => {
       const msg = JSON.parse(event.data);
       if (!msg.data) return;

       if (msg.stream === `${binanceSymbol}@ticker`) {
           setTicker({
               price: parseFloat(msg.data.c),
               change: parseFloat(msg.data.p),
               changePercent: parseFloat(msg.data.P),
           });
           
           setChartData(prev => {
               if(prev.length === 0) return prev;
               const newD = [...prev];
               newD[newD.length-1] = { time: newD[newD.length-1].time, value: parseFloat(msg.data.c) };
               return newD;
           });
       } else if (msg.stream === `${binanceSymbol}@depth10@100ms`) {
           setOrderbook({
               bids: msg.data.bids.slice(0, 5), // show top 5
               asks: msg.data.asks.slice(0, 5)
           });
       } else if (msg.stream === `${binanceSymbol}@trade`) {
           const val = parseFloat(msg.data.p) * parseFloat(msg.data.q);
           const isBuyerMaker = msg.data.m; // true means sell order
           
           // Mock thresholds for demo (real whale is >100k)
           if (val > 10000) {
               if (isBuyerMaker) wSell += val; else wBuy += val;
           } else if (val > 1000) {
               if (isBuyerMaker) mSell += val; else mBuy += val;
           } else {
               if (isBuyerMaker) rSell += val; else rBuy += val;
           }

           // Update state periodically (throttled)
           if (Math.random() > 0.8) {
               setFlows({
                   whale: { buy: 50 + (wBuy/(wBuy+wSell||1))*50, sell: 50 + (wSell/(wBuy+wSell||1))*50 },
                   medium: { buy: 50 + (mBuy/(mBuy+mSell||1))*50, sell: 50 + (mSell/(mBuy+mSell||1))*50 },
                   retail: { buy: 50 + (rBuy/(rBuy+rSell||1))*50, sell: 50 + (rSell/(rBuy+rSell||1))*50 }
               });
           }
       }
    };
    
    return () => ws.close();
  }, [binanceSymbol]);

  const isPositive = ticker ? ticker.change >= 0 : true;
  const prevClose = chartData.length > 0 ? chartData[0].value : 0;

  const FlowBar = ({ label, buy, sell }: { label: string, buy: number, sell: number }) => {
    const total = buy + sell || 1;
    const buyPct = (buy/total)*100;
    const sellPct = (sell/total)*100;
    return (
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[11px] text-gray-500 w-12 font-medium">{label}</span>
        <div className="flex-1 h-3 flex rounded-[3px] overflow-hidden bg-gray-100">
          <div className="h-full bg-[#00a85a]" style={{ width: `${buyPct}%`, transition: 'width 0.5s' }}></div>
          <div className="h-full bg-[#da304a]" style={{ width: `${sellPct}%`, transition: 'width 0.5s' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[100dvh] bg-white flex flex-col relative overflow-hidden">
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-[80px]">
        
        {/* 1. HEADER INFORMASI ASET */}
        <div className="flex items-start justify-between px-4 pt-4 pb-2 bg-white">
          <div className="flex items-start gap-2">
            <button onClick={onBack} className="p-1 -ml-1 text-gray-400 hover:bg-gray-50 rounded-full mt-0.5">
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[17px] font-bold text-gray-900 leading-none">{symbol}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 mr-1 -ml-0.5" strokeWidth={2} />
                <div className="flex items-center border border-purple-200 bg-purple-50 rounded-[3px] px-1 py-0.5 gap-0.5">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="#a855f7">
                     <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  <span className="text-[9px] font-bold text-purple-600">4x</span>
                </div>
                <div className="flex items-center border border-green-200 bg-green-50 rounded-[3px] px-1 py-0.5">
                  <span className="text-[9px] font-bold text-green-600">TL</span>
                </div>
                <Moon className="w-4 h-4 text-gray-400 ml-1" strokeWidth={1.5} />
              </div>
              <span className="text-[12px] text-gray-500 font-normal">{coinInfo?.name || symbol}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-500 mt-1">
            <Edit className="w-5 h-5" strokeWidth={1.5} />
            <AlarmClock className="w-5 h-5" strokeWidth={1.5} />
            <Share2 className="w-5 h-5" strokeWidth={1.5} />
            <Star className="w-5 h-5" strokeWidth={1.5} />
          </div>
        </div>

        <div className="px-5 pt-1 pb-3 flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[32px] font-bold text-[#2b3139] tracking-tight tabular-nums leading-none mb-2">
              {ticker ? formatNumber(ticker.price, 2) : '---'}
            </span>
            <div className={`flex items-center gap-1 text-[12px] font-medium tabular-nums ${isPositive ? 'text-[#00a85a]' : 'text-[#da304a]'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isPositive ? 'rotate-180' : ''}>
                <line x1="17" y1="7" x2="7" y2="17"></line>
                <polyline points="17 17 7 17 7 7"></polyline>
              </svg>
              <span>{isPositive ? '+' : ''}{ticker ? formatNumber(ticker.change, 2) : '---'} ({isPositive ? '+' : ''}{ticker ? ticker.changePercent.toFixed(2) : '--'}%) <span className="text-gray-400 font-normal ml-0.5">Hari Ini</span></span>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
               <span className="text-[10px] font-medium text-[#00a85a] border border-[#00a85a] rounded-[4px] px-2 py-0.5">Barang Baku</span>
               <span className="text-[10px] font-medium text-[#00a85a] border border-[#00a85a] rounded-[4px] px-2 py-0.5">Syariah</span>
               <span className="text-[10px] font-medium text-[#00a85a] border border-[#00a85a] rounded-[4px] px-2 py-0.5">Day Trade</span>
            </div>
          </div>
          {coinInfo?.image?.large && (
              <img src={coinInfo.image.large} alt={symbol} className="w-[50px] h-[50px] rounded-full object-cover shadow-sm border border-gray-100" />
          )}
        </div>

        {/* 2. MINI LIVE CHART */}
        <div className="w-full h-[220px] relative mt-2 px-1">
          {chartData.length > 0 ? (
            <ChartComponent data={chartData} isPositive={isPositive} prevClose={prevClose} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#00a85a] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center justify-between px-4 py-2 mb-2">
          <div className="flex items-center justify-between flex-1 mr-6">
            {['1D', '1W', '1M', '3M', 'YTD', '1Y', '3Y', '5Y'].map(range => (
              <button 
                key={range} 
                onClick={() => setTimeRange(range)}
                className={`text-[11px] font-semibold relative ${timeRange === range ? 'text-[#00a85a]' : 'text-gray-400'}`}
              >
                {range}
                {timeRange === range && <div className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#00a85a]"></div>}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
             <Settings2 className="w-4 h-4 text-gray-400" />
             <LineChartIcon className="w-4 h-4 text-[#00a85a]" />
          </div>
        </div>

        {/* 3. BELI Button */}
        <div className="px-4 py-2 mb-2">
          <button 
             onClick={() => setCurrentScreen('transaction')}
             className="w-full bg-[#00a85a] text-white font-bold py-[14px] rounded-md text-[14px] tracking-wide hover:bg-[#00904d] transition-colors"
          >
            Beli
          </button>
        </div>

        {/* 4. MENU SUB-TAB */}
        <div className="flex items-center justify-between px-4 border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {['ORDERBOOK', 'ANALISIS', 'FINANSIAL', 'SEASONALITY', 'PERBANDINGAN'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[11px] font-bold py-3 px-1 relative shrink-0 ${activeTab === tab ? 'text-[#00a85a]' : 'text-gray-400'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00a85a]"></div>}
            </button>
          ))}
        </div>

        {/* 5. MARKET SUMMARY */}
        {activeTab === 'ORDERBOOK' && (
          <div className="px-4 py-4 grid grid-cols-3 gap-x-2 gap-y-3 text-[11px]">
            {/* Col 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between"><span className="text-gray-500">Open</span><span className="text-[#da304a] font-medium">{ticker ? formatNumber(ticker.price * 1.01, 0) : '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">High</span><span className="text-[#00a85a] font-medium">{ticker ? formatNumber(ticker.price * 1.05, 0) : '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Low</span><span className="text-[#da304a] font-medium">{ticker ? formatNumber(ticker.price * 0.95, 0) : '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">F Buy</span><span className="text-[#00a85a] font-medium">180.49B</span></div>
            </div>
            {/* Col 2 */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between"><span className="text-gray-500">Prev</span><span className="text-gray-900 font-medium">{ticker ? formatNumber(prevClose, 0) : '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">ARA</span><span className="text-gray-900 font-medium flex items-center">{ticker ? formatNumber(prevClose * 1.25, 0) : '-'} <ChevronDown className="w-3 h-3 ml-0.5 text-gray-400" /></span></div>
              <div className="flex justify-between"><span className="text-gray-500">ARB</span><span className="text-gray-900 font-medium flex items-center">{ticker ? formatNumber(prevClose * 0.75, 0) : '-'} <ChevronDown className="w-3 h-3 ml-0.5 text-gray-400" /></span></div>
              <div className="flex justify-between"><span className="text-gray-500">F Sell</span><span className="text-[#da304a] font-medium">398.63B</span></div>
            </div>
            {/* Col 3 */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between"><span className="text-gray-500">Lot</span><span className="text-[#da304a] font-medium">7.51M</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Val</span><span className="text-[#da304a] font-medium">1.44T</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Avg</span><span className="text-[#da304a] font-medium">1,917</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Freq</span><span className="text-[#00a85a] font-medium">124.13K</span></div>
            </div>
          </div>
        )}

        {/* 6. ORDER BOOK TABLE */}
        {activeTab === 'ORDERBOOK' && (
          <div className="w-full border-t border-gray-100">
            {/* Header */}
            <div className="flex text-[11px] font-bold text-gray-900 bg-gray-50/50">
              <div className="w-[15%] py-2 text-center border-r border-gray-100">Freq</div>
              <div className="w-[20%] py-2 text-center border-r border-gray-100">Lot</div>
              <div className="w-[15%] py-2 text-center border-r border-gray-100">Bid</div>
              <div className="w-[15%] py-2 text-center border-r border-gray-100">Ask</div>
              <div className="w-[20%] py-2 text-center border-r border-gray-100">Lot</div>
              <div className="w-[15%] py-2 text-center">Freq</div>
            </div>
            {/* Body */}
            <div className="flex flex-col text-[11px]">
              {[...Array(10)].map((_, i) => {
                const bid = orderbook.bids[i] || ['1790', '48807'];
                const ask = orderbook.asks[i] || ['1795', '65532'];
                const bidFreq = i === 0 ? '-' : Math.floor(Math.random() * 200) + 10;
                const askFreq = i === 0 ? '-' : Math.floor(Math.random() * 200) + 10;
                return (
                  <div key={i} className={`flex border-b border-gray-50 ${i%2===0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <div className="w-[15%] py-2 text-center text-[#8e85c8] border-r border-gray-50">{bidFreq}</div>
                    <div className="w-[20%] py-2 text-center text-gray-700 relative border-r border-gray-50">
                      <span className="relative z-10">{formatNumber(parseFloat(bid[1]), 0)}</span>
                      <div className="absolute right-0 bottom-0 top-0 bg-[#da304a]/10" style={{ width: `${Math.random()*40}%` }}></div>
                    </div>
                    <div className="w-[15%] py-2 text-center text-[#da304a] font-medium bg-[#da304a]/5 border-r border-gray-50">{formatNumber(parseFloat(bid[0]), 0)}</div>
                    
                    <div className="w-[15%] py-2 text-center text-[#da304a] font-medium bg-[#da304a]/5 border-r border-gray-50">{formatNumber(parseFloat(ask[0]), 0)}</div>
                    <div className="w-[20%] py-2 text-center text-gray-700 relative border-r border-gray-50">
                      <span className="relative z-10">{formatNumber(parseFloat(ask[1]), 0)}</span>
                      <div className="absolute left-0 bottom-0 top-0 bg-[#00a85a]/10" style={{ width: `${Math.random()*40}%` }}></div>
                    </div>
                    <div className="w-[15%] py-2 text-center text-[#8e85c8]">{askFreq}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 7. BROKER DISTRIBUTION (SANKEY FLOW) */}
        {activeTab === 'ORDERBOOK' && (
          <div className="px-4 py-5 w-full bg-white border-t-8 border-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[16px] font-bold text-gray-900">Broker Distribution</h3>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 flex items-center justify-between border border-gray-200 rounded-md px-3 py-2">
                <span className="text-[13px] text-gray-700">All Investor</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1 flex items-center justify-between border border-gray-200 rounded-md px-3 py-2">
                <span className="text-[13px] text-gray-700">Regular</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Toggles & Date */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button className="px-4 py-1.5 rounded-full border border-[#00a85a] text-[#00a85a] text-[12px] font-bold bg-white">Value</button>
                <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 text-[12px] font-medium bg-white">Volume</button>
              </div>
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4 text-[#00a85a]" strokeWidth={2.5} />
                <span className="text-[12px] font-bold text-[#00a85a]">
                   {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                </span>
                <CalendarDays className="w-4 h-4 text-[#00a85a]" strokeWidth={2} />
                <ChevronRight className="w-4 h-4 text-[#00a85a]" strokeWidth={2.5} />
              </div>
            </div>

            {/* Sankey Chart Area */}
            <div className="w-full h-[250px] mt-8 mb-4 relative">
               <BrokerDistributionSankey />
            </div>

            {/* Sankey Legend */}
            <div className="flex items-center justify-center gap-5 mt-4 text-[11px] font-semibold text-gray-500">
               <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#9d4edd]"></div>
                  <span>Domestic</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00a85a]"></div>
                  <span>BUMN</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#da304a]"></div>
                  <span>Foreign</span>
               </div>
            </div>

            {/* Lihat Semua Button */}
            <div className="flex justify-center mt-5 mb-2">
               <button className="flex items-center gap-1 text-[13px] font-bold text-[#00a85a] hover:opacity-80 transition-opacity">
                  <span>Lihat Semua</span>
                  <ChevronRight className="w-4 h-4 text-[#00a85a]" strokeWidth={3} />
               </button>
            </div>
          </div>
        )}

        {/* 8. GRAFIK AKUMULASI PERGERAKAN HARGA & KATEGORI INVESTOR */}
        {activeTab === 'ORDERBOOK' && (
          <div className="px-4 py-5 w-full bg-white border-t-8 border-gray-50">
            {/* Header */}
            <div className="flex items-center gap-1.5 mb-4">
              <h3 className="text-[15px] font-bold text-gray-900">Grafik Akumulasi Pergerakan Harga & Kategori Investor</h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>

            {/* Time Frame Selector */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-2 mb-4 overflow-x-auto scrollbar-hide">
              {['1D', '1W', '1M', '3M', 'YTD', '1Y', 'All'].map(range => (
                <button 
                  key={range} 
                  onClick={() => setAccumulationRange(range)}
                  className={`text-[12px] font-bold transition-all relative pb-1.5 whitespace-nowrap shrink-0 ${accumulationRange === range ? 'text-gray-900 font-extrabold' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {range}
                  {accumulationRange === range && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00a85a] rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Chart Area with Overlays */}
            <div className="w-full h-[280px] relative select-none">
              {/* Left Y-Axis Badges Overlay (Whales, Sharks, Retail Flow Levels) */}
              <div className="absolute left-1 top-4 bottom-4 flex flex-col justify-around z-10 pointer-events-none gap-2">
                <div className="bg-[#e63946] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  75 B
                </div>
                <div className="bg-[#9d4edd] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  (21 B)
                </div>
                <div className="bg-[#ffb703] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  (52 B)
                </div>
              </div>

              {/* Right Y-Axis Real-Time Price Badge Overlay */}
              <div className="absolute right-1 top-1/3 z-10 pointer-events-none">
                <div className="bg-[#00a85a] text-white text-[10px] font-bold px-1.5 py-1 rounded shadow-md border border-white flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>${ticker ? formatNumber(ticker.price, 2) : '---'}</span>
                </div>
              </div>

              {/* Multi-Line Chart */}
              <BrokerFlowChart data={chartData} />
            </div>

            {/* Chart Legend Bullets */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[11px] font-semibold text-gray-500">
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00a85a]"></div>
                  <span className="text-gray-700">Price</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#e63946]"></div>
                  <span className="text-gray-700">Large Whales</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#9d4edd]"></div>
                  <span className="text-gray-700">Sharks</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ffb703]"></div>
                  <span className="text-gray-700">Retail</span>
               </div>
            </div>
          </div>
        )}

        {/* ANALISIS TAB */}
        {activeTab === 'ANALISIS' && (
          <div className="px-4 py-8 text-center text-gray-500 text-[13px] bg-white border-t border-gray-100">
            <Activity className="w-8 h-8 text-[#00a85a] mx-auto mb-2" />
            <p className="font-semibold text-gray-800">Analisis Sentimen & Tren</p>
            <p className="text-gray-400 mt-1">Data analisis teknikal terbaru sedang dimuat...</p>
          </div>
        )}

        {/* SEASONALITY TAB */}
        {activeTab === 'SEASONALITY' && (
          <div className="px-4 py-8 text-center text-gray-500 text-[13px] bg-white border-t border-gray-100">
            <CalendarDays className="w-8 h-8 text-[#00a85a] mx-auto mb-2" />
            <p className="font-semibold text-gray-800">Data Seasionalitas Bulanan</p>
            <p className="text-gray-400 mt-1">Seasionalitas historis {symbol} 5 tahun terakhir.</p>
          </div>
        )}

        {/* PERBANDINGAN TAB */}
        {activeTab === 'PERBANDINGAN' && (
          <div className="px-4 py-8 text-center text-gray-500 text-[13px] bg-white border-t border-gray-100">
            <LineChartIcon className="w-8 h-8 text-[#00a85a] mx-auto mb-2" />
            <p className="font-semibold text-gray-800">Perbandingan Industri</p>
            <p className="text-gray-400 mt-1">Membandingkan {symbol} dengan kompetitor sejenis.</p>
          </div>
        )}

        {/* FINANSIAL TAB */}
        {activeTab === 'FINANSIAL' && (() => {
          const labaRugiRows = [
            { key: 'Pendapatan', isBold: true, isCollapsible: false, isChild: false },
            { key: 'Beban Pokok Penjualan', isBold: false, isCollapsible: false, isChild: false },
            { key: 'Laba Kotor', isBold: true, isCollapsible: false, isChild: false },
            { key: 'Beban Usaha', isBold: true, isCollapsible: true, isChild: false },
            { key: 'Beban Penjualan', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Beban Usaha' },
            { key: 'Beban Umum & Administrasi', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Beban Usaha' },
            { key: 'Laba Usaha', isBold: true, isCollapsible: false, isChild: false },
            { key: 'Penghasilan/Beban Lain-Lain', isBold: false, isCollapsible: true, isChild: false },
            { key: 'Beban Keuangan', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Penghasilan/Beban Lain-Lain' },
            { key: 'Pendapatan Keuangan', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Penghasilan/Beban Lain-Lain' },
            { key: 'Laba Sebelum Pajak', isBold: true, isCollapsible: false, isChild: false },
            { key: 'Beban Pajak Penghasilan', isBold: false, isCollapsible: false, isChild: false },
            { key: 'Laba Bersih Dari Operasi Yang Dilanjutkan', isBold: false, isCollapsible: false, isChild: false },
            { key: 'Pos Luar Biasa', isBold: false, isCollapsible: false, isChild: false },
            { key: 'Laba Bersih Yang Dapat Diatribusikan Kepada', isBold: true, isCollapsible: true, isChild: false },
            { key: 'Pemilik Entitas Induk', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Laba Bersih Yang Dapat Diatribusikan Kepada' },
            { key: 'Others', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Laba Bersih Yang Dapat Diatribusikan Kepada' }
          ];

          const neracaRows = [
            { key: 'Total Aset', isBold: true, isCollapsible: false, isChild: false },
            { key: 'Aset Lancar', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Total Aset' },
            { key: 'Aset Tidak Lancar', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Total Aset' },
            { key: 'Total Liabilitas', isBold: true, isCollapsible: false, isChild: false },
            { key: 'Liabilitas Jangka Pendek', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Total Liabilitas' },
            { key: 'Liabilitas Jangka Panjang', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Total Liabilitas' },
            { key: 'Total Ekuitas', isBold: true, isCollapsible: false, isChild: false },
            { key: 'Ekuitas Pemilik Entitas Induk', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Total Ekuitas' },
            { key: 'Kepentingan Non-Pengendali', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Total Ekuitas' }
          ];

          const arusKasRows = [
            { key: 'Arus Kas dari Aktivitas Operasi', isBold: true, isCollapsible: false, isChild: false },
            { key: 'Penerimaan Kas dari Pelanggan', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Arus Kas dari Aktivitas Operasi' },
            { key: 'Pembayaran kepada Pemasok/Karyawan', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Arus Kas dari Aktivitas Operasi' },
            { key: 'Arus Kas dari Aktivitas Investasi', isBold: true, isCollapsible: false, isChild: false },
            { key: 'Perolehan Aset Tetap', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Arus Kas dari Aktivitas Investasi' },
            { key: 'Arus Kas dari Aktivitas Pendanaan', isBold: true, isCollapsible: false, isChild: false },
            { key: 'Penerimaan/Pembayaran Pinjaman', isBold: false, isCollapsible: false, isChild: true, parentKey: 'Arus Kas dari Aktivitas Pendanaan' },
            { key: 'Kenaikan/Penurunan Kas Bersih', isBold: true, isCollapsible: false, isChild: false }
          ];

          let report = getFinancialDataForSymbol(symbol)[financialPeriod];
          let activeRows = labaRugiRows;

          if (financialSubTab === 'Neraca') {
            report = getBalanceSheetData(symbol, financialPeriod);
            activeRows = neracaRows;
          } else if (financialSubTab === 'Arus Kas') {
            report = getCashFlowData(symbol, financialPeriod);
            activeRows = arusKasRows;
          }

          const getDisplayValue = (valStr: string, idx: number) => {
            if (financialUnit === '%') {
              if (financialSubTab === 'Laba Rugi') {
                const rev = getFinancialDataForSymbol(symbol)[financialPeriod].rows['Pendapatan']?.[idx];
                return rev ? convertToPercentage(valStr, rev) : valStr;
              } else if (financialSubTab === 'Neraca') {
                const assets = getBalanceSheetData(symbol, financialPeriod).rows['Total Aset']?.[idx];
                return assets ? convertToPercentage(valStr, assets) : valStr;
              } else {
                const ops = getCashFlowData(symbol, financialPeriod).rows['Arus Kas dari Aktivitas Operasi']?.[idx];
                return ops ? convertToPercentage(valStr, ops) : valStr;
              }
            }
            return valStr;
          };

          return (
            <div className="w-full bg-white select-none flex flex-col pb-4">
              {/* 1. HEADER SUB-TAB */}
              <div className="flex gap-2 px-4 pt-3 pb-1 bg-white">
                {['Laba Rugi', 'Neraca', 'Arus Kas'].map(subTab => {
                  const isActive = financialSubTab === subTab;
                  return (
                    <button
                      key={subTab}
                      onClick={() => setFinancialSubTab(subTab as any)}
                      className={`px-[16px] py-[6px] rounded-full border text-[12px] font-bold transition-all ${
                        isActive 
                          ? 'bg-[#eefcf3] border-[#00a85a] text-[#00a85a]' 
                          : 'bg-white border-gray-200 text-gray-400'
                      }`}
                    >
                      {subTab}
                    </button>
                  );
                })}
              </div>

              {/* 2. PERIOD & FILTER CONTROLS */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <div className="relative">
                  <button
                    onClick={() => setFinancialPeriod(prev => prev === 'Annual' ? 'Quarterly' : 'Annual')}
                    className="flex items-center gap-1 border border-gray-200 rounded-[4px] px-3 py-1.5 bg-white text-[11.5px] font-extrabold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <span>{financialPeriod === 'Annual' ? 'Annual' : 'Quarterly'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 rounded-full p-0.5 border border-gray-200/50">
                    <button
                      onClick={() => setFinancialUnit('$')}
                      className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] font-black transition-all ${
                        financialUnit === '$' 
                          ? 'bg-[#00a85a] text-white shadow-sm' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      $
                    </button>
                    <button
                      onClick={() => setFinancialUnit('%')}
                      className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] font-black transition-all ${
                        financialUnit === '%' 
                          ? 'bg-[#00a85a] text-white shadow-sm' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      %
                    </button>
                  </div>

                  <button className="p-1.5 border border-gray-200 rounded-[4px] bg-white hover:bg-gray-50 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-[#00a85a]" />
                  </button>
                </div>
              </div>

              {/* 3. TABLE BODY */}
              <div className="w-full overflow-x-auto scrollbar-hide">
                <div className="min-w-[340px]">
                  <div className="flex items-center justify-between border-b border-gray-100 py-3 px-4 bg-white">
                    <div className="w-[36%] text-left text-[11px] font-bold text-gray-400">Rincian</div>
                    <div className="flex-1 flex justify-between">
                      {report.headers.map((hdr, idx) => (
                        <div key={idx} className="w-[23%] text-right text-[11px] font-extrabold text-gray-900 pr-1">
                          {hdr}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    {activeRows.map((row, rowIdx) => {
                      if (row.isChild && row.parentKey && collapsedRows[row.parentKey]) {
                        return null;
                      }

                      const vals = report.rows[row.key] || ['-', '-', '-', '-'];
                      const isCollapsed = collapsedRows[row.key];
                      const ToggleIcon = isCollapsed ? ChevronRight : ChevronDown;

                      return (
                        <div 
                          key={rowIdx}
                          onClick={() => {
                            if (row.isCollapsible) {
                              setCollapsedRows(prev => ({ ...prev, [row.key]: !prev[row.key] }));
                            }
                          }}
                          className={`flex items-center justify-between border-b border-gray-100/50 py-3.5 px-4 bg-white hover:bg-gray-50/50 transition-colors ${
                            row.isCollapsible ? 'cursor-pointer' : ''
                          }`}
                        >
                          <div 
                            className={`w-[36%] flex items-center text-[11.5px] leading-tight select-none text-left ${
                              row.isBold ? 'font-bold text-gray-900' : 'text-gray-500 font-medium'
                            } ${row.isChild ? 'pl-4' : ''}`}
                          >
                            {row.isCollapsible && (
                              <ToggleIcon className="w-3.5 h-3.5 text-gray-400 mr-1 shrink-0" strokeWidth={3} />
                            )}
                            <span className="truncate">{row.key}</span>
                          </div>

                          <div className="flex-1 flex justify-between">
                            {vals.map((val, valIdx) => {
                              const displayVal = getDisplayValue(val, valIdx);
                              const isNegative = displayVal.includes('(');
                              
                              return (
                                <div 
                                  key={valIdx}
                                  className={`w-[23%] text-right text-[11px] font-semibold pr-1 ${
                                    row.isBold 
                                      ? 'text-gray-900 font-extrabold' 
                                      : isNegative 
                                        ? 'text-gray-400 font-medium' 
                                        : 'text-gray-600 font-medium'
                                  }`}
                                >
                                  {displayVal}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      </div>

      {/* 7. FIXED BOTTOM NAV */}
      <BottomNav currentScreen="assetDetail" setCurrentScreen={setCurrentScreen} />
    </div>
  );
}

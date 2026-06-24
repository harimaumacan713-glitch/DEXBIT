import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Share2, Star, AlarmClock, ChevronDown, Moon, Settings2, LineChart as LineChartIcon, Edit, Info, ChevronRight, CalendarDays, X, Plus, Lock, Activity } from 'lucide-react';
import { createChart, ColorType, CrosshairMode, LineStyle, AreaSeries, LineSeries } from 'lightweight-charts';

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
        lineWidth: 1.5,
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
        lineWidth: 1.5,
        priceScaleId: 'left',
        priceFormat: {
          type: 'custom',
          formatter: formatCompactFlow,
        },
      });
      
      const sharksSeries = chart.addSeries(LineSeries, {
        color: '#9d4edd', // purple
        lineWidth: 1.5,
        priceScaleId: 'left',
        priceFormat: {
          type: 'custom',
          formatter: formatCompactFlow,
        },
      });
      
      const retailSeries = chart.addSeries(LineSeries, {
        color: '#ffb703', // yellow
        lineWidth: 1.5,
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
    <button className="flex flex-col items-center gap-[5px]">
      <svg className="w-[26px] h-[26px] text-[#9ba4b5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="3.5" ry="3.5" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="16" y2="14" />
      </svg>
      <span className="text-[11px] font-medium text-[#9ba4b5]">Stream</span>
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
    <button className="flex flex-col items-center gap-[5px]">
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
  const [coinInfo, setCoinInfo] = useState<any>(null);
  const [ticker, setTicker] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [orderbook, setOrderbook] = useState<{bids: any[], asks: any[]}>({ bids: [], asks: [] });
  const [history, setHistory] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('1D');
  const [monthlyReturns, setMonthlyReturns] = useState<any>({});
  
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
         if (!(err instanceof TypeError && err.message === 'Failed to fetch')) {
             console.error("Error fetching CoinGecko info:", err);
         }
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
         if (!(err instanceof TypeError && err.message === 'Failed to fetch')) {
             console.error("Error fetching CoinGecko historical data:", err);
         }
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
        if (!(err instanceof TypeError && err.message === 'Failed to fetch')) {
            console.error(err);
        }
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
              className={`text-[11px] font-bold py-3 px-1 relative shrink-0 ${tab === 'ORDERBOOK' ? 'text-[#00a85a]' : 'text-gray-400'}`}
            >
              {tab}
              {tab === 'ORDERBOOK' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00a85a]"></div>}
            </button>
          ))}
        </div>

        {/* 5. MARKET SUMMARY */}
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

        {/* 6. ORDER BOOK TABLE */}
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

        {/* 7. BROKER FLOW (WHALE & ORDER FLOW) */}
        <div className="px-4 py-5 w-full bg-white border-t-8 border-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[16px] font-bold text-gray-900">Broker Flow</h3>
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

          {/* Chart Area */}
          <div className="w-full h-[280px] mt-4 mb-2 relative">
             <BrokerFlowChart data={chartData} />
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center justify-between px-1 py-2 mb-4">
            <div className="flex items-center justify-between flex-1 mr-6">
              {['1D', '1W', '1M', '3M', 'YTD', '1Y'].map(range => (
                <button 
                  key={range} 
                  className={`text-[11px] font-bold ${range === '1D' ? 'text-gray-900' : 'text-gray-400'}`}
                >
                  {range}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1">
               <LineChartIcon className="w-3.5 h-3.5 text-[#00a85a]" />
               <Activity className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          {/* Tags Grid */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-50">
                <div className="w-2 h-2 rounded-full bg-[#00a85a]"></div>
                <span className="text-[12px] font-bold text-gray-900">Price</span>
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50">
                <div className="w-2 h-2 rounded-full bg-[#e63946]"></div>
                <span className="text-[12px] font-bold text-gray-900">Large Whales</span>
                <X className="w-3.5 h-3.5 text-gray-400 ml-1" />
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-50">
                <div className="w-2 h-2 rounded-full bg-[#9d4edd]"></div>
                <span className="text-[12px] font-bold text-gray-900">Sharks</span>
                <X className="w-3.5 h-3.5 text-gray-400 ml-1" />
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-yellow-50">
                <div className="w-2 h-2 rounded-full bg-[#ffb703]"></div>
                <span className="text-[12px] font-bold text-gray-900">Retail</span>
                <X className="w-3.5 h-3.5 text-gray-400 ml-1" />
             </div>
             <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-50">
                <Plus className="w-4 h-4 text-gray-500" />
             </div>
             <Lock className="w-4 h-4 text-gray-400 ml-1" />
          </div>
        </div>

      </div>

      {/* 7. FIXED BOTTOM NAV */}
      <BottomNav currentScreen="assetDetail" setCurrentScreen={setCurrentScreen} />
    </div>
  );
}

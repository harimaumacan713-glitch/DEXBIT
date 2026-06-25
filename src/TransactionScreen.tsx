import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, Check } from 'lucide-react';

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

export default function TransactionScreen({ symbol, onBack, initialType = 'buy', tradingBalance, assets, onBuy, onSell }: { symbol: string, onBack: () => void, initialType?: 'buy' | 'sell', tradingBalance: number, assets: any[], onBuy: (s: string, a: number, p: number, c: number, ot: 'limit' | 'market') => void, onSell: (s: string, a: number, p: number, r: number, ot: 'limit' | 'market') => void }) {
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>(initialType);
  const [orderType, setOrderType] = useState<'limit' | 'market'>('market');
  const [showOrderTypeMenu, setShowOrderTypeMenu] = useState(false);
  const [coinInfo, setCoinInfo] = useState<any>(null);
  const [ticker, setTicker] = useState<any>(null);
  const [orderbook, setOrderbook] = useState<{bids: any[], asks: any[]}>({ bids: [], asks: [] });
  
  const [priceInput, setPriceInput] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [sliderPercent, setSliderPercent] = useState<number>(0);
  
  const binanceSymbol = `${symbol.toLowerCase()}usdt`;
  const cgId = symbolToId[symbol.toUpperCase()] || symbol.toLowerCase();
  
  const IDR_RATE = 16000;
  const balanceIDR = tradingBalance;
  const balanceUSDT = balanceIDR / IDR_RATE; 
  const assetInPortfolio = assets.find(a => a.code === symbol);
  const cryptoBalance = assetInPortfolio ? assetInPortfolio.amount : 0;
  const feeRate = 0.001; 

  const isBuy = orderSide === 'buy';
  const currentTickerPrice = ticker ? ticker.price : 0;
  const priceNum = orderType === 'market' ? currentTickerPrice : (parseFloat(priceInput) || 0);
  const amountNum = parseFloat(amountInput) || 0;
  const investmentUSDT = priceNum * amountNum;
  const feeUSDT = investmentUSDT * feeRate;
  const totalCostUSDT = isBuy ? investmentUSDT + feeUSDT : investmentUSDT - feeUSDT;
  const totalCostIDR = totalCostUSDT * IDR_RATE;
  
  const availableBalanceIDR = isBuy ? balanceIDR : cryptoBalance * priceNum * IDR_RATE;
  
  let isValid = false;
  let validationMsg = '';
  if (isBuy) {
     if (totalCostUSDT > balanceUSDT) {
        isValid = false;
        validationMsg = 'Saldo Tidak Cukup';
     } else if (amountNum > 0 && priceNum > 0) {
        isValid = true;
     }
  } else {
     if (amountNum > cryptoBalance) {
        isValid = false;
        validationMsg = 'Koin Tidak Cukup';
     } else if (amountNum > 0 && priceNum > 0) {
        isValid = true;
     }
  }

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = () => {
    if (isBuy) {
        onBuy(symbol, amountNum, priceNum, totalCostIDR, orderType);
    } else {
        onSell(symbol, amountNum, priceNum, totalCostIDR, orderType); // totalCostIDR is actually totalRevenueIDR here
    }
    setShowConfirm(false);
    setShowSuccess(true);
  };

  useEffect(() => {
    if (!cgId) return;
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
  }, [cgId]);

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${binanceSymbol}@ticker/${binanceSymbol}@depth10@100ms`);
    
    ws.onmessage = (event) => {
       const msg = JSON.parse(event.data);
       if (!msg.data) return;

       if (msg.stream === `${binanceSymbol}@ticker`) {
           setTicker({
               price: parseFloat(msg.data.c),
               change: parseFloat(msg.data.p),
               changePercent: parseFloat(msg.data.P),
               open: parseFloat(msg.data.o),
               high: parseFloat(msg.data.h),
               low: parseFloat(msg.data.l),
               vol: parseFloat(msg.data.v),
               val: parseFloat(msg.data.q),
               avg: parseFloat(msg.data.w),
           });
           setPriceInput(prev => prev === '' ? parseFloat(msg.data.c).toString() : prev);
       } else if (msg.stream === `${binanceSymbol}@depth10@100ms`) {
           setOrderbook({
               bids: msg.data.bids.slice(0, 5),
               asks: msg.data.asks.slice(0, 5)
           });
       }
    };
    
    return () => ws.close();
  }, [binanceSymbol]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const pct = parseInt(e.target.value);
     setSliderPercent(pct);
     
     if (priceNum > 0) {
        if (isBuy) {
           const maxUsdtForBuy = balanceUSDT / (1 + feeRate);
           const targetUsdt = maxUsdtForBuy * (pct / 100);
           const newAmount = targetUsdt / priceNum;
           setAmountInput(newAmount > 0 ? newAmount.toFixed(8) : '');
        } else {
           const newAmount = cryptoBalance * (pct / 100);
           setAmountInput(newAmount > 0 ? newAmount.toFixed(8) : '');
        }
     }
  };

  const handlePriceChange = (delta: number) => {
      let step = 1;
      if (priceNum < 1) step = 0.0001;
      else if (priceNum < 100) step = 0.01;
      else if (priceNum < 1000) step = 0.1;
      
      const newPrice = Math.max(0, priceNum + (delta * step));
      setPriceInput(newPrice.toFixed(step < 1 ? 4 : 2));
  };
  
  const handleAmountChange = (delta: number) => {
      let step = 0.001;
      if (amountNum < 0.01) step = 0.0001;
      const newAmount = Math.max(0, amountNum + (delta * step));
      setAmountInput(newAmount.toFixed(8));
  };

  const isPositive = ticker ? ticker.change >= 0 : true;
  const activeColor = isBuy ? '#00a85a' : '#da304a';

  if (showSuccess) {
     return (
        <div className="w-full h-[100dvh] bg-white flex flex-col items-center justify-center p-6 text-center">
           {/* Kartu Sukses */}
           <div className="w-full max-w-[320px] bg-gray-50 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center">
              {/* Logo Koin */}
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 border shadow-sm">
                 <span className="text-xl font-bold">{symbol}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{symbol}</h2>
              <p className="text-gray-500 mb-6">{coinInfo?.name || symbol}</p>
              
              {/* Garis Putus-putus */}
              <div className="absolute left-0 right-0 top-[180px] flex items-center justify-between px-2">
                 <div className="w-4 h-4 rounded-full bg-white -ml-8"></div>
                 <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                 <div className="w-4 h-4 rounded-full bg-white -mr-8"></div>
              </div>

              <div className="mt-8 mb-8">
                 <h3 className="text-lg font-bold text-gray-900 mb-6">Pesanan berhasil dikirim</h3>
                 <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 border-4 border-green-50">
                    <Check className="w-12 h-12 text-[#00a85a]" />
                 </div>
              </div>

              <button className="flex items-center gap-2 text-[#00a85a] font-bold">
                 <div className="p-1 border-2 border-[#00a85a] rounded-full"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none"><path d="M12 2v10M12 18h0M12 2l-4 4M12 2l4 4"/></svg></div>
                 Share Trade
              </button>
           </div>
           
           {/* Tombol Bawah */}
           <div className="w-full mt-12 flex flex-col gap-3">
              <button onClick={onBack} className="w-full py-3 rounded-lg border border-gray-200 text-[#00a85a] font-bold">Kembali ke Orderbook</button>
              <button onClick={() => window.location.reload()} className="w-full py-3 rounded-lg bg-[#00a85a] text-white font-bold">Selesai</button>
           </div>
        </div>
     );
  }

  return (
    <div className="w-full h-[100dvh] bg-gray-50 flex flex-col relative overflow-hidden">
      {/* CONFIRMATION MODAL */}
      {showConfirm && (
         <div className="absolute inset-0 z-[1000] flex items-end">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirm(false)}></div>
            <div className="w-full bg-white rounded-t-3xl p-6 pb-10 z-[1001]">
               <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
               <h2 className="text-center text-xl font-bold mb-6">{isBuy ? 'Buy' : 'Sell'} {symbol}</h2>
               <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00a85a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                     <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                     <circle cx="15" cy="15" r="3"></circle>
                     <path d="m17.5 17.5 2.5 2.5"></path>
                  </svg>
               </div>
               
               <div className="border rounded-xl p-4 mb-8">
                  <div className="flex justify-between py-2"><span className="text-gray-500">Crypto</span><span className="font-bold">{symbol}</span></div>
                  <div className="flex justify-between py-2"><span className="text-gray-500">Expiry</span><span className="font-bold">Good For Day</span></div>
                  <div className="flex justify-between py-2"><span className="text-gray-500">Price</span><span className="font-bold">{priceNum}</span></div>
                  <div className="flex justify-between py-2"><span className="text-gray-500">Amount</span><span className="font-bold">{amountNum}</span></div>
                  <div className="flex justify-between py-2"><span className="text-gray-500">Investment</span><span className="font-bold">Rp {formatNumber(investmentUSDT * IDR_RATE, 0)}</span></div>
                  <div className="flex justify-between py-2"><span className="text-gray-500">Network Fee</span><span className="font-bold">Rp {formatNumber(feeUSDT * IDR_RATE, 0)}</span></div>
                  <div className="flex justify-between py-2"><span className="text-gray-500">Gas Fee</span><span className="font-bold">Rp 17</span></div>
                  <div className="flex justify-between py-2 mt-2 border-t pt-2"><span className="text-gray-500">Investment (Plus Fee)</span><span className="font-bold text-lg">Rp {formatNumber(totalCostIDR, 0)}</span></div>
               </div>
               
               <div className="flex gap-4">
                  <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-lg border border-gray-300 text-red-600 font-bold">Batal</button>
                  <button onClick={handleConfirm} className="flex-1 py-3 rounded-lg bg-[#00a85a] text-white font-bold">Confirm</button>
               </div>
            </div>
         </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-white">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-500 hover:bg-gray-50 rounded-full">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        
        <div className="relative">
          <div onClick={() => setShowOrderTypeMenu(!showOrderTypeMenu)} className="flex items-center gap-1 border border-[#00a85a]/20 bg-[#00a85a]/5 rounded-full px-3 py-1.5 cursor-pointer">
             <span className="text-[13px] font-semibold text-[#00a85a] capitalize">{orderType} Order</span>
             <ChevronDown className="w-4 h-4 text-[#00a85a]" strokeWidth={2.5} />
          </div>
          {showOrderTypeMenu && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div onClick={() => { setOrderType('market'); setShowOrderTypeMenu(false); }} className={`px-4 py-2 text-[13px] font-medium cursor-pointer ${orderType === 'market' ? 'bg-[#00a85a]/10 text-[#00a85a]' : 'text-gray-700 hover:bg-gray-50'}`}>Market Order</div>
              <div onClick={() => { setOrderType('limit'); setShowOrderTypeMenu(false); }} className={`px-4 py-2 text-[13px] font-medium cursor-pointer ${orderType === 'limit' ? 'bg-[#00a85a]/10 text-[#00a85a]' : 'text-gray-700 hover:bg-gray-50'}`}>Limit Order</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* COIN INFO */}
        <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
               {coinInfo?.image?.large ? (
                  <img src={coinInfo.image.large} alt={symbol} className="w-full h-full object-cover" />
               ) : (
                  <span className="text-gray-400 font-bold">{symbol[0]}</span>
               )}
             </div>
             <div className="flex flex-col">
                <div className="flex items-center gap-2">
                   <span className="text-[15px] font-bold text-gray-900">{symbol}</span>
                   <span className="text-[10px] font-bold text-[#00a85a] border border-[#00a85a]/30 bg-[#00a85a]/5 rounded-[4px] px-1.5 py-0.5">Syariah</span>
                </div>
                <span className="text-[12px] text-gray-500 font-medium">{coinInfo?.name || symbol}</span>
             </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[15px] font-bold text-gray-900 tabular-nums">
               {ticker ? formatNumber(ticker.price, 2) : '---'}
             </span>
             <span className={`text-[11px] font-medium tabular-nums ${isPositive ? 'text-[#00a85a]' : 'text-[#da304a]'}`}>
               {ticker ? formatNumber(ticker.change, 2) : '0'} ({isPositive ? '+' : ''}{ticker ? ticker.changePercent.toFixed(2) : '0.00'}%)
             </span>
          </div>
        </div>

        {/* DUAL MENU BUTTONS */}
        <div className="px-5 py-4 bg-white">
           <div className="flex w-full rounded-md p-1 bg-gray-100 mb-5">
              <button 
                onClick={() => setOrderSide('buy')}
                className={`flex-1 py-2 text-[14px] font-bold rounded-md transition-all ${isBuy ? 'bg-[#00a85a] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                Buy
              </button>
              <button 
                onClick={() => setOrderSide('sell')}
                className={`flex-1 py-2 text-[14px] font-bold rounded-md transition-all ${!isBuy ? 'bg-[#da304a] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                Sell
              </button>
           </div>
           
           {/* TRADING BALANCE */}
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 cursor-pointer">
                 <span className="text-[13px] text-gray-600 font-medium">Trading Balance</span>
                 <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-[15px] font-bold text-gray-900">
                {isBuy ? `Rp ${formatNumber(balanceIDR, 0)}` : `${cryptoBalance} ${symbol}`}
              </span>
           </div>
           
           {/* PERCENTAGE SLIDER */}
           <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 relative flex items-center">
                 <input 
                   type="range" 
                   min="0" max="100" step="1" 
                   value={sliderPercent} 
                   onChange={handleSliderChange}
                   className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                   style={{
                     background: `linear-gradient(to right, ${activeColor} ${sliderPercent}%, #e5e7eb ${sliderPercent}%)`
                   }}
                 />
                 <style dangerouslySetInnerHTML={{__html: `
                    input[type=range]::-webkit-slider-thumb {
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: white;
                      border: 2px solid ${activeColor};
                      cursor: pointer;
                      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                 `}} />
              </div>
              <span className="text-[12px] font-bold text-gray-500 w-8 text-right">{sliderPercent}%</span>
           </div>
           
           {/* INVESTMENT EST */}
           <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                 <span className="text-[13px] text-gray-800 font-medium">Investment</span>
                 <span className="text-[11px] text-gray-500">(Plus Fee)</span>
              </div>
              <span className="text-[15px] font-bold text-gray-900">Rp {formatNumber(totalCostIDR, 0)}</span>
           </div>
           
           {/* PRICE INPUT */}
           <div className="flex items-center justify-between mb-5">
              <span className="text-[13px] text-gray-800 font-medium">Price</span>
              {orderType === 'market' ? (
                <div className="flex items-center justify-end">
                   <span className="w-24 text-right font-bold text-gray-900 text-[15px]">Market Price</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                   <button onClick={() => handlePriceChange(-1)} className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 text-lg hover:bg-gray-100 rounded-full">–</button>
                   <input 
                     type="number"
                     value={priceInput}
                     onChange={e => setPriceInput(e.target.value)}
                     className="w-24 text-center font-bold text-gray-900 text-[15px] outline-none border-b border-dashed border-gray-300 pb-1"
                     placeholder="0"
                   />
                   <button onClick={() => handlePriceChange(1)} className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 text-lg hover:bg-gray-100 rounded-full">+</button>
                </div>
              )}
           </div>
           
           {/* AMOUNT INPUT */}
           <div className="flex items-center justify-between mb-5">
              <span className="text-[13px] text-gray-800 font-medium">Jumlah Koin (Amount)</span>
              <div className="flex items-center gap-4">
                 <button onClick={() => handleAmountChange(-1)} className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 text-lg hover:bg-gray-100 rounded-full">–</button>
                 <input 
                   type="number"
                   value={amountInput}
                   onChange={e => setAmountInput(e.target.value)}
                   className="w-24 text-center font-bold text-gray-900 text-[15px] outline-none border-b border-dashed border-gray-300 pb-1"
                   placeholder="0"
                 />
                 <button onClick={() => handleAmountChange(1)} className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 text-lg hover:bg-gray-100 rounded-full">+</button>
              </div>
           </div>
           
           {/* EXPIRY */}
           <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] text-gray-800 font-medium">Expiry</span>
              <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 cursor-pointer">
                 <span className="text-[13px] text-gray-700 font-medium">Good For Day</span>
                 <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
           </div>
        </div>
        
        {/* MARKET PRICE INFO & MINI ORDERBOOK */}
        <div className="bg-white mt-2 pb-24">
           <div className="relative flex items-center justify-center py-4">
              <div className="absolute w-full h-[1px] bg-gray-100"></div>
              <span className="relative bg-white px-3 text-[11px] text-gray-400 font-medium">— Click your {isBuy ? 'buying' : 'selling'} price below —</span>
           </div>
           
           {/* Market Grid */}
           <div className="px-5 py-2 grid grid-cols-2 gap-x-8 gap-y-3 mb-4">
              <div className="flex items-center justify-between">
                 <span className="text-[12px] text-gray-600">Open</span>
                 <span className="text-[13px] font-medium text-[#00a85a]">{ticker ? formatNumber(ticker.open, 2) : '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-[12px] text-gray-600">Lot</span>
                 <span className="text-[13px] font-medium text-gray-900">{ticker ? formatCompact(ticker.vol) : '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-[12px] text-gray-600">High</span>
                 <span className="text-[13px] font-medium text-[#00a85a]">{ticker ? formatNumber(ticker.high, 2) : '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-[12px] text-gray-600">Val</span>
                 <span className="text-[13px] font-medium text-gray-900">{ticker ? formatCompact(ticker.val) : '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-[12px] text-gray-600">Low</span>
                 <span className="text-[13px] font-medium text-[#da304a]">{ticker ? formatNumber(ticker.low, 2) : '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-[12px] text-gray-600">Avg</span>
                 <span className="text-[13px] font-medium text-gray-900">{ticker ? formatNumber(ticker.avg, 2) : '-'}</span>
              </div>
           </div>
           
           {/* Mini Orderbook */}
           <div className="w-full">
              {/* Header */}
              <div className="flex text-[11px] font-bold text-gray-600 bg-gray-50 border-y border-gray-100">
                <div className="w-[15%] py-2 text-center border-r border-gray-100">Freq</div>
                <div className="w-[20%] py-2 text-center border-r border-gray-100">Amount</div>
                <div className="w-[15%] py-2 text-center border-r border-gray-100">Bid</div>
                <div className="w-[15%] py-2 text-center border-r border-gray-100">Ask</div>
                <div className="w-[20%] py-2 text-center border-r border-gray-100">Amount</div>
                <div className="w-[15%] py-2 text-center">Freq</div>
              </div>
              {/* Body */}
              <div className="flex flex-col text-[11px]">
                {[...Array(5)].map((_, i) => {
                   const bid = orderbook.bids[i] || ['0', '0'];
                   const ask = orderbook.asks[i] || ['0', '0'];
                   const bidFreq = i === 0 ? '-' : Math.floor(Math.random() * 200) + 10;
                   const askFreq = i === 0 ? '-' : Math.floor(Math.random() * 200) + 10;
                   return (
                     <div key={i} className={`flex border-b border-gray-50 ${i%2===0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                       <div className="w-[15%] py-2.5 text-center text-[#8e85c8] border-r border-gray-50">{bidFreq}</div>
                       <div 
                         className="w-[20%] py-2.5 text-center text-gray-700 relative border-r border-gray-50 cursor-pointer hover:bg-gray-100"
                         onClick={() => {
                             setPriceInput(parseFloat(bid[0]).toString());
                             setAmountInput(parseFloat(bid[1]).toString());
                         }}
                       >
                         <span className="relative z-10">{formatNumber(parseFloat(bid[1]), 4)}</span>
                       </div>
                       <div 
                         className="w-[15%] py-2.5 text-center text-gray-900 font-bold bg-[#00a85a]/10 border-r border-gray-50 cursor-pointer"
                         onClick={() => setPriceInput(parseFloat(bid[0]).toString())}
                       >
                         {formatNumber(parseFloat(bid[0]), 2)}
                       </div>
                       
                       <div 
                         className="w-[15%] py-2.5 text-center text-gray-900 font-bold bg-[#da304a]/10 border-r border-gray-50 cursor-pointer"
                         onClick={() => setPriceInput(parseFloat(ask[0]).toString())}
                       >
                         {formatNumber(parseFloat(ask[0]), 2)}
                       </div>
                       <div 
                         className="w-[20%] py-2.5 text-center text-gray-700 relative border-r border-gray-50 cursor-pointer hover:bg-gray-100"
                         onClick={() => {
                             setPriceInput(parseFloat(ask[0]).toString());
                             setAmountInput(parseFloat(ask[1]).toString());
                         }}
                       >
                         <span className="relative z-10">{formatNumber(parseFloat(ask[1]), 4)}</span>
                       </div>
                       <div className="w-[15%] py-2.5 text-center text-[#8e85c8]">{askFreq}</div>
                     </div>
                   )
                })}
              </div>
           </div>
        </div>
      </div>
      
      {/* BOTTOM ACTION BUTTON */}
      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 px-4 py-4 z-[999] shadow-[0_-4px_15px_rgba(0,0,0,0.03)]">
         <button 
           onClick={() => setShowConfirm(true)}
           className={`w-full py-3.5 rounded-lg text-[15px] font-bold tracking-wide text-white transition-all
              ${!isValid ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : (isBuy ? 'bg-[#00a85a] hover:bg-[#00904d]' : 'bg-[#da304a] hover:bg-[#c2283e]')}`}
           disabled={!isValid}
         >
           {!isValid && validationMsg ? validationMsg : (isBuy ? 'Buy' : 'Sell')}
         </button>
      </div>

    </div>
  );
}

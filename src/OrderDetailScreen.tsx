import React from 'react';
import { ChevronLeft, Share2 } from 'lucide-react';

export default function OrderDetailScreen({ transaction, onBack }: { transaction: any, onBack: () => void }) {
  const IDR_RATE = 16000;
  
  // Assuming transaction structure similar to HistoryItem or Order
  const priceIDR = transaction.price * IDR_RATE;
  const investment = transaction.amount * priceIDR;
  const fee = investment * 0.001;
  const total = investment + fee;

  return (
    <div className="w-full h-[100dvh] bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-500 hover:bg-gray-50 rounded-full">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <h1 className="text-[16px] font-bold text-gray-900">Order Detail</h1>
        <button className="p-1 text-gray-500 hover:bg-gray-50 rounded-full">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Asset Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">{transaction.symbol[0]}</div>
               <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-900">{transaction.symbol}</span>
                    <span className="text-[9px] bg-[#00a85a]/10 text-[#00a85a] px-1 rounded">Syariah</span>
                  </div>
                  <p className="text-[11px] text-gray-500">Company Name</p>
               </div>
            </div>
            <div className="text-right">
               <p className="font-bold text-gray-900">{priceIDR.toLocaleString('id-ID', {maximumFractionDigits: 0})}</p>
               <p className="text-[11px] text-[#00a85a]">+30 (+0.64%)</p>
            </div>
        </div>

        {/* Buy Order Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Buy Order</h2>
            <div className="flex justify-between py-1.5"><span className="text-gray-500 text-[13px]">Status</span><span className="font-bold text-[13px]">MATCH</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-500 text-[13px]">Order Type</span><span className="font-bold text-[13px] capitalize">{transaction.orderType} Order</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-500 text-[13px]">Expiry</span><span className="font-bold text-[13px]">Good For Day</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-500 text-[13px]">Price</span><span className="font-bold text-[13px]">{priceIDR.toLocaleString('id-ID', {maximumFractionDigits: 0})}</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-500 text-[13px]">Lot / Amount</span><span className="font-bold text-[13px]">{transaction.amount}</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-500 text-[13px]">Investment (Plus Fee)</span><span className="font-bold text-[13px]">{total.toLocaleString('id-ID', {maximumFractionDigits: 0})}</span></div>
            <div className="flex justify-between py-1.5 text-[#00a85a]"><span className="text-[13px]">IDX Order ID</span><span className="font-bold text-[13px]">{transaction.id}</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-500 text-[13px]">Order Time</span><span className="font-bold text-[13px]">{new Date(transaction.timestamp).toLocaleString('id-ID', {day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}</span></div>
        </div>

        {/* Buy Done Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Buy Done</h2>
            <div className="flex justify-between py-1.5"><span className="text-gray-500 text-[13px]">Price</span><span className="font-bold text-[13px]">{priceIDR.toLocaleString('id-ID', {minimumFractionDigits: 2})}</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-500 text-[13px]">Lot / Amount</span><span className="font-bold text-[13px]">{transaction.amount}</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-500 text-[13px]">Investment</span><span className="font-bold text-[13px]">{investment.toLocaleString('id-ID', {maximumFractionDigits: 0})}</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-500 text-[13px]">Broker Fee</span><span className="font-bold text-[13px]">{(investment * 0.0005).toLocaleString('id-ID', {minimumFractionDigits: 2})}</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-500 text-[13px]">Exchange Fee</span><span className="font-bold text-[13px]">{(investment * 0.0005).toLocaleString('id-ID', {minimumFractionDigits: 2})}</span></div>
            <div className="flex justify-between py-2 mt-2 border-t border-gray-100"><span className="text-gray-900 text-[13px] font-bold">Investment (Plus Fee)</span><span className="font-bold text-[14px] text-gray-900">{total.toLocaleString('id-ID', {maximumFractionDigits: 0})}</span></div>
        </div>

        <div className="text-[13px] font-bold text-gray-900 mt-2 pb-10 border-t border-gray-200 pt-4">In My Portfolio</div>
      </div>
    </div>
  );
}

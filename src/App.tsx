import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logout } from './firebase';
import PortfolioScreen from './PortfolioScreen';
import SearchScreen from './SearchScreen';
import ProfileScreen from './ProfileScreen';
import AssetDetailScreen from './AssetDetailScreen';
import TransactionScreen from './TransactionScreen';
import {
  Check,
  XCircle,
  ChevronRight,
  Headphones,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Star,
  Search,
  MessageSquare,
  PieChart,
  Wifi,
  SignalHigh,
  BellOff,
  FileText
} from 'lucide-react';

const WhatsAppIcon = () => (
  <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    <path d="M16 14.5c-.3.2-.6.4-1 .4s-1-.2-1.5-.4c-.5-.3-1-.6-1.5-.9-1-1-1.5-1.5-2.2-2.3-.3-.4-.6-.8-.8-1.2s-.2-.8-.2-1.1c0-.4.2-.7.5-1l.4-.4c.1-.2.2-.3.4-.3h.2c.1 0 .2.1.3.2l.6 1.4c.1.2.1.3 0 .5-.1.2-.2.4-.4.6 0 .1.1.2.1.3 0 .1.1.2.2.3l1.5 1.5c.1.1.2.2.3.2.1 0 .2.1.3.1.2-.2.4-.4.6-.4.2 0 .3.1.5.2l1.4.6c.1.1.2.2.2.3.1.2.1.4-.1.7z"></path>
  </svg>
);

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

const BinocularsSVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="55" cy="110" r="3" fill="#00a85a" />
    <circle cx="85" cy="115" r="4" fill="#2b3139" />
    <path d="M60 25 Q70 10 85 20" stroke="#00a85a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M40 35 L43 40 L49 41 L44 45 L46 51 L40 48 L34 51 L36 45 L31 41 L37 40 Z" fill="none" stroke="#2b3139" strokeWidth="2"/>
    <path d="M120 45 L122 48 L126 49 L123 51 L124 55 L120 53 L116 55 L117 51 L114 49 L118 48 Z" fill="none" stroke="#2b3139" strokeWidth="2"/>
    <path d="M55 50 L65 45 L72 55 L60 65 Z" fill="#b6eedd" stroke="#2b3139" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M105 50 L95 45 L88 55 L100 65 Z" fill="#b6eedd" stroke="#2b3139" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M72 70 L88 70" stroke="#2b3139" strokeWidth="4.5" strokeLinecap="round"/>
    <ellipse cx="60" cy="85" rx="20" ry="22" fill="#88ebd6" stroke="#2b3139" strokeWidth="3.5"/>
    <ellipse cx="60" cy="85" rx="8" ry="9" fill="white" stroke="#2b3139" strokeWidth="3.5"/>
    <ellipse cx="100" cy="85" rx="20" ry="22" fill="#88ebd6" stroke="#2b3139" strokeWidth="3.5"/>
    <ellipse cx="100" cy="85" rx="8" ry="9" fill="white" stroke="#2b3139" strokeWidth="3.5"/>
    <path d="M75 80 Q80 75 85 80" stroke="#2b3139" strokeWidth="3.5" fill="none" strokeLinecap="round" />
  </svg>
);

const LandingIllustration = () => (
  <svg className="w-full h-auto max-w-[340px] mx-auto" viewBox="0 0 320 290" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background light green arch */}
    <path d="M 20 260 Q 160 50 300 260 Z" fill="#e9fcf0" />

    {/* Floor lines */}
    {/* Main bottom line */}
    <line x1="10" y1="280" x2="310" y2="280" stroke="#2b3139" strokeWidth="2.5" strokeLinecap="round" />

    {/* Small line segments above the floor, adjacent to the phone */}
    <line x1="30" y1="270" x2="45" y2="270" stroke="#2b3139" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="60" y1="270" x2="80" y2="270" stroke="#2b3139" strokeWidth="2.5" strokeLinecap="round" />
    
    <line x1="240" y1="270" x2="260" y2="270" stroke="#2b3139" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="275" y1="270" x2="295" y2="270" stroke="#2b3139" strokeWidth="2.5" strokeLinecap="round" />

    {/* Left Decorations */}
    <circle cx="65" cy="100" r="4" stroke="#2b3139" strokeWidth="2" fill="none" />
    <path d="M 50 115 L 58 117 L 55 145 L 47 143 Z" stroke="#2b3139" strokeWidth="2" fill="none" strokeLinejoin="round" />
    {/* Purple Plus */}
    <path d="M 35 155 L 45 155 M 40 150 L 40 160" stroke="#714ba3" strokeWidth="2" strokeLinecap="round" />
    
    {/* Left Stars */}
    {/* Solid green star */}
    <path d="M 55 185 Q 65 185 65 175 Q 65 185 75 185 Q 65 185 65 195 Q 65 185 55 185 Z" fill="#00a85a" />
    {/* Outline green star */}
    <path d="M 70 205 Q 75 205 75 200 Q 75 205 80 205 Q 75 205 75 210 Q 75 205 70 205 Z" fill="none" stroke="#00a85a" strokeWidth="1.5" />

    {/* Right Decorations */}
    <path d="M 250 100 L 260 103 L 256 135 L 246 132 Z" stroke="#2b3139" strokeWidth="2" fill="none" strokeLinejoin="round" />
    <path d="M 265 110 L 275 113 L 271 140 L 261 137 Z" stroke="#2b3139" strokeWidth="2" fill="none" strokeLinejoin="round" />
    <circle cx="255" cy="180" r="4" stroke="#2b3139" strokeWidth="2" fill="none" />
    
    {/* Right Stars */}
    <path d="M 245 145 Q 252 145 252 138 Q 252 145 259 145 Q 252 145 252 152 Q 252 145 245 145 Z" fill="none" stroke="#00a85a" strokeWidth="1.5" />
    <path d="M 240 200 Q 248 200 248 192 Q 248 200 256 200 Q 248 200 248 208 Q 248 200 240 200 Z" fill="none" stroke="#00a85a" strokeWidth="1.5" />

    {/* The Phone */}
    <rect x="90" y="70" width="140" height="200" rx="14" fill="white" stroke="#2b3139" strokeWidth="2" />
    
    {/* Phone Speaker */}
    <rect x="140" y="82" width="40" height="6" rx="3" fill="#2b3139" />

    {/* Inside Phone */}
    {/* Light Green Circle */}
    <circle cx="120" cy="135" r="14" fill="#d1f2e3" />
    
    {/* Chart Line */}
    <polyline points="118,190 128,175 133,180 155,180 165,150 170,170 180,170 195,135" fill="none" stroke="#714ba3" strokeWidth="2" strokeLinejoin="round" />

    {/* Green Beli Button */}
    <rect x="115" y="215" width="90" height="28" rx="4" fill="#00a85a" />
    <text x="160" y="234" fill="white" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Beli</text>
  </svg>
);

const LandingScreen = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-5 py-3 text-xs font-medium text-gray-800 bg-white z-50">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] tracking-tight">17.39</span>
          <WhatsAppIcon />
          <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          <div className="w-1 h-1 bg-gray-400 rounded-full ml-0.5"></div>
        </div>
        <div className="flex items-center gap-1.5">
          <BellOff className="w-3.5 h-3.5 text-gray-700" strokeWidth={2} />
          <Wifi className="w-4 h-4 text-gray-700" strokeWidth={2} />
          <SignalHigh className="w-4 h-4 text-gray-700" strokeWidth={2} />
          
          <div className="flex items-center gap-0.5 ml-0.5">
            <span className="text-[#da304a] font-bold text-[11px] mt-[1px]">1</span>
            <div className="flex items-center">
              <div className="w-[18px] h-[10px] border-[1.5px] border-gray-400 rounded-sm p-[1px] flex items-center">
                <div className="w-[5%] h-[80%] bg-[#da304a] rounded-[1px]"></div>
              </div>
              <div className="w-[1.5px] h-1.5 bg-gray-400 rounded-r-[1px]"></div>
            </div>
            <div className="bg-gray-200 text-white rounded-full w-[12px] h-[12px] flex items-center justify-center -ml-1.5 -mt-2.5 border-[1.5px] border-white z-10">
                <span className="text-[#da304a] text-[8px] font-extrabold leading-none">!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3">
        <div className="relative inline-block pr-4">
          <span className="text-[24px] font-bold tracking-tight text-[#2b3139]">Stockbit</span>
          <svg className="absolute top-[0px] right-[0px] w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="14" width="4" height="6" fill="#00a85a" rx="1"/>
            <rect x="8" y="10" width="4" height="10" fill="#f5a623" rx="1"/>
            <rect x="14" y="6" width="4" height="14" fill="#00a85a" rx="1"/>
            <path d="M12 4 L20 4 L20 12" stroke="#2b3139" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 4 L10 14" stroke="#2b3139" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        
        {/* Indo Flag Toggle */}
        <div className="w-[44px] h-[24px] bg-gray-200 rounded-full p-[2px] flex items-center">
          <div className="w-[20px] h-[20px] rounded-full overflow-hidden flex flex-col shadow-sm bg-white">
            <div className="h-[48%] bg-[#ef4444]"></div>
            <div className="h-[52%] bg-white"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-12 overflow-y-auto">
        {/* Illustration */}
        <LandingIllustration />

        {/* Typography */}
        <div className="px-6 text-center mt-12">
          <h1 className="text-[19px] font-bold text-[#2b3139] mb-3">Beli Saham di Stockbit Aja</h1>
          <p className="text-[13px] text-gray-500 leading-[1.6]">
            Swipe. Order. Done. Semudah itu.<br/>
            Tanpa harus baca manual.
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-[6px] mt-8">
          <div className="w-[14px] h-[4px] bg-[#00a85a] rounded-full"></div>
          <div className="w-[4px] h-[4px] bg-gray-200 rounded-full"></div>
          <div className="w-[4px] h-[4px] bg-gray-200 rounded-full"></div>
          <div className="w-[4px] h-[4px] bg-gray-200 rounded-full"></div>
          <div className="w-[4px] h-[4px] bg-gray-200 rounded-full"></div>
          <div className="w-[4px] h-[4px] bg-gray-200 rounded-full"></div>
          <div className="w-[4px] h-[4px] bg-gray-200 rounded-full"></div>
        </div>

        <div className="flex-1"></div>

        {/* Buttons */}
        <div className="px-5 w-full flex flex-col gap-2 pb-10 mt-10">
          <button 
            onClick={onLogin}
            className="w-full bg-[#00a85a] text-white font-bold py-3.5 rounded-lg text-[13px] hover:bg-[#009650] transition-colors">
            Daftar dengan Google
          </button>
          <button 
            onClick={onLogin}
            className="w-full bg-white text-[#00a85a] font-bold py-3.5 rounded-lg text-[13px] hover:bg-gray-50 transition-colors">
            Masuk dengan Google
          </button>
        </div>
      </div>
      
      {/* Home Indicator */}
      <div className="pb-2 flex justify-center bg-white z-50">
        <div className="w-1/3 h-[4px] bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

const DashboardScreen = ({ user, setCurrentScreen }: { user: User | null, setCurrentScreen: (s: string) => void }) => (
  <>
    {/* Status Bar */}
    <div className="flex justify-between items-center px-5 py-3 text-xs font-medium text-gray-800 bg-white z-50">
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] tracking-tight">17.32</span>
        <WhatsAppIcon />
        <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        <div className="w-1 h-1 bg-gray-400 rounded-full ml-0.5"></div>
      </div>
      <div className="flex items-center gap-1.5">
        <BellOff className="w-3.5 h-3.5 text-gray-700" strokeWidth={2} />
        <Wifi className="w-4 h-4 text-gray-700" strokeWidth={2} />
        <SignalHigh className="w-4 h-4 text-gray-700" strokeWidth={2} />
        
        <div className="flex items-center gap-0.5 ml-0.5">
          <span className="text-[#da304a] font-bold text-[11px] mt-[1px]">3</span>
          <div className="flex items-center">
            <div className="w-[18px] h-[10px] border-[1.5px] border-gray-400 rounded-sm p-[1px] flex items-center">
              <div className="w-[15%] h-[80%] bg-[#da304a] rounded-[1px]"></div>
            </div>
            <div className="w-[1.5px] h-1.5 bg-gray-400 rounded-r-[1px]"></div>
          </div>
          <div className="bg-gray-200 text-white rounded-full w-[12px] h-[12px] flex items-center justify-center -ml-1.5 -mt-2.5 border-[1.5px] border-white z-10">
              <span className="text-[#da304a] text-[8px] font-extrabold leading-none">!</span>
          </div>
        </div>
      </div>
    </div>

    {/* Scrollable Content */}
    <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-white">
      
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-1.5">
        <div 
          onClick={() => setCurrentScreen('profile')}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-100 overflow-hidden cursor-pointer hover:bg-gray-50">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <CatLogo />
          )}
        </div>
        
        <div className="flex flex-col items-center justify-center -ml-2">
          <div className="relative inline-block">
            <span className="text-[22px] font-bold tracking-tight text-[#2b3139]">Stockbit</span>
            <svg className="absolute -top-0.5 -right-3 w-4 h-4" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="14" width="4" height="6" fill="#00a85a" rx="1"/>
              <rect x="8" y="10" width="4" height="10" fill="#f5a623" rx="1"/>
              <rect x="14" y="6" width="4" height="14" fill="#00a85a" rx="1"/>
              <path d="M12 4 L20 4 L20 12" stroke="#2b3139" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 4 L10 14" stroke="#2b3139" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        
        <button onClick={logout} className="text-gray-500 w-[22px] h-[22px] flex items-center justify-center" title="Keluar">
          <FileText className="w-full h-full" strokeWidth={1.5} />
        </button>
      </div>

      {/* Progress Tracker */}
      <div className="px-4 py-8">
        <div className="flex items-start justify-center relative">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center relative w-1/3 z-10">
            <div className="w-[34px] h-[34px] rounded-full border-[1.5px] border-[#00a85a] flex items-center justify-center bg-white z-10 ring-[6px] ring-white">
              <Check className="w-5 h-5 text-[#00a85a]" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-medium text-gray-800 mt-2">Registrasi</span>
            <div className="absolute top-[16px] left-[50%] w-full h-[1.5px] bg-[#00a85a] -z-10"></div>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center relative w-1/3 z-10">
            <div className="w-[34px] h-[34px] rounded-full bg-[#00a85a] flex items-center justify-center text-white font-bold text-[13px] z-10 ring-[6px] ring-white">
              2
            </div>
            <span className="text-[11px] font-medium text-gray-800 mt-2">Verifikasi</span>
            <div className="absolute top-[16px] left-[50%] w-full h-[1.5px] bg-gray-200 -z-10"></div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center relative w-1/3 z-10">
            <div className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center z-10 border-[1.5px] border-transparent ring-[6px] ring-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a0aab5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5.8 11.3 2 22l10.7-3.79"/>
                  <path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/>
                  <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/>
                  <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/>
                  <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.91 9 5.52 9 6.23V7"/>
                  <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>
                </svg>
            </div>
            <span className="text-[11px] font-medium text-gray-500 mt-2">Selesai</span>
          </div>

        </div>
      </div>

      {/* Verification Details Card */}
      <div className="px-4 pb-6">
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
            <XCircle className="w-5 h-5 text-[#da304a] shrink-0" strokeWidth={1.5} />
            <span className="text-[13px] text-gray-700 font-medium">Verifikasi oleh Sekuritas</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
            <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300 shrink-0 ml-[1px]" />
            <span className="text-[13px] text-gray-700 font-medium ml-[1px]">Verifikasi oleh KSEI</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300 shrink-0 ml-[1px]" />
            <span className="text-[13px] text-gray-700 font-medium ml-[1px]">Verifikasi oleh Bank RDN</span>
          </div>

          {/* Error Alert Box */}
          <div className="px-4 pb-4 mt-2">
            <div className="bg-[#fbebec] rounded-lg p-3.5 flex items-start justify-between">
              <div className="flex flex-col pr-4">
                <span className="text-[#da304a] font-bold text-[13px] mb-0.5">Verifikasi Belum Berhasil</span>
                <span className="text-[#da304a] text-[12px] leading-[1.4] opacity-90">
                  Ada data yang perlu kamu perbaiki sebelum bisa mulai investasi.
                </span>
              </div>
              <ChevronRight className="w-[18px] h-[18px] text-[#da304a] mt-1 shrink-0" strokeWidth={2.5} />
            </div>
          </div>

          {/* Live Chat Button */}
          <div className="border-t border-gray-100">
            <button className="w-full flex items-center justify-center gap-2 py-3.5 text-[#00a85a] font-bold text-[13px] transition-colors hover:bg-green-50/50">
              <Headphones className="w-[18px] h-[18px]" strokeWidth={2} />
              Chat Live Support
            </button>
          </div>
        </div>
      </div>

      <div className="h-2 bg-gray-50 w-full"></div>

      {/* e-IPO Section */}
      <div className="px-4 py-5 border-t border-gray-100">
        <h2 className="text-[#2b3139] font-bold text-sm mb-3.5">e-IPO</h2>
        <div className="flex items-center gap-3">
          {/* PRDL Card */}
          <div className="border border-gray-200 rounded-[10px] p-2 flex items-center gap-2.5 relative min-w-[120px] shadow-sm">
            <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z" fill="#e8f0fe"/>
                  <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" fill="#1a73e8"/>
                  <path d="M50 20 L80 35 L50 50 L20 35 Z" fill="#8ab4f8"/>
                  <path d="M20 35 L50 50 L50 80 L20 65 Z" fill="#1967d2"/>
                  <path d="M80 35 L50 50 L50 80 L80 65 Z" fill="#fbbc04"/>
                </svg>
            </div>
            <span className="font-bold text-[#2b3139] text-[13px]">PRDL</span>
            <button className="absolute top-1.5 right-1.5 text-gray-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
          {/* Lihat Semua */}
          <button className="flex flex-col items-center justify-center gap-1.5 ml-2">
            <div className="w-7 h-7 rounded-full border-[1.5px] border-[#00a85a] flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-[#00a85a]" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold text-[#00a85a]">Lihat Semua</span>
          </button>
        </div>
      </div>

      <div className="h-[1px] bg-gray-100 w-full"></div>

      {/* Watchlist Section */}
      <div className="flex-1 bg-white flex flex-col relative min-h-[300px]">
        <div className="flex justify-between items-center px-4 py-4">
          <button className="flex items-center gap-1.5 border-[1.5px] border-[#00a85a] rounded-full px-3.5 py-1.5 bg-white">
            <span className="text-[#00a85a] text-[13px] font-medium">All Watchlist</span>
            <ChevronDown className="w-4 h-4 text-[#00a85a]" strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-5 text-gray-400 pr-1">
            <MoreHorizontal className="w-[22px] h-[22px]" />
            <Plus className="w-[22px] h-[22px]" strokeWidth={2} />
          </div>
        </div>
        
        {/* Binoculars Empty State */}
        <div className="flex-1 flex items-end justify-center pb-12">
          <div className="w-44 h-36 flex items-center justify-center relative">
              <BinocularsSVG />
          </div>
        </div>
      </div>

    </div>

    {/* Bottom Navigation */}
    <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-between items-center px-6 pt-3 pb-7 z-50">
      <button onClick={() => setCurrentScreen('dashboard')} className="flex flex-col items-center gap-[5px]">
        <svg className="w-[26px] h-[26px] text-[#00a85a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="text-[11px] font-semibold text-[#00a85a]">Watchlist</span>
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
        <svg className="w-[26px] h-[26px] text-[#9ba4b5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v9h9" />
        </svg>
        <span className="text-[11px] font-medium text-[#9ba4b5]">Portfolio</span>
      </button>
    </div>
    
    {/* Home Indicator */}
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-[4px] bg-gray-300 rounded-full z-50"></div>
  </>
);

export type PortfolioAsset = {
  code: string;
  amount: number;
  avgPrice: number;
};

export type Order = {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  orderType: 'limit' | 'market';
  price: number;
  amount: number;
  status: 'open' | 'filled' | 'cancelled';
  timestamp: number;
};

export type HistoryItem = {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  orderType: 'limit' | 'market';
  price: number;
  amount: number;
  totalIDR: number;
  status: 'filled';
  timestamp: number;
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('landing');
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [tradingBalance, setTradingBalance] = useState<number>(2801641);
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/prices');
        const data: { symbol: string; price: string }[] = await res.json();
        const priceMap: Record<string, number> = {};
        data.forEach(item => {
          if (item.symbol.endsWith('USDT')) {
            const code = item.symbol.replace('USDT', '');
            priceMap[code] = parseFloat(item.price);
          }
        });
        setCurrentPrices(priceMap);
      } catch (e) {
        console.error('Failed to fetch prices in App.tsx', e);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const openOrders = orders.filter(o => o.status === 'open');
    if (openOrders.length === 0) return;

    let changed = false;
    const nextOrders = orders.map(order => {
      if (order.status !== 'open') return order;
      const currentPrice = currentPrices[order.symbol];
      if (!currentPrice) return order;

      if (order.type === 'buy') {
        if (currentPrice <= order.price) {
          changed = true;
          return { ...order, status: 'filled' as const };
        }
      } else {
        if (currentPrice >= order.price) {
          changed = true;
          return { ...order, status: 'filled' as const };
        }
      }
      return order;
    });

    if (changed) {
      const updatedAssets = [...assets];
      const updatedHistory = [...history];
      let updatedBalance = tradingBalance;

      nextOrders.forEach((order, idx) => {
        const oldOrder = orders[idx];
        if (oldOrder.status === 'open' && order.status === 'filled') {
          if (order.type === 'buy') {
            const existing = updatedAssets.find(a => a.code === order.symbol);
            if (existing) {
              const newAmount = existing.amount + order.amount;
              const newAvgPrice = ((existing.amount * existing.avgPrice) + (order.amount * order.price)) / newAmount;
              const updatedAssetIdx = updatedAssets.findIndex(a => a.code === order.symbol);
              updatedAssets[updatedAssetIdx] = { ...existing, amount: newAmount, avgPrice: newAvgPrice };
            } else {
              updatedAssets.push({ code: order.symbol, amount: order.amount, avgPrice: order.price });
            }

            const totalCostIDR = order.amount * order.price * 16000 * 1.001;
            updatedHistory.unshift({
              id: order.id,
              symbol: order.symbol,
              type: 'buy',
              orderType: 'limit',
              price: order.price,
              amount: order.amount,
              totalIDR: totalCostIDR,
              status: 'filled',
              timestamp: Date.now()
            });
          } else {
            const totalRevenueIDR = order.amount * order.price * 16000 * 0.999;
            updatedBalance += totalRevenueIDR;

            updatedHistory.unshift({
              id: order.id,
              symbol: order.symbol,
              type: 'sell',
              orderType: 'limit',
              price: order.price,
              amount: order.amount,
              totalIDR: totalRevenueIDR,
              status: 'filled',
              timestamp: Date.now()
            });
          }
        }
      });

      setOrders(nextOrders);
      setAssets(updatedAssets);
      setHistory(updatedHistory);
      setTradingBalance(updatedBalance);
    }
  }, [currentPrices, orders, assets, history, tradingBalance]);

  const handleBuyAsset = (
    symbol: string,
    amount: number,
    avgPrice: number,
    totalCostIDR: number,
    orderType: 'limit' | 'market' = 'market'
  ) => {
    const id = 'ord_' + Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now();

    if (orderType === 'market') {
      setTradingBalance(prev => Math.max(0, prev - totalCostIDR));
      setAssets(prev => {
        const existing = prev.find(a => a.code === symbol);
        if (existing) {
           const newAmount = existing.amount + amount;
           const newAvgPrice = ((existing.amount * existing.avgPrice) + (amount * avgPrice)) / newAmount;
           return prev.map(a => a.code === symbol ? { ...a, amount: newAmount, avgPrice: newAvgPrice } : a);
        } else {
           return [...prev, { code: symbol, amount, avgPrice }];
        }
      });
      
      const newOrder: Order = {
        id,
        symbol,
        type: 'buy',
        orderType: 'market',
        price: avgPrice,
        amount,
        status: 'filled',
        timestamp
      };
      
      const newHistory: HistoryItem = {
        id,
        symbol,
        type: 'buy',
        orderType: 'market',
        price: avgPrice,
        amount,
        totalIDR: totalCostIDR,
        status: 'filled',
        timestamp
      };

      setOrders(prev => [newOrder, ...prev]);
      setHistory(prev => [newHistory, ...prev]);
    } else {
      setTradingBalance(prev => Math.max(0, prev - totalCostIDR));
      
      const newOrder: Order = {
        id,
        symbol,
        type: 'buy',
        orderType: 'limit',
        price: avgPrice,
        amount,
        status: 'open',
        timestamp
      };
      
      setOrders(prev => [newOrder, ...prev]);
    }
  };

  const handleSellAsset = (
    symbol: string,
    amount: number,
    priceUSDT: number,
    totalRevenueIDR: number,
    orderType: 'limit' | 'market' = 'market'
  ) => {
    const id = 'ord_' + Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now();

    if (orderType === 'market') {
      setTradingBalance(prev => prev + totalRevenueIDR);
      setAssets(prev => {
        const existing = prev.find(a => a.code === symbol);
        if (existing) {
           const newAmount = existing.amount - amount;
           if (newAmount <= 0.00000001) {
                return prev.filter(a => a.code !== symbol);
           }
           return prev.map(a => a.code === symbol ? { ...a, amount: newAmount } : a);
        }
        return prev;
      });

      const newOrder: Order = {
        id,
        symbol,
        type: 'sell',
        orderType: 'market',
        price: priceUSDT,
        amount,
        status: 'filled',
        timestamp
      };

      const newHistory: HistoryItem = {
        id,
        symbol,
        type: 'sell',
        orderType: 'market',
        price: priceUSDT,
        amount,
        totalIDR: totalRevenueIDR,
        status: 'filled',
        timestamp
      };

      setOrders(prev => [newOrder, ...prev]);
      setHistory(prev => [newHistory, ...prev]);
    } else {
      setAssets(prev => {
        const existing = prev.find(a => a.code === symbol);
        if (existing) {
          const newAmount = existing.amount - amount;
          if (newAmount <= 0.00000001) {
            return prev.filter(a => a.code !== symbol);
          }
          return prev.map(a => a.code === symbol ? { ...a, amount: newAmount } : a);
        }
        return prev;
      });

      const newOrder: Order = {
        id,
        symbol,
        type: 'sell',
        orderType: 'limit',
        price: priceUSDT,
        amount,
        status: 'open',
        timestamp
      };

      setOrders(prev => [newOrder, ...prev]);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prevOrders => {
      const order = prevOrders.find(o => o.id === orderId);
      if (!order || order.status !== 'open') return prevOrders;

      if (order.type === 'buy') {
        const totalCostIDR = order.amount * order.price * 16000 * 1.001;
        setTradingBalance(prev => prev + totalCostIDR);
      } else {
        setAssets(prevAssets => {
          const existing = prevAssets.find(a => a.code === order.symbol);
          if (existing) {
            return prevAssets.map(a => a.code === order.symbol ? { ...a, amount: a.amount + order.amount } : a);
          } else {
            return [...prevAssets, { code: order.symbol, amount: order.amount, avgPrice: order.price }];
          }
        });
      }

      return prevOrders.map(o => o.id === orderId ? { ...o, status: 'cancelled' as const } : o);
    });
  };

  useEffect(() => {
    let isInitialLoad = true;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const path = `users/${currentUser.uid}`;
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setTradingBalance(data.tradingBalance ?? 2801641);
            setAssets(data.assets ?? []);
            setOrders(data.orders ?? []);
            setHistory(data.history ?? []);
          } else {
            // Initialize new user
            try {
              await setDoc(userDocRef, {
                tradingBalance: 2801641,
                assets: [],
                orders: [],
                history: []
              });
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, path);
            }
            setTradingBalance(2801641);
            setAssets([]);
            setOrders([]);
            setHistory([]);
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, path);
        }
        setCurrentScreen('dashboard');
      } else {
        setCurrentScreen('landing');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && !loading) {
       const userDocRef = doc(db, 'users', user.uid);
       const path = `users/${user.uid}`;
       setDoc(userDocRef, { tradingBalance, assets, orders, history }, { merge: true })
         .catch(err => handleFirestoreError(err, OperationType.WRITE, path));
    }
  }, [tradingBalance, assets, orders, history, user, loading]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center font-sans">
        <div className="w-full sm:max-w-[420px] h-[100dvh] bg-white relative sm:shadow-2xl flex items-center justify-center sm:border-x border-gray-200">
           <div className="w-12 h-12 border-4 border-[#00a85a] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center font-sans">
      <div className="w-full sm:max-w-[420px] h-[100dvh] bg-white relative sm:shadow-2xl overflow-hidden flex flex-col sm:border-x border-gray-200">
        {currentScreen === 'landing' && <LandingScreen onLogin={handleLogin} />}
        {currentScreen === 'dashboard' && <DashboardScreen user={user} setCurrentScreen={setCurrentScreen} />}
        {currentScreen === 'search' && <SearchScreen user={user} setCurrentScreen={setCurrentScreen} setSelectedCoin={(coin) => { setSelectedCoin(coin); setCurrentScreen('assetDetail'); }} />}
        {currentScreen === 'profile' && <ProfileScreen user={user} onBack={() => setCurrentScreen('dashboard')} tradingBalance={tradingBalance} assets={assets} />}
        {currentScreen === 'assetDetail' && <AssetDetailScreen symbol={selectedCoin} onBack={() => setCurrentScreen('search')} setCurrentScreen={setCurrentScreen} />}
        {currentScreen === 'transaction' && <TransactionScreen symbol={selectedCoin} onBack={() => setCurrentScreen('assetDetail')} tradingBalance={tradingBalance} assets={assets} onBuy={handleBuyAsset} onSell={handleSellAsset} />}
        {currentScreen === 'portfolio' && <PortfolioScreen setCurrentScreen={setCurrentScreen} tradingBalance={tradingBalance} assets={assets} orders={orders} history={history} onCancelOrder={handleCancelOrder} />}
      </div>
    </div>
  );
}

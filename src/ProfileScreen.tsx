import React from 'react';
import {
  ChevronLeft,
  User as UserIcon,
  Fingerprint,
  Lock,
  Smartphone,
  Link as LinkIcon,
  Shield,
  Archive,
  Users,
  Key,
  Bell,
  Globe,
  ShieldCheck,
  HeadphonesIcon,
  Stethoscope,
  Trash2,
  HelpCircle,
  Star,
  FileText,
  RefreshCw,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { logout } from './firebase';

const CustomIconEIPO = () => (
  <div className="relative flex items-center justify-center w-5 h-5 border-[1.5px] border-gray-400 rounded-sm">
    <span className="text-[6px] font-bold text-gray-500">e-IPO</span>
  </div>
);

const CustomIconTip = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <path d="M8 21h8a2 2 0 0 0 2-2v-5a2 2 0 0 0-1.26-1.86L12 9l-4.74 3.14A2 2 0 0 0 6 14v5a2 2 0 0 0 2 2z"/>
    <path d="M12 9v-4"/>
    <path d="M10 5h4"/>
    <circle cx="12" cy="15" r="2"/>
    <path d="M12 14v2"/>
  </svg>
);

const DarkModeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20" />
    <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" opacity="0.5"/>
  </svg>
)

const SyaratPenggunaanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CatLogo = () => (
  <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#a0c4ff"/>
    <path d="M30 45 L35 30 L45 40" fill="white"/>
    <path d="M70 45 L65 30 L55 40" fill="white"/>
    <circle cx="50" cy="65" r="28" fill="white"/>
    <circle cx="40" cy="60" r="4" fill="#333"/>
    <circle cx="60" cy="60" r="4" fill="#333"/>
    <path d="M45 70 Q50 75 55 70" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
);

export default function ProfileScreen({ user, onBack, tradingBalance, assets }: { user: User | null, onBack: () => void, tradingBalance: number, assets: any[] }) {
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

  const [currentPrices, setCurrentPrices] = React.useState<Record<string, number>>(FALLBACK_PRICES);
  const [showPwaSettings, setShowPwaSettings] = React.useState(false);
  const [cacheBuster, setCacheBuster] = React.useState(Date.now());
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  React.useEffect(() => {
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
        
        setCurrentPrices(prev => ({ ...prev, ...priceMap }));
      } catch (e) {
        console.warn('Failed to fetch prices through proxy in ProfileScreen, maintaining fallbacks:', e);
      }
    };

    if (assets.length > 0) {
        fetchPrice();
    }
  }, [assets]);

  const IDR_RATE = 16000;
  const totalMarketValue = assets.reduce((acc, asset) => {
      const currentPriceUSDT = currentPrices[asset.code] || asset.avgPrice;
      const currentPriceIDR = currentPriceUSDT * IDR_RATE;
      return acc + (asset.amount * currentPriceIDR);
  }, 0);

  const totalEquity = tradingBalance + totalMarketValue;
  const menuGroups = [
    {
      title: 'Akun',
      items: [
        { icon: <UserIcon className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Akun' },
      ]
    },
    {
      title: 'Keamanan',
      items: [
        { icon: <Fingerprint className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Biometrik Login' },
        { icon: <Lock className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Keamanan' },
        { icon: <Smartphone className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Perangkat Terhubung' },
        { icon: <LinkIcon className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Akun Terhubung' },
      ]
    },
    {
      title: 'Fitur',
      items: [
        { icon: <Shield className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'e-IPO' },
        { icon: <Archive className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'KTUR' },
        { icon: <Users className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Temukan Teman' },
        { icon: <CustomIconTip />, label: 'Kantong Tip' },
        { icon: <Key className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Stockbit PRO' },
      ]
    },
    {
      title: 'Pengaturan',
      items: [
        { icon: <DarkModeIcon />, label: 'Mode Gelap', isToggle: true },
        { icon: <Smartphone className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Instal Aplikasi & Ikon', action: () => setShowPwaSettings(true) },
        { icon: <Bell className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Notifikasi' },
        { icon: <Globe className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Bahasa' },
        { icon: <ShieldCheck className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Privasi' },
      ]
    },
    {
      title: 'Bantuan',
      items: [
        { icon: <HeadphonesIcon className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Live Support' },
        { icon: <Stethoscope className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Diagnosis' },
        { icon: <Trash2 className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Hapus Cache' },
        { icon: <HelpCircle className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'FAQ' },
        { icon: <Star className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Beri Stockbit Rating' },
      ]
    },
    {
      title: 'Legal',
      items: [
        { icon: <SyaratPenggunaanIcon />, label: 'Syarat Penggunaan' },
        { icon: <FileText className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Kebijakan Privasi' },
      ]
    },
    {
      title: 'Login',
      items: [
        { icon: <RefreshCw className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Pindah ke Real Trading' },
        { icon: <LogOut className="w-[22px] h-[22px] text-[#8e949f]" strokeWidth={1.5} />, label: 'Keluar', action: async () => {
            await logout();
            onBack(); 
        } },
      ]
    }
  ];

  if (showPwaSettings) {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      setIsUploading(true);
      setUploadStatus('idle');
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          const res = await fetch('/api/upload-icon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 })
          });
          
          if (res.ok) {
            setUploadStatus('success');
            setCacheBuster(Date.now());
          } else {
            setUploadStatus('error');
          }
        } catch (err) {
          console.error(err);
          setUploadStatus('error');
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className="w-full h-full bg-white flex flex-col overflow-y-auto scrollbar-hide pb-10">
        {/* Header */}
        <div className="px-4 pt-5 pb-4 flex items-center border-b border-gray-100 sticky top-0 bg-white z-10 shadow-sm">
          <button onClick={() => setShowPwaSettings(false)} className="p-1 -ml-1 text-gray-400 hover:bg-gray-50 rounded-full flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-gray-600" strokeWidth={2.5} />
          </button>
          <h1 className="text-[16px] font-bold text-gray-900 ml-2">Ikon & Instalasi Aplikasi</h1>
        </div>

        <div className="px-5 py-6 flex flex-col items-center">
          {/* App Icon Preview Card */}
          <div className="w-28 h-28 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center overflow-hidden mb-4 relative">
            <img 
              src={`/icon-512.jpg?v=${cacheBuster}`} 
              alt="App Icon" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';
              }}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col gap-2">
                <div className="w-6 h-6 border-2 border-[#00a85a] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] text-white font-medium text-center">Mengunggah...</span>
              </div>
            )}
          </div>

          <span className="text-[12px] font-bold text-gray-800 mb-5">Pratinjau Ikon Aplikasi</span>

          {/* Action buttons */}
          <div className="w-full flex flex-col items-center gap-3 mb-8">
            <label htmlFor="icon-upload" className="w-full max-w-xs flex items-center justify-center gap-2 py-3 px-4 bg-[#00a85a] text-white rounded-xl font-bold text-[13px] shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
              <span>Ganti Ikon Aplikasi</span>
              <input 
                id="icon-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
            
            {uploadStatus === 'success' && (
              <div className="text-[12px] font-bold text-[#00a85a] bg-[#eefcf3] px-4 py-2 rounded-lg border border-[#c2f2d4]/50 text-center w-full max-w-xs">
                ✨ Ikon berhasil diperbarui!
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="text-[12px] font-bold text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-100 text-center w-full max-w-xs">
                ❌ Gagal mengunggah ikon. Coba lagi.
              </div>
            )}

            <p className="text-[11px] text-gray-400 text-center max-w-xs leading-relaxed px-2">
              Unggah file gambar (PNG/JPG) persegi beresolusi tinggi. Ikon ini akan otomatis digunakan saat aplikasi diinstal di ponsel Anda.
            </p>
          </div>

          {/* Installation Guides */}
          <div className="w-full border-t border-gray-100 pt-6">
            <h3 className="text-[14px] font-bold text-gray-900 mb-4 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#00a85a]" strokeWidth={2.5} />
              <span>Cara Instal Aplikasi (Gratis)</span>
            </h3>

            {/* Android Guide */}
            <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#00a85a] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">Android</span>
                <span className="text-[12px] font-bold text-gray-800">Google Chrome</span>
              </div>
              <ol className="list-decimal list-inside text-[11.5px] text-gray-600 space-y-2 leading-relaxed">
                <li>Buka website ini di browser <span className="font-bold">Google Chrome</span> HP Anda.</li>
                <li>Ketuk ikon <span className="font-bold">titik tiga (⋮)</span> di kanan atas layar.</li>
                <li>Pilih menu <span className="font-bold">"Instal Aplikasi"</span> atau <span className="font-bold">"Tambahkan ke Layar Utama"</span>.</li>
                <li>Aplikasi CoinX akan muncul di menu HP Anda dengan ikon kustom pilihan Anda!</li>
              </ol>
            </div>

            {/* iOS Guide */}
            <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#00a85a] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">Apple iOS</span>
                <span className="text-[12px] font-bold text-gray-800">Safari Browser</span>
              </div>
              <ol className="list-decimal list-inside text-[11.5px] text-gray-600 space-y-2 leading-relaxed">
                <li>Buka website ini menggunakan browser <span className="font-bold">Safari</span> di iPhone/iPad Anda.</li>
                <li>Ketuk tombol <span className="font-bold">Bagikan (ikon kotak dengan panah atas)</span> di bagian bawah layar Safari.</li>
                <li>Gulir ke bawah dan pilih menu <span className="font-bold">"Tambahkan ke Layar Utama"</span> (Add to Home Screen).</li>
                <li>Ketuk <span className="font-bold">"Tambah"</span> di pojok kanan atas. Selesai!</li>
              </ol>
            </div>

            <div className="mt-5 p-3.5 bg-amber-50/60 rounded-xl border border-amber-100 flex gap-2">
              <span className="text-amber-500 text-sm">💡</span>
              <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                <span className="font-bold">Tips:</span> Jika ikon tidak langsung berubah setelah diganti, harap bersihkan cache browser Anda atau hapus data cache situs web, lalu reload halaman agar browser memuat ikon terbaru.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-y-auto scrollbar-hide pb-5">
      <div className="px-4 pt-5 pb-2 flex items-center justify-between sticky top-0 bg-white z-10">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-400 hover:bg-gray-50 rounded-full">
          <ChevronLeft className="w-6 h-6" strokeWidth={2} />
        </button>
        <div className="w-6 h-6" /> 
      </div>

      <div className="flex flex-col items-center mt-1 px-5">
        <div className="w-[68px] h-[68px] rounded-full flex items-center justify-center border border-gray-100 overflow-hidden mb-3">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <CatLogo />
          )}
        </div>
        <h2 className="text-[15px] font-bold text-gray-900 leading-tight tracking-tight">
          {user?.displayName || 'DewanggaTreders'}
        </h2>
        <button className="text-[11px] font-semibold text-[#00a85a] mt-0.5 mb-8 hover:underline tracking-wide">
          Lihat Profil
        </button>

        <div className="w-full flex justify-between px-2 mb-6">
          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] text-gray-400 font-medium mb-1">Total Trading Balance</span>
            <span className="text-[12px] font-bold text-gray-900">Rp{tradingBalance.toLocaleString('id-ID', {maximumFractionDigits: 0})}</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] text-gray-400 font-medium mb-1">Total Equity</span>
            <span className="text-[12px] font-bold text-gray-900">Rp{totalEquity.toLocaleString('id-ID', {maximumFractionDigits: 0})}</span>
          </div>
        </div>

        {/* Transaction Menu */}
        <div className="w-full flex justify-around px-2 mb-8">
          {[
            { label: 'Deposit', icon: 'M12 16V8M9 11l3-3 3 3M12 21a9 9 0 100-18 9 9 0 000 18z' },
            { label: 'Withdrawal', icon: 'M12 8v8M9 13l3 3 3-3M12 21a9 9 0 100-18 9 9 0 000 18z' },
            { label: 'Riwayat', icon: 'M12 8v4l3 3M12 21a9 9 0 100-18 9 9 0 000 18z' }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center relative bg-white">
                <div className="w-9 h-9 rounded-full bg-[#006e3a] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff85" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {index === 0 && <path d="M12 16V8M9 11l3-3 3 3" />}
                    {index === 1 && <path d="M12 8v8M9 13l3 3 3-3" />}
                    {index === 2 && <path d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  </svg>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-gray-800">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full px-5">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-1 w-full">
            <h3 className="text-[10px] font-semibold text-[#a5abb5] mb-2 mt-5 tracking-wide">{group.title}</h3>
            <div className="flex flex-col w-full">
              {group.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  onClick={item.action}
                  className={`flex items-center justify-between py-3.5 border-b border-gray-50/80 ${item.action ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    {item.icon}
                    <span className="text-[13px] font-medium text-[#3b3b3b] tracking-wide">{item.label}</span>
                  </div>
                  {item.isToggle ? (
                    <div className="w-9 h-5 bg-gray-200 rounded-full flex items-center px-0.5 shrink-0">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" strokeWidth={2} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center mt-12 mb-6">
        <span className="text-[9px] font-bold text-gray-800 mb-5 tracking-tight">© PT Stockbit Sekuritas Digital</span>
        
        <div className="flex items-center gap-5 mb-5">
          {/* X (Twitter) */}
          <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          
          {/* Instagram */}
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </div>

          {/* TikTok */}
          <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.91-.56 3.86-1.78 5.37-1.35 1.67-3.4 2.58-5.54 2.47-2.31-.07-4.48-1.2-5.75-3.08-1.16-1.7-1.48-3.9-.92-5.83.6-2.07 2.15-3.8 4.13-4.63 1.94-.82 4.16-.83 6.13-.23.11.03.22.06.33.09v4.06c-.85-.31-1.77-.4-2.65-.26-1.13.16-2.17.81-2.78 1.76-.5.78-.65 1.75-.46 2.65.2.91.82 1.68 1.62 2.14.77.45 1.7.59 2.56.44 1.05-.18 1.96-.86 2.46-1.78.37-.66.53-1.44.53-2.21V.02z"/>
            </svg>
          </div>
        </div>

        <span className="text-[9px] font-medium text-[#a5abb5]">Version : 3.21.6 (11306)</span>
      </div>

      <div className="w-1/3 h-[4px] bg-gray-300 rounded-full mx-auto my-2 shrink-0"></div>
    </div>
  );
}

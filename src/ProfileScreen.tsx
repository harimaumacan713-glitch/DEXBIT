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

export default function ProfileScreen({ user, onBack }: { user: User | null, onBack: () => void }) {
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
            <span className="text-[12px] font-bold text-gray-900">Rp2,911,117</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] text-gray-400 font-medium mb-1">Total Equity</span>
            <span className="text-[12px] font-bold text-gray-900">Rp50,454,370</span>
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

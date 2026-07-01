import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Search, 
  SlidersHorizontal, 
  ThumbsUp, 
  Share2, 
  DollarSign, 
  MessageSquare, 
  MoreHorizontal, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Sparkles, 
  Lock, 
  Send, 
  BookOpen, 
  ExternalLink,
  ChevronLeft,
  X,
  FileText
} from 'lucide-react';

// Verification check icon
const VerifiedBadge = () => (
  <span className="inline-flex items-center justify-center bg-[#00a85a] rounded-full p-0.5 ml-1 w-3.5 h-3.5 shrink-0" title="Terverifikasi">
    <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
  </span>
);

interface Post {
  id: string;
  authorName: string;
  authorPhoto: string;
  authorEmail: string;
  isVerified: boolean;
  content: string;
  timestamp: number;
  likesCount: number;
  commentsCount: number;
  stockCode?: string;
  stockTitle?: string;
  stockCategory?: string;
  hasAiSummary?: boolean;
  aiSummaryTitle?: string;
  aiSummaryText?: string;
  aiSummaryBullets?: string[];
  aiSummaryTakeaway?: string;
  likedByUser?: boolean;
}

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timestamp: number;
  summary: string;
  image: string;
  url: string;
}

interface ResearchReport {
  id: string;
  title: string;
  analyst: string;
  date: string;
  targetPrice: string;
  rating: 'BUY' | 'HOLD' | 'SELL';
  summary: string;
}

export default function StreamScreen({ 
  user, 
  setCurrentScreen 
}: { 
  user: User | null; 
  setCurrentScreen: (s: string) => void;
}) {
  const [activeSubTab, setActiveSubTab] = useState<'stream' | 'berita' | 'riset'>('stream');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePill, setActivePill] = useState('Trending');
  
  // Post state
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [expandedAiSummaries, setExpandedAiSummaries] = useState<Record<string, boolean>>({});

  // News state
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(false);

  // Tip Modal State
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [tipAmount, setTipAmount] = useState('50000');
  const [tipSuccess, setTipSuccess] = useState(false);

  // Comments Section state
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [tempCommentText, setTempCommentText] = useState('');
  const [commentsState, setCommentsState] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    'seed_raja_1': [
      { author: 'InvestasiMaju', text: 'Sangat menarik pembagian dividennya, yield lumayan tinggi!', time: '1 jam yang lalu' },
      { author: 'TraderSantuy', text: 'Simpan untuk modal tambahan beli lagi pas Cum Date.', time: '35 menit yang lalu' }
    ]
  });

  // Check user authorization to post
  const isAuthorizedToPost = user?.email === 'dewanggamiliarder@gmail.com';

  // Seed default posts if none exist
  const getSeededPosts = (): Post[] => [
    {
      id: 'seed_raja_1',
      authorName: 'StockbitReports',
      authorPhoto: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60',
      authorEmail: 'reports@stockbit.com',
      isVerified: true,
      content: 'Keterbukaan informasi terkait pembagian dividen Rukun Raharja (RAJA). Silakan tinjau ringkasan AI untuk rincian cepat jadwal akumulasi dividen.',
      timestamp: 1782431700000, // 25 Jun 26, 23:55 UTC
      likesCount: 5,
      commentsCount: 2,
      stockCode: 'RAJA',
      stockCategory: 'Others',
      stockTitle: 'Keterbukaan Informasi terkait Aksi Korporasi - Dividen Tunai - 25062026 [RAJA]',
      hasAiSummary: true,
      aiSummaryTitle: 'Pengumuman Jadwal Dividen Tunai',
      aiSummaryText: 'RAJA (Rukun Raharja) akan membagikan dividen tunai Rp40 per saham dengan total nilai Rp168,49 miliar untuk tahun buku 2025.',
      aiSummaryBullets: [
        'Total dividen tunai yang dibagikan sebesar Rp168,49 miliar.',
        'Nilai dividen ditetapkan Rp40 per lembar saham.',
        'Tanggal cum dividen di pasar reguler jatuh pada 1 Juli 2026.',
        'Pencatatan pemegang saham yang berhak (recording date) pada 3 Juli 2026.'
      ],
      aiSummaryTakeaway: 'Pembagian dividen tunai rutin berdasarkan hasil RUPS, tanpa perubahan struktur material pada perusahaan.'
    },
    {
      id: 'seed_teddyed_1',
      authorName: 'teddyed',
      authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
      authorEmail: 'teddyed@investor.com',
      isVerified: false,
      content: 'Sekarang kita bicara Saham US.\n\nMasih Ingat tulisan saya di foto terlampir biar Ingat Kalian.',
      timestamp: 1782421380000, // 25 Jun 26, 21:03 UTC
      likesCount: 12,
      commentsCount: 4
    }
  ];

  // Fetch / stream posts from firestore
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: Post[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as Post);
        });
        const uniquePosts = Array.from(new Map(list.map(p => [p.id, p])).values());
        setPosts(uniquePosts);
        setIsPostsLoading(false);
    }, (error) => {
      console.warn("Firestore offline or permission denied for live snapshots, using local fallbacks:", error);
      setPosts(getSeededPosts());
      setIsPostsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch news when "berita" tab is active
  useEffect(() => {
    if (activeSubTab === 'berita') {
      fetchNews();
    }
  }, [activeSubTab]);

  const fetchNews = async () => {
    setIsNewsLoading(true);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        setNews(data);
      } else {
        throw new Error("Failed to fetch news from server");
      }
    } catch (e) {
      console.error("News fetch failed:", e);
    } finally {
      setIsNewsLoading(false);
    }
  };

  // 5 High Quality Research Reports for Riset Tab (Badge 5)
  const researchReports: ResearchReport[] = [
    {
      id: 'res_1',
      title: 'RAJA: Prospek Ekspansi Infrastruktur Gas & Hasil Dividen Stabil',
      analyst: 'Ahmad Faisal, CFA',
      date: '25 Jun 2026',
      targetPrice: 'Rp 1,650',
      rating: 'BUY',
      summary: 'Rukun Raharja menunjukkan kinerja neraca yang solid dengan EBITDA stabil. Target pembagian dividen Rp40 per lembar saham menawarkan dividend yield menarik di kisaran 4.2%.'
    },
    {
      id: 'res_2',
      title: 'Arah Kebijakan Moneter Global & Dampaknya ke Pasar Crypto',
      analyst: 'Devi Natalia, Macro Strategist',
      date: '24 Jun 2026',
      targetPrice: 'N/A',
      rating: 'HOLD',
      summary: 'Analisis dampak bertahannya suku bunga acuan Federal Reserve terhadap likuiditas pasar modal global, dengan proyeksi akumulasi Bitcoin dan Ethereum jangka panjang.'
    },
    {
      id: 'res_3',
      title: 'BTCUSDT: Potensi Breakout Menuju ATH Baru Di Kuartal III',
      analyst: 'Rian Wijaya, CMT',
      date: '23 Jun 2026',
      targetPrice: '$110,000',
      rating: 'BUY',
      summary: 'Analisis teknikal harian Bitcoin menunjukkan formasi bullish flag yang kuat di atas support dinamis EMA 50. Rekomendasi beli bertahap.'
    },
    {
      id: 'res_4',
      title: 'Solana (SOL): Menguji Dominasi Kecepatan Transaksi DeFi',
      analyst: 'Michael Chen, Blockchain Analyst',
      date: '21 Jun 2026',
      targetPrice: '$210',
      rating: 'BUY',
      summary: 'Volume perdagangan DEX di jaringan Solana meningkat signifikan melampaui rantai lainnya. Potensi pertumbuhan ekosistem koin meme dan dApps tetap tinggi.'
    },
    {
      id: 'res_5',
      title: 'Analisis Sektor Komoditas Energi & Saham Berbasis ESG',
      analyst: 'Putri Amalia, Senior Analyst',
      date: '18 Jun 2026',
      targetPrice: 'N/A',
      rating: 'HOLD',
      summary: 'Transisi energi bersih dan regulasi pajak karbon terbaru akan memengaruhi profitabilitas emiten batu bara konvensional. Rekomendasi diversifikasi ke emiten ramah lingkungan.'
    }
  ];

  // Handle post creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    if (!isAuthorizedToPost) {
      setPostError("Hanya akun resmi Dewangga Miliarder yang memiliki akses untuk memublikasikan analisa di Stream ini.");
      return;
    }

    setIsSubmittingPost(true);
    setPostError(null);

    const postData = {
      authorName: user?.displayName || 'Dewangga Miliarder',
      authorPhoto: user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
      authorEmail: user?.email || 'dewanggamiliarder@gmail.com',
      isVerified: true, // Special authenticated account is verified!
      content: newPostContent,
      timestamp: Date.now(),
      likesCount: 0,
      commentsCount: 0,
      hasAiSummary: false
    };

    try {
      await addDoc(collection(db, 'posts'), postData);
      setNewPostContent('');
    } catch (err) {
      console.error("Error writing post to Firestore:", err);
      setPostError("Gagal memublikasikan postingan. Silakan coba kembali.");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Handle like toggle
  const handleLikePost = async (postId: string, currentLikes: number) => {
    if (!user) {
      alert("Silakan masuk terlebih dahulu untuk menyukai postingan.");
      return;
    }

    const isAlreadyLiked = likedPosts[postId];
    const updatedLiked = { ...likedPosts, [postId]: !isAlreadyLiked };
    setLikedPosts(updatedLiked);

    const newLikesCount = isAlreadyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;

    try {
      const postDocRef = doc(db, 'posts', postId);
      await updateDoc(postDocRef, {
        likesCount: newLikesCount
      });
    } catch (e) {
      // Fallback update in state if firebase update fails (e.g., local mock posts)
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: newLikesCount } : p));
    }
  };

  // Toggle AI Summary collapse
  const toggleAiSummary = (postId: string) => {
    setExpandedAiSummaries(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Open Tip modal
  const openTipModalHandler = (authorName: string) => {
    setSelectedAuthor(authorName);
    setTipSuccess(false);
    setShowTipModal(true);
  };

  // Submit Tip
  const handleSubmitTip = () => {
    setTipSuccess(true);
    setTimeout(() => {
      setShowTipModal(false);
      setTipSuccess(false);
    }, 2000);
  };

  // Toggle Comment section
  const handleToggleComments = (postId: string) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
    } else {
      setActiveCommentPostId(postId);
    }
  };

  // Submit comment
  const handleAddComment = (postId: string) => {
    if (!tempCommentText.trim()) return;
    const authorName = user?.displayName || user?.email?.split('@')[0] || 'Tamu';
    
    const newComment = {
      author: authorName,
      text: tempCommentText,
      time: 'Baru saja'
    };

    setCommentsState(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    // Update comment count on post
    const currentPost = posts.find(p => p.id === postId);
    if (currentPost) {
      const nextCommentsCount = (currentPost.commentsCount || 0) + 1;
      const postDocRef = doc(db, 'posts', postId);
      updateDoc(postDocRef, { commentsCount: nextCommentsCount })
        .catch(() => {
          setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: nextCommentsCount } : p));
        });
    }

    setTempCommentText('');
  };

  // Format UNIX timestamp to readable indonesian date format
  const formatPostTime = (timestamp: any) => {
    if (!timestamp) return 'Baru saja';
    let date: Date;
    if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (timestamp && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (timestamp && timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) {
      return 'Baru saja';
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = date.getDate();
    const m = months[date.getMonth()] || 'Jan';
    const y = String(date.getFullYear()).substring(2);
    const hr = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${d} ${m} ${y}, ${hr}:${min}`;
  };

  // Copy share link
  const handleSharePost = (postId: string) => {
    const dummyUrl = `${window.location.origin}/stream/post/${postId}`;
    if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(dummyUrl).then(() => {
        console.log("Copied to clipboard:", dummyUrl);
      }).catch((err) => {
        console.warn("Failed to write to clipboard:", err);
      });
    } else {
      console.log("Clipboard API not available in this environment. Link:", dummyUrl);
    }
  };

  // Filtering list based on search and active pill
  const filteredPosts = (posts || []).filter(post => {
    if (!post) return false;
    const content = post.content || '';
    const authorName = post.authorName || '';
    const stockCode = post.stockCode || '';
    const isVerified = !!post.isVerified;
    const hasAiSummary = !!post.hasAiSummary;

    const matchesSearch = 
      content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stockCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter by pills
    if (activePill === 'Trending') return true; // Show all on trending for mock
    if (activePill === 'Followed') return isVerified; // Filter verified as "Followed" mock
    if (activePill === 'Watchlist') return !!post.stockCode; // Filter stock code posts
    if (activePill === 'Laporan') return hasAiSummary; // Filter reports with AI Summaries
    
    return true;
  });

  return (
    <div className="w-full h-full bg-[#f8f9fa] flex flex-col overflow-hidden relative">
      
      {/* 1. Header & Top Tab Navigation */}
      <div className="bg-white border-b border-gray-100 shrink-0 shadow-sm z-30">
        
        {/* Status Bar Replica Removed */}

        {/* Brand App Bar */}
        <div className="flex justify-between items-center px-4 py-2">
          {/* Left Avatar profile click to profile page */}
          <div 
            onClick={() => setCurrentScreen('profile')}
            className="w-8 h-8 rounded-full border border-gray-100 overflow-hidden cursor-pointer hover:opacity-85 transition-opacity">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-[#a0c4ff] flex items-center justify-center text-white font-bold text-[13px]">
                {user?.displayName ? user.displayName[0] : 'U'}
              </div>
            )}
          </div>

          {/* Center Stockbit Brand Logo */}
          <div className="flex items-center gap-1">
            <span className="text-[20px] font-black tracking-tight text-[#2b3139]">Stockbit</span>
            {/* Visual Mini Chart Line Icon */}
            <div className="flex items-end gap-[2px] h-3 ml-[2px]">
              <div className="w-[3px] h-[60%] bg-[#00a85a] rounded-sm"></div>
              <div className="w-[3px] h-[100%] bg-[#f5a623] rounded-sm"></div>
              <div className="w-[3px] h-[80%] bg-[#00a85a] rounded-sm"></div>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3.5">
            {/* Write icon */}
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-[21px] h-[21px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
            {/* Notifications Bell with 56 active badge */}
            <div className="relative cursor-pointer">
              <svg className="w-[22px] h-[22px] text-gray-600 hover:text-gray-900 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <div className="absolute -top-1.5 -right-1.5 bg-[#da304a] text-white text-[8px] font-black rounded-full px-1.5 py-0.5 min-w-[17px] text-center border border-white">
                56
              </div>
            </div>
          </div>
        </div>

        {/* Tab Row: STREAM, BERITA, RISET */}
        <div className="flex border-t border-gray-50 text-[13px] font-extrabold text-gray-500">
          <button 
            onClick={() => setActiveSubTab('stream')}
            className={`flex-1 text-center py-3 relative transition-all ${
              activeSubTab === 'stream' 
                ? 'text-[#00a85a]' 
                : 'hover:text-gray-700'
            }`}>
            <span>STREAM</span>
            {activeSubTab === 'stream' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00a85a] rounded-t-full"></div>
            )}
          </button>
          
          <button 
            onClick={() => setActiveSubTab('berita')}
            className={`flex-1 text-center py-3 relative transition-all ${
              activeSubTab === 'berita' 
                ? 'text-[#00a85a]' 
                : 'hover:text-gray-700'
            }`}>
            <span>BERITA</span>
            {activeSubTab === 'berita' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00a85a] rounded-t-full"></div>
            )}
          </button>

          <button 
            onClick={() => setActiveSubTab('riset')}
            className={`flex-1 py-3 flex items-center justify-center gap-1 relative transition-all ${
              activeSubTab === 'riset' 
                ? 'text-[#00a85a]' 
                : 'hover:text-gray-700'
            }`}>
            <span>RISET</span>
            <span className="bg-[#00a85a] text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center leading-none">
              5
            </span>
            {activeSubTab === 'riset' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00a85a] rounded-t-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* 2. Filter Controls Box */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex flex-col gap-3 shrink-0 z-20 shadow-sm">
        {/* Search input bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Cari Stream"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-[13px] border border-gray-200/60 rounded-xl focus:outline-none focus:border-[#00a85a]/40 focus:bg-white transition-all text-gray-800"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Horizontal scroll pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
          {['Trending', 'Followed', 'All', 'People', 'Watchlist', 'Laporan'].map((pill) => (
            <button
              key={pill}
              onClick={() => setActivePill(pill)}
              className={`text-[12px] font-bold px-4 py-1.5 rounded-full shrink-0 border transition-all ${
                activePill === pill
                  ? 'bg-[#00a85a] text-white border-[#00a85a] shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200/80 hover:bg-gray-50'
              }`}>
              {pill}
            </button>
          ))}
          <div className="flex-1"></div>
          {/* Adjustments Filter Button */}
          <button className="p-2 border border-gray-200/80 rounded-full bg-white hover:bg-gray-50 text-gray-500 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Main Dynamic Panels content */}
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide px-3 pt-3">
        
        {/* ================= PANEL A: STREAM FEED ================= */}
        {activeSubTab === 'stream' && (
          <div className="flex flex-col gap-3.5">
            
            {/* Login Status & Input posting box */}
            <div className="bg-white border border-gray-200/70 rounded-2xl p-4 shadow-sm">
              {isAuthorizedToPost ? (
                // Authorized post creator box
                <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <img 
                      src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'} 
                      alt="Dewangga" 
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[#00a85a]/10" 
                    />
                    <textarea
                      placeholder="Apa yang sedang Anda pikirkan?"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="flex-1 border-0 resize-none text-[13px] text-gray-800 placeholder-gray-400 focus:ring-0 focus:outline-none pt-1"
                      rows={2}
                    />
                  </div>
                  
                  {postError && (
                    <div className="text-[11px] font-semibold text-[#da304a] bg-[#fdf2f4] p-2 rounded-lg border border-red-100">
                      ⚠️ {postError}
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-1">
                    <span className="text-[11px] text-[#00a85a] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Postingan Publik Resmi</span>
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmittingPost || !newPostContent.trim()}
                      className="bg-[#00a85a] hover:opacity-90 disabled:opacity-40 text-white font-bold text-[12px] px-4.5 py-1.8 rounded-lg flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-all">
                      {isSubmittingPost ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Post</span>
                          <Send className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                // LOCKED NOTICE for unauthorized accounts
                <div className="flex flex-col items-center justify-center py-4 px-2 text-center">
                  <div className="w-10 h-10 bg-[#eefcf3] rounded-full flex items-center justify-center mb-2.5">
                    <Lock className="w-5 h-5 text-[#00a85a]" strokeWidth={2.5} />
                  </div>
                  <span className="text-[13px] font-extrabold text-gray-800 mb-1">Mode Analisis Terkunci</span>
                  <p className="text-[11.5px] text-gray-500 max-w-xs leading-relaxed">
                    Hanya akun resmi <span className="text-[#00a85a] font-bold">Dewangga Miliarder</span> yang memiliki akses untuk memublikasikan analisa di Stream ini.
                  </p>
                  
                  {/* Info helper */}
                  {user && (
                    <div className="mt-3.5 px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] text-gray-400 border border-gray-100">
                      Masuk sebagai: {user.email}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* List of stream cards */}
            {isPostsLoading ? (
               <div className="bg-white border border-gray-200/60 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                 <div className="w-8 h-8 border-3 border-[#00a85a] border-t-transparent rounded-full animate-spin mb-2"></div>
                 <span className="text-[13px] font-bold text-gray-700">Memuat Stream...</span>
               </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-white border border-gray-200/60 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                <Search className="w-8 h-8 text-gray-300 mb-2" />
                <span className="text-[13px] font-bold text-gray-700">Analisa tidak ditemukan</span>
                <span className="text-[11px] text-gray-400 mt-0.5">Coba gunakan kata kunci pencarian yang lain</span>
              </div>
            ) : (
              filteredPosts.map((post, index) => {
                if (!post || !post.id) return null;
                const isAiSummaryOpen = expandedAiSummaries[post.id] ?? true; 
                const isLiked = likedPosts[post.id];
                const activeComments = commentsState[post.id] || [];
                const isCommentOpen = activeCommentPostId === post.id;

                return (
                  <div key={`post-${post.id}-${post.timestamp}-${index}`} className="bg-white border border-gray-200/70 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    
                    {/* Header: Photo, Name, Verified Badge, Time, Menu */}
                    <div className="p-4 flex items-center justify-between pb-3">
                      <div className="flex items-center gap-3">
                        {/* Profile Photo */}
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-50">
                          <img 
                            src={post.authorPhoto} 
                            alt={post.authorName} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60';
                            }}
                          />
                        </div>
                        {/* Author name and post time */}
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="text-[13px] font-extrabold text-gray-900 leading-tight hover:underline cursor-pointer">
                              {post.authorName}
                            </span>
                            {post.isVerified && <VerifiedBadge />}
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                            {formatPostTime(post.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* More Horizontal Button */}
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stock announcement banner (e.g. RAJA info box) */}
                    {post.stockCode && (
                      <div className="mx-4 mb-3 border border-gray-200/75 rounded-xl flex overflow-hidden bg-white shadow-sm hover:border-gray-300 cursor-pointer transition-all">
                        {/* Left Code badge */}
                        <div className="w-20 bg-gray-50 flex flex-col items-center justify-center p-3 border-r border-gray-200/75 shrink-0">
                          <span className="font-black text-[13.5px] text-gray-900 tracking-tight">{post.stockCode}</span>
                        </div>
                        {/* Right Content details */}
                        <div className="p-3 flex flex-col justify-center min-w-0">
                          <span className="text-[11px] font-bold text-gray-800 leading-normal line-clamp-2">
                            {post.stockTitle}
                          </span>
                          <span className="text-[9.5px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
                            {post.stockCategory || 'Others'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Main post text content */}
                    <div className="px-4 pb-3.5 text-[12.5px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </div>

                    {/* ================= AI SUMMARY DROPDOWN CARD ================= */}
                    {post.hasAiSummary && (
                      <div className="mx-4 mb-4 border border-[#00a85a]/25 rounded-2xl overflow-hidden shadow-sm bg-[#fafdfb]">
                        
                        {/* Summary Header */}
                        <div 
                          onClick={() => toggleAiSummary(post.id)}
                          className="flex items-center justify-between px-3.5 py-2.5 bg-[#edfdf4]/70 border-b border-[#00a85a]/15 cursor-pointer hover:bg-[#edfdf4] transition-all">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11.5px] font-extrabold text-[#00a85a]">AI Summary</span>
                            <span className="bg-[#00a85a] text-white text-[9px] font-black px-1.8 py-0.5 rounded-md leading-none tracking-wide">
                              Beta
                            </span>
                          </div>
                          {isAiSummaryOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#00a85a]" strokeWidth={2.5} />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#00a85a]" strokeWidth={2.5} />
                          )}
                        </div>

                        {/* Collapsible content */}
                        {isAiSummaryOpen && (
                          <div className="p-4 flex flex-col gap-3.5">
                            {/* Summary Title & intro */}
                            <div className="flex flex-col gap-1.5">
                              <h4 className="text-[13px] font-extrabold text-gray-900">
                                {post.aiSummaryTitle}
                              </h4>
                              <p className="text-[11.5px] text-gray-600 leading-relaxed">
                                {post.aiSummaryText}
                              </p>
                            </div>

                            {/* Bullets List */}
                            {post.aiSummaryBullets && (
                              <div className="flex flex-col gap-2">
                                {post.aiSummaryBullets.map((bullet, idx) => (
                                  <div key={`summary-${post.id}-${idx}`} className="flex gap-2.5 items-start">
                                    {/* Circular Outlined Number Pill */}
                                    <div className="w-[18px] h-[18px] rounded-md border border-[#00a85a]/30 flex items-center justify-center shrink-0 bg-white text-[#00a85a] text-[9.5px] font-extrabold">
                                      0{idx + 1}
                                    </div>
                                    <p className="text-[11px] text-gray-600 leading-relaxed pt-0.5">
                                      {bullet}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Key Takeaway box */}
                            {post.aiSummaryTakeaway && (
                              <div className="bg-[#f0f9f4] border-l-4 border-[#00a85a] p-3 rounded-r-xl flex flex-col gap-0.5">
                                <span className="text-[9.5px] font-black text-[#00a85a] tracking-wider uppercase">
                                  KEY TAKEAWAY
                                </span>
                                <p className="text-[11px] text-[#2c533e] font-semibold leading-relaxed">
                                  {post.aiSummaryTakeaway}
                                </p>
                              </div>
                            )}

                            {/* AI Generated footer warning */}
                            <div className="flex items-center gap-1 text-[9.5px] text-gray-400/80 font-medium pt-1 border-t border-gray-100">
                              <Sparkles className="w-3 h-3 text-[#00a85a]" />
                              <span>AI-generated content. Verify with the source document.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interaction counts (e.g. Likes, Comments) */}
                    <div className="px-4 py-2 flex items-center justify-between text-[11px] text-gray-400 font-bold border-t border-gray-50/50">
                      <span>{post.likesCount} menyukai</span>
                      <span 
                        onClick={() => handleToggleComments(post.id)}
                        className="cursor-pointer hover:underline text-[#00a85a]">
                        {activeComments.length || post.commentsCount || 0} komentar
                      </span>
                    </div>

                    {/* Bottom Action Bar: Like, Share, Tip, Comment */}
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-gray-500 shrink-0 bg-gray-50/20">
                      {/* Like button */}
                      <button 
                        onClick={() => handleLikePost(post.id, post.likesCount)}
                        className={`flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-gray-100/70 transition-colors ${
                          isLiked ? 'text-[#00a85a] font-bold bg-[#edfdf4]' : ''
                        }`}>
                        <ThumbsUp className={`w-[17px] h-[17px] ${isLiked ? 'fill-[#00a85a]' : ''}`} strokeWidth={1.8} />
                      </button>

                      {/* Share button */}
                      <button 
                        onClick={() => handleSharePost(post.id)}
                        className="flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-gray-100/70 transition-colors"
                        title="Bagikan Tautan">
                        <Share2 className="w-[17px] h-[17px]" strokeWidth={1.8} />
                      </button>

                      {/* Tip Dollar button */}
                      <button 
                        onClick={() => openTipModalHandler(post.authorName)}
                        className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-[#f1fcf5] text-[#00a85a] hover:bg-[#e3f7eb] transition-all font-bold text-[11.5px] border border-[#00a85a]/10"
                        title="Kirim Tip">
                        <DollarSign className="w-3.5 h-3.5" strokeWidth={2.5} />
                        <span>Tip</span>
                      </button>

                      {/* Comment speech icon */}
                      <button 
                        onClick={() => handleToggleComments(post.id)}
                        className={`flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-gray-100/70 transition-colors ${
                          isCommentOpen ? 'text-[#00a85a] bg-[#edfdf4]' : ''
                        }`}>
                        <MessageSquare className="w-[17px] h-[17px]" strokeWidth={1.8} />
                      </button>
                    </div>

                    {/* Comments drawer container */}
                    {isCommentOpen && (
                      <div className="bg-gray-50/70 border-t border-gray-100 p-4 flex flex-col gap-3">
                        <h5 className="text-[11.5px] font-extrabold text-gray-700 uppercase tracking-wider">Komentar</h5>
                        
                        {/* List of comments */}
                        <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto scrollbar-hide pr-1">
                          {activeComments.length === 0 ? (
                            <span className="text-[11px] text-gray-400 italic">Belum ada komentar. Jadilah yang pertama berkomentar!</span>
                          ) : (
                            activeComments.map((c, idx) => (
                              <div key={`comment-${post.id}-${idx}`} className="bg-white p-2.5 rounded-xl border border-gray-200/50 flex flex-col gap-0.5">
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-bold text-gray-900">{c.author}</span>
                                  <span className="text-[9px] text-gray-400">{c.time}</span>
                                </div>
                                <p className="text-[11px] text-gray-600 leading-relaxed">{c.text}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Send comment text field */}
                        <div className="flex gap-2 items-center mt-1 pt-2 border-t border-gray-200/30">
                          <input 
                            type="text" 
                            placeholder="Tulis komentar..."
                            value={tempCommentText}
                            onChange={(e) => setTempCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.8 text-[11px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00a85a]"
                          />
                          <button 
                            onClick={() => handleAddComment(post.id)}
                            disabled={!tempCommentText.trim()}
                            className="bg-[#00a85a] disabled:opacity-40 text-white rounded-lg p-1.8 hover:opacity-90">
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}

          </div>
        )}

        {/* ================= PANEL B: BERITA REAL-TIME ================= */}
        {activeSubTab === 'berita' && (
          <div className="flex flex-col gap-3.5">
            {isNewsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-[#00a85a] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[12px] text-gray-400 font-medium">Memuat berita terkini...</span>
              </div>
            ) : news.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
                <BookOpen className="w-10 h-10 text-gray-300 mb-2.5" />
                <span className="text-[13px] font-bold text-gray-700">Tidak ada berita saat ini</span>
                <button onClick={fetchNews} className="mt-3 bg-[#00a85a] text-white font-bold text-[12px] px-4 py-1.5 rounded-lg">
                  Coba Muat Ulang
                </button>
              </div>
            ) : (
              (news || []).map((item, index) => {
                if (!item) return null;
                const itemUrl = item.url || '#';
                const itemImage = item.image || 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300&auto=format&fit=crop&q=80';
                const itemTitle = item.title || 'Informasi Saham';
                const itemSource = item.source || 'Berita';
                const itemSummary = item.summary || '';

                return (
                  <a 
                    key={`news-${itemUrl}-${index}`}
                    href={itemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-gray-200/70 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col sm:flex-row gap-3.5">
                    
                    {/* News Image - Journalistic real images constraint */}
                    <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <img 
                        src={itemImage} 
                        alt={itemTitle} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Safe clean generic photo fallback
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    {/* News Text Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex flex-col gap-1.5">
                        {/* Source badge and Relative time */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-[#00a85a] uppercase tracking-wider bg-[#00a85a]/10 px-1.8 py-0.5 rounded-md">
                            {itemSource}
                          </span>
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          <span className="text-[10px] text-gray-400 font-semibold">
                            {(() => {
                              const ts = typeof item.timestamp === 'number' ? item.timestamp : Number(item.timestamp) || Date.now();
                              const diffMs = Date.now() - ts;
                              const diffMins = Math.floor(diffMs / 60000);
                              const diffHours = Math.floor(diffMins / 60);
                              if (isNaN(diffMs) || diffMins < 1) return 'Baru saja';
                              if (diffMins < 60) return `${diffMins} menit lalu`;
                              if (diffHours < 24) return `${diffHours} jam lalu`;
                              const date = new Date(ts);
                              return isNaN(date.getTime()) ? 'Baru saja' : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                            })()}
                          </span>
                        </div>

                        {/* Main bold title */}
                        <h4 className="text-[13px] font-extrabold text-gray-900 leading-snug line-clamp-2 hover:text-[#00a85a] transition-colors">
                          {itemTitle}
                        </h4>

                        {/* News Summary body snippet */}
                        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                          {itemSummary}
                        </p>
                      </div>

                      {/* External Link button indicator */}
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#00a85a] mt-2.5 pt-2 border-t border-gray-50">
                        <span>Baca artikel penuh</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    </div>

                  </a>
                );
              })
            )}
          </div>
        )}

        {/* ================= PANEL C: RISET REPORT ================= */}
        {activeSubTab === 'riset' && (
          <div className="flex flex-col gap-3.5">
            <div className="p-3.5 bg-green-50/70 border border-[#00a85a]/20 rounded-2xl flex gap-3 mb-1">
              <span className="text-[#00a85a] text-lg mt-0.5 font-bold">💡</span>
              <p className="text-[11.5px] text-[#2c533e] leading-relaxed font-bold">
                Membaca riset ahli membantu mematangkan strategi investasi Anda. Tersedia <span className="text-[#00a85a]">5 Analisis Premium</span> rilis minggu ini:
              </p>
            </div>

            {researchReports.map((report, index) => (
              <div 
                key={`research-${report.id}-${index}`} 
                className="bg-white border border-gray-200/70 rounded-2xl p-4 shadow-sm flex flex-col gap-3.5">
                
                {/* Analyst Header info */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-gray-400">{report.date} • Oleh {report.analyst}</span>
                    <h4 className="text-[13.5px] font-black text-gray-900 leading-snug mt-0.5">{report.title}</h4>
                  </div>
                  
                  {/* BUY / HOLD badges */}
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${
                    report.rating === 'BUY' 
                      ? 'bg-[#00a85a]/10 text-[#00a85a]' 
                      : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {report.rating}
                  </span>
                </div>

                {/* target prices if available */}
                {report.targetPrice !== 'N/A' && (
                  <div className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-xl border border-gray-100 w-fit">
                    <span className="text-[10.5px] text-gray-500 font-bold">Target Harga:</span>
                    <span className="text-[11.5px] font-black text-[#00a85a]">{report.targetPrice}</span>
                  </div>
                )}

                {/* Brief analysis summary text */}
                <p className="text-[11.5px] text-gray-600 leading-relaxed bg-gray-50/30 p-2.5 rounded-xl border border-gray-100">
                  {report.summary}
                </p>

                {/* Dowload / PDF document actions link */}
                <button 
                  onClick={() => alert(`Sedang mendownload PDF Laporan Riset: ${report.title}`)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-bold text-[11.5px] shadow-sm transition-all active:scale-[0.98]">
                  <FileText className="w-3.5 h-3.5 text-red-500" />
                  <span>Unduh Laporan Riset Lengkap (PDF)</span>
                </button>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* 4. Tip Donation Modal Container */}
      {showTipModal && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-2xl relative flex flex-col gap-4 animate-fade-in border border-gray-100">
            {/* Close */}
            <button 
              onClick={() => setShowTipModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 bg-gray-100 rounded-full">
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-11 h-11 bg-[#edfdf4] rounded-full flex items-center justify-center text-[#00a85a] mb-2.5">
                <DollarSign className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-[14px] font-black text-gray-900">Kirim Tip Dukungan</h3>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                Berikan apresiasi finansial kepada analis favorit Anda <span className="text-gray-700 font-bold">@{selectedAuthor}</span>.
              </p>
            </div>

            {tipSuccess ? (
              <div className="bg-[#eefcf3] border border-[#c2f2d4] p-4 rounded-xl flex flex-col items-center text-center gap-1 my-2">
                <span className="text-[#00a85a] text-xl">🎉</span>
                <span className="text-[11.5px] font-black text-[#00a85a]">Tip Berhasil Dikirim!</span>
                <span className="text-[10px] text-gray-500 leading-none">Terima kasih atas kontribusi Anda.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Input Amount select buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {['10000', '50000', '100000'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setTipAmount(val)}
                      className={`py-1.8 text-[11px] font-black rounded-lg border transition-all ${
                        tipAmount === val
                          ? 'bg-[#00a85a] border-[#00a85a] text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}>
                      Rp {parseInt(val).toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>

                {/* Custom Amount form */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Jumlah Kustom (Rp)</label>
                  <input 
                    type="number" 
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    placeholder="Masukkan nilai"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-800 focus:outline-none focus:border-[#00a85a] font-bold"
                  />
                </div>

                <button 
                  onClick={handleSubmitTip}
                  disabled={!tipAmount || parseInt(tipAmount) <= 0}
                  className="w-full bg-[#00a85a] text-white font-bold py-2.5 rounded-xl text-[12.5px] mt-2 shadow-sm transition-all hover:opacity-90 active:scale-[0.98]">
                  Kirim Rp {parseInt(tipAmount || '0').toLocaleString('id-ID')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Custom Bottom Nav Bar */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-between items-center px-6 pt-3 pb-7 z-40 shadow-lg">
        <button onClick={() => setCurrentScreen('dashboard')} className="flex flex-col items-center gap-[5px]">
          <svg className="w-[26px] h-[26px] text-[#9ba4b5] hover:text-gray-700 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="text-[11px] font-medium text-[#9ba4b5]">Watchlist</span>
        </button>
        <button onClick={() => setActiveSubTab('stream')} className="flex flex-col items-center gap-[5px]">
          <svg className="w-[26px] h-[26px] text-[#00a85a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="3.5" ry="3.5" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="16" y2="14" />
          </svg>
          <span className="text-[11px] font-bold text-[#00a85a]">Stream</span>
        </button>
        <button onClick={() => setCurrentScreen('search')} className="flex flex-col items-center gap-[5px]">
          <svg className="w-[26px] h-[26px] text-[#9ba4b5] hover:text-gray-700 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16" y2="16" />
          </svg>
          <span className="text-[11px] font-medium text-[#9ba4b5]">Search</span>
        </button>
        <button onClick={() => alert("Fitur Chat segera hadir!")} className="flex flex-col items-center gap-[5px]">
          <svg className="w-[26px] h-[26px] text-[#9ba4b5] hover:text-gray-700 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-[11px] font-medium text-[#9ba4b5]">Chat</span>
        </button>
        <button onClick={() => setCurrentScreen('portfolio')} className="flex flex-col items-center gap-[5px]">
          <svg className="w-[26px] h-[26px] text-[#9ba4b5] hover:text-gray-700 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v9h9" />
          </svg>
          <span className="text-[11px] font-medium text-[#9ba4b5]">Portfolio</span>
        </button>
      </div>

      {/* Home Indicator line bar */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-[4px] bg-gray-300 rounded-full z-45"></div>

    </div>
  );
}

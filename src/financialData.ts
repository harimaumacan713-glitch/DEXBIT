export interface FinancialReport {
  headers: string[];
  rows: Record<string, string[]>;
}

export interface AssetFinancials {
  Annual: FinancialReport;
  Quarterly: FinancialReport;
}

export const financialDataMap: Record<string, AssetFinancials> = {
  TPIA: {
    Annual: {
      headers: ['12M 2025', '12M 2024', '12M 2023', '12M 2022'],
      rows: {
        'Pendapatan': ['115,672 B', '28,298 B', '32,948 B', '35,473 B'],
        'Beban Pokok Penjualan': ['(116,372 B)', '(25,807 B)', '(31,700 B)', '(35,636 B)'],
        'Laba Kotor': ['(700 B)', '2,491 B', '1,248 B', '(163 B)'],
        'Beban Usaha': ['(5,714 B)', '(1,568 B)', '(1,673 B)', '(1,566 B)'],
        'Beban Penjualan': ['(2,285 B)', '(627 B)', '(669 B)', '(626 B)'],
        'Beban Umum & Administrasi': ['(3,429 B)', '(941 B)', '(1,004 B)', '(940 B)'],
        'Laba Usaha': ['(6,413 B)', '923 B', '(425 B)', '(1,729 B)'],
        'Penghasilan/Beban Lain-Lain': ['27,739 B', '(2,365 B)', '(407 B)', '(896 B)'],
        'Beban Keuangan': ['(3,500 B)', '(2,100 B)', '(1,800 B)', '(1,600 B)'],
        'Pendapatan Keuangan': ['31,239 B', '(265 B)', '1,393 B', '704 B'],
        'Laba Sebelum Pajak': ['21,325 B', '(1,441 B)', '(832 B)', '(2,625 B)'],
        'Beban Pajak Penghasilan': ['2,534 B', '546 B', '351 B', '403 B'],
        'Laba Bersih Dari Operasi Yang Dilanjutkan': ['23,859 B', '(896 B)', '(481 B)', '(2,222 B)'],
        'Pos Luar Biasa': ['-', '-', '-', '-'],
        'Laba Bersih Yang Dapat Diatribusikan Kepada': ['23,859 B', '(896 B)', '(481 B)', '(2,222 B)'],
        'Pemilik Entitas Induk': ['17,962 B', '(1,087 B)', '(512 B)', '(2,225 B)'],
        'Others': ['5,897 B', '192 B', '31 B', '3 B']
      }
    },
    Quarterly: {
      headers: ['3M 2026', '12M 2025', '9M 2025', '6M 2025'],
      rows: {
        'Pendapatan': ['29,150 B', '115,672 B', '86,750 B', '58,400 B'],
        'Beban Pokok Penjualan': ['(28,950 B)', '(116,372 B)', '(87,100 B)', '(58,900 B)'],
        'Laba Kotor': ['200 B', '(700 B)', '(350 B)', '(500 B)'],
        'Beban Usaha': ['(1,400 B)', '(5,714 B)', '(4,285 B)', '(2,850 B)'],
        'Beban Penjualan': ['(560 B)', '(2,285 B)', '(1,714 B)', '(1,140 B)'],
        'Beban Umum & Administrasi': ['(840 B)', '(3,429 B)', '(2,571 B)', '(1,710 B)'],
        'Laba Usaha': ['(1,200 B)', '(6,413 B)', '(4,635 B)', '(3,350 B)'],
        'Penghasilan/Beban Lain-Lain': ['6,900 B', '27,739 B', '20,800 L', '13,900 B'],
        'Beban Keuangan': ['(850 B)', '(3,500 B)', '(2,600 B)', '(1,750 B)'],
        'Pendapatan Keuangan': ['7,750 B', '31,239 B', '23,400 B', '15,650 B'],
        'Laba Sebelum Pajak': ['5,700 B', '21,325 B', '16,165 B', '10,550 B'],
        'Beban Pajak Penghasilan': ['630 B', '2,534 B', '1,900 B', '1,250 B'],
        'Laba Bersih Dari Operasi Yang Dilanjutkan': ['6,330 B', '23,859 B', '18,065 B', '11,800 B'],
        'Pos Luar Biasa': ['-', '-', '-', '-'],
        'Laba Bersih Yang Dapat Diatribusikan Kepada': ['6,330 B', '23,859 B', '18,065 B', '11,800 B'],
        'Pemilik Entitas Induk': ['4,750 B', '17,962 B', '13,500 B', '8,850 B'],
        'Others': ['1,580 B', '5,897 B', '4,565 B', '2,950 B']
      }
    }
  },
  BTC: {
    Annual: {
      headers: ['12M 2025', '12M 2024', '12M 2023', '12M 2022'],
      rows: {
        'Pendapatan': ['18.250 T', '14.890 T', '11.200 T', '9.450 T'],
        'Beban Pokok Penjualan': ['(8.400 T)', '(7.200 T)', '(5.800 T)', '(5.100 T)'],
        'Laba Kotor': ['9.850 T', '7.690 T', '5.400 T', '4.350 T'],
        'Beban Usaha': ['(1.150 T)', '(980 B)', '(850 B)', '(780 B)'],
        'Beban Penjualan': ['(460 B)', '(392 B)', '(340 B)', '(312 B)'],
        'Beban Umum & Administrasi': ['(690 B)', '(588 B)', '(510 B)', '(468 B)'],
        'Laba Usaha': ['8.700 T', '6.710 T', '4.550 T', '3.570 T'],
        'Penghasilan/Beban Lain-Lain': ['450 B', '320 B', '180 B', '(90 B)'],
        'Beban Keuangan': ['(50 B)', '(40 B)', '(30 B)', '(20 B)'],
        'Pendapatan Keuangan': ['500 B', '360 B', '210 B', '(70 B)'],
        'Laba Sebelum Pajak': ['9.150 T', '7.030 T', '4.730 T', '3.480 T'],
        'Beban Pajak Penghasilan': ['-', '-', '-', '-'],
        'Laba Bersih Dari Operasi Yang Dilanjutkan': ['9.150 T', '7.030 T', '4.730 T', '3.480 T'],
        'Pos Luar Biasa': ['-', '-', '-', '-'],
        'Laba Bersih Yang Dapat Diatribusikan Kepada': ['9.150 T', '7.030 T', '4.730 T', '3.480 T'],
        'Pemilik Entitas Induk': ['9.150 T', '7.030 T', '4.730 T', '3.480 T'],
        'Others': ['-', '-', '-', '-']
      }
    },
    Quarterly: {
      headers: ['3M 2026', '12M 2025', '9M 2025', '6M 2025'],
      rows: {
        'Pendapatan': ['4.950 T', '18.250 T', '13.680 T', '9.120 T'],
        'Beban Pokok Penjualan': ['(2.250 T)', '(8.400 T)', '(6.300 T)', '(4.200 T)'],
        'Laba Kotor': ['2.700 T', '9.850 T', '7.380 T', '4.920 T'],
        'Beban Usaha': ['(310 B)', '(1.150 T)', '(860 B)', '(575 B)'],
        'Beban Penjualan': ['(124 B)', '(460 B)', '(344 B)', '(230 B)'],
        'Beban Umum & Administrasi': ['(186 B)', '(690 B)', '(516 B)', '(345 B)'],
        'Laba Usaha': ['2.390 T', '8.700 T', '6.520 T', '4.345 T'],
        'Penghasilan/Beban Lain-Lain': ['120 B', '450 B', '335 B', '225 B'],
        'Beban Keuangan': ['(15 B)', '(50 B)', '(38 B)', '(25 B)'],
        'Pendapatan Keuangan': ['135 B', '500 B', '373 B', '250 B'],
        'Laba Sebelum Pajak': ['2.510 T', '9.150 T', '6.855 T', '4.570 T'],
        'Beban Pajak Penghasilan': ['-', '-', '-', '-'],
        'Laba Bersih Dari Operasi Yang Dilanjutkan': ['2.510 T', '9.150 T', '6.855 T', '4.570 T'],
        'Pos Luar Biasa': ['-', '-', '-', '-'],
        'Laba Bersih Yang Dapat Diatribusikan Kepada': ['2.510 T', '9.150 T', '6.855 T', '4.570 T'],
        'Pemilik Entitas Induk': ['2.510 T', '9.150 T', '6.855 T', '4.570 T'],
        'Others': ['-', '-', '-', '-']
      }
    }
  }
};

export const getFinancialDataForSymbol = (symbol: string): AssetFinancials => {
  const upperSymbol = symbol.toUpperCase();
  if (financialDataMap[upperSymbol]) {
    return financialDataMap[upperSymbol];
  }
  
  // Dynamic generation seed based on symbol characters
  let seed = 0;
  for (let i = 0; i < upperSymbol.length; i++) {
    seed += upperSymbol.charCodeAt(i);
  }
  
  const isCrypto = ['ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX', 'DOT', 'MATIC', 'LINK', 'UNI', 'LTC'].includes(upperSymbol);
  const unit = isCrypto ? 'T' : 'B';
  const baseVal = (seed % 100) + 15; // e.g. 15 to 115
  
  const p25 = baseVal;
  const p24 = p25 * 0.85;
  const p23 = p25 * 0.72;
  const p22 = p25 * 0.65;
  
  const fmt = (v: number) => {
    return `${v.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ${unit}`;
  };
  
  const fmtNeg = (v: number) => {
    return `(${v.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ${unit})`;
  };

  const getAnnualRow = (mult: number, isNegative = false) => {
    const vals = [p25 * mult, p24 * mult, p23 * mult, p22 * mult];
    return vals.map(v => isNegative ? fmtNeg(v) : fmt(v));
  };

  const getQuarterRow = (mult: number, isNegative = false) => {
    const vals = [p25 * 0.28 * mult, p25 * mult, p25 * 0.75 * mult, p25 * 0.50 * mult];
    return vals.map(v => isNegative ? fmtNeg(v) : fmt(v));
  };

  return {
    Annual: {
      headers: ['12M 2025', '12M 2024', '12M 2023', '12M 2022'],
      rows: {
        'Pendapatan': getAnnualRow(1.0),
        'Beban Pokok Penjualan': getAnnualRow(0.72, true),
        'Laba Kotor': getAnnualRow(0.28),
        'Beban Usaha': getAnnualRow(0.12, true),
        'Beban Penjualan': getAnnualRow(0.05, true),
        'Beban Umum & Administrasi': getAnnualRow(0.07, true),
        'Laba Usaha': getAnnualRow(0.16),
        'Penghasilan/Beban Lain-Lain': getAnnualRow(0.02),
        'Beban Keuangan': getAnnualRow(0.03, true),
        'Pendapatan Keuangan': getAnnualRow(0.05),
        'Laba Sebelum Pajak': getAnnualRow(0.18),
        'Beban Pajak Penghasilan': getAnnualRow(0.04, true),
        'Laba Bersih Dari Operasi Yang Dilanjutkan': getAnnualRow(0.14),
        'Pos Luar Biasa': ['-', '-', '-', '-'],
        'Laba Bersih Yang Dapat Diatribusikan Kepada': getAnnualRow(0.14),
        'Pemilik Entitas Induk': getAnnualRow(0.115),
        'Others': getAnnualRow(0.025)
      }
    },
    Quarterly: {
      headers: ['3M 2026', '12M 2025', '9M 2025', '6M 2025'],
      rows: {
        'Pendapatan': getQuarterRow(1.0),
        'Beban Pokok Penjualan': getQuarterRow(0.72, true),
        'Laba Kotor': getQuarterRow(0.28),
        'Beban Usaha': getQuarterRow(0.12, true),
        'Beban Penjualan': getQuarterRow(0.05, true),
        'Beban Umum & Administrasi': getQuarterRow(0.07, true),
        'Laba Usaha': getQuarterRow(0.16),
        'Penghasilan/Beban Lain-Lain': getQuarterRow(0.02),
        'Beban Keuangan': getQuarterRow(0.03, true),
        'Pendapatan Keuangan': getQuarterRow(0.05),
        'Laba Sebelum Pajak': getQuarterRow(0.18),
        'Beban Pajak Penghasilan': getQuarterRow(0.04, true),
        'Laba Bersih Dari Operasi Yang Dilanjutkan': getQuarterRow(0.14),
        'Pos Luar Biasa': ['-', '-', '-', '-'],
        'Laba Bersih Yang Dapat Diatribusikan Kepada': getQuarterRow(0.14),
        'Pemilik Entitas Induk': getQuarterRow(0.115),
        'Others': getQuarterRow(0.025)
      }
    }
  };
};

export const convertToPercentage = (valStr: string, revenueStr: string) => {
  if (valStr === '-' || !valStr) return '-';
  
  // Extract number from valStr
  const parseNum = (s: string) => {
    const cleaned = s.replace(/[()]/g, '').replace(/,/g, '').trim();
    const num = parseFloat(cleaned);
    const isNegative = s.includes('(');
    return isNegative ? -num : num;
  };
  
  const val = parseNum(valStr);
  const rev = parseNum(revenueStr);
  
  if (rev === 0 || isNaN(val) || isNaN(rev)) return '0.00%';
  
  const pct = (val / rev) * 100;
  const isNegative = pct < 0;
  const formatted = Math.abs(pct).toFixed(2) + '%';
  return isNegative ? `(${formatted})` : formatted;
};

// Balance Sheet (Neraca) Templates
export const getBalanceSheetData = (symbol: string, period: 'Annual' | 'Quarterly'): FinancialReport => {
  const upper = symbol.toUpperCase();
  const isCrypto = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX', 'DOT', 'MATIC', 'LINK', 'UNI', 'LTC'].includes(upper);
  const unit = isCrypto ? 'T' : 'B';
  
  let baseMultiplier = 150;
  if (upper === 'TPIA') baseMultiplier = 210;
  else if (upper === 'BTC') baseMultiplier = 850;
  
  const headers = period === 'Annual' 
    ? ['12M 2025', '12M 2024', '12M 2023', '12M 2022']
    : ['3M 2026', '12M 2025', '9M 2025', '6M 2025'];
    
  const fmt = (v: number) => `${v.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ${unit}`;
  const getRow = (factor: number) => {
    return headers.map((_, i) => fmt(baseMultiplier * factor * (1 - i * 0.08)));
  };
  
  return {
    headers,
    rows: {
      'Total Aset': getRow(1.0),
      'Aset Lancar': getRow(0.45),
      'Aset Tidak Lancar': getRow(0.55),
      'Total Liabilitas': getRow(0.6),
      'Liabilitas Jangka Pendek': getRow(0.25),
      'Liabilitas Jangka Panjang': getRow(0.35),
      'Total Ekuitas': getRow(0.4),
      'Ekuitas Pemilik Entitas Induk': getRow(0.36),
      'Kepentingan Non-Pengendali': getRow(0.04)
    }
  };
};

// Cash Flow (Arus Kas) Templates
export const getCashFlowData = (symbol: string, period: 'Annual' | 'Quarterly'): FinancialReport => {
  const upper = symbol.toUpperCase();
  const isCrypto = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX', 'DOT', 'MATIC', 'LINK', 'UNI', 'LTC'].includes(upper);
  const unit = isCrypto ? 'T' : 'B';
  
  let baseMultiplier = 35;
  if (upper === 'TPIA') baseMultiplier = 42;
  else if (upper === 'BTC') baseMultiplier = 120;
  
  const headers = period === 'Annual' 
    ? ['12M 2025', '12M 2024', '12M 2023', '12M 2022']
    : ['3M 2026', '12M 2025', '9M 2025', '6M 2025'];
    
  const fmt = (v: number) => `${v.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ${unit}`;
  const fmtNeg = (v: number) => `(${v.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ${unit})`;
  
  const getRow = (factor: number, isNeg = false) => {
    return headers.map((_, i) => {
      const val = baseMultiplier * factor * (1 - i * 0.05);
      return isNeg ? fmtNeg(val) : fmt(val);
    });
  };
  
  return {
    headers,
    rows: {
      'Arus Kas dari Aktivitas Operasi': getRow(1.0),
      'Penerimaan Kas dari Pelanggan': getRow(1.5),
      'Pembayaran kepada Pemasok/Karyawan': getRow(0.5, true),
      'Arus Kas dari Aktivitas Investasi': getRow(0.4, true),
      'Perolehan Aset Tetap': getRow(0.35, true),
      'Arus Kas dari Aktivitas Pendanaan': getRow(0.3, true),
      'Penerimaan/Pembayaran Pinjaman': getRow(0.2, true),
      'Kenaikan/Penurunan Kas Bersih': getRow(0.3)
    }
  };
};

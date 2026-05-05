import React, { useState, useEffect, useRef, Component } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Card, Typography, Space, Button, Select, Tag, Table, Tabs, Drawer,
    DatePicker, Statistic, Progress, Divider, Tooltip, Badge, Checkbox,
    Row, Col, message, Dropdown, Input, Modal, Popconfirm, Spin, Segmented
} from 'antd';
import {
    DownloadOutlined, ArrowUpOutlined, ArrowDownOutlined,
    DollarOutlined, UserOutlined, RiseOutlined, SwapOutlined,
    FileExcelOutlined, FilePdfOutlined, CloudUploadOutlined,
    InfoCircleOutlined, CalendarOutlined, ReloadOutlined,
    PlusOutlined, CameraOutlined, SaveOutlined, SendOutlined, CheckCircleOutlined,
    DeleteOutlined, EditOutlined, SearchOutlined, FolderOpenOutlined,
    BarChartOutlined, ShopOutlined, PercentageOutlined, RobotOutlined,
    SettingOutlined, ArrowLeftOutlined,
    TeamOutlined, TrophyOutlined, ClockCircleOutlined, WarningOutlined,
    CloseOutlined, EyeOutlined, ExclamationCircleOutlined,
    LineChartOutlined, ShoppingCartOutlined, PieChartOutlined,
    ApiOutlined, LinkOutlined, FormOutlined,
    TableOutlined, AppstoreOutlined, UnorderedListOutlined,
    ProjectOutlined, BlockOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
    Legend, ResponsiveContainer, LineChart, Line,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap
} from 'recharts';


class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: '#fff0f0', border: '1px solid red' }}>
          <h4>CRASH: {this.state.error.toString()}</h4>
          <pre>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// ─── Colour palette ─────────────────────────────────────────────────────────
const COLORS = {
    primary: '#1677ff',
    success: '#52c41a',
    warning: '#faad14',
    danger: '#ff4d4f',
    purple: '#722ed1',
    cyan: '#13c2c2',
    orange: '#fa8c16',
    pink: '#eb2f96',
};
const CHART_PALETTE = ['#1677ff', '#52c41a', '#faad14', '#722ed1', '#13c2c2', '#fa8c16'];

// ─── Data generators ─────────────────────────────────────────────────────────
const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const seed = (n) => ((Math.sin(n * 9301 + 49297) * 233280) % 233280) / 233280;

function makeMonthlyRevenue() {
    return MONTHS.map((m, i) => ({
        month: m,
        gelir: Math.round(48000 + seed(i) * 32000),
        gider: Math.round(22000 + seed(i + 1) * 15000),
        kar: Math.round(18000 + seed(i + 2) * 20000),
        geçenYıl: Math.round(35000 + seed(i + 3) * 28000),
    }));
}

function makeMonthlyUsers() {
    return MONTHS.map((m, i) => ({
        month: m,
        yeni: Math.round(200 + seed(i) * 300),
        aktif: Math.round(800 + seed(i + 1) * 400),
        kayıp: Math.round(30 + seed(i + 2) * 70),
        geçenYıl: Math.round(150 + seed(i + 3) * 250),
    }));
}

function makeTopProducts() {
    const names = ['Pro Plan', 'Business Plan', 'Enterprise', 'Starter', 'Add-on: API', 'Add-on: Storage', 'Add-on: Support', 'Free Trial'];
    return names.map((n, i) => ({
        key: i,
        ürün: n,
        gelir: Math.round(12000 + seed(i * 2) * 40000),
        satış: Math.round(50 + seed(i * 3) * 500),
        büyüme: +((-5 + seed(i * 4) * 40).toFixed(1)),
        pay: +(5 + seed(i * 5) * 25).toFixed(1),
    })).sort((a, b) => b.gelir - a.gelir);
}

function makeChannels() {
    return [
        { name: 'Organik Arama', value: 38, color: COLORS.primary },
        { name: 'Doğrudan', value: 22, color: COLORS.success },
        { name: 'Sosyal Medya', value: 18, color: COLORS.purple },
        { name: 'E-posta', value: 12, color: COLORS.warning },
        { name: 'Referans', value: 7, color: COLORS.cyan },
        { name: 'Diğer', value: 3, color: COLORS.orange },
    ];
}

function makeChannelTable() {
    return makeChannels().map((c, i) => ({
        key: i,
        kanal: c.name,
        oturum: Math.round(1500 + seed(i) * 8000),
        dönüşüm: +(1.5 + seed(i + 1) * 8).toFixed(2),
        gelir: Math.round(3000 + seed(i + 2) * 20000),
        pay: c.value,
        renk: c.color,
    }));
}

// ─── Static data ─────────────────────────────────────────────────────────────
const REVENUE_DATA = makeMonthlyRevenue();
const USERS_DATA = makeMonthlyUsers();
const PRODUCTS_DATA = makeTopProducts();
const CHANNELS = makeChannels();
const CHANNEL_TABLE = makeChannelTable();

// ─── Yönetici Performans Mock Data ──────────────────────────────────────────
// ─── Hizmet × Ülke Matrisi Sabitleri ──────────────────────────────────────
const HIZMET_ULKE_COUNTRIES = [
    { key: 'ch', label: 'İsviçre', flag: '🇨🇭' },
    { key: 'de', label: 'Almanya', flag: '🇩🇪' },
    { key: 'eu', label: 'Avrupa Birliği', flag: '🇪🇺' },
    { key: 'gb', label: 'Birleşik Krallık', flag: '🇬🇧' },
    { key: 'tr', label: 'Türkiye', flag: '🇹🇷' },
];

const HIZMET_TANIMLARI = [
    { key: 'gtip', label: 'GTİP Tespiti', indent: 0, tooltip: 'Gümrük Tarife İstatistik Pozisyonu tespiti' },
    { key: 'ihracat_kontrol', label: 'İhracat Kontrolleri & Yaptırımlar', indent: 0 },
    { key: 'dual_use', label: 'Dual-Use Sınıflandırma', indent: 1, tooltip: 'Çift kullanımlı ürün sınıflandırması' },
    { key: 'yaptirim', label: 'Yaptırımlar Sınıflandırma', indent: 1, tooltip: 'Yaptırım listesi kontrolleri' },
    { key: 'gumruk', label: 'Gümrük Mevzuatına Uyum', indent: 0, tooltip: 'Gümrük düzenlemelerine uygunluk kontrolü' },
    { key: 'ithalat', label: 'İthalat Mevzuatına Uyum', indent: 0, tooltip: 'İthalat düzenlemelerine uygunluk kontrolü' },
    { key: 'ihracat_mevzuat', label: 'İhracat Mevzuatına Uyum', indent: 0, tooltip: 'İhracat düzenlemelerine uygunluk kontrolü' },
    { key: 'skdm', label: 'SKDM', indent: 0, tooltip: 'Sınırda Karbon Düzenleme Mekanizması' },
];

// Hizmet görev geçmişi üretici — her firma için rastgele ama tutarlı veriler
const BASE_DATE = dayjs('2026-04-27');
const generateHizmetGorevler = (firmaIdx, musavirAd) => {
    const seed = firmaIdx * 7 + musavirAd.length;
    const gorevler = [];
    HIZMET_TANIMLARI.forEach((h, hi) => {
        HIZMET_ULKE_COUNTRIES.forEach((c, ci) => {
            const v = (seed + hi * 3 + ci * 5) % 10;
            if (v < 4) {
                const daysAgo = (seed + hi * 11 + ci * 7) % 80 + 15;
                const dur = (seed + hi * 5 + ci * 3) % 8 + 2;
                const start = BASE_DATE.subtract(daysAgo, 'day');
                const end = start.add(dur, 'day');
                gorevler.push({
                    key: `${firmaIdx}-${h.key}-${c.key}`,
                    hizmet: h.label,
                    ulke: c.label,
                    baslangicIso: start.format('YYYY-MM-DD'),
                    baslangic: start.format('DD.MM.YYYY'),
                    bitis: end.format('DD.MM.YYYY'),
                    sure: dur,
                    durum: 'tamamlandi',
                });
            } else if (v < 7) {
                const daysAgo = (seed + hi * 13 + ci * 9) % 20;
                const start = BASE_DATE.subtract(daysAgo, 'day');
                gorevler.push({
                    key: `${firmaIdx}-${h.key}-${c.key}`,
                    hizmet: h.label,
                    ulke: c.label,
                    baslangicIso: start.format('YYYY-MM-DD'),
                    baslangic: start.format('DD.MM.YYYY'),
                    bitis: null,
                    sure: null,
                    durum: 'devam',
                });
            }
        });
    });
    gorevler.sort((a, b) => b.baslangicIso.localeCompare(a.baslangicIso));
    return gorevler;
};

const MUSAVIRLER = [
    {
        id: 1,
        ad: 'Ersan Yılmaz',
        initials: 'EY',
        avatarColor: '#1677ff',
        atanan: 42,
        tamamlanan: 38,
        bekleyen: 4,
        ortIslemSuresi: 2.1,
        bekleyenEsyalar: [
            { kod: 'EL-2024-0341', ad: 'Elektronik Ekipman - Samsung', gun: 3 },
            { kod: 'TX-2024-0178', ad: 'Tekstil Ürünleri - Batch #44', gun: 5 },
            { kod: 'KM-2024-0092', ad: 'Kimyasal Malzeme - Kategori C', gun: 1 },
            { kod: 'MK-2024-0215', ad: 'Makine Parçası - Set A', gun: 8 },
        ],
        sonTamamlananlar: [
            { kod: 'MB-2024-0301', ad: 'Mobilya İthalatı - İtalya', tarih: '08.03.2026' },
            { kod: 'YZ-2024-0287', ad: 'Yazılım Lisansları - Toplu', tarih: '07.03.2026' },
            { kod: 'TX-2024-0155', ad: 'Tekstil - Kış Koleksiyonu', tarih: '06.03.2026' },
            { kod: 'MD-2024-0098', ad: 'Medikal Cihaz - Batch #12', tarih: '05.03.2026' },
            { kod: 'OT-2024-0211', ad: 'Otomotiv Parça - Set B', tarih: '04.03.2026' },
        ],
        firmaPerformans: [
            { firma: 'ABC Lojistik A.Ş.', atanan: 18, tamamlanan: 17, bekleyen: 1, ort: 1.8, hizmetGorevler: generateHizmetGorevler(0, 'Ersan Yılmaz') },
            { firma: 'XYZ Dış Ticaret Ltd.', atanan: 14, tamamlanan: 12, bekleyen: 2, ort: 2.5, hizmetGorevler: generateHizmetGorevler(1, 'Ersan Yılmaz') },
            { firma: 'Mega İthalat A.Ş.', atanan: 10, tamamlanan: 9, bekleyen: 1, ort: 2.0, hizmetGorevler: generateHizmetGorevler(2, 'Ersan Yılmaz') },
        ],
        esyaPerformans: [
            { kategori: 'Elektronik', atanan: 12, tamamlanan: 11, bekleyen: 1, ort: 1.5 },
            { kategori: 'Tekstil', atanan: 10, tamamlanan: 9, bekleyen: 1, ort: 2.2 },
            { kategori: 'Makine', atanan: 8, tamamlanan: 7, bekleyen: 1, ort: 2.8 },
            { kategori: 'Kimyasal', atanan: 6, tamamlanan: 6, bekleyen: 0, ort: 1.9 },
            { kategori: 'Mobilya', atanan: 6, tamamlanan: 5, bekleyen: 1, ort: 2.6 },
        ],
    },
    {
        id: 2,
        ad: 'Ayşe Kaya',
        initials: 'AK',
        avatarColor: '#eb2f96',
        atanan: 35,
        tamamlanan: 21,
        bekleyen: 14,
        ortIslemSuresi: 4.8,
        bekleyenEsyalar: [
            { kod: 'GD-2024-0441', ad: 'Gıda Ürünleri - Fındık İhracat', gun: 12 },
            { kod: 'IN-2024-0332', ad: 'İnşaat Malzemesi - Çelik', gun: 9 },
            { kod: 'TR-2024-0189', ad: 'Tarım Ürünleri - Tahıl', gun: 7 },
            { kod: 'PL-2024-0067', ad: 'Plastik Hammadde - Granül', gun: 6 },
            { kod: 'KG-2024-0253', ad: 'Kağıt Ürünleri - Ambalaj', gun: 4 },
            { kod: 'CM-2024-0114', ad: 'Cam Ürünleri - Pencere', gun: 3 },
            { kod: 'EL-2024-0388', ad: 'Elektrik Kablosu - Toplu', gun: 2 },
        ],
        sonTamamlananlar: [
            { kod: 'KZ-2024-0077', ad: 'Kozmetik Ürünler - Batch #8', tarih: '07.03.2026' },
            { kod: 'OT-2024-0195', ad: 'Oto Yedek Parça - Set D', tarih: '05.03.2026' },
            { kod: 'EL-2024-0302', ad: 'Elektronik Aksesuar - Toplu', tarih: '03.03.2026' },
            { kod: 'AH-2024-0144', ad: 'Ahşap Ürünleri - Mobilya', tarih: '01.03.2026' },
            { kod: 'DR-2024-0088', ad: 'Deri Ürünleri - Çanta', tarih: '28.02.2026' },
        ],
        firmaPerformans: [
            { firma: 'Doğa Tarım Ltd.', atanan: 12, tamamlanan: 6, bekleyen: 6, ort: 5.5, hizmetGorevler: generateHizmetGorevler(3, 'Ayşe Kaya') },
            { firma: 'Global İnşaat A.Ş.', atanan: 11, tamamlanan: 8, bekleyen: 3, ort: 4.1, hizmetGorevler: generateHizmetGorevler(4, 'Ayşe Kaya') },
            { firma: 'Star Plastik Ltd.', atanan: 12, tamamlanan: 7, bekleyen: 5, ort: 4.9, hizmetGorevler: generateHizmetGorevler(5, 'Ayşe Kaya') },
        ],
        esyaPerformans: [
            { kategori: 'Gıda', atanan: 8, tamamlanan: 4, bekleyen: 4, ort: 5.0 },
            { kategori: 'İnşaat', atanan: 7, tamamlanan: 5, bekleyen: 2, ort: 4.2 },
            { kategori: 'Plastik', atanan: 6, tamamlanan: 4, bekleyen: 2, ort: 5.1 },
            { kategori: 'Tarım', atanan: 5, tamamlanan: 3, bekleyen: 2, ort: 4.8 },
            { kategori: 'Kağıt', atanan: 5, tamamlanan: 3, bekleyen: 2, ort: 5.3 },
            { kategori: 'Cam', atanan: 4, tamamlanan: 2, bekleyen: 2, ort: 4.5 },
        ],
    },
    {
        id: 3,
        ad: 'Mehmet Demir',
        initials: 'MD',
        avatarColor: '#ff4d4f',
        atanan: 28,
        tamamlanan: 9,
        bekleyen: 19,
        ortIslemSuresi: 9.3,
        bekleyenEsyalar: [
            { kod: 'MK-2024-0501', ad: 'Makine Ekipmanı - Ağır Sanayi', gun: 21 },
            { kod: 'EL-2024-0477', ad: 'Elektronik - Batch #77', gun: 18 },
            { kod: 'KN-2024-0399', ad: 'Konteyner Malı - Karışık', gun: 15 },
            { kod: 'KM-2024-0311', ad: 'Kimyasal - Tehlikeli Madde A', gun: 13 },
            { kod: 'MT-2024-0266', ad: 'Metal Parça - Döküm', gun: 11 },
            { kod: 'TX-2024-0219', ad: 'Tekstil - Polyester', gun: 9 },
            { kod: 'SR-2024-0178', ad: 'Seramik - Yer Karosu', gun: 8 },
            { kod: 'AH-2024-0133', ad: 'Ahşap - Ham Kereste', gun: 7 },
        ],
        sonTamamlananlar: [
            { kod: 'KB-2024-0099', ad: 'Kablo Demeti - Araç', tarih: '05.03.2026' },
            { kod: 'PL-2024-0144', ad: 'Plastik Kap - Gıda', tarih: '01.03.2026' },
            { kod: 'BY-2024-0077', ad: 'Boya Malzeme - Endüstriyel', tarih: '25.02.2026' },
            { kod: 'ST-2024-0055', ad: 'Süt Ürünleri - Soğuk Zincir', tarih: '20.02.2026' },
            { kod: 'KG-2024-0188', ad: 'Kağıt Ham - Rulo', tarih: '15.02.2026' },
        ],
        firmaPerformans: [
            { firma: 'Ağır Sanayi A.Ş.', atanan: 10, tamamlanan: 2, bekleyen: 8, ort: 12.0, hizmetGorevler: generateHizmetGorevler(6, 'Mehmet Demir') },
            { firma: 'Kimya Fabrikaları Ltd.', atanan: 9, tamamlanan: 3, bekleyen: 6, ort: 8.5, hizmetGorevler: generateHizmetGorevler(7, 'Mehmet Demir') },
            { firma: 'İnka Metal A.Ş.', atanan: 9, tamamlanan: 4, bekleyen: 5, ort: 7.8, hizmetGorevler: generateHizmetGorevler(8, 'Mehmet Demir') },
        ],
        esyaPerformans: [
            { kategori: 'Makine', atanan: 8, tamamlanan: 2, bekleyen: 6, ort: 11.0 },
            { kategori: 'Elektronik', atanan: 5, tamamlanan: 2, bekleyen: 3, ort: 8.5 },
            { kategori: 'Kimyasal', atanan: 5, tamamlanan: 1, bekleyen: 4, ort: 10.2 },
            { kategori: 'Tekstil', atanan: 4, tamamlanan: 2, bekleyen: 2, ort: 7.0 },
            { kategori: 'Metal', atanan: 3, tamamlanan: 1, bekleyen: 2, ort: 9.5 },
            { kategori: 'Ahşap', atanan: 3, tamamlanan: 1, bekleyen: 2, ort: 8.0 },
        ],
    },
    {
        id: 4,
        ad: 'Selin Arslan',
        initials: 'SA',
        avatarColor: '#52c41a',
        atanan: 31,
        tamamlanan: 29,
        bekleyen: 2,
        ortIslemSuresi: 1.7,
        bekleyenEsyalar: [
            { kod: 'MD-2024-0421', ad: 'Medikal Cihaz - Ultrason', gun: 2 },
            { kod: 'LB-2024-0309', ad: 'Laboratuvar Ekipmanı', gun: 1 },
        ],
        sonTamamlananlar: [
            { kod: 'RB-2024-0512', ad: 'Endüstriyel Robot - Set', tarih: '09.03.2026' },
            { kod: 'YZ-2024-0388', ad: 'Yazılım - ERP Lisansı', tarih: '08.03.2026' },
            { kod: 'BG-2024-0277', ad: 'Bilgisayar - Toplu Alım', tarih: '07.03.2026' },
            { kod: 'NW-2024-0199', ad: 'Network Cihazı - Switch', tarih: '06.03.2026' },
            { kod: 'SN-2024-0144', ad: 'Sunucu Ekipmanı - Rack', tarih: '05.03.2026' },
        ],
        firmaPerformans: [
            { firma: 'Teknoloji Park A.Ş.', atanan: 14, tamamlanan: 14, bekleyen: 0, ort: 1.2, hizmetGorevler: generateHizmetGorevler(9, 'Selin Arslan') },
            { firma: 'Medikal Sistemler Ltd.', atanan: 10, tamamlanan: 9, bekleyen: 1, ort: 2.0, hizmetGorevler: generateHizmetGorevler(10, 'Selin Arslan') },
            { firma: 'Data Center A.Ş.', atanan: 7, tamamlanan: 6, bekleyen: 1, ort: 1.9, hizmetGorevler: generateHizmetGorevler(11, 'Selin Arslan') },
        ],
        esyaPerformans: [
            { kategori: 'Medikal', atanan: 8, tamamlanan: 8, bekleyen: 0, ort: 1.3 },
            { kategori: 'Bilişim', atanan: 10, tamamlanan: 9, bekleyen: 1, ort: 1.7 },
            { kategori: 'Elektronik', atanan: 7, tamamlanan: 7, bekleyen: 0, ort: 1.5 },
            { kategori: 'Yazılım', atanan: 6, tamamlanan: 5, bekleyen: 1, ort: 2.4 },
        ],
    },
    {
        id: 5,
        ad: 'Okan Çelik',
        initials: 'OÇ',
        avatarColor: '#faad14',
        atanan: 19,
        tamamlanan: 11,
        bekleyen: 8,
        ortIslemSuresi: 6.2,
        bekleyenEsyalar: [
            { kod: 'TR-2024-0601', ad: 'Tarım Makinesi - Traktör Parçası', gun: 10 },
            { kod: 'GB-2024-0488', ad: 'Gübre - Kimyasal', gun: 8 },
            { kod: 'SL-2024-0377', ad: 'Sulama Sistemi - Drip', gun: 6 },
            { kod: 'TH-2024-0266', ad: 'Tohumluk - İthal', gun: 5 },
            { kod: 'SR-2024-0155', ad: 'Sera Malzemesi', gun: 3 },
        ],
        sonTamamlananlar: [
            { kod: 'ZY-2024-0099', ad: 'Bitkisel Yağ - Zeytinyağı', tarih: '08.03.2026' },
            { kod: 'GK-2024-0177', ad: 'Gıda Katkısı - Emülgatör', tarih: '06.03.2026' },
            { kod: 'AM-2024-0244', ad: 'Ambalaj Folyo - Gıda', tarih: '04.03.2026' },
            { kod: 'BH-2024-0311', ad: 'Baharat - İthal Karışım', tarih: '02.03.2026' },
            { kod: 'CY-2024-0388', ad: 'Çay - Organik Batch', tarih: '28.02.2026' },
        ],
        firmaPerformans: [
            { firma: 'Tarım Kooperatifi', atanan: 8, tamamlanan: 5, bekleyen: 3, ort: 5.8, hizmetGorevler: generateHizmetGorevler(12, 'Okan Çelik') },
            { firma: 'Sera Endüstri Ltd.', atanan: 6, tamamlanan: 3, bekleyen: 3, ort: 7.0, hizmetGorevler: generateHizmetGorevler(13, 'Okan Çelik') },
            { firma: 'Doğa Gıda A.Ş.', atanan: 5, tamamlanan: 3, bekleyen: 2, ort: 5.5, hizmetGorevler: generateHizmetGorevler(14, 'Okan Çelik') },
        ],
        esyaPerformans: [
            { kategori: 'Tarım Makineleri', atanan: 5, tamamlanan: 3, bekleyen: 2, ort: 6.5 },
            { kategori: 'Gübre & Kimyasal', atanan: 4, tamamlanan: 2, bekleyen: 2, ort: 7.0 },
            { kategori: 'Gıda', atanan: 5, tamamlanan: 3, bekleyen: 2, ort: 5.0 },
            { kategori: 'Tohumluk', atanan: 3, tamamlanan: 2, bekleyen: 1, ort: 5.5 },
            { kategori: 'Sera Ekipmanı', atanan: 2, tamamlanan: 1, bekleyen: 1, ort: 7.2 },
        ],
    },
];

const TOPLAM_ESYA = MUSAVIRLER.reduce((s, m) => s + m.atanan, 0);
const TOPLAM_TAMAMLANAN = MUSAVIRLER.reduce((s, m) => s + m.tamamlanan, 0);
const TOPLAM_BEKLEYEN = MUSAVIRLER.reduce((s, m) => s + m.bekleyen, 0);
const ORT_ISLEM_SURESI = (MUSAVIRLER.reduce((s, m) => s + m.ortIslemSuresi, 0) / MUSAVIRLER.length).toFixed(1);

// ─── Report Builder constants ──────────────────────────────────────────
const HAZIR_RAPORLAR_DATA = [
    { id: 'vergi', iconKey: 'dollar', title: 'Toplu TR Vergi Sorgulama',        color: '#faad14', topic: 'Vergi',          desc: 'GTİP şablonunu indirin, doldurun, yükleyin — sistem vergileri otomatik sorgular.' },
    { id: 'gtip',  iconKey: 'swap',   title: 'GTİP Karşılaştırma & Ülke Vergi', color: '#722ed1', topic: 'Karşılaştırma', desc: 'Türkiye GTİP\'lerini seçtiğiniz ülkenin GTİP karşılıklarıyla karşılaştırın.' },
    { id: 'firma', iconKey: 'shop',   title: 'Firma Bazlı Eşya Raporu',         color: '#52c41a', topic: 'Müşteri',        desc: 'Firmaya ait eşya katalogunu toplu görüntüleyin, filtreleyin ve Excel\'e aktarın.' },
];

const BUILDER_COLUMNS_INIT = [
    { id: 'esyaKodu', title: 'Eşya Kodu', type: 'text', width: 140, locked: true, visible: true },
    { id: 'esyaTanimi', title: 'Eşya Tanımı', type: 'text', width: 200, visible: true },
    { id: 'ticariTanim', title: 'Ticari Tanım', type: 'text', width: 190, visible: true },
    { id: 'gtip', title: 'GTİP', type: 'text', width: 140, visible: true },
    { id: 'firma', title: 'Firma', type: 'select', width: 160, visible: true },
    { id: 'durum', title: 'Durum', type: 'tag', width: 130, visible: true },
    { id: 'musavir', title: 'Müşavir', type: 'text', width: 140, visible: true },
    { id: 'tarih', title: 'Tarih', type: 'date', width: 120, visible: true },
    { id: 'tamamlanma', title: 'Tamamlanma', type: 'progress', width: 130, visible: true },
];

const BUILDER_MOCK_ROWS = [
    { key: '1', esyaKodu: 'EL-2024-0341', esyaTanimi: 'Dizüstü Bilgisayar', ticariTanim: 'Apple MacBook Pro 14 M3', gtip: '8471.30.00.00', firma: 'ABC Lojistik A.Ş.', durum: 'Tamamlandı', musavir: 'Ersan Yılmaz', tarih: '08.03.2026', tamamlanma: 100 },
    { key: '2', esyaTanimi: 'Erkek Ceket', esyaKodu: 'TX-2024-0178', ticariTanim: 'Erkek Kaşmir Ceket Siyah', gtip: '6201.20.00.00', firma: 'XYZ Dış Ticaret Ltd', durum: 'Bekliyor', musavir: 'Ayşe Kaya', tarih: '07.03.2026', tamamlanma: 45 },
    { key: '3', esyaKodu: 'GD-2024-0441', esyaTanimi: 'Şarap', ticariTanim: 'Bordeaux Kırmızı 2019', gtip: '2204.21.00.00', firma: 'ABC Lojistik A.Ş.', durum: 'Tamamlandı', musavir: 'Selin Arslan', tarih: '06.03.2026', tamamlanma: 100 },
    { key: '4', esyaKodu: 'EL-2024-0512', esyaTanimi: 'Tablet', ticariTanim: 'Samsung Galaxy Tab S9 FE', gtip: '8471.30.00.00', firma: 'Mega İthalat A.Ş.', durum: 'Devam Ediyor', musavir: 'Ersan Yılmaz', tarih: '05.03.2026', tamamlanma: 72 },
    { key: '5', esyaKodu: 'GD-2024-0580', esyaTanimi: 'Fındık İç', ticariTanim: 'Giresun Fındık İç Tüm Sert', gtip: '0802.21.00.00', firma: 'ABC Lojistik A.Ş.', durum: 'Tamamlandı', musavir: 'Selin Arslan', tarih: '04.03.2026', tamamlanma: 100 },
    { key: '6', esyaKodu: 'TX-2024-0233', esyaTanimi: 'Pamuklu Gömlek', ticariTanim: 'Erkek Oxford Gömlek Beyaz', gtip: '6205.20.00.00', firma: 'XYZ Dış Ticaret Ltd', durum: 'Bekliyor', musavir: 'Mehmet Demir', tarih: '03.03.2026', tamamlanma: 20 },
    { key: '7', esyaKodu: 'EL-2024-0619', esyaTanimi: 'Akıllı Saat', ticariTanim: 'Apple Watch Ultra 2', gtip: '9102.12.00.00', firma: 'Mega İthalat A.Ş.', durum: 'Devam Ediyor', musavir: 'Okan Çelik', tarih: '02.03.2026', tamamlanma: 58 },
    { key: '8', esyaKodu: 'KM-2024-0087', esyaTanimi: 'Parfüm', ticariTanim: 'Chanel No.5 EDP 100ml', gtip: '3303.00.10.00', firma: 'Lüks Import Ltd', durum: 'Tamamlandı', musavir: 'Ayşe Kaya', tarih: '01.03.2026', tamamlanma: 100 },
];

const BUILDER_VIEWS_INIT = [
    { id: 'grid', label: 'Grid Görünüm', icon: 'table', active: true },
    { id: 'kanban', label: 'Kanban', icon: 'kanban' },
    { id: 'gallery', label: 'Galeri', icon: 'gallery' },
];


const getMusavirDurum = (pct) => {
    if (pct >= 85) return { label: 'Düzenli', color: 'success' };
    if (pct >= 60) return { label: 'Gecikmeli', color: 'warning' };
    return { label: 'Aksıyor', color: 'error' };
};

const getProgressColor = (pct) => {
    if (pct >= 85) return '#52c41a';
    if (pct >= 60) return '#faad14';
    return '#ff4d4f';
};

// ─── Aggregates ──────────────────────────────────────────────────────────────
const totalRevenue = REVENUE_DATA.reduce((s, r) => s + r.gelir, 0);
const totalProfit = REVENUE_DATA.reduce((s, r) => s + r.kar, 0);
const totalNewUsers = USERS_DATA.reduce((s, r) => s + r.yeni, 0);
const avgConversion = (CHANNEL_TABLE.reduce((s, r) => s + r.dönüşüm, 0) / CHANNEL_TABLE.length).toFixed(2);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000 ? `₺${(n / 1000).toFixed(0)}K` : `₺${n}`;
const fmtFull = (n) => `₺${n.toLocaleString('tr-TR')}`;
const pct = (delta) => (
    <span style={{ color: delta >= 0 ? COLORS.success : COLORS.danger, fontWeight: 600 }}>
        {delta >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        {' '}{Math.abs(delta)}%
    </span>
);

// ─── Reusable chart tooltip ───────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, prefix = '₺' }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'rgba(255,255,255,0.95)', border: '1px solid #e8e8e8',
            borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            fontSize: 13,
        }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
            {payload.map(p => (
                <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
                    {p.name}: <strong>{prefix === '₺' ? fmtFull(p.value) : p.value.toLocaleString('tr-TR')}</strong>
                </div>
            ))}
        </div>
    );
};

// ─── KPI Card ────────────────────────────────────────────────────────────────
const KpiCard = ({ title, value, prefix, suffix, delta, icon, color, loading }) => (
    <Card
        style={{
            borderRadius: 12,
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            borderTop: `3px solid ${color}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        styles={{ body: { padding: '18px 20px' } }}
        hoverable
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>{title}</Text>
                <div style={{ marginTop: 6 }}>
                    <Statistic
                        value={value}
                        prefix={prefix}
                        suffix={suffix}
                        valueStyle={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e' }}
                    />
                </div>
                <div style={{ marginTop: 8 }}>
                    {pct(delta)}
                    <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>geçen yıla göre</Text>
                </div>
            </div>
            <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${color}18`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color,
            }}>
                {icon}
            </div>
        </div>
    </Card>
);

// ─── Column configs ───────────────────────────────────────────────────────────
const productCols = [
    { title: '#', dataIndex: 'key', width: 40, render: (_, __, i) => <Text type="secondary">{i + 1}</Text> },
    { title: 'Ürün / Plan', dataIndex: 'ürün', render: v => <Text strong>{v}</Text> },
    {
        title: 'Gelir', dataIndex: 'gelir', align: 'right',
        sorter: (a, b) => a.gelir - b.gelir,
        defaultSortOrder: 'descend',
        render: v => <Text strong style={{ color: COLORS.success }}>{fmtFull(v)}</Text>,
    },
    {
        title: 'Satış', dataIndex: 'satış', align: 'right',
        sorter: (a, b) => a.satış - b.satış,
        render: v => v.toLocaleString('tr-TR'),
    },
    {
        title: 'Büyüme', dataIndex: 'büyüme', align: 'right',
        sorter: (a, b) => a.büyüme - b.büyüme,
        render: v => pct(v),
    },
    {
        title: 'Pazar Payı', dataIndex: 'pay', align: 'right',
        render: v => (
            <div style={{ minWidth: 100 }}>
                <div style={{ marginBottom: 4 }}>{v}%</div>
                <Progress percent={v} showInfo={false} strokeColor={COLORS.primary} size="small" />
            </div>
        ),
    },
];

const channelCols = [
    {
        title: 'Kanal', dataIndex: 'kanal',
        render: (v, r) => (
            <Space>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: r.renk }} />
                <Text strong>{v}</Text>
            </Space>
        ),
    },
    {
        title: 'Oturum', dataIndex: 'oturum', align: 'right',
        sorter: (a, b) => a.oturum - b.oturum,
        render: v => v.toLocaleString('tr-TR'),
    },
    {
        title: 'Dönüşüm %', dataIndex: 'dönüşüm', align: 'right',
        sorter: (a, b) => a.dönüşüm - b.dönüşüm,
        render: v => (
            <Tag color={v > 4 ? 'success' : v > 2 ? 'processing' : 'warning'}>%{v}</Tag>
        ),
    },
    {
        title: 'Gelir', dataIndex: 'gelir', align: 'right',
        sorter: (a, b) => a.gelir - b.gelir,
        render: v => <Text strong style={{ color: COLORS.success }}>{fmtFull(v)}</Text>,
    },
    {
        title: 'Pay', dataIndex: 'pay', align: 'right',
        render: v => (
            <div style={{ minWidth: 80 }}>
                <div style={{ marginBottom: 4 }}>{v}%</div>
                <Progress percent={v} strokeColor={COLORS.purple} showInfo={false} size="small" />
            </div>
        ),
    },
];

// ─── Export helper ────────────────────────────────────────────────────────────
function exportToExcel(data, sheetName, filename) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${filename}.xlsx`);
    message.success(`${filename}.xlsx indirildi`);
}

// ─── LocalStorage Helpers ──────────────────────────────────────────────────
const LS_KEY_GENERATED = 'space_generated_reports';

const getSavedReports = (key) => {
    try {
        const d = localStorage.getItem(key);
        return d ? JSON.parse(d) : [];
    } catch (e) { return []; }
};

const saveReportsToLS = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// ─── Custom Pie label ─────────────────────────────────────────────────────────
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return value > 5 ? (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
            {value}%
        </text>
    ) : null;
};

// ─── GTİP Karşılaştırma Raporu (Çoklu Sekme Sistemi) ───
const extendedGtipData = [
    { key: 1, trGtip: '8471.30.00.00', urunAd: 'Dizüstü Bilgisayar', miktar: 50, birimFiyat: '$1,200',  kGtip: '8471.30.00', gumrukOran: '0%', gumrukTutar: '$0', kdvOran: '19%', kdvTutar: '$11,400', otvOran: '-', otvTutar: '-', toplamTutar: '$11,400' },
    { key: 2, trGtip: '6201.20.00.00', urunAd: 'Erkek Ceket',        miktar: 200, birimFiyat: '$45',    kGtip: '6201.20.00', gumrukOran: '12%', gumrukTutar: '$1,080', kdvOran: '19%', kdvTutar: '$1,710', otvOran: '-', otvTutar: '-', toplamTutar: '$2,790' },
    { key: 3, trGtip: '2204.21.00.00', urunAd: 'Şarap',              miktar: 500, birimFiyat: '$8',     kGtip: '2204.21.00', gumrukOran: '13%', gumrukTutar: '$520', kdvOran: '7%', kdvTutar: '$280', otvOran: '5%', otvTutar: '$200', toplamTutar: '$1,000' },
    { key: 4, trGtip: '3304.99.00.00', urunAd: 'Kozmetik Krem',      miktar: 150, birimFiyat: '$25',    kGtip: '3304.99.00', gumrukOran: '6.5%', gumrukTutar: '$243', kdvOran: '19%', kdvTutar: '$712', otvOran: '-', otvTutar: '-', toplamTutar: '$955' },
    { key: 5, trGtip: '8703.23.19.00', urunAd: 'Binek Otomobil',     miktar: 5, birimFiyat: '$25,000',  kGtip: '8703.23.19', gumrukOran: '10%', gumrukTutar: '$12,500', kdvOran: '19%', kdvTutar: '$26,125', otvOran: '80%', otvTutar: '$100,000', toplamTutar: '$138,625' },
    { key: 6, trGtip: '8517.12.00.00', urunAd: 'Akıllı Telefon',     miktar: 300, birimFiyat: '$800',   kGtip: '8517.12.00', gumrukOran: '0%', gumrukTutar: '$0', kdvOran: '19%', kdvTutar: '$45,600', otvOran: '50%', otvTutar: '$120,000', toplamTutar: '$165,600' },
    { key: 7, trGtip: '3926.90.97.90', urunAd: 'Plastik Parça',      miktar: 5000, birimFiyat: '$2',    kGtip: '3926.90.97', gumrukOran: '6.5%', gumrukTutar: '$650', kdvOran: '19%', kdvTutar: '$1,900', otvOran: '-', otvTutar: '-', toplamTutar: '$2,550' },
    { key: 8, trGtip: '7326.90.98.00', urunAd: 'Çelik Vida',         miktar: 10000, birimFiyat: '$0.5', kGtip: '7326.90.98', gumrukOran: '2.7%', gumrukTutar: '$135', kdvOran: '19%', kdvTutar: '$950', otvOran: '-', otvTutar: '-', toplamTutar: '$1,085' },
    { key: 9, trGtip: '9403.60.10.00', urunAd: 'Ahşap Masa',         miktar: 80, birimFiyat: '$150',    kGtip: '9403.60.10', gumrukOran: '0%', gumrukTutar: '$0', kdvOran: '19%', kdvTutar: '$2,280', otvOran: '-', otvTutar: '-', toplamTutar: '$2,280' },
    { key: 10, trGtip: '6109.10.00.00', urunAd: 'Pamuklu T-shirt',   miktar: 1000, birimFiyat: '$15',   kGtip: '6109.10.00', gumrukOran: '12%', gumrukTutar: '$1,800', kdvOran: '19%', kdvTutar: '$2,850', otvOran: '-', otvTutar: '-', toplamTutar: '$4,650' },
];

const ULKELER = ['Almanya', 'ABD', 'Çin', 'Fransa', 'İngiltere', 'Güney Kore', 'Japonya', 'BAE'];

const TAX_MULTIPLIERS = {
    'Almanya': 1.1,
    'ABD': 0.8,
    'Çin': 0.5,
    'Fransa': 1.25,
    'İngiltere': 1.15,
    'Güney Kore': 0.9,
    'Japonya': 0.85,
    'BAE': 0.4
};

const GtipKarsilastirmaReport = () => {
    const [globalData, setGlobalData] = useState([]);
    const [tabs, setTabs] = useState([
        { key: '1', ulke: null, checked: false }
    ]);
    const [activeKey, setActiveKey] = useState('1');
    const [tabCounter, setTabCounter] = useState(2);
    const [chartType, setChartType] = useState('vertical');

    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            const newKey = String(tabCounter);
            setTabs([...tabs, { 
                key: newKey, 
                ulke: null, 
                checked: false 
            }]);
            setActiveKey(newKey);
            setTabCounter(tabCounter + 1);
        } else if (action === 'remove') {
            if (tabs.length === 1) {
                message.warning('En az 1 sekme açık kalmalıdır.');
                return;
            }
            let newTabs = tabs.filter(t => t.key !== targetKey);
            setTabs(newTabs);
            if (activeKey === targetKey) {
                setActiveKey(newTabs[0].key);
            }
        }
    };

    const handleCheck = (key, e) => {
        const isChecked = e.target.checked;
        const currentCheckedCount = tabs.filter(t => t.checked).length;
        if (isChecked && currentCheckedCount >= 5) {
            message.warning('En fazla 5 ülke karşılaştırabilirsiniz.');
            return;
        }
        
        const newTabs = tabs.map(t => t.key === key ? { ...t, checked: isChecked } : t);
        setTabs(newTabs);
        
        if (!isChecked && activeKey === 'compare' && newTabs.filter(t => t.checked).length < 2) {
            setActiveKey(newTabs[0].key);
        }
    };

    const handleUlkeChange = (key, ulke) => {
        setTabs(tabs.map(t => t.key === key ? { ...t, ulke } : t));
    };

    const checkedTabs = tabs.filter(t => t.checked && t.ulke);
    const disableComparison = checkedTabs.length < 2;

    const parseVal = (str) => {
        if (!str || str === '-') return 0;
        return parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
    };

    const renderComparisonTab = () => {
        const chartData = globalData.map(item => {
            const point = { name: item.trGtip };
            checkedTabs.forEach(t => {
                const multi = TAX_MULTIPLIERS[t.ulke] || 1;
                point[`${t.ulke}_Gümrük`] = parseVal(item.gumrukOran) * multi;
                point[`${t.ulke}_KDV`] = parseVal(item.kdvOran) * multi;
                point[`${t.ulke}_ÖTV`] = parseVal(item.otvOran) * multi;
                point[`${t.ulke}_Toplam`] = parseVal(item.toplamTutar) * multi;
            });
            return point;
        });

        const comparisonTableData = globalData.map(masterLine => {
            const row = { key: masterLine.key, trGtip: masterLine.trGtip, urunAd: masterLine.urunAd };
            let rowTaxes = [];
            checkedTabs.forEach(t => {
                const multi = TAX_MULTIPLIERS[t.ulke] || 1;
                const calcTax = parseVal(masterLine.toplamTutar) * multi;
                row[`${t.key}_kGtip`] = masterLine.kGtip;
                row[`${t.key}_gumruk`] = `%${(parseVal(masterLine.gumrukOran) * multi).toFixed(1)}`;
                row[`${t.key}_toplam`] = calcTax;
                rowTaxes.push(calcTax);
            });
            row.minTax = Math.min(...rowTaxes);
            row.maxTax = Math.max(...rowTaxes);
            return row;
        });

        const comparisonColumns = [
            { title: 'TR GTİP', dataIndex: 'trGtip', width: 140, fixed: 'left' },
            { title: 'Ürün Adı', dataIndex: 'urunAd', width: 160 },
            ...checkedTabs.map(t => ({
                title: t.ulke,
                children: [
                    { title: 'Karşılık GTİP', dataIndex: `${t.key}_kGtip`, width: 120 },
                    { title: 'Gümrük %', dataIndex: `${t.key}_gumruk`, width: 90, align: 'center' },
                    { 
                        title: 'Toplam Tutar', dataIndex: `${t.key}_toplam`, width: 110, align: 'center', 
                        render: (v, record) => {
                            let color = 'default';
                            if (record.minTax === v && record.minTax !== record.maxTax) color = 'success';
                            else if (record.maxTax === v && record.minTax !== record.maxTax) color = 'error';
                            return <Tag color={color}>${Math.round(v).toLocaleString()}</Tag>;
                        } 
                    }
                ]
            }))
        ];

        // Sadeleştirilmiş kurumsal renk paleti
        const SIMPLE_PALETTE = ['#1677ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1'];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Card 
                    title="Görsel Vergi Karşılaştırması (Toplam Vergi Tutarı)" 
                    style={{ borderRadius: 12 }}
                    extra={
                        <Segmented 
                            options={[
                                { label: 'Dikey', value: 'vertical' }, 
                                { label: 'Yatay', value: 'horizontal' }
                            ]} 
                            value={chartType} 
                            onChange={setChartType} 
                        />
                    }
                >
                    <div style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout={chartType} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={chartType === 'vertical'} horizontal={chartType === 'horizontal'} />
                                {chartType === 'vertical' ? (
                                    <>
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={12} />
                                        <YAxis />
                                    </>
                                ) : (
                                    <>
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                                    </>
                                )}
                                <RTooltip cursor={{fill: 'rgba(0,0,0,0.04)'}} formatter={(value) => `$${Math.round(value).toLocaleString()}`} />
                                <Legend />
                                {checkedTabs.map((t, idx) => (
                                    <Bar 
                                        key={t.key} 
                                        dataKey={`${t.ulke}_Toplam`} 
                                        name={`${t.ulke} Toplam Vergi`} 
                                        fill={SIMPLE_PALETTE[idx % 5]} 
                                        radius={chartType === 'vertical' ? [4, 4, 0, 0] : [0, 4, 4, 0]} 
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Detaylı Karşılaştırma Tablosu" style={{ borderRadius: 12 }}>
                    <Table 
                        size="middle" 
                        pagination={false} 
                        dataSource={comparisonTableData} 
                        columns={comparisonColumns} 
                        scroll={{ x: 'max-content' }} 
                        bordered
                    />
                </Card>
            </div>
        );
    };

    const renderTabContent = (tab) => {
        const columns = [
            { title: 'TR GTİP', dataIndex: 'trGtip', width: 130, fixed: 'left' },
            { title: 'Ürün Adı', dataIndex: 'urunAd', width: 160 },
            { title: 'Miktar', dataIndex: 'miktar', width: 80, align: 'center' },
            { title: 'Birim Fiyat', dataIndex: 'birimFiyat', width: 100, align: 'center' },
            { 
                title: 'Ülke', 
                dataIndex: 'ulke', 
                width: 140,
                render: (_, record) => (
                    <Select 
                        value={tab.ulke || undefined} 
                        onChange={(val) => handleUlkeChange(tab.key, val)} 
                        placeholder="Ülke Seç"
                        style={{ width: '100%' }}
                        options={ULKELER.map(u => ({label: u, value: u}))}
                    />
                )
            },
            { title: 'Karşılık GTİP', dataIndex: 'kGtip', width: 120 },
            { title: 'Gümrük Verg. Oranı', dataIndex: 'gumrukOran', width: 140, align: 'center' },
            { title: 'Gümrük Tutarı', dataIndex: 'gumrukTutar', width: 120, align: 'center' },
            { title: 'KDV Oranı (%)', dataIndex: 'kdvOran', width: 120, align: 'center' },
            { title: 'KDV Tutarı', dataIndex: 'kdvTutar', width: 110, align: 'center' },
            { title: 'ÖTV Oranı (%)', dataIndex: 'otvOran', width: 110, align: 'center' },
            { title: 'ÖTV Tutarı', dataIndex: 'otvTutar', width: 100, align: 'center' },
            { title: 'Toplam Vergi Tutarı', dataIndex: 'toplamTutar', width: 160, align: 'center', fixed: 'right', render: v => <Tag color="purple">{v}</Tag> },
        ];

        const isCountrySelected = !!tab.ulke;
        const multi = isCountrySelected ? (TAX_MULTIPLIERS[tab.ulke] || 1) : 1;

        const tabDataSource = globalData.map(row => {
            const gTutar = parseVal(row.gumrukTutar) * multi;
            const kTutar = parseVal(row.kdvTutar) * multi;
            const oTutar = parseVal(row.otvTutar) * multi;
            const topTutar = parseVal(row.toplamTutar) * multi;

            return {
                ...row,
                kGtip: isCountrySelected ? row.kGtip : '-',
                gumrukOran: isCountrySelected ? `%${(parseVal(row.gumrukOran) * multi).toFixed(1)}` : '-',
                gumrukTutar: isCountrySelected ? `$${Math.round(gTutar).toLocaleString()}` : '-',
                kdvOran: isCountrySelected ? `%${(parseVal(row.kdvOran) * multi).toFixed(1)}` : '-',
                kdvTutar: isCountrySelected ? `$${Math.round(kTutar).toLocaleString()}` : '-',
                otvOran: isCountrySelected ? (row.otvOran === '-' ? '-' : `%${(parseVal(row.otvOran) * multi).toFixed(1)}`) : '-',
                otvTutar: isCountrySelected ? (row.otvTutar === '-' ? '-' : `$${Math.round(oTutar).toLocaleString()}`) : '-',
                toplamTutar: isCountrySelected ? `$${Math.round(topTutar).toLocaleString()}` : '-',
            };
        });

        return (
            <Card 
                style={{ borderRadius: 12, marginTop: 12 }}
                extra={
                    <Button 
                        type="default" 
                        icon={<DownloadOutlined />} 
                        onClick={() => message.success(`${tab.ulke || 'Seçili Ülke'} verileri için şablon indirildi`)}
                    >
                        Şablonu İndir
                    </Button>
                }
            >
                <Table size="middle" pagination={false} dataSource={tabDataSource} columns={columns} scroll={{ x: 'max-content' }} />
            </Card>
        );
    };

    const tabItems = [
        ...tabs.map(t => ({
            key: t.key,
            label: (
                <Space>
                    <Checkbox checked={t.checked} onChange={(e) => handleCheck(t.key, e)} onClick={(e) => e.stopPropagation()} />
                    {t.ulke || "Ülke Seçiniz"}
                </Space>
            ),
            children: renderTabContent(t)
        })),
        {
            key: 'compare',
            label: (
                <Space>
                    <SwapOutlined /> Karşılaştırma {checkedTabs.length > 0 ? `(${checkedTabs.length}/5)` : ''}
                </Space>
            ),
            children: disableComparison ? (
                <div style={{ padding: 40, textAlign: 'center' }}>
                    <InfoCircleOutlined style={{ fontSize: 40, color: '#d9d9d9', marginBottom: 16 }} />
                    <Title level={4} style={{ color: '#8c8c8c' }}>Karşılaştırma İçin Seçim Yapın</Title>
                    <Text type="secondary">En az 2 sekmeyi işaretleyerek ülkeler arası vergi karşılaştırması yapabilirsiniz.</Text>
                </div>
            ) : renderComparisonTab(),
            closable: false,
            disabled: disableComparison
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Global Excel Upload Area */}
            <Card style={{ borderRadius: 12, border: '2px dashed #e8e8e8', background: '#fafafa' }} styles={{ body: { padding: 32, textAlign: 'center' } }}>
                <CloudUploadOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 12 }} />
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Global Veri Yükleme (Excel)</div>
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    TR GTİP ve ürün bilgilerini içeren ana dosyanızı buradan yükleyin. Tüm sekmeler bu veriyi kullanacaktır.
                </Text>
                <Space>
                    <Button 
                        icon={<FileExcelOutlined />} 
                        onClick={() => {
                            setGlobalData(extendedGtipData);
                            message.info('Excel dosyası yüklendi — tüm sekmeler güncellendi.');
                        }}
                    >
                        Excel Dosyası Yükle
                    </Button>
                </Space>
            </Card>

            <div style={{ borderRadius: 8, background: '#fff' }}>
                <Tabs 
                    type="editable-card" 
                    activeKey={activeKey} 
                    onChange={setActiveKey} 
                    onEdit={onEdit} 
                    items={tabItems} 
                />
            </div>
        </div>
    );
};

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [comparison, setComparison] = useState(false);
    const [period, setPeriod] = useState('yıllık');
    const [activeTab, setActiveTab] = useState('create');

    // Overview internal tabs
    const [overviewTab, setOverviewTab] = useState('gelir');

    // Report generation states
    const [catalogData, setCatalogData] = useState([]);
    const [loadingCatalog, setLoadingCatalog] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [reportTitle, setReportTitle] = useState('');
    const [reportCategory, setReportCategory] = useState('genel');
    const [reportLoadingVisible, setReportLoadingVisible] = useState(false);
    const [reportActiveStep, setReportActiveStep] = useState(0);
    const [reportExitingStep, setReportExitingStep] = useState(null);
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const [reportToShare, setReportToShare] = useState(null);
    const [searchText, setSearchText] = useState('');

    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ title: '', desc: '' });

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [activeTemplateForDrawer, setActiveTemplateForDrawer] = useState(null);


    // Vergi Raporu state
    const [vergiExcelUploaded, setVergiExcelUploaded] = useState(false);

    // KPI Raporu state
    const [kpiFilterMode, setKpiFilterMode] = useState(null); // null | 'firma' | 'musavir'
    const [kpiSelectedFirma, setKpiSelectedFirma] = useState(null);
    const [kpiSelectedMusavir, setKpiSelectedMusavir] = useState(null);
    const [kpiDateRange, setKpiDateRange] = useState(null);
    const [kpiFiltered, setKpiFiltered] = useState(false);

    // Firma Raporu state
    const [firmaRaporFirma, setFirmaRaporFirma] = useState(null);
    const [firmaRaporDateRange, setFirmaRaporDateRange] = useState(null);
    const [firmaRaporFiltered, setFirmaRaporFiltered] = useState(false);

    // Builder state
        const [selectedHazirReport, setSelectedHazirReport] = useState(null);

    // URL search params handling: ?tab=create|myreports|yonetici&report=kpi|vergi|gtip|firma
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        const reportParam = searchParams.get('report');
        if (tabParam) {
            setActiveTab(tabParam);
        }
        if (reportParam) {
            setActiveTab('create');
            const found = HAZIR_RAPORLAR_DATA.find(r => r.id === reportParam);
            if (found) setSelectedHazirReport(found);
        }
    }, [searchParams]);

    const [templates, setTemplates] = useState(() => {
        try {
            const stored = localStorage.getItem('space_report_templates');
            return stored ? JSON.parse(stored) : [
                { id: '1', title: 'KPI Raporu', desc: 'Performans göstergelerini ve temel metrikleri analiz edin.', icon: 'bar', color: COLORS.primary, topic: 'Performans' },
                { id: '2', title: 'Firma Özelinde Eşya Raporları', desc: 'Müşteri ve firmalara göre katalog dağılım ve metrajı.', icon: 'shop', color: COLORS.purple, topic: 'Müşteri' },
                { id: '3', title: 'Vergi Detay Raporu', desc: 'GTİP bazında vergi oranları ve gümrük yükümlülükleri.', icon: 'pct', color: COLORS.warning, topic: 'Vergi' },
                { id: '4', title: 'AI Destekli Raporlar', desc: 'Yapay zeka analizli ürün ve tarife eşleştirme raporları.', icon: 'robot', color: COLORS.success, topic: 'Yapay Zeka' },
            ];
        } catch { return []; }
    });

    const [generatedReports, setGeneratedReports] = useState(() => getSavedReports(LS_KEY_GENERATED));
    
    const exportRef = useRef(null);

    // Fetch catalog on mount or when switching to 'create' tab
    useEffect(() => {
        if (activeTab === 'create' && catalogData.length === 0) {
            setLoadingCatalog(true);
            fetch('/data/katalog_full.json')
                .then(res => res.json())
                .then(data => {
                    const mapped = data.data.map(item => ({
                        ...item,
                        key: item['Eşya Kodu'] + Math.random().toString(36).substr(2, 5) // ensure unique
                    }));
                    setCatalogData(mapped);
                    setLoadingCatalog(false);
                })
                .catch(err => {
                    message.error('Katalog verisi yüklenemedi.');
                    setLoadingCatalog(false);
                });
        }
    }, [activeTab, catalogData.length]);

    // Derived filtered catalog
    const filteredCatalog = React.useMemo(() => {
        if (!searchText) return [];
        const lower = searchText.toLowerCase();
        return catalogData.filter(item =>
            (item['Eşya Kodu'] || '').toLowerCase().includes(lower) ||
            (item['Firma Adı'] || '').toLowerCase().includes(lower) ||
            (item['Eşya Açıklaması'] || '').toLowerCase().includes(lower) ||
            (item['Ticari Tanım'] || '').toLowerCase().includes(lower)
        );
    }, [catalogData, searchText]);

    const exportMenu = {
        items: [
            {
                key: 'xlsx',
                icon: <FileExcelOutlined />,
                label: 'Excel (.xlsx)',
                onClick: () => {
                    const tabMap = {
                        gelir: { data: REVENUE_DATA, name: 'Gelir', file: 'gelir_raporu' },
                        kullanıcı: { data: USERS_DATA, name: 'Kullanıcı', file: 'kullanici_raporu' },
                        ürün: { data: PRODUCTS_DATA, name: 'Ürünler', file: 'urun_raporu' },
                        kanal: { data: CHANNEL_TABLE.map(({ renk: _, ...r }) => r), name: 'Kanallar', file: 'kanal_raporu' },
                    };
                    const t = tabMap[overviewTab] || tabMap['gelir'];
                    exportToExcel(t.data, t.name, t.file);
                },
            },
            {
                key: 'print',
                icon: <FilePdfOutlined />,
                label: 'Yazdır / PDF',
                onClick: () => window.print(),
            },
        ],
    };

    // ─── Handlers ────────────────────────────────────────────────────────

    const handleCreateExcelReport = () => {
        if (!selectedRowKeys.length) return message.warning('Lütfen rapor için eşya seçin.');
        const dataToExport = catalogData.filter(item => selectedRowKeys.includes(item.key));
        exportToExcel(dataToExport, 'Katalog Raporu', reportTitle || 'Katalog_Raporu');
    };

    const handleCreateImageReport = async () => {
        if (!selectedRowKeys.length) return message.warning('Lütfen rapor için eşya seçin.');
        if (!exportRef.current) return;

        try {
            message.loading({ content: 'Görsel oluşturuluyor...', key: 'imgRender' });
            // Temporarily show the report node to render it
            exportRef.current.style.display = 'block';
            const canvas = await html2canvas(exportRef.current, { scale: 2 });
            exportRef.current.style.display = 'none';

            const link = document.createElement('a');
            link.download = `${reportTitle || 'Rapor_Gorseli'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            message.success({ content: 'Görsel indirildi.', key: 'imgRender' });
        } catch (err) {
            exportRef.current.style.display = 'none';
            message.error({ content: 'Görsel oluşturulamadı.', key: 'imgRender' });
        }
    };

    const handleSaveReport = () => {
        if (!selectedRowKeys.length) return message.warning('Lütfen en az bir eşya seçin.');

        const newReport = {
            id: Date.now().toString(),
            title: reportTitle || 'Yeni Rapor',
            category: reportCategory,
            date: new Date().toISOString(),
            items: catalogData.filter(item => selectedRowKeys.includes(item.key)),
        };

        // Show animated loading overlay, drive steps progressively
        setReportActiveStep(0);
        setReportExitingStep(null);
        setReportLoadingVisible(true);

        // Step 0 → done at 3s
        setTimeout(() => {
            setReportExitingStep(0);
            setTimeout(() => { setReportExitingStep(null); setReportActiveStep(1); }, 550);
        }, 3000);

        // Step 1 → done at 6.5s
        setTimeout(() => {
            setReportExitingStep(1);
            setTimeout(() => { setReportExitingStep(null); setReportActiveStep(2); }, 550);
        }, 6500);

        // Complete at 10s
        setTimeout(() => {
            const updated = [newReport, ...generatedReports];
            setGeneratedReports(updated);
            saveReportsToLS(LS_KEY_GENERATED, updated);
            setReportLoadingVisible(false);
            setReportActiveStep(0);
            message.success('Rapor "Raporlarım" sekmesine kaydedildi.');
            setSelectedRowKeys([]);
            setReportTitle('');
            setReportCategory('genel');
            setActiveTab('myreports');
        }, 10000);
    };

    const handleDeleteReport = (id) => {
        const updated = generatedReports.filter(r => r.id !== id);
        setGeneratedReports(updated);
        saveReportsToLS(LS_KEY_GENERATED, updated);
        message.success('Rapor silindi.');
    };

    const handleEditReport = (report) => {
        // Hazır rapor tipiyse, o rapora git
        if (report.reportType) {
            const hazirRapor = HAZIR_RAPORLAR_DATA.find(r => r.id === report.reportType);
            if (hazirRapor) {
                setSelectedHazirReport(hazirRapor);
                setActiveTab('create');
                return;
            }
        }
        // Normal rapor ise düzenleme moduna geç
        setReportTitle(report.title);
        setReportCategory(report.category || 'genel');
        if (report.items && report.items.length > 0) {
            setSelectedRowKeys(report.items.map(i => i.key));
        }
        setActiveTab('create');
    };

    const handleShareEmailSubmit = () => {
        if (!shareEmail.trim()) return;
        message.success(`${reportToShare.title} raporu ${shareEmail} adresine gönderildi.`);
        setShareModalVisible(false);
        setShareEmail('');
    };

    // Hazır raporu Raporlarım'a kaydet
    const handleSaveHazirReport = (reportType, reportTitle, reportData = null) => {
        const newReport = {
            id: Date.now().toString(),
            title: reportTitle,
            category: reportType === 'kpi' ? 'performans' : reportType === 'vergi' ? 'vergi' : reportType === 'firma' ? 'musteri' : 'genel',
            reportType: reportType,
            date: new Date().toISOString(),
            filters: reportData?.filters || {},
            items: reportData?.items || [],
        };

        const updated = [newReport, ...generatedReports];
        setGeneratedReports(updated);
        saveReportsToLS(LS_KEY_GENERATED, updated);
        message.success('Rapor "Raporlarım" sekmesine kaydedildi.');
    };

    const handleAddTemplate = () => {
        if (!newTemplate.title) return message.warning('Lütfen bir başlık girin.');
        const t = {
            id: Date.now().toString(),
            title: newTemplate.title,
            desc: newTemplate.desc || 'Özel Rapor Şablonu',
            topic: newTemplate.topic || 'Genel',
            icon: 'bar', // default icon
            color: COLORS.primary
        };
        const updated = [...templates, t];
        setTemplates(updated);
        localStorage.setItem('space_report_templates', JSON.stringify(updated));
        setIsTemplateModalOpen(false);
        setNewTemplate({ title: '', desc: '' });
        message.success('Yeni şablon eklendi.');
    };

    // ─── Builder handlers (Airtable-style — no legacy canvas) ─────────────

    const getTemplateIcon = (iconName, color) => {
        const style = { fontSize: 32, color, marginBottom: 12 };
        switch (iconName) {
            case 'shop': return <ShopOutlined style={style} />;
            case 'pct': return <PercentageOutlined style={style} />;
            case 'robot': return <RobotOutlined style={style} />;
            default: return <BarChartOutlined style={style} />;
        }
    };

    const getTopicTagColor = (topic) => {
        const map = {
            'Performans': 'blue',
            'Müşteri': 'purple',
            'Vergi': 'orange',
            'Yapay Zeka': 'green',
            'Genel': 'default',
        };
        return map[topic] || 'default';
    };

    // Overview UI Sections
    const gelirTab = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Card
                title={<span><LineChartOutlined style={{ marginRight: 6 }} />Aylık Gelir & Gider Trendi</span>}
                extra={
                    <Tag icon={<InfoCircleOutlined />} color="blue">
                        {fmtFull(totalRevenue)} toplam
                    </Tag>
                }
                styles={{ body: { paddingTop: 8 } }}
                style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 24, left: 16, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gGelir" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.25} />
                                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gGider" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={COLORS.danger} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gKar" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} />
                        <RTooltip content={<ChartTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Area type="monotone" dataKey="gelir" name="Gelir" stroke={COLORS.primary} fill="url(#gGelir)" strokeWidth={2.5} dot={false} />
                        <Area type="monotone" dataKey="gider" name="Gider" stroke={COLORS.danger} fill="url(#gGider)" strokeWidth={2} dot={false} />
                        <Area type="monotone" dataKey="kar" name="Kâr" stroke={COLORS.success} fill="url(#gKar)" strokeWidth={2} dot={false} />
                        {comparison && <Area type="monotone" dataKey="geçenYıl" name="Geçen Yıl" stroke="#bbb" strokeDasharray="5 3" fill="none" dot={false} />}
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            <Card
                title={<span><BarChartOutlined style={{ marginRight: 6 }} />Aylık Gelir Karşılaştırması</span>}
                styles={{ body: { paddingTop: 8 } }}
                style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 24, left: 16, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} />
                        <RTooltip content={<ChartTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="gelir" name="Gelir" fill={COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={32} />
                        <Bar dataKey="kar" name="Kâr" fill={COLORS.success} radius={[4, 4, 0, 0]} maxBarSize={32} />
                        {comparison && <Bar dataKey="geçenYıl" name="Geçen Yıl" fill="#d9d9d9" radius={[4, 4, 0, 0]} maxBarSize={32} />}
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );

    const kullanıcıTab = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Card
                title={<span><TeamOutlined style={{ marginRight: 6 }} />Kullanıcı Aktivite Trendi</span>}
                extra={<Tag color="green">+{totalNewUsers.toLocaleString()} yeni kullanıcı</Tag>}
                styles={{ body: { paddingTop: 8 } }}
                style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={USERS_DATA} margin={{ top: 10, right: 24, left: 8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <RTooltip content={<ChartTooltip prefix="" />} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Line type="monotone" dataKey="aktif" name="Aktif" stroke={COLORS.primary} strokeWidth={2.5} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="yeni" name="Yeni" stroke={COLORS.success} strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="kayıp" name="Kayıbedilen" stroke={COLORS.danger} strokeWidth={2} strokeDasharray="5 3" dot={false} />
                        {comparison && <Line type="monotone" dataKey="geçenYıl" name="Geçen Yıl" stroke="#bbb" strokeDasharray="5 3" dot={false} />}
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            <Card
                title={<span><BarChartOutlined style={{ marginRight: 6 }} />Aylık Kullanıcı Kazanımı & Kaybı</span>}
                styles={{ body: { paddingTop: 8 } }}
                style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={USERS_DATA} margin={{ top: 10, right: 24, left: 8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <RTooltip content={<ChartTooltip prefix="" />} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="yeni" name="Yeni Kullanıcı" stackId="a" fill={COLORS.success} radius={[0, 0, 0, 0]} maxBarSize={32} />
                        <Bar dataKey="kayıp" name="Kayıp" stackId="b" fill={COLORS.danger} radius={[4, 4, 0, 0]} maxBarSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );

    const ürünTab = (
        <Card
            title={<span><ShoppingCartOutlined style={{ marginRight: 6 }} />Ürün / Plan Performansı</span>}
            extra={
                <Button
                    size="small" icon={<DownloadOutlined />}
                    onClick={() => exportToExcel(PRODUCTS_DATA, 'Ürünler', 'urun_raporu')}
                >
                    İndir
                </Button>
            }
            style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
            <Table
                dataSource={PRODUCTS_DATA}
                columns={productCols}
                pagination={false}
                size="middle"
                rowClassName={(_, i) => i === 0 ? 'top-product-row' : ''}
                summary={data => (
                    <Table.Summary.Row style={{ background: '#fafafa' }}>
                        <Table.Summary.Cell index={0} colSpan={2}>
                            <Text strong>Toplam</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2} align="right">
                            <Text strong style={{ color: COLORS.success }}>
                                {fmtFull(data.reduce((s, r) => s + r.gelir, 0))}
                            </Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3} align="right">
                            <Text strong>
                                {data.reduce((s, r) => s + r.satış, 0).toLocaleString('tr-TR')}
                            </Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={4} colSpan={2} />
                    </Table.Summary.Row>
                )}
            />
        </Card>
    );

    const kanalTab = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <Card title={<span><PieChartOutlined style={{ marginRight: 6 }} />Trafik Dağılımı</span>} style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }} styles={{ body: { paddingTop: 8 } }}>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={CHANNELS} cx="36%" cy="48%" outerRadius={90} innerRadius={48} dataKey="value" labelLine={false} label={PieLabel}>
                                {CHANNELS.map((c, i) => (<Cell key={i} fill={c.color} />))}
                            </Pie>
                            <RTooltip formatter={(v, n) => [`${v}%`, n]} />
                            <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" iconSize={8} formatter={(value, entry) => (<span style={{ fontSize: 12 }}>{entry.payload.name}: <strong>{entry.payload.value}%</strong></span>)} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                <Card title={<span><ApiOutlined style={{ marginRight: 6 }} />Kanal Sıralaması</span>} style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }} styles={{ body: { display: 'flex', flexDirection: 'column', gap: 18 } }}>
                    {CHANNELS.map((c, i) => (
                        <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Space><div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} /><Text style={{ fontSize: 13 }}>{c.name}</Text></Space>
                                <Text strong style={{ fontSize: 13 }}>{c.value}%</Text>
                            </div>
                            <Progress percent={c.value} strokeColor={c.color} showInfo={false} size="small" />
                        </div>
                    ))}
                </Card>
            </div>

            <Card
                title={<span><LinkOutlined style={{ marginRight: 6 }} />Kanal Detay Raporu</span>}
                extra={
                    <Button size="small" icon={<DownloadOutlined />} onClick={() => exportToExcel(CHANNEL_TABLE.map(({ renk: _, ...r }) => r), 'Kanallar', 'kanal_raporu')}>İndir</Button>
                }
                style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
                <Table
                    dataSource={CHANNEL_TABLE} columns={channelCols} pagination={false} size="middle"
                    summary={data => (
                        <Table.Summary.Row style={{ background: '#fafafa' }}>
                            <Table.Summary.Cell index={0}><Text strong>Toplam</Text></Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right"><Text strong>{data.reduce((s, r) => s + r.oturum, 0).toLocaleString('tr-TR')}</Text></Table.Summary.Cell>
                            <Table.Summary.Cell index={2} />
                            <Table.Summary.Cell index={3} align="right"><Text strong style={{ color: COLORS.success }}>{fmtFull(data.reduce((s, r) => s + r.gelir, 0))}</Text></Table.Summary.Cell>
                            <Table.Summary.Cell index={4} />
                        </Table.Summary.Row>
                    )}
                />
            </Card>
        </div>
    );

    const overviewTabs = [
        { key: 'gelir', label: <span><DollarOutlined /> Gelir</span>, children: gelirTab },
        { key: 'kullanıcı', label: <span><TeamOutlined /> Kullanıcılar</span>, children: kullanıcıTab },
        { key: 'ürün', label: <span><ShoppingCartOutlined /> Ürünler</span>, children: ürünTab },
        { key: 'kanal', label: <span><ApiOutlined /> Kanallar</span>, children: kanalTab },
    ];

    const renderOverview = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}><BarChartOutlined style={{ marginRight: 8 }} />Raporlar Genel Bakış</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>İş performansını analiz edin ve raporları indirin</Text>
                </div>
                <Space wrap>
                    <Button icon={<SwapOutlined />} type={comparison ? 'primary' : 'default'} onClick={() => setComparison(v => !v)} ghost={comparison}>Karşılaştır</Button>
                    <Select value={period} onChange={setPeriod} options={[{ label: 'Bu Yıl', value: 'yıllık' }, { label: 'Bu Çeyrek', value: 'çeyrek' }, { label: 'Bu Ay', value: 'aylık' }, { label: 'Özel Aralık', value: 'özel' }]} style={{ width: 140 }} prefix={<CalendarOutlined />} />
                    {period === 'özel' && (<RangePicker size="middle" />)}
                    <Dropdown menu={exportMenu} trigger={['click']}>
                        <Button type="primary" icon={<DownloadOutlined />}>Raporu İndir</Button>
                    </Dropdown>
                </Space>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}><KpiCard title="Toplam Gelir" value={totalRevenue} prefix="₺" delta={18.4} icon={<DollarOutlined />} color={COLORS.primary} /></Col>
                <Col xs={24} sm={12} lg={6}><KpiCard title="Net Kâr" value={totalProfit} prefix="₺" delta={12.7} icon={<RiseOutlined />} color={COLORS.success} /></Col>
                <Col xs={24} sm={12} lg={6}><KpiCard title="Yeni Kullanıcı" value={totalNewUsers} delta={24.1} icon={<UserOutlined />} color={COLORS.purple} /></Col>
                <Col xs={24} sm={12} lg={6}><KpiCard title="Ort. Dönüşüm" value={avgConversion} suffix="%" delta={-2.3} icon={<SwapOutlined />} color={COLORS.warning} /></Col>
            </Row>

            {comparison && (
                <Card size="small" style={{ borderRadius: 8, background: 'linear-gradient(135deg, #e6f4ff, #f0f9ff)', border: '1px solid #91caff' }} styles={{ body: { padding: '10px 16px' } }}>
                    <Space><InfoCircleOutlined style={{ color: COLORS.primary }} /><Text style={{ fontSize: 13 }}><strong>Karşılaştırma modu açık</strong> — grafiklerde kesik çizgi bir önceki yılı göstermektedir.</Text></Space>
                </Card>
            )}

            <Tabs activeKey={overviewTab} onChange={setOverviewTab} items={overviewTabs} />
        </div>
    );

    const catalogCols = [
        { title: 'Eşya Kodu', dataIndex: 'Eşya Kodu', key: 'Eşya Kodu', width: 120 },
        { title: 'Firma Adı', dataIndex: 'Firma Adı', key: 'Firma Adı', width: 200, ellipsis: true },
        { title: 'Açıklama', dataIndex: 'Eşya Açıklaması', key: 'Eşya Açıklaması', ellipsis: true },
        { title: 'Tarife (TR)', dataIndex: 'Eşya Tarifesi-TR', key: 'Eşya Tarifesi-TR', width: 160 },
        { title: 'Durum', dataIndex: 'Eşya Statüsü', key: 'Eşya Statüsü', width: 100, render: v => <Tag color={v === 'Active' ? 'green' : 'default'}>{v}</Tag> }
    ];

    const renderCreateReport = () => {
        // ── Hazır rapor icon helper ───────────────────────────────────────────
        const rIcon = (r, size = 32) => {
            const s = { fontSize: size, color: r.color };
            switch (r.iconKey) {
                case 'dollar': return <DollarOutlined style={s} />;
                case 'swap':   return <SwapOutlined style={s} />;
                case 'shop':   return <ShopOutlined style={s} />;
                default:       return <BarChartOutlined style={s} />;
            }
        };

        // ── Detail view for each hazır rapor ─────────────────────────────────
        if (selectedHazirReport) {
            const r = selectedHazirReport;
            const kodCell = v => <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}>{v}</span>;
            const vergiMock = [
                { key: 1, trGtip: '8471.30.00.00', kod: 'EL-2024-0341', tanim: 'Dizüstü Bilgisayar', gumruk: '0%',   kdv: '20%', otv: '-',   diger: '-',   toplam: '20%'  },
                { key: 2, trGtip: '6201.20.00.00', kod: 'TX-2024-0178', tanim: 'Erkek Ceket',        gumruk: '12%',  kdv: '20%', otv: '-',   diger: '-',   toplam: '32%'  },
                { key: 3, trGtip: '2204.21.00.00', kod: 'GD-2024-0441', tanim: 'Şarap',              gumruk: '150%', kdv: '20%', otv: '63%', diger: '-',   toplam: '233%' },
            ];
            const gtipMock = [
                { key: 1, trGtip: '8471.30.00.00', urunAd: 'Dizüstü Bilgisayar', miktar: 50, birimFiyat: '$1,200', ulke: 'Almanya', kGtip: '8471.30.00', gumrukOran: '0%', gumrukTutar: '$0', kdvOran: '19%', kdvTutar: '$11,400', otvOran: '-', otvTutar: '-', toplamTutar: '$11,400' },
                { key: 2, trGtip: '6201.20.00.00', urunAd: 'Erkek Ceket',        miktar: 200, birimFiyat: '$45',    ulke: 'Almanya', kGtip: '6201.20.00', gumrukOran: '12%', gumrukTutar: '$1,080', kdvOran: '19%', kdvTutar: '$1,710', otvOran: '-', otvTutar: '-', toplamTutar: '$2,790' },
                { key: 3, trGtip: '2204.21.00.00', urunAd: 'Şarap',              miktar: 500, birimFiyat: '$8',     ulke: 'Almanya', kGtip: '2204.21.00', gumrukOran: '13%', gumrukTutar: '$520', kdvOran: '7%', kdvTutar: '$280', otvOran: '5%', otvTutar: '$200', toplamTutar: '$1,000' },
            ];
            const FIRMA_RAPOR_FIRMALAR = [
                { key: 'abc', name: 'ABC Lojistik A.Ş.' },
                { key: 'xyz', name: 'XYZ Dış Ticaret Ltd.' },
                { key: 'mega', name: 'Mega İthalat A.Ş.' },
            ];

            const firmaMock = [
                { key: 1, firma: 'ABC Lojistik A.Ş.',   kod: 'EL-2024-0341', tanim: 'Elektronik Ekipman',  ticari: 'Samsung Galaxy Tab S9 FE', gtip: '8471.30.00.00', modelNo: 'SM-X510', netAg: '0.52 kg', brutAg: '0.85 kg', tarih: '08.03.2026', durum: 'Tamamlandı', musavir: 'Ersan Yılmaz' },
                { key: 2, firma: 'XYZ Dış Ticaret Ltd.', kod: 'TX-2024-0178', tanim: 'Tekstil Ürünleri', ticari: 'Erkek Kaşmir Ceket Siyah', gtip: '6201.20.00.00', modelNo: '-', netAg: '0.65 kg', brutAg: '0.90 kg', tarih: '07.03.2026', durum: 'Bekliyor', musavir: 'Ayşe Kaya' },
                { key: 3, firma: 'ABC Lojistik A.Ş.',   kod: 'GD-2024-0441', tanim: 'Gıda Ürünleri',     ticari: 'Giresun Fındık İç Tüm Sert', gtip: '0802.21.00.00', modelNo: '-', netAg: '25 kg', brutAg: '27 kg', tarih: '06.03.2026', durum: 'Tamamlandı', musavir: 'Selin Arslan' },
                { key: 4, firma: 'Mega İthalat A.Ş.',   kod: 'MK-2024-0512', tanim: 'Makine Parçası',    ticari: 'CNC Torna Takım Seti', gtip: '8207.30.00.00', modelNo: 'CNC-T100', netAg: '12.5 kg', brutAg: '15.2 kg', tarih: '05.03.2026', durum: 'Devam Ediyor', musavir: 'Mehmet Demir' },
                { key: 5, firma: 'XYZ Dış Ticaret Ltd.', kod: 'KM-2024-0287', tanim: 'Kimyasal Madde',   ticari: 'Endüstriyel Boya Pigmenti', gtip: '3206.19.00.00', modelNo: 'PIG-R45', netAg: '50 kg', brutAg: '55 kg', tarih: '04.03.2026', durum: 'Tamamlandı', musavir: 'Okan Çelik' },
                { key: 6, firma: 'ABC Lojistik A.Ş.',   kod: 'EL-2024-0398', tanim: 'Elektronik Aksesuar', ticari: 'Kablosuz Kulaklık Pro', gtip: '8518.30.00.00', modelNo: 'WH-PRO3', netAg: '0.28 kg', brutAg: '0.45 kg', tarih: '03.03.2026', durum: 'Tamamlandı', musavir: 'Ersan Yılmaz' },
                { key: 7, firma: 'Mega İthalat A.Ş.',   kod: 'OT-2024-0155', tanim: 'Otomotiv Parça',    ticari: 'Fren Disk Seti Ön', gtip: '8708.30.00.00', modelNo: 'BD-F220', netAg: '8.4 kg', brutAg: '10.1 kg', tarih: '02.03.2026', durum: 'Bekliyor', musavir: 'Selin Arslan' },
                { key: 8, firma: 'XYZ Dış Ticaret Ltd.', kod: 'TX-2024-0233', tanim: 'Tekstil Ham',       ticari: 'Pamuk İplik 40/1', gtip: '5205.12.00.00', modelNo: '-', netAg: '100 kg', brutAg: '105 kg', tarih: '01.03.2026', durum: 'Tamamlandı', musavir: 'Ayşe Kaya' },
            ];

            const detailBody = (() => {
                if (r.id === 'kpi') {
                    // --- MOCK DATA FOR KPI VISUALIZATIONS ---
                    const ANA_HIZMETLER = [
                        { key: 'gtip', name: 'GTİP Tespiti', color: '#1677ff' },
                        { key: 'ihracat_kontrol', name: 'İhracat Kon. & Yaptırımlar', color: '#eb2f96' },
                        { key: 'gumruk', name: 'Gümrük Uyum', color: '#52c41a' },
                        { key: 'ithalat', name: 'İthalat Uyum', color: '#fa8c16' },
                        { key: 'ihracat', name: 'İhracat Uyum', color: '#13c2c2' },
                        { key: 'skdm', name: 'SKDM', color: '#722ed1' }
                    ];

                    const KPI_FIRMALAR = [
                        { key: 'abc', name: 'ABC Lojistik', color: '#faad14' },
                        { key: 'xyz', name: 'XYZ Ticaret', color: '#52c41a' },
                        { key: 'mega', name: 'Mega İthalat', color: '#1677ff' },
                        { key: 'doga', name: 'Doğa Tarım', color: '#eb2f96' },
                        { key: 'global', name: 'Global İnşaat', color: '#722ed1' }
                    ];

                    // Timeline için mock eşya atama verileri
                    const TIMELINE_DATA = [
                        { id: 1, esyaKodu: 'EL-2024-0341', esyaAdi: 'Elektronik Ekipman', firma: 'ABC Lojistik', sistemeGelis: '2024-03-01 09:15', havuzdanAtama: '2024-03-01 10:30', musavir: 'Ersan Yılmaz', musavirColor: '#1677ff', tamamlanma: '2024-03-03 14:20', durum: 'tamamlandi' },
                        { id: 2, esyaKodu: 'TX-2024-0178', esyaAdi: 'Tekstil Ürünleri', firma: 'XYZ Ticaret', sistemeGelis: '2024-03-01 11:00', havuzdanAtama: '2024-03-01 14:45', musavir: 'Ayşe Kaya', musavirColor: '#eb2f96', tamamlanma: null, durum: 'devam' },
                        { id: 3, esyaKodu: 'GD-2024-0441', esyaAdi: 'Gıda Ürünleri', firma: 'Doğa Tarım', sistemeGelis: '2024-03-02 08:30', havuzdanAtama: '2024-03-02 09:00', musavir: 'Selin Arslan', musavirColor: '#52c41a', tamamlanma: '2024-03-04 16:00', durum: 'tamamlandi' },
                        { id: 4, esyaKodu: 'MK-2024-0215', esyaAdi: 'Makine Parçası', firma: 'Mega İthalat', sistemeGelis: '2024-03-02 10:00', havuzdanAtama: '2024-03-02 11:30', musavir: 'Ersan Yılmaz', musavirColor: '#1677ff', tamamlanma: '2024-03-05 09:45', durum: 'tamamlandi' },
                        { id: 5, esyaKodu: 'IN-2024-0332', esyaAdi: 'İnşaat Malzemesi', firma: 'Global İnşaat', sistemeGelis: '2024-03-03 07:45', havuzdanAtama: '2024-03-03 10:15', musavir: 'Mehmet Demir', musavirColor: '#ff4d4f', tamamlanma: null, durum: 'devam' },
                        { id: 6, esyaKodu: 'KM-2024-0092', esyaAdi: 'Kimyasal Malzeme', firma: 'ABC Lojistik', sistemeGelis: '2024-03-03 14:00', havuzdanAtama: '2024-03-03 15:30', musavir: 'Ayşe Kaya', musavirColor: '#eb2f96', tamamlanma: '2024-03-06 11:00', durum: 'tamamlandi' },
                        { id: 7, esyaKodu: 'PL-2024-0067', esyaAdi: 'Plastik Hammadde', firma: 'XYZ Ticaret', sistemeGelis: '2024-03-04 09:30', havuzdanAtama: null, musavir: null, musavirColor: null, tamamlanma: null, durum: 'havuzda' },
                        { id: 8, esyaKodu: 'CM-2024-0114', esyaAdi: 'Cam Ürünleri', firma: 'Global İnşaat', sistemeGelis: '2024-03-04 13:00', havuzdanAtama: '2024-03-04 16:00', musavir: 'Selin Arslan', musavirColor: '#52c41a', tamamlanma: null, durum: 'devam' },
                    ];

                    // Filtrelenmiş veriler
                    const getFilteredData = () => {
                        if (!kpiFiltered) return { firmaToplam: [], hizmetDagilim: [], hizmetDurum: [], trendData: [], timelineData: [] };

                        let filteredTimeline = TIMELINE_DATA;
                        if (kpiFilterMode === 'firma' && kpiSelectedFirma) {
                            filteredTimeline = TIMELINE_DATA.filter(t => t.firma === kpiSelectedFirma);
                        } else if (kpiFilterMode === 'musavir' && kpiSelectedMusavir) {
                            filteredTimeline = TIMELINE_DATA.filter(t => t.musavir === kpiSelectedMusavir);
                        }

                        // Firma bazında toplam eşya
                        const firmaToplam = kpiFilterMode === 'firma' && kpiSelectedFirma
                            ? [{ name: kpiSelectedFirma, total: filteredTimeline.length }]
                            : KPI_FIRMALAR.map(f => ({ name: f.name, total: TIMELINE_DATA.filter(t => t.firma === f.name).length, fill: f.color }));

                        // Hizmet dağılımı (mock)
                        const hizmetDagilim = ANA_HIZMETLER.map(h => ({ name: h.name, value: Math.floor(Math.random() * 30 + 5), fill: h.color }));

                        // Hizmet durumu
                        const hizmetDurum = ANA_HIZMETLER.map(h => ({ name: h.name, Tamamlandı: Math.floor(Math.random() * 20 + 5), Bekliyor: Math.floor(Math.random() * 10 + 2) }));

                        // Trend verileri
                        const trendData = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => ({
                            name: day,
                            Yüklenen: Math.floor(Math.random() * 20 + 5),
                            Sınıflandırılan: Math.floor(Math.random() * 15 + 3)
                        }));

                        return { firmaToplam, hizmetDagilim, hizmetDurum, trendData, timelineData: filteredTimeline };
                    };

                    const { firmaToplam, hizmetDagilim, hizmetDurum, trendData, timelineData } = getFilteredData();

                    const handleApplyFilter = () => {
                        if (!kpiFilterMode) {
                            message.warning('Lütfen firma veya müşavir bazında filtreleme seçin.');
                            return;
                        }
                        if (kpiFilterMode === 'firma' && !kpiSelectedFirma) {
                            message.warning('Lütfen bir firma seçin.');
                            return;
                        }
                        if (kpiFilterMode === 'musavir' && !kpiSelectedMusavir) {
                            message.warning('Lütfen bir müşavir seçin.');
                            return;
                        }
                        setKpiFiltered(true);
                    };

                    const handleClearFilter = () => {
                        setKpiFilterMode(null);
                        setKpiSelectedFirma(null);
                        setKpiSelectedMusavir(null);
                        setKpiDateRange(null);
                        setKpiFiltered(false);
                    };

                    // Filtresiz boş durum
                    if (!kpiFiltered) {
                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {/* Filtre Kartı */}
                                <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div>
                                            <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12 }}>Filtreleme Türü Seçin</Text>
                                            <Segmented
                                                options={[
                                                    { label: <Space><ShopOutlined />Firma Bazında</Space>, value: 'firma' },
                                                    { label: <Space><UserOutlined />Müşavir Bazında</Space>, value: 'musavir' },
                                                ]}
                                                value={kpiFilterMode}
                                                onChange={(v) => {
                                                    setKpiFilterMode(v);
                                                    setKpiSelectedFirma(null);
                                                    setKpiSelectedMusavir(null);
                                                }}
                                                size="large"
                                                style={{ marginBottom: 16 }}
                                            />
                                        </div>

                                        {kpiFilterMode && (
                                            <Row gutter={16} align="middle">
                                                {kpiFilterMode === 'firma' && (
                                                    <Col>
                                                        <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Firma</Text>
                                                        <Select
                                                            placeholder="Firma seçin"
                                                            style={{ width: 220 }}
                                                            value={kpiSelectedFirma}
                                                            onChange={setKpiSelectedFirma}
                                                            options={KPI_FIRMALAR.map(f => ({ value: f.name, label: f.name }))}
                                                        />
                                                    </Col>
                                                )}
                                                {kpiFilterMode === 'musavir' && (
                                                    <Col>
                                                        <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Müşavir</Text>
                                                        <Select
                                                            placeholder="Müşavir seçin"
                                                            style={{ width: 220 }}
                                                            value={kpiSelectedMusavir}
                                                            onChange={setKpiSelectedMusavir}
                                                            options={MUSAVIRLER.map(m => ({ value: m.ad, label: m.ad }))}
                                                        />
                                                    </Col>
                                                )}
                                                <Col>
                                                    <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Tarih Aralığı</Text>
                                                    <RangePicker
                                                        placeholder={['Başlangıç', 'Bitiş']}
                                                        value={kpiDateRange}
                                                        onChange={setKpiDateRange}
                                                    />
                                                </Col>
                                                <Col>
                                                    <div style={{ marginTop: 22 }}>
                                                        <Button type="primary" icon={<SearchOutlined />} onClick={handleApplyFilter}>
                                                            Filtrele
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                </Card>

                                {/* Boş Durum */}
                                <Card style={{ borderRadius: 12, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                                        <BarChartOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 24 }} />
                                        <Title level={4} style={{ color: '#8c8c8c', marginBottom: 8 }}>Rapor Görüntülemek İçin Filtre Seçin</Title>
                                        <Text type="secondary" style={{ fontSize: 15 }}>
                                            Yukarıdan firma veya müşavir bazında filtreleme yaparak KPI verilerini görüntüleyebilirsiniz.
                                        </Text>
                                    </div>
                                </Card>
                            </div>
                        );
                    }

                    // Filtrelenmiş veri gösterimi
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Aktif Filtre Bilgisi */}
                            <Card size="small" style={{ borderRadius: 10, background: '#f6ffed', borderColor: '#b7eb8f' }}>
                                <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <Space>
                                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                        <Text strong>Aktif Filtre:</Text>
                                        {kpiFilterMode === 'firma' && <Tag color="blue" icon={<ShopOutlined />}>{kpiSelectedFirma}</Tag>}
                                        {kpiFilterMode === 'musavir' && <Tag color="purple" icon={<UserOutlined />}>{kpiSelectedMusavir}</Tag>}
                                        {kpiDateRange && <Tag color="cyan">{kpiDateRange[0]?.format('DD.MM.YYYY')} - {kpiDateRange[1]?.format('DD.MM.YYYY')}</Tag>}
                                    </Space>
                                    <Button size="small" icon={<CloseOutlined />} onClick={handleClearFilter}>Filtreyi Temizle</Button>
                                </Space>
                            </Card>

                            <Row gutter={[16, 16]}>
                                {/* 1. Bar Chart - Firma veya Müşavir Bazında Eşya Sayısı */}
                                <Col xs={24} lg={12}>
                                    <Card title={<span style={{ display: 'flex', alignItems: 'center' }}><BarChartOutlined style={{ marginRight: 8, color: '#1677ff' }} />{kpiFilterMode === 'firma' ? 'Firma Eşya Sayısı' : 'Müşavir Bazında Eşya'}</span>} style={{ borderRadius: 12, height: '100%' }}>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <BarChart data={firmaToplam} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" tick={{fontSize: 11}} />
                                                <YAxis tick={{fontSize: 11}} />
                                                <RTooltip />
                                                <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={40} name="Eşya Sayısı">
                                                    {firmaToplam.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill || '#1677ff'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>

                                {/* 2. Pie Chart - Hizmet Dağılımı */}
                                <Col xs={24} lg={12}>
                                    <Card title={<span style={{ display: 'flex', alignItems: 'center' }}><PieChartOutlined style={{ marginRight: 8, color: '#eb2f96' }} />Hizmet Bazında Dağılım</span>} style={{ borderRadius: 12, height: '100%' }}>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <PieChart>
                                                <Pie
                                                    data={hizmetDagilim}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={90}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name.substring(0, 10)}... ${(percent * 100).toFixed(0)}%`}
                                                    labelLine={{ stroke: '#8c8c8c', strokeWidth: 1 }}
                                                >
                                                    {hizmetDagilim.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Pie>
                                                <RTooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>

                                {/* 3. Stacked Bar - Sınıflandırma Durumu */}
                                <Col xs={24} lg={12}>
                                    <Card title={<span style={{ display: 'flex', alignItems: 'center' }}><ProjectOutlined style={{ marginRight: 8, color: '#52c41a' }} />Sınıflandırma Durumu</span>} style={{ borderRadius: 12, height: '100%' }}>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={hizmetDurum} margin={{ top: 20, right: 30, left: 0, bottom: 65 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" tick={{fontSize: 10}} angle={-45} textAnchor="end" />
                                                <YAxis tick={{fontSize: 11}} />
                                                <RTooltip />
                                                <Legend wrapperStyle={{ bottom: 0 }} />
                                                <Bar dataKey="Tamamlandı" stackId="a" fill="#52c41a" radius={[0, 0, 4, 4]} barSize={30} />
                                                <Bar dataKey="Bekliyor" stackId="a" fill="#faad14" radius={[4, 4, 0, 0]} barSize={30} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>

                                {/* 4. Area Chart - Trend */}
                                <Col xs={24} lg={12}>
                                    <Card title={<span style={{ display: 'flex', alignItems: 'center' }}><LineChartOutlined style={{ marginRight: 8, color: '#722ed1' }} />Haftalık Trend</span>} style={{ borderRadius: 12, height: '100%' }}>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                                <defs>
                                                    <linearGradient id="colorYukKpi" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#1677ff" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#1677ff" stopOpacity={0}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorSinifKpi" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#52c41a" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" tick={{fontSize: 11}} />
                                                <YAxis tick={{fontSize: 11}} />
                                                <RTooltip />
                                                <Legend />
                                                <Area type="monotone" dataKey="Yüklenen" stroke="#1677ff" strokeWidth={2} fillOpacity={1} fill="url(#colorYukKpi)" />
                                                <Area type="monotone" dataKey="Sınıflandırılan" stroke="#52c41a" strokeWidth={2} fillOpacity={1} fill="url(#colorSinifKpi)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>

                                {/* 5. Timeline - Müşavir Atama Süreci (Dikey) */}
                                <Col xs={24}>
                                    <Card
                                        title={<span style={{ display: 'flex', alignItems: 'center' }}><ClockCircleOutlined style={{ marginRight: 8, color: '#13c2c2' }} />Eşya Atama Timeline</span>}
                                        style={{ borderRadius: 12 }}
                                    >
                                        <Row gutter={[24, 24]}>
                                            {timelineData.map((item) => (
                                                <Col xs={24} sm={12} lg={8} xl={6} key={item.id}>
                                                    <Card
                                                        size="small"
                                                        style={{
                                                            borderRadius: 10,
                                                            border: `2px solid ${item.durum === 'tamamlandi' ? '#52c41a' : item.durum === 'devam' ? '#1677ff' : '#faad14'}`,
                                                            height: '100%'
                                                        }}
                                                    >
                                                        {/* Eşya Başlık */}
                                                        <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                                                            <Text strong style={{ fontSize: 14, display: 'block' }}>{item.esyaKodu}</Text>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>{item.esyaAdi}</Text>
                                                            <div style={{ marginTop: 6 }}>
                                                                <Tag>{item.firma}</Tag>
                                                                {item.musavir && <Tag color={item.musavirColor} icon={<UserOutlined />}>{item.musavir.split(' ')[0]}</Tag>}
                                                            </div>
                                                        </div>

                                                        {/* Dikey Timeline */}
                                                        <div style={{ position: 'relative', paddingLeft: 24 }}>
                                                            {/* Dikey Çizgi */}
                                                            <div style={{
                                                                position: 'absolute',
                                                                left: 7,
                                                                top: 8,
                                                                bottom: 8,
                                                                width: 2,
                                                                background: 'linear-gradient(to bottom, #1677ff 0%, #52c41a 50%, #722ed1 100%)',
                                                                borderRadius: 2
                                                            }} />

                                                            {/* Adım 1: Sisteme Giriş */}
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 20, position: 'relative' }}>
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    left: -24,
                                                                    width: 16,
                                                                    height: 16,
                                                                    borderRadius: '50%',
                                                                    background: '#1677ff',
                                                                    border: '3px solid #e6f4ff',
                                                                    boxShadow: '0 0 0 2px #1677ff'
                                                                }} />
                                                                <div style={{ flex: 1 }}>
                                                                    <Text strong style={{ fontSize: 12, color: '#1677ff', display: 'block' }}>Sisteme Giriş</Text>
                                                                    <Text style={{ fontSize: 13 }}>{item.sistemeGelis}</Text>
                                                                </div>
                                                            </div>

                                                            {/* Adım 2: Havuzdan Atama */}
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 20, position: 'relative' }}>
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    left: -24,
                                                                    width: 16,
                                                                    height: 16,
                                                                    borderRadius: '50%',
                                                                    background: item.havuzdanAtama ? '#52c41a' : '#d9d9d9',
                                                                    border: `3px solid ${item.havuzdanAtama ? '#f6ffed' : '#fafafa'}`,
                                                                    boxShadow: item.havuzdanAtama ? '0 0 0 2px #52c41a' : 'none'
                                                                }} />
                                                                <div style={{ flex: 1 }}>
                                                                    <Text strong style={{ fontSize: 12, color: item.havuzdanAtama ? '#52c41a' : '#8c8c8c', display: 'block' }}>Müşavire Atama</Text>
                                                                    {item.havuzdanAtama ? (
                                                                        <>
                                                                            <Text style={{ fontSize: 13 }}>{item.havuzdanAtama}</Text>
                                                                            <div><Tag size="small" color={item.musavirColor}>{item.musavir}</Tag></div>
                                                                        </>
                                                                    ) : (
                                                                        <Text type="secondary" style={{ fontSize: 12 }}>Henüz atanmadı</Text>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Adım 3: Tamamlanma */}
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    left: -24,
                                                                    width: 16,
                                                                    height: 16,
                                                                    borderRadius: '50%',
                                                                    background: item.tamamlanma ? '#722ed1' : '#d9d9d9',
                                                                    border: `3px solid ${item.tamamlanma ? '#f9f0ff' : '#fafafa'}`,
                                                                    boxShadow: item.tamamlanma ? '0 0 0 2px #722ed1' : 'none'
                                                                }} />
                                                                <div style={{ flex: 1 }}>
                                                                    <Text strong style={{ fontSize: 12, color: item.tamamlanma ? '#722ed1' : '#8c8c8c', display: 'block' }}>Tamamlanma</Text>
                                                                    {item.tamamlanma ? (
                                                                        <Text style={{ fontSize: 13 }}>{item.tamamlanma}</Text>
                                                                    ) : (
                                                                        <Tag color={item.durum === 'devam' ? 'processing' : 'warning'} style={{ marginTop: 2 }}>
                                                                            {item.durum === 'devam' ? 'Devam Ediyor' : 'Havuzda Bekliyor'}
                                                                        </Tag>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Card>
                                </Col>

                                {/* 6. Hizmet Dağılımı - Geliştirilmiş Tablo Görünümü (Treemap yerine) */}
                                <Col xs={24}>
                                    <Card
                                        title={<span style={{ display: 'flex', alignItems: 'center' }}><BlockOutlined style={{ marginRight: 8, color: '#13c2c2' }} />Hizmet Dağılımı Detayı</span>}
                                        style={{ borderRadius: 12 }}
                                    >
                                        <Row gutter={[16, 16]}>
                                            {ANA_HIZMETLER.map((hizmet, idx) => {
                                                const value = hizmetDagilim.find(h => h.name === hizmet.name)?.value || 0;
                                                const total = hizmetDagilim.reduce((sum, h) => sum + h.value, 0);
                                                const percent = total > 0 ? Math.round((value / total) * 100) : 0;

                                                return (
                                                    <Col xs={24} sm={12} lg={8} key={hizmet.key}>
                                                        <Card
                                                            size="small"
                                                            style={{
                                                                borderRadius: 10,
                                                                borderLeft: `4px solid ${hizmet.color}`,
                                                                height: '100%'
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                                                <Text strong style={{ fontSize: 14 }}>{hizmet.name}</Text>
                                                                <Tag color={hizmet.color}>{value} eşya</Tag>
                                                            </div>
                                                            <Progress
                                                                percent={percent}
                                                                strokeColor={hizmet.color}
                                                                size="small"
                                                                format={p => `${p}%`}
                                                            />
                                                        </Card>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    );
                }
                if (r.id === 'vergi') return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <Card style={{ borderRadius: 12, border: '2px dashed #e8e8e8', background: '#fafafa' }} styles={{ body: { padding: 32, textAlign: 'center' } }}>
                            <DownloadOutlined style={{ fontSize: 40, color: COLORS.primary, marginBottom: 12 }} />
                            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>GTİP Excel Şablonunu İndirin</div>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>TR GTİP, Eşya Kodu ve Eşya Tanımı sütunlarını doldurun, ardından yükleyin.</Text>
                            <Space>
                                <Button type="primary" icon={<DownloadOutlined />} onClick={() => message.success('Şablon indirildi')}>Şablonu İndir</Button>
                                <Button icon={<FileExcelOutlined />} onClick={() => { setVergiExcelUploaded(true); message.info('Dosya yüklendi — sorgulama başlatılıyor...'); }}>Doldurulmuş Dosyayı Yükle</Button>
                            </Space>
                        </Card>

                        {!vergiExcelUploaded ? (
                            <Card style={{ borderRadius: 12, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <FileExcelOutlined style={{ fontSize: 56, color: '#d9d9d9', marginBottom: 20 }} />
                                    <Title level={4} style={{ color: '#8c8c8c', marginBottom: 8 }}>Vergi Sorgulaması İçin Excel Yükleyin</Title>
                                    <Text type="secondary" style={{ fontSize: 14 }}>
                                        Yukarıdan şablonu indirip doldurduktan sonra yükleyin.
                                    </Text>
                                </div>
                            </Card>
                        ) : (
                            <Card title="Vergi Sorgulama Sonuçları" style={{ borderRadius: 12 }}>
                                <Table
                                    size="middle"
                                    pagination={false}
                                    dataSource={vergiMock}
                                    scroll={{ x: 1200 }}
                                    columns={[
                                        { title: 'TR GTİP', dataIndex: 'trGtip', width: 140, fixed: 'left', render: v => <Text strong style={{ fontFamily: 'monospace' }}>{v}</Text> },
                                        { title: 'Eşya Kodu', dataIndex: 'kod', width: 130, render: kodCell },
                                        { title: 'Eşya Tanımı', dataIndex: 'tanim', width: 180 },
                                        { title: 'Gümrük Vergisi Oranı', dataIndex: 'gumruk', width: 140, align: 'center' },
                                        { title: 'KDV Oranı', dataIndex: 'kdv', width: 100, align: 'center' },
                                        { title: 'ÖTV Oranı', dataIndex: 'otv', width: 100, align: 'center' },
                                        { title: 'Diğer Ek Vergiler', dataIndex: 'diger', width: 120, align: 'center' },
                                        { title: 'Toplam Vergi', dataIndex: 'toplam', width: 130, align: 'center', fixed: 'right', render: v => <Tag color="blue" style={{ fontWeight: 600 }}>{v}</Tag> },
                                    ]}
                                />
                            </Card>
                        )}
                    </div>
                );
                if (r.id === 'gtip') {
                    return <GtipKarsilastirmaReport />;
                }
                // firma
                const filteredFirmaData = firmaRaporFiltered
                    ? firmaMock.filter(item => {
                        const firmaMatch = !firmaRaporFirma || item.firma === firmaRaporFirma;
                        return firmaMatch;
                    })
                    : [];

                const handleFirmaFilter = () => {
                    if (!firmaRaporFirma && !firmaRaporDateRange) {
                        message.warning('Lütfen en az firma veya tarih aralığı seçin.');
                        return;
                    }
                    setFirmaRaporFiltered(true);
                };

                const handleFirmaExportExcel = () => {
                    if (filteredFirmaData.length === 0) {
                        message.warning('Dışa aktarılacak veri bulunamadı.');
                        return;
                    }
                    const exportData = filteredFirmaData.map(item => ({
                        'Firma Adı': item.firma,
                        'Eşya Kodu': item.kod,
                        'Eşya Tanımı': item.tanim,
                        'Eşya Ticari Tanımı': item.ticari,
                        'GTİP': item.gtip,
                        'Model No': item.modelNo,
                        'Net Ağırlık': item.netAg,
                        'Brüt Ağırlık': item.brutAg,
                        'Oluşturulma Tarihi': item.tarih,
                        'Sınıflandırma Durumu (Hizmet Bazlı)': item.durum,
                        'Sınıflandıran Müşavir (Hizmet Bazlı)': item.musavir,
                    }));
                    exportToExcel(exportData, 'Esya', 'Firma_Bazli_Esya_Raporu');
                    message.success('Excel dosyası indirildi.');
                };

                const handleFirmaExportCSV = () => {
                    if (filteredFirmaData.length === 0) {
                        message.warning('Dışa aktarılacak veri bulunamadı.');
                        return;
                    }
                    const headers = ['Firma Adı', 'Eşya Kodu', 'Eşya Tanımı', 'Eşya Ticari Tanımı', 'GTİP', 'Model No', 'Net Ağırlık', 'Brüt Ağırlık', 'Oluşturulma Tarihi', 'Sınıflandırma Durumu (Hizmet Bazlı)', 'Sınıflandıran Müşavir (Hizmet Bazlı)'];
                    const csvContent = [
                        headers.join(';'),
                        ...filteredFirmaData.map(item => [
                            item.firma, item.kod, item.tanim, item.ticari, item.gtip, item.modelNo, item.netAg, item.brutAg, item.tarih, item.durum, item.musavir
                        ].join(';'))
                    ].join('\n');
                    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'Firma_Bazli_Esya_Raporu.csv';
                    link.click();
                    message.success('CSV dosyası indirildi.');
                };

                const firmaRaporColumns = [
                    { title: 'Firma Adı', dataIndex: 'firma', width: 180, fixed: 'left', render: v => <Text strong>{v}</Text> },
                    { title: 'Eşya Kodu', dataIndex: 'kod', width: 130, render: kodCell },
                    { title: 'Eşya Tanımı', dataIndex: 'tanim', width: 180, ellipsis: true },
                    { title: 'Eşya Ticari Tanımı', dataIndex: 'ticari', width: 200, ellipsis: true },
                    { title: 'GTİP', dataIndex: 'gtip', width: 140, render: v => <Text style={{ fontFamily: 'monospace' }}>{v}</Text> },
                    { title: 'Model No', dataIndex: 'modelNo', width: 110, align: 'center' },
                    { title: 'Net Ağırlık', dataIndex: 'netAg', width: 100, align: 'center' },
                    { title: 'Brüt Ağırlık', dataIndex: 'brutAg', width: 100, align: 'center' },
                    { title: 'Oluşturulma Tarihi', dataIndex: 'tarih', width: 130 },
                    { title: 'Sınıflandırma Durumu (Hizmet Bazlı)', dataIndex: 'durum', width: 200, render: v => <Tag color={v === 'Tamamlandı' ? 'success' : v === 'Devam Ediyor' ? 'processing' : 'warning'}>{v}</Tag> },
                    { title: 'Sınıflandıran Müşavir (Hizmet Bazlı)', dataIndex: 'musavir', width: 200, fixed: 'right' },
                ];

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <Card size="small" style={{ borderRadius: 10 }}>
                            <Space wrap>
                                <Select
                                    placeholder="Firma Seçin"
                                    style={{ width: 220 }}
                                    value={firmaRaporFirma}
                                    onChange={(v) => { setFirmaRaporFirma(v); setFirmaRaporFiltered(false); }}
                                    allowClear
                                    options={FIRMA_RAPOR_FIRMALAR.map(f => ({ value: f.name, label: f.name }))}
                                />
                                <RangePicker
                                    placeholder={['Başlangıç', 'Bitiş']}
                                    value={firmaRaporDateRange}
                                    onChange={(dates) => { setFirmaRaporDateRange(dates); setFirmaRaporFiltered(false); }}
                                />
                                <Button type="primary" icon={<SearchOutlined />} onClick={handleFirmaFilter}>Filtrele</Button>
                                <Dropdown
                                    menu={{
                                        items: [
                                            { key: 'excel', label: 'Excel (.xlsx)', icon: <FileExcelOutlined />, onClick: handleFirmaExportExcel },
                                            { key: 'csv', label: 'CSV (.csv)', icon: <DownloadOutlined />, onClick: handleFirmaExportCSV },
                                        ]
                                    }}
                                    disabled={!firmaRaporFiltered || filteredFirmaData.length === 0}
                                >
                                    <Button icon={<DownloadOutlined />}>Dışa Aktar</Button>
                                </Dropdown>
                            </Space>
                        </Card>

                        {!firmaRaporFiltered ? (
                            <Card style={{ borderRadius: 12, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <ShopOutlined style={{ fontSize: 56, color: '#d9d9d9', marginBottom: 20 }} />
                                    <Title level={4} style={{ color: '#8c8c8c', marginBottom: 8 }}>Eşya Listesi İçin Filtre Uygulayın</Title>
                                    <Text type="secondary" style={{ fontSize: 14 }}>
                                        Firma ve/veya tarih aralığı seçerek filtreleme yapın.
                                    </Text>
                                </div>
                            </Card>
                        ) : (
                            <Card style={{ borderRadius: 12 }}>
                                <Table
                                    size="middle"
                                    pagination={{ pageSize: 10 }}
                                    dataSource={filteredFirmaData}
                                    scroll={{ x: 1600 }}
                                    columns={firmaRaporColumns}
                                    rowKey="key"
                                />
                            </Card>
                        )}
                    </div>
                );
            })();

            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => { navigate('/rapor-deneme'); }} type="text" size="large" />
                        <div style={{ flex: 1 }}>
                            <Title level={4} style={{ margin: 0 }}>{r.title}</Title>
                            <Text type="secondary">{r.desc}</Text>
                        </div>
                        <Space wrap>
                            <Input 
                                placeholder="Rapor Adı giriniz..." 
                                style={{ width: 220 }} 
                                value={reportTitle} 
                                onChange={e => setReportTitle(e.target.value)}
                                prefix={<EditOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                            />
                            <Button 
                                icon={<SaveOutlined />} 
                                type="primary" 
                                onClick={() => {
                                    handleSaveHazirReport(r.id, reportTitle || r.title);
                                    setReportTitle('');
                                }}
                            >
                                Kaydet
                            </Button>
                            <Button icon={<DownloadOutlined />} onClick={() => message.success('Rapor Excel olarak indirildi')}>İndir</Button>
                        </Space>
                    </div>
                    {detailBody}
                </div>
            );
        }

// ── Hazır Raporlar ───────────────────────────────────
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Rapor Oluştur</Title>
                    <Text type="secondary">Hazır raporlar arasından seçin.</Text>
                </div>
                <Row gutter={[16, 16]}>
                    {HAZIR_RAPORLAR_DATA.map(r => (
                        <Col xs={24} sm={12} lg={6} key={r.id}>
                            <Card hoverable onClick={() => setSelectedHazirReport(r)}
                                style={{ borderRadius: 6, border: '1px solid #e5e7eb', height: '100%', cursor: 'pointer' }}
                                styles={{ body: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 24, gap: 8 } }}
                            >
                                <Tag color={r.color} style={{ alignSelf: 'flex-start', borderRadius: 12, marginBottom: 4 }}>{r.topic}</Tag>
                                {rIcon(r)}
                                <Title level={5} style={{ margin: 0 }}>{r.title}</Title>
                                <Text type="secondary" style={{ fontSize: 13 }}>{r.desc}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        );
    };




    // Raporlarım kategorileri (hazır raporlardaki 4 kategori)
    const RAPORLARIM_CATEGORIES = [
        { key: 'performans', label: 'KPI Raporu', color: '#1677ff' },
        { key: 'vergi', label: 'Toplu TR Vergi Sorgulama', color: '#faad14' },
        { key: 'karsilastirma', label: 'GTİP Karşılaştırma & Ülke Vergi', color: '#722ed1' },
        { key: 'musteri', label: 'Firma Bazlı Eşya Raporu', color: '#52c41a' },
    ];

    const reportListCols = [
        {
            title: 'Rapor Başlığı',
            dataIndex: 'title',
            key: 'title',
            render: v => <Text strong>{v}</Text>,
            filters: Array.from(new Set(generatedReports.map(r => r.title))).map(t => ({ text: t, value: t })),
            onFilter: (value, record) => record.title === value,
        },
        {
            title: 'Kategori',
            dataIndex: 'category',
            key: 'category',
            render: v => {
                const cat = RAPORLARIM_CATEGORIES.find(c => c.key === v) || RAPORLARIM_CATEGORIES[0];
                return <Tag color={cat.color}>{cat.label}</Tag>;
            },
            filters: RAPORLARIM_CATEGORIES.map(c => ({ text: c.label, value: c.key })),
            onFilter: (value, record) => (record.category || 'performans') === value,
        },
        { title: 'Oluşturan', dataIndex: 'createdBy', key: 'createdBy', render: v => v || 'Sistem' },
        { title: 'Tarih', dataIndex: 'date', key: 'date', render: v => new Date(v).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }) },
        { title: 'Eşya Sayısı', dataIndex: 'items', key: 'items', render: v => <Tag color="blue">{(v?.length || 0)} eşya</Tag> },
        {
            title: '', key: 'actions', width: 180, fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Düzenle"><Button size="small" type="text" icon={<EditOutlined />} onClick={() => handleEditReport(record)} /></Tooltip>
                    <Tooltip title="Paylaş"><Button size="small" type="text" icon={<SendOutlined />} onClick={() => { setReportToShare(record); setShareModalVisible(true); }} /></Tooltip>
                    <Tooltip title="İndir"><Button size="small" type="text" icon={<DownloadOutlined />} onClick={() => exportToExcel(record.items || [], 'Rapor', record.title)} /></Tooltip>
                    <Popconfirm title="Silmek istediğinize emin misiniz?" onConfirm={() => handleDeleteReport(record.id)} okText="Evet" cancelText="İptal">
                        <Tooltip title="Sil"><Button size="small" type="text" danger icon={<DeleteOutlined />} /></Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const renderReportList = (data) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/rapor-deneme')} type="text" size="large" />
                    <Title level={4} style={{ margin: 0 }}>Raporlarım</Title>
                </div>
                {data.length === 0 ? (
                    <Card style={{ borderRadius: 6, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                        <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                            <FolderOpenOutlined style={{ fontSize: 48, marginBottom: 16, color: '#ccc' }} /><br />
                            Henüz kaydedilmiş raporunuz bulunmuyor.
                        </div>
                    </Card>
                ) : (
                    <Card style={{ borderRadius: 6, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                        <Table
                            columns={reportListCols}
                            dataSource={data}
                            rowKey="id"
                            pagination={data.length > 10 ? { pageSize: 10 } : false}
                            size="middle"
                            scroll={{ x: 900 }}
                        />
                    </Card>
                )}
            </div>
        );
    };


    // Main layout tabs
    const mainTabs = [
        { key: 'create', label: <span><FormOutlined /> Rapor Oluştur</span>, children: renderCreateReport() },
        { key: 'myreports', label: <span><FolderOpenOutlined /> Raporlarım</span>, children: renderReportList(generatedReports) },
        {
            key: 'yonetici',
            label: <span><TrophyOutlined /> Yönetici Raporu</span>,
            children: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                    <Button type="primary" size="large" icon={<TrophyOutlined />} onClick={() => navigate('/reports/kpi')}
                        style={{ borderRadius: 8, fontWeight: 600 }}>
                        Yönetici Performans Raporu'nu Aç
                    </Button>
                </div>
            ),
        },
    ];

    const hideTabBar = searchParams.has('tab') || searchParams.has('report');

    return (
        <div style={{ paddingBottom: 40 }}>
            {hideTabBar ? (
                mainTabs.find(t => t.key === activeTab)?.children
            ) : (
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => { if (key === 'yonetici') { navigate('/reports/kpi'); } else { setActiveTab(key); } }}
                    items={mainTabs}
                    size="large"
                    tabBarStyle={{ marginBottom: 24, background: 'white', padding: '0 20px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                />
            )}

            {/* ─── Report Generation Loading Overlay ───────────────────────── */}
            {reportLoadingVisible && (() => {
                const STEPS = [
                    { label: 'Eşya verileri derleniyor', sub: 'Katalog kayıtları taranıyor...' },
                    { label: 'Rapor şablonu uygulanıyor', sub: 'Biçimlendirme kuralları işleniyor...' },
                    { label: 'Çıktı formatlanıyor', sub: 'Dosya hazırlanıyor...' },
                ];
                return (
                    <>
                        <style>{`
                            @keyframes rg-fade-in    { from{opacity:0}                          to{opacity:1} }
                            @keyframes rg-card-up    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                            @keyframes rg-beam-rotate{ from{transform:rotate(0deg)}              to{transform:rotate(360deg)} }
                            @keyframes rg-spin       { from{transform:rotate(0deg)}              to{transform:rotate(360deg)} }
                            @keyframes rg-dot-blink  {
                                0%,20%{opacity:0} 50%{opacity:1} 80%,100%{opacity:0}
                            }
                            @keyframes rg-slot-out {
                                from { transform:translateY(0);    opacity:1; }
                                to   { transform:translateY(-115%); opacity:0; }
                            }
                            @keyframes rg-slot-in {
                                from { transform:translateY(115%);  opacity:0; }
                                to   { transform:translateY(0);    opacity:1; }
                            }
                            .rg-dot-1 { animation: rg-dot-blink 1.5s ease-in-out 0s   infinite; }
                            .rg-dot-2 { animation: rg-dot-blink 1.5s ease-in-out 0.3s infinite; }
                            .rg-dot-3 { animation: rg-dot-blink 1.5s ease-in-out 0.6s infinite; }
                            .rg-slot-out { animation: rg-slot-out 0.5s cubic-bezier(.4,0,.6,1) forwards; }
                            .rg-slot-in  { animation: rg-slot-in  0.5s cubic-bezier(.2,1,.4,1) forwards; }
                        `}</style>

                        {/* ── Full-screen backdrop ── */}
                        <div style={{
                            position: 'fixed', inset: 0, zIndex: 1050,
                            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                            background: 'rgba(240,246,255,0.55)',
                            animation: 'rg-fade-in 0.3s ease',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden',
                        }}>
                            {/* beam rays */}
                            <div style={{
                                position: 'absolute', width: 900, height: 900,
                                top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                                animation: 'rg-beam-rotate 18s linear infinite', pointerEvents: 'none',
                            }}>
                                {[0, 30, 60, 90, 120, 150].map(deg => (
                                    <div key={deg} style={{
                                        position: 'absolute', top: '50%', left: '50%',
                                        width: 420, height: 2, transformOrigin: '0 50%',
                                        transform: `rotate(${deg}deg)`,
                                        background: 'linear-gradient(to right,rgba(22,119,255,0.18),rgba(22,119,255,0.04) 60%,transparent)',
                                        filter: 'blur(3px)',
                                    }} />
                                ))}
                            </div>
                            {/* radial glow */}
                            <div style={{
                                position: 'absolute', width: 500, height: 500,
                                top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                                background: 'radial-gradient(circle,rgba(22,119,255,0.12) 0%,transparent 70%)',
                                pointerEvents: 'none',
                            }} />

                            {/* ── Content ── */}
                            <div style={{
                                position: 'relative', zIndex: 1, width: 320,
                                animation: 'rg-card-up 0.4s ease',
                                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16,
                            }}>
                                {/* ── Slot ticker ── */}
                                <div style={{
                                    width: 300, height: 80,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                                }}>
                                    {/* Exiting step */}
                                    {reportExitingStep !== null && (
                                        <div key={`exit-${reportExitingStep}`} className="rg-slot-out" style={{
                                            position: 'absolute', width: '100%',
                                            display: 'flex', alignItems: 'center', gap: 14,
                                        }}>
                                            <div style={{
                                                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                                                background: 'rgba(22,119,255,0.08)',
                                                border: '1.5px solid rgba(22,119,255,0.35)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <span style={{ fontSize: 13, color: 'rgba(22,119,255,0.6)' }}>✓</span>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 16, fontWeight: 500, color: 'rgba(30,40,80,0.45)', lineHeight: 1.3, display: 'inline-flex', alignItems: 'baseline', gap: 2 }}>
                                                    {STEPS[reportExitingStep]?.label}
                                                </div>
                                                <div style={{ fontSize: 14, color: 'rgba(80,90,120,0.3)', marginTop: 2 }}>
                                                    {STEPS[reportExitingStep]?.sub}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Active / entering step */}
                                    <div
                                        key={`active-${reportActiveStep}`}
                                        className={reportExitingStep !== null ? 'rg-slot-in' : ''}
                                        style={{
                                            position: 'absolute', width: '100%',
                                            display: 'flex', alignItems: 'center', gap: 14,
                                        }}
                                    >
                                        <div style={{
                                            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                                            background: 'rgba(22,119,255,0.07)',
                                            border: '1.5px solid rgba(22,119,255,0.25)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <div style={{
                                                width: 12, height: 12, borderRadius: '50%',
                                                border: '1.5px solid transparent',
                                                borderTopColor: 'rgba(22,119,255,0.7)',
                                                animation: 'rg-spin 0.9s linear infinite',
                                            }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(30,40,80,0.78)', lineHeight: 1.3, display: 'inline-flex', alignItems: 'baseline', gap: 2 }}>
                                                {STEPS[reportActiveStep]?.label}
                                                <span className="rg-dot-1" style={{ fontSize: 22, color: 'rgba(22,119,255,0.6)', lineHeight: 1, marginLeft: 2 }}>·</span>
                                                <span className="rg-dot-2" style={{ fontSize: 22, color: 'rgba(22,119,255,0.6)', lineHeight: 1 }}>·</span>
                                                <span className="rg-dot-3" style={{ fontSize: 22, color: 'rgba(22,119,255,0.6)', lineHeight: 1 }}>·</span>
                                            </div>
                                            <div style={{ fontSize: 14, color: 'rgba(80,90,120,0.48)', marginTop: 2 }}>
                                                {STEPS[reportActiveStep]?.sub}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </>
                );
            })()}

            <Modal
                title={<span><SendOutlined /> Raporu Paylaş</span>}
                open={shareModalVisible}
                onCancel={() => setShareModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShareModalVisible(false)}>İptal</Button>,
                    <Button key="send" type="primary" onClick={handleShareEmailSubmit} disabled={!shareEmail.includes('@')}>Gönder</Button>,
                ]}
            >
                <p><strong>{reportToShare?.title}</strong> adlı raporu e-posta olarak gönderin:</p>
                <Input
                    type="email"
                    placeholder="E-posta adresi girin... (ör: user@example.com)"
                    value={shareEmail}
                    onChange={e => setShareEmail(e.target.value)}
                    onPressEnter={handleShareEmailSubmit}
                />
            </Modal>

            <Modal
                title={<span><PlusOutlined /> Yeni Şablon Ekle</span>}
                open={isTemplateModalOpen}
                onCancel={() => setIsTemplateModalOpen(false)}
                onOk={handleAddTemplate}
                okText="Oluştur"
                cancelText="İptal"
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                        <Text strong>Şablon Adı</Text>
                        <Input
                            placeholder="Örn: Haftalık Özet Raporu"
                            value={newTemplate.title}
                            onChange={e => setNewTemplate({ ...newTemplate, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <Text strong>Konu Seçimi</Text>
                        <Select
                            placeholder="Bir konu seçin"
                            style={{ width: '100%' }}
                            value={newTemplate.topic || undefined}
                            onChange={val => setNewTemplate({ ...newTemplate, topic: val })}
                            options={[
                                { value: 'Performans', label: 'Performans' },
                                { value: 'Müşteri', label: 'Müşteri' },
                                { value: 'Vergi', label: 'Vergi' },
                                { value: 'Yapay Zeka', label: 'Yapay Zeka' },
                                { value: 'Genel', label: 'Genel' },
                            ]}
                        />
                    </div>
                    <div>
                        <Text strong>Açıklama</Text>
                        <Input.TextArea
                            placeholder="Şablonun ne hakkında olduğunu kısaca açıklayın"
                            value={newTemplate.desc}
                            onChange={e => setNewTemplate({ ...newTemplate, desc: e.target.value })}
                        />
                    </div>
                </Space>
            </Modal>

            <Drawer
                title={<span><InfoCircleOutlined /> Şablon Özellikleri</span>}
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={360}
            >
                {activeTemplateForDrawer && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div>
                            <Title level={5} style={{ margin: '0 0 8px 0' }}>{activeTemplateForDrawer.title}</Title>
                            <Tag color={getTopicTagColor(activeTemplateForDrawer.topic)}>{activeTemplateForDrawer.topic || 'Genel'}</Tag>
                            <div style={{ marginTop: 12 }}>
                                <Text type="secondary">{activeTemplateForDrawer.desc}</Text>
                            </div>
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <div>
                            <Title level={5}>Sistem Özellikleri</Title>
                            <ul style={{ paddingLeft: 20, color: '#555', lineHeight: 2 }}>
                                <li>Özel Rapor Çıktısı Aktif</li>
                                <li>PDF / Excel İndirme Aktif</li>
                                <li>Mail Gönderim Desteği</li>
                                <li>Otomatik Kaydetme Desteği</li>
                                <li>Veri Filtreleme Kuralları</li>
                            </ul>
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <div>
                            <Title level={5}>Durum</Title>
                            <Tag color="success">Aktif ve Kullanıma Uygun</Tag>
                        </div>
                    </Space>
                )}
            </Drawer>
        </div>
    );
}


import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Card, Typography, Row, Col, Input, Select, Button, Table, Tag,
    Drawer, Switch, Checkbox, DatePicker, Dropdown, Segmented,
    Divider, Modal, Skeleton, Radio,
} from 'antd';
import {
    SearchOutlined,
    CloseOutlined,
    AppstoreOutlined, UnorderedListOutlined,
    BulbOutlined, ControlOutlined,
} from '@ant-design/icons';
import './BTBPage.css';

const { Title, Text } = Typography;
// ─── Mock Data ───────────────────────────────────────────────────────────────

const CARPET_IMG = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=200&fit=crop';
const PHONE_IMG  = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop';
const TABLE_IMG  = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop';
const WATCH_IMG  = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop';
const SHOE_IMG   = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop';

const STATUSES = ['Yürürlükte', 'İptal', 'Mülga'];
const IMAGES   = [CARPET_IMG, PHONE_IMG, TABLE_IMG, WATCH_IMG, SHOE_IMG];

const GUMRUKLER = [
    'İstanbul Gümrük İdares', 'İzmir Gümrük Dairesi', 'Ankara Gümrük Ofisi',
    'Bursa Gümrük Müdürlüğü', 'Adana Gümrük Kontrol', 'Mersin Gümrük Şube M.',
    'Gaziantep Gümrük Yön.', 'Trabzon Gümrük Sınır K.',
];

const TANIMLAR = [
    'El yapımı seramik vazo', 'Klasik deri cüzdan', 'Ünlü lavanta kokulu mu',
    'Şık deri çanta', 'Renkli seramik tabak', 'Meşhur tahta ayakkabı',
    'Klasik tasarım saat', 'İthal el örgüsü yün atki',
];

const MOCK_DATA = Array.from({ length: 32 }, (_, i) => ({
    key: String(i + 1),
    btbNo: `2024-24137`,
    refNo: `TR · TR410000260002`,
    gtip: `8471.30.${String(i).padStart(2, '0')}`,
    tanim: TANIMLAR[i % TANIMLAR.length],
    tanimUzun: `${TANIMLAR[i % TANIMLAR.length]}. Ürün ambalajında üretici bilgileri, seri numarası ve CE işareti bulunmaktadır. İthalat beyannamesi kapsamında sunulan numune üzerinden yapılan inceleme sonucunda belirlenen sınıflandırmadır.`,
    gumruk: GUMRUKLER[i % GUMRUKLER.length],
    tarih: '04.2024 — 04.2027',
    durum: STATUSES[i % 3],
    image: IMAGES[i % IMAGES.length],
    largeImage: IMAGES[i % IMAGES.length].replace('300&h=200', '600&h=400'),
    gerekce: 'Eşya, dış yüzeyi plastikten mamul, iç kısmı metal alaşımdan oluşan, ağırlığı 2.3 kg olan, endüstriyel kullanıma yönelik bir vana parçasıdır. Kombine Nomanklatür\'ün 84.81 pozisyonuna ilişkin açıklama notları ve 6 sayılı Genel Yorum Kuralı uyarınca bu pozisyonda sınıflandırılmıştır.',
}));

const SEARCH_EXAMPLES = ['Nike spor ayakkabı', 'pamuklu tişort', 'Desenli ayıcık şekeri'];
const statusColor = (s) => s === 'Yürürlükte' ? '#52c41a' : s === 'İptal' ? '#ff4d4f' : '#faad14';

const SortIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <g clipPath="url(#clip0_4133_16866)">
            <rect width="14" height="14" fill="white" fillOpacity="0.01"/>
            <path d="M4.31352 1.56348C4.38212 1.56359 4.43842 1.61988 4.43852 1.68848V9.96973H5.62602C5.73045 9.96988 5.78829 10.0917 5.72465 10.1729L3.97465 12.3906C3.96297 12.4055 3.94773 12.4175 3.93071 12.4258C3.91371 12.4341 3.89492 12.4384 3.87602 12.4385C3.85716 12.4385 3.83831 12.434 3.82133 12.4258C3.80437 12.4175 3.78905 12.4055 3.77739 12.3906L2.02739 10.1729C1.96191 10.0916 2.02138 9.96973 2.12602 9.96973H3.31352V1.68848C3.31362 1.61981 3.36983 1.56348 3.43852 1.56348H4.31352ZM10.0567 1.57715C10.0736 1.58545 10.089 1.59744 10.1006 1.6123L11.8506 3.8291C11.9161 3.9103 11.8565 4.03207 11.752 4.03223H10.5645V12.3135C10.5645 12.3822 10.5082 12.4384 10.4395 12.4385H9.5645C9.49575 12.4385 9.4395 12.3822 9.4395 12.3135V4.03223H8.252C8.14731 4.03223 8.08774 3.91191 8.15337 3.8291L9.90337 1.6123C9.91506 1.59736 9.93026 1.58546 9.94731 1.57715C9.96435 1.56886 9.98305 1.56445 10.002 1.56445C10.0209 1.56448 10.0397 1.56887 10.0567 1.57715Z" fill="currentColor" fillOpacity="0.85"/>
        </g>
        <defs><clipPath id="clip0_4133_16866"><rect width="14" height="14" fill="white"/></clipPath></defs>
    </svg>
);

// ─── Country Flags ────────────────────────────────────────────────────────────

const FlagTR = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <g clipPath="url(#clip-tr)">
            <path d="M24 12C24 14.184 23.424 16.224 22.392 18C20.328 21.6 16.44 24 12 24C7.56 24 3.672 21.6 1.608 18C0.576 16.224 0 14.184 0 12C0 9.816 0.576 7.752 1.608 6C3.672 2.4 7.56 0 12 0C16.44 0 20.328 2.4 22.392 6C23.424 7.752 24 9.816 24 12Z" fill="#DF1F26"/>
            <path d="M12.44 16.104C12.992 16.104 13.52 16.008 14 15.792C13.04 16.728 11.744 17.28 10.304 17.28C8.336 17.28 6.632 16.224 5.72 14.64C5.264 13.872 5 12.96 5 12C5 11.04 5.264 10.128 5.72 9.35997C6.632 7.77597 8.36 6.71997 10.304 6.71997C11.744 6.71997 13.04 7.29597 14 8.20797C13.52 8.01597 12.992 7.89597 12.44 7.89597C10.928 7.89597 9.584 8.71197 8.888 9.95997C8.528 10.56 8.336 11.256 8.336 12C8.336 12.744 8.528 13.44 8.888 14.064C9.584 15.288 10.928 16.104 12.44 16.104Z" fill="white"/>
            <path d="M16.016 10.6319L17.36 9.93594L17.096 11.4239L18.176 12.4799L16.688 12.6959L16.016 14.0639L15.344 12.6959L13.832 12.4799L14.912 11.4239L14.672 9.93594L16.016 10.6319Z" fill="white"/>
        </g>
        <defs><clipPath id="clip-tr"><rect width="24" height="24" fill="white"/></clipPath></defs>
    </svg>
);

const FlagEU = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <rect width="24" height="24" rx="12" fill="#003399"/>
        <path d="M12 2.17055L11.5592 3.0637L10.5734 3.20695L11.2867 3.9022L11.1183 4.884L12 4.42055L12.8817 4.88405L12.7133 3.90225L13.4266 3.207L12.4408 3.0637L12 2.17055ZM7.85466 3.40453L7.41385 4.29778L6.42807 4.44103L7.14141 5.13628L6.97304 6.11812L7.85466 5.65453L8.73638 6.11812L8.56796 5.13628L9.28126 4.44103L8.29548 4.29778L7.85466 3.40453ZM16.1454 3.40453L15.7045 4.29778L14.7188 4.44103L15.4321 5.13628L15.2637 6.11812L16.1454 5.65453L17.027 6.11812L16.8586 5.13628L17.5719 4.44103L16.5861 4.29778L16.1454 3.40453ZM4.71404 6.56508L4.27323 7.45823L3.28745 7.60148L4.00079 8.29673L3.83241 9.27853L4.71404 8.81503L5.59576 9.27853L5.42734 8.29673L6.14063 7.60153L5.15485 7.45823L4.71404 6.56508ZM19.286 6.56508L18.8451 7.45823L17.8593 7.60148L18.5726 8.29673L18.4043 9.27853L19.286 8.81503L20.1676 9.27853L19.9992 8.29673L20.7125 7.60148L19.7267 7.45819L19.2859 6.56498L19.286 6.56508ZM3.58904 10.7133L3.14823 11.6064L2.16245 11.7497L2.87579 12.4449L2.70741 13.4267L3.58904 12.9632L4.47076 13.4267L4.30234 12.4449L5.01563 11.7497L4.02985 11.6064L3.58904 10.7132V10.7133ZM20.411 10.7133L19.9701 11.6064L18.9844 11.7497L19.6977 12.4449L19.5293 13.4267L20.411 12.9632L21.2926 13.4267L21.1242 12.4449L21.8375 11.7496L20.8517 11.6064L20.411 10.7132V10.7133ZM4.71404 14.9272L4.27323 15.8204L3.28745 15.9637L4.00079 16.6589L3.83241 17.6407L4.71404 17.1771L5.59576 17.6407L5.42734 16.6589L6.14063 15.9637L5.15485 15.8204L4.71404 14.9272ZM19.286 14.9272L18.8451 15.8204L17.8594 15.9637L18.5727 16.6589L18.4043 17.6407L19.286 17.1772L20.1676 17.6407L19.9992 16.659L20.7125 15.9638L19.7267 15.8205L19.286 14.9272ZM7.85466 18.009L7.41385 18.9022L6.42807 19.0455L7.14141 19.7408L6.97304 20.7226L7.85466 20.259L8.73638 20.7226L8.56796 19.7408L9.28126 19.0455L8.29548 18.9022L7.85466 18.009ZM16.1454 18.009L15.7045 18.9022L14.7187 19.0455L15.432 19.7408L15.2636 20.7226L16.1454 20.259L17.0269 20.7226L16.8586 19.7408L17.5719 19.0455L16.5861 18.9022L16.1454 18.009ZM11.9918 19.116L11.5509 20.0092L10.5652 20.1524L11.2785 20.8477L11.1102 21.8295L11.1282 21.8199L11.1266 21.8295L12 21.3702L12.8734 21.8295L12.8718 21.8199L12.8899 21.8295L12.7216 20.8477L13.4348 20.1524L12.449 20.0092L12.0082 19.116L12 19.1326L11.9917 19.116H11.9918Z" fill="#FFCC00"/>
    </svg>
);

const FlagUK = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <mask id="mask-uk" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="white"/>
        </mask>
        <g mask="url(#mask-uk)">
            <path d="M8.88147 0H-6V7.96049H8.88147V0Z" fill="#00237C"/>
            <path d="M-1.91605 0H-6V2.5037L13.9284 15.6617L18.7778 13.6642L-1.91605 0Z" fill="white"/>
            <path d="M-6 0.209935V1.92845L14.1926 15.2618L14.9827 14.0642L-6 0.209935Z" fill="#CF142B"/>
            <path d="M29.8494 0H14.9654V7.96049H29.8494V0Z" fill="#00237C"/>
            <path d="M25.7653 0H29.8493V2.5037L9.92091 15.6617L5.07153 13.6642L25.7653 0Z" fill="white"/>
            <path d="M29.8493 0.209935V1.92845L9.65676 15.2618L8.86664 14.0642L29.8493 0.209935Z" fill="#CF142B"/>
            <path d="M29.8494 16.0396H14.9654V24H29.8494V16.0396Z" fill="#00237C"/>
            <path d="M25.7653 24H29.8493V21.4963L9.92091 8.33826L5.07153 10.3358L25.7653 24Z" fill="white"/>
            <path d="M29.8493 23.7901V22.0691L9.65676 8.73822L8.86664 9.93575L29.8493 23.7901Z" fill="#CF142B"/>
            <path d="M8.88147 16.0396H-6V24H8.88147V16.0396Z" fill="#00237C"/>
            <path d="M-1.91605 24H-6V21.4963L13.9284 8.33826L18.7778 10.3358L-1.91605 24Z" fill="white"/>
            <path d="M-6 23.7901V22.0691L14.1926 8.73822L14.9827 9.93575L-6 23.7901Z" fill="#CF142B"/>
            <path d="M29.8494 7.96049H14.9975V0H8.79258V7.96049H-6V15.8592H8.79258V24H14.9975V15.8592H29.8494V7.96049Z" fill="white"/>
            <path d="M29.8494 9.5753H13.6815V0H10.1086V9.5753H-6V14.2444H10.1086V24H13.6815V14.2444H29.8494V9.5753Z" fill="#CF142B"/>
        </g>
    </svg>
);

// ─── Country Config ───────────────────────────────────────────────────────────

const COUNTRY_OPTIONS = [
    { value: 'tr', label: 'Türkiye',        Flag: FlagTR },
    { value: 'eu', label: 'Europe',         Flag: FlagEU },
    { value: 'uk', label: 'United Kingdom', Flag: FlagUK },
];

const COUNTRY_META = {
    tr: { subtitle: 'T.C. Ticaret Bakanlığı — BTB Sorgulama Sistemi', total: '1.840' },
    eu: { subtitle: 'Avrupa Birliği — EBTI Sorgulama Sistemi',         total: '12.430' },
    uk: { subtitle: 'HMRC — BTI Sorgulama Sistemi',                    total: '3.210' },
};

const ADDED_VALUES = {
    tr: { '30': '47',  '7': '12', 'today': '3' },
    eu: { '30': '312', '7': '74', 'today': '9' },
    uk: { '30': '88',  '7': '21', 'today': '2' },
};
const UPDATED_VALUES = {
    tr: { '30': '3',  '7': '1', 'today': '0' },
    eu: { '30': '41', '7': '8', 'today': '1' },
    uk: { '30': '14', '7': '3', 'today': '0' },
};
const CANCELLED_VALUES = {
    tr: { '30': '9',  '7': '2', 'today': '1' },
    eu: { '30': '57', '7': '9', 'today': '0' },
    uk: { '30': '22', '7': '4', 'today': '1' },
};

const PERIOD_OPTIONS_ADDED = [
    { value: '30',    label: 'Son 30 gün içinde eklenen' },
    { value: '7',     label: 'Son 7 gün içinde eklenen' },
    { value: 'today', label: 'Bugün eklenen' },
];
const PERIOD_OPTIONS_UPDATED = [
    { value: '30',    label: 'Son 30 gün içinde değişen' },
    { value: '7',     label: 'Son 7 gün içinde değişen' },
    { value: 'today', label: 'Bugün değişen' },
];
const PERIOD_OPTIONS_CANCELLED = [
    { value: '30',    label: 'Son 30 gün içinde iptal edilenler' },
    { value: '7',     label: 'Son 7 gün içinde iptal edilenler' },
    { value: 'today', label: 'Bugün iptal edilenler' },
];

const STATS = [
    { label: 'Toplam Geçerli BTB', value: '1.840', link: null },
    { key: 'added',                                 link: 'Görüntüle' },
    { key: 'updated',                               link: 'Görüntüle' },
    { key: 'cancelled',                             link: 'Görüntüle' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const ResultsSkeleton = () => (
    <Card styles={{ body: { padding: '16px 20px' } }} style={{ border: '1px solid #e8ecf0', borderRadius: 6 }}>
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: i < 5 ? '1px solid #f5f5f5' : 'none' }}>
                <Skeleton.Image active style={{ width: 54, height: 54, borderRadius: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <Skeleton active title={{ width: '20%', style: { marginBottom: 8 } }} paragraph={{ rows: 1, width: '60%' }} />
                </div>
                <Skeleton.Button active style={{ width: 80 }} />
            </div>
        ))}
    </Card>
);

const FormRow = ({ label, required, children }) => (
    <div className="btb-adv-row">
        <div className="btb-adv-label">
            <Text strong style={{ fontSize: 13 }}>
                {label}{required && <span style={{ color: '#ff4d4f', marginLeft: 2 }}>*</span>}
            </Text>
        </div>
        <div className="btb-adv-field">{children}</div>
    </div>
);

// Reusable text block used in drawer for both sections
const DrawerTextBlock = ({ title, content }) => (
    <div style={{ marginBottom: 20 }}>
        <Text strong style={{ fontSize: 13, color: '#1d3557', display: 'block', marginBottom: 8 }}>{title}</Text>
        <div style={{ background: '#f8fafb', borderRadius: 6, padding: 16, border: '1px solid #e8ecf0', fontSize: 13, color: '#3d5a73', lineHeight: 1.7 }}>
            {content}
        </div>
    </div>
);

// ─── Component ───────────────────────────────────────────────────────────────

const BTBPage = () => {
    const [activeTab, setActiveTab]           = useState('metin');
    const [country, setCountry]               = useState('tr');
    const [viewMode, setViewMode]             = useState('liste');
    const [searchText, setSearchText]         = useState('');
    const [resultCount, setResultCount]       = useState('10');
    const [onlyWithImg, setOnlyWithImg]       = useState(true);
    const [searched, setSearched]             = useState(false);
    const [loading, setLoading]               = useState(false);
    const [resultsKey, setResultsKey]         = useState(0);
    const [drawerOpen, setDrawerOpen]         = useState(false);
    const [selected, setSelected]             = useState(null);
    const [previewImg, setPreviewImg]         = useState(null);
    const [addedPeriod, setAddedPeriod]         = useState('30');
    const [updatedPeriod, setUpdatedPeriod]     = useState('30');
    const [cancelledPeriod, setCancelledPeriod] = useState('30');
    const [sortOrder, setSortOrder]             = useState('desc');
    const [countryBarHidden, setCountryBarHidden] = useState(false);
    const [isMobile, setIsMobile]               = useState(() => window.innerWidth <= 768);

    const resultsRef   = useRef(null);
    const countryRef   = useRef(null);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        const el = countryRef.current;
        if (!el) return;
        const findScrollParent = (node) => {
            if (!node || node === document.body) return window;
            const oy = window.getComputedStyle(node).overflowY;
            if (oy === 'auto' || oy === 'scroll') return node;
            return findScrollParent(node.parentElement);
        };
        const scrollEl = findScrollParent(el.parentElement);
        const onScroll = () => {
            if (countryRef.current) {
                setCountryBarHidden(countryRef.current.getBoundingClientRect().bottom < 0);
            }
        };
        scrollEl.addEventListener('scroll', onScroll, { passive: true });
        return () => scrollEl.removeEventListener('scroll', onScroll);
    }, []);

    // Advanced search
    const [advUlke, setAdvUlke]               = useState(undefined);
    const [advRef, setAdvRef]                 = useState('');
    const [advNomKodFrom, setAdvNomKodFrom]   = useState('');
    const [advNomKodTo, setAdvNomKodTo]       = useState('');
    const [advKeyword, setAdvKeyword]         = useState('');
    const [advKeywordMode, setAdvKeywordMode] = useState('any');
    const [advExclude, setAdvExclude]         = useState('');
    const [advDesc, setAdvDesc]               = useState('');
    const [advInvalid, setAdvInvalid]         = useState(false);

    // Table column filters
    const [colBtb, setColBtb]     = useState('');
    const [colGtip, setColGtip]   = useState('');
    const [colTanim, setColTanim] = useState(undefined);
    const [colGumruk, setColGumruk] = useState('');
    const [colTarih, setColTarih] = useState('');
    const [colDurum, setColDurum] = useState(undefined);

    const openDrawer = (rec) => { setSelected(rec); setDrawerOpen(true); };

    const handleSearch = useCallback(() => {
        setLoading(true);
        setSearched(false);
        setTimeout(() => {
            setLoading(false);
            setSearched(true);
            setResultsKey(k => k + 1);
        }, 1400);
    }, []);

    useEffect(() => {
        if (searched && resultsRef.current) {
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        }
    }, [searched, resultsKey]);

    const filteredData = MOCK_DATA.filter(r => {
        if (colBtb    && !r.btbNo.toLowerCase().includes(colBtb.toLowerCase()))     return false;
        if (colGtip   && !r.gtip.toLowerCase().includes(colGtip.toLowerCase()))     return false;
        if (colGumruk && !r.gumruk.toLowerCase().includes(colGumruk.toLowerCase())) return false;
        if (colTanim  && r.tanim !== colTanim)   return false;
        if (colDurum  && r.durum !== colDurum)   return false;
        return true;
    });

    // ─── Table columns ───────────────────────────────────────────────────────
    const columns = [
        {
            title: '',
            dataIndex: 'image',
            key: 'img',
            width: 72,
            render: img => (
                <img src={img} alt=""
                    style={{ width: 54, height: 54, borderRadius: 6, objectFit: 'cover', cursor: 'zoom-in', display: 'block' }}
                    onClick={e => { e.stopPropagation(); setPreviewImg(img.replace('300&h=200', '1200&h=800')); }}
                />
            ),
        },
        {
            title: (<div><div style={TH}>BTB No</div><Input size="small" placeholder="Giriniz" value={colBtb} onChange={e => setColBtb(e.target.value)} style={{ marginTop: 4 }} /></div>),
            dataIndex: 'btbNo', key: 'btbNo', width: 140,
            render: v => <Text style={{ fontSize: 13, fontWeight: 400 }}>{v}</Text>,
        },
        {
            title: (<div><div style={TH}>GTİP</div><Input size="small" placeholder="Giriniz" value={colGtip} onChange={e => setColGtip(e.target.value)} style={{ marginTop: 4 }} /></div>),
            dataIndex: 'gtip', key: 'gtip', width: 130,
            render: v => <Text style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>{v}</Text>,
        },
        {
            title: (<div><div style={TH}>Eşya Tanımı</div><Select size="small" placeholder="Seçiniz" value={colTanim} onChange={setColTanim} allowClear style={{ marginTop: 4, width: '100%' }} options={[...new Set(MOCK_DATA.map(r => r.tanim))].map(t => ({ value: t, label: t }))} /></div>),
            dataIndex: 'tanim', key: 'tanim', ellipsis: true,
            render: v => <Text style={{ fontSize: 13 }}>{v}</Text>,
        },
        {
            title: (<div><div style={TH}>Gümrük</div><Input size="small" placeholder="Giriniz" value={colGumruk} onChange={e => setColGumruk(e.target.value)} style={{ marginTop: 4 }} /></div>),
            dataIndex: 'gumruk', key: 'gumruk', width: 190, ellipsis: true,
            render: v => <Text style={{ fontSize: 13 }}>{v}</Text>,
        },
        {
            title: (<div><div style={TH}>Başlangıç - Bitiş Tarihi</div><Input size="small" placeholder="Giriniz" value={colTarih} onChange={e => setColTarih(e.target.value)} style={{ marginTop: 4 }} /></div>),
            dataIndex: 'tarih', key: 'tarih', width: 180,
            render: v => <Text style={{ fontSize: 12, color: '#8c8c8c' }}>{v}</Text>,
        },
        {
            title: (<div><div style={TH}>Geçerlilik</div><Select size="small" placeholder="Seçiniz" value={colDurum} onChange={setColDurum} allowClear style={{ marginTop: 4, width: '100%' }} options={STATUSES.map(s => ({ value: s, label: s }))} /></div>),
            dataIndex: 'durum', key: 'durum', width: 130,
            render: v => (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(v), display: 'inline-block', flexShrink: 0 }} />
                    {v}
                </span>
            ),
        },
    ];

    // ─── Tab nav items ────────────────────────────────────────────────────────

    const TABS = [
        { key: 'metin',    icon: <SearchOutlined />, label: 'Metin ile Ara' },
        { key: 'gelismis', icon: <ControlOutlined />, label: 'Detaylı Arama' },
    ];

    // ─── Bottom search bar (shared) ───────────────────────────────────────────

    const BottomBar = (
        <div className="btb-search-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 13, color: '#595959', whiteSpace: 'nowrap' }}>Sonuç hacmi :</Text>
                <Select value={resultCount} onChange={setResultCount} style={{ width: 70 }} size="small"
                    options={['10', '25', '50', '100'].map(v => ({ value: v, label: v }))} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 13, color: '#595959' }}>Sadece resimli</Text>
                <Switch checked={onlyWithImg} onChange={setOnlyWithImg} />
            </div>
            <Button type="primary" loading={loading}
                style={{ borderRadius: 6, paddingLeft: 28, paddingRight: 28, fontWeight: 600 }}
                onClick={handleSearch}>
                Ara
            </Button>
        </div>
    );

    // ─── Tab contents ────────────────────────────────────────────────────────

    const GelismisContent = (
        <div style={{ padding: '20px 24px 0' }}>
            <FormRow label="Veren ülke">
                <Select placeholder="-----" style={{ width: 260 }} value={advUlke} onChange={setAdvUlke} allowClear
                    options={['Türkiye', 'Almanya', 'Çin', 'İtalya', 'ABD'].map(v => ({ value: v, label: v }))} />
            </FormRow>
            <FormRow label="BTI Referansı">
                <Input style={{ width: 260 }} value={advRef} onChange={e => setAdvRef(e.target.value)} />
            </FormRow>
            <FormRow label={<>Geçerlilik başlangıç tarihi<br /><span style={{ fontWeight: 400, fontSize: 11, color: '#8c8c8c' }}>(GG/AA/YYYY)</span></>}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DatePicker format="DD-MM-YYYY" style={{ width: 150 }} placeholder="GG-AA-YYYY" />
                    <Text style={{ fontSize: 13, color: '#595959' }}>için</Text>
                    <DatePicker format="DD-MM-YYYY" style={{ width: 150 }} placeholder="GG-AA-YYYY" />
                </div>
            </FormRow>
            <FormRow label={<>Geçerlilik bitiş tarihi<br /><span style={{ fontWeight: 400, fontSize: 11, color: '#8c8c8c' }}>(GG/AA/YYYY)</span></>}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DatePicker format="DD-MM-YYYY" style={{ width: 150 }} placeholder="GG-AA-YYYY" />
                    <Text style={{ fontSize: 13, color: '#595959' }}>için</Text>
                    <DatePicker format="DD-MM-YYYY" style={{ width: 150 }} placeholder="GG-AA-YYYY" />
                </div>
            </FormRow>
            <FormRow label={<><span style={{ fontWeight: 400, fontSize: 11, color: '#8c8c8c' }}>(GG/AA/YYYY)</span> tarihinden<br />beri yayınlandı</>}>
                <DatePicker format="DD-MM-YYYY" style={{ width: 180 }} placeholder="GG-AA-YYYY" />
            </FormRow>
            <FormRow label="Geçersiz BTI'ları dahil et">
                <Checkbox checked={advInvalid} onChange={e => setAdvInvalid(e.target.checked)} />
            </FormRow>
            <FormRow label="Adlandırma kodu">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 13, color: '#595959' }}>Dan</Text>
                    <Input style={{ width: 130 }} value={advNomKodFrom} onChange={e => setAdvNomKodFrom(e.target.value)} />
                    <Text style={{ fontSize: 13, color: '#595959' }}>için</Text>
                    <Input style={{ width: 130 }} value={advNomKodTo} onChange={e => setAdvNomKodTo(e.target.value)} />
                </div>
            </FormRow>
            <FormRow label="Anahtar kelime">
                <Input style={{ maxWidth: 400 }} value={advKeyword} onChange={e => setAdvKeyword(e.target.value)} />
            </FormRow>
            <FormRow label="">
                <Radio.Group value={advKeywordMode} onChange={e => setAdvKeywordMode(e.target.value)}>
                    <Radio value="all">Tüm anahtar kelimeleri eşleştir</Radio>
                    <Radio value="any">Anahtar kelimelerden herhangi birini eşleştirin</Radio>
                </Radio.Group>
            </FormRow>
            <FormRow label="Anahtar Kelimeyi Hariç Tut">
                <Input style={{ maxWidth: 400 }} value={advExclude} onChange={e => setAdvExclude(e.target.value)} />
            </FormRow>
            <FormRow label="Açıklama" required>
                <Input style={{ width: 400 }} value={advDesc} onChange={e => setAdvDesc(e.target.value)} />
            </FormRow>
        </div>
    );

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100%' }}>
            {/* Full-width white page header — sticky */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 20,
                background: '#fff',
                borderBottom: '1px solid #e5e7eb',
            }}>
                <div className="btb-page-header-inner" style={{ maxWidth: 910, margin: '0 auto', padding: '16px 22px 16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <Title level={3} style={{ margin: 0, fontWeight: 700, fontSize: 22 }}>
                            Bağlayıcı Tarife Bilgisi
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>
                            T.C. Ticaret Bakanlığı — BTB Sorgulama Sistemi
                        </Text>
                    </div>
                    {countryBarHidden && (
                        <div className="btb-sticky-country" style={{ display: 'flex', gap: 6 }}>
                            {COUNTRY_OPTIONS.map(opt => {
                                const active = country === opt.value;
                                return (
                                    <button key={opt.value} onClick={() => setCountry(opt.value)} style={{
                                        display: 'flex', alignItems: 'center', gap: 7,
                                        padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                                        fontSize: 13, fontWeight: active ? 500 : 400,
                                        background: active ? '#1677ff' : '#fff',
                                        color: active ? '#fff' : '#374151',
                                        border: active ? '1px solid #1677ff' : '1px solid #d1d5db',
                                        transition: 'all 0.15s', whiteSpace: 'nowrap',
                                    }}>
                                        <opt.Flag />{opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

        <div className="btb-content-wrapper" style={{ maxWidth: 910, margin: '0 auto', padding: '0 22px 24px 32px' }}>

            {/* Country selector */}
            <div ref={countryRef} style={{ display: 'flex', gap: 6, marginTop: 32, marginBottom: 20 }}>
                {COUNTRY_OPTIONS.map(opt => {
                    const active = country === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => setCountry(opt.value)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 7,
                                padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                                fontSize: 13, fontWeight: active ? 500 : 400,
                                background: active ? '#1677ff' : '#fff',
                                color: active ? '#fff' : '#374151',
                                border: active ? '1px solid #1677ff' : '1px solid #d1d5db',
                                transition: 'all 0.15s',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <opt.Flag />
                            {opt.label}
                        </button>
                    );
                })}
            </div>

            {/* Stat Cards — Performans Özeti stili */}
            <div style={{ width: '100%', background: '#fff', borderRadius: 6, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 20 }}>
                {/* Header */}
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>Genel Bakış</span>
                </div>
                {/* Segments */}
                <div className="btb-stat-segments" style={{ display: 'flex' }}>
                    {STATS.map((s, i) => {
                        const isAdded     = s.key === 'added';
                        const isUpdated   = s.key === 'updated';
                        const isCancelled = s.key === 'cancelled';
                        const isDynamic   = isAdded || isUpdated || isCancelled;
                        const value = isAdded     ? ADDED_VALUES[country][addedPeriod]
                                    : isUpdated   ? UPDATED_VALUES[country][updatedPeriod]
                                    : isCancelled ? CANCELLED_VALUES[country][cancelledPeriod]
                                    : COUNTRY_META[country].total;
                        const periodValue  = isAdded ? addedPeriod : isUpdated ? updatedPeriod : cancelledPeriod;
                        const periodSetter = isAdded ? setAddedPeriod : isUpdated ? setUpdatedPeriod : setCancelledPeriod;
                        const periodOpts   = isAdded ? PERIOD_OPTIONS_ADDED : isUpdated ? PERIOD_OPTIONS_UPDATED : PERIOD_OPTIONS_CANCELLED;
                        return (
                            <div key={i} className="btb-stat-segment" style={{
                                flex: 1,
                                padding: '16px 20px 14px',
                                borderRight: i < STATS.length - 1 ? '1px solid #e5e7eb' : 'none',
                                display: 'flex', flexDirection: 'column', gap: 2,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                                    <span style={{ fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1, letterSpacing: '-0.03em' }}>
                                        {value}
                                    </span>
                                    {s.link && <a href="#" style={{ fontSize: 12, color: '#1677ff' }}>{s.link}</a>}
                                </div>
                                {isDynamic ? (
                                    <Select
                                        value={periodValue}
                                        onChange={periodSetter}
                                        options={periodOpts}
                                        variant="borderless"
                                        size="small"
                                        popupMatchSelectWidth={false}
                                        style={{ fontSize: 12, color: '#6b7280', marginLeft: -8, marginTop: 2 }}
                                    />
                                ) : (
                                    <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 400, lineHeight: 1.3 }}>{s.label}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Search panel */}
            <Card className="btb-search-card" styles={{ body: { padding: 0 } }} style={{ marginBottom: 20 }}>

                {/* Tab nav */}
                <div className="btb-tab-nav-wrap" style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                    <Segmented
                        value={activeTab}
                        onChange={setActiveTab}
                        options={TABS.map(t => ({ value: t.key, label: t.label, icon: t.icon }))}
                        style={{ width: isMobile ? '100%' : 'auto' }}
                    />
                </div>

                {activeTab === 'metin' && (
                    <div style={{ padding: '20px 24px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, color: '#8c8c8c', fontSize: 13 }}>
                            <BulbOutlined /><span>Arama örnekleri;</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 0 }}>
                            {SEARCH_EXAMPLES.map(ex => (
                                <Tag key={ex} style={{ cursor: 'pointer', borderRadius: 6, fontSize: 12, padding: '3px 12px', background: '#fff', border: '1px solid #d9d9d9', color: '#595959', lineHeight: '20px' }}
                                    onClick={() => setSearchText(ex)}>
                                    {ex}
                                </Tag>
                            ))}
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <Input size="large" placeholder="BTB numarası, anahtar kelime veya GTİP yazarak arayabilirsiniz."
                            value={searchText} onChange={e => setSearchText(e.target.value)}
                            style={{ borderRadius: 6, fontSize: 13, background: '#f5f5f5', borderWidth: 2 }} onPressEnter={handleSearch} />
                    </div>
                )}
                {activeTab === 'gelismis' && GelismisContent}

                {BottomBar}
            </Card>

            {/* Loading skeleton */}
            {loading && <ResultsSkeleton />}

            {/* Results */}
            {searched && !loading && (
                <div ref={resultsRef} key={resultsKey} className="btb-results-appear">
                    <div className="btb-results-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Text strong style={{ fontSize: 16 }}>Sonuçlar</Text>
                            <Tag color="red" style={{ borderRadius: 20, fontWeight: 600, fontSize: 12 }}>32 Kayıt</Tag>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Dropdown
                                menu={{
                                    items: [
                                        { key: 'desc', label: 'Yeniden Eskiye' },
                                        { key: 'asc',  label: 'Eskiden Yeniye' },
                                    ],
                                    selectedKeys: [sortOrder],
                                    onClick: ({ key }) => setSortOrder(key),
                                }}
                                trigger={['click']}
                            >
                                <button style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                                    fontSize: 13, color: '#595959',
                                    background: '#fff', border: '1px solid #d9d9d9',
                                    fontFamily: 'inherit',
                                }}>
                                    <SortIcon />
                                    {sortOrder === 'desc' ? 'Yeniden Eskiye' : 'Eskiden Yeniye'}
                                </button>
                            </Dropdown>
                            <div className="btb-view-toggle">
                                <button className={`btb-view-btn${viewMode === 'kart' ? ' active' : ''}`} onClick={() => setViewMode('kart')}>
                                    <AppstoreOutlined /> Kart
                                </button>
                                <button className={`btb-view-btn${viewMode === 'liste' ? ' active' : ''}`} onClick={() => setViewMode('liste')}>
                                    <UnorderedListOutlined /> Liste
                                </button>
                            </div>
                        </div>
                    </div>

                    {viewMode === 'kart' ? (
                        <Row gutter={[16, 16]}>
                            {filteredData.slice(0, parseInt(resultCount)).map(rec => (
                                <Col xs={12} sm={8} md={6} key={rec.key}>
                                    <Card hoverable className="btb-result-card" styles={{ body: { padding: '10px 12px 12px' } }}
                                        cover={
                                            <div style={{ height: 130, overflow: 'hidden' }}>
                                                <img src={rec.image} alt=""
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                                                    onClick={e => { e.stopPropagation(); setPreviewImg(rec.largeImage); }} />
                                            </div>
                                        }
                                        onClick={() => openDrawer(rec)}>
                                        <Text style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 400, display: 'block' }}>{rec.gtip}</Text>
                                        <Text style={{ fontSize: 11, color: '#8c8c8c', display: 'block', marginBottom: 6 }}>{rec.refNo}</Text>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(rec.durum), display: 'inline-block', flexShrink: 0 }} />
                                            {rec.durum}
                                        </span>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #e8ecf0' }}>
                            <Table className="btb-list-table" columns={columns} dataSource={filteredData} rowKey="key" size="middle"
                                scroll={{ x: 700 }}
                                pagination={{ pageSize: parseInt(resultCount), showTotal: (t, r) => `${r[0]}-${r[1]} / ${t}`, style: { padding: '12px 16px' } }}
                                onRow={rec => ({ onClick: () => openDrawer(rec), style: { cursor: 'pointer' } })} />
                        </Card>
                    )}
                </div>
            )}

            {/* Detail Drawer */}
            <Drawer title={null} placement={isMobile ? 'bottom' : 'right'}
                width={isMobile ? '100%' : 480} height={isMobile ? '92%' : undefined}
                open={drawerOpen} onClose={() => setDrawerOpen(false)} closable={false}
                styles={{ body: { padding: 0 } }}>
                {selected && (
                    <>
                        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', background: 'transparent' }}>
                            <Text style={{ fontSize: 16, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: 'rgba(0,0,0,0.88)' }}>BTB Detay Bilgi</Text>
                            <Button type="text" icon={<CloseOutlined />} onClick={() => setDrawerOpen(false)} />
                        </div>

                        <div style={{ width: '100%', height: 220, cursor: 'zoom-in' }} onClick={() => setPreviewImg(selected.largeImage)}>
                            <img src={selected.largeImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <div style={{ padding: 24, overflowY: 'auto', background: `linear-gradient(to bottom, ${statusColor(selected.durum)}3B 0%, #ffffff 50%)` }}>
                            <Text strong style={{ fontSize: 15, color: '#1d3557', display: 'block', marginBottom: 8 }}>{selected.tanim}</Text>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                                <Tag style={{ borderRadius: 6, fontWeight: 400, fontFamily: 'Inter, sans-serif', fontSize: 13, background: '#fff', borderColor: '#d9d9d9', color: '#595959' }}>{selected.gtip}</Tag>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(0,0,0,0.88)' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(selected.durum), display: 'inline-block', flexShrink: 0 }} />
                                    {selected.durum}
                                </span>
                            </div>
                            <Divider style={{ margin: '0 0 16px' }} />

                            {[
                                ['BTB No', selected.btbNo],
                                ['Gümrük İdaresi', selected.gumruk],
                                ['Geçerlilik Tarihi', selected.tarih],
                                ['BTB Referansı', selected.refNo],
                            ].map(([label, val]) => (
                                <div key={label} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                                    <Text style={{ width: 140, color: '#8c8c8c', fontSize: 13, flexShrink: 0 }}>{label}</Text>
                                    <Text style={{ color: '#1d3557', fontSize: 13, fontWeight: 500 }}>{val}</Text>
                                </div>
                            ))}

                            <div style={{ marginTop: 20 }}>
                                <DrawerTextBlock title="Eşyanın Tanımı" content={selected.tanimUzun} />
                                <DrawerTextBlock title="Sınıflandırma Gerekçesi" content={selected.gerekce} />
                            </div>

                        </div>
                    </>
                )}
            </Drawer>

            {/* Image Preview Modal */}
            <Modal open={!!previewImg} footer={null} onCancel={() => setPreviewImg(null)} centered width="fit-content"
                styles={{ body: { padding: 0 }, content: { borderRadius: 6, overflow: 'hidden' } }}>
                {previewImg && (
                    <img src={previewImg} alt="Önizleme"
                        style={{ display: 'block', maxWidth: '80vw', maxHeight: '80vh', objectFit: 'contain' }} />
                )}
            </Modal>
        </div>
        </div>
    );
};

const TH = { fontSize: 12, fontWeight: 600, color: '#595959' };

export default BTBPage;

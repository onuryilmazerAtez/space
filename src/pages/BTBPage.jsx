import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Card, Typography, Row, Col, Input, Select, Button, Table, Tag,
    Drawer, Switch, Upload, Checkbox, DatePicker,
    Divider, message, Modal, Skeleton, Radio,
} from 'antd';
import {
    SearchOutlined,
    CloseOutlined, DownloadOutlined, ExportOutlined,
    CheckCircleFilled,
    AppstoreOutlined, UnorderedListOutlined, PictureOutlined,
    BulbOutlined, FilterOutlined,
} from '@ant-design/icons';
import './BTBPage.css';

const { Title, Text } = Typography;
const { Dragger } = Upload;

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

const SAMPLE_IMAGES = [
    { img: CARPET_IMG, gtip: '8432.29.90', ref: 'TR · TR410000260002' },
    { img: PHONE_IMG,  gtip: '8432.29.90', ref: 'TR · TR410000260002' },
    { img: TABLE_IMG,  gtip: '8432.29.90', ref: 'TR · TR410...' },
];

const SEARCH_EXAMPLES = ['Nike spor ayakkabı', 'pamuklu tişort', 'Desenli ayıcık şekeri'];
const statusColor = (s) => s === 'Yürürlükte' ? '#52c41a' : s === 'İptal' ? '#ff4d4f' : '#faad14';

// ─── Stat Card SVG Icons ──────────────────────────────────────────────────────

const StatIconClipboard = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M9 14l2 2 4-4" />
    </svg>
);
const StatIconDocPlus = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" /><path d="M12 18v-6" /><path d="M9 15h6" />
    </svg>
);
const StatIconBook = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8" /><path d="M8 11h5" />
    </svg>
);
const StatIconDocEdit = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
    </svg>
);

const STATS = [
    { label: 'Toplam Geçerli BTB', value: '1.840', iconBg: '#f5f5f5', link: null,        icon: StatIconClipboard },
    { label: 'Bu Ay Eklenen',      value: '47',    iconBg: '#f5f5f5', link: 'Görüntüle', icon: StatIconDocPlus },
    { label: 'Fasıl Sayısı',       value: '38',    iconBg: '#f5f5f5', link: null,        icon: StatIconBook },
    { label: 'Güncellenen',        value: '3',     iconBg: '#f5f5f5', link: 'Görüntüle', icon: StatIconDocEdit },
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

    const resultsRef = useRef(null);

    // Advanced search
    const [advUlke, setAdvUlke]               = useState(undefined);
    const [advRef, setAdvRef]                 = useState('');
    const [advNomKodFrom, setAdvNomKodFrom]   = useState('');
    const [advNomKodTo, setAdvNomKodTo]       = useState('');
    const [advKeyword, setAdvKeyword]         = useState('');
    const [advKeywordMode, setAdvKeywordMode] = useState('any');
    const [advExclude, setAdvExclude]         = useState('');
    const [advDesc, setAdvDesc]               = useState('');
    const [advSort, setAdvSort]               = useState(undefined);
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
            render: v => <Text strong style={{ fontSize: 13 }}>{v}</Text>,
        },
        {
            title: (<div><div style={TH}>GTİP</div><Input size="small" placeholder="Giriniz" value={colGtip} onChange={e => setColGtip(e.target.value)} style={{ marginTop: 4 }} /></div>),
            dataIndex: 'gtip', key: 'gtip', width: 130,
            render: v => <Text style={{ fontSize: 13, fontFamily: 'monospace' }}>{v}</Text>,
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
        { key: 'gelismis', icon: <FilterOutlined />,  label: 'Gelişmiş Arama' },
        {
            key: 'gorsel',
            icon: <PictureOutlined />,
            label: (
                <>Görsel ile Ara <Tag color="purple" style={{ marginLeft: 4, fontSize: 11, lineHeight: '18px', padding: '0 6px', borderRadius: 20 }}>✦ Ai</Tag></>
            ),
        },
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
            <FormRow label="Sırala">
                <Select placeholder="" style={{ width: 260 }} value={advSort} onChange={setAdvSort} allowClear
                    options={['Yeniden Eskiye', 'Eskiden Yeniye', 'GTİP Sıralı'].map(v => ({ value: v, label: v }))} />
            </FormRow>
        </div>
    );

    const GorselContent = (
        <div style={{ padding: '20px 24px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, color: '#8c8c8c', fontSize: 13 }}>
                <BulbOutlined /><span>Örnek BTB kayıtları;</span>
            </div>
            <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
                <div style={{ flex: '0 0 420px' }}>
                    <Dragger style={{ borderRadius: 6 }} showUploadList={false} beforeUpload={() => false}>
                        <p style={{ marginBottom: 8 }}><PictureOutlined style={{ fontSize: 36, color: '#1677ff' }} /></p>
                        <p style={{ fontWeight: 500, marginBottom: 4, fontSize: 13 }}>Click or drag file to this area to upload</p>
                        <p style={{ fontSize: 12, color: '#8c8c8c' }}>Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                    </Dragger>
                </div>
                <Divider type="vertical" style={{ height: 'auto', margin: '0 24px', borderColor: '#e8ecf0' }} />
                <div style={{ flex: 1, display: 'flex', gap: 12, overflowX: 'auto', alignItems: 'flex-start', paddingTop: 4 }}>
                    {SAMPLE_IMAGES.map((s, i) => (
                        <div key={i} style={{ flexShrink: 0, width: 140 }}>
                            <img src={s.img} alt="" style={{ width: 140, height: 90, borderRadius: 6, objectFit: 'cover', border: '1px solid #e8ecf0', cursor: 'zoom-in' }}
                                onClick={() => setPreviewImg(s.img.replace('300&h=200', '1200&h=800'))} />
                            <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600 }}>{s.gtip}</div>
                            <div style={{ fontSize: 11, color: '#8c8c8c' }}>{s.ref}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100%' }}>

            {/* Page Header */}
            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0, fontWeight: 700, fontSize: 22 }}>
                    Bağlayıcı Tarife Bilgisi
                    <Text type="secondary" style={{ fontSize: 14, fontWeight: 400, marginLeft: 16 }}>
                        T.C. Ticaret Bakanlığı — BTB Sorgulama Sistemi
                    </Text>
                </Title>
            </div>

            {/* Stat Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                {STATS.map((s, i) => (
                    <Col xs={12} lg={6} key={i}>
                        <Card className="btb-stat-card" styles={{ body: { padding: '20px 24px' } }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <Text style={{ fontSize: 13, color: '#8c8c8c', display: 'block', marginBottom: 6 }}>{s.label}</Text>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <Text strong style={{ fontSize: 28, lineHeight: 1 }}>{s.value}</Text>
                                        {s.link && <a href="#" style={{ fontSize: 13, color: '#1677ff' }}>{s.link}</a>}
                                    </div>
                                </div>
                                <div style={{ width: 44, height: 44, borderRadius: '50%', background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.icon />
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Search panel */}
            <Card className="btb-search-card" styles={{ body: { padding: 0 } }} style={{ marginBottom: 20 }}>

                {/* Tab nav */}
                <div className="btb-tab-nav">
                    {TABS.map(t => (
                        <button
                            key={t.key}
                            className={`btb-tab-btn${activeTab === t.key ? ' active' : ''}`}
                            onClick={() => setActiveTab(t.key)}
                        >
                            {t.icon}
                            <span>{t.label}</span>
                        </button>
                    ))}
                </div>

                {activeTab === 'metin' && (
                    <div style={{ padding: '20px 24px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, color: '#8c8c8c', fontSize: 13 }}>
                            <BulbOutlined /><span>Arama örnekleri;</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                            {SEARCH_EXAMPLES.map(ex => (
                                <Tag key={ex} style={{ cursor: 'pointer', borderRadius: 6, fontSize: 12, padding: '3px 12px', background: '#fff', border: '1px solid #d9d9d9', color: '#595959', lineHeight: '20px' }}
                                    onClick={() => setSearchText(ex)}>
                                    {ex}
                                </Tag>
                            ))}
                        </div>
                        <Input size="large" placeholder="BTB numarası, anahtar kelime veya GTİP yazarak arayabilirsiniz."
                            value={searchText} onChange={e => setSearchText(e.target.value)}
                            style={{ borderRadius: 6, fontSize: 13 }} onPressEnter={handleSearch} />
                    </div>
                )}
                {activeTab === 'gelismis' && GelismisContent}
                {activeTab === 'gorsel'   && GorselContent}

                {BottomBar}
            </Card>

            {/* Loading skeleton */}
            {loading && <ResultsSkeleton />}

            {/* Results */}
            {searched && !loading && (
                <div ref={resultsRef} key={resultsKey} className="btb-results-appear">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Text strong style={{ fontSize: 16 }}>Sonuçlar</Text>
                            <Tag color="red" style={{ borderRadius: 20, fontWeight: 600, fontSize: 12 }}>32 Kayıt</Tag>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ color: '#8c8c8c', fontSize: 13, cursor: 'pointer' }}>Yeniden Eskiye Sırala</span>
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
                                        <Text strong style={{ fontSize: 13, display: 'block' }}>{rec.gtip}</Text>
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
                                pagination={{ pageSize: parseInt(resultCount), showTotal: (t, r) => `${r[0]}-${r[1]} / ${t}`, style: { padding: '12px 16px' } }}
                                onRow={rec => ({ onClick: () => openDrawer(rec), style: { cursor: 'pointer' } })} />
                        </Card>
                    )}
                </div>
            )}

            {/* Detail Drawer */}
            <Drawer title={null} placement="right" width={480} open={drawerOpen}
                onClose={() => setDrawerOpen(false)} closable={false} styles={{ body: { padding: 0 } }}>
                {selected && (
                    <>
                        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', background: '#fafbfc' }}>
                            <div>
                                <Text strong style={{ fontSize: 15, color: '#1d3557', display: 'block' }}>{selected.btbNo}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>BTB Detay Bilgisi</Text>
                            </div>
                            <Button type="text" icon={<CloseOutlined />} onClick={() => setDrawerOpen(false)} />
                        </div>

                        <div style={{ width: '100%', height: 220, cursor: 'zoom-in' }} onClick={() => setPreviewImg(selected.largeImage)}>
                            <img src={selected.largeImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <div style={{ padding: 24, overflowY: 'auto' }}>
                            <Text strong style={{ fontSize: 15, color: '#1d3557', display: 'block', marginBottom: 8 }}>{selected.tanim}</Text>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                                <Tag color="blue" style={{ borderRadius: 6, fontWeight: 600, fontFamily: 'monospace', fontSize: 13 }}>{selected.gtip}</Tag>
                                <Tag icon={<CheckCircleFilled />} color="success" style={{ borderRadius: 6 }}>{selected.durum}</Tag>
                            </div>
                            <Divider style={{ margin: '0 0 16px' }} />

                            {[
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

                            <div style={{ display: 'flex', gap: 10 }}>
                                <Button type="primary" icon={<ExportOutlined />} style={{ flex: 1, height: 44, borderRadius: 6, fontWeight: 600 }} onClick={() => message.info('GTİP açılıyor')}>
                                    Tariff'te GTİP Aç
                                </Button>
                                <Button icon={<DownloadOutlined />} style={{ flex: 1, height: 44, borderRadius: 6, fontWeight: 600 }} onClick={() => message.success('PDF indiriliyor')}>
                                    PDF İndir
                                </Button>
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
    );
};

const TH = { fontSize: 12, fontWeight: 600, color: '#595959' };

export default BTBPage;

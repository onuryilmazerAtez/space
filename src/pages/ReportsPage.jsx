import React, { useState, useEffect, useRef } from 'react';
import {
    Card, Typography, Space, Button, Select, Tag, Table, Tabs, Drawer,
    DatePicker, Statistic, Progress, Divider, Tooltip, Badge,
    Row, Col, message, Dropdown, Input, Modal, Popconfirm, Spin
} from 'antd';
import {
    DownloadOutlined, ArrowUpOutlined, ArrowDownOutlined,
    DollarOutlined, UserOutlined, RiseOutlined, SwapOutlined,
    FileExcelOutlined, FilePdfOutlined,
    InfoCircleOutlined, CalendarOutlined, ReloadOutlined,
    PlusOutlined, CameraOutlined, SaveOutlined, SendOutlined, CheckCircleOutlined,
    DeleteOutlined, EditOutlined, SearchOutlined, FolderOpenOutlined,
    BarChartOutlined, ShopOutlined, PercentageOutlined, RobotOutlined,
    SettingOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import html2canvas from 'html2canvas';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
    Legend, ResponsiveContainer, LineChart, Line,
} from 'recharts';
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
                <Progress percent={v} showInfo={false} strokeColor={COLORS.purple} size="small" />
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
const LS_KEY_DRAFTS = 'space_draft_reports';

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

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
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
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const [reportToShare, setReportToShare] = useState(null);
    const [searchText, setSearchText] = useState('');

    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ title: '', desc: '' });

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [activeTemplateForDrawer, setActiveTemplateForDrawer] = useState(null);

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
    const [draftReports, setDraftReports] = useState(() => getSavedReports(LS_KEY_DRAFTS));

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

    const handleSaveReport = (type) => { // 'draft' or 'generated'
        if (!selectedRowKeys.length) return message.warning('Lütfen en az bir eşya seçin.');

        const newReport = {
            id: Date.now().toString(),
            title: reportTitle || (type === 'draft' ? 'İsimsiz Taslak' : 'Yeni Rapor'),
            date: new Date().toISOString(),
            items: catalogData.filter(item => selectedRowKeys.includes(item.key)),
        };

        if (type === 'draft') {
            const updated = [newReport, ...draftReports];
            setDraftReports(updated);
            saveReportsToLS(LS_KEY_DRAFTS, updated);
            message.success('Taslak olarak kaydedildi.');
        } else {
            const updated = [newReport, ...generatedReports];
            setGeneratedReports(updated);
            saveReportsToLS(LS_KEY_GENERATED, updated);
            message.success('Rapor oluşturuldu ve kaydedildi.');
            setSelectedRowKeys([]);
            setReportTitle('');
            setActiveTab('generated');
        }
    };

    const handleDeleteReport = (id, type) => {
        if (type === 'draft') {
            const updated = draftReports.filter(r => r.id !== id);
            setDraftReports(updated);
            saveReportsToLS(LS_KEY_DRAFTS, updated);
        } else {
            const updated = generatedReports.filter(r => r.id !== id);
            setGeneratedReports(updated);
            saveReportsToLS(LS_KEY_GENERATED, updated);
        }
        message.success('Rapor silindi.');
    };

    const handleEditDraft = (report) => {
        setReportTitle(report.title);
        setSelectedRowKeys(report.items.map(i => i.key));
        setActiveTab('create');
        // Delete the draft after loading it? 
        // We will keep it simple and just let them save a new one or overwrite later.
    };

    const handleShareEmailSubmit = () => {
        if (!shareEmail.trim()) return;
        message.success(`${reportToShare.title} raporu ${shareEmail} adresine gönderildi.`);
        setShareModalVisible(false);
        setShareEmail('');
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
                title={<span>📈 Aylık Gelir & Gider Trendi</span>}
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
                title="📊 Aylık Gelir Karşılaştırması"
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
                title="👥 Kullanıcı Aktivite Trendi"
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
                        <Line type="monotone" dataKey="kayıp" name="Kaybedilen" stroke={COLORS.danger} strokeWidth={2} strokeDasharray="5 3" dot={false} />
                        {comparison && <Line type="monotone" dataKey="geçenYıl" name="Geçen Yıl" stroke="#bbb" strokeDasharray="5 3" dot={false} />}
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            <Card
                title="📊 Aylık Kullanıcı Kazanımı & Kaybı"
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
            title="🛒 Ürün / Plan Performansı"
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
                <Card title="🍩 Trafik Dağılımı" style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }} styles={{ body: { paddingTop: 8 } }}>
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

                <Card title="📡 Kanal Sıralaması" style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }} styles={{ body: { display: 'flex', flexDirection: 'column', gap: 18 } }}>
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
                title="🔗 Kanal Detay Raporu"
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
        { key: 'gelir', label: <span>💰 Gelir</span>, children: gelirTab },
        { key: 'kullanıcı', label: <span>👥 Kullanıcılar</span>, children: kullanıcıTab },
        { key: 'ürün', label: <span>🛒 Ürünler</span>, children: ürünTab },
        { key: 'kanal', label: <span>📡 Kanallar</span>, children: kanalTab },
    ];

    const renderOverview = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>📊 Raporlar Genel Bakış</Title>
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
        if (!selectedTemplate) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <Title level={4} style={{ margin: 0 }}>Rapor Oluştur</Title>
                        <Text type="secondary">İhtiyacınıza uygun rapor şablonunu seçin veya yeni bir şablon oluşturun.</Text>
                    </div>

                    <Row gutter={[16, 16]}>
                        {templates.map(t => (
                            <Col xs={24} sm={12} lg={8} xl={6} key={t.id}>
                                <Card
                                    hoverable
                                    onClick={() => setSelectedTemplate(t)}
                                    style={{ borderRadius: 12, border: '1px solid #e5e7eb', height: '100%', cursor: 'pointer' }}
                                    styles={{ body: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', paddingTop: 28 } }}
                                >
                                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                                        <Tag color={getTopicTagColor(t.topic)} style={{ borderRadius: 12 }}>{t.topic || 'Genel'}</Tag>
                                    </div>
                                    {getTemplateIcon(t.icon, t.color)}
                                    <Title level={5} style={{ margin: '0 0 8px 0' }}>{t.title}</Title>
                                    <Text type="secondary" style={{ fontSize: 13 }}>{t.desc}</Text>
                                </Card>
                            </Col>
                        ))}
                        <Col xs={24} sm={12} lg={8} xl={6}>
                            <Card
                                hoverable
                                style={{ textAlign: 'center', borderRadius: 12, border: '1px dashed #d9d9d9', height: '100%', minHeight: 180, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fafafa' }}
                                onClick={() => setIsTemplateModalOpen(true)}
                            >
                                <PlusOutlined style={{ fontSize: 32, color: '#bfbfbf', marginBottom: 12 }} />
                                <div style={{ fontSize: 16, fontWeight: 500, color: '#8c8c8c' }}>Yeni Şablon Ekle</div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            );
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => setSelectedTemplate(null)} type="text" size="large" />
                        <div>
                            <Title level={4} style={{ margin: 0 }}>{selectedTemplate.title} Oluşturuluyor</Title>
                            <Text type="secondary">{selectedTemplate.desc}</Text>
                        </div>
                    </div>
                    <Button icon={<InfoCircleOutlined />} onClick={() => { setActiveTemplateForDrawer(selectedTemplate); setDrawerVisible(true); }}>Şablon Özellikleri</Button>
                </div>

                <Card styles={{ body: { padding: 20 } }} style={{ borderRadius: 12, boxShadow: ds.shadow.card }}>
                    <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <Input
                            placeholder="Eşya kodu, firma, açıklama ara..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 320 }}
                            allowClear
                        />
                        <Space>
                            <Input
                                placeholder="Rapor Başlığı (İsteğe bağlı)"
                                value={reportTitle}
                                onChange={e => setReportTitle(e.target.value)}
                                style={{ width: 200 }}
                            />
                            <Button icon={<FolderOpenOutlined />} onClick={() => message.info('Katalog açılıyor...')} type="default">Eşya Kataloğunu Aç</Button>
                            <Button icon={<SaveOutlined />} onClick={() => handleSaveReport('draft')} type="default">Raporu Kaydet</Button>
                            <Button icon={<CheckCircleOutlined />} onClick={() => handleSaveReport('generated')} type="primary">Raporu Tamamla</Button>
                        </Space>
                    </Space>

                    <Table
                        columns={catalogCols}
                        dataSource={filteredCatalog}
                        loading={loadingCatalog}
                        rowSelection={{
                            selectedRowKeys,
                            onChange: (keys) => setSelectedRowKeys(keys)
                        }}
                        rowKey="key"
                        pagination={{ pageSize: 10 }}
                        size="small"
                        scroll={{ x: 'max-content' }}
                    />
                </Card>

                {/* Hidden export view for html2canvas */}
                <div ref={exportRef} style={{ display: 'none', position: 'absolute', top: '-9999px', left: '-9999px', width: '800px', background: 'white', padding: 40, fontFamily: 'sans-serif' }}>
                    <h1 style={{ color: '#1a1a2e', borderBottom: '2px solid #1677ff', paddingBottom: 10 }}>{reportTitle || selectedTemplate.title}</h1>
                    <p style={{ color: '#666', fontSize: 13, marginBottom: 20 }}>Oluşturulma Tarihi: {new Date().toLocaleDateString('tr-TR')} • Toplam Eşya: {selectedRowKeys.length}</p>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                                <th style={{ padding: 8, border: '1px solid #ddd' }}>Eşya Kodu</th>
                                <th style={{ padding: 8, border: '1px solid #ddd' }}>Firma</th>
                                <th style={{ padding: 8, border: '1px solid #ddd' }}>Açıklama</th>
                                <th style={{ padding: 8, border: '1px solid #ddd' }}>GTIP TR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {catalogData.filter(i => selectedRowKeys.includes(i.key)).map(item => (
                                <tr key={item.key}>
                                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{item['Eşya Kodu']}</td>
                                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{item['Firma Adı']}</td>
                                    <td style={{ padding: 8, border: '1px solid #ddd', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item['Eşya Açıklaması']}</td>
                                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{item['Eşya Tarifesi-TR']}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const reportListCols = (type) => [
        {
            title: 'Rapor Başlığı',
            dataIndex: 'title',
            key: 'title',
            render: v => <Text strong>{v}</Text>,
            ...(type === 'generated' ? {
                filters: Array.from(new Set(generatedReports.map(r => r.title))).map(t => ({ text: t, value: t })),
                onFilter: (value, record) => record.title === value,
            } : {})
        },
        { title: 'Tarih', dataIndex: 'date', key: 'date', render: v => new Date(v).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }) },
        { title: 'Eşya Sayısı', dataIndex: 'items', key: 'items', render: v => <Tag color="blue">{v.length} eşya</Tag> },
        {
            title: 'İşlemler', key: 'actions', width: 250,
            render: (_, record) => (
                <Space>
                    {type === 'generated' && (
                        <>
                            <Tooltip title="Paylaş"><Button size="middle" type="text" icon={<SendOutlined />} onClick={() => { setReportToShare(record); setShareModalVisible(true); }} /></Tooltip>
                            <Tooltip title="İndir"><Button size="middle" type="text" icon={<DownloadOutlined />} onClick={() => exportToExcel(record.items, 'Rapor', record.title)} /></Tooltip>
                        </>
                    )}
                    {type === 'draft' && (
                        <Tooltip title="Düzenle"><Button size="middle" type="text" icon={<EditOutlined />} onClick={() => handleEditDraft(record)} /></Tooltip>
                    )}
                    <Popconfirm title="Silmek istediğinize emin misiniz?" onConfirm={() => handleDeleteReport(record.id, type)} okText="Evet" cancelText="İptal">
                        <Tooltip title="Sil"><Button size="middle" type="text" danger icon={<DeleteOutlined />} /></Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const renderReportList = (data, type) => (
        <Card style={{ borderRadius: 12, boxShadow: ds.shadow.card }}>
            {data.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                    <FolderOpenOutlined style={{ fontSize: 48, marginBottom: 16, color: '#ccc' }} /><br />
                    Henüz {type === 'draft' ? 'taslak' : 'oluşturulmuş'} raporunuz bulunmuyor.
                </div>
            ) : (
                <Table
                    columns={reportListCols(type)}
                    dataSource={data}
                    rowKey="id"
                    pagination={{ pageSize: 15 }}
                />
            )}
        </Card>
    );

    // Main layout tabs
    const mainTabs = [
        { key: 'create', label: <span>📝 Rapor Oluştur</span>, children: renderCreateReport() },
        { key: 'generated', label: <span>📂 Oluşturulan Raporlar <Badge count={generatedReports.length} style={{ marginLeft: 8, backgroundColor: '#52c41a' }} /></span>, children: renderReportList(generatedReports, 'generated') },
        { key: 'drafts', label: <span>✏️ Taslak Raporlar <Badge count={draftReports.length} style={{ marginLeft: 8, backgroundColor: '#faad14' }} /></span>, children: renderReportList(draftReports, 'draft') },
    ];

    return (
        <div style={{ paddingBottom: 40 }}>
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={mainTabs}
                size="large"
                tabBarStyle={{ marginBottom: 24, background: 'white', padding: '0 20px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            />

            <Modal
                title={<span><SendOutlined /> Raporu Paylaş</span>}
                open={shareModalVisible}
                onCancel={() => setShareModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShareModalVisible(false)}>İptal</Button>,
                    <Button key="send" type="primary" onClick={handleShareEmailSubmit} disabled={!shareEmail.includes('@')}>Gönder</Button>
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

// ─── Design system simple mock if unsupported ────────────────────────────────
const ds = {
    colors: { border: '#e5e7eb', surface: '#fff', surfaceHover: '#f9fafb', text: '#1f2937', textSecondary: '#6b7280' },
    shadow: { card: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)' }
};

import { useState, useMemo } from 'react';
import { Card, Typography, Button, Table, Input, DatePicker, Select, message, Tooltip } from 'antd';
import {
    ArrowLeftOutlined,
    TableOutlined, DownloadOutlined,
    CalendarOutlined, ScheduleOutlined, FieldTimeOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const PRIMARY = '#2563EB';

// ── Mock data ─────────────────────────────────────────────────────────────────

const SERVICES = [
    { key: 's1', hizmet: 'Dual-Use Sınıflandırma', ulke: 'Almanya',          atamaTarihi: '11.08.2026', tamamlanmaTarihi: '12.08.2026', sure: '1.5', durum: 'Tamamlandı' },
    { key: 's2', hizmet: 'Dual-Use Sınıflandırma', ulke: 'Birleşik Krallık', atamaTarihi: '11.08.2026', tamamlanmaTarihi: '-',           sure: null,  durum: 'Devam Ediyor' },
    { key: 's3', hizmet: 'GTİP Tespiti',            ulke: 'İsviçre',          atamaTarihi: '11.08.2026', tamamlanmaTarihi: '12.08.2026', sure: '7.2', durum: 'Tamamlandı' },
    { key: 's4', hizmet: 'GTİP Tespiti',            ulke: 'Avrupa Birliği',   atamaTarihi: '11.08.2026', tamamlanmaTarihi: '-',           sure: null,  durum: 'Devam Ediyor' },
];

const FIRMS = {
    '1': [
        { key: 'f1', firma: 'NovaTech',           atanan: 213, degisiklik: 12, tamamlanan: 32, bekleyen: 3, yuzde: 75, sure: '1.2 Saat', durum: 'Düzenli',   hizmetler: SERVICES },
        { key: 'f2', firma: 'Vertex Innovations', atanan: 458, degisiklik: 20, tamamlanan: 12, bekleyen: 0, yuzde: 20, sure: '3.5 Saat', durum: 'Aksıyor',   hizmetler: [] },
        { key: 'f3', firma: 'Quantum Leap',        atanan: 389, degisiklik: 28, tamamlanan: 12, bekleyen: 0, yuzde: 90, sure: '2.8 Saat', durum: 'Düzenli',   hizmetler: [] },
        { key: 'f4', firma: 'Blue Horizon',        atanan: 576, degisiklik: 36, tamamlanan:  6, bekleyen: 0, yuzde:  5, sure: '5.1 Saat', durum: 'Gecikmeli', hizmetler: [] },
    ],
    '2': [
        { key: 'f5', firma: 'Aras Lojistik',  atanan: 120, degisiklik:  6, tamamlanan:  95, bekleyen: 1, yuzde: 80, sure: '1.0 Saat', durum: 'Düzenli',   hizmetler: [] },
        { key: 'f6', firma: 'Yıldız Holding', atanan:  93, degisiklik:  6, tamamlanan: 340, bekleyen: 1, yuzde: 70, sure: '1.4 Saat', durum: 'Gecikmeli', hizmetler: [] },
    ],
    '3': [], '4': [], '5': [],
};

// ── KPI Catalog Segments (replaces stat cards) ───────────────────────────────
const KPI_SEGMENTS = [
    { key: 'aktif',       label: 'Aktif Müşavir',                    count: 16,  color: '#3b82f6' },
    { key: 'sure',        label: 'Ort. Sınıflandırma Süresi',        count: 4.9, color: '#f59e0b', suffix: ' saat', delta: { value: '3.2% gerileme', up: false } },
    { key: 'degisiklik',  label: 'Toplam Değişiklik Yapılan İşlem',  count: 32,  color: '#10b981', delta: { value: '8.4% geçen döneme göre', up: true } },
    { key: 'siniflandirilan', label: 'Toplam Sınıflandırılan Ürün',  count: 231, color: '#6366f1', delta: { value: '8.4% geçen döneme göre', up: true } },
];

// ── Filter options for KPI catalog ────────────────────────────────────────────
const FIRMA_OPTIONS = [
    { value: '__all__',            label: 'Tümü' },
    { value: 'NovaTech',           label: 'NovaTech' },
    { value: 'Vertex Innovations', label: 'Vertex Innovations' },
    { value: 'Quantum Leap',       label: 'Quantum Leap' },
    { value: 'Blue Horizon',       label: 'Blue Horizon' },
    { value: 'Aras Lojistik',      label: 'Aras Lojistik' },
    { value: 'Yıldız Holding',     label: 'Yıldız Holding' },
];

const ULKE_OPTIONS = [
    { value: '__all__',            label: 'Tümü' },
    { value: 'Almanya',            label: 'Almanya' },
    { value: 'Birleşik Krallık',  label: 'Birleşik Krallık' },
    { value: 'İsviçre',           label: 'İsviçre' },
    { value: 'Avrupa Birliği',    label: 'Avrupa Birliği' },
    { value: 'Amerika Birleşik Devletleri', label: 'Amerika Birleşik Devletleri' },
    { value: 'Fransa',            label: 'Fransa' },
    { value: 'İtalya',            label: 'İtalya' },
];

const HIZMET_OPTIONS = [
    { value: '__all__',                 label: 'Tümü' },
    { value: 'Dual-Use Sınıflandırma', label: 'Dual-Use Sınıflandırma' },
    { value: 'GTİP Tespiti',            label: 'GTİP Tespiti' },
    { value: 'İhracat Kontrolü',        label: 'İhracat Kontrolü' },
    { value: 'Menşe Tespiti',           label: 'Menşe Tespiti' },
];

const ADVISORS = [
    { key: '1', musavir: 'Mehmet Necdet', atanan: 326, degisiklik:  4, tamamlanan:   32, bekleyen:  1, yuzde: 40, sure: '4.9 Saat', durum: 'Düzenli'  },
    { key: '2', musavir: 'Ali Sunal',      atanan: 213, degisiklik: 12, tamamlanan:  435, bekleyen:  2, yuzde: 75, sure: '1.2 Saat', durum: 'Gecikmeli' },
    { key: '3', musavir: 'Zehra Yıldırım', atanan: 458, degisiklik: 20, tamamlanan: 4325, bekleyen:  0, yuzde: 20, sure: '3.5 Saat', durum: 'Aksıyor'   },
    { key: '4', musavir: 'Emre Kaan',      atanan: 389, degisiklik: 28, tamamlanan:   23, bekleyen:  4, yuzde: 90, sure: '2.8 Saat', durum: 'Düzenli'   },
    { key: '5', musavir: 'Fatma Güneş',    atanan: 576, degisiklik: 36, tamamlanan:   12, bekleyen: 12, yuzde:  5, sure: '5.1 Saat', durum: 'Düzenli'   },
];

const STATUS_DOT = { Düzenli: '#52c41a', Gecikmeli: '#fa8c16', Aksıyor: '#ff4d4f' };

// ── Shared helpers ────────────────────────────────────────────────────────────

const ProgressBar = ({ percent }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 80, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ width: `${percent}%`, height: '100%', background: PRIMARY, borderRadius: 3 }} />
        </div>
        <Text style={{ fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{percent}%</Text>
    </div>
);

const StatusDot = ({ durum }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_DOT[durum] || '#d1d5db', display: 'inline-block', flexShrink: 0 }} />
        {durum}
    </span>
);

const ExpandBtn = ({ expanded, onExpand, record }) => (
    <button
        onClick={e => { e.stopPropagation(); onExpand(record, e); }}
        style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: 4, width: 20, height: 20, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: 13, lineHeight: 1, padding: 0 }}
    >
        {expanded ? '−' : '+'}
    </button>
);

// ── Service (innermost) table ─────────────────────────────────────────────────

function ServiceTable({ data }) {
    const getRowSpan = (rowIndex) => {
        const cur = data[rowIndex].hizmet;
        if (rowIndex > 0 && data[rowIndex - 1].hizmet === cur) return 0;
        let n = 1;
        while (rowIndex + n < data.length && data[rowIndex + n].hizmet === cur) n++;
        return n;
    };

    const columns = [
        {
            title: 'Hizmet', dataIndex: 'hizmet', key: 'hizmet', width: 220,
            onCell: (_, i) => ({ rowSpan: getRowSpan(i) }),
            render: v => <Text style={{ fontSize: 13, fontWeight: 500 }}>{v}</Text>,
        },
        { title: 'Ülke', dataIndex: 'ulke', key: 'ulke', width: 150, render: v => <Text style={{ fontSize: 13 }}>{v}</Text> },
        {
            title: 'Ort. İşlem Süresi', dataIndex: 'sure', key: 'sure', width: 140,
            render: v => {
                if (v == null) return <Text style={{ fontSize: 13, color: '#9ca3af' }}>-</Text>;
                const h = parseFloat(v);
                const color = h <= 2 ? '#52c41a' : h <= 6 ? '#8c8c8c' : '#ff4d4f';
                const label = h <= 2 ? 'Düzenli (0-2 saat)' : h <= 6 ? 'Aksıyor (2-6 saat)' : 'Gecikmeli (6+ saat)';
                return (
                    <Tooltip title={label}>
                        <Text style={{ fontSize: 13, color, fontWeight: 500, cursor: 'default' }}>{h.toFixed(1)} Saat</Text>
                    </Tooltip>
                );
            },
        },
        { title: 'Eşya Sayısı', dataIndex: 'esyaSayisi', key: 'esyaSayisi', width: 110, render: v => <Text style={{ fontSize: 13 }}>{v ?? '-'}</Text> },
    ];

    return (
        <div style={{ margin: '0 0 0 48px', border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
            <Table columns={columns} dataSource={data} rowKey="key" size="small" pagination={false} className="service-inner-table" />
        </div>
    );
}

// ── Firma (middle) table ──────────────────────────────────────────────────────

function FirmaTable({ data }) {
    const [expandedKeys, setExpandedKeys] = useState([]);

    const columns = [
        { title: '', dataIndex: '_pad', key: '_pad', width: 48, render: () => null },
        { title: 'Firma', dataIndex: 'firma', key: 'firma', width: 200, render: v => <Text style={{ fontSize: 13, fontWeight: 500 }}>{v}</Text> },
        { title: 'Atanan', dataIndex: 'atanan', key: 'atanan', width: 90, render: v => <Text style={{ fontSize: 13 }}>{v}</Text> },
        { title: 'Değişiklik Yapılan Sınıflandırma Sayısı', dataIndex: 'degisiklik', key: 'degisiklik', width: 200, render: v => <Text style={{ fontSize: 13 }}>{v}</Text> },
        { title: 'Tamamlanan', dataIndex: 'tamamlanan', key: 'tamamlanan', width: 110, render: v => <Text style={{ fontSize: 13 }}>{v}</Text> },
        { title: 'Bekleyen', dataIndex: 'bekleyen', key: 'bekleyen', width: 100, render: v => <Text style={{ fontSize: 13 }}>{v}</Text> },
        { title: 'Tamamlanma Yüzdesi', dataIndex: 'yuzde', key: 'yuzde', width: 180, render: v => <ProgressBar percent={v} /> },
        { title: 'Ort. İşlem Süresi', dataIndex: 'sure', key: 'sure', width: 140, render: v => <Text style={{ fontSize: 13 }}>{v}</Text> },
        { title: 'Durum', dataIndex: 'durum', key: 'durum', width: 110, render: v => <StatusDot durum={v} /> },
    ];

    return (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, margin: '8px 0 8px 48px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
                <Text strong style={{ fontSize: 14 }}>Firma Bazlı Performans</Text>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="key"
                size="small"
                pagination={false}
                className="firma-inner-table"
                expandable={{
                    expandedRowKeys: expandedKeys,
                    onExpandedRowsChange: setExpandedKeys,
                    expandedRowRender: rec => rec.hizmetler.length > 0 ? <ServiceTable data={rec.hizmetler} /> : null,
                    rowExpandable: rec => rec.hizmetler.length > 0,
                    expandIcon: ({ expanded, onExpand, record }) =>
                        record.hizmetler.length > 0
                            ? <ExpandBtn expanded={expanded} onExpand={onExpand} record={record} />
                            : <span style={{ display: 'inline-block', width: 20 }} />,
                }}
            />
        </div>
    );
}



// ── Main page ─────────────────────────────────────────────────────────────────

export default function KpiReportPage() {
    const navigate = useNavigate();
    const [period, setPeriod]             = useState('gunluk');
    const [reportName, setReportName]     = useState('');
    const [dateRange, setDateRange]       = useState(null);
    const [kpiPeriod, setKpiPeriod]       = useState('gunluk');
    const [kpiDateRange, setKpiDateRange] = useState(null);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [kpiFirma, setKpiFirma]         = useState('__all__');
    const [kpiUlke, setKpiUlke]           = useState('__all__');
    const [kpiHizmet, setKpiHizmet]       = useState('__all__');
    const [lastRefreshed, setLastRefreshed]         = useState(null);
    const [advisorLastRefreshed, setAdvisorLastRefreshed] = useState(null);

    const handleKpiRefresh = () => {
        setLastRefreshed(new Date());
    };

    const handleAdvisorRefresh = () => {
        setAdvisorLastRefreshed(new Date());
    };

    // Filtered KPI segments: Firma/Hizmet filters affect all EXCEPT "Aktif Müşavir"
    const filteredKpiSegments = useMemo(() => {
        const firmaActive  = kpiFirma  !== '__all__';
        const hizmetActive = kpiHizmet !== '__all__';
        if (!firmaActive && !hizmetActive) return KPI_SEGMENTS;
        return KPI_SEGMENTS.map(s => {
            if (s.key === 'aktif') return s;
            const factor = (firmaActive && hizmetActive) ? 0.25 : 0.6;
            const newCount = typeof s.count === 'number' && s.count % 1 !== 0
                ? +(s.count * factor).toFixed(1)
                : Math.round(s.count * factor);
            return { ...s, count: newCount };
        });
    }, [kpiFirma, kpiHizmet]);

    const periods = [
        { key: 'gunluk', label: 'Anlık',               icon: <CalendarOutlined />   },
        { key: 'aylik',  label: 'Aylık',               icon: <ScheduleOutlined />   },
        { key: 'ozel',   label: 'Belirli Tarih Aralığı', icon: <FieldTimeOutlined /> },
    ];

    const handleSave = () => {
        if (!reportName.trim()) {
            message.warning('Lütfen rapor adı girin.');
            return;
        }
        const newReport = {
            id: Date.now().toString(),
            title: reportName.trim(),
            category: 'yonetici',
            date: new Date().toISOString(),
            createdBy: 'Yönetici',
            items: [],
        };
        try {
            const existing = JSON.parse(localStorage.getItem('space_generated_reports') || '[]');
            localStorage.setItem('space_generated_reports', JSON.stringify([newReport, ...existing]));
        } catch (e) { /* ignore */ }
        message.success(`"${reportName}" raporu kaydedildi.`);
        setReportName('');
    };

    // Period değişince genişletilmiş satırları sıfırla
    const handlePeriodChange = (key) => {
        setPeriod(key);
        setExpandedKeys([]);
    };

    const periodAdvisors = useMemo(() => {
        if (period === 'aylik') return ADVISORS;
        if (period === 'gunluk') {
            return ADVISORS.map(a => ({
                ...a,
                atanan:     Math.max(1, Math.round(a.atanan / 30)),
                degisiklik: Math.max(0, Math.round(a.degisiklik / 30)),
                tamamlanan: Math.max(0, Math.round(a.tamamlanan / 30)),
                bekleyen:   Math.max(0, Math.round(a.bekleyen / 30)),
            }));
        }
        if (period === 'ozel' && dateRange && dateRange[0] && dateRange[1]) {
            const days = Math.max(1, dateRange[1].diff(dateRange[0], 'day') + 1);
            const factor = days / 30;
            return ADVISORS.map(a => ({
                ...a,
                atanan:     Math.max(1, Math.round(a.atanan * factor)),
                degisiklik: Math.max(0, Math.round(a.degisiklik * factor)),
                tamamlanan: Math.max(0, Math.round(a.tamamlanan * factor)),
                bekleyen:   Math.max(0, Math.round(a.bekleyen * factor)),
            }));
        }
        return ADVISORS;
    }, [period, dateRange]);

    const filteredAdvisors = periodAdvisors;

    const mainColumns = [
        { title: 'Müşavir', dataIndex: 'musavir', key: 'musavir', width: 180, render: v => <Text style={{ fontSize: 13, fontWeight: 500 }}>{v}</Text> },
        { title: 'Atanan', dataIndex: 'atanan', key: 'atanan', width: 90, render: v => <Text style={{ fontSize: 13 }}>{v}</Text> },
        {
            title: <span>Değişiklik Yapılan<br />Sınıflandırma Sayısı</span>,
            dataIndex: 'degisiklik', key: 'degisiklik', width: 170,
            render: v => <Text style={{ fontSize: 13 }}>{v}</Text>,
        },
        { title: 'Tamamlanan', dataIndex: 'tamamlanan', key: 'tamamlanan', width: 110, render: v => <Text style={{ fontSize: 13 }}>{v}</Text> },
        { title: 'Bekleyen', dataIndex: 'bekleyen', key: 'bekleyen', width: 100, render: v => <Text style={{ fontSize: 13 }}>{v}</Text> },
        { title: 'Tamamlanma Yüzdesi', dataIndex: 'yuzde', key: 'yuzde', width: 200, render: v => <ProgressBar percent={v} /> },
        { title: 'Ort. İşlem Süresi', dataIndex: 'sure', key: 'sure', width: 140, render: v => <Text style={{ fontSize: 13 }}>{v}</Text> },
        { title: 'Durum', dataIndex: 'durum', key: 'durum', width: 110, render: v => <StatusDot durum={v} /> },
        {
            title: '', key: 'actions', width: 80,
            render: () => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button style={{ width: 28, height: 28, border: '1px solid #e5e7eb', borderRadius: 6, background: '#f9fafb', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                        <TableOutlined style={{ fontSize: 13 }} />
                    </button>
                    <button style={{ width: 28, height: 28, border: '1px solid #e5e7eb', borderRadius: 6, background: '#f9fafb', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                        <DownloadOutlined style={{ fontSize: 13 }} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ minHeight: '100%', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                .kpi-period-btn { background: transparent; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 400; color: #6b7280; font-family: 'Inter', sans-serif; transition: color 0.15s; }
                .kpi-period-btn.active { background: #fff; color: #111827; box-shadow: 0 1px 3px rgba(0,0,0,0.12); border-radius: 6px; }
                .ant-table-thead > tr > th { background: #fafafa !important; font-size: 12px !important; font-weight: 600 !important; color: #6b7280 !important; border-bottom: 1px solid #f0f0f0 !important; padding: 10px 12px !important; }
                .ant-table-tbody > tr > td { font-size: 13px; padding: 12px !important; border-bottom: 1px solid #f9fafb !important; }
                .ant-table-tbody > tr:hover > td { background: inherit !important; }
                .firma-inner-table .ant-table-thead > tr > th { background: #fafafa !important; padding: 8px 12px !important; }
                .firma-inner-table .ant-table-tbody > tr > td { padding: 10px 12px !important; }
                .service-inner-table .ant-table-thead > tr > th { background: #f5f8ff !important; padding: 8px 12px !important; }
                .service-inner-table .ant-table-tbody > tr > td { padding: 10px 12px !important; border-bottom: 1px solid #e8eef8 !important; }
                .service-inner-table .ant-table-cell { border-right: 1px solid #e5e7eb !important; }
                .service-inner-table .ant-table-cell:last-child { border-right: none !important; }
                .ant-table-expanded-row > td { padding: 0 !important; background: #f9fafb !important; }
                .ant-card { transition: none !important; transform: none !important; }
                .ant-card:hover { transform: none !important; box-shadow: none !important; }
            `}</style>

            {/* Sticky page header */}
            <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => navigate('/reports')} style={{ width: 32, height: 32, border: '1px solid #e5e7eb', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', flexShrink: 0 }}>
                            <ArrowLeftOutlined style={{ fontSize: 14 }} />
                        </button>
                        <div>
                            <Title level={3} style={{ margin: 0, fontWeight: 700, fontSize: 22 }}>Yönetici Performans Raporu</Title>
                            <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>Müşavir bazlı eşya işlem performansını takip edin</Text>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Input
                            placeholder="Rapor Adı Giriniz..."
                            value={reportName}
                            onChange={e => setReportName(e.target.value)}
                            onPressEnter={handleSave}
                            style={{ width: 200, borderRadius: 6, fontSize: 13 }}
                        />
                        <Button type="primary" onClick={handleSave} style={{ background: PRIMARY, borderColor: PRIMARY, borderRadius: 6, fontWeight: 400 }}>
                            Kaydet
                        </Button>
                        <Button icon={<DownloadOutlined />} style={{ borderRadius: 6, fontWeight: 400, color: '#374151' }}>
                            Excel
                        </Button>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>

            {/* KPI Catalog — Master Data style */}
            <div style={{ width: '100%', background: '#fff', borderRadius: 6, border: '1px solid #e5e7eb', boxShadow: 'none', overflow: 'hidden', marginBottom: 20, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>Performans Özeti</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {lastRefreshed && (
                            <span style={{ fontSize: 12, color: '#9ca3af' }}>
                                Son güncelleme: {lastRefreshed.toLocaleTimeString('tr-TR')}
                            </span>
                        )}
                        <Button
                            icon={<ReloadOutlined />}
                            size="small"
                            onClick={handleKpiRefresh}
                            style={{ borderRadius: 6, color: '#6b7280', borderColor: '#e5e7eb' }}
                        >
                            Yenile
                        </Button>
                    </div>
                </div>

                {/* Filter row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap', background: '#fafafa' }}>
                    <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, flexShrink: 0 }}>Filtre</span>
                    <Select
                        value={kpiFirma}
                        onChange={setKpiFirma}
                        options={FIRMA_OPTIONS}
                        style={{ minWidth: 140 }}
                        size="middle"
                        popupMatchSelectWidth={false}
                    />
                    <Select
                        value={kpiUlke}
                        onChange={setKpiUlke}
                        options={ULKE_OPTIONS}
                        style={{ minWidth: 150 }}
                        size="middle"
                        popupMatchSelectWidth={false}
                    />
                    <Select
                        value={kpiHizmet}
                        onChange={setKpiHizmet}
                        options={HIZMET_OPTIONS}
                        style={{ minWidth: 160 }}
                        size="middle"
                        popupMatchSelectWidth={false}
                    />
                    <div style={{ width: 1, height: 28, background: '#e5e7eb', flexShrink: 0 }} />
                    <div style={{ display: 'flex', background: '#ebebeb', borderRadius: 6, padding: 3, gap: 2 }}>
                        {periods.map(p => (
                            <button key={p.key} className={`kpi-period-btn${kpiPeriod === p.key ? ' active' : ''}`} onClick={() => setKpiPeriod(p.key)}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{p.icon}{p.label}</span>
                            </button>
                        ))}
                    </div>
                    {kpiPeriod === 'ozel' && (
                        <RangePicker value={kpiDateRange} onChange={setKpiDateRange} format="DD.MM.YYYY" style={{ borderRadius: 6 }} size="middle" />
                    )}
                </div>

                {/* Stats grid */}
                <div style={{ display: 'flex', borderTop: 'none' }}>
                    {filteredKpiSegments.map((s, i) => (
                        <div key={s.key} style={{
                            flex: 1,
                            padding: '16px 20px 14px',
                            borderRight: i < filteredKpiSegments.length - 1 ? '1px solid #e5e7eb' : 'none',
                            display: 'flex', flexDirection: 'column', gap: 2,
                        }}>
                            {/* Number row */}
                            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                <span style={{ fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1, letterSpacing: '-0.03em' }}>
                                    {typeof s.count === 'number' && s.count % 1 !== 0 ? s.count.toFixed(1) : s.count}{s.suffix || ''}
                                </span>
                            </div>
                            {/* Label */}
                            <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 400, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {s.label}
                            </span>
                            {/* Delta info sentence */}
                            {s.delta && (
                                <span style={{ fontSize: 11, marginTop: 4, color: s.delta.up ? '#10b981' : '#ef4444', fontWeight: 500 }}>
                                    {s.delta.up ? '▲' : '▼'} {s.delta.value}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>


            {/* Müşavir Bazlı Performans */}
            <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: 6, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #f0f0f0', gap: 12 }}>
                    <Text strong style={{ fontSize: 15, flexShrink: 0 }}>Müşavir Bazlı Performans <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>(Veriler Hizmet bazlıdır)</Text></Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 6, padding: 3, gap: 2 }}>
                            {periods.map(p => (
                                <button key={p.key} className={`kpi-period-btn${period === p.key ? ' active' : ''}`} onClick={() => handlePeriodChange(p.key)}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{p.icon}{p.label}</span>
                                </button>
                            ))}
                        </div>
                        {period === 'ozel' && (
                            <RangePicker value={dateRange} onChange={setDateRange} format="DD.MM.YYYY" style={{ borderRadius: 6 }} />
                        )}
                        <div style={{ width: 1, height: 24, background: '#e5e7eb', flexShrink: 0 }} />
                        {advisorLastRefreshed && (
                            <span style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                                Son güncelleme: {advisorLastRefreshed.toLocaleTimeString('tr-TR')}
                            </span>
                        )}
                        <Button
                            icon={<ReloadOutlined />}
                            size="small"
                            onClick={handleAdvisorRefresh}
                            style={{ borderRadius: 6, color: '#6b7280', borderColor: '#e5e7eb' }}
                        >
                            Yenile
                        </Button>
                    </div>
                </div>
                <Table
                    columns={mainColumns}
                    dataSource={filteredAdvisors}
                    rowKey="key"
                    size="middle"
                    pagination={false}
                    expandable={{
                        expandedRowKeys: expandedKeys,
                        onExpandedRowsChange: setExpandedKeys,
                        expandedRowRender: rec => <FirmaTable data={FIRMS[rec.key] || []} />,
                        rowExpandable: rec => (FIRMS[rec.key] || []).length > 0,
                        expandIcon: ({ expanded, onExpand, record }) =>
                            (FIRMS[record.key] || []).length > 0
                                ? <ExpandBtn expanded={expanded} onExpand={onExpand} record={record} />
                                : <span style={{ display: 'inline-block', width: 20 }} />,
                    }}
                    onRow={rec => ({
                        onClick: () => {
                            if ((FIRMS[rec.key] || []).length > 0) {
                                setExpandedKeys(prev =>
                                    prev.includes(rec.key) ? prev.filter(k => k !== rec.key) : [...prev, rec.key]
                                );
                            }
                        },
                        style: { cursor: (FIRMS[rec.key] || []).length > 0 ? 'pointer' : 'default' },
                    })}
                />
            </Card>
            </div>
        </div>
    );
}

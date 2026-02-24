import React, { useState, useMemo } from 'react';
import {
    Card, Typography, Space, Button, Select, Tag, Table, Tabs,
    DatePicker, Statistic, Progress, Divider, Tooltip, Badge,
    Segmented, Row, Col, message, Dropdown,
} from 'antd';
import {
    DownloadOutlined, ArrowUpOutlined, ArrowDownOutlined,
    DollarOutlined, UserOutlined, RiseOutlined, SwapOutlined,
    BarChartOutlined, FileExcelOutlined, FilePdfOutlined,
    InfoCircleOutlined, CalendarOutlined, SyncOutlined,
    FilterOutlined, ReloadOutlined,
} from '@ant-design/icons';
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
    const [activeTab, setActiveTab] = useState('gelir');

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
                    const t = tabMap[activeTab];
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

    // Tab content ─────────────────────────────────────────────────────────────

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
                {/* Pie chart */}
                <Card
                    title="🍩 Trafik Dağılımı"
                    style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                    styles={{ body: { paddingTop: 8 } }}
                >
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={CHANNELS}
                                cx="36%" cy="48%"
                                outerRadius={90}
                                innerRadius={48}
                                dataKey="value"
                                labelLine={false}
                                label={PieLabel}
                            >
                                {CHANNELS.map((c, i) => (
                                    <Cell key={i} fill={c.color} />
                                ))}
                            </Pie>
                            <RTooltip formatter={(v, n) => [`${v}%`, n]} />
                            <Legend
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                                iconType="circle"
                                iconSize={8}
                                formatter={(value, entry) => (
                                    <span style={{ fontSize: 12 }}>{entry.payload.name}: <strong>{entry.payload.value}%</strong></span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                {/* Progress bars per channel */}
                <Card
                    title="📡 Kanal Sıralaması"
                    style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                    styles={{ body: { display: 'flex', flexDirection: 'column', gap: 18 } }}
                >
                    {CHANNELS.map((c, i) => (
                        <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Space>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                                    <Text style={{ fontSize: 13 }}>{c.name}</Text>
                                </Space>
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
                    <Button
                        size="small" icon={<DownloadOutlined />}
                        onClick={() => exportToExcel(
                            CHANNEL_TABLE.map(({ renk: _, ...r }) => r),
                            'Kanallar', 'kanal_raporu'
                        )}
                    >
                        İndir
                    </Button>
                }
                style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
                <Table
                    dataSource={CHANNEL_TABLE}
                    columns={channelCols}
                    pagination={false}
                    size="middle"
                    summary={data => (
                        <Table.Summary.Row style={{ background: '#fafafa' }}>
                            <Table.Summary.Cell index={0}><Text strong>Toplam</Text></Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right">
                                <Text strong>{data.reduce((s, r) => s + r.oturum, 0).toLocaleString('tr-TR')}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2} />
                            <Table.Summary.Cell index={3} align="right">
                                <Text strong style={{ color: COLORS.success }}>
                                    {fmtFull(data.reduce((s, r) => s + r.gelir, 0))}
                                </Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={4} />
                        </Table.Summary.Row>
                    )}
                />
            </Card>
        </div>
    );

    const tabs = [
        { key: 'gelir', label: <span>💰 Gelir</span>, children: gelirTab },
        { key: 'kullanıcı', label: <span>👥 Kullanıcılar</span>, children: kullanıcıTab },
        { key: 'ürün', label: <span>🛒 Ürünler</span>, children: ürünTab },
        { key: 'kanal', label: <span>📡 Kanallar</span>, children: kanalTab },
    ];

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* ── Page header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>📊 Raporlar</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        İş performansını analiz edin ve raporları indirin
                    </Text>
                </div>
                <Space wrap>
                    <Button
                        icon={<SwapOutlined />}
                        type={comparison ? 'primary' : 'default'}
                        onClick={() => setComparison(v => !v)}
                        ghost={comparison}
                    >
                        Karşılaştır
                    </Button>
                    <Select
                        value={period}
                        onChange={setPeriod}
                        options={[
                            { label: 'Bu Yıl', value: 'yıllık' },
                            { label: 'Bu Çeyrek', value: 'çeyrek' },
                            { label: 'Bu Ay', value: 'aylık' },
                            { label: 'Özel Aralık', value: 'özel' },
                        ]}
                        style={{ width: 140 }}
                        prefix={<CalendarOutlined />}
                    />
                    {period === 'özel' && (
                        <RangePicker size="middle" onCalendarChange={() => { }} />
                    )}
                    <Dropdown menu={exportMenu} trigger={['click']}>
                        <Button type="primary" icon={<DownloadOutlined />}>
                            Raporu İndir
                        </Button>
                    </Dropdown>
                </Space>
            </div>

            {/* ── KPI cards ── */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Toplam Gelir"
                        value={totalRevenue}
                        prefix="₺"
                        delta={18.4}
                        icon={<DollarOutlined />}
                        color={COLORS.primary}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Net Kâr"
                        value={totalProfit}
                        prefix="₺"
                        delta={12.7}
                        icon={<RiseOutlined />}
                        color={COLORS.success}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Yeni Kullanıcı"
                        value={totalNewUsers}
                        delta={24.1}
                        icon={<UserOutlined />}
                        color={COLORS.purple}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Ort. Dönüşüm"
                        value={avgConversion}
                        suffix="%"
                        delta={-2.3}
                        icon={<SwapOutlined />}
                        color={COLORS.warning}
                    />
                </Col>
            </Row>

            {/* ── Comparison banner ── */}
            {comparison && (
                <Card
                    size="small"
                    style={{
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #e6f4ff, #f0f9ff)',
                        border: '1px solid #91caff',
                    }}
                    styles={{ body: { padding: '10px 16px' } }}
                >
                    <Space>
                        <InfoCircleOutlined style={{ color: COLORS.primary }} />
                        <Text style={{ fontSize: 13 }}>
                            <strong>Karşılaştırma modu açık</strong> — grafiklerde kesik çizgi bir önceki yılı göstermektedir.
                        </Text>
                    </Space>
                </Card>
            )}

            {/* ── Tabs ── */}
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabs}
                tabBarStyle={{ marginBottom: 16 }}
                tabBarExtraContent={
                    <Tooltip title="Verileri yenile">
                        <Button
                            type="text"
                            icon={<ReloadOutlined />}
                            onClick={() => message.success('Veriler güncellendi')}
                        />
                    </Tooltip>
                }
            />
        </div>
    );
}

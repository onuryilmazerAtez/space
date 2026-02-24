import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
    Table, Tag, Space, Button, Input, Avatar, Typography,
    Skeleton, Card, Tooltip, Modal, Divider, Badge, Popconfirm, message,
    Popover, Radio, Checkbox, Transfer
} from 'antd';
import {
    SearchOutlined, EditOutlined, DeleteOutlined, UserAddOutlined,
    SaveOutlined, FilterOutlined, CloseCircleOutlined, CheckOutlined,
    DownOutlined, DownloadOutlined
} from '@ant-design/icons';



const { Title, Text } = Typography;

const COLUMNS_CONFIG = [
    { key: 'name', label: 'Ad / E-posta' },
    { key: 'role', label: 'Rol' },
    { key: 'status', label: 'Durum' },
    { key: 'lastActive', label: 'Son Aktif' },
];

const generateData = () => {
    const roles = ['Admin', 'Editor', 'Viewer'];
    const fNames = ['Alice', 'Bob', 'Charlie', 'David'];
    const data = [];
    for (let i = 1; i <= 20; i++) {
        const role = roles[Math.floor(Math.random() * roles.length)];
        const status = Math.random() > 0.3 ? 'Active' : 'Offline';
        const fName = fNames[i % 4];
        data.push({
            key: i,
            name: `${fName} User ${i}`,
            email: `user${i}@example.com`,
            role,
            status,
            lastActive: status === 'Active' ? 'Now' : '2h ago',
            avatar: `https://ui-avatars.com/api/?name=${fName}+${i}&background=random`,
        });
    }
    return data;
};

const ALL_DATA = generateData();

const emptyFilters = () => ({ name: '', role: '', status: '', lastActive: '' });

const applyFilters = (data, filters) =>
    data.filter(row =>
        (!filters.name || row.name.toLowerCase().includes(filters.name.toLowerCase()) ||
            row.email.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.role || row.role.toLowerCase().includes(filters.role.toLowerCase())) &&
        (!filters.status || row.status.toLowerCase().includes(filters.status.toLowerCase())) &&
        (!filters.lastActive || row.lastActive.toLowerCase().includes(filters.lastActive.toLowerCase()))
    );

const hasActiveFilter = f => Object.values(f).some(v => v !== '');

// ── Column header with search input ──────────────────────────────────────────
const SearchableColumnTitle = ({ label, filterKey, value, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <Input
            size="small"
            prefix={<SearchOutlined style={{ color: '#bbb', fontSize: 11 }} />}
            placeholder={`Ara...`}
            value={value}
            onChange={e => onChange(filterKey, e.target.value)}
            onClick={e => e.stopPropagation()}
            allowClear
            style={{ fontSize: 12, borderRadius: 6 }}
        />
    </div>
);

// ── Export column definitions ───────────────────────────────────────────────────
// Note: 'name' in table shows name+email together, so we split them for export.
const EXPORT_COLS = [
    { key: 'name', label: 'Ad' },
    { key: 'email', label: 'E-posta' },
    { key: 'role', label: 'Rol' },
    { key: 'status', label: 'Durum' },
    { key: 'lastActive', label: 'Son Aktif' },
    // — additional columns (demo to show Transfer scalability) —
    { key: 'department', label: 'Departman' },
    { key: 'phone', label: 'Telefon' },
    { key: 'country', label: 'Ülke' },
    { key: 'city', label: 'Şehir' },
    { key: 'joinDate', label: 'Kayıt Tarihi' },
    { key: 'lastLogin', label: 'Son Giriş' },
    { key: 'credits', label: 'Kredi' },
    { key: 'plan', label: 'Plan' },
    { key: 'notes', label: 'Notlar' },
    { key: 'twoFa', label: '2FA Durumu' },
];
// Transfer dataSource requires key+title shape
const EXPORT_TRANSFER_DATA = EXPORT_COLS.map(c => ({ key: c.key, title: c.label }));
// Default: only the 5 real data columns selected
const DEFAULT_EXPORT_COLS = ['name', 'email', 'role', 'status', 'lastActive'];

const downloadTable = ({ data, selectedCols, format, filename }) => {
    // Build rows with only the selected columns
    const cols = EXPORT_COLS.filter(c => selectedCols.includes(c.key));
    const header = cols.map(c => c.label);
    const rows = data.map(row => cols.map(c => row[c.key] ?? ''));

    if (format === 'xlsx') {
        const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Kullanıcılar');
        XLSX.writeFile(wb, `${filename}.xlsx`);
    } else {
        // CSV with UTF-8 BOM so Excel opens it correctly
        const csv = [header, ...rows]
            .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${filename}.csv`; a.click();
        URL.revokeObjectURL(url);
    }
};

// ── Reusable Filter Tag ────────────────────────────────────────────────────────────
const FilterTag = ({ qf, active, onApply, onDelete, block }) => (
    <Tag
        color={active ? 'blue' : 'default'}
        style={{
            cursor: 'pointer', userSelect: 'none',
            borderRadius: 6, padding: '2px 8px',
            flexShrink: 0,
            ...(block ? { display: 'block', marginBottom: 2 } : {}),
        }}
        onClick={() => onApply(qf)}
        closeIcon={
            <Popconfirm
                title={`"${qf.name}" silinsin mi?`}
                onConfirm={(e) => { e.stopPropagation(); onDelete(qf.name); }}
                okText="Evet" cancelText="Hayır"
            >
                <CloseCircleOutlined
                    style={{ fontSize: 11, marginLeft: 4 }}
                    onClick={e => e.stopPropagation()}
                />
            </Popconfirm>
        }
        closable
    >
        {active && <CheckOutlined style={{ marginRight: 4, fontSize: 11 }} />}
        {qf.name}
    </Tag>
);

// ── Seed 50 demo filters into localStorage ───────────────────────────────────────
const seedDemoFilters = () => {
    const existing = (() => { try { return JSON.parse(localStorage.getItem('uf_quickFilters') || '[]'); } catch { return []; } })();
    if (existing.length >= 10) return existing; // already has enough data
    const roles = ['Admin', 'Editor', 'Viewer'];
    const statuses = ['Active', 'Offline'];
    const fNames = ['Alice', 'Bob', 'Charlie', 'David'];
    const demo = Array.from({ length: 50 }, (_, i) => ({
        name: `Filtre ${i + 1} – ${fNames[i % 4]} / ${roles[i % 3]}`,
        filters: {
            name: fNames[i % 4],
            role: roles[i % 3],
            status: statuses[i % 2],
            lastActive: i % 3 === 0 ? 'Now' : '',
        },
    }));
    localStorage.setItem('uf_quickFilters', JSON.stringify(demo));
    return demo;
};

// ── Main Component ────────────────────────────────────────────────────────────
const UsersPage = () => {
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(emptyFilters());
    const [quickFilters, setQuickFilters] = useState(() => seedDemoFilters());
    const [activeQuickFilter, setActiveQuickFilter] = useState(null);
    const [qfOpen, setQfOpen] = useState(false);
    const [qfSearch, setQfSearch] = useState('');

    // Export dialog state
    const [exportOpen, setExportOpen] = useState(false);
    const [exportScope, setExportScope] = useState('filtered'); // 'all' | 'filtered'
    const [exportFormat, setExportFormat] = useState('xlsx');     // 'xlsx' | 'csv'
    const [exportCols, setExportCols] = useState(DEFAULT_EXPORT_COLS);

    // Save-dialog state
    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const [saveName, setSaveName] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(t);
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setActiveQuickFilter(null); // deselect quick filter when manually typing
    };

    const clearFilters = () => {
        setFilters(emptyFilters());
        setActiveQuickFilter(null);
    };

    // Quick filter actions
    const saveQuickFilter = () => {
        if (!saveName.trim()) { message.warning('Lütfen bir isim girin'); return; }
        const newQF = [...quickFilters, { name: saveName.trim(), filters: { ...filters } }];
        setQuickFilters(newQF);
        localStorage.setItem('uf_quickFilters', JSON.stringify(newQF));
        setSaveModalOpen(false);
        setSaveName('');
        message.success(`"${saveName.trim()}" kaydedildi`);
    };

    const applyQuickFilter = (qf) => {
        setFilters({ ...qf.filters });
        setActiveQuickFilter(qf.name);
    };

    const deleteQuickFilter = (name) => {
        const newQF = quickFilters.filter(q => q.name !== name);
        setQuickFilters(newQF);
        localStorage.setItem('uf_quickFilters', JSON.stringify(newQF));
        if (activeQuickFilter === name) { setActiveQuickFilter(null); }
    };

    const filteredData = applyFilters(ALL_DATA, filters);

    const columns = [
        {
            title: (
                <SearchableColumnTitle
                    label="Ad / E-posta" filterKey="name"
                    value={filters.name} onChange={handleFilterChange}
                />
            ),
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => (
                <Space>
                    <Avatar src={record.avatar} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500 }}>{text}</span>
                        <span style={{ fontSize: 12, color: '#888' }}>{record.email}</span>
                    </div>
                </Space>
            ),
        },
        {
            title: (
                <SearchableColumnTitle
                    label="Rol" filterKey="role"
                    value={filters.role} onChange={handleFilterChange}
                />
            ),
            dataIndex: 'role',
            key: 'role',
            sorter: (a, b) => a.role.localeCompare(b.role),
        },
        {
            title: (
                <SearchableColumnTitle
                    label="Durum" filterKey="status"
                    value={filters.status} onChange={handleFilterChange}
                />
            ),
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (status) => (
                <Tag color={status === 'Active' ? 'success' : 'default'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: (
                <SearchableColumnTitle
                    label="Son Aktif" filterKey="lastActive"
                    value={filters.lastActive} onChange={handleFilterChange}
                />
            ),
            dataIndex: 'lastActive',
            key: 'lastActive',
            sorter: (a, b) => a.lastActive.localeCompare(b.lastActive),
        },
        {
            title: 'İşlemler',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} />
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    if (loading) {
        return (
            <div>
                <Skeleton active paragraph={{ rows: 1 }} style={{ marginBottom: 24 }} />
                <Card style={{ borderRadius: 8, padding: 24 }}>
                    <Skeleton active paragraph={{ rows: 8 }} />
                </Card>
            </div>
        );
    }

    return (
        <div>
            {/* ── Page Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>Kullanıcı Yönetimi</Title>
                    <Text type="secondary">Erişim ve yetkileri yönetin.</Text>
                </div>
                <Space wrap>
                    {/* ── Quick Filters Dropdown ── */}
                    <Popover
                        open={qfOpen}
                        onOpenChange={(v) => { setQfOpen(v); if (!v) setQfSearch(''); }}
                        trigger="click"
                        placement="bottomLeft"
                        title={
                            <Input
                                size="small"
                                prefix={<SearchOutlined style={{ color: '#bbb' }} />}
                                placeholder="Filtre ara…"
                                value={qfSearch}
                                onChange={e => setQfSearch(e.target.value)}
                                allowClear
                                autoFocus
                            />
                        }
                        content={
                            <div style={{ width: 280 }}>
                                <div style={{
                                    maxHeight: 300,
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4,
                                    padding: '4px 0',
                                }}>
                                    {quickFilters.length === 0 && (
                                        <Text type="secondary" style={{ fontSize: 12, padding: '8px 4px' }}>Henüz kaydedilmiş filtre yok</Text>
                                    )}
                                    {(qfSearch
                                        ? quickFilters.filter(q => q.name.toLowerCase().includes(qfSearch.toLowerCase()))
                                        : quickFilters
                                    ).map(qf => (
                                        <FilterTag
                                            key={qf.name}
                                            qf={qf}
                                            active={activeQuickFilter === qf.name}
                                            onApply={(q) => { applyQuickFilter(q); setQfOpen(false); }}
                                            onDelete={deleteQuickFilter}
                                            block
                                        />
                                    ))}
                                    {qfSearch && quickFilters.filter(q => q.name.toLowerCase().includes(qfSearch.toLowerCase())).length === 0 && (
                                        <Text type="secondary" style={{ fontSize: 12, padding: '8px 4px' }}>Eşleşme yok</Text>
                                    )}
                                </div>
                                {hasActiveFilter(filters) && (
                                    <>
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space>
                                            <Badge dot>
                                                <Button
                                                    size="small"
                                                    icon={<SaveOutlined />}
                                                    type="primary"
                                                    ghost
                                                    onClick={() => { setSaveModalOpen(true); setQfOpen(false); }}
                                                    style={{ borderRadius: 6 }}
                                                >
                                                    Kaydet
                                                </Button>
                                            </Badge>
                                            <Button
                                                size="small"
                                                icon={<CloseCircleOutlined />}
                                                onClick={() => { clearFilters(); setQfOpen(false); }}
                                                style={{ borderRadius: 6 }}
                                            >
                                                Temizle
                                            </Button>
                                        </Space>
                                    </>
                                )}
                            </div>
                        }
                    >
                        <Badge dot={!!activeQuickFilter} color="#1677ff">
                            <Button
                                icon={<FilterOutlined />}
                                style={{
                                    borderRadius: 8,
                                    background: activeQuickFilter ? '#e6f4ff' : undefined,
                                    borderColor: activeQuickFilter ? '#1677ff' : undefined,
                                    color: activeQuickFilter ? '#1677ff' : undefined,
                                    fontWeight: activeQuickFilter ? 600 : 400,
                                }}
                            >
                                Hızlı Filtreler
                                <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
                            </Button>
                        </Badge>
                    </Popover>

                    <Button type="primary" icon={<UserAddOutlined />}>Yeni Kullanıcı Ekle</Button>
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={() => setExportOpen(true)}
                        style={{ background: '#f0f9ff', borderColor: '#91caff', color: '#1677ff' }}
                    >
                        İndir
                    </Button>
                </Space>
            </div>



            {/* ── Table ── */}
            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 7 }}
                style={{ background: '#fff', borderRadius: 8 }}
                locale={{
                    emptyText: (
                        <div style={{ padding: 32, textAlign: 'center' }}>
                            <SearchOutlined style={{ fontSize: 32, color: '#ccc', marginBottom: 8 }} />
                            <div>
                                <Text type="secondary">Filtreyle eşleşen kullanıcı bulunamadı</Text>
                            </div>
                            <Button size="small" style={{ marginTop: 8 }} onClick={clearFilters}>
                                Filtreleri Temizle
                            </Button>
                        </div>
                    )
                }}
                summary={() =>
                    hasActiveFilter(filters) ? (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={5}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {filteredData.length} / {ALL_DATA.length} kullanıcı gösteriliyor
                                    {activeQuickFilter && ` · "${activeQuickFilter}" filtresi aktif`}
                                </Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    ) : null
                }
            />

            {/* ── Export Modal ── */}
            <Modal
                title={
                    <Space>
                        <DownloadOutlined style={{ color: '#1677ff' }} />
                        Tabloyu İndir
                    </Space>
                }
                open={exportOpen}
                onCancel={() => setExportOpen(false)}
                onOk={() => {
                    if (exportCols.length === 0) {
                        message.warning('En az bir kolon seçiniz');
                        return;
                    }
                    const data = exportScope === 'filtered' ? filteredData : ALL_DATA;
                    const ts = new Date().toISOString().slice(0, 10);
                    downloadTable({
                        data,
                        selectedCols: exportCols,
                        format: exportFormat,
                        filename: `kullaniciler_${ts}`,
                    });
                    setExportOpen(false);
                    message.success(`${data.length} kayıt indirildi`);
                }}
                okText={<Space><DownloadOutlined />İndir</Space>}
                cancelText="İptal"
                okButtonProps={{ disabled: exportCols.length === 0 }}
                width={600}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 8 }}>

                    {/* ── Veri kapsamı ── */}
                    <div>
                        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 10 }}>
                            📊 Veri Kapsamı
                        </Text>
                        <Radio.Group
                            value={exportScope}
                            onChange={e => setExportScope(e.target.value)}
                            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                        >
                            <Radio value="filtered">
                                <span>Yalnızca filtrelenmiş veri</span>
                                <Tag style={{ marginLeft: 8 }} color="blue">{filteredData.length} kayıt</Tag>
                            </Radio>
                            <Radio value="all">
                                <span>Tüm veriler</span>
                                <Tag style={{ marginLeft: 8 }}>{ALL_DATA.length} kayıt</Tag>
                            </Radio>
                        </Radio.Group>
                    </div>

                    <Divider style={{ margin: 0 }} />

                    {/* ── Format ── */}
                    <div>
                        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 10 }}>
                            📁 Dosya Formatı
                        </Text>
                        <Radio.Group
                            value={exportFormat}
                            onChange={e => setExportFormat(e.target.value)}
                            optionType="button"
                            buttonStyle="solid"
                        >
                            <Radio.Button value="xlsx">Excel (.xlsx)</Radio.Button>
                            <Radio.Button value="csv">CSV (.csv)</Radio.Button>
                        </Radio.Group>
                    </div>

                    <Divider style={{ margin: 0 }} />

                    {/* ── Kolonlar (Transfer) ── */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <Text strong style={{ fontSize: 13 }}>🧩 Kolonlar</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {exportCols.length} / {EXPORT_COLS.length} kolon seçildi
                            </Text>
                        </div>
                        <Transfer
                            dataSource={EXPORT_TRANSFER_DATA}
                            titles={['Mevcut', 'İndirilecek']}
                            targetKeys={exportCols}
                            onChange={(nextKeys) => setExportCols(nextKeys)}
                            render={item => item.title}
                            showSearch
                            filterOption={(input, item) =>
                                item.title.toLowerCase().includes(input.toLowerCase())
                            }
                            locale={{
                                searchPlaceholder: 'Kolon ara…',
                                itemUnit: 'kolon',
                                itemsUnit: 'kolon',
                                notFoundContent: 'Kolon bulunamadı',
                            }}
                            listStyle={{ width: '100%', height: 200 }}
                            style={{ width: '100%' }}
                            oneWay={false}
                        />
                        {exportCols.length === 0 && (
                            <Text type="danger" style={{ fontSize: 12, marginTop: 6, display: 'block' }}>
                                En az bir kolon seçiniz
                            </Text>
                        )}
                    </div>

                    {/* ── Preview summary ── */}
                    <div style={{
                        background: 'linear-gradient(135deg, #f0f9ff, #fafeff)',
                        border: '1px solid #bae0ff',
                        borderRadius: 8,
                        padding: '10px 14px',
                    }}>
                        <Text style={{ fontSize: 12 }}>
                            <DownloadOutlined style={{ marginRight: 6, color: '#1677ff' }} />
                            <strong>{exportScope === 'filtered' ? filteredData.length : ALL_DATA.length}</strong> kayıt,{' '}
                            <strong>{exportCols.length}</strong> kolon →{' '}
                            <strong>.{exportFormat}</strong> olarak indirilecek
                        </Text>
                    </div>
                </div>
            </Modal>

            {/* ── Save Quick Filter Modal ── */}
            <Modal
                title={
                    <Space>
                        <SaveOutlined style={{ color: '#667eea' }} />
                        Filtreyi Kaydet
                    </Space>
                }
                open={saveModalOpen}
                onOk={saveQuickFilter}
                onCancel={() => { setSaveModalOpen(false); setSaveName(''); }}
                okText="Kaydet"
                cancelText="İptal"
                okButtonProps={{ disabled: !saveName.trim() }}
            >
                <div style={{ marginBottom: 8 }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Mevcut filtreler kaydedilecek:
                    </Text>
                    <div style={{ marginTop: 8, padding: '8px 12px', background: '#f5f5f5', borderRadius: 6 }}>
                        {Object.entries(filters)
                            .filter(([, v]) => v)
                            .map(([k, v]) => {
                                const cfg = COLUMNS_CONFIG.find(c => c.key === k);
                                return (
                                    <div key={k}>
                                        <Text strong style={{ fontSize: 12 }}>{cfg?.label}: </Text>
                                        <Text style={{ fontSize: 12 }}>"{v}"</Text>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <Input
                    placeholder="Filtre adı (örn: Aktif Adminler)"
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    onPressEnter={saveQuickFilter}
                    maxLength={40}
                    showCount
                    autoFocus
                    style={{ marginTop: 12 }}
                />
            </Modal>
        </div>
    );
};

export default UsersPage;

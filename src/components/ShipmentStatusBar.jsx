import React, { useState } from 'react';
import { Select, DatePicker, Popover, Input, Button, Badge, Tag, Popconfirm, Modal, message, Divider, Space } from 'antd';
import {
    FilterOutlined, DownOutlined, SearchOutlined,
    SaveOutlined, CloseCircleOutlined, CheckOutlined,
} from '@ant-design/icons';
import './ShipmentStatusBar.css';

const { RangePicker } = DatePicker;

const STATUSES = [
    { key: 'all', label: 'Tümü', count: 1735, percent: 100, color: '#6366f1' },
    { key: 'gonderildi', label: 'Gönderildi', count: 1632, percent: 94, color: '#3b82f6' },
    { key: 'guncelleme', label: 'Güncelleme Bekliyor', count: 0, percent: 0, color: '#f59e0b' },
    { key: 'gtip', label: 'GTİP Bekliyor', count: 0, percent: 0, color: '#ef4444' },
    { key: 'siniflandiriliyor', label: 'Sınıflandırılıyor', count: 0, percent: 0, color: '#8b5cf6' },
    { key: 'siniflandirildi', label: 'Sınıflandırıldı', count: 0, percent: 0, color: '#06b6d4' },
    { key: 'tamamlandi', label: 'Tamamlandı', count: 103, percent: 5, color: '#10b981' },
];

const COMPANIES = ['ABC Lojistik', 'Delta İthalat', 'Güven Gümrük', 'Mavi Kargo', 'Sistem Dış Tic.'];
const COUNTRIES = ['Çin', 'Almanya', 'ABD', 'Fransa', 'İtalya', 'Japonya', 'Türkiye'];
const GTIPS = ['84713000', '87032310', '61091000', '39012090', '73084000'];

const STORAGE_KEY = 'ssb_quickFilters';
const emptyFilters = () => ({ firma: null, ulke: null, gtip: null, tarih: null });

const loadSaved = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
};

const hasActive = (f) => Object.values(f).some(Boolean);

// ── Quick-filter tag row item ──────────────────────────────────────────────────
const QFTag = ({ qf, active, onApply, onDelete }) => (
    <Tag
        color={active ? 'blue' : 'default'}
        style={{ cursor: 'pointer', userSelect: 'none', borderRadius: 6, padding: '3px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}
        onClick={() => onApply(qf)}
        closable
        closeIcon={
            <Popconfirm
                title={`"${qf.name}" silinsin mi?`}
                onConfirm={(e) => { e.stopPropagation(); onDelete(qf.name); }}
                okText="Evet" cancelText="Hayır"
            >
                <CloseCircleOutlined style={{ fontSize: 11, marginLeft: 4 }} onClick={e => e.stopPropagation()} />
            </Popconfirm>
        }
    >
        {active && <CheckOutlined style={{ marginRight: 4, fontSize: 11 }} />}
        {qf.name}
    </Tag>
);

// ──────────────────────────────────────────────────────────────────────────────
export default function ShipmentStatusBar({ onFilterChange }) {
    const [activeStatus, setActiveStatus] = useState('all');
    const [filters, setFilters] = useState(emptyFilters());
    const [collapsed, setCollapsed] = useState(false);

    // quick-filter state
    const [quickFilters, setQuickFilters] = useState(() => loadSaved());
    const [activeQF, setActiveQF] = useState(null);   // name of active QF
    const [qfOpen, setQfOpen] = useState(false);
    const [qfSearch, setQfSearch] = useState('');
    const [saveOpen, setSaveOpen] = useState(false);
    const [saveName, setSaveName] = useState('');

    // ── helpers ──
    const broadcast = (status, f) => { if (onFilterChange) onFilterChange({ status, ...f }); };

    const handleStatus = (key) => { setActiveStatus(key); broadcast(key, filters); };

    const handleFilter = (field, val) => {
        const next = { ...filters, [field]: val };
        setFilters(next);
        setActiveQF(null);
        broadcast(activeStatus, next);
    };

    const clearAll = () => {
        const f = emptyFilters();
        setFilters(f);
        setActiveQF(null);
        broadcast(activeStatus, f);
    };

    // ── quick-filter CRUD ──
    const applyQF = (qf) => {
        setFilters({ ...qf.filters });
        setActiveQF(qf.name);
        broadcast(activeStatus, qf.filters);
        setQfOpen(false);
    };

    const saveQF = () => {
        if (!saveName.trim()) { message.warning('Lütfen bir isim girin'); return; }
        const next = [...quickFilters, { name: saveName.trim(), filters: { ...filters } }];
        setQuickFilters(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setSaveOpen(false);
        setSaveName('');
        message.success(`"${saveName.trim()}" kaydedildi`);
    };

    const deleteQF = (name) => {
        const next = quickFilters.filter(q => q.name !== name);
        setQuickFilters(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        if (activeQF === name) setActiveQF(null);
    };

    const visibleQFs = qfSearch
        ? quickFilters.filter(q => q.name.toLowerCase().includes(qfSearch.toLowerCase()))
        : quickFilters;

    // ── Popover content ──
    const qfContent = (
        <div style={{ width: 270 }}>
            <div style={{ maxHeight: 280, overflowY: 'auto', padding: '2px 0' }}>
                {quickFilters.length === 0 && (
                    <span style={{ fontSize: 12, color: '#9ca3af', padding: '8px 4px', display: 'block' }}>
                        Henüz kaydedilmiş filtre yok
                    </span>
                )}
                {visibleQFs.map(qf => (
                    <QFTag key={qf.name} qf={qf} active={activeQF === qf.name} onApply={applyQF} onDelete={deleteQF} />
                ))}
                {qfSearch && visibleQFs.length === 0 && (
                    <span style={{ fontSize: 12, color: '#9ca3af', padding: '8px 4px', display: 'block' }}>
                        Eşleşme yok
                    </span>
                )}
            </div>

            {hasActive(filters) && (
                <>
                    <Divider style={{ margin: '8px 0' }} />
                    <Space>
                        <Badge dot>
                            <Button
                                size="small" type="primary" ghost icon={<SaveOutlined />}
                                style={{ borderRadius: 6 }}
                                onClick={() => { setSaveOpen(true); setQfOpen(false); }}
                            >
                                Kaydet
                            </Button>
                        </Badge>
                        <Button
                            size="small" icon={<CloseCircleOutlined />}
                            style={{ borderRadius: 6 }}
                            onClick={() => { clearAll(); setQfOpen(false); }}
                        >
                            Temizle
                        </Button>
                    </Space>
                </>
            )}
        </div>
    );

    return (
        <div className="ssb-wrap">

            {/* ── Title bar ── */}
            <div className="ssb-title-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="ssb-title-text">Eşya Kataloğu</span>
                    <span className="ssb-title-badge">
                        {STATUSES[0].count.toLocaleString('tr-TR')} kayıt
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* ── Hızlı Filtreler button ── */}
                    <Popover
                        open={qfOpen}
                        onOpenChange={(v) => { setQfOpen(v); if (!v) setQfSearch(''); }}
                        trigger="click"
                        placement="bottomRight"
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
                        content={qfContent}
                    >
                        <Badge dot={!!activeQF} color="#6366f1">
                            <Button
                                size="small"
                                icon={<FilterOutlined />}
                                style={{
                                    borderRadius: 6,
                                    height: 26,
                                    fontSize: 12,
                                    background: activeQF ? '#eef2ff' : undefined,
                                    borderColor: activeQF ? '#6366f1' : undefined,
                                    color: activeQF ? '#6366f1' : undefined,
                                    fontWeight: activeQF ? 600 : 400,
                                }}
                            >
                                Hızlı Filtreler
                                <DownOutlined style={{ fontSize: 9, marginLeft: 3 }} />
                            </Button>
                        </Badge>
                    </Popover>

                    {/* ── Collapse toggle ── */}
                    <button
                        onClick={() => setCollapsed(c => !c)}
                        title={collapsed ? 'Genişlet' : 'Daralt'}
                        className="ssb-collapse-btn"
                    >
                        <span className={`ssb-collapse-chevron${collapsed ? ' collapsed' : ''}`}>▾</span>
                    </button>
                </div>
            </div>

            {/* ── Collapsible body ── */}
            <div className="ssb-body" style={{ maxHeight: collapsed ? 0 : 400 }}>

                <div className="ssb-rule" />

                {/* Status segments */}
                <div className="ssb-segments">
                    {STATUSES.map((s, i) => {
                        const isActive = activeStatus === s.key;
                        return (
                            <React.Fragment key={s.key}>
                                <button
                                    onClick={() => handleStatus(s.key)}
                                    className="ssb-cell"
                                    style={{ background: isActive ? s.color : 'transparent' }}
                                >
                                    <div className="ssb-accent" style={{ background: s.color, opacity: isActive ? 0 : 1 }} />
                                    <span className="ssb-count" style={{ color: isActive ? '#fff' : '#111827' }}>
                                        {s.count.toLocaleString('tr-TR')}
                                    </span>
                                    <span className="ssb-label" style={{ color: isActive ? 'rgba(255,255,255,0.82)' : '#6b7280' }}>
                                        {s.label}
                                    </span>
                                    {s.key !== 'all' && (
                                        <div className="ssb-bar-wrap">
                                            <div className="ssb-bar-track" style={{ background: isActive ? 'rgba(255,255,255,0.25)' : '#e5e7eb' }}>
                                                <div className="ssb-bar-fill" style={{ width: `${s.percent}%`, background: isActive ? '#fff' : s.color, minWidth: s.percent > 0 ? 6 : 0 }} />
                                            </div>
                                            {s.percent > 0 && (
                                                <span className="ssb-pct-label" style={{ color: isActive ? 'rgba(255,255,255,0.9)' : s.color }}>
                                                    {s.percent}%
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </button>
                                {i < STATUSES.length - 1 && <div className="ssb-seg-divider" />}
                            </React.Fragment>
                        );
                    })}
                </div>

                <div className="ssb-rule" />

                {/* Filter row */}
                <div className="ssb-filters">
                    <span className="ssb-filter-label">Filtrele:</span>

                    <Select allowClear placeholder="🏢 Firma" size="small"
                        style={{ width: 130, height: 26, fontSize: 12, flexShrink: 0 }}
                        value={filters.firma} onChange={(v) => handleFilter('firma', v)}
                        options={COMPANIES.map(c => ({ label: c, value: c }))} popupMatchSelectWidth={false}
                    />
                    <Select allowClear placeholder="🌍 Ülke" size="small"
                        style={{ width: 120, height: 26, fontSize: 12, flexShrink: 0 }}
                        value={filters.ulke} onChange={(v) => handleFilter('ulke', v)}
                        options={COUNTRIES.map(c => ({ label: c, value: c }))} popupMatchSelectWidth={false}
                    />
                    <Select allowClear placeholder="📋 GTİP" size="small" showSearch
                        style={{ width: 140, height: 26, fontSize: 12, flexShrink: 0 }}
                        value={filters.gtip} onChange={(v) => handleFilter('gtip', v)}
                        options={GTIPS.map(g => ({ label: g, value: g }))} popupMatchSelectWidth={false}
                    />
                    <RangePicker size="small" placeholder={['📅 Başlangıç', 'Bitiş']}
                        style={{ height: 26, fontSize: 12, borderRadius: 6, borderColor: '#e5e7eb', flexShrink: 0 }}
                        value={filters.tarih}
                        onChange={(v) => handleFilter('tarih', v)}
                    />

                    {hasActive(filters) && (
                        <button className="ssb-clear-btn" onClick={clearAll}>✕ Temizle</button>
                    )}

                    {activeQF && (
                        <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, flexShrink: 0, marginLeft: 4 }}>
                            · {activeQF}
                        </span>
                    )}
                </div>
            </div>

            {/* ── Save Quick Filter Modal ── */}
            <Modal
                title={<Space><SaveOutlined style={{ color: '#6366f1' }} /> Filtreyi Kaydet</Space>}
                open={saveOpen}
                onOk={saveQF}
                onCancel={() => { setSaveOpen(false); setSaveName(''); }}
                okText="Kaydet" cancelText="İptal"
                okButtonProps={{ disabled: !saveName.trim() }}
            >
                <div style={{ marginBottom: 8, fontSize: 13, color: '#6b7280' }}>
                    Mevcut filtreler kaydedilecek:
                </div>
                <div style={{ background: '#f9fafb', borderRadius: 6, padding: '8px 12px', marginBottom: 12 }}>
                    {Object.entries(filters).filter(([, v]) => v).map(([k, v]) => (
                        <div key={k} style={{ fontSize: 12 }}>
                            <strong>{k}:</strong> {Array.isArray(v) ? v.map(d => d?.format?.('DD.MM.YYYY') ?? d).join(' – ') : String(v)}
                        </div>
                    ))}
                    {!hasActive(filters) && <span style={{ fontSize: 12, color: '#9ca3af' }}>Aktif filtre yok</span>}
                </div>
                <Input
                    placeholder="Filtre adı (örn: Çin – GTİP 8471)"
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    onPressEnter={saveQF}
                    maxLength={40}
                    showCount
                    autoFocus
                />
            </Modal>
        </div>
    );
}

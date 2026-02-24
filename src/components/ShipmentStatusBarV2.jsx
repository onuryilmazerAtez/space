import React, { useState } from 'react';
import { Select, DatePicker } from 'antd';
import './ShipmentStatusBarV2.css';

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

const TOTAL = STATUSES[0].count;

export default function ShipmentStatusBarV2({ onFilterChange }) {
    const [activeStatus, setActiveStatus] = useState('all');
    const [filters, setFilters] = useState({ firma: null, ulke: null, gtip: null, tarih: null });
    const [collapsed, setCollapsed] = useState(false);

    const handleStatus = (key) => {
        setActiveStatus(key);
        if (onFilterChange) onFilterChange({ status: key, ...filters });
    };

    const handleFilter = (field, val) => {
        const next = { ...filters, [field]: val };
        setFilters(next);
        if (onFilterChange) onFilterChange({ status: activeStatus, ...next });
    };

    const hasFilters = Object.values(filters).some(Boolean);

    // Segments for the stacked bar (exclude "all")
    const barSegments = STATUSES.slice(1);
    // Compute flex portions — use at least 1px for zero-count items
    const totalCount = STATUSES[0].count;

    return (
        <div className="ssb2-wrap">

            {/* ── Gradient title bar ── */}
            <div className="ssb2-title-bar">
                <div className="ssb2-title-left">
                    <span className="ssb2-title-text">Eşya Kataloğu</span>
                    <span className="ssb2-title-meta">
                        {TOTAL.toLocaleString('tr-TR')} kayıt
                    </span>
                </div>
                <button
                    onClick={() => setCollapsed(c => !c)}
                    title={collapsed ? 'Genişlet' : 'Daralt'}
                    className="ssb2-collapse-btn"
                >
                    <span className={`ssb2-collapse-chevron${collapsed ? ' collapsed' : ''}`}>▾</span>
                </button>
            </div>

            {/* ── Collapsible body ── */}
            <div className="ssb2-body" style={{ maxHeight: collapsed ? 0 : 500 }}>

                {/* Stacked proportional bar */}
                <div className="ssb2-stack-bar">
                    {barSegments.map((s) => {
                        const flexVal = s.count > 0 ? s.count / totalCount : 0.003;
                        return (
                            <div
                                key={s.key}
                                className="ssb2-stack-seg"
                                style={{ flex: flexVal, background: s.color }}
                                onClick={() => handleStatus(s.key)}
                                title={`${s.label}: ${s.count.toLocaleString('tr-TR')}`}
                            />
                        );
                    })}
                </div>

                {/* Chip grid */}
                <div className="ssb2-chips">
                    {STATUSES.map((s) => {
                        const isActive = activeStatus === s.key;
                        const pct = Math.round((s.count / totalCount) * 100);
                        return (
                            <button
                                key={s.key}
                                className={`ssb2-chip${isActive ? ' active' : ''}`}
                                onClick={() => handleStatus(s.key)}
                            >
                                <div className="ssb2-chip-dot" style={{ background: s.color }} />
                                <span className="ssb2-chip-count">
                                    {s.count.toLocaleString('tr-TR')}
                                </span>
                                <span className="ssb2-chip-label">{s.label}</span>

                                {s.key !== 'all' && pct > 0 && (
                                    <span
                                        className="ssb2-chip-pct"
                                        style={{
                                            background: `${s.color}15`,
                                            color: s.color,
                                        }}
                                    >
                                        {pct}%
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="ssb2-rule" />

                {/* Filter row */}
                <div className="ssb2-filters">
                    <span className="ssb2-filter-label">Filtrele:</span>

                    <Select
                        allowClear
                        placeholder="🏢 Firma"
                        size="small"
                        style={{ width: 130, height: 26, fontSize: 12, flexShrink: 0 }}
                        value={filters.firma}
                        onChange={(v) => handleFilter('firma', v)}
                        options={COMPANIES.map(c => ({ label: c, value: c }))}
                        popupMatchSelectWidth={false}
                    />
                    <Select
                        allowClear
                        placeholder="🌍 Ülke"
                        size="small"
                        style={{ width: 120, height: 26, fontSize: 12, flexShrink: 0 }}
                        value={filters.ulke}
                        onChange={(v) => handleFilter('ulke', v)}
                        options={COUNTRIES.map(c => ({ label: c, value: c }))}
                        popupMatchSelectWidth={false}
                    />
                    <Select
                        allowClear
                        placeholder="📋 GTİP"
                        size="small"
                        style={{ width: 140, height: 26, fontSize: 12, flexShrink: 0 }}
                        value={filters.gtip}
                        onChange={(v) => handleFilter('gtip', v)}
                        options={GTIPS.map(g => ({ label: g, value: g }))}
                        popupMatchSelectWidth={false}
                        showSearch
                    />
                    <RangePicker
                        size="small"
                        placeholder={['📅 Başlangıç', 'Bitiş']}
                        style={{ height: 26, fontSize: 12, borderRadius: 6, borderColor: '#e5e7eb', flexShrink: 0 }}
                        onChange={(v) => handleFilter('tarih', v)}
                    />
                    {hasFilters && (
                        <button
                            className="ssb2-clear-btn"
                            onClick={() => {
                                setFilters({ firma: null, ulke: null, gtip: null, tarih: null });
                                if (onFilterChange) onFilterChange({ status: activeStatus });
                            }}
                        >
                            ✕ Temizle
                        </button>
                    )}
                </div>

            </div>{/* /collapsible */}
        </div>
    );
}

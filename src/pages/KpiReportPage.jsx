import { useState } from 'react';
import { Card, Typography, Button, Table, Input, Tag, DatePicker, message } from 'antd';
import {
    ArrowLeftOutlined, SearchOutlined, FileExcelOutlined,
    TableOutlined, DownloadOutlined, TrophyOutlined, PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const PRIMARY = '#2563EB';

// ── SVG Icons (provided by design) ───────────────────────────────────────────

const IconAktifMusavir = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_8639_2884)">
            <rect width="20" height="20" fill="white" fillOpacity="0.01"/>
            <path d="M16.9687 14.1975C16.41 13.6384 15.7571 13.182 15.0401 12.8493C16.0513 12.0301 16.6963 10.7801 16.6963 9.37831C16.6963 6.9051 14.6338 4.87608 12.1606 4.91403C9.72536 4.95198 7.76331 6.93635 7.76331 9.37831C7.76331 10.7801 8.41063 12.0301 9.41956 12.8493C8.70239 13.1817 8.04951 13.6381 7.49099 14.1975C6.27224 15.4185 5.58027 17.0301 5.53563 18.7489C5.53503 18.7727 5.53921 18.7964 5.54792 18.8186C5.55663 18.8407 5.56969 18.861 5.58633 18.878C5.60297 18.8951 5.62286 18.9086 5.64482 18.9179C5.66678 18.9271 5.69037 18.9319 5.7142 18.9319H6.9642C7.06018 18.9319 7.14054 18.856 7.14277 18.76C7.18518 17.4654 7.70974 16.2533 8.63161 15.3337C9.10335 14.8594 9.66447 14.4834 10.2825 14.2275C10.9005 13.9716 11.5631 13.8407 12.2321 13.8426C13.5914 13.8426 14.8705 14.3716 15.8325 15.3337C16.7521 16.2533 17.2767 17.4654 17.3213 18.76C17.3236 18.856 17.4039 18.9319 17.4999 18.9319H18.7499C18.7737 18.9319 18.7973 18.9271 18.8193 18.9179C18.8413 18.9086 18.8611 18.8951 18.8778 18.878C18.8944 18.861 18.9075 18.8407 18.9162 18.8186C18.9249 18.7964 18.9291 18.7727 18.9285 18.7489C18.8838 17.0301 18.1919 15.4185 16.9687 14.1975ZM12.2321 12.2355C11.4687 12.2355 10.7499 11.9386 10.212 11.3984C9.942 11.1306 9.72875 10.8111 9.58493 10.459C9.44112 10.107 9.36969 9.72956 9.37492 9.3493C9.38161 8.61715 9.67402 7.90957 10.1852 7.38501C10.7209 6.8359 11.4374 6.5301 12.203 6.52117C12.9597 6.51448 13.6941 6.80912 14.2343 7.33814C14.7879 7.88055 15.0914 8.60599 15.0914 9.37831C15.0914 10.1417 14.7946 10.8582 14.2544 11.3984C13.9894 11.6647 13.6742 11.8758 13.327 12.0195C12.9799 12.1631 12.6077 12.2366 12.2321 12.2355ZM6.64054 9.9676C6.62045 9.7734 6.60929 9.57698 6.60929 9.37831C6.60929 9.0234 6.64277 8.67742 6.70527 8.34037C6.7209 8.26001 6.67849 8.17742 6.60483 8.14394C6.30126 8.00778 6.02224 7.82028 5.78117 7.58367C5.4971 7.30824 5.27357 6.97662 5.12484 6.60997C4.9761 6.24332 4.90543 5.8497 4.91733 5.45421C4.93742 4.73769 5.22536 4.05689 5.72759 3.54349C6.27893 2.97876 7.02001 2.67072 7.80795 2.67965C8.52 2.68635 9.2075 2.9609 9.72759 3.44751C9.90393 3.61269 10.0557 3.79572 10.183 3.99215C10.2276 4.06135 10.3146 4.09037 10.3905 4.06358C10.7834 3.92742 11.1986 3.83144 11.6249 3.7868C11.7499 3.7734 11.8213 3.63947 11.7655 3.52787C11.0401 2.0926 9.55795 1.10153 7.84367 1.07474C5.36822 1.0368 3.30572 3.06581 3.30572 5.5368C3.30572 6.93858 3.95081 8.18858 4.96197 9.00778C4.25215 9.3359 3.59813 9.78903 3.03117 10.356C1.80795 11.577 1.11599 13.1886 1.07134 14.9096C1.07075 14.9334 1.07493 14.9571 1.08363 14.9793C1.09234 15.0015 1.1054 15.0217 1.12204 15.0387C1.13868 15.0558 1.15857 15.0693 1.18053 15.0786C1.20249 15.0878 1.22609 15.0926 1.24992 15.0926H2.50215C2.59813 15.0926 2.67849 15.0167 2.68072 14.9207C2.72313 13.6261 3.24768 12.414 4.16956 11.4944C4.82581 10.8381 5.62938 10.3828 6.50661 10.1618C6.59367 10.1395 6.6517 10.0569 6.64054 9.9676Z" fill="black" fillOpacity="0.85"/>
        </g>
        <defs><clipPath id="clip0_8639_2884"><rect width="20" height="20" fill="white"/></clipPath></defs>
    </svg>
);

const IconSiniflandirmaSuresi = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_8626_11855)">
            <rect width="20" height="20" fill="white" fillOpacity="0.01"/>
            <path d="M19.6646 7.76909H13.9503C13.8521 7.76909 13.7717 7.84945 13.7717 7.94767V9.01909C13.7717 9.11731 13.8521 9.19767 13.9503 9.19767H19.6646C19.7628 9.19767 19.8431 9.11731 19.8431 9.01909V7.94767C19.8431 7.84945 19.7628 7.76909 19.6646 7.76909ZM16.6735 10.8048H13.9503C13.8521 10.8048 13.7717 10.8852 13.7717 10.9834V12.0548C13.7717 12.153 13.8521 12.2334 13.9503 12.2334H16.6735C16.7717 12.2334 16.8521 12.153 16.8521 12.0548V10.9834C16.8521 10.8852 16.7717 10.8048 16.6735 10.8048ZM9.22484 5.77133H8.25832C8.11993 5.77133 8.00832 5.88293 8.00832 6.02133V11.557C8.00832 11.6374 8.04627 11.7111 8.111 11.7579L11.4347 14.182C11.5463 14.2624 11.7025 14.2401 11.7829 14.1285L12.3565 13.345V13.3428C12.4369 13.2311 12.4123 13.0749 12.3007 12.9945L9.47261 10.9499V6.02133C9.47484 5.88293 9.361 5.77133 9.22484 5.77133Z" fill="black" fillOpacity="0.85"/>
            <path d="M16.5359 13.6095H15.2457C15.1207 13.6095 15.0024 13.6742 14.9354 13.7814C14.6515 14.2314 14.3184 14.6484 13.9421 15.0247C13.2943 15.6746 12.5264 16.1924 11.681 16.5492C10.8037 16.9198 9.87292 17.1073 8.9131 17.1073C7.95105 17.1073 7.02024 16.9198 6.14524 16.5492C5.29926 16.1921 4.5381 15.6787 3.88408 15.0247C3.23007 14.3707 2.71667 13.6095 2.35953 12.7635C1.98899 11.8885 1.80149 10.9577 1.80149 9.99566C1.80149 9.03361 1.98899 8.10503 2.35953 7.2278C2.71667 6.38182 3.23007 5.62066 3.88408 4.96664C4.5381 4.31262 5.29926 3.79923 6.14524 3.44209C7.02024 3.07155 7.95328 2.88405 8.9131 2.88405C9.87516 2.88405 10.806 3.07155 11.681 3.44209C12.5269 3.79923 13.2881 4.31262 13.9421 4.96664C14.3184 5.34291 14.6515 5.75991 14.9354 6.20994C15.0024 6.31709 15.1207 6.38182 15.2457 6.38182H16.5359C16.6899 6.38182 16.7881 6.22111 16.7189 6.08494C15.2635 3.18986 12.3127 1.30816 9.01801 1.27021C4.19435 1.20994 0.187655 5.15861 0.178726 9.9778C0.169798 14.8059 4.08274 18.7233 8.91087 18.7233C12.2479 18.7233 15.2479 16.8349 16.7189 13.9064C16.7346 13.8751 16.742 13.8404 16.7405 13.8055C16.739 13.7706 16.7286 13.7366 16.7102 13.7069C16.6919 13.6771 16.6662 13.6526 16.6357 13.6355C16.6052 13.6185 16.5708 13.6095 16.5359 13.6095Z" fill="black" fillOpacity="0.85"/>
        </g>
        <defs><clipPath id="clip0_8626_11855"><rect width="20" height="20" fill="white"/></clipPath></defs>
    </svg>
);

const IconDegisiklikIslem = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_8626_11868)">
            <rect width="20" height="20" fill="white" fillOpacity="0.01"/>
            <path d="M4.32352 15.3551C4.36816 15.3551 4.41281 15.3506 4.45745 15.3439L8.21191 14.6854C8.25656 14.6765 8.29897 14.6564 8.33022 14.6229L17.7923 5.16085C17.813 5.1402 17.8294 5.11568 17.8406 5.08867C17.8518 5.06167 17.8576 5.03272 17.8576 5.00349C17.8576 4.97425 17.8518 4.94531 17.8406 4.9183C17.8294 4.8913 17.813 4.86677 17.7923 4.84612L14.0825 1.13407C14.04 1.09166 13.9842 1.06934 13.924 1.06934C13.8637 1.06934 13.8079 1.09166 13.7655 1.13407L4.30343 10.5961C4.26995 10.6296 4.24986 10.6698 4.24093 10.7144L3.58245 14.4689C3.56074 14.5885 3.56849 14.7115 3.60505 14.8274C3.64162 14.9433 3.70588 15.0486 3.79227 15.1341C3.93959 15.2769 4.12486 15.3551 4.32352 15.3551ZM5.82799 11.4622L13.924 3.36844L15.5601 5.0046L7.46415 13.0984L5.47977 13.4488L5.82799 11.4622ZM18.2141 17.2301H1.78557C1.39049 17.2301 1.07129 17.5492 1.07129 17.9443V18.7479C1.07129 18.8461 1.15165 18.9265 1.24986 18.9265H18.7499C18.8481 18.9265 18.9284 18.8461 18.9284 18.7479V17.9443C18.9284 17.5492 18.6092 17.2301 18.2141 17.2301Z" fill="black" fillOpacity="0.85"/>
        </g>
        <defs><clipPath id="clip0_8626_11868"><rect width="20" height="20" fill="white"/></clipPath></defs>
    </svg>
);

const IconSiniflandirilanUrun = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_8626_11842)">
            <rect width="20" height="20" fill="white" fillOpacity="0.01"/>
            <path d="M16.25 1.25H3.75C2.36929 1.25 1.25 2.36929 1.25 3.75V16.25C1.25 17.6307 2.36929 18.75 3.75 18.75H16.25C17.6307 18.75 18.75 17.6307 18.75 16.25V3.75C18.75 2.36929 17.6307 1.25 16.25 1.25Z" fill="#40A9FF"/>
            <path d="M7.85714 7.5H14.6429C14.8393 7.5 15 7.66071 15 7.85714V14.6429C15 14.8393 14.8393 15 14.6429 15H7.85714C7.66071 15 7.5 14.8393 7.5 14.6429V7.85714C7.5 7.66071 7.66071 7.5 7.85714 7.5Z" fill="white"/>
            <path d="M6.30665 10H5.23745C5.17465 9.99857 5.11485 9.97399 5.07056 9.92942C5.02627 9.88486 5.00106 9.82396 5 9.76113V5.2443C4.99962 5.18051 5.02476 5.11904 5.0692 5.07329C5.11365 5.02754 5.17369 5.00146 5.23745 5H9.76119C9.82508 5.00145 9.88614 5.02757 9.9308 5.07329C9.97547 5.11901 10 5.18038 10 5.2443V6.30565H8.98643V6.01249H6.01357V8.9848H6.30665V10Z" fill="white"/>
        </g>
        <defs><clipPath id="clip0_8626_11842"><rect width="20" height="20" fill="white"/></clipPath></defs>
    </svg>
);

// ── Mock data ─────────────────────────────────────────────────────────────────

const SERVICES = [
    { key: 's1', hizmet: 'Dual-Use Sınıflandırma', ulke: 'Almanya',          atamaTarihi: '11.08.2026', tamamlanmaTarihi: '12.08.2026', sure: '3 gün', durum: 'Tamamlandı' },
    { key: 's2', hizmet: 'Dual-Use Sınıflandırma', ulke: 'Birleşik Krallık', atamaTarihi: '11.08.2026', tamamlanmaTarihi: '-',           sure: '-',     durum: 'Devam Ediyor' },
    { key: 's3', hizmet: 'GTİP Tespiti',            ulke: 'İsviçre',          atamaTarihi: '11.08.2026', tamamlanmaTarihi: '12.08.2026', sure: '3 gün', durum: 'Tamamlandı' },
    { key: 's4', hizmet: 'GTİP Tespiti',            ulke: 'Avrupa Birliği',   atamaTarihi: '11.08.2026', tamamlanmaTarihi: '-',           sure: '-',     durum: 'Devam Ediyor' },
];

const FIRMS = {
    '1': [
        { key: 'f1', firma: 'NovaTech',           atanan: 213, degisiklik: 12, tamamlanan: 32, bekleyen: 3, yuzde: 75, sure: '1.2 Saat', hizmetler: SERVICES },
        { key: 'f2', firma: 'Vertex Innovations', atanan: 458, degisiklik: 20, tamamlanan: 12, bekleyen: 0, yuzde: 20, sure: '3.5 Saat', hizmetler: [] },
        { key: 'f3', firma: 'Quantum Leap',        atanan: 389, degisiklik: 28, tamamlanan: 12, bekleyen: 0, yuzde: 90, sure: '2.8 Saat', hizmetler: [] },
        { key: 'f4', firma: 'Blue Horizon',        atanan: 576, degisiklik: 36, tamamlanan:  6, bekleyen: 0, yuzde:  5, sure: '5.1 Saat', hizmetler: [] },
    ],
    '2': [
        { key: 'f5', firma: 'Aras Lojistik',  atanan: 120, degisiklik:  6, tamamlanan:  95, bekleyen: 1, yuzde: 80, sure: '1.0 Saat', hizmetler: [] },
        { key: 'f6', firma: 'Yıldız Holding', atanan:  93, degisiklik:  6, tamamlanan: 340, bekleyen: 1, yuzde: 70, sure: '1.4 Saat', hizmetler: [] },
    ],
    '3': [], '4': [], '5': [],
};

const ADVISORS = [
    { key: '1', musavir: 'Mehmem Decdet',  atanan: 326, degisiklik:  4, tamamlanan:   32, bekleyen:  1, yuzde: 40, sure: '4.9 Saat', durum: 'Düzenli'  },
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
        { title: 'Atama Tarihi', dataIndex: 'atamaTarihi', key: 'atamaTarihi', width: 130, render: v => <Text style={{ fontSize: 13 }}>{v}</Text> },
        {
            title: 'Tamamlanma Tarihi', dataIndex: 'tamamlanmaTarihi', key: 'tamamlanmaTarihi', width: 160,
            render: v => <Text style={{ fontSize: 13, color: v === '-' ? '#9ca3af' : '#374151' }}>{v}</Text>,
        },
        {
            title: 'Süre', dataIndex: 'sure', key: 'sure', width: 90,
            render: v => <Text style={{ fontSize: 13, color: v === '-' ? '#9ca3af' : '#374151' }}>{v}</Text>,
        },
        {
            title: 'Durum', dataIndex: 'durum', key: 'durum',
            render: v => (
                <Tag style={{ borderRadius: 6, fontSize: 12, fontWeight: 500, border: 'none', background: v === 'Tamamlandı' ? '#f0fdf4' : '#eff6ff', color: v === 'Tamamlandı' ? '#16a34a' : '#2563eb', padding: '2px 10px' }}>
                    {v}
                </Tag>
            ),
        },
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
        { title: 'Ort. İşlem Süresi', dataIndex: 'sure', key: 'sure', render: v => <Text style={{ fontSize: 13 }}>{v}</Text> },
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

// ── Stat card data ────────────────────────────────────────────────────────────

const STATS = [
    {
        label: 'Aktif Müşavir', value: '16',
        icon: <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconAktifMusavir /></div>,
        delta: null,
    },
    {
        label: 'Ortalama Sınıflandırma Süresi', value: '4.9',
        icon: <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconSiniflandirmaSuresi /></div>,
        delta: { value: '3.2% gerileme', up: false },
    },
    {
        label: 'Toplam Değişiklik Yapılan İşlem', value: '32',
        icon: <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconDegisiklikIslem /></div>,
        delta: { value: '8.4% geçen döneme göre', up: true },
    },
    {
        label: 'Toplam Sınıflandırılan Ürün', value: '231',
        icon: <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconSiniflandirilanUrun /></div>,
        delta: { value: '8.4% geçen döneme göre', up: true },
    },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function KpiReportPage() {
    const navigate = useNavigate();
    const [period, setPeriod]             = useState('guncel');
    const [reportName, setReportName]     = useState('');
    const [userFilter, setUserFilter]     = useState('');
    const [dateRange, setDateRange]       = useState(null);
    const [expandedKeys, setExpandedKeys] = useState([]);

    const periods = [
        { key: 'guncel', label: 'Güncel' },
        { key: 'aylik',  label: 'Aylık'  },
        { key: 'ozel',   label: 'Özel'   },
    ];

    const handleSave = () => {
        if (!reportName.trim()) {
            message.warning('Lütfen rapor adı girin.');
            return;
        }
        message.success(`"${reportName}" raporu başarıyla kaydedildi.`);
    };

    const filteredAdvisors = ADVISORS.filter(a =>
        !userFilter || a.musavir.toLowerCase().includes(userFilter.toLowerCase())
    );

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
                .kpi-period-btn { background: transparent; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; color: #6b7280; font-family: 'Inter', sans-serif; transition: color 0.15s; }
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

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontSize: 13, color: '#9ca3af' }}>
                <span style={{ cursor: 'pointer', color: '#6b7280' }} onClick={() => navigate('/reports')}>Raporlar</span>
                <span>/</span>
                <span style={{ color: '#374151' }}>Yönetici Performans Raporu</span>
            </div>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => navigate('/reports')} style={{ width: 32, height: 32, border: '1px solid #e5e7eb', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                        <ArrowLeftOutlined style={{ fontSize: 14 }} />
                    </button>
                    <TrophyOutlined style={{ fontSize: 22, color: '#ca8a04' }} />
                    <div>
                        <Title level={4} style={{ margin: 0, fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>Yönetici Performans Raporu</Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>Müşavir bazlı eşya işlem performansını takip edin</Text>
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
                    <Button type="primary" onClick={handleSave} style={{ background: PRIMARY, borderColor: PRIMARY, borderRadius: 6, fontWeight: 600 }}>
                        Kaydet
                    </Button>
                    <Button icon={<DownloadOutlined />} style={{ borderRadius: 6, fontWeight: 600, color: '#374151' }}>
                        Excel
                    </Button>
                </div>
            </div>

            {/* Filter bar */}
            <Card styles={{ body: { padding: '12px 20px' } }} style={{ borderRadius: 6, border: '1px solid #e5e7eb', marginBottom: 20, boxShadow: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 6, padding: 3, gap: 2 }}>
                        {periods.map(p => (
                            <button key={p.key} className={`kpi-period-btn${period === p.key ? ' active' : ''}`} onClick={() => setPeriod(p.key)}>
                                {p.label}
                            </button>
                        ))}
                    </div>
                    {period === 'ozel' && (
                        <RangePicker value={dateRange} onChange={setDateRange} format="DD.MM.YYYY" style={{ borderRadius: 6 }} />
                    )}
                    <Input
                        prefix={<SearchOutlined style={{ color: '#9ca3af', fontSize: 13 }} />}
                        placeholder="Kullanıcı adına göre filtrele"
                        value={userFilter}
                        onChange={e => setUserFilter(e.target.value)}
                        style={{ width: 220, borderRadius: 6, fontSize: 13 }}
                    />
                </div>
            </Card>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                {STATS.map((s, i) => (
                    <Card key={i} styles={{ body: { padding: '20px 24px' } }} style={{ borderRadius: 6, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 8 }}>{s.label}</Text>
                                <Text style={{ fontSize: 30, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{s.value}</Text>
                                {s.delta && (
                                    <div style={{ marginTop: 8 }}>
                                        <span style={{ fontSize: 11, color: s.delta.up ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
                                            {s.delta.up ? '↑' : '↓'} {s.delta.value}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {s.icon}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Müşavir Bazlı Performans */}
            <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: 6, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                    <Text strong style={{ fontSize: 15 }}>Müşavir Bazlı Performans</Text>
                    <Text style={{ fontSize: 12, color: '#9ca3af' }}>Kullanıcıya tıklayarak firma dağılımını görüntüleyin</Text>
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
    );
}

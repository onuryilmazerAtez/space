import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Card, Typography, Row, Col, Input, Select, Button, Table, Tag,
    Switch, Checkbox, DatePicker, Dropdown, Segmented, Collapse,
    Modal, Skeleton, Radio, Tooltip,
} from 'antd';
import {
    SearchOutlined,
    CloseOutlined,
    AppstoreOutlined, UnorderedListOutlined,
    ControlOutlined,
    CaretRightOutlined,
    ColumnHeightOutlined,
    RedoOutlined,
    PictureOutlined,
    GlobalOutlined,
    DownOutlined,
    DownloadOutlined,
    ExpandOutlined,
    QuestionCircleOutlined,
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

const KEYWORD_SETS = [
    ['TEXTILE ARTICLES', 'OF VEGETABLE TEXTILE MATERIAL', 'FOR STORING', 'OF WOVEN FABRIC', 'OF JUTE', 'ONE-COLOURED', 'PRINTED', 'WITH CORD', 'WITH TIE FASTENING', 'HEMMED', 'MADE UP', 'NOT FOR PACKAGING GOODS'],
    ['LEATHER GOODS', 'WALLET', 'PERSONAL USE', 'BIFOLD', 'WITH COIN POCKET', 'MADE UP', 'NOT HANDMADE'],
    ['AROMATIC PREPARATIONS', 'LAVENDER SCENTED', 'VEGETABLE MATERIAL', 'FOR HOME USE', 'MADE UP', 'TEXTILE'],
    ['LEATHER', 'HANDBAG', 'FASHION ACCESSORIES', 'WITH HANDLE', 'WITH ZIPPER', 'MADE UP'],
    ['FOOTWEAR', 'SPORTS SHOES', 'RUBBER SOLE', 'TEXTILE UPPER', 'LACE-UP', 'NOT WATERPROOF'],
];

const TR_BTB_NOS = [
    'TR060000200016', 'TR060000200017', 'TR090001150034', 'TR090001150035',
    'TR340002180052', 'TR340002180053', 'TR010003230001', 'TR160004140028',
    'TR270005190043', 'TR410006160087', 'TR340007200112', 'TR060008220015',
    'TR550009150094', 'TR160010180063', 'TR270011190021', 'TR410012160045',
];

const EU_BTB_NOS = [
    'FR-PRO-2012-002655', 'DE-BTI-2014-000234', 'NL-BTI-2011-001892', 'IT-BTI-2015-003421',
    'ES-BTI-2013-002156', 'BE-BTI-2016-000987', 'AT-BTI-2018-001234', 'PL-BTI-2017-000456',
    'CZ-BTI-2019-000789', 'HU-BTI-2020-000321', 'PT-BTI-2016-001567', 'SE-BTI-2018-000432',
    'DE-BTI-2013-004567', 'FR-BTI-2019-001890', 'NL-BTI-2020-000543', 'IT-BTI-2016-002109',
];

const EU_GTIP_NOS = [
    '8471.30.20', '6302.21.10', '4202.12.50', '6404.11.00',
    '9101.11.00', '3305.10.00', '8517.12.00', '6109.10.10',
    '9403.60.10', '4016.99.97', '6204.31.00', '8708.29.10',
    '3304.99.00', '6302.31.10', '8302.41.90', '6217.10.00',
];

const TR_GTIP_NOS = [
    '8471.30.20.00.11', '6302.21.10.00.00', '4202.12.50.00.00', '6404.11.00.00.19',
    '9101.11.00.00.00', '3305.10.00.00.00', '8517.12.00.00.00', '6109.10.10.10.11',
    '9403.60.10.00.00', '4016.99.97.00.00', '6204.31.00.00.00', '8708.29.10.00.11',
    '3304.99.00.00.00', '6302.31.10.00.00', '8302.41.90.00.11', '6217.10.00.00.00',
];

const IPTAL_NEDENLERI = [
    'Gümrükler Genel Müdürlüğü\'nün 13.05.2026 tarih ve 121753707 sayılı yazısı çerçevesinde yapılan inceleme neticesinde; söz konusu BTB\'nin, aynı ambalaj içerisinde birden fazla eşyayı içermekle birlikte set eşya niteliği taşımayan ve içeriğindeki her bir eşyanın kendi GTİP\'inde ayrı ayrı sınıflandırılması gereken ürünlere ilişkin düzenlendiği tespit edilmiştir.\nBilindiği üzere, set eşyanın sınıflandırılması Tarifenin Yorumuna İlişkin GYK Kural 3(b) esas alınarak yapılmakta olup 2016/6 sayılı Rehber ile 2011/40 sayılı Genelge de bu çerçevede hazırlanmıştır. Mezkûr kural kapsamında "perakende satılacak hale getirilmiş takım halinde bulunan eşya"nın; (a) ilk bakışta farklı pozisyonlarda sınıflandırılabilen en az iki farklı parçadan oluşması, (b) özel bir gereksinmeyi karşılamak veya belirli bir işlevi yerine getirmek üzere bir araya getirilmiş bulunması ve (c) yeniden paketlemeye gerek kalmadan son kullanıcılara doğrudan satış için uygun biçimde düzenlenmiş olması şartlarını birlikte taşıması gerekmektedir. Bu koşulları taşımayan eşya set olarak değil, içeriğindeki her kalem eşyanın ilgili GTİP\'i itibarıyla ayrı ayrı sınıflandırılacaktır.\nBu bağlamda, söz konusu BTB\'nin birden fazla eşyayı kapsadığı ve içeriğindeki her bir eşyanın ayrı GTİP\'lerde sınıflandırılması gerektiği; ancak Bağlayıcı Tarife Bilgisi sisteminde mezkûr eşyanın birden fazla GTİP altında sınıflandırılmasının sistemsel olarak mümkün olmadığı ve bu durumun Gümrük Genel Tebliği (Tarife) (Seri No:14)\'ün 9 uncu maddesinde yer alan "BTB başvurusu sadece bir kalem eşya için yapılır" hükmüyle çeliştiği tespit edilmiştir.\nBu itibarla; söz konusu BTB, 4458 sayılı Gümrük Kanunu\'nun 9 uncu maddesinin beşinci fıkrası ile Gümrük Genel Tebliği (Tarife) (Seri No:14)\'ün 18 inci maddesi çerçevesinde 10.06.2026 tarihinde iptal edilmiştir.',
    'GTİP numarasında değişiklik yapılmış ve ilgili tarife pozisyonu yeniden sınıflandırılmıştır. Mevcut karar geçerliliğini yitirmiştir.',
    'Avrupa Topluluğu Adalet Divanı kararı gereğince sınıflandırma revize edilmiş, bu karara aykırı BTB\'ler iptal edilmiştir.',
];

const MOCK_DATA = Array.from({ length: 32 }, (_, i) => {
    const hasImage = i % 3 !== 0;
    const durum = STATUSES[i % 3];
    const isTR = i % 2 === 0;
    const btbNum = isTR
        ? TR_BTB_NOS[Math.floor(i / 2) % TR_BTB_NOS.length]
        : EU_BTB_NOS[Math.floor(i / 2) % EU_BTB_NOS.length];
    const countryCode = isTR ? 'TR' : btbNum.substring(0, 2);
    return {
        key: String(i + 1),
        btbNo: btbNum,
        refNo: `${countryCode} · ${btbNum}`,
        gtip: isTR
            ? TR_GTIP_NOS[Math.floor(i / 2) % TR_GTIP_NOS.length]
            : EU_GTIP_NOS[Math.floor(i / 2) % EU_GTIP_NOS.length],
        tanim: TANIMLAR[i % TANIMLAR.length],
        tanimUzun: `${TANIMLAR[i % TANIMLAR.length]}. Ürün ambalajında üretici bilgileri, seri numarası ve CE işareti bulunmaktadır. İthalat beyannamesi kapsamında sunulan numune üzerinden yapılan inceleme sonucunda belirlenen sınıflandırmadır.`,
        gumruk: GUMRUKLER[i % GUMRUKLER.length],
        tarih: '04.2024 — 04.2027',
        durum,
        image: hasImage ? IMAGES[i % IMAGES.length] : null,
        largeImage: hasImage ? IMAGES[i % IMAGES.length].replace('300&h=200', '600&h=400') : null,
        gerekce: 'AV 1 / AV 6 / AV 5 b) Anm 1 Kap 63 / Anm 7 f) ABS XI / Anm 8 a) ABS XI ErlKN Pos 6305 (KN) RZ 01.0',
        keywords: KEYWORD_SETS[i % KEYWORD_SETS.length],
        iptalNedeni: durum === 'İptal' ? IPTAL_NEDENLERI[i % IPTAL_NEDENLERI.length] : null,
    };
});

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

const FlagGlobe = () => <GlobalOutlined style={{ fontSize: 16, flexShrink: 0 }} />;

const COUNTRY_OPTIONS = [
    { value: 'all', label: 'Tüm Ülkeler',   Flag: FlagGlobe },
    { value: 'tr',  label: 'Türkiye',        Flag: FlagTR },
    { value: 'eu',  label: 'Europe',         Flag: FlagEU },
    { value: 'uk',  label: 'United Kingdom', Flag: FlagUK },
];

const COUNTRY_META = {
    all: { subtitle: 'Tüm Sistemler — BTB Sorgulama',                  total: '17.480' },
    tr:  { subtitle: 'T.C. Ticaret Bakanlığı — BTB Sorgulama Sistemi', total: '1.840' },
    eu:  { subtitle: 'Avrupa Birliği — EBTI Sorgulama Sistemi',        total: '12.430' },
    uk:  { subtitle: 'HMRC — BTI Sorgulama Sistemi',                   total: '3.210' },
};

const ADDED_VALUES = {
    all: { '30': '447', '7': '107', 'today': '14' },
    tr:  { '30': '47',  '7': '12',  'today': '3' },
    eu:  { '30': '312', '7': '74',  'today': '9' },
    uk:  { '30': '88',  '7': '21',  'today': '2' },
};
const UPDATED_VALUES = {
    all: { '30': '58', '7': '12', 'today': '1' },
    tr:  { '30': '3',  '7': '1',  'today': '0' },
    eu:  { '30': '41', '7': '8',  'today': '1' },
    uk:  { '30': '14', '7': '3',  'today': '0' },
};
const CANCELLED_VALUES = {
    all: { '30': '88', '7': '15', 'today': '2' },
    tr:  { '30': '9',  '7': '2',  'today': '1' },
    eu:  { '30': '57', '7': '9',  'today': '0' },
    uk:  { '30': '22', '7': '4',  'today': '1' },
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


// ─── Component ───────────────────────────────────────────────────────────────

const BTBPage = () => {
    const [activeTab, setActiveTab]           = useState('metin');
    const [country, setCountry]               = useState('all');
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
    const [isMobile, setIsMobile]               = useState(() => window.innerWidth <= 768);
    const [compactRows, setCompactRows]         = useState(false);
    const [collapseKeys, setCollapseKeys]       = useState(['genel-bakis']);
    const [statsCountry, setStatsCountry]       = useState('all');
    const [detailWidth, setDetailWidth]         = useState(750);
    const [countryInHeader, setCountryInHeader] = useState(false);
    const [detailRevealed, setDetailRevealed]   = useState(false);
    const [detailResetting, setDetailResetting] = useState(false);
    const [detailImgExpanded, setDetailImgExpanded] = useState(false);
    const [expandedImgHeight, setExpandedImgHeight] = useState(300);
    const [searchCardOpen, setSearchCardOpen]       = useState(true);
    const [searchCollapsed, setSearchCollapsed]     = useState(false);

    const resultsRef           = useRef(null);
    const detailWidthRef       = useRef(750);
    const bottomBarRef         = useRef(null);
    const detailRevealTimerRef = useRef(null);
    const imgRef               = useRef(null);
    const imgWrapRef           = useRef(null);
    const headerRef            = useRef(null);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => {
            document.documentElement.style.setProperty('--btb-header-h', `${el.offsetHeight}px`);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (drawerOpen) { setCountryInHeader(false); return; }
        const el = bottomBarRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setCountryInHeader(!entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [drawerOpen]);

    const handleResizeStart = useCallback((e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startW = detailWidthRef.current;
        const onMove = (ev) => {
            const maxW = Math.max(380, window.innerWidth - 536); // 520 min main-pane + 16 handle
            const newW = Math.max(380, Math.min(Math.min(960, maxW), startW + (startX - ev.clientX)));
            detailWidthRef.current = newW;
            setDetailWidth(newW);
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
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
    const [colTarih, setColTarih] = useState('');
    const [colDurum, setColDurum] = useState(undefined);

    const openDetail = (rec) => {
        setSelected(rec);
        setDrawerOpen(true);
        setCollapseKeys([]);
        setDetailImgExpanded(false);
        setDetailWidth(750);
        detailWidthRef.current = 750;
        setDetailRevealed(false);
        setDetailResetting(true);
        if (detailRevealTimerRef.current) clearTimeout(detailRevealTimerRef.current);
        detailRevealTimerRef.current = setTimeout(() => {
            setDetailResetting(false);
            detailRevealTimerRef.current = setTimeout(() => setDetailRevealed(true), 400);
        }, 16);
    };
    const closeDetail = () => {
        setSelected(null);
        setDrawerOpen(false);
        setCollapseKeys(['genel-bakis']);
        setDetailWidth(750);
        detailWidthRef.current = 750;
    };

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

    const filteredData = MOCK_DATA
        .filter(r => {
            if (country === 'tr' && !r.btbNo.startsWith('TR'))        return false;
            if (country === 'eu' && r.btbNo.startsWith('TR'))         return false;
            if (country === 'uk' && !r.btbNo.startsWith('GB'))        return false;
            if (colBtb    && !r.btbNo.toLowerCase().includes(colBtb.toLowerCase()))     return false;
            if (colGtip   && !r.gtip.toLowerCase().includes(colGtip.toLowerCase()))     return false;
            if (colTanim  && r.tanim !== colTanim)   return false;
            if (colDurum  && r.durum !== colDurum)   return false;
            return true;
        })
        .sort((a, b) => sortOrder === 'desc'
            ? parseInt(b.key) - parseInt(a.key)
            : parseInt(a.key) - parseInt(b.key)
        );

    // ─── Table columns ───────────────────────────────────────────────────────
    const columns = [
        {
            title: '',
            dataIndex: 'image',
            key: 'img',
            width: 72,
            fixed: 'left',
            render: img => img ? (
                <img src={img} alt=""
                    style={{ width: 54, height: 54, borderRadius: 6, objectFit: 'cover', cursor: 'zoom-in', display: 'block' }}
                    onClick={e => { e.stopPropagation(); setPreviewImg(img.replace('300&h=200', '1200&h=800')); }}
                />
            ) : (
                <div style={{ width: 54, height: 54, borderRadius: 6, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bfbfbf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                    </svg>
                </div>
            ),
        },
        {
            title: (<div><div style={TH}>BTB No</div><Input size="small" placeholder="Giriniz" value={colBtb} onChange={e => setColBtb(e.target.value)} style={{ marginTop: 4 }} /></div>),
            dataIndex: 'btbNo', key: 'btbNo', width: 175,
            render: v => <Text style={{ fontSize: 13, fontWeight: 400, whiteSpace: 'nowrap' }}>{v}</Text>,
        },
        {
            title: (<div><div style={TH}>GTİP</div><Input size="small" placeholder="Giriniz" value={colGtip} onChange={e => setColGtip(e.target.value)} style={{ marginTop: 4 }} /></div>),
            dataIndex: 'gtip', key: 'gtip', width: 155,
            render: v => <Text style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 400, whiteSpace: 'nowrap' }}>{v}</Text>,
        },
        {
            title: (<div><div style={TH}>Eşya Tanımı</div><Select size="small" placeholder="Seçiniz" value={colTanim} onChange={setColTanim} allowClear style={{ marginTop: 4, width: '100%' }} options={[...new Set(MOCK_DATA.map(r => r.tanim))].map(t => ({ value: t, label: t }))} /></div>),
            dataIndex: 'tanim', key: 'tanim', ellipsis: true,
            render: (v, record) => (
                <Tooltip title={record.tanimUzun} styles={{ root: { maxWidth: 360 } }} placement="topLeft">
                    <Text style={{ fontSize: 13 }}>{v}</Text>
                </Tooltip>
            ),
        },
        {
            title: (<div><div style={TH}>Başlangıç - Bitiş Tarihi</div><Input size="small" placeholder="Giriniz" value={colTarih} onChange={e => setColTarih(e.target.value)} style={{ marginTop: 4 }} /></div>),
            dataIndex: 'tarih', key: 'tarih', width: 180,
            render: v => <Text style={{ fontSize: 12, color: '#8c8c8c' }}>{v}</Text>,
        },
        {
            title: (
                <div>
                    <div style={{ ...TH, whiteSpace: 'nowrap' }}>Statü</div>
                    {drawerOpen ? (
                        <Select
                            size="small"
                            placeholder="—"
                            value={colDurum}
                            onChange={setColDurum}
                            allowClear
                            popupMatchSelectWidth={false}
                            style={{ marginTop: 4, width: '100%' }}
                            labelRender={({ value }) => value ? (
                                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor(String(value)), display: 'inline-block' }} />
                                </span>
                            ) : null}
                            options={STATUSES.map(s => ({
                                value: s,
                                label: (
                                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor(s), display: 'inline-block' }} />
                                    </span>
                                ),
                            }))}
                        />
                    ) : (
                        <Select size="small" placeholder="Seçiniz" value={colDurum} onChange={setColDurum} allowClear style={{ marginTop: 4, width: '100%' }} options={STATUSES.map(s => ({ value: s, label: s }))} />
                    )}
                </div>
            ),
            dataIndex: 'durum', key: 'durum', width: drawerOpen ? 82 : 110, fixed: 'right',
            render: v => (
                <Tooltip title={v}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: drawerOpen ? 'center' : 'flex-start', gap: 6, fontSize: 13 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(v), display: 'inline-block', flexShrink: 0 }} />
                        {!drawerOpen && v}
                    </span>
                </Tooltip>
            ),
        },
    ];

    // ─── Tab nav items ────────────────────────────────────────────────────────

    const TABS = [
        { key: 'metin',    icon: <SearchOutlined />, label: 'BTB ile Ara' },
        { key: 'gelismis', icon: <ControlOutlined />, label: 'Detaylı Arama' },
    ];

    // ─── Bottom search bar (shared) ───────────────────────────────────────────

    const searchCardCompact = drawerOpen || searchCollapsed;

    const searchBarControls = (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!searchCardCompact && <Text style={{ fontSize: 13, color: '#595959', whiteSpace: 'nowrap' }}>Sonuç hacmi :</Text>}
                <Select value={resultCount} onChange={setResultCount}
                    style={{ width: 70 }}
                    size={searchCardCompact ? 'middle' : 'small'}
                    options={['10', '25', '50', '100'].map(v => ({ value: v, label: v }))} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!searchCardCompact && <Text style={{ fontSize: 13, color: '#595959' }}>Sadece resimli</Text>}
                <Switch
                    checked={onlyWithImg}
                    onChange={setOnlyWithImg}
                    checkedChildren={searchCardCompact ? <PictureOutlined /> : undefined}
                    unCheckedChildren={searchCardCompact ? <PictureOutlined /> : undefined}
                />
            </div>
            {!searchCardCompact && (
                <Button type="primary" loading={loading}
                    style={{ borderRadius: 6, paddingLeft: 28, paddingRight: 28, fontWeight: 600 }}
                    onClick={handleSearch}>
                    Ara
                </Button>
            )}
        </>
    );

    const BottomBar = !searchCardCompact ? (
        <div ref={bottomBarRef} className="btb-search-bar">
            {searchBarControls}
        </div>
    ) : null;

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
            {searchCardCompact && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
                    margin: '4px -24px 0', padding: '14px 24px',
                    borderTop: '1px solid #f0f0f0',
                }}>
                    <Text style={{ fontSize: 13, color: '#595959', whiteSpace: 'nowrap' }}>Sonuç hacmi :</Text>
                    <Select value={resultCount} onChange={setResultCount} size="small" style={{ width: 70 }}
                        options={['10', '25', '50', '100'].map(v => ({ value: v, label: v }))} />
                    <Switch checked={onlyWithImg} onChange={setOnlyWithImg}
                        checkedChildren={<PictureOutlined />} unCheckedChildren={<PictureOutlined />} />
                    <Button type="primary" loading={loading} style={{ borderRadius: 6, fontWeight: 600 }} onClick={handleSearch}>
                        Ara
                    </Button>
                </div>
            )}
        </div>
    );

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <>
        {/* Full-width page header — sticky, spans entire screen */}
        <div className="btb-full-header" ref={headerRef}>
            <div className="btb-page-header-inner" style={{ maxWidth: drawerOpen ? 'none' : 1120, margin: drawerOpen ? '0' : '0 auto', padding: '16px 22px 16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <Title level={3} style={{ margin: 0, fontWeight: 700, fontSize: 22 }}>
                        Bağlayıcı Tarife Bilgisi
                    </Title>
                    <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>
                        {COUNTRY_META.all.subtitle}
                    </Text>
                </div>
                {countryInHeader && !drawerOpen && (
                    <div style={{ display: 'flex', gap: 6 }}>
                        {COUNTRY_OPTIONS.map(opt => {
                            const active = country === opt.value;
                            return (
                                <button key={opt.value} onClick={() => setCountry(opt.value)} style={{
                                    display: 'flex', alignItems: 'center', gap: 7,
                                    padding: '4px 12px', borderRadius: 6, cursor: 'pointer',
                                    fontSize: 13, fontWeight: active ? 500 : 400,
                                    background: active ? '#1677ff' : '#fff',
                                    color: active ? '#fff' : '#374151',
                                    border: active ? '1px solid #1677ff' : '1px solid #d1d5db',
                                    transition: 'all 0.15s', whiteSpace: 'nowrap', lineHeight: 1,
                                }}>
                                    <opt.Flag />{opt.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

        <div className={`btb-page-root${drawerOpen ? ' btb-page-root--expanded' : ''}${drawerOpen && !isMobile ? ' btb-page-root--split-mode' : ''}`}>
            {/* Split layout area below header */}
            <div className="btb-split-layout">
            {/* LEFT: Main content */}
            <div className={`btb-main-pane${drawerOpen ? ' btb-main-pane--shifted' : ''}`}>

        <div className="btb-content-wrapper" style={{ margin: drawerOpen ? 0 : '0 auto', maxWidth: drawerOpen ? 'none' : 1120, padding: '24px 22px 24px 32px' }}>

            {/* Stat Cards — Genel Bakış (Collapsible) */}
            <Collapse
                activeKey={collapseKeys}
                onChange={setCollapseKeys}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} style={{ fontSize: 12, color: '#8c8c8c' }} />}
                style={{ background: '#fff', borderRadius: 6, border: '1px solid #e5e7eb', marginBottom: 20 }}
                items={[{
                    key: 'genel-bakis',
                    label: <span style={{ fontSize: 15, fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>Genel Bakış</span>,
                    extra: (
                        <div onClick={e => e.stopPropagation()}>
                            <Dropdown
                                menu={{
                                    items: COUNTRY_OPTIONS.map(opt => ({
                                        key: opt.value,
                                        icon: <opt.Flag />,
                                        label: opt.label,
                                    })),
                                    selectedKeys: [statsCountry],
                                    onClick: ({ key }) => setStatsCountry(key),
                                }}
                                trigger={['click']}
                            >
                                {(() => {
                                    const sel = COUNTRY_OPTIONS.find(o => o.value === statsCountry);
                                    const Flag = sel?.Flag;
                                    return (
                                        <button style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            padding: '2px 10px', borderRadius: 6, cursor: 'pointer',
                                            fontSize: 12, fontWeight: 400,
                                            background: '#fff', color: '#374151',
                                            border: '1px solid #d9d9d9',
                                            fontFamily: 'inherit', whiteSpace: 'nowrap', lineHeight: '20px',
                                        }}>
                                            {Flag && <Flag />}{sel?.label}<DownOutlined style={{ fontSize: 10, color: '#8c8c8c' }} />
                                        </button>
                                    );
                                })()}
                            </Dropdown>
                        </div>
                    ),
                    children: (
                        <div className="btb-stat-segments" style={{ display: 'flex', flexWrap: drawerOpen ? 'wrap' : 'nowrap', margin: '-12px -16px -12px -16px' }}>
                            {STATS.map((s, i) => {
                                const isAdded     = s.key === 'added';
                                const isUpdated   = s.key === 'updated';
                                const isCancelled = s.key === 'cancelled';
                                const isDynamic   = isAdded || isUpdated || isCancelled;
                                const value = isAdded     ? ADDED_VALUES[statsCountry][addedPeriod]
                                            : isUpdated   ? UPDATED_VALUES[statsCountry][updatedPeriod]
                                            : isCancelled ? CANCELLED_VALUES[statsCountry][cancelledPeriod]
                                            : COUNTRY_META[statsCountry].total;
                                const periodValue  = isAdded ? addedPeriod : isUpdated ? updatedPeriod : cancelledPeriod;
                                const periodSetter = isAdded ? setAddedPeriod : isUpdated ? setUpdatedPeriod : setCancelledPeriod;
                                const periodOpts   = isAdded ? PERIOD_OPTIONS_ADDED : isUpdated ? PERIOD_OPTIONS_UPDATED : PERIOD_OPTIONS_CANCELLED;
                                const borderRight = drawerOpen
                                    ? (i % 2 === 0 ? '1px solid #e5e7eb' : 'none')
                                    : (i < STATS.length - 1 ? '1px solid #e5e7eb' : 'none');
                                const borderBottom = drawerOpen && i < 2 ? '1px solid #e5e7eb' : 'none';
                                return (
                                    <div key={i} className="btb-stat-segment" style={{
                                        flex: drawerOpen ? '0 0 50%' : 1,
                                        minWidth: 0,
                                        boxSizing: 'border-box',
                                        padding: drawerOpen ? '12px 14px 10px' : '16px 20px 14px',
                                        borderRight,
                                        borderBottom,
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
                    ),
                }]}
            />

            {/* Search panel */}
            <Card className={`btb-search-card${searchCardCompact ? ' btb-search-card--open' : ''}`} styles={{ body: { padding: 0 } }} style={{ marginBottom: 20 }}>

                {/* Tab nav */}
                <div className="btb-tab-nav-wrap" style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                    {!drawerOpen && (
                        <Button
                            type="text"
                            size="small"
                            icon={<CaretRightOutlined rotate={searchCollapsed ? 0 : 90} style={{ transition: 'transform 0.3s ease', fontSize: 12, color: '#8c8c8c' }} />}
                            onClick={() => setSearchCollapsed(v => !v)}
                        />
                    )}
                    <Segmented
                        value={activeTab}
                        onChange={setActiveTab}
                        options={TABS.map(t => searchCardCompact
                            ? { value: t.key, icon: t.icon }
                            : { value: t.key, label: t.label, icon: t.icon }
                        )}
                        style={{ flexShrink: 0, width: isMobile && !searchCardCompact ? '100%' : 'auto' }}
                    />
                    {searchCardCompact && activeTab !== 'gelismis' && (
                        <Input.Search
                            placeholder="Bulmak istediğiniz BTB'nin ilk 4 hanesini girin"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            onSearch={handleSearch}
                            loading={loading}
                            enterButton
                            style={{ fontSize: 13, flex: 1 }}
                            className="btb-nav-search"
                        />
                    )}
                    {searchCardCompact && activeTab !== 'gelismis' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                            {searchBarControls}
                        </div>
                    )}
                    {searchCardCompact && activeTab === 'gelismis' && (
                        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                            <Button
                                type="text"
                                size="small"
                                icon={<CaretRightOutlined rotate={searchCardOpen ? 270 : 90} style={{ transition: 'transform 0.3s ease', fontSize: 12, color: '#8c8c8c' }} />}
                                onClick={() => setSearchCardOpen(v => !v)}
                            />
                        </div>
                    )}
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateRows: (searchCardCompact && activeTab === 'gelismis' && !searchCardOpen) ? '0fr' : '1fr',
                        transition: 'grid-template-rows 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                >
                    <div style={{ overflow: 'hidden', minHeight: 0 }}>
                        <div key={activeTab} className="btb-tab-content">
                            {activeTab === 'metin' && !searchCardCompact && (
                                <div style={{ padding: '20px 24px 24px' }}>
                                    <Input size="large" placeholder="Bulmak istediğiniz BTB'nin ilk 4 hanesini girin"
                                        value={searchText} onChange={e => setSearchText(e.target.value)}
                                        style={{ borderRadius: 6, fontSize: 13, background: '#fff', borderWidth: 2 }} onPressEnter={handleSearch} />
                                </div>
                            )}
                            {activeTab === 'gelismis' && (
                                <div className="btb-gelismis-expand">
                                    <div>{GelismisContent}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {BottomBar}
            </Card>

            {/* Loading skeleton */}
            {loading && <ResultsSkeleton />}

            {/* Results */}
            {searched && !loading && (
                <div ref={resultsRef} key={resultsKey} className="btb-results-appear">
                    <div className="btb-results-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Text strong style={{ fontSize: 16, whiteSpace: 'nowrap' }}>Sonuçlar</Text>
                            <Tag style={{ borderRadius: 20, fontWeight: 600, fontSize: 12, background: '#f0f0f0', color: '#595959', border: '1px solid #e0e0e0', margin: 0 }}>{filteredData.length} Kayıt</Tag>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Dropdown
                                menu={{
                                    items: COUNTRY_OPTIONS.map(opt => ({
                                        key: opt.value,
                                        icon: <opt.Flag />,
                                        label: opt.label,
                                    })),
                                    selectedKeys: [country],
                                    onClick: ({ key }) => setCountry(key),
                                }}
                                trigger={['click']}
                            >
                                {(() => {
                                    const sel = COUNTRY_OPTIONS.find(o => o.value === country);
                                    const Flag = sel?.Flag;
                                    return (
                                        <button style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                                            fontSize: 13, fontWeight: 400,
                                            background: '#fff', color: '#374151',
                                            border: '1px solid #d9d9d9',
                                            fontFamily: 'inherit', whiteSpace: 'nowrap',
                                        }}>
                                            {Flag && <Flag />}
                                            {sel?.label}
                                            <DownOutlined style={{ fontSize: 10, color: '#8c8c8c' }} />
                                        </button>
                                    );
                                })()}
                            </Dropdown>
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
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '5px 8px', borderRadius: 6, cursor: 'pointer',
                                    color: '#595959', background: '#fff', border: '1px solid #d9d9d9',
                                    fontFamily: 'inherit',
                                }}>
                                    <SortIcon />
                                </button>
                            </Dropdown>
                            <button
                                onClick={() => setCompactRows(c => !c)}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '5px 8px', borderRadius: 6, cursor: 'pointer',
                                    color: compactRows ? '#1677ff' : '#595959',
                                    background: compactRows ? '#f0f7ff' : '#fff',
                                    border: compactRows ? '1px solid #1677ff' : '1px solid #d9d9d9',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.15s',
                                }}
                                title={compactRows ? 'Satırları büyüt' : 'Satırları küçült'}
                            >
                                <ColumnHeightOutlined />
                            </button>
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
                                <Col xs={drawerOpen ? 24 : 12} sm={drawerOpen ? 24 : 8} md={drawerOpen ? 24 : 6} key={rec.key}>
                                    {drawerOpen ? (
                                        /* Horizontal layout when drawer is open */
                                        <Card hoverable className="btb-result-card" styles={{ body: { padding: 0 } }} onClick={() => openDetail(rec)}>
                                            <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 76 }}>
                                                <div style={{ width: 100, flexShrink: 0, background: '#f0f0f0', overflow: 'hidden', borderRadius: '6px 0 0 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {rec.image ? (
                                                        <img src={rec.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bfbfbf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                                            <path d="M21 15l-5-5L5 21" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div style={{ flex: 1, padding: '10px 12px', minWidth: 0 }}>
                                                    <Text style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 400, display: 'block', color: '#595959' }}>{rec.gtip}</Text>
                                                    <Text style={{ fontSize: 13, color: '#1d3557', display: 'block', marginTop: 2, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rec.tanim}</Text>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                                        <Text style={{ fontSize: 11, color: '#8c8c8c' }}>{rec.refNo}</Text>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, flexShrink: 0 }}>
                                                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor(rec.durum), display: 'inline-block' }} />
                                                            <Text style={{ fontSize: 11, color: statusColor(rec.durum) }}>{rec.durum}</Text>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ) : (
                                        /* Vertical grid layout */
                                        <Card hoverable className="btb-result-card" styles={{ body: { padding: '10px 12px 12px' } }}
                                            cover={
                                                <div style={{ height: 130, overflow: 'hidden', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {rec.image ? (
                                                        <img src={rec.image} alt=""
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                                                            onClick={e => { e.stopPropagation(); setPreviewImg(rec.largeImage); }} />
                                                    ) : (
                                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#bfbfbf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                                            <path d="M21 15l-5-5L5 21" />
                                                        </svg>
                                                    )}
                                                </div>
                                            }
                                            onClick={() => openDetail(rec)}>
                                            <Text style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 400, display: 'block' }}>{rec.gtip}</Text>
                                            <Text style={{ fontSize: 12, color: '#1d3557', display: 'block', marginTop: 2, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rec.tanim}</Text>
                                            <Text style={{ fontSize: 11, color: '#8c8c8c', display: 'block', marginBottom: 6 }}>{rec.refNo}</Text>
                                            <Tooltip title={rec.durum}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(rec.durum), display: 'inline-block', flexShrink: 0 }} />
                                                    {rec.durum}
                                                </span>
                                            </Tooltip>
                                        </Card>
                                    )}
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #e8ecf0' }}>
                            <Table className={`btb-list-table${compactRows ? ' btb-list-table--compact' : ''}`} columns={columns} dataSource={filteredData} rowKey="key" size={compactRows ? 'small' : 'middle'}
                                scroll={{ x: 820 }}
                                rowClassName={rec => rec.key === selected?.key ? 'btb-row-active' : ''}
                                pagination={{ pageSize: parseInt(resultCount), showTotal: (t, r) => `${r[0]}-${r[1]} / ${t}`, style: { padding: '12px 16px' } }}
                                onRow={rec => ({ onClick: () => openDetail(rec), style: { cursor: 'pointer' } })} />
                        </Card>
                    )}
                </div>
            )}

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

            {/* Dim overlay when image is expanded (desktop only) */}
            {!isMobile && detailImgExpanded && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 28, animation: 'btbFadeIn 0.3s ease' }}
                    onClick={() => setDetailImgExpanded(false)}
                />
            )}

            {/* RIGHT: Detail Panel (inline card, replaces Drawer) */}
            {isMobile && drawerOpen && (
                <div className="btb-mobile-overlay" onClick={closeDetail} />
            )}
            {!isMobile && drawerOpen && (
                <div className="btb-resize-handle" onMouseDown={handleResizeStart}>
                    <div className="btb-resize-grip">
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                            <circle cx="2" cy="2"  r="1.5" fill="#8c8c8c"/>
                            <circle cx="6" cy="2"  r="1.5" fill="#8c8c8c"/>
                            <circle cx="2" cy="7"  r="1.5" fill="#8c8c8c"/>
                            <circle cx="6" cy="7"  r="1.5" fill="#8c8c8c"/>
                            <circle cx="2" cy="12" r="1.5" fill="#8c8c8c"/>
                            <circle cx="6" cy="12" r="1.5" fill="#8c8c8c"/>
                        </svg>
                    </div>
                    <Tooltip title="Panel genişliğini sıfırla" placement="left">
                        <button
                            className="btb-resize-reset"
                            onMouseDown={e => e.stopPropagation()}
                            onClick={() => { setDetailWidth(750); detailWidthRef.current = 750; }}
                        >
                            <RedoOutlined />
                        </button>
                    </Tooltip>
                </div>
            )}
            <div className={`btb-detail-pane${drawerOpen ? ' btb-detail-pane--open' : ''}`}
                 style={{
                     ...(drawerOpen && !isMobile ? { flex: `0 0 ${detailWidth}px` } : undefined),
                     ...(detailImgExpanded ? { zIndex: 29 } : undefined),
                 }}>
                {selected && (
                    <div className="btb-detail-card">
                        {isMobile && (
                            <div className="btb-bottom-sheet-handle">
                                <div style={{ width: 40, height: 4, borderRadius: 2, background: '#d9d9d9' }} />
                            </div>
                        )}
                        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #f0f0f0', overflow: 'hidden' }}>
                            <Text ellipsis={{ tooltip: selected.tanim }} style={{ fontSize: 15, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: 'rgba(0,0,0,0.88)', flex: 1, minWidth: 0 }}>
                                {selected.tanim}
                            </Text>
                            <Button type="text" icon={<CloseOutlined />} onClick={closeDetail} style={{ flexShrink: 0 }} />
                        </div>

                        {selected.largeImage ? (
                            <div
                                ref={imgWrapRef}
                                className="btb-img-wrap"
                                style={{
                                    alignItems: detailImgExpanded ? 'flex-start' : 'center',
                                    maxHeight: detailImgExpanded ? expandedImgHeight : 220,
                                    transition: 'max-height 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: detailImgExpanded ? 'zoom-out' : 'zoom-in',
                                }}
                                onClick={() => {
                                    if (!detailImgExpanded && imgRef.current && imgWrapRef.current) {
                                        const img = imgRef.current;
                                        const wrapW = imgWrapRef.current.offsetWidth;
                                        const h = Math.round((img.naturalHeight / img.naturalWidth) * wrapW);
                                        setExpandedImgHeight(h || 400);
                                    }
                                    setDetailImgExpanded(v => !v);
                                }}
                            >
                                {!detailImgExpanded && (
                                    <div className="btb-img-hover-hint"><ExpandOutlined style={{ marginRight: 6 }} />Tamamını görmek için tıkla</div>
                                )}
                                <img ref={imgRef} src={selected.largeImage} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>
                        ) : (
                            <div style={{ width: '100%', height: 220, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#bfbfbf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="M21 15l-5-5L5 21" />
                                </svg>
                            </div>
                        )}

                        <div style={{ padding: 24 }}>
                            <div className={`t-skel${detailRevealed ? ' is-revealed' : ''}${detailResetting ? ' is-resetting' : ''}`}>
                                {/* Skeleton placeholder */}
                                <div className={`t-skel-skeleton${!detailRevealed ? ' is-pulsing' : ''}`}>
                                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5', gap: 12 }}>
                                        <div style={{ width: 160, height: 13, background: '#f0f0f0', borderRadius: 4, flexShrink: 0 }} />
                                        <div style={{ width: 100, height: 24, background: '#f0f0f0', borderRadius: 12 }} />
                                    </div>
                                    {[80, 120, 60, 140, 110, 20, 30, 20].map((w, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5', gap: 12 }}>
                                            <div style={{ width: 160, height: 13, background: '#f0f0f0', borderRadius: 4, flexShrink: 0 }} />
                                            <div style={{ width: `${w + 40}px`, height: 13, background: '#f0f0f0', borderRadius: 4 }} />
                                        </div>
                                    ))}
                                    {[64, 48, 100, 48].map((h, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', padding: '10px 0', borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none', gap: 12 }}>
                                            <div style={{ width: 160, height: 13, background: '#f0f0f0', borderRadius: 4, flexShrink: 0, marginTop: 4 }} />
                                            <div style={{ flex: 1, height: h, background: '#f0f0f0', borderRadius: 6 }} />
                                        </div>
                                    ))}
                                    <div style={{ marginTop: 20, height: 38, background: '#f0f0f0', borderRadius: 6 }} />
                                </div>

                                {/* Real content */}
                                <div className="t-skel-content">
                                    {/* Durum badge */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                                        <Text style={{ width: 160, minWidth: 160, color: '#8c8c8c', fontSize: 13 }}>Durum</Text>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', borderRadius: 20, background: `${statusColor(selected.durum)}18`, border: `1px solid ${statusColor(selected.durum)}40` }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(selected.durum), display: 'inline-block', flexShrink: 0 }} />
                                            <Text style={{ fontSize: 13, fontWeight: 600, color: statusColor(selected.durum) }}>{selected.durum}</Text>
                                            {selected.durum === 'Mülga' && (
                                                <Tooltip title="Eski bir kanunun yerine yenisi çıktığında, geçerliliğini kaybeden eski kanun için kullanılır.">
                                                    <QuestionCircleOutlined style={{ fontSize: 13, color: statusColor(selected.durum), cursor: 'help' }} />
                                                </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                    {[
                                        ['Eşya Kodu',              selected.gtip.replace(/\./g, '')],
                                        ['Karar Tarihi',           selected.tarih.split('—')[0].trim()],
                                        ['Güncelleme Tarihi',      selected.tarih.split('—')[1]?.trim() ?? '-'],
                                        ['Başlangıç - Bitiş Tarihi', selected.tarih],
                                        ['BTB Numarası',           selected.btbNo],
                                        ['Fasıl',                  selected.gtip.substring(0, 2)],
                                        ['Kararı Veren Birim',     selected.btbNo.substring(0, 2)],
                                        ['Başvuru Sahibi',         '-'],
                                    ].map(([label, val]) => (
                                        <div key={label} style={{ display: 'flex', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                                            <Text style={{ width: 160, minWidth: 160, color: '#8c8c8c', fontSize: 13 }}>{label}</Text>
                                            <Text style={{ color: '#1d3557', fontSize: 13 }}>{val}</Text>
                                        </div>
                                    ))}

                                    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                                        <Text style={{ width: 160, minWidth: 160, color: '#8c8c8c', fontSize: 13 }}>Eşya Tanımı</Text>
                                        <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '12px 14px', border: '1px solid #e8ecf0', fontSize: 13, color: '#3d5a73', lineHeight: 1.7 }}>
                                            {selected.tanimUzun}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                                        <Text style={{ width: 160, minWidth: 160, color: '#8c8c8c', fontSize: 13 }}>Karar Özeti</Text>
                                        <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '12px 14px', border: '1px solid #e8ecf0', fontSize: 13, color: '#3d5a73', lineHeight: 1.7 }}>
                                            {selected.gerekce}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                                        <Text style={{ width: 160, minWidth: 160, color: '#8c8c8c', fontSize: 13, paddingTop: 4 }}>Anahtar Kelimeler</Text>
                                        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {(selected.keywords || []).map(kw => (
                                                <Tag key={kw} style={{ margin: 0, fontSize: 12, borderRadius: 4 }}>{kw}</Tag>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '10px 0', borderBottom: selected.durum === 'İptal' ? '1px solid #f5f5f5' : 'none' }}>
                                        <Text style={{ width: 160, minWidth: 160, color: '#8c8c8c', fontSize: 13 }}>Yasal Dayanak</Text>
                                        <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '12px 14px', border: '1px solid #e8ecf0', fontSize: 13, color: '#3d5a73', lineHeight: 1.7 }}>
                                            {selected.gerekce}
                                        </div>
                                    </div>

                                    {selected.durum === 'İptal' && (
                                        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '10px 0' }}>
                                            <Text style={{ width: 160, minWidth: 160, color: '#8c8c8c', fontSize: 13, paddingTop: 4 }}>İptal Nedeni</Text>
                                            <div style={{ flex: 1, background: '#fff5f5', border: '1px solid #ffccc7', borderRadius: 6, padding: '12px 14px', fontSize: 13, color: '#a8071a', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                                                {selected.iptalNedeni}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ marginTop: 20, paddingBottom: 4 }}>
                                        <Button
                                            icon={<DownloadOutlined />}
                                            style={{ width: '100%', height: 38, fontSize: 13, borderRadius: 6 }}
                                            onClick={() => {}}
                                        >
                                            PDF İndir
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </div>
        </>
    );
};

const TH = { fontSize: 12, fontWeight: 600, color: '#595959' };

export default BTBPage;

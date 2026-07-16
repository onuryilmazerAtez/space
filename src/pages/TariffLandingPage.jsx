import React, { useState, useRef, useEffect, useCallback } from 'react';
import './TariffLandingPage.css';

/* ── Inline SVG icons ── */
const TariffLogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#1677ff" />
    <path d="M2 17l10 5 10-5" stroke="#1677ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12l10 5 10-5" stroke="#1677ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SparkleIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0l1.796 5.204L15 7l-5.204 1.796L8 14l-1.796-5.204L1 7l5.204-1.796L8 0z" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 1l2.09 4.26L15 5.96l-3.5 3.42.83 4.84L8 12l-4.33 2.22.83-4.84L1 5.96l4.91-.7L8 1z" />
  </svg>
);

const QuestionIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="8" />
    <path d="M7.5 7.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" />
    <circle cx="10" cy="14" r="0.5" fill="currentColor" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="8" />
    <path d="M2 10h16M10 2a14 14 0 014 8 14 14 0 01-4 8 14 14 0 01-4-8 14 14 0 014-8z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4.5l3 3 3-3" />
  </svg>
);

const TrendUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const PlaneDepIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 3.5l-6 6M14.5 3.5l-4 11-2-5-5-2 11-4z" />
  </svg>
);

const PlaneArrIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 11l6-6M5 11h5M5 11V6" />
    <circle cx="8" cy="8" r="7" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 14s-5-4.35-5-7.5a5 5 0 0110 0C13 9.65 8 14 8 14z" />
    <circle cx="8" cy="6.5" r="1.5" />
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 10.67V5.33a1.33 1.33 0 00-.67-1.15l-4.66-2.67a1.33 1.33 0 00-1.34 0L2.67 4.18A1.33 1.33 0 002 5.33v5.34a1.33 1.33 0 00.67 1.15l4.66 2.67a1.33 1.33 0 001.34 0l4.66-2.67A1.33 1.33 0 0014 10.67z" />
    <path d="M2.33 4.33L8 7.67l5.67-3.34M8 14.67V7.67" />
  </svg>
);

const SwapIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 1l3 3-3 3M14 4H6M5 15l-3-3 3-3M2 12h8" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <line x1="16" y1="16" x2="12.5" y2="12.5" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 1H3a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5L8 1z" />
    <path d="M8 1v4h4" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="2.5" width="12" height="9" rx="1" />
    <path d="M1 3.5l6 4 6-4" />
  </svg>
);

/* ── Tariff AI brand mark (gradient pinwheel) ── */
const TariffAiLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M38.9975 44.5403C39.3177 44.8788 39.5774 45.2716 39.7641 45.7008C39.9772 46.1911 40.0909 46.72 40.0985 47.2551C40.106 47.7904 40.0073 48.323 39.808 48.8193C39.6087 49.3153 39.3128 49.767 38.938 50.1466C38.5631 50.5262 38.1156 50.8268 37.6237 51.0304C37.132 51.2338 36.6043 51.3374 36.0726 51.3331C35.5408 51.3287 35.0141 51.2167 34.5256 51.0051C34.0373 50.7935 33.5954 50.4857 33.2267 50.1002L28.9241 45.7699L34.5711 40.0847L38.9975 44.5403ZM35.7259 36.1996L21.953 50.0782C21.2046 50.8296 20.1903 51.2517 19.1332 51.2517C18.076 51.2516 17.0617 50.8298 16.3133 50.0782H16.3052C15.5585 49.325 15.1392 48.3037 15.139 47.2397C15.1391 46.1759 15.5588 45.1551 16.3052 44.4019L21.2597 39.4166L21.2621 39.419L29.0112 31.6203L29.0047 31.6138L30.0862 30.5233L35.7259 36.1996ZM37.6848 24.1814L42.037 28.5629L48.3058 34.8715C49.0558 35.6232 49.4784 36.6447 49.481 37.71C49.4832 38.7755 49.0647 39.7991 48.318 40.5543C47.5711 41.3093 46.5559 41.735 45.4974 41.7375C44.4388 41.7398 43.4213 41.319 42.671 40.5673L42.6588 40.5543L37.0289 34.8886L37.0256 34.891L31.3851 29.2139L31.3883 29.2115L28.8427 26.6488L34.4898 20.966L37.6848 24.1814ZM16.7731 36.2484L12.5023 40.547C11.9441 41.1049 11.2339 41.485 10.462 41.6383C9.69012 41.7914 8.88995 41.711 8.16303 41.408C7.43613 41.1049 6.81419 40.5918 6.37591 39.9342C5.93783 39.2766 5.70242 38.5026 5.69963 37.7109C5.69835 37.1838 5.80045 36.6605 6.00074 36.1736C6.20113 35.6867 6.49639 35.2441 6.86745 34.8723L11.1359 30.5738L16.7731 36.2484ZM7.12624 15.9725C7.85626 15.6674 8.66058 15.587 9.43583 15.7422C10.2111 15.8976 10.9234 16.2818 11.4817 16.8449L17.6105 23.0136L17.6032 23.0209L25.7779 31.2493L25.7853 31.2419L26.35 31.81L20.7047 37.4919L19.0485 35.8245L19.0526 35.822L10.8779 27.5945L10.8738 27.5969L5.83717 22.5269C5.46607 22.156 5.17136 21.714 4.97046 21.2281C4.76968 20.7422 4.66584 20.2203 4.66609 19.6941C4.66377 18.8986 4.89657 18.1193 5.33423 17.4569C5.77208 16.7946 6.39638 16.2778 7.12624 15.9725ZM36.2582 6.20934C37.0351 6.04917 37.8424 6.12762 38.5751 6.43314C39.1619 6.67703 39.6823 7.05904 40.0928 7.54642C40.5032 8.03378 40.7922 8.61346 40.9351 9.23588L41.0352 10.1595C41.036 11.2243 40.6173 12.2462 39.8715 13.0013L33.9209 18.9901L25.1025 27.8663L19.4579 22.1851L21.6186 20.0098L21.6202 20.0114L29.3693 12.212L29.3677 12.2103L34.2155 7.33158C34.7697 6.76086 35.4815 6.3696 36.2582 6.20934ZM43.9064 14.2033C44.2754 13.5861 45.1979 13.6304 45.4884 14.3352L45.49 14.3368L45.9091 15.3532C46.6179 17.0709 47.9415 18.4446 49.6063 19.1887L50.7692 19.7095L50.9303 19.799C51.4671 20.1552 51.4666 20.9948 50.9303 21.351L50.77 21.4397L49.5347 21.9906L49.533 21.9922C47.9489 22.7035 46.6708 23.9903 45.9409 25.6047L45.9344 25.612L45.8945 25.7032L45.4827 26.6407L45.4567 26.6968C45.1159 27.3725 44.1609 27.3575 43.8502 26.6448L43.4425 25.7048C42.7207 24.0446 41.422 22.7165 39.7982 21.9906L38.5385 21.4299C37.8188 21.1066 37.8207 20.0422 38.5417 19.7201L39.738 19.1838L39.7486 19.1773L40.3101 18.8949L40.3329 18.8819C41.7119 18.097 42.8034 16.8556 43.4238 15.3524L43.8413 14.3352L43.9064 14.2033ZM16.9416 5.74222C17.7921 4.31889 19.8318 4.3134 20.6916 5.69421L20.7535 5.75524L20.8739 6.04577L21.1881 6.8083C21.5468 7.67777 22.1939 8.37578 22.9996 8.78422L23.1632 8.86153L24.095 9.27982L24.1519 9.31075L24.2724 9.37829L24.3269 9.40759L24.3782 9.44177C25.7068 10.3228 25.7039 12.3178 24.379 13.1975L24.3253 13.2325L24.2691 13.2634L24.1495 13.3293L24.0934 13.3602L24.0356 13.3863L23.1086 13.8005C22.272 14.1767 21.5858 14.8617 21.1913 15.7341L21.1116 15.9107L20.8544 16.4958L20.8511 16.5023L20.8487 16.508L20.83 16.5512L20.8161 16.5821L20.8007 16.6122C19.9602 18.2811 17.5675 18.2383 16.8081 16.4942L16.5021 15.7894L16.4256 15.6226C16.0245 14.8043 15.3616 14.1604 14.5579 13.8005L13.6123 13.3798L13.6082 13.3781C11.8456 12.5865 11.8568 10.0478 13.6115 9.26192L14.4627 8.87862L14.833 8.69226C15.5595 8.27572 16.1424 7.61597 16.4761 6.80749L16.8098 5.99613L16.835 5.94486L16.8838 5.84557L16.9107 5.79268L16.9416 5.74222ZM18.8313 8.96732C18.2482 9.92889 17.4446 10.736 16.4842 11.3143C17.4401 11.8782 18.2439 12.6684 18.8337 13.6109C19.4236 12.6674 20.2287 11.8789 21.1824 11.3151C20.2213 10.7369 19.4149 9.93015 18.8313 8.96732Z" fill="url(#tariff-landing-ai-grad)" />
    <defs>
      <radialGradient id="tariff-landing-ai-grad" cx="0" cy="0" r="1" gradientTransform="matrix(21.6669 34.5834 -30.4539 19.0794 16.7495 5.91657)" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D912F0" />
        <stop offset="1" stopColor="#219DFF" />
      </radialGradient>
    </defs>
  </svg>
);

const ThumbUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 22V11M2 13v7a2 2 0 002 2h13.4a2 2 0 002-1.7l1.4-9A2 2 0 0018.8 9H14V4a2 2 0 00-2-2L7 11H2z" />
  </svg>
);

const ThumbDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 2v11M22 11V4a2 2 0 00-2-2H6.6a2 2 0 00-2 1.7l-1.4 9A2 2 0 005.2 15H10v5a2 2 0 002 2l5-9h5z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Mock glossary used for the selection "Tanımla" (define) feature ── */
const TARIFF_GLOSSARY = {
  'gtip': 'GTİP (Gümrük Tarife İstatistik Pozisyonu), eşyaların uluslararası ticarette sınıflandırılması için kullanılan 12 haneli koddur. İlk 6 hanesi dünya genelinde ortak olan Harmonize Sistem kodudur.',
  'cif': 'CIF (Cost, Insurance and Freight), satıcının mal bedeli, sigorta ve navlun masraflarını üstlendiği bir teslim şeklidir; gümrük vergisi matrahının hesaplanmasında kullanılır.',
  'fob': 'FOB (Free on Board), malın gemiye yüklenmesine kadarki masraf ve risklerin satıcıya, sonrasının ise alıcıya ait olduğu bir teslim şeklidir.',
  'menşe': 'Menşe, bir eşyanın ekonomik milliyetini, yani üretildiği veya son önemli işçilikten geçtiği ülkeyi ifade eder ve tercihli tarife uygulamalarında belirleyicidir.',
  'gümrük vergisi': 'Gümrük vergisi, ithal edilen eşyanın CIF değeri üzerinden, ilgili tarife cetveline göre uygulanan mali bir yükümlülüktür.',
  'kdv': 'KDV (Katma Değer Vergisi), ithalatta gümrük vergisi ve diğer yüklerle birlikte oluşan matrah üzerinden hesaplanan, Türkiye’de standart oranı %20 olan dolaylı bir vergidir.',
  'ihracat': 'İhracat, bir ülkede üretilen veya bulunan malların başka bir ülkeye satılmak üzere gümrük hattından çıkarılmasıdır.',
  'ithalat': 'İthalat, yabancı bir ülkede üretilen malların, kullanılmak veya satılmak üzere gümrük hattından yurda sokulmasıdır.',
  'btb': 'BTB (Bağlayıcı Tarife Bilgisi), bir eşyanın GTİP sınıflandırmasının gümrük idaresi tarafından önceden, bağlayıcı şekilde onaylandığı resmi bir belgedir.',
  'mevzuat': 'Mevzuat, dış ticaret işlemlerinde uyulması gereken kanun, yönetmelik, tebliğ ve genelgelerin bütününü ifade eder.',
  'tarife': 'Tarife, bir eşyanın ithalat veya ihracatında uygulanacak vergi oranlarını gösteren, GTİP koduna bağlı cetveldir.',
};

function getMockDefinition(rawText) {
  const text = rawText.trim();
  const key = text.toLowerCase();
  const term = Object.keys(TARIFF_GLOSSARY).find((t) => key.includes(t));
  if (term) return TARIFF_GLOSSARY[term];
  return `"${text}" ifadesi, dış ticaret ve gümrük mevzuatı bağlamında geçen bir terimdir. Bu konudaki güncel mevzuatı, vergi oranlarını ve uygulama detaylarını Tariff AI'a danışarak öğrenebilirsiniz.`;
}

const TariffLandingPage = () => {
  const [activeSegment, setActiveSegment] = useState('export');

  /* ── Text-selection "Tanımla" (define) feature ── */
  const pageRef = useRef(null);
  const tooltipRef = useRef(null);
  const cardRef = useRef(null);
  const [selectionTooltip, setSelectionTooltip] = useState(null); // { text, x, y }
  const [defineCard, setDefineCard] = useState(null); // { text, x, y, loading, explanation }
  const [feedback, setFeedback] = useState('none'); // 'none' | 'like' | 'dislike'
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const closeDefineCard = useCallback(() => {
    setDefineCard(null);
    setFeedback('none');
    setFeedbackOpen(false);
    setFeedbackText('');
    setFeedbackSent(false);
  }, []);

  useEffect(() => {
    const handleMouseUp = (e) => {
      if (tooltipRef.current && tooltipRef.current.contains(e.target)) return;
      if (cardRef.current && cardRef.current.contains(e.target)) return;

      const sel = window.getSelection();
      const text = sel && sel.toString().trim();

      if (!text || !sel.rangeCount || !pageRef.current || !pageRef.current.contains(sel.anchorNode)) {
        setSelectionTooltip(null);
        return;
      }

      const rect = sel.getRangeAt(0).getBoundingClientRect();
      setSelectionTooltip({
        text,
        x: Math.min(Math.max(rect.left + rect.width / 2, 90), window.innerWidth - 90),
        y: rect.top,
      });
    };

    const handleMouseDown = (e) => {
      if (tooltipRef.current && tooltipRef.current.contains(e.target)) return;
      if (cardRef.current && cardRef.current.contains(e.target)) return;
      setSelectionTooltip(null);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleDefine = () => {
    if (!selectionTooltip) return;
    const { text, x, y } = selectionTooltip;
    setSelectionTooltip(null);
    setFeedback('none');
    setFeedbackOpen(false);
    setFeedbackText('');
    setFeedbackSent(false);
    setDefineCard({
      text,
      x: Math.min(Math.max(x, 180), window.innerWidth - 180),
      y,
      loading: true,
      explanation: '',
    });
    window.setTimeout(() => {
      setDefineCard((prev) => (prev ? { ...prev, loading: false, explanation: getMockDefinition(prev.text) } : prev));
    }, 550);
  };

  const handleLike = () => {
    setFeedback('like');
    setFeedbackOpen(false);
  };

  const handleDislike = () => {
    setFeedback('dislike');
    setFeedbackOpen(true);
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
  };

  return (
    <div className="tariff-landing" ref={pageRef}>

      {/* ── HERO ── */}
      <section className="tariff-hero">
        <div className="tariff-hero-bg" />

        {/* Left panel */}
        <div className="tariff-hero-left">
          <div className="tariff-badge">
            <SparkleIcon />
            Yeni nesil platform
          </div>

          <h1 className="tariff-hero-title">
            Ticaretteki<br />
            <span className="tariff-hero-title-highlight">Dijital</span> Rehberiniz
          </h1>

          <p className="tariff-hero-desc">
            İthalat ve ihracat işlemleriniz için gerekli vergi oranlarına, önlemlere ve belgelere
            anında erişin.
            <br /><br />
            AB, Birleşik Krallık, İsviçre ve Türkiye'ye ait güncel mevzuatı eşya kodu veya anahtar
            kelimeyle kolayca sorgulayın.
          </p>

          <button className="tariff-cta-btn" type="button">
            Hemen Ücretsiz Başla
          </button>

          <div className="tariff-stats">
            <div className="tariff-stat-item">
              <div className="tariff-stat-icon blue"><TrendUpIcon /></div>
              <span className="tariff-stat-value">12,564</span>
              <span className="tariff-stat-label">Günlük Sorgu</span>
            </div>
            <div className="tariff-stat-item">
              <div className="tariff-stat-icon orange"><UsersIcon /></div>
              <span className="tariff-stat-value">4,021</span>
              <span className="tariff-stat-label">Aktif Kullanıcı</span>
            </div>
            <div className="tariff-stat-item">
              <div className="tariff-stat-icon green"><ShieldCheckIcon /></div>
              <span className="tariff-stat-value">%99.9</span>
              <span className="tariff-stat-label">Veri güvenilirliği</span>
            </div>
            <div className="tariff-stat-item">
              <div className="tariff-stat-icon purple-stat"><CalendarIcon /></div>
              <span className="tariff-stat-value">4+ Yıl</span>
              <span className="tariff-stat-label">Platform Süresi</span>
            </div>
          </div>

          <div className="tariff-dots">
            <span className="tariff-dot" />
            <span className="tariff-dot active" />
          </div>
        </div>

        {/* Right panel – Query Card */}
        <div className="tariff-hero-right">
          <div className="tariff-query-card">
            {/* Card tabs */}
            <div className="tariff-card-tabs">
              <button className="tariff-card-tab active" type="button">Ülke İle</button>
              <button className="tariff-card-tab disabled" type="button">
                GTİP İle
                <span className="tariff-card-tab-badge">YAKINDA</span>
              </button>
            </div>

            {/* Card header */}
            <div className="tariff-card-header">
              <h2 className="tariff-card-title">Ticaret Mevzuatı Sorgulama</h2>
              <p className="tariff-card-subtitle">
                İthalat ve ihracat mevzuatlarını, vergilerini ve gerekli belgeleri<br />
                kolayca öğrenin
              </p>
            </div>

            {/* Popular searches */}
            <div className="tariff-card-popular">
              <div className="tariff-card-popular-label">
                <StarIcon />
                Sık Arananlar
              </div>
              <div className="tariff-card-tags">
                <span className="tariff-card-tag">BEL - TUR</span>
                <span className="tariff-card-tag">GER - TUR</span>
                <span className="tariff-card-tag">GER - FR</span>
                <span className="tariff-card-tag">FR - TUR</span>
                <span className="tariff-card-tag">TI - TUR</span>
              </div>
            </div>

            {/* Segmented control */}
            <div className="tariff-card-segmented">
              <div className="tariff-segmented">
                <button
                  className={`tariff-segmented-item ${activeSegment === 'export' ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveSegment('export')}
                >
                  <span className="tariff-segmented-icon export">İX</span>
                  İhracat Mevzuatı
                </button>
                <button
                  className={`tariff-segmented-item ${activeSegment === 'import' ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveSegment('import')}
                >
                  <span className="tariff-segmented-icon import">İM</span>
                  İthalat Mevzuatı
                </button>
              </div>
            </div>

            {/* Form body */}
            <div className="tariff-card-body">
              {/* Çıkış / Varış row */}
              <div className="tariff-form-row">
                <div className="tariff-form-group">
                  <label className="tariff-form-label">
                    <PlaneDepIcon />
                    Çıkış
                  </label>
                  <select className="tariff-form-select" defaultValue="">
                    <option value="" disabled>Seçiniz</option>
                  </select>
                </div>

                <button className="tariff-swap-btn" type="button" aria-label="Swap">
                  <SwapIcon />
                </button>

                <div className="tariff-form-group">
                  <label className="tariff-form-label">
                    <PlaneArrIcon />
                    Varış
                  </label>
                  <select className="tariff-form-select" defaultValue="">
                    <option value="" disabled>Seçiniz</option>
                  </select>
                </div>
              </div>

              {/* Menşe row */}
              <div className="tariff-form-row">
                <div className="tariff-form-group full">
                  <label className="tariff-form-label">
                    <MapPinIcon />
                    Menşe
                  </label>
                  <select className="tariff-form-select" defaultValue="">
                    <option value="" disabled>Seçiniz</option>
                  </select>
                </div>
              </div>

              {/* Eşya Kodu row */}
              <div className="tariff-form-row">
                <div className="tariff-form-group full">
                  <label className="tariff-form-label">
                    <BoxIcon />
                    Eşya Kodu
                  </label>
                  <div className="tariff-search-row">
                    <input
                      className="tariff-search-input"
                      type="text"
                      placeholder="12 haneli GTİP Kodunu veya anahtar kelime giriniz"
                    />
                    <button className="tariff-search-btn" type="button" aria-label="Ara">
                      <SearchIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="tariff-footer">
        <div className="tariff-footer-inner">
          <div className="tariff-footer-top">
            {/* Brand */}
            <div className="tariff-footer-brand">
              <div className="tariff-footer-logo">
                <TariffLogoIcon />
                <span className="tariff-footer-logo-text">Tariff</span>
              </div>
              <p className="tariff-footer-desc">
                İthalat ve ihracat mevzuatlarını, vergilerini ve
                gerekli belgeleri kolayca öğrenin.
              </p>
            </div>

            {/* Link columns */}
            <div className="tariff-footer-links">
              <div className="tariff-footer-col">
                <h4>Kurumsal</h4>
                <ul>
                  <li><a href="#">Hakkımızda</a></li>
                  <li>
                    <FileIcon />
                    <a href="#">Kullanım Kılavuzu</a>
                  </li>
                  <li>
                    <MailIcon />
                    <a href="#">Bize Ulaşın</a>
                  </li>
                </ul>
              </div>

              <div className="tariff-footer-col">
                <h4>Yasal</h4>
                <ul>
                  <li><a href="#">İptal ve İade</a></li>
                  <li><a href="#">Tariff Mesafeli Satış Sözleşmesi</a></li>
                  <li><a href="#">Kullanım Koşulları</a></li>
                </ul>
              </div>

              <div className="tariff-footer-col">
                <h4>Gizlilik &amp; KVKK</h4>
                <ul>
                  <li><a href="#">Gizlilik ve Güvenlik Politikası</a></li>
                  <li><a href="#">Çerez Politikası</a></li>
                  <li><a href="#">KVKK Başvuru Formu</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="tariff-footer-divider" />
          <div className="tariff-footer-bottom">
            © 2026 Tariff. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>

      {/* ── Selection tooltip ── */}
      {selectionTooltip && (
        <div
          ref={tooltipRef}
          className="tariff-select-tooltip"
          style={{ left: selectionTooltip.x, top: selectionTooltip.y }}
        >
          <span className="tariff-select-tooltip-icon"><TariffAiLogo size={20} /></span>
          <button type="button" className="tariff-select-tooltip-btn" onClick={handleDefine}>
            Tanımla
          </button>
        </div>
      )}

      {/* ── Define overlay card ── */}
      {defineCard && (
        <div
          ref={cardRef}
          className="tariff-define-card-wrap"
          style={{ left: defineCard.x, top: defineCard.y }}
        >
          <div className="tariff-define-card">
            <div className="tariff-define-card-inner">
              <div className="tariff-define-card-header">
                <TariffAiLogo size={20} />
                <span className="tariff-define-card-title">Tariff AI Tanımı</span>
                <button
                  type="button"
                  className="tariff-define-card-close"
                  aria-label="Kapat"
                  onClick={closeDefineCard}
                >
                  <CloseIcon />
                </button>
              </div>

              <span className="tariff-define-card-term">{defineCard.text}</span>

              <div className="tariff-define-card-body">
                {defineCard.loading ? (
                  <div className="tariff-define-card-loading">
                    <span className="tariff-define-card-spinner" />
                    Tanımlanıyor...
                  </div>
                ) : (
                  defineCard.explanation
                )}
              </div>

              {!defineCard.loading && (
                <>
                  <div className="tariff-define-card-footer">
                    <span className="tariff-define-card-footer-label">Bu tanım yardımcı oldu mu?</span>
                    <div className="tariff-define-card-rate-btns">
                      <button
                        type="button"
                        className={`tariff-define-rate-btn ${feedback === 'like' ? 'active-like' : ''}`}
                        aria-label="Beğen"
                        onClick={handleLike}
                      >
                        <ThumbUpIcon />
                      </button>
                      <button
                        type="button"
                        className={`tariff-define-rate-btn ${feedback === 'dislike' ? 'active-dislike' : ''}`}
                        aria-label="Beğenme"
                        onClick={handleDislike}
                      >
                        <ThumbDownIcon />
                      </button>
                    </div>
                  </div>

                  {feedbackOpen && !feedbackSent && (
                    <div className="tariff-define-feedback">
                      <div className="tariff-define-feedback-label">Bu tanımla ilgili geri bildiriminiz nedir?</div>
                      <textarea
                        className="tariff-define-feedback-input"
                        placeholder="Eksik veya hatalı bulduğunuz noktayı yazın..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        autoFocus
                      />
                      <div className="tariff-define-feedback-submit">
                        <button type="button" disabled={!feedbackText.trim()} onClick={handleFeedbackSubmit}>
                          Gönder
                        </button>
                      </div>
                    </div>
                  )}

                  {feedbackSent && (
                    <div className="tariff-define-feedback-thanks">
                      Geri bildiriminiz için teşekkürler!
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TariffLandingPage;

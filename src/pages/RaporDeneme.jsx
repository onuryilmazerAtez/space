import { useState } from "react";
import { useNavigate } from "react-router-dom";

const token = {
  colorPrimary: "#1677ff",
  colorPrimaryHover: "#4096ff",
  colorText: "rgba(0,0,0,0.88)",
  colorTextSecondary: "rgba(0,0,0,0.45)",
  colorTextQuaternary: "rgba(0,0,0,0.25)",
  colorBorder: "#d9d9d9",
  colorBorderSecondary: "#f0f0f0",
  colorBgContainer: "#ffffff",
  colorBgLayout: "#f0f2f5",
  borderRadius: 6,
  borderRadiusLG: 8,
  borderRadiusSM: 4,
  boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)",
  boxShadowSecondary: "0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: 14,
  fontSizeSM: 12,
  fontSizeLG: 16,
  fontSizeHeading2: 30,
  fontWeightStrong: 600,
  controlHeight: 32,
  controlHeightLG: 40,
  lineHeight: 1.5714,
  lineHeightHeading3: 1.3333,
  paddingXS: 8,
  paddingSM: 12,
  padding: 16,
  paddingMD: 20,
  paddingLG: 24,
  paddingXL: 32,
  paddingXXL: 48,
  marginXS: 8,
  marginSM: 12,
  margin: 16,
  marginMD: 20,
  marginLG: 24,
  marginXL: 32,
  marginXXL: 48,
};

/* Lucide-style SVG ikonlar - nötr renkler */
const IconVergi = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconKarsilastirma = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <line x1="10" y1="6.5" x2="14" y2="6.5"/>
    <line x1="10" y1="17.5" x2="14" y2="17.5"/>
  </svg>
);

const IconMüsteri = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconReport = ({ color = "rgba(0,0,0,0.45)" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const REPORT_CARDS = [
  {
    category: "Vergi",
    icon: <IconVergi />,
    title: "Toplu TR Vergi Sorgulama",
    desc: "GTİP şablonunu indirin, doldurun, yükleyin — sistem vergileri otomatik sorgular.",
    route: "/reports?report=vergi",
  },
  {
    category: "Karşılaştırma",
    icon: <IconKarsilastirma />,
    title: "GTİP Karşılaştırma & Ülke Vergi",
    desc: "Türkiye GTİP'lerini seçtiğiniz ülkenin GTİP karşılıklarıyla karşılaştırın.",
    route: "/reports?report=gtip",
  },
  {
    category: "Müşteri",
    icon: <IconMüsteri />,
    title: "Firma Bazlı Eşya Raporu",
    desc: "Firmaya ait eşya kataloğunu toplu görüntüleyin, filtreleyin ve Excel'e aktarın.",
    route: "/reports?report=firma",
  },
];

const RECENT_REPORTS = [
  { category: "Performans", time: "2 sa önce", title: "Ege Bölgesi Sevkiyat Verimi" },
  { category: "Vergi",      time: "Dün",       title: "Yakıt Optimizasyon Özeti" },
  { category: "Müşteri",   time: "3 gün önce", title: "Müşteri Memnuniyet Endeksi" },
];

/* ─── Ortak bileşenler ─── */

function AntButton({ children, type = "default", size = "middle", style: extra, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const height = size === "large" ? token.controlHeightLG : token.controlHeight;

  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, fontFamily: token.fontFamily, fontSize: token.fontSize,
    fontWeight: 400, cursor: "pointer", border: "1px solid transparent",
    borderRadius: token.borderRadius, transition: "all 0.2s",
    height, padding: "0 15px", outline: "none",
    transform: pressed ? "scale(0.98)" : "scale(1)",
  };

  const vars = {
    primary: {
      background: hovered ? token.colorPrimaryHover : token.colorPrimary,
      color: "#fff", borderColor: hovered ? token.colorPrimaryHover : token.colorPrimary,
      boxShadow: "0 2px 0 rgba(5,145,255,0.1)",
    },
    default: {
      background: token.colorBgContainer, color: token.colorText,
      borderColor: token.colorBorder, boxShadow: token.boxShadow,
    },
    link: {
      background: "transparent", color: token.colorPrimary, borderColor: "transparent",
    },
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{ ...base, ...vars[type], ...extra }}
    >
      {children}
    </button>
  );
}

function AntCard({ children, style: extra, hoverable }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        boxShadow: hovered ? token.boxShadowSecondary : token.boxShadow,
        transition: "box-shadow 0.3s, transform 0.3s",
        transform: hoverable && hovered ? "translateY(-2px)" : "translateY(0)",
        ...extra,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Rapor kartı ─── */
function ReportCard({ card }) {
  const navigate = useNavigate();
  return (
    <AntCard hoverable style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "stretch", minHeight: 108 }}>
        {/* İkon alanı */}
        <div style={{
          width: 80, flexShrink: 0,
          background: token.colorBgLayout,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {card.icon}
        </div>

        {/* İçerik */}
        <div style={{
          flex: 1,
          padding: `${token.paddingMD}px ${token.paddingLG}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{
              fontSize: token.fontSizeLG,
              fontWeight: token.fontWeightStrong,
              color: token.colorText,
              lineHeight: token.lineHeightHeading3,
              marginBottom: 4,
              fontFamily: token.fontFamily,
            }}>
              {card.title}
            </div>
            <div style={{
              fontSize: token.fontSize,
              color: token.colorTextSecondary,
              lineHeight: token.lineHeight,
              fontFamily: token.fontFamily,
            }}>
              {card.desc}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: token.paddingSM }}>
            <AntButton type="primary" size="large" onClick={() => navigate(card.route)}>
              {'Oluştur'} <ArrowRight />
            </AntButton>
          </div>
        </div>
      </div>
    </AntCard>
  );
}

/* ─── Sidebar ─── */
function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: token.marginLG }}>

      {/* Raporlar Modülü — Ant Design tarzı kart */}
      <AntCard style={{ padding: 0, overflow: "hidden", boxShadow: "none" }}>
        {/* Başlık */}
        <div style={{
          padding: `${token.paddingSM}px ${token.paddingLG}px`,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: "flex",
          alignItems: "center",
          gap: token.marginSM,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={token.colorTextSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
          </svg>
          <span style={{
            fontFamily: token.fontFamily,
            fontSize: token.fontSize,
            fontWeight: token.fontWeightStrong,
            color: token.colorText,
          }}>
            Raporlar
          </span>
        </div>

        {/* Alt içerik */}
        <div style={{ padding: token.paddingLG }}>
          <div style={{
            fontSize: token.fontSize,
            color: token.colorTextSecondary,
            lineHeight: token.lineHeight,
            marginBottom: token.margin,
            fontFamily: token.fontFamily,
          }}>
            Rapor şablonları ile verilerinizi analiz edin.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "4 rapor türü" },
              { label: "Otomatik sorgulama" },
              { label: "Excel aktarımı" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: token.marginXS,
                fontSize: token.fontSizeSM, color: token.colorTextSecondary,
                fontFamily: token.fontFamily,
              }}>
                <div style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: token.colorTextQuaternary, flexShrink: 0,
                }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </AntCard>

      {/* Son Raporlar */}
      <AntCard style={{ padding: `${token.paddingLG}px ${token.paddingLG}px ${token.paddingSM}px` }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: token.margin,
        }}>
          <span style={{
            fontSize: token.fontSize, fontWeight: token.fontWeightStrong,
            color: token.colorText, fontFamily: token.fontFamily,
          }}>
            Son Raporlar
          </span>
          <AntButton type="link" style={{ height: "auto", padding: 0, fontSize: token.fontSizeSM }} onClick={() => navigate("/reports?tab=myreports")}>
            Tümünü Gör
          </AntButton>
        </div>

        {RECENT_REPORTS.map((r, i) => (
          <div key={i}>
            <div style={{
              display: "flex", alignItems: "center", gap: token.marginSM,
              padding: `${token.paddingSM}px 0`, cursor: "pointer",
              transition: "opacity 0.15s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.6"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              {/* Düz report ikonu */}
              <div style={{
                width: 34, height: 34, borderRadius: token.borderRadius,
                background: token.colorBgLayout,
                border: `1px solid ${token.colorBorderSecondary}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <IconReport color="rgba(0,0,0,0.4)" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: token.fontSize, fontWeight: 500, color: token.colorText,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  fontFamily: token.fontFamily, lineHeight: "20px",
                }}>
                  {r.title}
                </div>
                <span style={{
                  fontSize: token.fontSizeSM, color: token.colorTextQuaternary,
                  fontFamily: token.fontFamily,
                }}>
                  {r.time}
                </span>
              </div>
            </div>
            {i < RECENT_REPORTS.length - 1 && (
              <div style={{ height: 1, background: token.colorBorderSecondary }} />
            )}
          </div>
        ))}
      </AntCard>

      {/* Yönetici Raporu CTA */}
      <AntCard style={{ padding: token.paddingLG, background: "linear-gradient(135deg, #1677ff 0%, #7B2FBE 100%)", border: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
          </svg>
          <div style={{
            fontSize: token.fontSizeLG, fontWeight: token.fontWeightStrong,
            color: "#fff", fontFamily: token.fontFamily,
          }}>
            Yönetici Raporları
          </div>
        </div>
        <div style={{
          fontSize: token.fontSizeSM, color: "rgba(255,255,255,0.75)",
          lineHeight: token.lineHeight, marginBottom: token.margin,
          fontFamily: token.fontFamily,
        }}>
          Üst düzey yönetim için kritik performans ve maliyet metrikleri.
        </div>
        <AntButton style={{ background: "#fff", color: token.colorPrimary, borderColor: "#fff" }} onClick={() => navigate("/reports/kpi")}>
          + Oluştur
        </AntButton>
      </AntCard>
    </aside>
  );
}

/* ─── Ana içerik ─── */
function MainContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: token.marginXL }}>
      <div>
        <h1 style={{
          fontFamily: token.fontFamily,
          fontSize: token.fontSizeHeading2,
          fontWeight: token.fontWeightStrong,
          color: token.colorText,
          lineHeight: 1.2667,
          margin: 0,
          marginBottom: 4,
        }}>
          Rapor Oluştur
        </h1>
        <p style={{
          fontFamily: token.fontFamily,
          fontSize: token.fontSize,
          color: token.colorTextSecondary,
          margin: 0,
        }}>
          Hazır raporlar arasından seçin.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: token.margin }}>
        {REPORT_CARDS.map((card, i) => (
          <ReportCard key={i} card={card} />
        ))}
      </div>
    </div>
  );
}

/* ─── Root ─── */
export default function App() {
  return (
    <div style={{
      fontFamily: token.fontFamily,
      color: token.colorText,
      background: token.colorBgLayout,
      minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
      `}</style>

      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: `${token.paddingXXL}px ${token.paddingXL}px`,
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: token.marginXL,
        alignItems: "start",
      }}>
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

import React, { useState } from 'react';
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

const TariffLandingPage = () => {
  const [activeSegment, setActiveSegment] = useState('export');

  return (
    <div className="tariff-landing">

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
    </div>
  );
};

export default TariffLandingPage;

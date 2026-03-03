import { useState, useRef, useEffect } from "react";
import { FileText, Link2, ImageIcon, Plus, X } from "lucide-react";
import AIActionIndicator2 from "../components/AIActionIndicator2";

/* ── Design System ────────────────────────────────────────── */
const ds = {
    colors: {
        primary: "#1a73e8",
        primaryHover: "#1557b0",
        background: "#f8f9ff",
        surface: "#ffffff",
        surfaceHover: "#f1f3f4",
        text: "#202124",
        textSecondary: "#5f6368",
        textMuted: "#9aa0a6",
        border: "#dadce0",
        tagBg: "#e8f0fe",
        tagText: "#1a73e8",
        purpleIconBg: "#e8eaf6",
        greenIconBg: "#e6f4ea",
        blueIconBg: "#e8f0fe",
        sidebarBg: "#f1f3f4",
        sidebarBorder: "#e0e0e0",
    },
    fonts: { family: "'Inter', 'Google Sans', sans-serif" },
    radius: { sm: "8px", md: "8px", lg: "8px", full: "999px" },
    shadow: {
        card: "0 1px 3px rgba(60,64,67,0.12), 0 1px 2px rgba(60,64,67,0.08)",
        cardHover: "0 4px 12px rgba(60,64,67,0.15), 0 2px 4px rgba(60,64,67,0.10)",
        selected: "0 2px 8px rgba(26,115,232,0.2)",
    },
};

/* ── Tariff AI Logo (header / home screen) ────────────────── */
const TariffAiLogo = ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="17" height="17" rx="4" fill="#ea4335" />
        <rect x="31" y="8" width="17" height="17" rx="4" fill="#fbbc04" />
        <rect x="8" y="31" width="17" height="17" rx="4" fill="#34a853" />
        <rect x="31" y="31" width="17" height="17" rx="4" fill="#1a73e8" />
        <circle cx="28" cy="28" r="5" fill="white" />
        <path d="M28 22L28.8 25.2H32L29.6 27.1L30.4 30.3L28 28.4L25.6 30.3L26.4 27.1L24 25.2H27.2L28 22Z" fill="#1a73e8" />
    </svg>
);

/* ── AI Response Icon (user-provided: purple→blue gradient cross + sparkles) ── */
const AiResponseIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="rg1" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="rg2" x1="100" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <clipPath id="topHalf"><rect x="0" y="0" width="100" height="50" /></clipPath>
            <clipPath id="botHalf"><rect x="0" y="50" width="100" height="50" /></clipPath>
        </defs>

        {/* Band ↙ bottom half — behind */}
        <rect x="39" y="-8" width="22" height="116" rx="11" transform="rotate(45 50 50)" fill="url(#rg2)" clipPath="url(#botHalf)" />
        {/* Band ↘ — full (in the middle layer) */}
        <rect x="39" y="-8" width="22" height="116" rx="11" transform="rotate(-45 50 50)" fill="url(#rg1)" />
        {/* Band ↙ top half — in front */}
        <rect x="39" y="-8" width="22" height="116" rx="11" transform="rotate(45 50 50)" fill="url(#rg2)" clipPath="url(#topHalf)" />

        {/* Purple sparkle — top-left */}
        <path d="M23 11 C23 17.5 17 22 17 22 C17 22 23 26.5 23 33 C23 26.5 29 22 29 22 C29 22 23 17.5 23 11Z" fill="#a855f7" />
        {/* Blue sparkle — bottom-right */}
        <path d="M77 67 C77 73.5 71 78 71 78 C71 78 77 82.5 77 89 C77 82.5 83 78 83 78 C83 78 77 73.5 77 67Z" fill="#3b82f6" />
    </svg>
);

/* ── Icons ────────────────────────────────────────────────── */
const ClassifyIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 6h7l2 2h7v14H6V6z" stroke="#3949ab" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        <path d="M10 15l2.5 2.5L18 11" stroke="#3949ab" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const TaxIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="3" stroke="#34a853" strokeWidth="1.8" fill="none" />
        <path d="M9 11h4M9 14h6M9 17h3" stroke="#34a853" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M17 13l2 2-2 2" stroke="#34a853" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const GlobeIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="9" stroke="#1a73e8" strokeWidth="1.8" />
        <ellipse cx="14" cy="14" rx="5" ry="9" stroke="#1a73e8" strokeWidth="1.8" />
        <path d="M5 14h18" stroke="#1a73e8" strokeWidth="1.8" />
    </svg>
);
const CheckIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="10" stroke="#1a73e8" strokeWidth="1.5" />
        <path d="M6.5 11L9.5 14L15.5 8" stroke="#1a73e8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const SendIcon = ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 9L16 9M16 9L10 3M16 9L10 15" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 3v12M3 9h12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);
const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6l4 4 4-4" stroke="#5f6368" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const TurkeyFlag = () => (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
        <rect width="20" height="14" rx="2" fill="#E30A17" />
        <circle cx="8" cy="7" r="3.2" fill="white" />
        <circle cx="9" cy="7" r="2.4" fill="#E30A17" />
        <path d="M12.5 5.5l1.2 3.5-3-2.2h3.7l-3 2.2z" fill="white" />
    </svg>
);
const CollapseIcon = ({ flipped }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ transform: flipped ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>
        <path d="M11 4L6 9L11 14" stroke="#5f6368" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const ChatHistoryIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 3h12v8H9l-3 2v-2H2V3z" stroke="#5f6368" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
    </svg>
);
const ChevronRightSmall = ({ expanded }) => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.25s" }}>
        <path d="M4 2l4 4-4 4" stroke="#9aa0a6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ── Mock AI responses ────────────────────────────────────── */
// Steps use AIActionIndicator format: { label, meta, status }
const THINKING_STEPS = {
    hs: [
        { label: "Extracting features", meta: "electric refrigerator freezer household compression type", status: "done", arguments: { query: "electric refrigerator freezer household", type: "feature_extraction" }, result: { features: ["electric", "refrigerator", "freezer", "household", "compression"], confidence: 0.97 } },
        { label: "Finding classification code", meta: '"code": "8418"', status: "done", arguments: { features: ["electric", "refrigerator", "freezer"], nomenclature: "hs" }, result: { code: "8418", description: "Refrigerators, freezers and other refrigerating or freezing equipment", confidence: 0.95 } },
        { label: "Looking up heading", meta: '"heading": "84.18"', status: "done", arguments: { code: "8418" }, result: { heading: "84.18", notes: "Chapter 84 — Machinery", subheadings: ["8418.10", "8418.21", "8418.30"] } },
        { label: "Applying target nomenclature", meta: '"nomenclature": "tr"', status: "done", arguments: { heading: "84.18", target: "TR" }, result: { gtip: "8418.21.99.00.00", tariff_rate: "0%", notes: "AB menşeli ürünlerde sıfır tarife" } },
        { label: "Targeting chapter", meta: '"chapter": "84"', status: "done", arguments: { code: "8418" }, result: { chapter: "84", title: "Nuclear reactors, boilers, machinery and mechanical appliances" } },
        { label: "Classification Complete", meta: "Finished processing", status: "active", arguments: { final_code: "8418.21.99.00.00" }, result: { status: "complete", hs_code: "8418", gtip: "8418.21.99.00.00", tariff: "0%", kdv: "20%" } },
    ],
    vergi: [
        { label: "Extracting features", meta: "electric refrigerator freezer household compression type", status: "done", arguments: { query: "refrigerator", type: "feature_extraction" }, result: { features: ["electric", "refrigerator"], confidence: 0.95 } },
        { label: "Finding classification code", meta: '"code": "8418"', status: "done", arguments: { features: ["electric", "refrigerator"] }, result: { code: "8418", confidence: 0.94 } },
        { label: "Looking up heading", meta: '"heading": "84.18"', status: "done", arguments: { code: "8418" }, result: { heading: "84.18" } },
        { label: "Applying target nomenclature", meta: '"nomenclature": "tr"', status: "done", arguments: { heading: "84.18", target: "TR" }, result: { gtip: "8418.21.99.00.00" } },
        { label: "Classification Complete", meta: "Calculated tax rates", status: "active", arguments: { gtip: "8418.21.99.00.00" }, result: { gumruk_vergisi: "0%", kdv: "20%", otv: "Yok", toplam_yuk: "20%" } },
    ],
    ithalat: [
        { label: "Extracting features", meta: "electric refrigerator freezer household compression type", status: "done", arguments: { query: "refrigerator", type: "feature_extraction" }, result: { features: ["electric", "refrigerator"], confidence: 0.95 } },
        { label: "Finding classification code", meta: '"code": "8418"', status: "done", arguments: { features: ["electric", "refrigerator"] }, result: { code: "8418" } },
        { label: "Looking up heading", meta: '"heading": "84.18"', status: "done", arguments: { code: "8418" }, result: { heading: "84.18" } },
        { label: "Applying target nomenclature", meta: '"nomenclature": "tr"', status: "done", arguments: { heading: "84.18", target: "TR" }, result: { gtip: "8418.21.99.00.00" } },
        { label: "Classification Complete", meta: "Found import procedures", status: "active", arguments: { gtip: "8418.21.99.00.00" }, result: { procedures: ["Gumruk beyannamesi", "CE belgesi", "Enerji etiketi"], hat: "Yesil Hat" } },
    ],
    mense: [
        { label: "Extracting features", meta: "electric refrigerator freezer household compression type", status: "done", arguments: { query: "refrigerator", type: "feature_extraction" }, result: { features: ["electric", "refrigerator"], confidence: 0.95 } },
        { label: "Finding classification code", meta: '"code": "8418"', status: "done", arguments: { features: ["electric", "refrigerator"] }, result: { code: "8418" } },
        { label: "Looking up heading", meta: '"heading": "84.18"', status: "done", arguments: { code: "8418" }, result: { heading: "84.18" } },
        { label: "Applying target nomenclature", meta: '"nomenclature": "tr"', status: "done", arguments: { heading: "84.18", target: "TR" }, result: { gtip: "8418.21.99.00.00" } },
        { label: "Classification Complete", meta: "Origin certificate matched", status: "active", arguments: { gtip: "8418.21.99.00.00", origin: "DE" }, result: { certificate: "EUR.1", eligible_for: "Tercihli tarife", rate: "0%" } },
    ],
    default: [
        { label: "Extracting features", meta: "electric refrigerator freezer household compression type", status: "done", arguments: { query: "item", type: "feature_extraction" }, result: { features: ["electric", "device"], confidence: 0.9 } },
        { label: "Finding classification code", meta: '"code": "8418"', status: "done", arguments: { features: ["electric", "device"] }, result: { code: "8418" } },
        { label: "Looking up heading", meta: '"heading": "84.18"', status: "done", arguments: { code: "8418" }, result: { heading: "84.18" } },
        { label: "Applying target nomenclature", meta: '"nomenclature": "tr"', status: "done", arguments: { heading: "84.18", target: "TR" }, result: { gtip: "8418.21.99.00.00" } },
        { label: "Targeting chapter", meta: '"chapter": "84"', status: "done", arguments: { code: "8418" }, result: { chapter: "84" } },
        { label: "Classification Complete", meta: "Analysis finished", status: "active", arguments: { final_code: "8418.21.99.00.00" }, result: { status: "complete", hs_code: "8418", gtip: "8418.21.99.00.00" } },
    ],
};

const AI_ANSWERS = {
    hs: `<strong>HS Kodu (Harmonize Sistem) — Kapsamlı Rehber</strong><br/><br/>
HS Kodu, uluslararası ticarette ürünlerin sınıflandırılması için kullanılan standart bir kodlama sistemidir. Dünya Gümrük Örgütü (WCO) tarafından 1988 yılında geliştirilmiş olup, bugün dünya ticaretinin <strong>%98'inden fazlası</strong> bu sistem üzerinden sınıflandırılmaktadır.<br/><br/>
<strong>Yapısı ve Hiyerarşisi:</strong>
<ul>
<li>İlk <strong>2 hane</strong>: Fasıl (Chapter) — genel ürün kategorisi</li>
<li>İlk <strong>4 hane</strong>: Pozisyon (Heading) — daha detaylı gruplandırma</li>
<li>İlk <strong>6 hane</strong>: Alt Pozisyon (Subheading) — uluslararası standart seviye</li>
<li>Türkiye'de <strong>GTİP</strong> olarak <strong>12 haneye</strong> genişletilir ve bu sayede ürün bazında spesifik vergi oranları belirlenir</li>
</ul><br/>
<strong>Önemli Noktalar:</strong>
<ul>
<li>İlk 6 hane tüm dünyada ortaktır ve değiştirilemez</li>
<li>Sonraki haneler ülkelerin kendi iç düzenlemelerine göre belirlenir</li>
<li>Yanlış sınıflandırma ciddi cezai yaptırımlara neden olabilir</li>
<li>Bağlayıcı Tarife Bilgisi (BTB) alınarak sınıflandırma güvence altına alınabilir</li>
<li>Sınıflandırma yorumu için Genel Yorum Kuralları (GYK 1-6) uygulanır</li>
</ul><br/>
<strong>Sık Kullanılan Fasıllar:</strong>
<ol>
<li><code>Fasıl 84</code> — Makineler ve mekanik cihazlar</li>
<li><code>Fasıl 85</code> — Elektrikli makine ve cihazlar</li>
<li><code>Fasıl 61-62</code> — Tekstil ve giyim eşyası</li>
<li><code>Fasıl 39</code> — Plastik ve mamulleri</li>
<li><code>Fasıl 73</code> — Demir ve çelikten eşya</li>
</ol><br/>
Örneğin: <code>8471.30.00.00.00</code> — Dizüstü bilgisayarlar (ağırlığı 10 kg'ı geçmeyen taşınabilir otomatik bilgi işlem makineleri) için kullanılır. Bu kodun gümrük vergisi oranı AB menşeli ürünlerde <strong>%0</strong>, diğer ülkelerden ithalatta ise <strong>%2</strong> olarak uygulanmaktadır.`,

    vergi: `<strong>Gümrük Vergisi Hesaplama — Detaylı Kılavuz</strong><br/><br/>
Gümrük vergisi hesaplaması, ithal edilen malların ülkeye girişinde uygulanan mali yükümlülüklerin belirlenmesi sürecidir. Doğru hesaplama için birçok faktörün dikkate alınması gerekmektedir.<br/><br/>
<strong>Temel Hesaplama Formülü:</strong>
<ul>
<li><strong>CIF Değer</strong> = Mal Bedeli (FOB) + Navlun (Freight) + Sigorta (Insurance)</li>
<li><strong>Gümrük Vergisi</strong> = CIF Değer × İlgili Vergi Oranı</li>
<li><strong>KDV Matrahı</strong> = CIF Değer + Gümrük Vergisi + Diğer Vergiler</li>
<li><strong>KDV</strong> = KDV Matrahı × %20 (standart oran)</li>
</ul><br/>
<strong>Ek Vergiler ve Fonlar:</strong>
<ul>
<li><strong>İlave Gümrük Vergisi (İGV)</strong>: Bazı ürünlerde ek koruma amaçlı uygulanır</li>
<li><strong>Toplu Konut Fonu (TKF)</strong>: Belirli tarım ürünlerinde tahsil edilir</li>
<li><strong>Anti-Damping Vergisi</strong>: Piyasanın altında fiyatla satılan ithal mallara uygulanır</li>
<li><strong>Telafi Edici Vergi</strong>: Sübvansiyonlu mallara karşı uygulanan önlem</li>
<li><strong>ÖTV</strong>: Otomobil, alkol, tütün gibi ürünlerde ek vergi</li>
</ul><br/>
<strong>Örnek Hesaplama (Elektronik Ürün):</strong><br/>
Mal Bedeli: $10.000 | Navlun: $500 | Sigorta: $100<br/>
<code>CIF = $10.600</code><br/>
<code>Gümrük Vergisi (%2) = $212</code><br/>
<code>KDV Matrahı = $10.812</code><br/>
<code>KDV (%20) = $2.162,40</code><br/>
<code>Toplam Maliyet = $12.974,40</code><br/><br/>
<strong>Muafiyetler:</strong> AB, EFTA, Güney Kore gibi serbest ticaret anlaşması olan ülkelerden yapılan ithalatlarda EUR.1 veya A.TR belgesi ile vergi indirimi ya da muafiyeti sağlanabilir.`,

    ithalat: `<strong>İthalat Prosedürleri — Adım Adım Rehber</strong><br/><br/>
Türkiye'de ithalat işlemleri, birçok kurumsal ve yasal süreçten oluşan kapsamlı bir prosedür gerektirmektedir.<br/><br/>
<strong>Ön Hazırlık Aşaması:</strong>
<ol>
<li><strong>İthalatçı firma kaydı</strong> — Ticaret Bakanlığı'na kayıt ve vergi numarası alınması</li>
<li><strong>Proforma fatura</strong> ile sipariş onayı ve ödeme şeklinin belirlenmesi</li>
<li><strong>Akreditif, vesaik mukabili</strong> veya peşin ödeme yönteminin seçimi</li>
<li><strong>GTİP tespiti</strong> — ürünün doğru sınıflandırılması</li>
</ol><br/>
<strong>Gümrükleme Aşaması:</strong>
<ol>
<li><strong>Gümrük beyannamesi</strong> (Detaylı Beyan) hazırlanması</li>
<li><strong>Gerekli belgeler:</strong> Fatura, konşimento/AWB, çeki listesi, menşe şahadetnamesi, uygunluk belgesi</li>
<li><strong>Muayene ve kontrol</strong> — kırmızı, sarı, yeşil, mavi hat uygulaması</li>
<li><strong>Vergi ve harçların ödenmesi</strong> — gümrük vergisi, KDV, varsa diğer fonlar</li>
<li><strong>Malların teslim alınması</strong> ve antrepo çıkışı</li>
</ol><br/>
<strong>Muayene Hatları:</strong>
<ul>
<li><strong>Kırmızı Hat:</strong> Fiziki muayene + belge kontrolü</li>
<li><strong>Sarı Hat:</strong> Sadece belge kontrolü</li>
<li><strong>Yeşil Hat:</strong> Doğrudan teslim, sonradan kontrol</li>
<li><strong>Mavi Hat:</strong> Teslim sonrası sonradan kontrol (yetkilendirilmiş firma)</li>
</ul><br/>
<strong>Dikkat Edilmesi Gerekenler:</strong>
<ul>
<li>Bazı ürünlerde ithalat izni veya gözetim belgesi gerekebilir</li>
<li>Tarım ürünlerinde bitki sağlığı sertifikası zorunludur</li>
<li>CE işareti gerektiren ürünlerde uygunluk değerlendirmesi yapılmalıdır</li>
<li>TAREKS (Tek Pencere Sistemi) üzerinden başvuru yapılmalıdır</li>
</ul>`,

    mense: `<strong>Menşe Şahadetnamesi — Detaylı Bilgi</strong><br/><br/>
Menşe şahadetnamesi, bir malın üretildiği, imal edildiği veya işlendiği ülkeyi resmi olarak belgeleyen dokümandır. Uluslararası ticarette gümrük vergisi oranlarının belirlenmesi ve ticaret politikası önlemlerinin uygulanmasında kritik öneme sahiptir.<br/><br/>
<strong>Menşe Türleri:</strong>
<ul>
<li><strong>Tercihli Menşe:</strong> Serbest Ticaret Anlaşmaları (STA) kapsamında indirimli veya sıfır gümrük vergisi uygulaması sağlar</li>
<li><strong>Tercihsiz Menşe:</strong> Anti-damping, kota, gözetim ve ambargo gibi ticaret politikası önlemlerinin uygulanmasında kullanılır</li>
</ul><br/>
<strong>Dolaşım Belgeleri:</strong>
<ul>
<li><strong>EUR.1:</strong> STA imzalanan ülkelerle ticarette tercihli menşe ispatı için kullanılır</li>
<li><strong>A.TR:</strong> Türkiye-AB Gümrük Birliği kapsamında serbest dolaşım belgesi (sanayi ürünleri ve işlenmiş tarım ürünleri için)</li>
<li><strong>EUR-MED:</strong> Pan-Avrupa-Akdeniz kümülasyon sistemi kapsamında kullanılır</li>
<li><strong>Form A:</strong> Genelleştirilmiş Tercihler Sistemi (GTS) kapsamında gelişmekte olan ülkeler için</li>
</ul><br/>
<strong>Menşe Kuralları:</strong>
<ul>
<li><strong>Tamamen elde edilmiş ürünler:</strong> Tek bir ülkede tamamen üretilmiş (tarım, maden vb.)</li>
<li><strong>Yeterli işçilik/işlem:</strong> Hammaddenin yeterince dönüştürülmesi (tarife değişikliği, katma değer kuralı)</li>
<li><strong>Kümülasyon:</strong> Birden fazla ülkedeki işlemlerin birleştirilmesi</li>
</ul><br/>
Türkiye'de menşe şahadetnameleri <strong>Ticaret ve Sanayi Odaları</strong> tarafından, dolaşım belgeleri ise <strong>Gümrük İdareleri</strong> tarafından düzenlenir ve onaylanır.`,

    powerbank: `<strong>Powerbank GTİP Kodu ve İthalat Bilgileri: 8507.60</strong><br/><br/>
Lityum-iyon akümülatörler (powerbank / taşınabilir şarj cihazları) için kullanılan bu GTİP kodu kapsamında detaylı bilgiler:<br/><br/>
<strong>Vergi Oranları:</strong>
<ul>
<li>Gümrük vergisi oranı: <strong>%0</strong> (AB menşeli) / <strong>%3.7</strong> (diğer ülkeler)</li>
<li>KDV: <strong>%20</strong></li>
<li>ÖTV: Uygulanmaz</li>
<li>İlave Gümrük Vergisi: Uygulanmaz</li>
</ul><br/>
<strong>Teknik Gereklilikler:</strong>
<ul>
<li><strong>CE belgesi</strong> zorunludur (LVD ve EMC direktifleri)</li>
<li><strong>UN38.3 test raporu</strong> — lityum pil güvenlik testi</li>
<li><strong>MSDS (Malzeme Güvenlik Bilgi Formu)</strong> — taşıma için gerekli</li>
<li>Kapasite sınırı: Uçakta taşıma için max <strong>100Wh</strong> (özel izinle 160Wh)</li>
</ul><br/>
<strong>İthalat Sürecinde Dikkat Edilecekler:</strong>
<ul>
<li>Tehlikeli madde sınıfı: <strong>Sınıf 9</strong> (lityum piller)</li>
<li>IATA DGR kurallarına uygun ambalajlama</li>
<li>Garanti belgesi düzenlenmesi zorunludur (Sanayi Bakanlığı)</li>
<li>TSE uygunluk belgesi gerekebilir</li>
</ul>`,

    sac: `<strong>Saç Düzleştirici GTİP ve İthalat Bilgileri: 8516.32</strong><br/><br/>
Elektrikli saç kıvırma veya düzleştirme aletleri kapsamında detaylı bilgiler:<br/><br/>
<strong>Vergi Oranları:</strong>
<ul>
<li>Gümrük vergisi oranı: <strong>%6.5</strong> (MFN) / <strong>%0</strong> (AB menşeli)</li>
<li>KDV: <strong>%20</strong></li>
<li>ÖTV: Uygulanmaz</li>
</ul><br/>
<strong>Zorunlu Belgeler:</strong>
<ul>
<li><strong>CE belgesi</strong> zorunludur — Düşük Voltaj Direktifi (LVD 2014/35/EU)</li>
<li><strong>EMC uygunluk</strong> — Elektromanyetik Uyumluluk Direktifi (2014/30/EU)</li>
<li><strong>Garanti belgesi</strong> — minimum 2 yıl</li>
<li><strong>Türkçe kullanım kılavuzu</strong> — tüketici ürünü olarak zorunlu</li>
<li><strong>Enerji etiketi</strong> — belirli güç aralıklarında gerekli olabilir</li>
</ul><br/>
<strong>Gümrükleme Sürecinde Dikkat:</strong>
<ul>
<li>TAREKS üzerinden uygunluk başvurusu yapılmalıdır</li>
<li>220V-240V / 50Hz uyumlu olmalıdır (Türkiye standartları)</li>
<li>Ambalajda CE işareti, üretici bilgisi ve seri numarası bulunmalıdır</li>
</ul>`,

    canta: `<strong>Deri Laptop Çantası GTİP ve İthalat Bilgileri: 4202.12</strong><br/><br/>
Dış yüzeyi deri, suni deri veya rugan kaplı bavul, çanta ve benzeri kaplar, bu fasıl kapsamında sınıflandırılır.<br/><br/>
<strong>Vergi Oranları:</strong>
<ul>
<li>Gümrük vergisi oranı: <strong>%3.7</strong> (MFN) / <strong>%0</strong> (AB menşeli)</li>
<li>KDV: <strong>%20</strong></li>
<li>İlave Gümrük Vergisi: Bazı menşe ülkeleri için <strong>%30'a</strong> kadar uygulanabilir</li>
</ul><br/>
<strong>Sınıflandırma Detayları:</strong>
<ul>
<li><code>4202.12.11</code> — İş çantaları, evrak çantaları</li>
<li><code>4202.12.19</code> — Diğer (laptop çantaları dahil)</li>
<li><code>4202.12.50</code> — Dış yüzeyi plastik veya tekstilden olanlar</li>
</ul><br/>
<strong>Dikkat Edilmesi Gerekenler:</strong>
<ul>
<li>CITES kapsamındaki hayvan derilerinden yapılmış ürünlerde ithalat izni gerekir</li>
<li>Menşe belgesi ile tercihli vergi oranlarından faydalanılabilir</li>
<li>Ürünün dış yüzey malzemesi sınıflandırmayı doğrudan etkiler</li>
<li>Marka taklit ürünlerde fikri mülkiyet hakları gümrükte kontrol edilir</li>
</ul>`,
};

function getTopicKey(text) {
    const l = text.toLowerCase();
    if (l.includes("powerbank") || l.includes("güç bank")) return "powerbank";
    if (l.includes("saç") || l.includes("düzleştir")) return "sac";
    if (l.includes("çanta") || l.includes("laptop çanta")) return "canta";
    if (l.includes("hs") || l.includes("kod") || l.includes("gtip") || l.includes("sınıflandır")) return "hs";
    if (l.includes("vergi") || l.includes("hesap") || l.includes("kdv") || l.includes("ücret")) return "vergi";
    if (l.includes("ithal") || l.includes("prosedür") || l.includes("adım")) return "ithalat";
    if (l.includes("menşe") || l.includes("şahadet") || l.includes("eur") || l.includes("a.tr")) return "mense";
    return "default";
}

function getAiResponse(text) {
    const key = getTopicKey(text);
    return AI_ANSWERS[key] || `<strong>"${text}"</strong> hakkında bilgi getiriliyor…<br/><br/>Gümrük tarifeleri, HS kodları, ithalat prosedürleri veya menşe belgeleri konularında yardımcı olabilirim. Lütfen daha spesifik bir soru sorun.`;
}

/* ThinkingBlock and LiveThinking replaced by AIActionIndicator */

/* ── Chat sidebar ─────────────────────────────────────────── */
function ChatSidebar({ collapsed, onCollapse, sessions, activeId, onNew, onSelect }) {
    return (
        <div style={{ width: collapsed ? 0 : 220, minWidth: collapsed ? 0 : 220, height: "100%", background: ds.colors.sidebarBg, borderRight: collapsed ? "none" : `1px solid ${ds.colors.sidebarBorder}`, display: "flex", flexDirection: "column", overflow: "hidden", transition: "width 0.3s, min-width 0.3s", flexShrink: 0 }}>
            {!collapsed && (
                <>
                    {/* New chat button */}
                    <div style={{ padding: "14px 12px 10px" }}>
                        <button
                            onClick={onNew}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: ds.radius.sm, background: ds.colors.primary, color: "white", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: ds.fonts.family, boxShadow: "0 1px 4px rgba(26,115,232,0.3)" }}
                        >
                            <PlusIcon /> Yeni Sohbet
                        </button>
                    </div>

                    {/* History label */}
                    <div style={{ padding: "6px 16px 4px", fontSize: 11, fontWeight: 600, color: ds.colors.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Geçmiş
                    </div>

                    {/* Sessions list */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px" }}>
                        {sessions.length === 0 && (
                            <div style={{ padding: "12px 8px", fontSize: 12, color: ds.colors.textMuted }}>Henüz sohbet yok</div>
                        )}
                        {sessions.map(s => (
                            <button
                                key={s.id}
                                onClick={() => onSelect(s.id)}
                                style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: ds.radius.sm, background: activeId === s.id ? "#e8f0fe" : "transparent", border: "none", cursor: "pointer", fontSize: 13, color: activeId === s.id ? ds.colors.primary : ds.colors.text, fontFamily: ds.fonts.family, marginBottom: 2, transition: "background 0.15s" }}
                                onMouseEnter={e => { if (activeId !== s.id) e.currentTarget.style.background = "#e8eaf6"; }}
                                onMouseLeave={e => { if (activeId !== s.id) e.currentTarget.style.background = "transparent"; }}
                            >
                                <ChatHistoryIcon />
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{s.title}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}



// ─── SHARE REPORT MODAL COMPONENT ─────────────────────────────
const ShareReportModal = ({ onClose }) => {
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`;
        }
    };

    const isEmailValid = email.trim().length > 0 && email.includes("@");

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, zIndex: 9999,
            background: "transparent",
        }}>
            <div style={{
                background: "#ffffff",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "520px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}>
                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 24px 16px", borderBottom: "1px solid #e5e7eb"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Rapor Olarak Paylaş</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button
                            onClick={handleCopy}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                background: "none", border: "none", cursor: "pointer",
                                color: "#2563EB", fontSize: 13.5, fontWeight: 500, padding: 0
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            {copied ? "Kopyalandı!" : "Bağlantıyı Kopyala"}
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "#9ca3af", padding: 4, display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "color 0.15s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = "#4b5563"}
                            onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: "24px" }}>
                    <div style={{
                        background: "#f3f4f6", borderRadius: "10px", padding: "24px",
                        display: "flex", flexDirection: "column"
                    }}>
                        {/* Recipient */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#111827", marginBottom: 8 }}>
                                Alıcı
                            </label>
                            <div style={{ display: "flex", gap: 12 }}>
                                <input
                                    type="email"
                                    placeholder="example@example.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    style={{
                                        flex: 1, height: 44, background: "#ffffff", border: "1px solid #e5e7eb",
                                        borderRadius: "8px", padding: "0 14px", fontSize: 14, color: "#111827",
                                        outline: "none", boxSizing: "border-box"
                                    }}
                                />
                                <button
                                    disabled={!isEmailValid}
                                    style={{
                                        height: 44, padding: "0 24px", background: "#2563EB", border: "none",
                                        borderRadius: "8px", color: "#ffffff", fontSize: 14, fontWeight: 600,
                                        cursor: isEmailValid ? "pointer" : "not-allowed",
                                        opacity: isEmailValid ? 1 : 0.5, transition: "opacity 0.2s, background 0.15s",
                                        boxSizing: "border-box"
                                    }}
                                    onMouseEnter={e => { if (isEmailValid) e.currentTarget.style.background = "#1d4ed8"; }}
                                    onMouseLeave={e => { if (isEmailValid) e.currentTarget.style.background = "#2563EB"; }}
                                    onClick={() => {
                                        alert(`Rapor şuraya gönderildi: ${email}`);
                                        onClose();
                                    }}
                                >
                                    Paylaş
                                </button>
                            </div>
                        </div>

                        {/* Optional Message */}
                        <div>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#111827", marginBottom: 8, marginTop: 16 }}>
                                İsteğe Bağlı Mesaj
                            </label>
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={handleMessageChange}
                                placeholder="Autosize height based on content lines"
                                style={{
                                    width: "100%", minHeight: 100, background: "#ffffff", border: "1px solid #e5e7eb",
                                    borderRadius: "8px", padding: "12px 14px", fontSize: 14, color: "#111827",
                                    outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
                                    lineHeight: 1.5,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Main page component ──────────────────────────────────── */
const SCREENS = { HOME: "home", CHAT: "chat" };

let sessionCounter = 1;

export default function TariffAiPage() {
    const [screen, setScreen] = useState(SCREENS.HOME);
    const [selectedTool, setSelectedTool] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [thinkingSteps, setThinkingSteps] = useState([]);
    const [inputCollapsed, setInputCollapsed] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [linkInputVisible, setLinkInputVisible] = useState(false);
    const [linkValue, setLinkValue] = useState("");
    const [attachedFiles, setAttachedFiles] = useState([]);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const handleAttachPdf = () => {
        setShowAttachMenu(false);
        fileInputRef.current?.click();
    };

    const handleAttachImage = () => {
        setShowAttachMenu(false);
        imageInputRef.current?.click();
    };

    const handleAttachLink = () => {
        setShowAttachMenu(false);
        setLinkInputVisible(true);
    };

    const handleAddLink = () => {
        if (linkValue.trim()) {
            setAttachedFiles(prev => [...prev, { name: linkValue.trim(), type: "link" }]);
            setLinkValue("");
            setLinkInputVisible(false);
        }
    };

    const handleFileChange = (e, type) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(f => {
                setAttachedFiles(prev => [...prev, { name: f.name, type }]);
            });
        }
        e.target.value = "";
    };

    const removeAttachedFile = (index) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);

    const tools = [
        { id: "classify", icon: <ClassifyIcon />, iconBg: ds.colors.purpleIconBg, title: "Sınıflandırma", desc: "Eşya kodu sınıflandırma ve arama odaklı", tag: null },
        { id: "tax", icon: <TaxIcon />, iconBg: ds.colors.greenIconBg, title: "Vergi Hesaplama", desc: "İthalat vergileri ve ücretleri hesaplayın", tag: "Sadece TR" },
    ];

    const exampleQuestions = [
        "Saç düzleştirici tarifesi nedir?",
        "Powerbank GTİP'i nedir?",
        "Deri laptop çantasını sınıflandır",
    ];

    function startNewChat(toolId) {
        const id = sessionCounter++;
        const tool = tools.find(t => t.id === (toolId || selectedTool));
        const title = tool ? tool.title : "Yeni Sohbet";
        const newSession = { id, title: `${title} #${id}` };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(id);
        setMessages([]);
        setInput("");
        setScreen(SCREENS.CHAT);
    }

    function handleNewChat() {
        setSelectedTool(null);
        startNewChat(null);
    }

    const streamRef = useRef(null);

    function sendMessage(text) {
        if (!text.trim() || isThinking) return;
        const userMsg = { role: "user", content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsThinking(true);

        const key = getTopicKey(text);
        const steps = THINKING_STEPS[key] || THINKING_STEPS.default;
        setThinkingSteps(steps);

        const fullContent = getAiResponse(text);

        // Split HTML into streamable segments
        const segments = fullContent.split(/(?=<br\/>|<ul>|<ol>|<li>|<\/ul>|<\/ol>|<strong>|<code>)/gi).filter(Boolean);

        // Add AI message immediately with empty content + streaming flag
        const aiMsgIndex = { current: null };
        setMessages(prev => {
            aiMsgIndex.current = prev.length;
            return [...prev, { role: "ai", content: "", thinkingSteps: steps, streaming: true }];
        });

        let revealed = 0;
        const baseDelay = 80;  // ms per segment
        const startDelay = 300; // wait a bit before starting stream
        const startTime = Date.now();
        const totalThinkingTime = 1200 * steps.length + 800;

        if (streamRef.current) clearInterval(streamRef.current);

        const streamTimer = setTimeout(() => {
            streamRef.current = setInterval(() => {
                revealed++;
                if (revealed <= segments.length) {
                    const partial = segments.slice(0, revealed).join("");
                    setMessages(prev => prev.map((m, idx) =>
                        idx === aiMsgIndex.current ? { ...m, content: partial } : m
                    ));
                } else {
                    clearInterval(streamRef.current);
                    streamRef.current = null;

                    const elapsed = Date.now() - startTime;
                    const remaining = Math.max(0, totalThinkingTime - elapsed);

                    setTimeout(() => {
                        setMessages(prev => prev.map((m, idx) =>
                            idx === aiMsgIndex.current ? { ...m, content: fullContent, streaming: false } : m
                        ));
                        setIsThinking(false);
                        setThinkingSteps([]);
                    }, remaining);
                }
            }, baseDelay);
        }, startDelay);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
    }

    const getCardStyle = (toolId) => {
        const isSelected = selectedTool === toolId;
        const isHovered = hoveredCard === toolId;
        return {
            background: ds.colors.surface, border: `1.5px solid ${isSelected ? ds.colors.primary : ds.colors.border}`,
            borderRadius: ds.radius.md, padding: "28px 24px 20px", cursor: "pointer", position: "relative",
            boxShadow: isSelected ? ds.shadow.selected : isHovered ? ds.shadow.cardHover : ds.shadow.card,
            transition: "all 0.18s ease", flex: 1,
            backgroundColor: isSelected ? "#fafcff" : ds.colors.surface,
        };
    };

    const pageStyle = { height: "100%", flex: 1, margin: 0, padding: 0, background: ds.colors.background, fontFamily: ds.fonts.family, display: "flex", overflow: "hidden" };

    /* ── HOME SCREEN ── */
    if (screen === SCREENS.HOME) {
        return (
            <div style={pageStyle}>
                <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Google+Sans:wght@400;500;600;700&family=Roboto:wght@400;500&display=swap');
          @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
          @keyframes slideIn { from { opacity:0; transform: translateX(12px); } to { opacity:1; transform: translateX(0); } }
          @keyframes spin { to { transform:rotate(360deg); } }
        `}</style>

                {/* Sidebar */}
                <ChatSidebar collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed(c => !c)} sessions={sessions} activeId={activeSessionId} onNew={handleNewChat} onSelect={(id) => { setActiveSessionId(id); setScreen(SCREENS.CHAT); }} />

                {/* Main content */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                    {/* Collapse toggle */}
                    <button
                        onClick={() => setSidebarCollapsed(c => !c)}
                        style={{ position: "absolute", top: 16, left: 16, width: 32, height: 32, borderRadius: ds.radius.sm, border: `1px solid ${ds.colors.border}`, background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: ds.shadow.card }}
                    >
                        <CollapseIcon flipped={sidebarCollapsed} />
                    </button>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 40, textAlign: "center", animation: "fadeIn 0.5s ease" }}>
                        <TariffAiLogo size={56} />
                        <h1 style={{ margin: "16px 0 10px", fontSize: 28, fontWeight: 700, color: ds.colors.text, fontFamily: ds.fonts.family }}>Tariff AI</h1>
                        <p style={{ margin: 0, fontSize: 16, color: ds.colors.textSecondary, maxWidth: 480, lineHeight: 1.6 }}>
                            Tarifeler ve ticaret düzenlemeleri hakkında her şeyi sorabilir veya mevcut araçları kullanabilirsiniz.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: 20, maxWidth: 860, width: "100%", padding: "0 24px" }}>
                        {tools.map(tool => (
                            <div key={tool.id} style={getCardStyle(tool.id)} onClick={() => setSelectedTool(tool.id)} onMouseEnter={() => setHoveredCard(tool.id)} onMouseLeave={() => setHoveredCard(null)}>
                                {selectedTool === tool.id && <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 3, background: "linear-gradient(90deg, #ea4335, #fbbc04, #34a853, #1a73e8)", borderRadius: "0 0 3px 3px" }} />}
                                <div style={{ width: 56, height: 56, borderRadius: ds.radius.sm, background: tool.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>{tool.icon}</div>
                                <div style={{ fontWeight: 600, fontSize: 17, color: ds.colors.text, marginBottom: 6, fontFamily: ds.fonts.family }}>{tool.title}</div>
                                <div style={{ fontSize: 14, color: ds.colors.textSecondary, lineHeight: 1.55 }}>{tool.desc}</div>
                                {tool.tag && <div style={{ display: "inline-block", marginTop: 14, background: ds.colors.tagBg, borderRadius: ds.radius.full, padding: "4px 12px", fontSize: 12, color: ds.colors.tagText, fontWeight: 500 }}>{tool.tag}</div>}
                                {selectedTool === tool.id && <div style={{ position: "absolute", bottom: 14, right: 14 }}><CheckIcon /></div>}
                            </div>
                        ))}

                        {selectedTool && (
                            <div style={{ flex: 1, background: ds.colors.surface, border: `1.5px solid ${ds.colors.border}`, borderRadius: ds.radius.md, padding: "28px 24px", boxShadow: ds.shadow.card, display: "flex", flexDirection: "column", gap: 20, animation: "slideIn 0.2s ease" }}>
                                <div style={{ width: 56, height: 56, borderRadius: ds.radius.sm, background: ds.colors.blueIconBg, display: "flex", alignItems: "center", justifyContent: "center" }}><GlobeIcon /></div>
                                <div>
                                    <div style={{ fontSize: 13, color: ds.colors.textSecondary, fontWeight: 500, marginBottom: 8 }}>Ülke</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: ds.colors.surfaceHover, border: `1px solid ${ds.colors.border}`, borderRadius: ds.radius.sm, padding: "10px 14px", cursor: "pointer" }}>
                                        <TurkeyFlag /><span style={{ flex: 1, fontSize: 14, color: ds.colors.text }}>Türkiye</span><ChevronDown />
                                    </div>
                                </div>
                                <button
                                    onClick={() => startNewChat(selectedTool)}
                                    style={{ background: ds.colors.primary, color: "white", border: "none", borderRadius: ds.radius.sm, padding: "13px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: ds.fonts.family, boxShadow: "0 1px 4px rgba(26,115,232,0.3)" }}
                                    onMouseEnter={e => e.currentTarget.style.background = ds.colors.primaryHover}
                                    onMouseLeave={e => e.currentTarget.style.background = ds.colors.primary}
                                >
                                    <SendIcon color="white" /> Sohbete Başla
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    /* ── CHAT SCREEN ── */
    return (
        <div style={pageStyle}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Roboto:wght@400;500&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .chat-scroll::-webkit-scrollbar { width:6px; }
        .chat-scroll::-webkit-scrollbar-thumb { background:#dadce0; border-radius:3px; }
        .tariff-textarea { resize:none; outline:none; font-family:'Inter','Google Sans',sans-serif; }
        .tariff-textarea:focus { border-color: #1a73e8 !important; box-shadow: 0 0 0 2px rgba(26,115,232,0.12); }
        code { background:#f1f3f4; padding:2px 6px; border-radius:4px; font-size:13px; color:#3949ab; }
        strong { color: #202124; }
        ul, ol { padding-left: 20px; margin: 6px 0; }
        li { margin-bottom: 4px; }
      `}</style>

            {/* Left sidebar */}
            <ChatSidebar collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed(c => !c)} sessions={sessions} activeId={activeSessionId} onNew={handleNewChat} onSelect={(id) => { setActiveSessionId(id); setMessages([]); }} />

            {/* Chat area wrapper */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
                {/* Top bar — transparent, no shadow/divider */}
                <div style={{ height: 52, background: "transparent", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0, zIndex: 10, position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {/* Collapse toggle */}
                        <button
                            onClick={() => setSidebarCollapsed(c => !c)}
                            style={{ width: 30, height: 30, borderRadius: ds.radius.sm, border: `1px solid ${ds.colors.border}`, background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginRight: 4 }}
                        >
                            <CollapseIcon flipped={sidebarCollapsed} />
                        </button>
                        <TariffAiLogo size={28} />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: ds.colors.text, fontFamily: ds.fonts.family }}>Tariff AI</div>
                            <div style={{ fontSize: 11, color: ds.colors.textMuted, fontFamily: ds.fonts.family }}>AI Gümrük Asistanı</div>
                        </div>
                    </div>

                    {/* Share button */}
                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setShowShareModal(true)}
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${ds.colors.border}`, borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: 13, color: ds.colors.textSecondary, fontFamily: ds.fonts.family, transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = ds.colors.surfaceHover}
                            onMouseLeave={e => e.currentTarget.style.background = "none"}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                            </svg>
                            Sohbeti Paylaş
                        </button>
                    </div>
                </div>

                {/* Scrollable chat messages */}
                <div className="chat-scroll" style={{ flex: 1, overflowY: "auto", padding: "24px 0" }}>
                    <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px" }}>
                        {messages.length === 0 && !isThinking && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 10, animation: "fadeIn 0.5s ease" }}>
                                <TariffAiLogo size={48} />
                                <div style={{ fontWeight: 600, fontSize: 18, color: ds.colors.text, marginTop: 8 }}>Nasıl yardımcı olabilirim?</div>
                                <div style={{ fontSize: 14, color: ds.colors.textSecondary }}>Tarifeler ve ticaret düzenlemeleri hakkında soru sorun</div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 16 }}>
                                    {exampleQuestions.map(q => (
                                        <button key={q} onClick={() => sendMessage(q)} style={{ background: ds.colors.surface, border: `1px solid ${ds.colors.border}`, borderRadius: ds.radius.full, padding: "7px 16px", fontSize: 13, color: ds.colors.text, cursor: "pointer", fontFamily: ds.fonts.family, boxShadow: ds.shadow.card }}>
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 24, flexDirection: msg.role === "user" ? "row-reverse" : "row", animation: "fadeIn 0.35s ease" }}>
                                <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: msg.role === "user" ? "linear-gradient(135deg,#214F73,#2d6a9f)" : "transparent", color: "white", fontSize: 13, fontWeight: 700, alignSelf: "flex-start" }}>
                                    {msg.role === "user" ? "O" : <AiResponseIcon size={24} />}
                                </div>
                                <div
                                    style={{ maxWidth: "75%", display: "flex", flexDirection: "column" }}
                                    onMouseEnter={e => { const b = e.currentTarget.querySelector('.copy-msg-btn'); if (b) b.style.opacity = '1'; }}
                                    onMouseLeave={e => { const b = e.currentTarget.querySelector('.copy-msg-btn'); if (b && b.dataset.copied !== 'true') b.style.opacity = '0'; }}
                                >
                                    <div
                                        style={{ padding: msg.role === "user" ? "12px 18px" : "10px 4px", borderRadius: msg.role === "user" ? 18 : 0, background: msg.role === "user" ? "linear-gradient(135deg,#214F73,#2d6a9f)" : "transparent", color: msg.role === "user" ? "white" : ds.colors.text, fontSize: 14, lineHeight: 1.75, borderBottomRightRadius: msg.role === "user" ? 4 : 18 }}
                                        dangerouslySetInnerHTML={{ __html: msg.content }}
                                    />
                                    {msg.role === "ai" && msg.thinkingSteps && (
                                        <div style={{ marginTop: 10, display: "flex", alignItems: "flex-start", gap: 16 }}>
                                            <AIActionIndicator2 steps={msg.thinkingSteps} interval={msg.streaming ? 1200 : 1} />
                                            {!msg.streaming && (
                                                <button
                                                    className="copy-msg-btn"
                                                    id={`copy-btn-${i}`}
                                                    onClick={() => {
                                                        const txt = msg.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                                                        navigator.clipboard.writeText(txt);
                                                        const btn = document.getElementById(`copy-btn-${i}`);
                                                        if (btn) {
                                                            btn.dataset.copied = "true";
                                                            btn.style.opacity = "1";
                                                            btn.style.background = "none";
                                                            btn.innerHTML = '<span style="display:flex;align-items:center;gap:6px;color:#34a853;font-size:13px;font-weight:500;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34a853" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Kopyalandı</span>';
                                                        }
                                                        setTimeout(() => {
                                                            if (btn) {
                                                                btn.dataset.copied = "false";
                                                                btn.style.opacity = "0";
                                                                btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
                                                            }
                                                        }, 3000);
                                                    }}
                                                    style={{
                                                        background: "none", border: "none", cursor: "pointer",
                                                        padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "center",
                                                        borderRadius: 4, transition: "opacity 0.2s, background 0.15s",
                                                        opacity: 0,
                                                        marginTop: 2 // Tiny adjustment to align perfectly with the thought header line
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = e.currentTarget.dataset.copied === "true" ? "none" : ds.colors.surfaceHover}
                                                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                                                    title="Kopyala"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* Fixed input at bottom */}
                <div style={{ flexShrink: 0, padding: "0 24px 24px", background: "transparent", zIndex: 10 }}>
                    <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>
                        {/* Hidden file inputs */}
                        <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, "pdf")} />
                        <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, "image")} />

                        {/* Input box — slides in/out */}
                        <div style={{
                            overflow: "visible",
                            maxHeight: inputCollapsed ? 0 : 500,
                            opacity: inputCollapsed ? 0 : 1,
                            transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
                        }}>
                            <div style={{
                                background: "#fff",
                                borderRadius: "8px",
                                boxShadow: "0px 3px 6px 0px rgba(0,0,0,0.12), 0px 6px 16px 0px rgba(0,0,0,0.08), 0px 9px 28px 0px rgba(0,0,0,0.05)",
                                border: "1px solid rgba(0, 0, 0, 0.1)",
                            }}>
                                {/* Link input */}
                                {linkInputVisible && (
                                    <div style={{ padding: "8px 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#f9f0ff", borderRadius: 8, padding: "8px 12px" }}>
                                            <Link2 style={{ width: 16, height: 16, color: "#722ED1", flexShrink: 0 }} />
                                            <input
                                                type="text"
                                                placeholder="URL yapıştırın..."
                                                value={linkValue}
                                                onChange={(e) => setLinkValue(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
                                                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: ds.fonts.family, fontWeight: 400, fontSize: 14, color: "rgba(0,0,0,0.85)" }}
                                                autoFocus
                                            />
                                            <button onClick={handleAddLink} style={{ color: "#722ED1", fontFamily: ds.fonts.family, fontWeight: 500, fontSize: 12, cursor: "pointer", background: "none", border: "none" }}>Ekle</button>
                                            <button onClick={() => { setLinkInputVisible(false); setLinkValue(""); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                                                <X style={{ width: 14, height: 14, color: "rgba(0,0,0,0.45)" }} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Attached files */}
                                {attachedFiles.length > 0 && (
                                    <div style={{ padding: "8px 16px 0", display: "flex", flexWrap: "wrap", gap: 8 }}>
                                        {attachedFiles.map((file, idx) => {
                                            const bg = file.type === "pdf" ? "#e6f7ff" : file.type === "link" ? "#f9f0ff" : "#f6ffed";
                                            const color = file.type === "pdf" ? "#1890ff" : file.type === "link" ? "#722ED1" : "#389E0D";
                                            return (
                                                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 8, fontSize: 12, fontFamily: ds.fonts.family, background: bg, color: color }}>
                                                    {file.type === "pdf" && <FileText style={{ width: 14, height: 14 }} />}
                                                    {file.type === "link" && <Link2 style={{ width: 14, height: 14 }} />}
                                                    {file.type === "image" && <ImageIcon style={{ width: 14, height: 14 }} />}
                                                    <span style={{ maxWidth: 120, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</span>
                                                    <button onClick={() => removeAttachedFile(idx)} style={{ marginLeft: 2, background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                                                        <X style={{ width: 12, height: 12 }} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Actions & Text input */}
                                <div style={{ display: "flex", alignItems: "flex-end", padding: "12px", gap: 16 }}>
                                    {/* Left: + button */}
                                    <div style={{ paddingBottom: 2, flexShrink: 0 }}>
                                        <button
                                            onClick={() => setShowAttachMenu(!showAttachMenu)}
                                            style={{ position: "relative", width: 36, height: 36, borderRadius: 8, border: "1px solid #d9d9d9", display: "flex", alignItems: "center", justifyContent: "center", background: "white", cursor: "pointer", transition: "border-color 0.15s" }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.3)"}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = "#d9d9d9"}
                                        >
                                            <Plus style={{ width: 16, height: 16, color: "rgba(0,0,0,0.65)" }} />

                                            {showAttachMenu && (
                                                <>
                                                    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 30 }} onClick={(e) => { e.stopPropagation(); setShowAttachMenu(false); }} />
                                                    <div style={{ position: "absolute", bottom: 44, left: 0, background: "white", borderRadius: 8, boxShadow: "0 3px 6px 0 rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.1)", zIndex: 40, width: 220, padding: "4px 0", textAlign: "left" }}>
                                                        <button onClick={handleAttachPdf} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                                            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#e6f7ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                                <FileText style={{ width: 16, height: 16, color: "#1890ff" }} />
                                                            </div>
                                                            <div>
                                                                <p style={{ fontFamily: ds.fonts.family, fontWeight: 500, fontSize: 13, lineHeight: "18px", color: "rgba(0,0,0,0.85)", margin: 0 }}>PDF Yükle</p>
                                                                <p style={{ fontFamily: ds.fonts.family, fontWeight: 400, fontSize: 11, lineHeight: "14px", color: "rgba(0,0,0,0.45)", margin: 0 }}>PDF dosyası ile arama</p>
                                                            </div>
                                                        </button>
                                                        <button onClick={handleAttachLink} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                                            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f9f0ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                                <Link2 style={{ width: 16, height: 16, color: "#722ED1" }} />
                                                            </div>
                                                            <div>
                                                                <p style={{ fontFamily: ds.fonts.family, fontWeight: 500, fontSize: 13, lineHeight: "18px", color: "rgba(0,0,0,0.85)", margin: 0 }}>Link Ekle</p>
                                                                <p style={{ fontFamily: ds.fonts.family, fontWeight: 400, fontSize: 11, lineHeight: "14px", color: "rgba(0,0,0,0.45)", margin: 0 }}>URL ile arama</p>
                                                            </div>
                                                        </button>
                                                        <button onClick={handleAttachImage} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                                            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f6ffed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                                <ImageIcon style={{ width: 16, height: 16, color: "#389E0D" }} />
                                                            </div>
                                                            <div>
                                                                <p style={{ fontFamily: ds.fonts.family, fontWeight: 500, fontSize: 13, lineHeight: "18px", color: "rgba(0,0,0,0.85)", margin: 0 }}>Resim Yükle</p>
                                                                <p style={{ fontFamily: ds.fonts.family, fontWeight: 400, fontSize: 11, lineHeight: "14px", color: "rgba(0,0,0,0.45)", margin: 0 }}>Görsel ile arama</p>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Center: Textarea */}
                                    <div style={{ flex: 1, padding: "8px 0" }}>
                                        <textarea
                                            ref={inputRef}
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            disabled={isThinking}
                                            placeholder='Örn: "Pamuklu gömlekler için ithalat...'
                                            style={{
                                                width: "100%", border: "none", outline: "none", resize: "none",
                                                fontSize: "14px", color: ds.colors.text, lineHeight: "1.55",
                                                fontFamily: ds.fonts.family, background: "transparent",
                                                minHeight: "22px", maxHeight: "120px", display: "block", boxSizing: "border-box", padding: 0
                                            }}
                                            rows={1}
                                            onInput={(e) => {
                                                const target = e.target;
                                                target.style.height = "auto";
                                                target.style.height = target.scrollHeight + "px";
                                            }}
                                        />
                                    </div>

                                    {/* Right: tag classify button + send button */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 2, flexShrink: 0 }}>
                                        {/* Tag/classify button — rounded square with purple gradient bg */}
                                        <button style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3e8ff", cursor: "pointer", border: "none", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "#e9d5ff"} onMouseLeave={e => e.currentTarget.style.background = "#f3e8ff"}>
                                            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                                                <g clipPath="url(#clip_class2)">
                                                    <path d="M7.34183 1.5085C7.12309 1.28969 6.82639 1.16673 6.517 1.16667H2.33333C2.02391 1.16667 1.72717 1.28958 1.50838 1.50838C1.28958 1.72717 1.16667 2.02391 1.16667 2.33333V6.517C1.16673 6.82639 1.28969 7.12309 1.5085 7.34183L6.58583 12.4192C6.85097 12.6826 7.20956 12.8305 7.58333 12.8305C7.95711 12.8305 8.3157 12.6826 8.58083 12.4192L12.4192 8.58083C12.6826 8.3157 12.8305 7.95711 12.8305 7.58333C12.8305 7.20956 12.6826 6.85097 12.4192 6.58583L7.34183 1.5085Z" stroke="#7C3AED" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M4.375 4.66667C4.53608 4.66667 4.66667 4.53608 4.66667 4.375C4.66667 4.21392 4.53608 4.08333 4.375 4.08333C4.21392 4.08333 4.08333 4.21392 4.08333 4.375C4.08333 4.53608 4.21392 4.66667 4.375 4.66667Z" fill="#7C3AED" stroke="#7C3AED" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                </g>
                                                <defs><clipPath id="clip_class2"><rect fill="white" height="14" width="14" /></clipPath></defs>
                                            </svg>
                                        </button>

                                        {/* Send button */}
                                        <button
                                            disabled={!input.trim() || isThinking}
                                            onClick={() => sendMessage(input)}
                                            style={{
                                                width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                                                background: (!input.trim() || isThinking) ? "#f5f5f5" : "#1890ff",
                                                boxShadow: (!input.trim() || isThinking) ? "none" : "0 2px 4px 0 rgba(24,144,255,0.3)",
                                                border: "none",
                                                cursor: (!input.trim() || isThinking) ? "not-allowed" : "pointer",
                                                transition: "background 0.15s"
                                            }}
                                            onMouseEnter={e => { if (input.trim() && !isThinking) e.currentTarget.style.background = "#40a9ff"; }}
                                            onMouseLeave={e => { if (input.trim() && !isThinking) e.currentTarget.style.background = "#1890ff"; }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" style={{ transform: "rotate(-45deg)" }}>
                                                <g clipPath="url(#clip_send2)">
                                                    <path d="M0.311839 0.226399C0.369559 0.212434 0.430685 0.218438 0.483714 0.244953L13.554 6.79769C13.6773 6.86025 13.7272 7.01065 13.6663 7.13558C13.6414 7.18229 13.6022 7.22245 13.554 7.24593L0.483714 13.7616C0.358714 13.8225 0.208714 13.7727 0.147777 13.6493C0.121271 13.5978 0.114247 13.5371 0.128246 13.4793L1.47883 7.96859C1.49758 7.88577 1.55871 7.81995 1.63996 7.79183L3.94563 6.99984L1.63801 6.20687C1.55695 6.18031 1.49629 6.11368 1.4759 6.03109L0.128246 0.52718C0.112823 0.463117 0.123375 0.395064 0.157542 0.338703C0.191816 0.282296 0.247758 0.24224 0.311839 0.226399ZM2.45539 5.29964L7.0677 6.8807C7.13324 6.9041 7.16752 6.97433 7.14582 7.03988C7.13334 7.07734 7.10359 7.10548 7.0677 7.118L2.45539 8.70101L1.66926 11.9139L11.4847 7.01937L1.67219 2.09945L2.45539 5.29964Z" fill={!input.trim() || isThinking ? "#9ca3af" : "white"} />
                                                </g>
                                                <defs><clipPath id="clip_send2"><rect fill="white" height="14" width="14" /></clipPath></defs>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <p style={{ margin: "10px 0 0", fontSize: "12px", color: ds.colors.textMuted, lineHeight: 1.5, textAlign: "center", paddingBottom: "4px" }}>
                                AI yanıtları hatalı bilgiler içerebilir. Önemli bilgileri her zaman doğrulayın.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Share Modal */}
                {showShareModal && (
                    <ShareReportModal onClose={() => setShowShareModal(false)} />
                )}
            </div>
        </div >
    );
}

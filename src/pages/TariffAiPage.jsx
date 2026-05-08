import { useState, useRef, useEffect } from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Progress, Tooltip } from "antd";
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
        <path d="M38.9975 44.5403C39.3177 44.8788 39.5774 45.2716 39.7641 45.7008C39.9772 46.1911 40.0909 46.72 40.0985 47.2551C40.106 47.7904 40.0073 48.323 39.808 48.8193C39.6087 49.3153 39.3128 49.767 38.938 50.1466C38.5631 50.5262 38.1156 50.8268 37.6237 51.0304C37.132 51.2338 36.6043 51.3374 36.0726 51.3331C35.5408 51.3287 35.0141 51.2167 34.5256 51.0051C34.0373 50.7935 33.5954 50.4857 33.2267 50.1002L28.9241 45.7699L34.5711 40.0847L38.9975 44.5403ZM35.7259 36.1996L21.953 50.0782C21.2046 50.8296 20.1903 51.2517 19.1332 51.2517C18.076 51.2516 17.0617 50.8298 16.3133 50.0782H16.3052C15.5585 49.325 15.1392 48.3037 15.139 47.2397C15.1391 46.1759 15.5588 45.1551 16.3052 44.4019L21.2597 39.4166L21.2621 39.419L29.0112 31.6203L29.0047 31.6138L30.0862 30.5233L35.7259 36.1996ZM37.6848 24.1814L42.037 28.5629L48.3058 34.8715C49.0558 35.6232 49.4784 36.6447 49.481 37.71C49.4832 38.7755 49.0647 39.7991 48.318 40.5543C47.5711 41.3093 46.5559 41.735 45.4974 41.7375C44.4388 41.7398 43.4213 41.319 42.671 40.5673L42.6588 40.5543L37.0289 34.8886L37.0256 34.891L31.3851 29.2139L31.3883 29.2115L28.8427 26.6488L34.4898 20.966L37.6848 24.1814ZM16.7731 36.2484L12.5023 40.547C11.9441 41.1049 11.2339 41.485 10.462 41.6383C9.69012 41.7914 8.88995 41.711 8.16303 41.408C7.43613 41.1049 6.81419 40.5918 6.37591 39.9342C5.93783 39.2766 5.70242 38.5026 5.69963 37.7109C5.69835 37.1838 5.80045 36.6605 6.00074 36.1736C6.20113 35.6867 6.49639 35.2441 6.86745 34.8723L11.1359 30.5738L16.7731 36.2484ZM7.12624 15.9725C7.85626 15.6674 8.66058 15.587 9.43583 15.7422C10.2111 15.8976 10.9234 16.2818 11.4817 16.8449L17.6105 23.0136L17.6032 23.0209L25.7779 31.2493L25.7853 31.2419L26.35 31.81L20.7047 37.4919L19.0485 35.8245L19.0526 35.822L10.8779 27.5945L10.8738 27.5969L5.83717 22.5269C5.46607 22.156 5.17136 21.714 4.97046 21.2281C4.76968 20.7422 4.66584 20.2203 4.66609 19.6941C4.66377 18.8986 4.89657 18.1193 5.33423 17.4569C5.77208 16.7946 6.39638 16.2778 7.12624 15.9725ZM36.2582 6.20934C37.0351 6.04917 37.8424 6.12762 38.5751 6.43314C39.1619 6.67703 39.6823 7.05904 40.0928 7.54642C40.5032 8.03378 40.7922 8.61346 40.9351 9.23588L41.0352 10.1595C41.036 11.2243 40.6173 12.2462 39.8715 13.0013L33.9209 18.9901L25.1025 27.8663L19.4579 22.1851L21.6186 20.0098L21.6202 20.0114L29.3693 12.212L29.3677 12.2103L34.2155 7.33158C34.7697 6.76086 35.4815 6.3696 36.2582 6.20934ZM43.9064 14.2033C44.2754 13.5861 45.1979 13.6304 45.4884 14.3352L45.49 14.3368L45.9091 15.3532C46.6179 17.0709 47.9415 18.4446 49.6063 19.1887L50.7692 19.7095L50.9303 19.799C51.4671 20.1552 51.4666 20.9948 50.9303 21.351L50.77 21.4397L49.5347 21.9906L49.533 21.9922C47.9489 22.7035 46.6708 23.9903 45.9409 25.6047L45.9344 25.612L45.8945 25.7032L45.4827 26.6407L45.4567 26.6968C45.1159 27.3725 44.1609 27.3575 43.8502 26.6448L43.4425 25.7048C42.7207 24.0446 41.422 22.7165 39.7982 21.9906L38.5385 21.4299C37.8188 21.1066 37.8207 20.0422 38.5417 19.7201L39.738 19.1838L39.7486 19.1773L40.3101 18.8949L40.3329 18.8819C41.7119 18.097 42.8034 16.8556 43.4238 15.3524L43.8413 14.3352L43.9064 14.2033ZM16.9416 5.74222C17.7921 4.31889 19.8318 4.3134 20.6916 5.69421L20.7535 5.75524L20.8739 6.04577L21.1881 6.8083C21.5468 7.67777 22.1939 8.37578 22.9996 8.78422L23.1632 8.86153L24.095 9.27982L24.1519 9.31075L24.2724 9.37829L24.3269 9.40759L24.3782 9.44177C25.7068 10.3228 25.7039 12.3178 24.379 13.1975L24.3253 13.2325L24.2691 13.2634L24.1495 13.3293L24.0934 13.3602L24.0356 13.3863L23.1086 13.8005C22.272 14.1767 21.5858 14.8617 21.1913 15.7341L21.1116 15.9107L20.8544 16.4958L20.8511 16.5023L20.8487 16.508L20.83 16.5512L20.8161 16.5821L20.8007 16.6122C19.9602 18.2811 17.5675 18.2383 16.8081 16.4942L16.5021 15.7894L16.4256 15.6226C16.0245 14.8043 15.3616 14.1604 14.5579 13.8005L13.6123 13.3798L13.6082 13.3781C11.8456 12.5865 11.8568 10.0478 13.6115 9.26192L14.4627 8.87862L14.833 8.69226C15.5595 8.27572 16.1424 7.61597 16.4761 6.80749L16.8098 5.99613L16.835 5.94486L16.8838 5.84557L16.9107 5.79268L16.9416 5.74222ZM18.8313 8.96732C18.2482 9.92889 17.4446 10.736 16.4842 11.3143C17.4401 11.8782 18.2439 12.6684 18.8337 13.6109C19.4236 12.6674 20.2287 11.8789 21.1824 11.3151C20.2213 10.7369 19.4149 9.93015 18.8313 8.96732Z" fill="url(#tariff-ai-grad)"/>
        <defs>
            <radialGradient id="tariff-ai-grad" cx="0" cy="0" r="1" gradientTransform="matrix(21.6669 34.5834 -30.4539 19.0794 16.7495 5.91657)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D912F0"/>
                <stop offset="1" stopColor="#219DFF"/>
            </radialGradient>
        </defs>
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
const TokenIcon = ({ size = 14, color = "#8e8e93" }) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.75 0C13.5825 0 17.5 3.91751 17.5 8.75C17.5 9.92461 17.2684 11.0451 16.8486 12.0684C16.6663 12.5126 16.0955 12.5955 15.756 12.256C15.541 12.041 15.4878 11.7152 15.5989 11.4322C15.9252 10.6011 16.1055 9.69677 16.1055 8.75C16.1055 4.6878 12.8122 1.39453 8.75 1.39453C4.6878 1.39453 1.39453 4.6878 1.39453 8.75C1.39453 12.8122 4.6878 16.1055 8.75 16.1055C9.69677 16.1055 10.6011 15.9252 11.4322 15.5989C11.7152 15.4878 12.041 15.541 12.256 15.756C12.5955 16.0955 12.5126 16.6663 12.0684 16.8486C11.0451 17.2684 9.92461 17.5 8.75 17.5C3.91751 17.5 0 13.5825 0 8.75C0 3.91751 3.91751 0 8.75 0ZM14.1201 11.875C14.2433 11.5767 14.6561 11.5767 14.7793 11.875L14.9561 12.3027C15.2585 13.0322 15.823 13.6146 16.5322 13.9297L17.0342 14.1533C17.3218 14.2808 17.3218 14.6987 17.0342 14.8262L16.502 15.0625C15.8133 15.3698 15.2592 15.9313 14.9512 16.6367L14.7773 17.0322C14.6513 17.3221 14.2507 17.3221 14.124 17.0322L13.9512 16.6367C13.6431 15.9311 13.0891 15.3698 12.3975 15.0625L11.8652 14.8262C11.5778 14.6987 11.5778 14.2808 11.8652 14.1533L12.3672 13.9297C13.0764 13.6146 13.6409 13.0322 13.9434 12.3027L14.1201 11.875ZM8.85059 3.25C9.08085 3.25 9.31151 3.37796 9.41797 3.63477L9.99219 5.01758C10.4872 6.21106 11.4104 7.16349 12.5703 7.67871L14.0801 8.34863C14.5754 8.56866 14.5749 9.28901 14.0801 9.50879L12.5225 10.2012C11.3913 10.7031 10.4846 11.6219 9.98047 12.7754L9.41406 14.0723C9.30485 14.3215 9.07742 14.4463 8.85059 14.4463C8.62382 14.4462 8.39755 14.3214 8.28906 14.0723L7.72266 12.7754C7.21857 11.621 6.31097 10.7031 5.17969 10.2012L3.62207 9.50879C3.1264 9.28895 3.1264 8.56847 3.62207 8.34863L5.13086 7.67871C6.29145 7.1635 7.21424 6.21034 7.70996 5.01758L8.28418 3.63477C8.39065 3.37818 8.62044 3.25007 8.85059 3.25ZM8.85059 5.89355C8.1995 7.24199 7.11653 8.3098 5.76465 8.92871C7.10251 9.52731 8.18619 10.5691 8.85059 11.8867C9.51496 10.5691 10.5987 9.52635 11.9365 8.92773C10.5848 8.3095 9.50162 7.24188 8.85059 5.89355Z" fill={color}/>
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
const TOOL_BADGE = {
    classify: { bg: "#ede9fe", stroke: "#7c3aed" },
    tax:      { bg: "#dcfce7", stroke: "#16a34a" },
    default:  { bg: "#dbeafe", stroke: "#2563eb" },
};

function ToolBadgeIcon({ toolId }) {
    const c = TOOL_BADGE[toolId] || TOOL_BADGE.default;
    return (
        <div style={{ width: 22, height: 22, borderRadius: 6, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {toolId === "tax"
                    ? <><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 11h4M9 14h6"/></>
                    : toolId === "classify"
                    ? <><path d="M6 6h7l2 2h3v10H6V6z"/><path d="M10 15l2.5 2.5L18 11"/></>
                    : <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3"/></>
                }
            </svg>
        </div>
    );
}

function ChatSidebar({ collapsed, onCollapse, sessions, activeId, onNew, onSelect, userCredits, totalCredits, lockedSessionIds = new Set(), packageName = "Kullanım" }) {
    const [searchQuery, setSearchQuery] = useState("");
    const usedCredits = totalCredits - userCredits;
    const usagePct = totalCredits > 0 ? Math.min(100, (usedCredits / totalCredits) * 100) : 0;
    const barColor = usagePct < 60 ? "#1a73e8" : usagePct < 80 ? "#f59e0b" : "#ef4444";

    const filtered = sessions.filter(s =>
        !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ width: collapsed ? 0 : 260, minWidth: collapsed ? 0 : 260, height: "100%", background: "#f1f3f4", borderRight: collapsed ? "none" : "1px solid #e0e0e0", display: "flex", flexDirection: "column", overflow: "hidden", transition: "width 0.3s, min-width 0.3s", flexShrink: 0 }}>
            {!collapsed && (
                <>
                    {/* Header row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 10px 10px" }}>
                        <button
                            onClick={onNew}
                            style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, background: "#1a73e8", color: "white", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: ds.fonts.family }}
                        >
                            <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><path d="M9 3v12M3 9h12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                            Yeni Sohbet
                        </button>
                        <button
                            onClick={onCollapse}
                            style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#5f6368" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.10)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.06)"}
                        >
                            <CollapseIcon flipped={false} />
                        </button>
                    </div>

                    {/* Sohbetler row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 14px 8px" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#374151", fontFamily: ds.fonts.family }}>Sohbetler</span>
                        <span style={{ fontSize: 11, color: "#6b7280", background: "#e5e7eb", borderRadius: 10, padding: "1px 7px", fontFamily: ds.fonts.family }}>{sessions.length}</span>
                    </div>

                    {/* Search */}
                    <div style={{ padding: "0 10px 8px" }}>
                        <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", padding: "6px 10px", gap: 6 }}>
                            <input
                                type="text"
                                placeholder="Ara"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{ flex: 1, border: "none", outline: "none", fontSize: 13, background: "transparent", color: "#374151", fontFamily: ds.fonts.family }}
                            />
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                        </div>
                    </div>

                    {/* Sessions list */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
                        {filtered.length > 0 && (
                            <div style={{ fontSize: 11, color: "#9ca3af", padding: "2px 6px 4px", fontFamily: ds.fonts.family, fontWeight: 500 }}>Bugün</div>
                        )}
                        {filtered.length === 0 && (
                            <div style={{ padding: "12px 8px", fontSize: 12, color: ds.colors.textMuted }}>Henüz sohbet yok</div>
                        )}
                        {filtered.map(s => {
                            const isLocked = lockedSessionIds.has(s.id);
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => onSelect(s.id)}
                                    style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 6, padding: "7px 8px", borderRadius: 8, background: activeId === s.id ? "#e8f0fe" : "transparent", border: "none", cursor: "pointer", fontFamily: ds.fonts.family, marginBottom: 1, transition: "background 0.13s", position: "relative" }}
                                    onMouseEnter={e => { if (activeId !== s.id) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
                                    onMouseLeave={e => { if (activeId !== s.id) e.currentTarget.style.background = "transparent"; }}
                                >
                                    {isLocked && (
                                        <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                            </svg>
                                        </span>
                                    )}
                                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13, color: isLocked ? "#9ca3af" : activeId === s.id ? ds.colors.primary : ds.colors.text }}>{s.title}</span>
                                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                                        <div style={{ width: 22, height: 22, borderRadius: 6, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                                            </svg>
                                        </div>
                                        <ToolBadgeIcon toolId={s.toolId} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: "8px 8px 12px", borderTop: "1px solid #e0e0e0" }}>
                        {[
                            { label: "Neler Yapabilirim?", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="#6b7280" stroke="none"/></svg> },
                            { label: "Sıkça Sorulan Sorular", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="#6b7280"/></svg> },
                        ].map(item => (
                            <button key={item.label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "7px 8px", background: "none", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: ds.fonts.family, transition: "background 0.13s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
                                onMouseLeave={e => e.currentTarget.style.background = "none"}
                            >
                                {item.icon}
                                <span style={{ fontSize: 13, color: "#374151" }}>{item.label}</span>
                            </button>
                        ))}

                        {/* Usage bar */}
                        <div style={{ padding: "6px 8px 0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
                                </svg>
                                <span style={{ fontSize: 13, color: "#374151", fontFamily: ds.fonts.family, flex: 1 }}>{packageName}</span>
                                <span style={{ fontSize: 11, color: "#6b7280", fontFamily: ds.fonts.family }}>{usedCredits}/{totalCredits}</span>
                            </div>
                            <div style={{ height: 5, background: "#e0e0e0", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ width: `${usagePct}%`, height: "100%", background: barColor, borderRadius: 3, transition: "width 0.5s ease, background 0.3s" }} />
                            </div>
                        </div>
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

/* ── Credit System Constants ─────────────────────────────── */
const TOTAL_CREDITS = 24;
const CREDITS_PER_CHAT = 6;
const CHAT_WARN_AT = 5;
const GLOBAL_LOW_THRESHOLD = 3;
const PACKAGE_NAME = "Premium Pack";

function LowCreditBanner({ credits, onBuyCredits }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "linear-gradient(90deg, #fffbe6, #fff7cc)",
            border: "1px solid #ffe58f",
            borderRadius: 6, padding: "4px 16px 16px",
            gap: 12,
            animation: "bannerSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 20h20L12 2z" fill="#faad14" />
                    <path d="M12 9v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="17" r="1" fill="white" />
                </svg>
                <span style={{ fontSize: 13, color: "#7c5800", fontFamily: ds.fonts.family }}>
                    <span style={{ fontWeight: 500 }}>Krediniz azalıyor!</span> Yalnızca <strong>{credits}</strong> AI sorgunuz kaldı.
                </span>
            </div>
            <button
                onClick={onBuyCredits}
                style={{
                    background: "#faad14", color: "white", border: "none",
                    borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 400,
                    cursor: "pointer", fontFamily: ds.fonts.family, whiteSpace: "nowrap",
                    transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#d48806"}
                onMouseLeave={e => e.currentTarget.style.background = "#faad14"}
            >
                Kredi Al
            </button>
        </div>
    );
}

function ChatLimitWarningBanner({ remaining, onNewChat }) {
    return (
        <div style={{
            background: "linear-gradient(90deg, #fffbe6, #fff7cc)",
            border: "1px solid #ffe58f",
            borderRadius: 6, padding: "10px 16px",
            animation: "bannerSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
            overflow: "hidden",
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, transform: "translateY(-10%)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 20h20L12 2z" fill="#faad14" />
                        <path d="M12 9v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="17" r="1" fill="white" />
                    </svg>
                    <span style={{ fontSize: 13, color: "#7c5800", fontFamily: ds.fonts.family }}>
                        Bu sohbet sona yaklaşıyor — yalnızca <strong>{remaining}</strong> sorgu hakkınız kaldı. Lütfen yeni bir sohbet açın.
                    </span>
                </div>
                <button
                    onClick={onNewChat}
                    style={{
                        background: "#faad14", color: "white", border: "none",
                        borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 400,
                        cursor: "pointer", fontFamily: ds.fonts.family, whiteSpace: "nowrap",
                        transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#d48806"}
                    onMouseLeave={e => e.currentTarget.style.background = "#faad14"}
                >
                    Yeni Sohbet Aç
                </button>
            </div>
        </div>
    );
}

function ChatLockedCard({ onNewChat, canStart, onBuyCredits }) {
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8, padding: "22px 24px 20px",
            gap: 8, textAlign: "center",
            boxShadow: "0px 3px 6px 0px rgba(0,0,0,0.08)",
            animation: "bannerSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) both",
            marginBottom: 4,
        }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", fontFamily: ds.fonts.family }}>Bu sohbet kilitlendi</div>
            <div style={{ fontSize: 13, color: "#6b7280", fontFamily: ds.fonts.family, maxWidth: 380, lineHeight: 1.55 }}>
                3 sorgu limitine ulaşıldı. Sohbet sistem tarafından kilitlendi. Görüşmeye devam etmek için yeni bir sohbet başlatın.
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                {canStart && (
                    <button
                        onClick={onNewChat}
                        style={{
                            background: "#1a73e8", color: "white", border: "none",
                            borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 400,
                            cursor: "pointer", fontFamily: ds.fonts.family,
                            display: "flex", alignItems: "center", gap: 8, transition: "background 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#1557b0"}
                        onMouseLeave={e => e.currentTarget.style.background = "#1a73e8"}
                    >
                        <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                            <path d="M9 3v12M3 9h12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Yeni Sohbet Aç
                    </button>
                )}
                <button
                    onClick={onBuyCredits}
                    style={{
                        background: "white", color: "#374151", border: "1px solid #d1d5db",
                        borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 400,
                        cursor: "pointer", fontFamily: ds.fonts.family,
                        display: "flex", alignItems: "center", gap: 8, transition: "background 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#9ca3af"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    Kredi Al
                </button>
            </div>
        </div>
    );
}

const PACKAGES = [
    {
        id: "premium",
        name: "Premium Pack",
        price: "€79",
        priceSub: ".90",
        priceNote: "/month",
        iconBg: "linear-gradient(135deg, #FF8C00, #FFA040)",
        recommended: true,
        crown: true,
        features: [
            "HS Code Search & Lookup",
            "Advanced Duty & Tax Calculation",
            "Country-Specific Tariff Data (TR-EU-CH-UK)",
            "Country of Origin Impact (TR)",
            "Advanced Query Results",
            "Priority Email Support",
            "AI Assistant for Tariff Classification",
            "AI Assistant for Compliance Requirements",
            "AI Assistant for Duty & Tax Optimization",
            "AI Assistant for Scenario Comparison",
        ],
        buttonDark: true,
    },
    {
        id: "premium_plus",
        name: "Premium Plus Pack",
        price: "€159",
        priceSub: ".90",
        priceNote: "/month",
        iconBg: "linear-gradient(135deg, #7B2FBE, #9C40D4)",
        recommended: false,
        crown: false,
        features: [
            "HS Code Search & Lookup",
            "Advanced Duty & Tax Calculation",
            "Country-Specific Tariff Data (TR-EU-CH-UK)",
            "Country of Origin Impact (TR)",
            "Advanced Query Results",
            "Priority Email Support",
            "AI Assistant for Tariff Classification",
            "AI Assistant for Compliance Requirements",
            "AI Assistant for Duty & Tax Optimization",
            "AI Assistant for Scenario Comparison",
        ],
        buttonDark: false,
    },
];

function TokenExhaustedChatCard({ onBuyCredits }) {
    const [expandedPkg, setExpandedPkg] = useState(null);
    const FEATURES_SHOWN = 4;

    const PkgIconPremium = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#pp-clip)">
                <rect width="24" height="24" fill="white" fillOpacity="0.01"/>
                <path d="M22.3819 5.6865L17.1694 8.89811L12.1712 2.23114C12.1511 2.20431 12.125 2.18253 12.095 2.16753C12.065 2.15253 12.0319 2.14471 11.9984 2.14471C11.9649 2.14471 11.9318 2.15253 11.9018 2.16753C11.8718 2.18253 11.8457 2.20431 11.8256 2.23114L6.8301 8.89811L1.61492 5.6865C1.46225 5.59275 1.26403 5.71864 1.28814 5.89811L3.33457 21.4499C3.36403 21.6615 3.54617 21.8249 3.76314 21.8249H20.239C20.4533 21.8249 20.6381 21.6642 20.6649 21.4499L22.7114 5.89811C22.7328 5.71864 22.5372 5.59275 22.3819 5.6865ZM19.0069 19.9928H4.98992L3.54885 9.02668L7.2935 11.3329L11.9997 5.05436L16.706 11.3329L20.4506 9.02668L19.0069 19.9928ZM11.9997 11.9142C10.3364 11.9142 8.98367 13.2669 8.98367 14.9303C8.98367 16.5936 10.3364 17.9463 11.9997 17.9463C13.6631 17.9463 15.0158 16.5936 15.0158 14.9303C15.0158 13.2669 13.6631 11.9142 11.9997 11.9142ZM11.9997 16.224C11.2872 16.224 10.7087 15.6454 10.7087 14.9303C10.7087 14.2178 11.2872 13.6365 11.9997 13.6365C12.7122 13.6365 13.2908 14.2151 13.2908 14.9303C13.2908 15.6428 12.7122 16.224 11.9997 16.224Z" fill="white"/>
            </g>
            <defs><clipPath id="pp-clip"><rect width="24" height="24" fill="white"/></clipPath></defs>
        </svg>
    );

    const PkgIconPremiumPlus = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#ppp-clip)">
                <rect width="24" height="24" fill="white" fillOpacity="0.01"/>
                <path d="M21.5361 2.57465H19.0718V1.50323C19.0718 1.38537 18.9754 1.28894 18.8576 1.28894H5.14328C5.02542 1.28894 4.92899 1.38537 4.92899 1.50323V2.57465H2.4647C2.15213 2.57465 1.85235 2.69883 1.63133 2.91985C1.4103 3.14088 1.28613 3.44065 1.28613 3.75323V7.71751C1.28613 9.90591 2.89328 11.7247 4.98792 12.0568C5.4031 15.1693 7.9022 17.6202 11.0361 17.963V20.7809H5.78613C5.31203 20.7809 4.92899 21.1639 4.92899 21.6381V22.5032C4.92899 22.6211 5.02542 22.7175 5.14328 22.7175H18.8576C18.9754 22.7175 19.0718 22.6211 19.0718 22.5032V21.6381C19.0718 21.1639 18.6888 20.7809 18.2147 20.7809H12.9647V17.963C16.0986 17.6202 18.5977 15.1693 19.0129 12.0568C21.1076 11.7247 22.7147 9.90591 22.7147 7.71751V3.75323C22.7147 3.44065 22.5905 3.14088 22.3695 2.91985C22.1485 2.69883 21.8487 2.57465 21.5361 2.57465ZM3.2147 7.71751V4.50323H4.92899V10.0639C4.43144 9.90501 3.99726 9.59209 3.68913 9.17034C3.381 8.74859 3.21487 8.23983 3.2147 7.71751ZM17.1433 11.1461C17.1433 12.4613 16.6317 13.7014 15.6995 14.6309C14.7674 15.563 13.5299 16.0747 12.2147 16.0747H11.7861C10.471 16.0747 9.23078 15.563 8.30131 14.6309C7.36917 13.6988 6.85756 12.4613 6.85756 11.1461V3.21751H17.1433V11.1461ZM20.7861 7.71751C20.7861 8.81573 20.0656 9.74787 19.0718 10.0639V4.50323H20.7861V7.71751Z" fill="white"/>
            </g>
            <defs><clipPath id="ppp-clip"><rect width="24" height="24" fill="white"/></clipPath></defs>
        </svg>
    );

    const FeatureCheck = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z" fill="#D9F7BE"/>
            <g clipPath="url(#tier-clip)">
                <rect width="10" height="10" transform="translate(3 4)" fill="white" fillOpacity="0.01"/>
                <path d="M12.4648 5.40625H11.6847C11.5753 5.40625 11.4715 5.45647 11.4045 5.54241L6.80299 11.3717L4.59651 8.57589C4.56313 8.53351 4.52059 8.49925 4.47207 8.47567C4.42355 8.45208 4.37032 8.4398 4.31638 8.43973H3.53624C3.46147 8.43973 3.42017 8.52567 3.46593 8.58371L6.52285 12.4565C6.66571 12.6373 6.94026 12.6373 7.08423 12.4565L12.5351 5.54911C12.5809 5.49219 12.5396 5.40625 12.4648 5.40625Z" fill="black" fillOpacity="0.85"/>
            </g>
            <defs>
                <clipPath id="tier-clip">
                    <rect width="10" height="10" fill="white" transform="translate(3 4)"/>
                </clipPath>
            </defs>
        </svg>
    );

    return (
        <div style={{ margin: "9px 0 18px", fontFamily: ds.fonts.family }}>
            {/* ── Package cards — 2 columns ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "start" }}>
                {PACKAGES.map((pkg, idx) => {
                    const isExpanded = expandedPkg === pkg.id;
                    const visibleFeatures = pkg.features.slice(0, FEATURES_SHOWN);
                    const hiddenCount = pkg.features.length - FEATURES_SHOWN;

                    return (
                        <div key={pkg.id} style={{ animation: "pkgEnter 0.45s ease both", animationDelay: `${idx * 0.12}s` }}>
                            <div style={{
                                background: pkg.id === "premium"
                                    ? "linear-gradient(to top, #FFF9EA, #ffffff)"
                                    : "linear-gradient(to top, #F3E8FF, #ffffff)",
                                borderRadius: 12,
                                padding: "18px 15px 15px",
                                border: "1px solid #e5e7eb",
                            }}>
                                {/* Icon */}
                                <div style={{ width: 44, height: 44, borderRadius: 11, background: pkg.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                                    {pkg.id === "premium" ? <PkgIconPremium /> : <PkgIconPremiumPlus />}
                                </div>

                                {/* Name */}
                                <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a1a", marginBottom: 9, lineHeight: 1.2 }}>
                                    {pkg.name}
                                </div>

                                {/* Price */}
                                <div style={{ display: "flex", alignItems: "flex-end", gap: 0, marginBottom: 12 }}>
                                    <span style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", lineHeight: 1, letterSpacing: "-0.03em" }}>{pkg.price}</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", marginBottom: 1 }}>{pkg.priceSub}</span>
                                    <span style={{ fontSize: 10, color: "#888", marginBottom: 2, marginLeft: 4 }}>{pkg.priceNote}</span>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={onBuyCredits}
                                    style={{
                                        width: "100%", height: 30, borderRadius: 5,
                                        border: pkg.buttonDark ? "none" : "1.5px solid #d0d0d0",
                                        background: pkg.buttonDark ? "#1a1a1a" : "#ffffff",
                                        color: pkg.buttonDark ? "#ffffff" : "#1a1a1a",
                                        fontSize: 12, fontWeight: 400, cursor: "pointer",
                                        fontFamily: ds.fonts.family, marginBottom: 15,
                                        transition: "opacity 0.15s",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = "0.82"}
                                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                                >
                                    Satın Al
                                </button>

                                {/* Features */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {visibleFeatures.map((f, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                            <FeatureCheck />
                                            <span style={{ fontSize: 10, color: "#333", lineHeight: 1.4, paddingTop: 1 }}>{f}</span>
                                        </div>
                                    ))}

                                    {isExpanded && pkg.features.slice(FEATURES_SHOWN).map((f, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, animation: "fadeIn 0.25s ease" }}>
                                            <FeatureCheck />
                                            <span style={{ fontSize: 10, color: "#333", lineHeight: 1.4, paddingTop: 1 }}>{f}</span>
                                        </div>
                                    ))}

                                    {hiddenCount > 0 && (
                                        <button
                                            onClick={() => setExpandedPkg(isExpanded ? null : pkg.id)}
                                            style={{ background: "none", border: "none", cursor: "pointer", color: "#1a73e8", fontSize: 10, fontWeight: 500, padding: "2px 0", textAlign: "left", fontFamily: ds.fonts.family }}
                                        >
                                            {isExpanded ? "Daha az göster" : `+ ${hiddenCount} özellik daha göster`}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function NoCreditBanner({ onBuyCredits }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "linear-gradient(90deg, #fff1f0, #ffe7e5)",
            border: "1px solid #ffa39e",
            borderRadius: 6, padding: "12px 20px 20px",
            gap: 16,
            animation: "bannerSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ExclamationCircleFilled style={{ fontSize: 28, color: "#ff4d4f", flexShrink: 0 }} />
                <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#a8071a", fontFamily: ds.fonts.family }}>
                        Krediniz Tükendi
                    </div>
                    <div style={{ fontSize: 12, color: "#cf1322", fontFamily: ds.fonts.family, marginTop: 2 }}>
                        Tariff AI'ı kullanmaya devam etmek için kredi satın alın.
                    </div>
                </div>
            </div>
            <button
                onClick={onBuyCredits}
                style={{
                    background: "#ff4d4f",
                    color: "white", border: "none",
                    borderRadius: 6, padding: "9px 20px", fontSize: 13, fontWeight: 400,
                    cursor: "pointer", fontFamily: ds.fonts.family, whiteSpace: "nowrap",
                    transition: "opacity 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
                Kredi Satın Al
            </button>
        </div>
    );
}

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
    const [, setThinkingSteps] = useState([]);
    const inputCollapsed = false;
    const [showShareModal, setShowShareModal] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [linkInputVisible, setLinkInputVisible] = useState(false);
    const [linkValue, setLinkValue] = useState("");
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [userCredits, setUserCredits] = useState(TOTAL_CREDITS);
    const [chatCreditsUsed, setChatCreditsUsed] = useState(0);
    const [lockedSessionIds, setLockedSessionIds] = useState(new Set());
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const chatCreditsRemaining = CREDITS_PER_CHAT - chatCreditsUsed;
    const isChatLocked = chatCreditsUsed >= CREDITS_PER_CHAT;
    const isChatNearLimit = chatCreditsUsed >= CHAT_WARN_AT && !isChatLocked;
    const isOutOfCredits = userCredits <= 0;
    const isLowGlobalCredits = userCredits > 0 && userCredits <= GLOBAL_LOW_THRESHOLD;

    // Navigate to Settings to buy credits
    const handleBuyCredits = () => {
        // In real app: navigate('/settings'). Here we use a simple approach.
        const event = new CustomEvent('navigate-to-settings', { detail: { tab: 'credits' } });
        window.dispatchEvent(event);
        // Demo fallback alert
        alert("Kredi satın almak için Ayarlar > Kredi Bakiyesi bölümüne gidin.");
    };

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
        if (userCredits < CREDITS_PER_CHAT) return;
        // Mark the current active session as locked before switching
        if (activeSessionId !== null && chatCreditsUsed >= CREDITS_PER_CHAT) {
            setLockedSessionIds(prev => new Set([...prev, activeSessionId]));
        }
        setUserCredits(prev => prev - CREDITS_PER_CHAT);
        setChatCreditsUsed(0);
        const id = sessionCounter++;
        const tool = tools.find(t => t.id === (toolId || selectedTool));
        const title = tool ? tool.title : "Yeni Sohbet";
        const newSession = { id, title: `${title} #${id}`, toolId: toolId || selectedTool };
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
        if (!text.trim() || isThinking || isChatLocked) return;
        setChatCreditsUsed(prev => prev + 1);
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

        setTimeout(() => {
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
                        const tokenCost = Math.floor(Math.random() * 8) + 2;
                        setMessages(prev => prev.map((m, idx) =>
                            idx === aiMsgIndex.current ? { ...m, content: fullContent, streaming: false, tokenCost } : m
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
                <ChatSidebar collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed(c => !c)} sessions={sessions} activeId={activeSessionId} onNew={handleNewChat} onSelect={(id) => { setActiveSessionId(id); setScreen(SCREENS.CHAT); }} userCredits={userCredits} totalCredits={TOTAL_CREDITS} lockedSessionIds={lockedSessionIds} packageName={PACKAGE_NAME} />

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
                                    disabled={isOutOfCredits}
                                    onClick={() => startNewChat(selectedTool)}
                                    style={{ background: isOutOfCredits ? "#d1d5db" : ds.colors.primary, color: "white", border: "none", borderRadius: ds.radius.sm, padding: "13px 20px", fontSize: 15, fontWeight: 600, cursor: isOutOfCredits ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: ds.fonts.family, boxShadow: isOutOfCredits ? "none" : "0 1px 4px rgba(26,115,232,0.3)" }}
                                    onMouseEnter={e => { if (!isOutOfCredits) e.currentTarget.style.background = ds.colors.primaryHover; }}
                                    onMouseLeave={e => { if (!isOutOfCredits) e.currentTarget.style.background = ds.colors.primary; }}
                                >
                                    <SendIcon color="white" /> {isOutOfCredits ? "Kredi Yetersiz" : "Sohbete Başla"}
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
        @keyframes pkgEnter { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes bannerSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes sparkle1 { 0%,100% { opacity:0.3; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.2); } }
        @keyframes sparkle2 { 0%,100% { opacity:0.2; transform:scale(0.6) rotate(0deg); } 50% { opacity:0.8; transform:scale(1.1) rotate(180deg); } }
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 0 0 rgba(26,115,232,0.3); } 50% { box-shadow: 0 0 0 8px rgba(26,115,232,0); } }
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
            <ChatSidebar collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed(c => !c)} sessions={sessions} activeId={activeSessionId} onNew={handleNewChat} onSelect={(id) => { setActiveSessionId(id); setMessages([]); setChatCreditsUsed(lockedSessionIds.has(id) ? CREDITS_PER_CHAT : 0); }} userCredits={userCredits} totalCredits={TOTAL_CREDITS} lockedSessionIds={lockedSessionIds} packageName={PACKAGE_NAME} />

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

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {/* Share button */}
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
                                                <>
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
                                                        marginTop: 2
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
                                                {msg.tokenCost != null && (
                                                    <Tooltip title={`Bu yanıt ${msg.tokenCost} token tüketti`} placement="top">
                                                        <span style={{
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            padding: "6px 8px", marginTop: 2, borderRadius: 4,
                                                            cursor: "default",
                                                        }}>
                                                            <TokenIcon size={14} color="#8e8e93" />
                                                        </span>
                                                    </Tooltip>
                                                )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* ── Token Exhausted In-Chat Card ── */}
                        {isOutOfCredits && (
                            <TokenExhaustedChatCard onBuyCredits={handleBuyCredits} />
                        )}

                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* Banners — shown above input */}
                {(isChatNearLimit || isOutOfCredits || isLowGlobalCredits) && (
                    <div style={{ flexShrink: 0, padding: "0 24px 0", marginBottom: -12, zIndex: 5, position: "relative" }}>
                        <div style={{ maxWidth: 780, margin: "0 auto", width: "85%" }}>
                            {isChatNearLimit && <div style={{ width: "95%", margin: "0 auto" }}><ChatLimitWarningBanner remaining={chatCreditsRemaining} onNewChat={handleNewChat} /></div>}
                            {!isChatNearLimit && isOutOfCredits && <div style={{ width: "95%", margin: "0 auto" }}><NoCreditBanner onBuyCredits={handleBuyCredits} /></div>}
                            {!isChatNearLimit && isLowGlobalCredits && !isChatLocked && <div style={{ width: "95%", margin: "0 auto" }}><LowCreditBanner credits={userCredits} onBuyCredits={handleBuyCredits} /></div>}
                        </div>
                    </div>
                )}

                {/* Fixed input at bottom */}
                <div style={{ flexShrink: 0, padding: "0 24px 24px", background: "transparent", zIndex: 10 }}>
                    <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>
                        {/* Hidden file inputs */}
                        <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, "pdf")} />
                        <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, "image")} />

                        {/* Chat locked — replace input with locked card */}
                        {isChatLocked && <ChatLockedCard onNewChat={handleNewChat} canStart={!isOutOfCredits} onBuyCredits={handleBuyCredits} />}

                        {/* Input box */}
                        {!isChatLocked && <div style={{
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
                                overflow: "hidden",
                            }}>
                                {/* Per-chat credit bar */}
                                {(() => {
                                    const pct = Math.min(100, (chatCreditsUsed / CREDITS_PER_CHAT) * 100);
                                    const barColor = isChatLocked ? "#ff4d4f" : isChatNearLimit ? "#faad14" : "#1a73e8";
                                    return (
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 14px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                            <Tooltip title={`Bu sohbette ${chatCreditsUsed}/${CREDITS_PER_CHAT} sorgu kullanıldı. Her sohbet ${CREDITS_PER_CHAT} sorgu rezerve eder.`} placement="top">
                                                <span style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, cursor: "default", color: isChatLocked ? "#ff4d4f" : isChatNearLimit ? "#d48806" : "#5f6368", fontFamily: ds.fonts.family, whiteSpace: "nowrap", fontSize: 12 }}>
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="12" y1="8" x2="12" y2="12" />
                                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                                    </svg>
                                                    {chatCreditsUsed}/{CREDITS_PER_CHAT} sorgu
                                                </span>
                                            </Tooltip>
                                            <Progress
                                                percent={pct}
                                                showInfo={false}
                                                size="small"
                                                strokeColor={barColor}
                                                style={{ flex: 1, margin: 0 }}
                                            />
                                        </div>
                                    );
                                })()}
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
                                            disabled={isThinking || isOutOfCredits || isChatLocked}
                                            placeholder={isOutOfCredits ? 'Kredi satın alarak yeni sohbet başlatın...' : 'Örn: "Pamuklu gömlekler için ithalat...'}
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
                                            disabled={!input.trim() || isThinking || isOutOfCredits || isChatLocked}
                                            onClick={() => sendMessage(input)}
                                            style={{
                                                width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                                                background: (!input.trim() || isThinking || isOutOfCredits || isChatLocked) ? "#f5f5f5" : "#1890ff",
                                                boxShadow: (!input.trim() || isThinking || isOutOfCredits || isChatLocked) ? "none" : "0 2px 4px 0 rgba(24,144,255,0.3)",
                                                border: "none",
                                                cursor: (!input.trim() || isThinking || isOutOfCredits || isChatLocked) ? "not-allowed" : "pointer",
                                                transition: "background 0.15s"
                                            }}
                                            onMouseEnter={e => { if (input.trim() && !isThinking && !isOutOfCredits && !isChatLocked) e.currentTarget.style.background = "#40a9ff"; }}
                                            onMouseLeave={e => { if (input.trim() && !isThinking && !isOutOfCredits && !isChatLocked) e.currentTarget.style.background = "#1890ff"; }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" style={{ transform: "rotate(-45deg)" }}>
                                                <g clipPath="url(#clip_send2)">
                                                    <path d="M0.311839 0.226399C0.369559 0.212434 0.430685 0.218438 0.483714 0.244953L13.554 6.79769C13.6773 6.86025 13.7272 7.01065 13.6663 7.13558C13.6414 7.18229 13.6022 7.22245 13.554 7.24593L0.483714 13.7616C0.358714 13.8225 0.208714 13.7727 0.147777 13.6493C0.121271 13.5978 0.114247 13.5371 0.128246 13.4793L1.47883 7.96859C1.49758 7.88577 1.55871 7.81995 1.63996 7.79183L3.94563 6.99984L1.63801 6.20687C1.55695 6.18031 1.49629 6.11368 1.4759 6.03109L0.128246 0.52718C0.112823 0.463117 0.123375 0.395064 0.157542 0.338703C0.191816 0.282296 0.247758 0.24224 0.311839 0.226399ZM2.45539 5.29964L7.0677 6.8807C7.13324 6.9041 7.16752 6.97433 7.14582 7.03988C7.13334 7.07734 7.10359 7.10548 7.0677 7.118L2.45539 8.70101L1.66926 11.9139L11.4847 7.01937L1.67219 2.09945L2.45539 5.29964Z" fill={(!input.trim() || isThinking || isOutOfCredits || isChatLocked) ? "#9ca3af" : "white"} />
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
                        </div>}
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

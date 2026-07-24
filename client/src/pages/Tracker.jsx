import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionList from "../features/transactions/TransactionList.jsx";
import TransactionForm2 from "../components/TransactionForm2.jsx";
import TransactionList2 from "../features/transactions/TransactionList2.jsx";
import TransactionForm3 from "../components/TransactionForm3.jsx";
import TransactionList3 from "../features/transactions/TransactionList3.jsx";
import TransactionForm4 from "../components/TransactionForm4.jsx";
import TransactionList4 from "../features/transactions/TransactionList4.jsx";
import TransactionForm5 from "../components/TransactionForm5.jsx";
import TransactionList5 from "../features/transactions/TransactionList5.jsx";
import Footer from "../components/Footer.jsx";
import ExportModal from "../components/ExportModal.jsx";
import ImportModal from "../components/ImportModal.jsx";
import { Link, useLocation } from "react-router-dom";
import {
    AreaChart, Area, BarChart, Bar, ResponsiveContainer
} from 'recharts';

const TABS = [
  { id: 1, label: "Suresh To Durai", icon: "🤝" },   // Money Transfer
  { id: 2, label: "Suresh To Swamy", icon: "💰" },   // Payment
  { id: 3, label: "Suresh To Sundar", icon: "📤" },  // Outgoing
  { id: 4, label: "Suresh To Vijay", icon: "🏦" },   // Bank/Settlement
  { id: 5, label: "Travel Expenses", icon: "✈️" },   // Travel
];

const SIDEBAR_LINKS = [
    { label: "Transactions", icon: "💳", to: "/", active: true },
    { label: "Dashboard", icon: "📊", to: "/dashboard" },
    { label: "Quotation Generator", icon: "📊", to: "/quotation-generator" },
    // { label: "Categories", icon: "📁", to: "#" },
    // { label: "Reports", icon: "📈", to: "#" },
    // { label: "Analytics", icon: "🔍", to: "#" },
    // { label: "Settings", icon: "⚙️", to: "#" },
];

/* ── Mini chart mock data ─────────────────────────── */
// const miniIncomeData = [{ v: 40 }, { v: 30 }, { v: 55 }, { v: 35 }, { v: 60 }, { v: 50 }, { v: 70 }, { v: 80 }];
// const miniExpenseData = [{ v: 30 }, { v: 45 }, { v: 25 }, { v: 50 }, { v: 40 }, { v: 60 }, { v: 55 }, { v: 70 }];
// const miniBalanceData = [{ v: 15 }, { v: 20 }, { v: 30 }, { v: 25 }, { v: 45 }, { v: 40 }, { v: 55 }, { v: 65 }];
// const miniCountData = [{ v: 3 }, { v: 5 }, { v: 2 }, { v: 7 }, { v: 4 }, { v: 6 }, { v: 8 }, { v: 5 }];

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE CSS — injected via <style> tag so media queries
   work properly. All selectors are prefixed with .trk- to
   avoid clashing with the existing index.css. Colors are
   driven off CSS variables set on .trk-shell so the palette
   only needs to change in one place.
   ═══════════════════════════════════════════════════════════ */
const RESPONSIVE_CSS = `
/* ── Tokens ────────────────────────────────────────────── */
.trk-shell {
  --bg: #03060f;
  --surface: #0a0f1dcc;
  --surface-solid: #0a0f1d;
  --border-soft: #141b2c;
  --border: #1c2436;
  --text: #f8fafc;
  --text-muted: #8792a8;
  --accent: #6366f1;
  --accent-2: #8b5cf6;
}

/* ── Base / Desktop ────────────────────────────────────── */
.trk-shell {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
  background-image:
    radial-gradient(circle at 12% -5%, rgba(99,102,241,0.16), transparent 40%),
    radial-gradient(circle at 90% 10%, rgba(139,92,246,0.10), transparent 35%);
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
}

/* Sidebar */
.trk-sidebar {
  width: 270px;
  min-height: 100vh;
  background: #0b1120;
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  transition: width 0.3s ease, padding 0.3s ease, transform 0.3s ease;
  position: sticky;
  top: 0;
  align-self: flex-start;
  flex-shrink: 0;
  z-index: 50;
  overflow: hidden;
}

/* Main area */
.trk-main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-y: auto;
  max-height: 100vh;
}

/* Top header */
.trk-top-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 28px;
  border-bottom: 1px solid #141b2c;
  background: linear-gradient(180deg, rgba(10,15,29,0.92), rgba(10,15,29,0.78));
  backdrop-filter: blur(14px);
  position: sticky;
  top: 0;
  z-index: 40;
  gap: 16px;
  box-shadow: 0 8px 24px -18px rgba(0,0,0,0.6);
}

.trk-search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 8px 16px;
  flex: 0 1 380px;
  min-width: 0;
}

.trk-search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #f8fafc;
  font-size: 14px;
  width: 100%;
  min-width: 0;
}

.trk-user-area {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.trk-user-info { display: block; }
.trk-kbd { display: inline-block; }

/* Content */
.trk-content {
  padding: 0px 28px 0px;
  flex: 1;
}

/* Tab nav — floating pill group */
.trk-tab-nav {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 6px;
  border-radius: 16px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.03), 0 10px 30px -20px rgba(0,0,0,0.7);
}

.trk-tab-label { display: inline; }

/* Summary cards */
.trk-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

/* Main form+list grid */
.trk-main-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 24px;
  align-items: start;
  margin-top: 15px;
}

/* Attractive polish for the panel cards that come from index.css —
   scoped so it only affects panels rendered inside this page. */
.trk-content .panel {
  background: linear-gradient(180deg, #0b1120 0%, #0a0e1a 100%);
  border: 1px solid #1b2334;
  border-radius: 16px;
  box-shadow: 0 20px 45px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.02);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.trk-content .panel:hover {
  border-color: #29324a;
  box-shadow: 0 24px 55px -28px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.03);
}
.trk-content .panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.2px;
}
.trk-content .panel-title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2));
  color: #c7d2fe;
  font-size: 13px;
}
.trk-content .download-btn.active {
  background: linear-gradient(135deg, #6366f1, #7c3aed);
  box-shadow: 0 6px 18px -6px rgba(99,102,241,0.55);
  border: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.trk-content .download-btn.active:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px -6px rgba(99,102,241,0.65);
}
.trk-content .download-btn.disabled {
  opacity: 0.45;
}

/* Hamburger */
.trk-hamburger {
  display: none;
  background: none;
  border: none;
  color: #f8fafc;
  font-size: 22px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  flex-shrink: 0;
}
.trk-hamburger:hover { background: #1e293b; }

/* Mobile overlay */
.trk-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 45;
}

/* ── Tablet: 1024px ────────────────────────────────────── */
@media (max-width: 1024px) {
  .trk-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .trk-main-grid {
    grid-template-columns: 1fr;
  }
  .trk-content {
    padding: 20px;
  }
}

/* ── Small tablet / Large phone: 900px ─────────────────── */
@media (max-width: 900px) {
  .trk-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    z-index: 55;
    box-shadow: 4px 0 24px rgba(0,0,0,0.5);
  }
  .trk-sidebar.trk-sidebar-open {
    transform: translateX(0);
  }
  .trk-overlay.trk-overlay-visible {
    display: block;
  }
  .trk-hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .trk-top-header {
    padding: 10px 16px;
  }
  .trk-content {
    padding: 16px;
  }
}

/* ── Phone: 768px ──────────────────────────────────────── */
@media (max-width: 768px) {
  .trk-cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .trk-tab-nav {
    gap: 6px;
  }
  .trk-tab-label {
    display: none;
  }
  .trk-user-info {
    display: none;
  }
  .trk-kbd {
    display: none;
  }
  .trk-search-box {
    flex: 1 1 auto;
  }
  .trk-top-header {
    gap: 10px;
  }
}

/* ── Small phone: 480px ────────────────────────────────── */
@media (max-width: 480px) {
  .trk-cards-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .trk-content {
    padding: 12px;
  }
  .trk-top-header {
    padding: 8px 12px;
  }
  .trk-tab-nav {
    gap: 4px;
    margin-bottom: 16px;
  }
}
`;

function App() {
    const { list: list1 } = useSelector((state) => state.transactions);
    const { list: list2 } = useSelector((state) => state.table2);
    const { list: list3 } = useSelector((state) => state.table3);
    const { list: list4 } = useSelector((state) => state.table4);
    const { list: list5 } = useSelector((state) => state.table5);
    const [open, setOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    // const [sidebarOpen, setSidebarOpen] = useState(false);
    // const [searchQuery, setSearchQuery] = useState("");

    // Close sidebar on route change or resize to desktop
    // const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    // useEffect(() => {
    //     const handleResize = () => {
    //         if (window.innerWidth > 900) closeSidebar();
    //     };
    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, [closeSidebar]);

    // Get data for active tab
    const activeList = activeTab === 1 ? list1 : activeTab === 2 ? list2 : activeTab === 3 ? list3 : activeTab === 4 ? list4 : list5;
    const hasData = activeList && activeList.length > 0;

    // Compute summary stats for active tab
    // const stats = useMemo(() => {
    //     if (!activeList || activeList.length === 0) {
    //         return { totalIncome: 0, totalExpense: 0, netBalance: 0, totalTransactions: 0 };
    //     }
    //     const totalIncome = activeList.reduce((sum, item) => sum + (Number(item.income) || 0), 0);
    //     const totalExpense = activeList.reduce((sum, item) => sum + (Number(item.outgoing) || 0), 0);
    //     return {
    //         totalIncome,
    //         totalExpense,
    //         netBalance: totalIncome - totalExpense,
    //         totalTransactions: activeList.length,
    //     };
    // }, [activeList]);

    // const projectedMargin = stats.totalIncome > 0
    //     ? ((stats.netBalance / stats.totalIncome) * 100).toFixed(0)
    //     : 0;

    // const formatCurrency = (amount) =>
    //     new Intl.NumberFormat("en-IN", {
    //         style: "currency",
    //         currency: "INR",
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2,
    //     }).format(amount);

    // Render form based on active tab
    const renderForm = () => {
        if (activeTab === 1) return <TransactionForm />;
        if (activeTab === 2) return <TransactionForm2 />;
        if (activeTab === 3) return <TransactionForm3 />;
        if (activeTab === 4) return <TransactionForm4 />;
        return <TransactionForm5 />;
    };

    // Render list based on active tab
    const renderList = () => {
        if (activeTab === 1) return <TransactionList />;
        if (activeTab === 2) return <TransactionList2 />;
        if (activeTab === 3) return <TransactionList3 />;
        if (activeTab === 4) return <TransactionList4 />;
        return <TransactionList5 />;
    };

    /* ── Reusable inline pieces ─────────────────────── */
    // const avatarStyle = {
    //     width: '36px', height: '36px', borderRadius: '50%',
    //     background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    //     display: 'flex', alignItems: 'center', justifyContent: 'center',
    //     fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0,
    // };

    // const cardStyle = {
    //     background: '#0b1120', border: '1px solid #1e293b',
    //     borderRadius: '12px', padding: '20px', position: 'relative',
    //     overflow: 'hidden', display: 'flex', flexDirection: 'column',
    // };

    // const sidebarLinkStyle = (isActive) => ({
    //     display: 'flex', alignItems: 'center', gap: '12px',
    //     padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
    //     fontWeight: isActive ? 600 : 400,
    //     color: isActive ? '#f8fafc' : '#94a3b8',
    //     background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
    //     textDecoration: 'none', marginBottom: '4px',
    //     transition: 'all 0.2s', whiteSpace: 'nowrap', cursor: 'pointer',
    // });

    const tabBtnStyle = (isActive) => ({
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 22px', borderRadius: '11px', border: 'none',
        fontSize: '14px', fontWeight: isActive ? 600 : 400,
        color: isActive ? '#fff' : '#94a3b8',
        background: isActive
            ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
            : 'transparent',
        cursor: 'pointer', transition: 'all 0.25s ease',
        boxShadow: isActive ? '0 6px 18px -4px rgba(99,102,241,0.45)' : 'none',
        whiteSpace: 'nowrap',
    });

    return (
        <>
            {/* Inject responsive CSS */}
            <style>{RESPONSIVE_CSS}</style>

            <div className="trk-shell">

                {/* ═══ MOBILE OVERLAY ═════════════════════════════ */}
                {/* <div
                    className={`trk-overlay ${sidebarOpen ? 'trk-overlay-visible' : ''}`}
                    onClick={closeSidebar}
                /> */}

                {/* ═══ LEFT SIDEBAR ═══════════════════════════════ */}
                {/* <aside className={`trk-sidebar ${sidebarOpen ? 'trk-sidebar-open' : ''}`}>
                   
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px', whiteSpace: 'nowrap' }}>
                        <div style={{
                            width: '38px', height: '38px', minWidth: '38px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px', fontWeight: 800, color: '#fff',
                            boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
                        }}>₹</div>
                        <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>Expense Tracker</div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Track income & expenses effortlessly</div>
                        </div>
                    </div>

                    
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {SIDEBAR_LINKS.map((link) => (
                            <Link key={link.label} to={link.to} style={sidebarLinkStyle(link.active)} onClick={closeSidebar}>
                                <span style={{ fontSize: '18px', minWidth: '24px', textAlign: 'center' }}>{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </nav>

                    
                    <div style={{ marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '8px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏗️</div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#818cf8' }}>Sri Maruthi</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>Constructions</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0' }}>
                            <div style={avatarStyle}>S</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>Suresh</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>Admin</div>
                            </div>
                            <span style={{ color: '#64748b', fontSize: '14px', cursor: 'pointer' }}>▾</span>
                        </div>
                    </div>
                </aside> */}

                {/* ═══ MAIN CONTENT AREA ═════════════════════════ */}
                <div className="trk-main-area">

                    {/* ── Top Header ─────────────────────────────── */}
                    <header className="trk-top-header">
                        
                         <div className="trk-tab-nav">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    style={tabBtnStyle(activeTab === tab.id)}
                                    onClick={() => setActiveTab(tab.id)}
                                    onMouseEnter={(e) => { if (activeTab !== tab.id) e.currentTarget.style.background = '#1e293b'; }}
                                    onMouseLeave={(e) => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <span>{tab.icon}</span>
                                    <span className="trk-tab-label">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </header>

                    {/* ── Content Area ───────────────────────────── */}
                    <div className="trk-content">

                        {/* Tab Navigation */}
                       

                        {/* ── Summary Cards ───────────────────────── */}
                        {/* <div className="trk-cards-grid">

                           
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', zIndex: 1 }}>
                                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '10px', borderRadius: '10px', flexShrink: 0 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#10b981', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>Total Income</p>
                                        <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#f8fafc', wordBreak: 'break-all' }}>{formatCurrency(stats.totalIncome)}</h3>
                                    </div>
                                </div>
                                <p style={{ fontSize: '12px', color: '#10b981', margin: '8px 0 0 50px', zIndex: 1 }}>▲ 18.3% from last month</p>
                                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '55%', height: '60px', zIndex: 0 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={miniIncomeData}>
                                            <defs><linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
                                            <Area type="monotone" dataKey="v" stroke="#10b981" fillOpacity={1} fill="url(#gIncome)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                           
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', zIndex: 1 }}>
                                    <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '10px', borderRadius: '10px', flexShrink: 0 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#f43f5e', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>Total Expense</p>
                                        <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#f8fafc', wordBreak: 'break-all' }}>{formatCurrency(stats.totalExpense)}</h3>
                                    </div>
                                </div>
                                <p style={{ fontSize: '12px', color: '#f43f5e', margin: '8px 0 0 50px', zIndex: 1 }}>▲ 3.6% from last month</p>
                                <div style={{ position: 'absolute', bottom: 10, right: 16, width: '35%', height: '50px', zIndex: 0 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={miniExpenseData}>
                                            <Bar dataKey="v" fill="#f43f5e" radius={[2, 2, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                           
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', zIndex: 1 }}>
                                    <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', padding: '10px', borderRadius: '10px', flexShrink: 0 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                    </div>
                                    <div style={{ zIndex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#818cf8', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>Net Balance</p>
                                        <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#f8fafc', wordBreak: 'break-all' }}>{formatCurrency(stats.netBalance)}</h3>
                                    </div>
                                </div>
                                <div style={{ margin: '8px 0 0 50px', zIndex: 1 }}>
                                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 5px 0' }}>Projected Margin: {projectedMargin}%</p>
                                    <div style={{ width: '90px', height: '5px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                                        <div style={{ width: `${Math.min(Math.max(projectedMargin, 0), 100)}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #818cf8)' }}></div>
                                    </div>
                                    <p style={{ fontSize: '11px', color: '#818cf8', margin: 0 }}>Positive</p>
                                </div>
                                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '45%', height: '70px', zIndex: 0 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={miniBalanceData}>
                                            <defs><linearGradient id="gBalance" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
                                            <Area type="monotone" dataKey="v" stroke="#6366f1" fillOpacity={1} fill="url(#gBalance)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', zIndex: 1 }}>
                                    <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '10px', borderRadius: '10px', flexShrink: 0 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#a855f7', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>Total Transactions</p>
                                        <h3 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>{stats.totalTransactions}</h3>
                                    </div>
                                </div>
                                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 50px', zIndex: 1 }}>This Month</p>
                                <div style={{ position: 'absolute', bottom: 10, right: 16, width: '35%', height: '50px', zIndex: 0 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={miniCountData}>
                                            <Bar dataKey="v" fill="#a855f7" radius={[2, 2, 0, 0]} opacity={0.6} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div> */}

                        {/* ── Main Grid: Form + Transaction History ── */}
                        <div className="trk-main-grid">

                            {/* Left – Add Transaction */}
                            <aside className="panel panel-form">
                                <h2 className="panel-title">
                                    <span className="panel-title-icon">+</span>
                                    Add Transaction
                                </h2>
                                {renderForm()}
                            </aside>

                            {/* Right – History */}
                            <section className="panel panel-list">

                                {/* Header with Download & Import */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "baseline",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                }}>
                                    <h2 className="panel-title">
                                        <span className="panel-title-icon">⇆</span>
                                        Transaction History
                                    </h2>

                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                        <button
                                            onClick={() => setImportModalOpen(true)}
                                            className="download-btn active"
                                            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                                        >
                                            📥 Import
                                        </button>
                                        <button
                                            disabled={!hasData}
                                            onClick={() => setOpen(true)}
                                            className={`download-btn ${hasData ? "active" : "disabled"}`}
                                        >
                                            ⬇ Download
                                        </button>
                                    </div>
                                </div>

                                {renderList()}
                            </section>

                        </div>
                    </div>

                    <Footer />
                </div>

                {/* Popup Modals */}
                {open && (
                    <ExportModal onClose={() => setOpen(false)} data={activeList} />
                )}
                {importModalOpen && (
                    <ImportModal onClose={() => setImportModalOpen(false)} activeTab={activeTab} />
                )}
            </div>
        </>
    );
}

export default App;

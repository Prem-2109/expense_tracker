import React, { useState } from "react";
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
import { Link } from "react-router-dom";

const TABS = [
  { id: 1, label: "Suresh To Durai", icon: "🤝" },   // Money Transfer
  { id: 2, label: "Suresh To Swamy", icon: "💰" },   // Payment
  { id: 3, label: "Suresh To Sundar", icon: "📤" },  // Outgoing
  { id: 4, label: "Suresh To Vijay", icon: "🏦" },   // Bank/Settlement
  { id: 5, label: "Travel Expenses", icon: "✈️" },   // Travel
];

function App() {
    const { list: list1 } = useSelector((state) => state.transactions);
    const { list: list2 } = useSelector((state) => state.table2);
    const { list: list3 } = useSelector((state) => state.table3);
    const { list: list4 } = useSelector((state) => state.table4);
    const { list: list5 } = useSelector((state) => state.table5);
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Get data for active tab
    const activeList = activeTab === 1 ? list1 : activeTab === 2 ? list2 : activeTab === 3 ? list3 : activeTab === 4 ? list4 : list5;
    const hasData = activeList && activeList.length > 0;

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

    return (
        <div className="app-shell">
            {/* ── Tab Navigation ───────────────────────────────── */}
            <nav className="tab-nav">
                <div className="tab-nav-inner">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? "tab-active" : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* ── Main Layout ──────────────────────── */}
            <main className="app-main">
                <div className="app-grid">

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

                        {/* 🔥 Header with Download */}
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: "10px"
                        }}>
                            <h2 className="panel-title">
                                <span className="panel-title-icon">⇆</span>
                                Transaction History
                            </h2>

                            <button
                                disabled={!hasData}
                                onClick={() => setOpen(true)}
                                className={`download-btn ${hasData ? "active" : "disabled"}`}
                            >
                                ⬇ Download
                            </button>
                        </div>

                        {renderList()}
                    </section>

                </div>
            </main>

            {/* Popup Modal */}
            {open && (
                <ExportModal onClose={() => setOpen(false)} data={activeList} />
            )}

            <Footer />
        </div>
    );
}

export default App;
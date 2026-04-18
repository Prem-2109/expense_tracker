import React, { useState } from "react";
import { useSelector } from "react-redux";
import TransactionForm from "./components/TransactionForm.jsx";
import TransactionList from "./features/transactions/TransactionList.jsx";
import Footer from "./components/Footer.jsx";
import ExportModal from "./components/ExportModal.jsx";

function App() {
  const { list } = useSelector((state) => state.transactions);
  const [open, setOpen] = useState(false);

  const hasData = list && list.length > 0;

  return (
    <div className="app-shell">

      {/* ── Header ───────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <div className="logo-icon">₹</div>
            <div>
              <h1 className="header-title">Expense Tracker</h1>
              <p className="header-subtitle">
                Track income & expenses effortlessly
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout ───────────────────────────────────── */}
      <main className="app-main">
        <div className="app-grid">

          {/* Left – Add Transaction */}
          <aside className="panel panel-form">
            <h2 className="panel-title">
              <span className="panel-title-icon">+</span>
              Add Transaction
            </h2>
            <TransactionForm />
          </aside>

          {/* Right – History */}
          <section className="panel panel-list">

            {/* 🔥 Header with Download */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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

            <TransactionList />
          </section>

        </div>
      </main>

      {/* Popup Modal */}
      {open && (
        <ExportModal onClose={() => setOpen(false)} data={list} />
      )}

      <Footer />
    </div>
  );
}

export default App;
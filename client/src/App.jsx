import React from "react";
import TransactionForm from "./components/TransactionForm.jsx";
import TransactionList from "./features/transactions/TransactionList.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div className="app-shell">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <div className="logo-icon">₹</div>
            <div>
              <h1 className="header-title">Expense Tracker</h1>
              <p className="header-subtitle">Track income & expenses effortlessly</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout ────────────────────────────────────────────────────── */}
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
            <h2 className="panel-title">
              <span className="panel-title-icon">⇆</span>
              Transaction History
            </h2>
            <TransactionList />
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;

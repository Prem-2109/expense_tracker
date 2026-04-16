import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, deleteTransaction } from "./transactionSlice.js";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function TransactionList() {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Sort by sno ascending
  const sortedList = [...list]
    .sort((a, b) => (a.sno ?? Infinity) - (b.sno ?? Infinity))
    .map((item, index) => ({
      ...item,
      sno: index + 1,
    }));

  const totalIncome = sortedList.reduce((s, t) => s + t.income, 0);
  const totalExpense = sortedList.reduce((s, t) => s + t.outgoing, 0);
  const netBalance = totalIncome - totalExpense;

  // ── Empty State ──────────────────────────────────────────────────────────────
  if (sortedList.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg width="32" height="32" fill="none" stroke="#6366f1" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6M4 6h16M4 18h16" />
          </svg>
        </div>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#e2e8f0", marginBottom: "6px" }}>
          No transactions yet
        </h3>
        <p style={{ fontSize: "0.8rem", color: "#475569" }}>
          Add your first transaction using the form.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Summary Cards ──────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>

        <div className="stat-card stat-card-income">
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6ee7b7", marginBottom: "6px" }}>
            Income
          </p>
          <p style={{ fontSize: "1.15rem", fontWeight: 800, color: "#d1fae5" }}>
            {formatCurrency(totalIncome)}
          </p>
        </div>

        <div className="stat-card stat-card-expense">
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#fda4af", marginBottom: "6px" }}>
            Expense
          </p>
          <p style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fecdd3" }}>
            {formatCurrency(totalExpense)}
          </p>
        </div>

        <div className="stat-card stat-card-balance">
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#a5b4fc", marginBottom: "6px" }}>
            Balance
          </p>
          <p style={{
            fontSize: "1.15rem",
            fontWeight: 800,
            color: netBalance >= 0 ? "#c7d2fe" : "#fecdd3",
          }}>
            {formatCurrency(netBalance)}
          </p>
        </div>

      </div>

      {/* ── Table ──────────────────────────────────────────────────────────────── */}
      <div style={{ overflowX: "auto", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <table className="et-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center", width: "60px" }}>#</th>
              <th style={{ textAlign: "left" }}>Description</th>
              <th style={{ textAlign: "right" }}>Income</th>
              <th style={{ textAlign: "right" }}>Expense</th>
              <th style={{ textAlign: "right" }}>Balance</th>
              <th style={{ textAlign: "center", width: "60px" }}>Del</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let running = 0;
              return sortedList.map((tx) => {
                running += tx.income - tx.outgoing;
                return (
                  <tr key={tx._id}>
                    {/* S.No */}
                    <td style={{ textAlign: "center" }}>
                      <span className="sno-badge">{tx.sno ?? "—"}</span>
                    </td>

                    {/* Description */}
                    <td>
                      <span
                        title={tx.description}
                        style={{
                          display: "block",
                          maxWidth: "180px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "#e2e8f0",
                          fontWeight: 500,
                        }}
                      >
                        {tx.description}
                      </span>
                    </td>

                    {/* Income */}
                    <td style={{ textAlign: "right" }}>
                      {tx.income > 0 ? (
                        <span style={{ color: "#34d399", fontWeight: 600 }}>
                          +{formatCurrency(tx.income)}
                        </span>
                      ) : (
                        <span style={{ color: "#334155" }}>—</span>
                      )}
                    </td>

                    {/* Expense */}
                    <td style={{ textAlign: "right" }}>
                      {tx.outgoing > 0 ? (
                        <span style={{ color: "#fb7185", fontWeight: 600 }}>
                          -{formatCurrency(tx.outgoing)}
                        </span>
                      ) : (
                        <span style={{ color: "#334155" }}>—</span>
                      )}
                    </td>

                    {/* Running Balance */}
                    <td style={{ textAlign: "right" }}>
                      <span style={{ fontWeight: 700, color: running >= 0 ? "#818cf8" : "#f43f5e" }}>
                        {formatCurrency(running)}
                      </span>
                    </td>

                    {/* Delete */}
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="et-delete-btn"
                        onClick={() => dispatch(deleteTransaction(tx._id))}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>

    </div>
  );
}
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTransaction } from "../features/transactions/transactionSlice.js";

export default function TransactionForm() {
  const [form, setForm] = useState({
    description: "",
    income: "",
    outgoing: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addTransaction({
        description: form.description,
        income: +form.income || 0,
        outgoing: +form.outgoing || 0,
      })
    );
    setForm({ description: "", income: "", outgoing: "" });
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#94a3b8",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      
      {/* Description */}
      <div>
        <label htmlFor="description" style={labelStyle}>Description</label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="e.g. Salary, Groceries…"
          value={form.description}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>

      {/* ✅ ONLY CHANGE HERE */}
      <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        
        <div>
          <label htmlFor="income" style={labelStyle}>Income 💰</label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#34d399",
              fontWeight: 700,
              fontSize: "0.85rem"
            }}>₹</span>
            <input
              id="income"
              name="income"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.income}
              onChange={handleChange}
              className="input-field"
              style={{ paddingLeft: "28px" }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="outgoing" style={labelStyle}>Expense 💸</label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#fb7185",
              fontWeight: 700,
              fontSize: "0.85rem"
            }}>₹</span>
            <input
              id="outgoing"
              name="outgoing"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.outgoing}
              onChange={handleChange}
              className="input-field"
              style={{ paddingLeft: "28px" }}
            />
          </div>
        </div>

      </div>

      {/* Submit */}
      <button type="submit" className="btn-primary" style={{ marginTop: "4px" }}>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Transaction
      </button>

      {/* Tips */}
      <div style={{
        marginTop: "4px",
        padding: "12px 14px",
        background: "rgba(99,102,241,0.07)",
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: "10px",
      }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#818cf8", marginBottom: "6px" }}>
          💡 Quick Tips
        </p>
        <ul style={{ fontSize: "0.72rem", color: "#64748b", lineHeight: 1.6, paddingLeft:"5%" }}>
          <li>Enter income and expenses separately</li>
          <li>Use descriptive names for easier tracking</li>
          <li>Keep transactions up to date</li>
        </ul>
      </div>

    </form>
  );
}
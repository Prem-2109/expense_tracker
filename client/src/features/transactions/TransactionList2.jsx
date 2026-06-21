import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTable2, deleteTable2, updateTable2 } from "./table2Slice.js";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function TransactionList2() {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.table2);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ description: "", income: "", outgoing: "" });

  useEffect(() => {
    dispatch(fetchTable2());
  }, [dispatch]);

  const handleStartEdit = (tx) => {
    setEditingId(tx._id);
    setEditForm({
      description: tx.description,
      income: tx.income || "",
      outgoing: tx.outgoing || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id) => {
    dispatch(
      updateTable2({
        id,
        data: {
          description: editForm.description.trim(),
          income: Number(editForm.income) || 0,
          outgoing: Number(editForm.outgoing) || 0,
        },
      })
    );

    setEditingId(null);
  };

  const sortedList = [...list].sort(
    (a, b) => (a.sno ?? Infinity) - (b.sno ?? Infinity)
  );

  let visibleSno = 1;

  const processedList = sortedList.map((item) => {
    const isHeading =
      item.description?.trim() &&
      (!item.income || Number(item.income) === 0) &&
      (!item.outgoing || Number(item.outgoing) === 0);

    return {
      ...item,
      sno: isHeading ? "" : visibleSno++,
      isHeading,
    };
  });

  const totalIncome = processedList.reduce(
    (s, t) => s + (Number(t.income) || 0),
    0
  );
  const totalExpense = processedList.reduce(
    (s, t) => s + (Number(t.outgoing) || 0),
    0
  );
  const netBalance = totalIncome - totalExpense;

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

      {/* ✅ ONLY CHANGE HERE */}
      <div className="summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>

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

      {/* TABLE */}
      <div style={{ overflowX: "auto", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <table className="et-table">
          <thead>
            <tr>
              <th>S.no</th>
              <th>Description</th>
              <th style={{ textAlign: "right" }}>Income</th>
              <th style={{ textAlign: "right" }}>Expense</th>
              <th style={{ textAlign: "right" }}>Balance</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let running = 0;

              return processedList.map((tx) => {
                const isEditing = tx._id === editingId;

                const isHeading = tx.isHeading;

                // HEADING ROW
                if (isHeading && !isEditing) {
                  return (
                    <tr key={tx._id}>
                      <td
                        colSpan={5}
                        style={{
                          background: "#4a73bd",
                          color: "#fff",
                          fontWeight: "700",
                          textAlign: "center",
                          padding: "12px",
                          textTransform: "uppercase",
                        }}
                      >
                        {tx.description}
                      </td>

                      <td
                        style={{
                          background: "#4a73bd",
                          textAlign: "center",
                        }}
                      >
                        <button
                          className="et-edit-btn"
                          onClick={() => handleStartEdit(tx)}
                        >
                          ✏️
                        </button>

                        <button
                          className="et-delete-btn"
                          onClick={() => dispatch(deleteTable2(tx._id))}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                }

                running += (tx.income || 0) - (tx.outgoing || 0);

                return (
                  <tr key={tx._id}>
                    <td>
                      {tx.sno && <span className="sno-badge">{tx.sno}</span>}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          className="et-edit-input"
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          required
                        />
                      ) : (
                        tx.description
                      )}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      {isEditing ? (
                        <input
                          type="number"
                          className="et-edit-input"
                          style={{ textAlign: "right" }}
                          value={editForm.income}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              income: e.target.value,
                            })
                          }
                          placeholder="0"
                        />
                      ) : tx.income > 0 ? (
                        `+${formatCurrency(tx.income)}`
                      ) : (
                        "—"
                      )}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      {isEditing ? (
                        <input
                          type="number"
                          className="et-edit-input"
                          style={{ textAlign: "right" }}
                          value={editForm.outgoing}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              outgoing: e.target.value,
                            })
                          }
                          placeholder="0"
                        />
                      ) : tx.outgoing > 0 ? (
                        `-${formatCurrency(tx.outgoing)}`
                      ) : (
                        "—"
                      )}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      {formatCurrency(running)}
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {isEditing ? (
                          <>
                            <button
                              className="et-save-btn"
                              onClick={() => handleSaveEdit(tx._id)}
                              title="Save"
                            >
                              💾
                            </button>

                            <button
                              className="et-cancel-btn"
                              onClick={handleCancelEdit}
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="et-edit-btn"
                              onClick={() => handleStartEdit(tx)}
                              title="Edit"
                            >
                              ✏️
                            </button>

                            <button
                              className="et-delete-btn"
                              onClick={() => dispatch(deleteTable2(tx._id))}
                              title="Delete"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
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

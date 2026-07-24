import React, { useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import { importTransactions, verifyImport } from "../features/transactions/transactionSlice";
import { importTable2, verifyImportTable2 } from "../features/transactions/table2Slice";
import { importTable3, verifyImportTable3 } from "../features/transactions/table3Slice";
import { importTable4, verifyImportTable4 } from "../features/transactions/table4Slice";
import { importTable5, verifyImportTable5 } from "../features/transactions/table5Slice";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const TAB_NAMES = {
  1: "Suresh To Durai",
  2: "Suresh To Swamy",
  3: "Suresh To Sundar",
  4: "Suresh To Vijay",
  5: "Travel Expenses",
};

export default function ImportModal({ onClose, activeTab = 5, tabName }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const currentTabName = tabName || TAB_NAMES[activeTab] || `Tab ${activeTab}`;

  const [fileName, setFileName] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    count: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Helper to get the verify thunk based on activeTab
  const getVerifyThunk = useCallback(() => {
    if (activeTab === 1) return verifyImport;
    if (activeTab === 2) return verifyImportTable2;
    if (activeTab === 3) return verifyImportTable3;
    if (activeTab === 4) return verifyImportTable4;
    return verifyImportTable5;
  }, [activeTab]);

  // Helper to get the import thunk based on activeTab
  const getImportThunk = useCallback(() => {
    if (activeTab === 1) return importTransactions;
    if (activeTab === 2) return importTable2;
    if (activeTab === 3) return importTable3;
    if (activeTab === 4) return importTable4;
    return importTable5;
  }, [activeTab]);

  // Build a Set of duplicate keys for quick lookup: "desc|income|outgoing"
  const duplicateKeys = verifyResult
    ? new Set(
        verifyResult.duplicates.map(
          (d) =>
            `${String(d.description || "").trim().toLowerCase()}|${Number(d.income) || 0}|${Number(d.outgoing) || 0}`
        )
      )
    : new Set();

  const isDuplicateRow = (row) => {
    if (!verifyResult || verifyResult.duplicateCount === 0) return false;
    const key = `${String(row.description || "").trim().toLowerCase()}|${Number(row.income) || 0}|${Number(row.outgoing) || 0}`;
    return duplicateKeys.has(key);
  };

  // Auto-verify after parsing data
  const autoVerify = useCallback(
    async (items) => {
      if (!items || items.length === 0) return;

      setIsVerifying(true);
      setVerifyResult(null);
      setErrorMsg("");

      try {
        const payload = items
          .filter((item) => !item.isHeading)
          .map((item) => ({
            description: item.description,
            income: item.income,
            outgoing: item.outgoing,
          }));

        if (payload.length === 0) {
          setIsVerifying(false);
          return;
        }

        const verifyThunk = getVerifyThunk();
        const result = await dispatch(verifyThunk(payload)).unwrap();
        setVerifyResult(result);

        if (result.duplicateCount > 0) {
          setErrorMsg(
            `⚠️ Found ${result.duplicateCount} duplicate record(s) that already exist in the database. Review highlighted rows below.`
          );
        }
      } catch (err) {
        console.error("Verify failed:", err);
        // Non-blocking - just log the error, user can still import
      } finally {
        setIsVerifying(false);
      }
    },
    [dispatch, getVerifyThunk]
  );

  const processRows = (rows) => {
    if (!rows || rows.length === 0) {
      setErrorMsg("The selected file contains no readable data.");
      return;
    }

    // Try to find header row index
    let headerRowIdx = -1;
    let descCol = -1;
    let incomeCol = -1;
    let expenseCol = -1;

    for (let r = 0; r < Math.min(rows.length, 15); r++) {
      const row = rows[r];
      if (!Array.isArray(row)) continue;

      row.forEach((cell, cIdx) => {
        if (cell === null || cell === undefined) return;
        const str = String(cell).trim().toLowerCase();
        if (
          ["description", "particulars", "details", "name", "title", "item", "desc"].includes(str)
        ) {
          descCol = cIdx;
          headerRowIdx = r;
        }
        if (
          ["income", "credit", "received", "amount in", "in", "cr"].includes(str)
        ) {
          incomeCol = cIdx;
          headerRowIdx = r;
        }
        if (
          ["expense", "outgoing", "debit", "spent", "amount out", "out", "dr", "paid"].includes(str)
        ) {
          expenseCol = cIdx;
          headerRowIdx = r;
        }
      });

      if (descCol !== -1 && (incomeCol !== -1 || expenseCol !== -1)) {
        break;
      }
    }

    let startDataRow = headerRowIdx !== -1 ? headerRowIdx + 1 : 0;
    // Default column fallback if headers not found explicitly
    if (descCol === -1) descCol = 1; // Col 2 often Description (after S.No)
    if (incomeCol === -1) incomeCol = 2;
    if (expenseCol === -1) expenseCol = 3;

    let runningBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    let visibleSno = 1;
    const items = [];

    for (let i = startDataRow; i < rows.length; i++) {
      const row = rows[i];
      if (!Array.isArray(row) || row.length === 0) continue;

      // Extract raw values
      const rawDesc = row[descCol] !== undefined ? String(row[descCol]).trim() : "";

      // Skip empty row or title header like "Expense Tracker Report"
      if (!rawDesc) continue;
      const lowerDesc = rawDesc.toLowerCase();
      if (lowerDesc.includes("expense tracker") || lowerDesc === "total income" || lowerDesc === "total expense" || lowerDesc === "net balance" || lowerDesc === "description") {
        continue;
      }

      const rawIncome = row[incomeCol];
      const rawExpense = row[expenseCol];

      const incomeNum = typeof rawIncome === "number" ? rawIncome : parseFloat(String(rawIncome || "").replace(/[^0-9.-]+/g, "")) || 0;
      const expenseNum = typeof rawExpense === "number" ? rawExpense : parseFloat(String(rawExpense || "").replace(/[^0-9.-]+/g, "")) || 0;

      const isHeading = rawDesc.length > 0 && incomeNum === 0 && expenseNum === 0;

      if (!isHeading) {
        runningBalance += (incomeNum - expenseNum);
        totalIncome += incomeNum;
        totalExpense += expenseNum;
      }

      items.push({
        sno: isHeading ? "" : visibleSno++,
        description: rawDesc,
        income: incomeNum,
        outgoing: expenseNum,
        balance: runningBalance,
        isHeading,
      });
    }

    if (items.length === 0) {
      setErrorMsg("Could not parse any valid transaction rows from the file.");
      return;
    }

    setErrorMsg("");
    setParsedData(items);
    setVerifyResult(null);
    setSummary({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      count: items.filter(t => !t.isHeading).length,
    });

    // Auto-verify against existing DB records
    autoVerify(items);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg("");
    setSuccessMsg("");
    setVerifyResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];

        const rawJson = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        processRows(rawJson);
      } catch (err) {
        console.error("Excel Read Error:", err);
        setErrorMsg("Failed to read Excel file. Please ensure it is a valid .xlsx, .xls, or .csv file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = async () => {
    if (parsedData.length === 0) return;

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = parsedData
        .filter((item) => !item.isHeading)
        .map((item) => ({
          description: item.description,
          income: item.income,
          outgoing: item.outgoing,
        }));

      const actionThunk = getImportThunk();
      const result = await dispatch(
        actionThunk({ data: payload, skipDuplicates })
      ).unwrap();

      const totalCount = payload.length;
      const insertedCount = result.inserted ? result.inserted.length : totalCount;
      const skippedCount = result.skipped || 0;

      if (skippedCount > 0) {
        setSuccessMsg(
          `✅ Successfully imported ${insertedCount} entries into ${currentTabName}! (${skippedCount} duplicate(s) skipped)`
        );
      } else {
        setSuccessMsg(
          `✅ Successfully imported ${insertedCount} entries into ${currentTabName}!`
        );
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Import failed:", err);
      setErrorMsg(err.message || "Failed to import transactions to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadSampleTemplate = () => {
    const wsData = [
      ["S.No", "Description", "Income", "Expense"],
      ["", `${currentTabName.toUpperCase()} TRANSACTIONS`, 0, 0],
      [1, "Sample Income Advance", 25000, 0],
      [2, "Sample Expense Entry", 0, 4500],
      [3, "Office Maintenance & Materials", 0, 1200],
      ["", "PHASE 2 SUMMARY", 0, 0],
      [4, "Payment Received", 10000, 0],
      [5, "Transport / Courier Expense", 0, 850],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    const cleanSheetName = currentTabName.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 30);
    XLSX.utils.book_append_sheet(wb, ws, cleanSheetName);
    XLSX.writeFile(wb, `${cleanSheetName}_Import_Sample.xlsx`);
  };

  const effectiveNewCount = verifyResult
    ? verifyResult.newCount
    : parsedData.filter((t) => !t.isHeading).length;

  const effectiveDuplicateCount = verifyResult ? verifyResult.duplicateCount : 0;

  return (
    <div className="modal-overlay" style={{ backdropFilter: "blur(8px)" }}>
      <div
        className="modal-box"
        style={{
          width: "90%",
          maxWidth: "920px",
          maxHeight: "90vh",
          overflowY: "auto",
          textAlign: "left",
          background: "#0a0f1d",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
          borderRadius: "20px",
          padding: "28px",
        }}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "#f8fafc", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5rem" }}>📥</span> Import Excel: {currentTabName}
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: "#94a3b8" }}>
              Upload your Excel file (.xlsx, .xls, .csv). Running balances will be automatically calculated.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: "2px dashed #6366f1",
            borderRadius: "14px",
            padding: "24px",
            textAlign: "center",
            background: "rgba(99, 102, 241, 0.04)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            marginBottom: "20px",
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            style={{ display: "none" }}
          />
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📊</div>
          <p style={{ margin: 0, fontWeight: 600, color: "#e2e8f0", fontSize: "0.95rem" }}>
            {fileName ? `File Selected: ${fileName}` : "Click to browse or drop your Excel file here"}
          </p>
          <p style={{ margin: "6px 0 0 0", fontSize: "0.78rem", color: "#64748b" }}>
            Supports .xlsx, .xls, .csv files with Description, Income, and Expense columns
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              downloadSampleTemplate();
            }}
            style={{
              marginTop: "12px",
              background: "transparent",
              border: "none",
              color: "#818cf8",
              fontSize: "0.78rem",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            📥 Download Sample Excel Template
          </button>
        </div>

        {/* Verifying Spinner */}
        {isVerifying && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(99, 102, 241, 0.12)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "10px",
              color: "#a5b5fc",
              fontSize: "0.85rem",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ display: "inline-block", animation: "spin 1s linear infinite", fontSize: "1rem" }}>⟳</span>
            Verifying against existing database records...
          </div>
        )}

        {/* Duplicate Warning Banner */}
        {verifyResult && verifyResult.duplicateCount > 0 && (
          <div
            style={{
              padding: "14px 16px",
              background: "rgba(251, 191, 36, 0.12)",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              borderRadius: "10px",
              color: "#fcd34d",
              fontSize: "0.85rem",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "1.2rem" }}>⚠️</span>
              <strong>{verifyResult.duplicateCount} duplicate record(s) found</strong>
              <span style={{ color: "#94a3b8", marginLeft: "auto" }}>
                {verifyResult.newCount} new · {verifyResult.duplicateCount} duplicates · {verifyResult.total} total
              </span>
            </div>
            <div style={{ marginTop: "6px", maxHeight: "80px", overflowY: "auto", fontSize: "0.78rem", color: "#d4d4d8" }}>
              {verifyResult.duplicates.slice(0, 10).map((d, i) => (
                <div key={i} style={{ padding: "2px 0" }}>
                  • "{d.description}" — Income: {formatCurrency(Number(d.income) || 0)}, Expense: {formatCurrency(Number(d.outgoing) || 0)}
                </div>
              ))}
              {verifyResult.duplicates.length > 10 && (
                <div style={{ color: "#64748b", padding: "2px 0" }}>
                  ...and {verifyResult.duplicates.length - 10} more
                </div>
              )}
            </div>
            {/* Skip Duplicates Toggle */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "12px",
                padding: "8px 12px",
                background: "rgba(0,0,0,0.2)",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={skipDuplicates}
                onChange={(e) => setSkipDuplicates(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "#fbbf24" }}
              />
              <span style={{ color: "#e2e8f0", fontSize: "0.85rem" }}>
                Skip duplicates — only import <strong>{verifyResult.newCount} new</strong> record(s)
              </span>
              {!skipDuplicates && (
                <span style={{ marginLeft: "auto", color: "#fca5a5", fontSize: "0.78rem" }}>
                  Will import all {verifyResult.total} records (including duplicates)
                </span>
              )}
            </label>
          </div>
        )}

        {/* Feedback Messages */}
        {errorMsg && !isVerifying && !verifyResult?.duplicateCount && (
          <div style={{ padding: "12px 16px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", color: "#fca5a5", fontSize: "0.85rem", marginBottom: "16px" }}>
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ padding: "12px 16px", background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "10px", color: "#86efac", fontSize: "0.85rem", marginBottom: "16px" }}>
            ✅ {successMsg}
          </div>
        )}

        {/* Calculated Summary Cards & Preview */}
        {parsedData.length > 0 && (
          <div>
            <h4 style={{ fontSize: "0.9rem", color: "#cbd5e1", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Calculated Balance Summary
            </h4>

            {/* 4 Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
              <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "14px", borderRadius: "12px" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "#6ee7b7", display: "block", marginBottom: "4px" }}>Total Income</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#d1fae5" }}>{formatCurrency(summary.totalIncome)}</span>
              </div>
              <div style={{ background: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.2)", padding: "14px", borderRadius: "12px" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "#fda5af", display: "block", marginBottom: "4px" }}>Total Expense</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fecdd3" }}>{formatCurrency(summary.totalExpense)}</span>
              </div>
              <div style={{ background: "rgba(99, 102, 241, 0.12)", border: "1px solid rgba(99, 102, 241, 0.25)", padding: "14px", borderRadius: "12px" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "#a5b5fc", display: "block", marginBottom: "4px" }}>Calculated Net Balance</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: summary.netBalance >= 0 ? "#c7d2fe" : "#fecdd3" }}>{formatCurrency(summary.netBalance)}</span>
              </div>
              <div style={{ background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)", padding: "14px", borderRadius: "12px" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "#67e8f9", display: "block", marginBottom: "4px" }}>Transactions</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#e0f7fa" }}>
                  {verifyResult
                    ? `${verifyResult.newCount} new · ${verifyResult.duplicateCount} dup`
                    : `${summary.count} Rows`}
                </span>
              </div>
            </div>

            {/* Preview Table */}
            <h4 style={{ fontSize: "0.9rem", color: "#cbd5e1", margin: "0 0 10px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Data Preview & Calculated Line Balances</span>
              <span style={{ fontSize: "0.75rem", color: "#818cf8" }}>{parsedData.length} total rows parsed</span>
            </h4>

            <div style={{ maxHeight: "260px", overflowY: "auto", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "20px" }}>
              <table className="et-table" style={{ width: "100%", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "#111827", position: "sticky", top: 0, zIndex: 5 }}>
                    <th style={{ padding: "8px 12px", width: "50px" }}>S.No</th>
                    <th style={{ padding: "8px 12px" }}>Description</th>
                    <th style={{ padding: "8px 12px", textAlign: "right" }}>Income</th>
                    <th style={{ padding: "8px 12px", textAlign: "right" }}>Expense</th>
                    <th style={{ padding: "8px 12px", textAlign: "right", color: "#a5b5fc" }}>Calculated Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.map((row, idx) => {
                    const isDuplicate = isDuplicateRow(row);
                    const rowStyle = row.isHeading
                      ? { background: "#FFFFAA", color: "#000" }
                      : isDuplicate
                      ? { background: "rgba(251, 191, 36, 0.15)", borderBottom: "1px solid rgba(251, 191, 36, 0.2)" }
                      : idx % 2 === 0
                      ? { background: "rgba(255,255,255,0.02)" }
                      : {};

                    if (row.isHeading) {
                      return (
                        <tr key={idx} style={{ background: "#FFFFAA", color: "#000" }}>
                          <td style={{ textAlign: "center", fontWeight: "bold" }}></td>
                          <td colSpan={4} style={{ textAlign: "center", fontWeight: "700", textTransform: "uppercase", padding: "8px" }}>
                            {row.description}
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={idx} style={rowStyle}>
                        <td style={{ textAlign: "center" }}>
                          {isDuplicate && <span style={{ color: "#fbbf24", marginRight: "4px" }}>⚠️</span>}
                          {row.sno}
                        </td>
                        <td>{row.description}</td>
                        <td style={{ textAlign: "right", color: row.income > 0 ? "#6ee7b7" : "#64748b" }}>
                          {row.income > 0 ? `+${formatCurrency(row.income)}` : "—"}
                        </td>
                        <td style={{ textAlign: "right", color: row.outgoing > 0 ? "#fda5af" : "#64748b" }}>
                          {row.outgoing > 0 ? `-${formatCurrency(row.outgoing)}` : "—"}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: "700", color: "#c7d2fe" }}>
                          {formatCurrency(row.balance)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Cancel
          </button>
          {parsedData.length > 0 && (
            <button
              type="button"
              disabled={isSubmitting || isVerifying}
              onClick={handleConfirmImport}
              style={{
                padding: "10px 24px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                border: "none",
                color: "#ffffff",
                fontWeight: 600,
                cursor: isSubmitting || isVerifying ? "not-allowed" : "pointer",
                fontSize: "0.9rem",
                boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
              }}
            >
              {isSubmitting
                ? "Importing..."
                : isVerifying
                ? "Verifying..."
                : skipDuplicates && verifyResult?.duplicateCount > 0
                ? `Import ${effectiveNewCount} New Records (skip ${effectiveDuplicateCount} duplicates)`
                : `Confirm & Import ${parsedData.filter((t) => !t.isHeading).length} Items`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


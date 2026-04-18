import React from "react";

export default function ExportModal({ onClose, data }) {

  // 🔹 Prepare Clean Data + Balance
  const prepareData = () => {
    let running = 0;

    return data.map((t, i) => {
      const income = t.income || 0;
      const expense = t.outgoing || 0;

      running += income - expense;

      return {
        sno: i + 1,
        description: t.description,
        income,
        expense,
        balance: running,
      };
    });
  };

  // 🔹 Excel Export
  const exportExcel = async () => {
    const XLSX = await import("xlsx");

    const cleanData = prepareData();

    const ws = XLSX.utils.json_to_sheet(cleanData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    XLSX.writeFile(wb, "transactions.xlsx");
  };

  // 🔹 PDF Export (FIXED)
  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();

    const cleanData = prepareData();

    const rows = cleanData.map((t) => [
      t.sno,
      t.description,
      `₹${t.income}`,
      `₹${t.expense}`,
      `₹${t.balance}`,
    ]);

    // Title
    doc.setFontSize(14);
    doc.text("Expense Tracker Report", 14, 15);

    // Table
    autoTable(doc, {
      startY: 20,
      head: [["#", "Description", "Income", "Expense", "Balance"]],
      body: rows,
      theme: "grid",
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [99, 102, 241], // Indigo
      },
    });

    doc.save("transactions.pdf");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h3>💾 Save</h3>

        <div className="modal-actions">
          <button onClick={exportExcel} className="btn-primary">
            📊 Excel
          </button>

          <button onClick={exportPDF} className="btn-primary">
            📄 PDF
          </button>
        </div>

        <button onClick={onClose} className="modal-close">
          ✕ Close
        </button>
      </div>
    </div>
  );
}
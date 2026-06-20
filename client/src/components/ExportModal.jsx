import React from "react";

export default function ExportModal({ onClose, data }) {

  // 🔹 Prepare Clean Data + Balance (FIXED)
  const prepareData = () => {
    const sortedList = [...data]
      .sort((a, b) => (a.sno ?? Infinity) - (b.sno ?? Infinity))
      .map((item, index) => ({
        ...item,
        sno: index + 1,
      }));

    let running = 0;

    return sortedList.map((t) => {
      const income = Number(t.income) || 0;
      const expense = Number(t.outgoing) || 0;

      running += income - expense;

      return {
        sno: t.sno,
        description: (t.description || "").trim(),
        income,
        expense,
        balance: running,
      };
    });
  };

  // 🔹 Excel Export
  const exportExcel = async () => {
    const XLSX = await import("xlsx");

    // Same ordering as UI
    const sortedList = [...data]
      .sort((a, b) => (a.sno ?? Infinity) - (b.sno ?? Infinity))
      .map((item, index) => ({
        ...item,
        sno: index + 1,
      }));

    let running = 0;

    const rows = sortedList.map((tx) => {
      running += (tx.income || 0) - (tx.outgoing || 0);

      return {
        "S.No": tx.sno,
        Description: tx.description,
        Income: tx.income > 0 ? tx.income : "",
        Expense: tx.outgoing > 0 ? tx.outgoing : "",
        Balance: running,
      };
    });

    const totalIncome = sortedList.reduce(
      (sum, item) => sum + (item.income || 0),
      0
    );

    const totalExpense = sortedList.reduce(
      (sum, item) => sum + (item.outgoing || 0),
      0
    );

    const netBalance = totalIncome - totalExpense;

    const sheetData = [
      ["Expense Tracker Report"],
      [],
      ["Total Income", totalIncome],
      ["Total Expense", totalExpense],
      ["Net Balance", netBalance],
      [],
      ["S.No", "Description", "Income", "Expense", "Balance"],
      ...rows.map((row) => [
        row["S.No"],
        row.Description,
        row.Income,
        row.Expense,
        row.Balance,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    ws["!cols"] = [
      { wch: 10 },
      { wch: 40 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
    ];

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Transactions"
    );

    XLSX.writeFile(
      wb,
      "Expense-Tracker.xlsx"
    );
  };

  // 🔹 PDF Export (FULL UI STYLE)
  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF("p", "mm", "a4");

    const cleanData = prepareData();

    const formatCurrency = (value) => {
      const num = Number(value) || 0;

      return `Rs. ${num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };

    // ==========================
    // TOTALS
    // ==========================
    const totals = cleanData.reduce(
      (acc, item) => {
        acc.income += item.income;
        acc.expense += item.expense;
        acc.balance = item.balance;
        return acc;
      },
      {
        income: 0,
        expense: 0,
        balance: 0,
      }
    );

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ==========================
    // HEADER
    // ==========================
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Expense Tracker Report", 14, 17);

    doc.setFontSize(9);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      14,
      23
    );

    // ==========================
    // CARDS
    // ==========================
    const drawCard = (x, y, w, h, title, value, color) => {
      doc.setFillColor(...color);
      doc.roundedRect(x, y, w, h, 4, 4, "F");

      doc.setTextColor(255, 255, 255);

      doc.setFontSize(10);
      doc.text(title, x + 4, y + 8);

      doc.setFontSize(12);
      doc.text(value, x + 4, y + 19);
    };

    const margin = 14;
    const gap = 6;

    const cardWidth = (pageWidth - margin * 2 - gap * 2) / 3;
    const cardHeight = 28;

    drawCard(
      margin,
      38,
      cardWidth,
      cardHeight,
      "Total Income",
      formatCurrency(totals.income),
      [34, 197, 94]
    );

    drawCard(
      margin + cardWidth + gap,
      38,
      cardWidth,
      cardHeight,
      "Total Expense",
      formatCurrency(totals.expense),
      [239, 68, 68]
    );

    drawCard(
      margin + (cardWidth + gap) * 2,
      38,
      cardWidth,
      cardHeight,
      "Balance",
      formatCurrency(totals.balance),
      [59, 130, 246]
    );

    // ==========================
    // SUMMARY STRIP
    // ==========================
    doc.setFillColor(245, 247, 255);
    doc.roundedRect(14, 74, pageWidth - 28, 10, 2, 2, "F");

    doc.setTextColor(80);
    doc.setFontSize(9);

    doc.text(
      `Total Transactions: ${cleanData.length}`,
      18,
      80
    );

    doc.text(
      `Net Balance: ${formatCurrency(totals.balance)}`,
      pageWidth - 70,
      80
    );

    // ==========================
    // TABLE DATA
    // ==========================
    const rows = cleanData.map((t) => [
      t.sno,
      t.description || "-",
      t.income > 0 ? formatCurrency(t.income) : "-",
      t.expense > 0 ? formatCurrency(t.expense) : "-",
      formatCurrency(t.balance),
    ]);

    // ==========================
    // TABLE
    // ==========================
    autoTable(doc, {
      startY: 90,

      head: [["#", "Description", "Income", "Expense", "Balance"]],

      body: rows,

      theme: "grid",

      margin: {
        left: 14,
        right: 14,
      },

      styles: {
        fontSize: 8.5,
        cellPadding: 2.5,
        valign: "middle",
        overflow: "hidden",
      },

      headStyles: {
        fillColor: [99, 102, 241],
        textColor: [255, 255, 255],
        halign: "center",
        fontSize: 10,
      },

      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },

      columnStyles: {
        0: {
          cellWidth: 12,
          halign: "center",
        },

        1: {
          cellWidth: 86,
        },

        2: {
          cellWidth: 28,
          halign: "right",
        },

        3: {
          cellWidth: 28,
          halign: "right",
        },

        4: {
          cellWidth: 28,
          halign: "right",
        },
      },

      didParseCell: (data) => {
        if (data.column.index === 1 && data.cell.raw) {
          const txt = String(data.cell.raw);

          if (txt.length > 40) {
            data.cell.text = [txt.substring(0, 40) + "..."];
          }
        }
      },
    });

    // ==========================
    // FOOTER
    // ==========================
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setFontSize(8);
      doc.setTextColor(120);

      doc.text(
        "Generated by Expense Tracker",
        14,
        pageHeight - 8
      );

      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - 25,
        pageHeight - 8
      );
    }

    doc.save("Expense-Tracker-Report.pdf");
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
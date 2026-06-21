import React, { useState } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";

export default function QuotationGenerator() {
    const [totalArea, setTotalArea] = useState("");
    const [ratePerSqft, setRatePerSqft] = useState("");
    const [owners, setOwners] = useState("");

    const area = Number(totalArea) || 0;
    const rate = Number(ratePerSqft) || 0;
    const ownerCount = Number(owners) || 0;

    const leftMargin = 20;
    const contentWidth = 170; // A4 width (210) - 20 - 20
    const rightMargin = leftMargin + contentWidth;

    const totalValue = area * rate;
    const sharePerOwner = ownerCount ? area / ownerCount : 0;
    const valuePerOwner = ownerCount ? totalValue / ownerCount : 0;

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN").format(value);

    const downloadPDF = () => {
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Header Background
        doc.setFillColor(30, 64, 175);
        doc.rect(0, 0, pageWidth, 35, "F");

        // Company Name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont(undefined, "bold");
        doc.text(
            "SRI MARUTHI CONSTRUCTION",
            pageWidth / 2,
            15,
            { align: "center" }
        );

        doc.setFontSize(11);
        doc.setFont(undefined, "normal");
        doc.text(
            "Real Estate Share & Valuation Report",
            pageWidth / 2,
            25,
            { align: "center" }
        );

        // Reset text color
        doc.setTextColor(0, 0, 0);

        // Quotation Title
        doc.setFontSize(16);
        doc.setFont(undefined, "bold");
        doc.text("PROPERTY QUOTATION", pageWidth / 2, 50, {
            align: "center",
        });

        // Generated Date
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(
            `Date : ${new Date().toLocaleDateString("en-IN")}`,
            20,
            65
        );

        // Table
        const startY = 75;
        const rowHeight = 12;

        const rows = [
            ["Total Area", `${area} Sq.Ft`],
            ["Rate Per Sq.Ft", `Rs. ${formatCurrency(rate)}`],
            ["Total Property Value", `Rs. ${formatCurrency(totalValue)}`],
            ["Number of Owners", ownerCount.toString()],
            ["Share Per Owner", `${sharePerOwner.toFixed(2)} Sq.Ft`],
            ["Value Per Owner", `Rs. ${formatCurrency(valuePerOwner)}`],
        ];

        let y = startY;

        rows.forEach(([label, value]) => {
            const col1 = 70;
            const col2 = 100;

            doc.rect(leftMargin, y - 7, col1, rowHeight);
            doc.rect(leftMargin + col1, y - 7, col2, rowHeight);

            doc.setFont(undefined, "bold");
            doc.text(label, 25, y);

            doc.setFont(undefined, "normal");
            doc.text(value, 100, y);

            y += 11;
        });

        // Highlight Total Value
        doc.setFillColor(22, 163, 74);
        doc.roundedRect(
            leftMargin,
            y + 10,
            contentWidth,
            20,
            3,
            3,
            "F"
        );

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text(
            `TOTAL PROPERTY VALUE : Rs. ${formatCurrency(totalValue)}`,
            pageWidth / 2,
            y + 23,
            { align: "center" }
        );

        doc.setTextColor(0, 0, 0);

        // Signature Section
        const signWidth = 50;
        const signX = rightMargin - signWidth;

        doc.line(
            signX,
            y + 55,
            signX + signWidth,
            y + 55
        );

        doc.text(
            "Authorized Signature",
            signX + signWidth / 2,
            y + 62,
            { align: "center" }
        );

        // Footer
        doc.setDrawColor(200);
        doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25);

        doc.setFontSize(9);
        doc.setTextColor(100);

        doc.text(
            "Sri Maruthi Construction",
            pageWidth / 2,
            pageHeight - 18,
            { align: "center" }
        );

        doc.text(
            "Building Trust Through Quality Construction",
            pageWidth / 2,
            pageHeight - 12,
            { align: "center" }
        );

        doc.text(
            `Generated on ${new Date().toLocaleDateString("en-IN")}`,
            pageWidth / 2,
            pageHeight - 6,
            { align: "center" }
        );

        doc.save(
            `Sri_Maruthi_Quotation_${new Date()
                .toLocaleDateString("en-IN")
                .replace(/\//g, "-")}.pdf`
        );
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f7fb",
                padding: "30px",
            }}
        >
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                }}
            >
                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "#2563eb",
                        fontWeight: "600",
                    }}
                >
                    ← Back to Expense Tracker
                </Link>

                {/* Header */}
                <div
                    style={{
                        marginTop: "20px",
                        background:
                            "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                        color: "#fff",
                        borderRadius: "20px",
                        padding: "30px",
                        boxShadow: "0 10px 30px rgba(37,99,235,.25)",
                    }}
                >
                    <h1 style={{ margin: 0, fontSize: "32px" }}>
                        🏢 Real Estate Quotation Generator
                    </h1>

                    <p
                        style={{
                            marginTop: "10px",
                            opacity: 0.9,
                        }}
                    >
                        Calculate property value and equal ownership share instantly.
                    </p>
                </div>

                {/* Inputs */}
                <div
                    style={{
                        marginTop: "25px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                        gap: "20px",
                    }}
                >
                    <input
                        type="number"
                        placeholder="Total Area (Sq.Ft)"
                        value={totalArea}
                        onChange={(e) => setTotalArea(e.target.value)}
                        style={modernInput}
                    />

                    <input
                        type="number"
                        placeholder="Rate Per Sq.Ft"
                        value={ratePerSqft}
                        onChange={(e) => setRatePerSqft(e.target.value)}
                        style={modernInput}
                    />

                    <input
                        type="number"
                        placeholder="Number of Owners"
                        value={owners}
                        onChange={(e) => setOwners(e.target.value)}
                        style={modernInput}
                    />
                </div>

                {/* Total Value Highlight */}
                <div
                    style={{
                        marginTop: "25px",
                        background: "#fff",
                        borderRadius: "20px",
                        padding: "25px",
                        textAlign: "center",
                        boxShadow: "0 4px 15px rgba(0,0,0,.08)",
                    }}
                >
                    <div
                        style={{
                            fontSize: "14px",
                            color: "#64748b",
                            marginBottom: "10px",
                        }}
                    >
                        TOTAL PROPERTY VALUE
                    </div>

                    <div
                        style={{
                            fontSize: "42px",
                            fontWeight: "700",
                            color: "#16a34a",
                        }}
                    >
                        ₹ {formatCurrency(totalValue)}
                    </div>
                </div>

                {/* Summary Cards */}
                <div
                    style={{
                        marginTop: "25px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                        gap: "20px",
                    }}
                >
                    <SummaryCard
                        title="Total Area"
                        value={`${area} Sq.Ft`}
                        icon="📐"
                    />

                    <SummaryCard
                        title="Rate Per Sq.Ft"
                        value={`₹ ${formatCurrency(rate)}`}
                        icon="💰"
                    />

                    <SummaryCard
                        title="Owners"
                        value={ownerCount}
                        icon="👥"
                    />

                    <SummaryCard
                        title="Share Per Owner"
                        value={`${sharePerOwner.toFixed(2)} Sq.Ft`}
                        icon="🏠"
                    />

                    <SummaryCard
                        title="Value Per Owner"
                        value={`₹ ${formatCurrency(valuePerOwner)}`}
                        icon="📄"
                    />
                </div>

                {/* Download Button */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "35px",
                    }}
                >
                    <button
                        onClick={downloadPDF}
                        disabled={!area || !rate || !ownerCount}
                        style={{
                            padding: "16px 40px",
                            borderRadius: "12px",
                            border: "none",
                            background:
                                "linear-gradient(135deg,#16a34a,#15803d)",
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: "700",
                            cursor: "pointer",
                            boxShadow: "0 10px 20px rgba(22,163,74,.25)",
                        }}
                    >
                        📄 Download Quotation PDF
                    </button>
                </div>
                {/* Footer */}
                <div
                    style={{
                        marginTop: "60px",
                        background: "#0f172a",
                        color: "#fff",
                        padding: "30px",
                        borderRadius: "20px",
                        textAlign: "center",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    }}
                >
                    <h2
                        style={{
                            margin: "0 0 10px",
                            fontSize: "24px",
                            fontWeight: "700",
                        }}
                    >
                        Sri Maruthi Construction
                    </h2>

                    <p
                        style={{
                            margin: "0 0 10px",
                            opacity: 0.85,
                        }}
                    >
                        Building Trust Through Quality Construction
                    </p>

                    <p
                        style={{
                            margin: 0,
                            fontSize: "14px",
                            opacity: 0.7,
                        }}
                    >
                        Real Estate • Construction • Property Development
                    </p>
                </div>
            </div>
        </div>
    );
}
const modernInput = {
    padding: "15px",
    border: "1px solid #dbe2ea",
    borderRadius: "12px",
    fontSize: "16px",
    background: "#fff",
    outline: "none",
};

function SummaryCard({ title, value, icon }) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "20px",
                boxShadow: "0 4px 15px rgba(0,0,0,.08)",
            }}
        >
            <div
                style={{
                    fontSize: "30px",
                    marginBottom: "10px",
                }}
            >
                {icon}
            </div>

            <div
                style={{
                    color: "#64748b",
                    fontSize: "14px",
                }}
            >
                {title}
            </div>

            <div
                style={{
                    marginTop: "8px",
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#0f172a",
                }}
            >
                {value}
            </div>
        </div>
    );
}
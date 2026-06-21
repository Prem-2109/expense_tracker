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

    const totalValue = area * rate;
    const sharePerOwner = ownerCount ? area / ownerCount : 0;
    const valuePerOwner = ownerCount ? totalValue / ownerCount : 0;

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN").format(value);

    const downloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setFontSize(18);
        doc.setFont(undefined, "bold");
        doc.text(
            "Sri Maruthi Construction",
            doc.internal.pageSize.getWidth() / 2,
            20,
            { align: "center" }
        );

        doc.setFontSize(11);
        doc.setFont(undefined, "normal");
        doc.text(
            "Real Estate Share & Valuation Report",
            doc.internal.pageSize.getWidth() / 2,
            28,
            { align: "center" }
        );

        doc.setFontSize(12);

        const rows = [
            ["Total Area", `${area} Sq.Ft`],
            ["Rate per Sq.Ft", `Rs. ${formatCurrency(rate)}`],
            ["Total Property Value", `Rs. ${formatCurrency(totalValue)}`],
            ["Number of Owners", ownerCount.toString()],
            ["Share per Owner", `${sharePerOwner.toFixed(2)} Sq.Ft`],
            ["Value per Owner", `Rs. ${formatCurrency(valuePerOwner)}`],
        ];

        let y = 40;

        rows.forEach(([label, value]) => {
            doc.text(label, 20, y);
            doc.text(value, 100, y);
            y += 12;
        });

        doc.text(
            `Generated On: ${new Date().toLocaleDateString("en-IN")}`,
            20,
            y + 10
        );

        doc.save(
            `Sri_Maruthi_Quotation-${new Date()
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
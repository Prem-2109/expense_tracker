import React, { useState } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";

export default function QuotationGenerator() {
    const [clientName, setClientName] = useState("");
    const [ownerRate, setOwnerRate] = useState("");
    const [commission, setCommission] = useState("");
    const [power, setPower] = useState("");
    const [patta, setPatta] = useState("");
    const [sharing, setSharing] = useState("");

    const ownerRateVal = Number(ownerRate) || 0;
    const commissionVal = Number(commission) || 0;
    const powerVal = Number(power) || 0;
    const pattaVal = Number(patta) || 0;
    const sharingCount = Number(sharing) || 0;

    const totalValue = ownerRateVal + commissionVal + powerVal + pattaVal;
    const valuePerShare = sharingCount ? totalValue / sharingCount : 0;

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN").format(Math.round(value));

    const downloadPDF = () => {
        const doc = new jsPDF("p", "mm", "a4");

        const total = ownerRateVal + commissionVal + powerVal + pattaVal;
        const perShare = sharingCount ? total / sharingCount : 0;

        const fmt = (value) => new Intl.NumberFormat("en-IN").format(Math.round(value));

        const today = new Date().toLocaleDateString("en-GB");
        const docId = `SMC-Q-${new Date().getFullYear()}-${String(
            new Date().getMonth() + 1
        ).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}`;

        // Outer Page Border
        doc.setDrawColor(203, 213, 225); // slate-300
        doc.setLineWidth(0.4);
        doc.rect(8, 8, 194, 281);

        // ---- LOGO SECTION (Vector Art) ----
        doc.setFillColor(30, 58, 138); // blue-900
        doc.roundedRect(15, 15, 20, 20, 3, 3, "F");

        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1.2);

        doc.line(25, 19, 19, 25);
        doc.line(25, 19, 31, 25);
        doc.line(21, 25, 21, 31);
        doc.line(29, 25, 29, 31);
        doc.line(21, 31, 29, 31);
        doc.line(24, 25, 26, 25);
        doc.line(24, 27, 26, 27);
        doc.line(24, 25, 24, 27);
        doc.line(26, 25, 26, 27);

        // ---- COMPANY INFO ----
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(30, 58, 138); // blue-900
        doc.text("SRI MARUTHI CONSTRUCTION", 40, 23);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text("Building Trust Through Quality Construction", 40, 28);

        doc.setFontSize(8);
        doc.text("Real Estate • Construction • Property Development", 40, 32);

        // ---- CONTACT INFO (Right Aligned) ----
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105); // slate-600
        doc.text("Email: contact@srimaruthi.com", 195, 20, { align: "right" });
        doc.text("Phone: +91 9952995222", 195, 24, { align: "right" });
        doc.text("Office: Veppampattu", 195, 28, { align: "right" });

        // Divider
        doc.setDrawColor(30, 58, 138); // blue-900
        doc.setLineWidth(0.8);
        doc.line(15, 40, 195, 40);

        // ---- REPORT DETAILS ----
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text("REAL ESTATE SHARE & VALUATION REPORT", 15, 50);

        // Metadata Card
        doc.setFillColor(248, 250, 252); // slate-50
        doc.roundedRect(15, 55, 180, 22, 2, 2, "F");
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setLineWidth(0.3);
        doc.roundedRect(15, 55, 180, 22, 2, 2, "S");

        // Metadata Text
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105); // slate-600
        doc.setFont("helvetica", "bold");
        doc.text("Date:", 20, 62);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);
        doc.text(today, 32, 62);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text("Quotation ID:", 20, 70);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);
        doc.text(docId, 42, 70);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text("Client / Purpose:", 105, 62);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);
        doc.text(clientName || "Official Joint Share Valuation Copy", 132, 62);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text("Status:", 105, 70);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(16, 185, 129); // emerald-500
        doc.text("DRAFT ESTIMATE", 117, 70);

        let y = 87;

        // Custom table-drawing helpers
        const sectionHeader = (title) => {
            doc.setFillColor(30, 58, 138); // blue-900
            doc.rect(15, y, 180, 10, "F");

            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text(title, 20, y + 6.5);

            y += 10;
        };

        const row = (label, value, highlight = false, isTotal = false) => {
            if (isTotal) {
                doc.setFillColor(240, 253, 244); // soft green emerald-50
                doc.rect(15, y, 180, 11, "F");
                doc.setDrawColor(187, 247, 208); // emerald-200
                doc.setLineWidth(0.3);
                doc.line(15, y, 195, y);
                doc.line(15, y + 11, 195, y + 11);

                doc.setTextColor(6, 95, 70); // deep green
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9.5);
            } else {
                const isEven = (y / 10) % 2 === 0;
                doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
                doc.rect(15, y, 180, 10, "F");

                doc.setTextColor(51, 65, 85); // slate-700
                doc.setFont("helvetica", highlight ? "bold" : "normal");
                doc.setFontSize(9);
            }

            doc.text(label, 20, y + 6.5);
            doc.text(value, 190, y + 6.5, { align: "right" });

            y += isTotal ? 11 : 10;
        };

        // Section 1
        sectionHeader("1. VALUATION BREAKDOWN");
        row("Owner Rate", `Rs. ${fmt(ownerRateVal)}`);
        row("Commission", `Rs. ${fmt(commissionVal)}`);
        row("Power", `Rs. ${fmt(powerVal)}`);
        row("Patta", `Rs. ${fmt(pattaVal)}`);
        row("Total Estimated Value", `Rs. ${fmt(total)}`, true, true);

        y += 10;

        // Section 2
        sectionHeader("2. OWNERSHIP & SHARE SPLITS");
        row("Number of Sharing", sharingCount.toString());
        row("Value Per Sharing", `Rs. ${fmt(perShare)}`, true, true);

        // Footnote & Disclaimer
        y += 15;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184); // slate-400

        const noteText = [
            "Disclaimer: This document is an estimate based on values supplied by the user. Actual valuation",
            "may vary depending on property location, road widths, materials used, local zoning rules, and final agreement."
        ];
        doc.text(noteText[0], 15, y);
        doc.text(noteText[1], 15, y + 4);

        // Signature Box
        doc.setDrawColor(203, 213, 225); // slate-300
        doc.setLineWidth(0.5);
        doc.line(140, 260, 195, 260);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85); // slate-700
        doc.text("Authorized Signatory", 167.5, 265, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(30, 58, 138); // blue-900
        doc.text("Sri Maruthi Construction", 167.5, 270, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(`System Generated Document - ${today}`, 15, 270);

        const safeClient = (clientName || "Client").replace(/[^a-z0-9]+/gi, "_");
        doc.save(
            `SMC_Quotation_${safeClient}_${today.replace(/\//g, "-")}.pdf`
        );
    };

    const isReady = ownerRate && sharingCount > 0;

    return (
        <div style={{ minHeight: "100vh", background: "#020617", padding: "40px 20px", fontFamily: "'Inter', system-ui, sans-serif" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
                {/* Back Nav Link */}
                {/* <div>
                    <Link
                        to="/"
                        style={{ color: "#818cf8", textDecoration: "none", fontWeight: "600", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                        ← Back to Expense Tracker
                    </Link>
                </div> */}

                {/* Hero Header */}
                <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 50%, #312e81 100%)", borderRadius: "24px", padding: "32px 36px", boxShadow: "0 20px 60px rgba(99,102,241,0.25)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "clamp(22px, 4vw, 36px)", fontWeight: "800", color: "#fff", letterSpacing: "-0.5px" }}>
                            🏢 Sri Maruthi Construction
                        </h1>
                        <p style={{ margin: "8px 0 0", color: "#cbd5e1", fontSize: "15px", fontWeight: "500" }}>
                            Real Estate Quotation &amp; Share Calculator
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(129,140,248,0.35)", borderRadius: "12px", padding: "8px 16px", color: "#a5b4fc", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#818cf8", display: "inline-block", animation: "pulse 2s infinite" }}></span>
                        Live Estimator
                    </div>
                </div>

                {/* Inputs & Total Value Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                    {/* Inputs panel */}
                    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "20px", padding: "28px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                        <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#e2e8f0", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #1e293b", paddingBottom: "14px" }}>
                            📝 Valuation Specifications
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8" }}>
                                Client Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Sri Muruthu Traders"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = "#6366f1"}
                                onBlur={e => e.target.style.borderColor = "#475569"}
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
                            <MoneyField label="Owner Rate" placeholder="e.g. 2350000" value={ownerRate} onChange={setOwnerRate} />
                            <MoneyField label="Commission" placeholder="e.g. 60000" value={commission} onChange={setCommission} />
                            <MoneyField label="Power" placeholder="e.g. 24000" value={power} onChange={setPower} />
                            <MoneyField label="Patta" placeholder="e.g. 5000" value={patta} onChange={setPatta} />

                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8" }}>
                                    Number of Sharing
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 3"
                                    value={sharing}
                                    onChange={(e) => setSharing(e.target.value)}
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                                    onBlur={e => e.target.style.borderColor = "#475569"}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Total Value Display Box */}
                    <div style={{ background: "linear-gradient(145deg, #0f2a1e, #0d1f1a)", border: "1px solid #166534", borderRadius: "20px", padding: "28px", textAlign: "center", boxShadow: "0 8px 32px rgba(16,185,129,0.1), 0 2px 8px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", color: "#6ee7b7", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
                            Total Estimated Value
                        </span>
                        <h2 style={{ margin: 0, fontSize: "clamp(28px, 5vw, 48px)", fontWeight: "900", color: "#34d399", letterSpacing: "-1px", textShadow: "0 0 30px rgba(52,211,153,0.25)" }}>
                            ₹ {formatCurrency(totalValue)}
                        </h2>
                        <div style={{ marginTop: "10px", fontSize: "12px", color: "#4ade80", fontWeight: "500", opacity: 0.7 }}>
                            Owner Rate + Commission + Power + Patta
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
                        📊 Summary &amp; Share Splits
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "14px" }}>
                        <SummaryCard title="Owner Rate" value={`₹ ${formatCurrency(ownerRateVal)}`} icon="🏠" accent="#3b82f6" accentBg="#1e3a5f" />
                        <SummaryCard title="Commission" value={`₹ ${formatCurrency(commissionVal)}`} icon="🤝" accent="#818cf8" accentBg="#1e1b4b" />
                        <SummaryCard title="Power" value={`₹ ${formatCurrency(powerVal)}`} icon="⚡" accent="#fbbf24" accentBg="#3a2e0f" />
                        <SummaryCard title="Patta" value={`₹ ${formatCurrency(pattaVal)}`} icon="📜" accent="#c084fc" accentBg="#2d1b4e" />
                        <SummaryCard title="Number of Sharing" value={sharingCount || 0} icon="👥" accent="#2dd4bf" accentBg="#0f2c2c" />
                        <SummaryCard title="Value Per Sharing" value={`₹ ${formatCurrency(valuePerShare)}`} icon="📄" accent="#34d399" accentBg="#0d2e1e" />
                    </div>
                </div>

                {/* Action / Download Section */}
                <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
                    <button
                        onClick={downloadPDF}
                        disabled={!isReady}
                        style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            background: !isReady ? "#1e293b" : "linear-gradient(135deg, #059669, #16a34a)",
                            color: !isReady ? "#475569" : "#fff",
                            border: "none", borderRadius: "16px", padding: "18px 48px",
                            fontSize: "16px", fontWeight: "700", cursor: !isReady ? "not-allowed" : "pointer",
                            boxShadow: !isReady ? "none" : "0 8px 32px rgba(16,185,129,0.3)",
                            transition: "all 0.2s", fontFamily: "inherit"
                        }}
                    >
                        <span style={{ fontSize: "20px" }}>📄</span>
                        <span>Download Quotation PDF</span>
                    </button>
                </div>

                {/* Footer Brand Panel */}
                <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "20px", padding: "32px", textAlign: "center" }}>
                    <h2 style={{ margin: "0 0 10px", fontSize: "22px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.5px" }}>
                        Sri Maruthi Construction
                    </h2>
                    <p style={{ margin: "0 auto 14px", fontSize: "14px", color: "#64748b", maxWidth: "420px", lineHeight: 1.6 }}>
                        Excellence in building premium commercial spaces, residential apartments, and layout developments.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "12px", color: "#475569", fontWeight: "600" }}>
                        <span>Real Estate</span>
                        <span>•</span>
                        <span>Construction</span>
                        <span>•</span>
                        <span>Property Development</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    background: "#1e293b",
    border: "1.5px solid #475569",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#f1f5f9",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit"
};

function MoneyField({ label, placeholder, value, onChange }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8" }}>
                {label}
            </label>
            <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontWeight: "600", fontSize: "14px" }}>₹</span>
                <input
                    type="number"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{ ...inputStyle, padding: "12px 16px 12px 28px" }}
                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                    onBlur={e => e.target.style.borderColor = "#475569"}
                />
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, accent, accentBg }) {
    return (
        <div
            style={{
                background: accentBg,
                border: `1px solid ${accent}40`,
                borderRadius: "16px",
                padding: "20px",
                boxShadow: `0 4px 20px ${accent}15`,
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                minHeight: "130px",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${accent}25`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 20px ${accent}15`; }}
        >
            <span style={{ fontSize: "28px" }}>{icon}</span>
            <div>
                <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", color: accent, marginBottom: "5px" }}>
                    {title}
                </div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#f1f5f9", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
                    {value}
                </div>
            </div>
        </div>
    );
}
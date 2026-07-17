import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Logo */}
        <div className="header-logo">
          <div className="logo-icon logo-icon-spin">₹</div>

          <div className="brand-text">
            <h1 className="header-title">Sri Maruthi Construction</h1>
            <p className="header-subtitle">Smart Expense Tracker</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span className="nav-link-icon">💸</span>
            <span className="nav-link-text">Tracker</span>
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span className="nav-link-icon">📊</span>
            <span className="nav-link-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/quotation-generator"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span className="nav-link-icon">📝</span>
            <span className="nav-link-text">Quotation</span>
          </NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileMenuOpen ? "show" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
          onClick={() => setMobileMenuOpen(false)}
        >
          💸 Tracker
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
          onClick={() => setMobileMenuOpen(false)}
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/quotation-generator"
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
          onClick={() => setMobileMenuOpen(false)}
        >
          📝 Quotation
        </NavLink>
      </div>
    </header>
  );
}
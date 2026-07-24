import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    dispatch(logout());
    navigate("/login");
  };

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

        {/* Desktop User Section */}
        <div className="header-user-section">
          {user && (
            <span className="header-username">
              👤 {user.username}
            </span>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="header-logout-btn"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
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

        {user && (
          <div className="mobile-user-section">
            <span className="mobile-username">
              👤 {user.username}
            </span>

            <button
              type="button"
              className="mobile-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
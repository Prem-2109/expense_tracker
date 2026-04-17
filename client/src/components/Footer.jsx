import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">₹</div>
          <div>
            <h3>Expense Tracker</h3>
            <p>Smart way to manage your money</p>
          </div>
        </div>

        {/* Links */}
        {/* <div className="footer-links">
          <a href="#">Dashboard</a>
          <a href="#">Reports</a>
          <a href="#">Support</a>
        </div> */}

        {/* Social */}
        <div className="footer-social">
          <a href="#" title="LinkedIn">🔗</a>
          <a href="#" title="GitHub">💻</a>
          <a href="#" title="Twitter">🐦</a>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © {year} Expense Tracker • Constructed with ❤️ by <span>Prem</span>
        </p>
      </div>
    </footer>
  );
}
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
          <a target="_blank" href="https://www.linkedin.com/in/premkumar2102/" title="LinkedIn">🔗</a>
          <a target="_blank" href="https://github.com/Prem-2109" title="GitHub">💻</a>
          <a target="_blank" href="https://wa.me/918122834869?text=Hi%20Prem,%20I%20checked%20your%20project!" title="WhatsApp"
          >
            💬
          </a>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Expense Tracker • Built & maintained by <span>Prem</span>
        </p>
      </div>
    </footer>
  );
}
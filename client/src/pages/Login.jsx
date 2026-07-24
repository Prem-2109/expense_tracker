import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, clearError, setAdminAuth } from "../features/auth/authSlice";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    setValidationError("");
  }, [isLogin, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    if (isLogin) {
      const { email, password } = formData;
      if (!email || !password) {
        setValidationError("Please fill in all fields");
        return;
      }

      // Hardcoded admin login — bypasses API for now
      if (
        (email === "admin" || email === "admin@local") &&
        password === "admin@123"
      ) {
        dispatch(setAdminAuth());
        return;
      }

      // Real API login (for future use)
      dispatch(loginUser({ loginIdentifier: email, password }));
    } else {
      const { username, email, password, confirmPassword } = formData;
      if (!username || !email || !password || !confirmPassword) {
        setValidationError("Please fill in all fields");
        return;
      }
      if (password !== confirmPassword) {
        setValidationError("Passwords do not match");
        return;
      }
      dispatch(registerUser({ username, email, password }));
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Brand Header */}
        <div className="login-brand">
          <div className="login-logo">₹</div>
          <h2>Sri Maruthi Construction</h2>
          <p>{isLogin ? "Welcome back! Please sign in." : "Create your account to get started."}</p>
        </div>

        {/* Tab Toggle */}
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={`login-tab-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {(validationError || error) && (
          <div className="login-error">
            {validationError || error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="login-field">
              <label htmlFor="login-username" className="login-label">Username</label>
              <input
                id="login-username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className="login-input"
              />
            </div>
          )}

          <div className="login-field">
            <label htmlFor="login-email" className="login-label">
              {isLogin ? "Email or Username" : "Email Address"}
            </label>
            <input
              id="login-email"
              name="email"
              type="text"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder={isLogin ? "email@example.com or username" : "email@example.com"}
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password" className="login-label">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="login-input"
            />
          </div>

          {!isLogin && (
            <div className="login-field">
              <label htmlFor="login-confirm-password" className="login-label">Confirm Password</label>
              <input
                id="login-confirm-password"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="login-input"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn"
          >
            {loading && <span className="login-spinner" />}
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

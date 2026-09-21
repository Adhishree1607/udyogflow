import { useState } from "react";
import BusinessDashboard from "./BusinessDashboard";
import maharashtraLogo from "./assets/maharashtra-logo.png";
import { IconArrowLeft, IconShieldCheck, IconUser, IconBuilding, IconCheck } from "./Icons";

function Login({ onBack, onNavigateRegister, onLoginSuccess }) {
  const [role, setRole] = useState("business");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Requirement: Email and Password MUST be empty on load, no demo values!
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (role === "business") {
      setLoggedIn(true);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      alert("Government Officer / Department Nodal Desk authentication is managed via official Parichay SSO.");
    }
  };

  if (loggedIn) {
    return (
      <BusinessDashboard
        onLogout={() => {
          setLoggedIn(false);
          setEmail("");
          setPassword("");
        }}
        onNavigateHome={onBack}
      />
    );
  }

  return (
    <div className="login-wrapper">
      {/* Top Government Ribbon */}
      <div className="login-gov-strip">
        <div className="strip-content">
          <div className="brand-group">
            <img
              src={maharashtraLogo}
              alt="Government of Maharashtra"
              className="gov-seal-small"
            />
            <div className="brand-text">
              <strong>Government of Maharashtra</strong>
              <span>महाराष्ट्र शासन · Department of Industries</span>
            </div>
          </div>
          {onBack && (
            <button
              type="button"
              className="btn-back-home"
              onClick={onBack}
            >
              <IconArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </div>

      <div className="login-center-box">
        {/* Main Authentication Card */}
        <div className="login-card-enterprise">
          {/* Card Header */}
          <div className="login-card-head">
            <div className="udyog-logo-square">U</div>
            <div className="login-header-text">
              <h2>Sign In to UdyogFlow</h2>
              <span>Industrial Approvals & Compliance Gateway</span>
            </div>
          </div>

          {/* Role Selection Tabs */}
          <div className="role-selector-bar">
            <button
              type="button"
              className={`role-tab-btn ${role === "business" ? "active" : ""}`}
              onClick={() => setRole("business")}
            >
              <IconUser size={18} />
              <div className="role-btn-text">
                <strong>Business User</strong>
                <small>Industrial Investors & Units</small>
              </div>
            </button>

            <button
              type="button"
              className={`role-tab-btn ${role === "officer" ? "active" : ""}`}
              onClick={() => setRole("officer")}
            >
              <IconBuilding size={18} />
              <div className="role-btn-text">
                <strong>Government Officer</strong>
                <small>Department Nodal Desk</small>
              </div>
            </button>
          </div>

          {/* Login Form */}
          <form className="gov-login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="loginEmail">Email Address</label>
              <input
                id="loginEmail"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="label-with-link">
                <label htmlFor="loginPassword">Password</label>
                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => alert("Password reset instructions will be sent to your registered email.")}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="input-with-action">
                <input
                  id="loginPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-pass-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login-submit">
              <span>Sign In</span>
              <IconCheck size={18} />
            </button>
          </form>

          {/* Register Prompt */}
          <div className="login-footer-action">
            <span>Don't have an account?</span>
            <button
              type="button"
              className="action-register-link"
              onClick={onNavigateRegister}
            >
              Create Account →
            </button>
          </div>

          {/* Security Notice */}
          <div className="login-security-notice">
            <IconShieldCheck size={14} />
            <span>Secure 256-Bit SSL Connection · MAITRI Integrated</span>
          </div>
        </div>

        <p className="login-bottom-credits">
          © 2026 Government of Maharashtra. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
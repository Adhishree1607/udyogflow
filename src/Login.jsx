import { useState } from "react";
import BusinessDashboard from "./BusinessDashboard";
import maharashtraLogo from "./assets/maharashtra-logo.png";
import { IconArrowLeft, IconLock, IconShieldCheck, IconUser, IconBuilding, IconCheck } from "./Icons";

function Login({ onBack }) {
  const [role, setRole] = useState("business");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("investor@udyogflow.gov.in");
  const [password, setPassword] = useState("••••••••");

  const handleLogin = (e) => {
    e.preventDefault();

    if (role === "business") {
      setLoggedIn(true);
    } else {
      alert("Government Officer / Department Nodal Desk authentication portal is currently accessible via Parichay Gov SSO in production.");
    }
  };

  if (loggedIn) {
    return (
      <BusinessDashboard
        onLogout={() => setLoggedIn(false)}
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
              <span>Back to Portal Home</span>
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
              <h2>UdyogFlow Single Sign-On</h2>
              <span>Smart Industrial Approval & Compliance Gateway</span>
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
                <strong>Business Investor</strong>
                <small>Industrial Units & MSMEs</small>
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
                <small>MAITRI / Department Nodal Desk</small>
              </div>
            </button>
          </div>

          {/* Login Form */}
          <form className="gov-login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="loginEmail">
                {role === "business" ? "Registered Email / Udyam ID" : "Official Government Email (.gov.in / .nic.in)"}
              </label>
              <input
                id="loginEmail"
                type="text"
                placeholder={role === "business" ? "name@company.com or Udyam number" : "officer@maharashtra.gov.in"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="label-with-link">
                <label htmlFor="loginPassword">Access Password</label>
                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => alert("Password reset OTP will be sent to your registered mobile linked to PAN / Aadhaar.")}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="input-with-action">
                <input
                  id="loginPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter security password"
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

            <div className="login-remember-row">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Keep session active on this workstation</span>
              </label>
              <span className="secure-badge">
                <IconShieldCheck size={14} /> 2FA Ready
              </span>
            </div>

            <button type="submit" className="btn-login-submit">
              <span>Sign In to {role === "business" ? "Investor Dashboard" : "Department Desk"}</span>
              <IconCheck size={18} />
            </button>
          </form>

          {/* Registration Prompt */}
          {role === "business" ? (
            <div className="login-footer-action">
              <span>New enterprise setting up in Maharashtra?</span>
              <button
                type="button"
                className="action-register-link"
                onClick={() => {
                  if (onBack) onBack();
                }}
              >
                Start New Application →
              </button>
            </div>
          ) : (
            <div className="login-footer-action">
              <small className="officer-notice">
                Official access is audited by MahaIT under State Cyber Security Policy 2024.
              </small>
            </div>
          )}

          {/* Trust Security Footer */}
          <div className="login-security-notice">
            <IconLock size={14} />
            <span>256-Bit SSL Encrypted · Integrated with MAITRI Single Window Clearances</span>
          </div>
        </div>

        <p className="login-bottom-credits">
          © 2026 Government of Maharashtra. Department of Industries & MIDC.
        </p>
      </div>
    </div>
  );
}

export default Login;
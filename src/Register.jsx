import { useState } from "react";
import maharashtraLogo from "./assets/maharashtra-logo.png";
import { IconArrowLeft, IconShieldCheck, IconCheck } from "./Icons";

function Register({ onNavigateLogin, onNavigateHome, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    password: "",
    district: "Pune",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      if (onRegisterSuccess) {
        onRegisterSuccess();
      } else if (onNavigateLogin) {
        onNavigateLogin();
      }
    }, 1200);
  };

  return (
    <div className="login-wrapper">
      {/* Top Bar */}
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
          {onNavigateHome && (
            <button
              type="button"
              className="btn-back-home"
              onClick={onNavigateHome}
            >
              <IconArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </div>

      <div className="login-center-box">
        <div className="login-card-enterprise">
          {/* Card Head */}
          <div className="login-card-head">
            <div className="udyog-logo-square">U</div>
            <div className="login-header-text">
              <h2>Create Investor Account</h2>
              <span>UdyogFlow Single Window Portal</span>
            </div>
          </div>

          <div className="prototype-note-bar">
            <span>PROTOTYPE PREVIEW · USER REGISTRATION DEMONSTRATION</span>
          </div>

          {submitted ? (
            <div className="register-success-box">
              <div className="success-icon"><IconCheck size={28} /></div>
              <h3>Registration Successful!</h3>
              <p>Your enterprise account is ready. Redirecting to sign in...</p>
            </div>
          ) : (
            <form className="gov-login-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="regName">Full Name</label>
                <input
                  id="regName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="regBusiness">Enterprise / Business Name</label>
                <input
                  id="regBusiness"
                  type="text"
                  name="businessName"
                  placeholder="Enter registered business name"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="regEmail">Official Email</label>
                <input
                  id="regEmail"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="regDistrict">Industrial District</label>
                <select
                  id="regDistrict"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                >
                  <option value="Pune">Pune</option>
                  <option value="Thane">Thane</option>
                  <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Raigad">Raigad</option>
                  <option value="Kolhapur">Kolhapur</option>
                  <option value="Palghar">Palghar</option>
                  <option value="Solapur">Solapur</option>
                  <option value="Amravati">Amravati</option>
                  <option value="Other">Other Maharashtra District</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="regPassword">Create Password</label>
                <input
                  id="regPassword"
                  type="password"
                  name="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn-login-submit">
                <span>Register Enterprise</span>
                <IconCheck size={18} />
              </button>
            </form>
          )}

          {/* Switch to Sign In */}
          <div className="login-footer-action">
            <span>Already have an account?</span>
            <button
              type="button"
              className="action-register-link"
              onClick={onNavigateLogin}
            >
              Sign In →
            </button>
          </div>

          {/* Security Notice */}
          <div className="login-security-notice">
            <IconShieldCheck size={14} />
            <span>Encrypted & Verified via Maharashtra Single Window</span>
          </div>
        </div>

        <p className="login-bottom-credits">
          © 2026 Government of Maharashtra. Department of Industries & MIDC.
        </p>
      </div>
    </div>
  );
}

export default Register;

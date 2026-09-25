import { useState } from "react";
import maharashtraLogo from "./assets/maharashtra-logo.png";
import { IconArrowLeft, IconBuilding, IconCheck, IconShieldCheck, IconInfo } from "./Icons";

const MAHARASHTRA_CITIES = [
  "mumbai",
  "pune",
  "nagpur",
  "nashik",
  "thane",
  "aurangabad",
  "chhatrapati sambhajinagar",
  "kolhapur",
  "solapur",
  "amravati",
  "navi mumbai",
  "vasai",
  "virar",
  "satara",
  "sangli",
  "jalgaon",
  "akola",
  "latur",
  "ahmednagar",
  "dhule",
  "nanded",
  "ratnagiri",
  "chandrapur",
  "parbhani",
  "beed",
  "osmanabad",
  "dharashiv",
  "yavatmal",
  "wardha",
  "buldhana",
  "washim",
  "gondia",
  "bhandara",
  "palghar",
  "raigad",
  "sindhudurg",
  "hingoli",
  "gadchiroli"
];

const POPULAR_DISTRICTS = [
  "Pune",
  "Thane",
  "Chhatrapati Sambhajinagar",
  "Nagpur",
  "Nashik",
  "Raigad",
  "Kolhapur",
  "Palghar"
];

function ApplicationSetup({ onGenerateRoadmap, onBack, userId, onApplicationCreated }) {
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    location: "",
    businessType: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setErrorMessage("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDistrictSelect = (district) => {
    setErrorMessage("");
    setFormData((prev) => ({
      ...prev,
      location: district,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const loc = formData.location.trim().toLowerCase();
    const isMaharashtra = MAHARASHTRA_CITIES.some((city) =>
      loc.includes(city)
    );

    if (!isMaharashtra) {
      setErrorMessage(
        "UdyogFlow currently supports industrial approvals within Maharashtra only. Please enter a valid district or city in Maharashtra (e.g. Pune, Chhatrapati Sambhajinagar, Thane)."
      );
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://udyogflow.onrender.com/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
  ...formData,
  userId,
}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save application");
      }

      console.log("Application saved successfully:", data);

      if (onApplicationCreated && data.application) {
        onApplicationCreated(data.application);
      }

      onGenerateRoadmap({
        ...formData,
        applicationId: data.application.application_id,
        userId,
        application: data.application,
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      setErrorMessage(
        error.message || "Could not connect to the backend server. Please verify the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-page">
      {/* Top Government Navigation Strip */}
      <header className="gov-strip">
        <div className="gov-strip-inner">
          <div className="gov-brand-left">
            <img
              src={maharashtraLogo}
              alt="Government of Maharashtra"
              className="gov-seal"
            />
            <div className="gov-brand-text">
              <span className="gov-title-en">Government of Maharashtra</span>
              <span className="gov-title-mr">महाराष्ट्र शासन · उद्योग संचालनालय</span>
            </div>
          </div>
          <div className="gov-strip-right">
            {onBack && (
              <button
                type="button"
                className="gov-back-btn"
                onClick={onBack}
              >
                <IconArrowLeft size={16} />
                <span>Return to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="app-form-container">
        {/* Breadcrumb */}
        <div className="portal-breadcrumb">
          <span>Home</span>
          <span className="bc-sep">/</span>
          <span>MAITRI Approvals</span>
          <span className="bc-sep">/</span>
          <span className="bc-current">New Industrial Registration</span>
        </div>

        {/* Page Header */}
        <div className="application-header">
          <div className="app-badge">
            <IconShieldCheck size={14} />
            <span>MAITRI Integrated Single Window System</span>
          </div>
          <h1>Industrial Investment & Approval Intake</h1>
          <p>
            Submit your proposed enterprise specifications to automatically generate
            a customized statutory approval roadmap across MPCB, DISH, MIDC, Fire Services, and Revenue departments.
          </p>
        </div>

        {/* Multi-Step Guide Header */}
        <div className="form-steps-bar">
          <div className="step-badge active">
            <span className="step-num">1</span>
            <span className="step-text">Enterprise Profile</span>
          </div>
          <div className="step-divider"></div>
          <div className="step-badge active">
            <span className="step-num">2</span>
            <span className="step-text">Sector & Location</span>
          </div>
          <div className="step-divider"></div>
          <div className="step-badge active">
            <span className="step-num">3</span>
            <span className="step-text">Clearance Roadmap</span>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="gov-alert danger">
            <IconInfo size={20} />
            <div>
              <strong>Validation Alert:</strong> {errorMessage}
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="app-card">
          <div className="card-section-title">
            <IconBuilding size={18} />
            <h3>Proposed Industrial Enterprise Details</h3>
          </div>

          <form className="application-form" onSubmit={handleSubmit} autoComplete="off">
            {/* Business Name */}
            <div className="form-group">
              <label htmlFor="businessName">
                Enterprise / Company Name <span className="req">*</span>
              </label>
              <input
                id="businessName"
                type="text"
                name="businessName"
                placeholder="e.g. Sahyadri Agro Technologies Pvt. Ltd."
                value={formData.businessName}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <span className="field-hint">
                Provide official legal name registered under MCA / Udyam / Partnership deed.
              </span>
            </div>

            {/* Grid 2-col: Industry & Business Type */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="industry">
                  Industry / Sector <span className="req">*</span>
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Industry Sector</option>
                  <option value="Agro processing">Agro processing</option>
                  <option value="Chemical & Fertilizer">Chemical & Fertilizer</option>
                  <option value="Conventional & Non-Conventional">Conventional & Non-Conventional</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Food and Fruit processing">Food and Fruit processing</option>
                  <option value="IT/ITES">IT/ITES</option>
                  <option value="Mineral Based">Mineral Based</option>
                  <option value="Other">Other</option>
                  <option value="Paper & Paper Based Products">Paper & Paper Based Products</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Steel">Steel</option>
                  <option value="Sugar">Sugar</option>
                  <option value="Textile">Textile</option>
                </select>
                <span className="field-hint">
                  Determines MPCB environmental category & applicable MIDC zoning rules.
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="businessType">
                  Enterprise Classification <span className="req">*</span>
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Enterprise Category</option>
                  <option value="MSME">MSME (Micro, Small & Medium)</option>
                  <option value="Startup">Recognized DPIIT Startup</option>
                  <option value="Large Enterprise">Large / Mega Project</option>
                  <option value="Individual Entrepreneur">Individual Entrepreneur / Proprietary</option>
                </select>
                <span className="field-hint">
                  Determines eligibility for Package Scheme of Incentives (PSI 2019).
                </span>
              </div>
            </div>

            {/* Location with Quick Select */}
            <div className="form-group">
              <label htmlFor="location">
                Proposed Unit Location (City / District in Maharashtra) <span className="req">*</span>
              </label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="e.g. Pune, Chhatrapati Sambhajinagar, Thane, MIDC Butibori..."
                value={formData.location}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="off"
              />
              <div className="quick-chips-wrapper">
                <span className="chip-label">Quick select major industrial hubs:</span>
                <div className="chip-list">
                  {POPULAR_DISTRICTS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`district-chip ${formData.location.toLowerCase().includes(d.toLowerCase()) ? "active" : ""}`}
                      onClick={() => handleDistrictSelect(d)}
                      disabled={loading}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="form-group">
              <label htmlFor="description">
                Project Scope & Production Description <span className="req">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe key manufacturing processes, proposed power & water load, raw materials, and expected employment generation..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
                disabled={loading}
              />
              <span className="field-hint">
                Used by AI Assistant to identify mandatory environmental, fire safety, and factory licensing clearances.
              </span>
            </div>

            {/* Security and Guarantee Note */}
            <div className="form-security-note">
              <IconShieldCheck size={18} />
              <span>
                Data entered is protected under Government of Maharashtra Data Privacy Protocols and directly integrated with the MAITRI approval engine.
              </span>
            </div>

            {/* Submit Bar */}
            <div className="form-action-bar">
              {onBack && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onBack}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-inline"></span>
                    <span>Querying MAITRI Clearance Engine...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Statutory Approval Roadmap</span>
                    <IconCheck size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplicationSetup;
import { useState } from "react";
import maharashtraLogo from "./assets/maharashtra-logo.png";
import ApplicationSetup from "./ApplicationSetup";
import ApprovalRoadmap from "./ApprovalRoadmap";
import Login from "./Login";
import Register from "./Register";
import About from "./About";
import Features from "./Features";
import {
  IconRoadmap,
  IconBot,
  IconShieldCheck,
  IconFileCheck,
  IconClockAlert,
  IconRepeat,
  IconAward,
  IconBell,
  IconArrowRight,
  IconCheck
} from "./Icons";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home"); // home, about, features, login, register, application, roadmap
  const [language, setLanguage] = useState("English");
  const [applicationData, setApplicationData] = useState(null);

  // Sub-views that replace the page layout
  if (currentPage === "login") {
    return (
      <Login
        onBack={() => setCurrentPage("home")}
        onNavigateRegister={() => setCurrentPage("register")}
      />
    );
  }

  if (currentPage === "register") {
    return (
      <Register
        onNavigateLogin={() => setCurrentPage("login")}
        onNavigateHome={() => setCurrentPage("home")}
        onRegisterSuccess={() => setCurrentPage("login")}
      />
    );
  }

  if (currentPage === "roadmap") {
    return (
      <ApprovalRoadmap
        applicationData={applicationData}
        onBack={() => setCurrentPage("home")}
      />
    );
  }

  if (currentPage === "application") {
    return (
      <ApplicationSetup
        onBack={() => setCurrentPage("home")}
        onGenerateRoadmap={(data) => {
          setApplicationData(data);
          setCurrentPage("roadmap");
        }}
      />
    );
  }

  return (
    <div className="landing-wrapper">
      {/* 1. TOP OFFICIAL GOVERNMENT STRIP */}
      <div className="portal-top-ribbon">
        <div className="ribbon-inner">
          <div className="ribbon-left">
            <span className="ribbon-flag-text">
              शासकीय संकेतस्थळ · Government of Maharashtra
            </span>
          </div>
          <div className="ribbon-right">
            <span className="ribbon-dept">Department of Industries · MAITRI Single Window</span>
            <div className="ribbon-lang-wrap">
              <select
                className="ribbon-lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Language selection"
              >
                <option value="English">English</option>
                <option value="Marathi">मराठी</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN PUBLIC NAVBAR (Home, About, Features, Sign In, Register) */}
      <header className="main-navbar">
        <div
          className="nav-brand-group cursor-pointer"
          onClick={() => setCurrentPage("home")}
        >
          <img
            src={maharashtraLogo}
            alt="Government of Maharashtra"
            className="navbar-emblem"
          />
          <div className="gov-seal-text">
            <strong>Government of Maharashtra</strong>
            <span>महाराष्ट्र शासन</span>
          </div>

          <div className="brand-pipe"></div>

          <div className="udyog-brand-box">
            <div className="udyog-badge-u">U</div>
            <div className="udyog-text-col">
              <h2>UdyogFlow</h2>
              <span>Smart Industrial Approvals</span>
            </div>
          </div>
        </div>

        {/* Public Navigation Links */}
        <nav className="nav-menu-links">
          <button
            type="button"
            className={`nav-link-btn ${currentPage === "home" ? "active" : ""}`}
            onClick={() => setCurrentPage("home")}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-link-btn ${currentPage === "about" ? "active" : ""}`}
            onClick={() => setCurrentPage("about")}
          >
            About
          </button>
          <button
            type="button"
            className={`nav-link-btn ${currentPage === "features" ? "active" : ""}`}
            onClick={() => setCurrentPage("features")}
          >
            Features
          </button>
        </nav>

        {/* Auth Buttons */}
        <div className="nav-action-buttons">
          <button
            type="button"
            className="btn-nav-login"
            onClick={() => setCurrentPage("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className="btn-nav-register"
            onClick={() => setCurrentPage("register")}
          >
            Register
          </button>
          <button
            type="button"
            className="btn-nav-primary"
            onClick={() => setCurrentPage("application")}
          >
            Get Started →
          </button>
        </div>
      </header>

      {/* 3. PUBLIC BODY: HOME vs ABOUT vs FEATURES */}
      {currentPage === "about" && (
        <About
          onGetStarted={() => setCurrentPage("application")}
          onExploreFeatures={() => setCurrentPage("features")}
        />
      )}

      {currentPage === "features" && (
        <Features
          onGetStarted={() => setCurrentPage("application")}
        />
      )}

      {currentPage === "home" && (
        <>
          {/* Hero Section */}
          <section className="hero-banner-section">
            <div className="hero-grid-container">
              <div className="hero-content-col">
                <div className="hero-flagship-pill">
                  <IconShieldCheck size={16} />
                  <span>MAITRI SINGLE WINDOW CLEARANCE PORTAL</span>
                </div>

                <h1 className="hero-main-title">
                  Industrial Approvals in Maharashtra,
                  <span className="title-highlight"> Simplified.</span>
                </h1>

                {/* One simple explanation */}
                <p className="hero-description">
                  UdyogFlow provides businesses with a single guided roadmap to obtain clearances across MPCB, MIDC, DISH, and Fire departments with guaranteed statutory timelines.
                </p>

                <div className="hero-btn-row">
                  <button
                    type="button"
                    className="btn-hero-primary"
                    onClick={() => setCurrentPage("application")}
                  >
                    <span>Get Started</span>
                    <IconArrowRight size={18} />
                  </button>

                  <button
                    type="button"
                    className="btn-hero-secondary"
                    onClick={() => setCurrentPage("about")}
                  >
                    <span>Learn How It Works</span>
                  </button>
                </div>

                {/* Short Stats Bar */}
                <div className="hero-metrics-row">
                  <div className="metric-item">
                    <strong>36</strong>
                    <span>Districts</span>
                  </div>
                  <div className="metric-divider"></div>
                  <div className="metric-item">
                    <strong>100+</strong>
                    <span>Statutory Clearances</span>
                  </div>
                  <div className="metric-divider"></div>
                  <div className="metric-item">
                    <strong>100%</strong>
                    <span>Digital Process</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Simple Live Blueprint Card */}
              <div className="hero-card-col">
                <div className="hero-blueprint-card">
                  <div className="blueprint-header">
                    <div>
                      <span className="blueprint-tag">APPLICATION OVERVIEW</span>
                      <h3>Industrial Approval Roadmap</h3>
                    </div>
                    <span className="live-status-chip">● Active</span>
                  </div>

                  <div className="blueprint-progress-box">
                    <div className="prog-row">
                      <span>Overall Clearance</span>
                      <strong>62% Complete</strong>
                    </div>
                    <div className="prog-bar-track">
                      <div className="prog-bar-fill" style={{ width: "62%" }}></div>
                    </div>
                  </div>

                  <div className="blueprint-stages-list">
                    <div className="stage-item completed">
                      <div className="stage-check"><IconCheck size={14} /></div>
                      <div className="stage-info">
                        <strong>Business Incorporation & Udyam</strong>
                        <small>Verified</small>
                      </div>
                    </div>

                    <div className="stage-item completed">
                      <div className="stage-check"><IconCheck size={14} /></div>
                      <div className="stage-info">
                        <strong>MIDC Land Allotment</strong>
                        <small>Approved</small>
                      </div>
                    </div>

                    <div className="stage-item in-review">
                      <div className="stage-num">3</div>
                      <div className="stage-info">
                        <strong>MPCB Consent to Establish (CTE)</strong>
                        <small>Under Review · 5 Days Left</small>
                      </div>
                    </div>

                    <div className="stage-item queued">
                      <div className="stage-num">4</div>
                      <div className="stage-info">
                        <strong>Factory License (DISH)</strong>
                        <small>Upcoming</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Short Feature Highlights (One sentence each) */}
          <section className="capabilities-section">
            <div className="section-head-center">
              <span className="section-eyebrow">WHAT WE OFFER</span>
              <h2>One Platform. Complete Clearance Support.</h2>
              <p>Everything you need from setup to continuous compliance.</p>
            </div>

            <div className="capabilities-grid">
              <div
                className="cap-card cursor-pointer"
                onClick={() => setCurrentPage("features")}
              >
                <div className="cap-icon-box icon-navy">
                  <IconRoadmap size={22} />
                </div>
                <h3>Approval Roadmap</h3>
                <p>Personalized step-by-step roadmap showing all required clearances.</p>
              </div>

              <div
                className="cap-card cursor-pointer"
                onClick={() => setCurrentPage("features")}
              >
                <div className="cap-icon-box icon-purple">
                  <IconBot size={22} />
                </div>
                <h3>AI Assistant</h3>
                <p>Quick guidance on pollution categories, acts, and clearance procedures.</p>
              </div>

              <div
                className="cap-card cursor-pointer"
                onClick={() => setCurrentPage("features")}
              >
                <div className="cap-icon-box icon-green">
                  <IconFileCheck size={22} />
                </div>
                <h3>Documents</h3>
                <p>Pre-validate document formats and signatures before filing.</p>
              </div>

              <div
                className="cap-card cursor-pointer"
                onClick={() => setCurrentPage("features")}
              >
                <div className="cap-icon-box icon-blue">
                  <IconShieldCheck size={22} />
                </div>
                <h3>Secure Document Reuse</h3>
                <p>Reuse verified certificates across departments without re-uploading.</p>
              </div>

              <div
                className="cap-card cursor-pointer"
                onClick={() => setCurrentPage("features")}
              >
                <div className="cap-icon-box icon-amber">
                  <IconClockAlert size={22} />
                </div>
                <h3>Delay Alerts</h3>
                <p>Early warnings on potential department bottlenecks to prevent delays.</p>
              </div>

              <div
                className="cap-card cursor-pointer"
                onClick={() => setCurrentPage("features")}
              >
                <div className="cap-icon-box icon-teal">
                  <IconRepeat size={22} />
                </div>
                <h3>Compliance</h3>
                <p>Automated renewal reminders for factory licenses and returns.</p>
              </div>

              <div
                className="cap-card cursor-pointer"
                onClick={() => setCurrentPage("features")}
              >
                <div className="cap-icon-box icon-orange">
                  <IconAward size={22} />
                </div>
                <h3>Government Schemes</h3>
                <p>Discover eligible fiscal incentives under Package Scheme of Incentives (PSI 2019).</p>
              </div>

              <div
                className="cap-card cursor-pointer"
                onClick={() => setCurrentPage("features")}
              >
                <div className="cap-icon-box icon-red">
                  <IconBell size={22} />
                </div>
                <h3>Notifications</h3>
                <p>Instant alerts on scrutiny updates, approvals, and official circulars.</p>
              </div>
            </div>
          </section>

          {/* 4 Steps Section */}
          <section className="workflow-section">
            <div className="section-head-center">
              <span className="section-eyebrow">SIMPLE PROCESS</span>
              <h2>How It Works</h2>
              <p>Four easy steps to establish your industrial enterprise.</p>
            </div>

            <div className="workflow-steps-container">
              <div className="wf-step-card">
                <div className="wf-step-num">01</div>
                <h3>Enter Business Details</h3>
                <p>Tell us your industry sector, enterprise classification, and location.</p>
              </div>

              <div className="wf-step-card">
                <div className="wf-step-num">02</div>
                <h3>Get Approval Roadmap</h3>
                <p>The platform identifies the clearances, fees, and documents you need.</p>
              </div>

              <div className="wf-step-card">
                <div className="wf-step-num">03</div>
                <h3>Submit & Track</h3>
                <p>Upload documents once and monitor progress across all departments.</p>
              </div>

              <div className="wf-step-card">
                <div className="wf-step-num">04</div>
                <h3>Maintain Compliance</h3>
                <p>Receive timely alerts for annual renewals, inspections, and filings.</p>
              </div>
            </div>
          </section>

          {/* Clean CTA Strip */}
          <section className="landing-cta-banner">
            <div className="cta-banner-content">
              <h2>Start Your Application Today</h2>
              <p>Join businesses across Maharashtra managing clearances transparently.</p>
              <div className="cta-actions">
                <button
                  type="button"
                  className="btn-cta-white"
                  onClick={() => setCurrentPage("application")}
                >
                  <span>Get Started Now</span>
                  <IconArrowRight size={16} />
                </button>
                <button
                  type="button"
                  className="btn-cta-outline"
                  onClick={() => setCurrentPage("login")}
                >
                  Sign In
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 4. CLEAN PUBLIC FOOTER */}
      <footer className="gov-landing-footer">
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <div className="footer-emblem-row">
              <img
                src={maharashtraLogo}
                alt="Government of Maharashtra"
                className="footer-logo"
              />
              <div>
                <strong>Government of Maharashtra</strong>
                <span>महाराष्ट्र शासन · Department of Industries</span>
              </div>
            </div>
            <p className="footer-dept-desc">
              UdyogFlow provides single window industrial clearance facilitation under MAITRI.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <ul>
              <li><button type="button" className="footer-link-btn" onClick={() => setCurrentPage("home")}>Home</button></li>
              <li><button type="button" className="footer-link-btn" onClick={() => setCurrentPage("about")}>About</button></li>
              <li><button type="button" className="footer-link-btn" onClick={() => setCurrentPage("features")}>Features</button></li>
              <li><button type="button" className="footer-link-btn" onClick={() => setCurrentPage("login")}>Sign In</button></li>
              <li><button type="button" className="footer-link-btn" onClick={() => setCurrentPage("register")}>Register</button></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Support Portals</h4>
            <ul>
              <li><a href="https://maitri.mahaonline.gov.in" target="_blank" rel="noopener noreferrer">MAITRI Portal</a></li>
              <li><a href="https://midcindia.org" target="_blank" rel="noopener noreferrer">MIDC India</a></li>
              <li><a href="https://mpcb.gov.in" target="_blank" rel="noopener noreferrer">MPCB Maharashtra</a></li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4>Investor Helpline</h4>
            <p className="footer-phone">1800 120 8040</p>
            <p>Mon - Sat (9:30 AM to 6:00 PM)</p>
            <p className="footer-email">support@udyogflow.gov.in</p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="bottom-copy">
            © 2026 Government of Maharashtra. All rights reserved.
          </div>
          <div className="bottom-policies">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Accessibility</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
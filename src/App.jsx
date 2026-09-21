import { useState } from "react";
import maharashtraLogo from "./assets/maharashtra-logo.png";
import ApplicationSetup from "./ApplicationSetup";
import ApprovalRoadmap from "./ApprovalRoadmap";
import Login from "./Login";
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
  const [language, setLanguage] = useState("English");
  const [showApplication, setShowApplication] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  // Show Login page
  if (showLogin) {
    return <Login onBack={() => setShowLogin(false)} />;
  }

  // Show Approval Roadmap
  if (showRoadmap) {
    return (
      <ApprovalRoadmap
        applicationData={applicationData}
        onBack={() => setShowRoadmap(false)}
      />
    );
  }

  // Show Application Form
  if (showApplication) {
    return (
      <ApplicationSetup
        onBack={() => setShowApplication(false)}
        onGenerateRoadmap={(data) => {
          setApplicationData(data);
          setShowApplication(false);
          setShowRoadmap(true);
        }}
      />
    );
  }

  return (
    <div className="landing-wrapper">
      {/* =========================================================================
          1. TOP OFFICIAL GOVERNMENT STRIP
         ========================================================================= */}
      <div className="portal-top-ribbon">
        <div className="ribbon-inner">
          <div className="ribbon-left">
            <span className="ribbon-flag-text">
              शासकीय संकेतस्थळ · Official Portal of Government of Maharashtra
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

      {/* =========================================================================
          2. MAIN NAVBAR
         ========================================================================= */}
      <header className="main-navbar">
        <div className="nav-brand-group">
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
              <span>Smart Industrial Clearances</span>
            </div>
          </div>
        </div>

        <nav className="nav-menu-links">
          <a href="#home">Home</a>
          <a href="#features">Key Capabilities</a>
          <a href="#how-it-works">Approval Journey</a>
          <a href="#clusters">Industrial Clusters</a>
          <a href="#about">About MAITRI</a>
        </nav>

        <div className="nav-action-buttons">
          <button
            type="button"
            className="btn-nav-login"
            onClick={() => setShowLogin(true)}
          >
            Investor Login
          </button>
          <button
            type="button"
            className="btn-nav-primary"
            onClick={() => setShowApplication(true)}
          >
            Apply for Approvals →
          </button>
        </div>
      </header>

      {/* =========================================================================
          3. HERO SECTION
         ========================================================================= */}
      <section id="home" className="hero-banner-section">
        <div className="hero-grid-container">
          <div className="hero-content-col">
            <div className="hero-flagship-pill">
              <IconShieldCheck size={16} />
              <span>MAITRI INTEGRATED SINGLE WINDOW SYSTEM</span>
            </div>

            <h1 className="hero-main-title">
              Accelerating Industrial Approvals for
              <span className="title-highlight"> Maharashtra's Growth</span>
            </h1>

            <p className="hero-description">
              UdyogFlow unifies statutory clearances across MPCB, MIDC, DISH, Fire Services, and Revenue
              departments into one intelligent digital pipeline. Zero physical visits, guaranteed statutory SLAs,
              and AI-powered compliance guidance.
            </p>

            <div className="hero-btn-row">
              <button
                type="button"
                className="btn-hero-primary"
                onClick={() => setShowApplication(true)}
              >
                <span>Start Industrial Application</span>
                <IconArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => setShowLogin(true)}
              >
                <span>Access Investor Portal</span>
              </button>
            </div>

            {/* Industrial Credibility Row */}
            <div className="hero-metrics-row">
              <div className="metric-item">
                <strong>36</strong>
                <span>Districts Connected</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <strong>100+</strong>
                <span>MAITRI Clearance Services</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <strong>100%</strong>
                <span>Digital Scrutiny via RTI Act</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Interactive Clearance Blueprint Card */}
          <div className="hero-card-col">
            <div className="hero-blueprint-card">
              <div className="blueprint-header">
                <div>
                  <span className="blueprint-tag">AUTOMATED CLEARANCE PIPELINE</span>
                  <h3>Statutory Approval Roadmap</h3>
                </div>
                <span className="live-status-chip">● Live MAITRI Database</span>
              </div>

              {/* Progress */}
              <div className="blueprint-progress-box">
                <div className="prog-row">
                  <span>Overall Pipeline Clearance</span>
                  <strong>62% Completed</strong>
                </div>
                <div className="prog-bar-track">
                  <div className="prog-bar-fill" style={{ width: "62%" }}></div>
                </div>
              </div>

              {/* Stages List */}
              <div className="blueprint-stages-list">
                <div className="stage-item completed">
                  <div className="stage-check"><IconCheck size={14} /></div>
                  <div className="stage-info">
                    <strong>Business Incorporation & Udyam</strong>
                    <small>Verified via MCA & MSME Portal</small>
                  </div>
                </div>

                <div className="stage-item completed">
                  <div className="stage-check"><IconCheck size={14} /></div>
                  <div className="stage-info">
                    <strong>MIDC Land Allotment & Zoning NOC</strong>
                    <small>Cleared by MIDC Regional Officer</small>
                  </div>
                </div>

                <div className="stage-item in-review">
                  <div className="stage-num">3</div>
                  <div className="stage-info">
                    <strong>MPCB Consent to Establish (CTE)</strong>
                    <small>Technical Scrutiny · SLA Remaining: 6 Days</small>
                  </div>
                </div>

                <div className="stage-item queued">
                  <div className="stage-num">4</div>
                  <div className="stage-info">
                    <strong>Directorate of Industrial Safety (DISH)</strong>
                    <small>Factory Layout Plan Scrutiny · Queued</small>
                  </div>
                </div>
              </div>

              {/* AI Assistant Callout Box */}
              <div className="blueprint-ai-notice">
                <div className="ai-icon-bubble">
                  <IconBot size={18} />
                </div>
                <div className="ai-notice-text">
                  <strong>MAITRI AI Advisory</strong>
                  <p>
                    MPCB site review for Chakan is on track. Prepare effluent treatment schematics
                    and certified building layout for simultaneous DISH clearance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THE 8 HIGHLIGHT CAPABILITIES (FEATURES GRID)
         ========================================================================= */}
      <section id="features" className="capabilities-section">
        <div className="section-head-center">
          <span className="section-eyebrow">ENTERPRISE INDUSTRIAL ARCHITECTURE</span>
          <h2>Intelligent Single Window Capabilities</h2>
          <p>
            Purpose-built to meet the stringent compliance needs of manufacturing, chemical, agro-processing,
            engineering, and IT enterprises investing in Maharashtra.
          </p>
        </div>

        <div className="capabilities-grid">
          {/* 1. Smart Approval Roadmap */}
          <div className="cap-card">
            <div className="cap-icon-box icon-navy">
              <IconRoadmap size={24} />
            </div>
            <h3>1. Smart Approval Roadmap</h3>
            <p>
              Dynamic dependency tree mapping pre-establishment and pre-operation approvals.
              Identifies clearances that can be applied in parallel to eliminate idle waiting periods.
            </p>
          </div>

          {/* 2. AI Assistant */}
          <div className="cap-card">
            <div className="cap-icon-box icon-purple">
              <IconBot size={24} />
            </div>
            <h3>2. AI Industrial Assistant</h3>
            <p>
              Natural language regulatory co-pilot trained on Maharashtra Industrial Policy,
              pollution categorizations (Red/Orange/Green/White), and MAITRI departmental guidelines.
            </p>
          </div>

          {/* 3. Document Pre-Validation */}
          <div className="cap-card">
            <div className="cap-icon-box icon-green">
              <IconFileCheck size={24} />
            </div>
            <h3>3. Document Pre-Validation</h3>
            <p>
              Automated OCR scrutiny testing file resolutions, DSC digital signatures, land mutation
              stamps, and structural certifications before official submission to avoid rejections.
            </p>
          </div>

          {/* 4. Secure Document Reuse */}
          <div className="cap-card">
            <div className="cap-icon-box icon-blue">
              <IconShieldCheck size={24} />
            </div>
            <h3>4. Secure Document Reuse</h3>
            <p>
              Integrated with DigiLocker and Maha-Locker. Verified company documents are reused across
              5+ government departments with cryptographic tamper-evident proof.
            </p>
          </div>

          {/* 5. Delay Prediction */}
          <div className="cap-card">
            <div className="cap-icon-box icon-amber">
              <IconClockAlert size={24} />
            </div>
            <h3>5. Delay Prediction & SLA Radar</h3>
            <p>
              Historical turnaround analytics forecasting potential scrutiny delays by district
              and department, triggering proactive mitigation tips to safeguard project timelines.
            </p>
          </div>

          {/* 6. Compliance & Renewals */}
          <div className="cap-card">
            <div className="cap-icon-box icon-teal">
              <IconRepeat size={24} />
            </div>
            <h3>6. Compliance & Renewals</h3>
            <p>
              Automated statutory compliance calendar tracking annual factory license renewals,
              MPCB environmental returns (Form V), fire audits, and boiler safety certifications.
            </p>
          </div>

          {/* 7. Government Schemes */}
          <div className="cap-card">
            <div className="cap-icon-box icon-orange">
              <IconAward size={24} />
            </div>
            <h3>7. Government Schemes & PSI</h3>
            <p>
              Automated eligibility calculation under Maharashtra Package Scheme of Incentives (PSI 2019),
              MSME interest subsidies, power tariff discounts, and stamp duty waivers.
            </p>
          </div>

          {/* 8. Alerts & Notifications */}
          <div className="cap-card">
            <div className="cap-icon-box icon-red">
              <IconBell size={24} />
            </div>
            <h3>8. Alerts & Notifications</h3>
            <p>
              Real-time SMS and dashboard updates regarding officer site visits, queries,
              clearance milestones, and government industrial policy circulars.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. HOW IT WORKS (THE 4-STEP CLEARANCE JOURNEY)
         ========================================================================= */}
      <section id="how-it-works" className="workflow-section">
        <div className="section-head-center">
          <span className="section-eyebrow">STREAMLINED PROCEDURE</span>
          <h2>From Project Concept to Operational Factory</h2>
          <p>Four transparent stages ensuring end-to-end statutory compliance under Maharashtra laws.</p>
        </div>

        <div className="workflow-steps-container">
          <div className="wf-step-card">
            <div className="wf-step-num">01</div>
            <h3>Define Industrial Scope</h3>
            <p>
              Enter enterprise name, industry sector, proposed district in Maharashtra, and production brief.
            </p>
          </div>

          <div className="wf-step-card">
            <div className="wf-step-num">02</div>
            <h3>Generate Approval Roadmap</h3>
            <p>
              UdyogFlow queries the MAITRI database to map all required departmental NOCs, SLAs, and fees.
            </p>
          </div>

          <div className="wf-step-card">
            <div className="wf-step-num">03</div>
            <h3>Parallel Scrutiny & Tracking</h3>
            <p>
              Submit documents once. Monitor live scrutiny progress across MPCB, DISH, MIDC, and Fire departments.
            </p>
          </div>

          <div className="wf-step-card">
            <div className="wf-step-num">04</div>
            <h3>Continuous Compliance</h3>
            <p>
              Receive digital certificates and maintain statutory renewals through the automated compliance vault.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. MAHARASHTRA INDUSTRIAL CLUSTERS HIGHLIGHT
         ========================================================================= */}
      <section id="clusters" className="clusters-section">
        <div className="section-head-center">
          <span className="section-eyebrow">DESTINATION MAHARASHTRA</span>
          <h2>World-Class Industrial Infrastructure</h2>
          <p>Accelerating investment across Maharashtra's premier manufacturing corridors.</p>
        </div>

        <div className="clusters-grid">
          <div className="cluster-box">
            <div className="cluster-tag">AUTOMOTIVE & ENGINEERING</div>
            <h3>Chakan & Talegaon (Pune)</h3>
            <p>India’s premier automotive hub with plug-and-play MIDC industrial parks and dedicated expressway connectivity.</p>
          </div>

          <div className="cluster-box">
            <div className="cluster-tag">SMART INDUSTRIAL CITY</div>
            <h3>AURIC (Shendra - Bidkin)</h3>
            <p>India's first greenfield industrial smart city along the Delhi-Mumbai Industrial Corridor (DMIC) in Chhatrapati Sambhajinagar.</p>
          </div>

          <div className="cluster-box">
            <div className="cluster-tag">LOGISTICS & HEAVY INDUSTRY</div>
            <h3>Butibori & MIHAN (Nagpur)</h3>
            <p>Asia’s largest industrial area connected via Samruddhi Mahamarg with international cargo hub logistics.</p>
          </div>

          <div className="cluster-box">
            <div className="cluster-tag">CHEMICAL & IT/ITES</div>
            <h3>TTC Industrial Area (Navi Mumbai)</h3>
            <p>Robust chemical corridor and high-tech IT parks adjacent to JNPA Port and upcoming Navi Mumbai International Airport.</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CALL TO ACTION BANNER
         ========================================================================= */}
      <section id="about" className="landing-cta-banner">
        <div className="cta-banner-content">
          <span className="cta-eyebrow">GOVERNMENT OF MAHARASHTRA INITIATIVE</span>
          <h2>Invest with Confidence. Build with Speed.</h2>
          <p>
            Join thousands of industrial entrepreneurs driving economic transformation across Maharashtra.
            Generate your statutory approval roadmap in minutes.
          </p>
          <div className="cta-actions">
            <button
              type="button"
              className="btn-cta-white"
              onClick={() => setShowApplication(true)}
            >
              <span>Start Your Application Now</span>
              <IconArrowRight size={18} />
            </button>
            <button
              type="button"
              className="btn-cta-outline"
              onClick={() => setShowLogin(true)}
            >
              Investor Portal Login
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. GOVERNMENT PORTAL FOOTER
         ========================================================================= */}
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
              UdyogFlow is the next-generation digital interface for MAITRI (Maharashtra Industry,
              Trade and Investment Facilitation Cell), facilitating ease of doing business across 36 districts.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Statutory Portals</h4>
            <ul>
              <li><a href="https://maitri.mahaonline.gov.in" target="_blank" rel="noopener noreferrer">MAITRI Single Window</a></li>
              <li><a href="https://midcindia.org" target="_blank" rel="noopener noreferrer">MIDC Official Portal</a></li>
              <li><a href="https://mpcb.gov.in" target="_blank" rel="noopener noreferrer">MPCB Pollution Clearances</a></li>
              <li><a href="https://dish.maharashtra.gov.in" target="_blank" rel="noopener noreferrer">DISH Industrial Safety</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Investor Support</h4>
            <ul>
              <li><a href="#how-it-works">Approval Workflow Guide</a></li>
              <li><a href="#features">PSI 2019 Fiscal Schemes</a></li>
              <li><a href="#about">Right to Public Services</a></li>
              <li><a href="#about">District Industries Centers (DIC)</a></li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4>Nodal Assistance</h4>
            <p>MAITRI Center, World Trade Center, Cuffe Parade, Mumbai 400005</p>
            <p className="footer-phone">Toll Free: 1800 120 8040</p>
            <p className="footer-email">support@udyogflow.gov.in</p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="bottom-copy">
            © 2026 Government of Maharashtra. All rights reserved.
          </div>
          <div className="bottom-policies">
            <span>Website Policies</span>
            <span>Security Statement</span>
            <span>Privacy Policy</span>
            <span>Accessibility Statement</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
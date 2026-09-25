import { IconBuilding, IconShieldCheck, IconClockAlert, IconArrowRight, IconCheck, IconRoadmap, IconBot, IconFileCheck } from "./Icons";

function About({ onGetStarted, onExploreFeatures }) {
  return (
    <div className="public-page-container">
      {/* Header */}
      <div className="page-intro-header">
        <div className="mini-badge">ABOUT UDYOGFLOW</div>
        <h1>Smart Industrial Approval &amp; Compliance Assistant</h1>
        <p>
          One platform to understand, manage, and track the approvals required for setting up your business in Maharashtra.
        </p>
      </div>

      {/* 3 Key Pillars */}
      <div className="about-grid">
        <div className="about-card">
          <div className="about-icon-box">
            <IconBuilding size={24} />
          </div>
          <h3>What is UdyogFlow?</h3>
          <p>
            UdyogFlow is an industrial facilitation platform that unifies clearance applications across MPCB, MIDC, DISH, Fire, and Revenue departments into one guided, digital workflow — designed for businesses setting up in Maharashtra.
          </p>
        </div>

        <div className="about-card">
          <div className="about-icon-box">
            <IconClockAlert size={24} />
          </div>
          <h3>The Problem We Solve</h3>
          <p>
            Entrepreneurs previously had to visit multiple department offices, re-submit the same documents repeatedly, and navigate opaque clearance timelines. UdyogFlow removes these barriers with a single window experience.
          </p>
        </div>

        <div className="about-card">
          <div className="about-icon-box">
            <IconShieldCheck size={24} />
          </div>
          <h3>Who Is It Designed For?</h3>
          <p>
            Entrepreneurs, MSMEs, and large enterprises setting up new manufacturing or industrial units in Maharashtra — especially first-time investors unfamiliar with the statutory approval process.
          </p>
        </div>
      </div>

      {/* How the Workflow Works */}
      <div className="about-workflow-section">
        <div className="about-workflow-header">
          <span className="mini-badge">HOW IT WORKS</span>
          <h2>The Approval Journey — Simplified</h2>
        </div>
        <div className="about-workflow-steps">
          <div className="about-wf-step">
            <div className="about-wf-num">1</div>
            <div className="about-wf-info">
              <strong>Enter Business Details</strong>
              <p>Industry sector, classification, and Maharashtra location.</p>
            </div>
          </div>
          <div className="about-wf-arrow">→</div>
          <div className="about-wf-step">
            <div className="about-wf-num">2</div>
            <div className="about-wf-info">
              <strong>Approval Identification</strong>
              <p>Platform identifies required clearances via the approval engine.</p>
            </div>
          </div>
          <div className="about-wf-arrow">→</div>
          <div className="about-wf-step">
            <div className="about-wf-num">3</div>
            <div className="about-wf-info">
              <strong>Document Preparation</strong>
              <p>Pre-validate document formats before submission.</p>
            </div>
          </div>
          <div className="about-wf-arrow">→</div>
          <div className="about-wf-step">
            <div className="about-wf-num">4</div>
            <div className="about-wf-info">
              <strong>Approval Roadmap</strong>
              <p>Step-by-step statutory clearance sequence with SLA tracking.</p>
            </div>
          </div>
          <div className="about-wf-arrow">→</div>
          <div className="about-wf-step">
            <div className="about-wf-num">5</div>
            <div className="about-wf-info">
              <strong>Application Tracking</strong>
              <p>Monitor progress across all departments in real time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Numbers */}
      <div className="about-stats-bar">
        <div className="stat-unit">
          <strong>36</strong>
          <span>Districts Supported</span>
        </div>
        <div className="stat-unit">
          <strong>100+</strong>
          <span>Statutory Clearances</span>
        </div>
        <div className="stat-unit">
          <strong>100%</strong>
          <span>Online Scrutiny</span>
        </div>
        <div className="stat-unit">
          <strong>24/7</strong>
          <span>Compliance Tracking</span>
        </div>
      </div>

      {/* CTA Box */}
      <div className="about-cta-box">
        <div>
          <h3>Ready to start your industrial unit?</h3>
          <p>Generate your custom approval roadmap in under 2 minutes.</p>
        </div>
        <div className="cta-button-group">
          {onGetStarted && (
            <button
              type="button"
              className="btn-primary"
              onClick={onGetStarted}
            >
              <span>Get Started</span>
              <IconArrowRight size={16} />
            </button>
          )}
          {onExploreFeatures && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onExploreFeatures}
            >
              Explore Features
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default About;

import { IconBuilding, IconShieldCheck, IconClockAlert, IconArrowRight } from "./Icons";

function About({ onGetStarted, onExploreFeatures }) {
  return (
    <div className="public-page-container">
      {/* Header */}
      <div className="page-intro-header">
        <div className="mini-badge">ABOUT UDYOGFLOW</div>
        <h1>Simplifying Industrial Approvals in Maharashtra</h1>
        <p>
          A single digital window for industrial investments, statutory clearances, and regulatory compliance.
        </p>
      </div>

      {/* 3 Simple Pillars */}
      <div className="about-grid">
        <div className="about-card">
          <div className="about-icon-box">
            <IconBuilding size={24} />
          </div>
          <h3>What is UdyogFlow?</h3>
          <p>
            UdyogFlow is Maharashtra’s industrial facilitation platform that unifies applications across MPCB, MIDC, DISH, Fire, and Revenue departments into one guided workflow.
          </p>
        </div>

        <div className="about-card">
          <div className="about-icon-box">
            <IconClockAlert size={24} />
          </div>
          <h3>The Problem We Solve</h3>
          <p>
            Entrepreneurs previously had to visit multiple department offices, re-submit the same documents repeatedly, and face opaque clearance timelines.
          </p>
        </div>

        <div className="about-card">
          <div className="about-icon-box">
            <IconShieldCheck size={24} />
          </div>
          <h3>How It Helps Businesses</h3>
          <p>
            UdyogFlow provides a personalized step-by-step roadmap, automated SLA tracking under Maharashtra's Right to Services, and a secure document vault.
          </p>
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

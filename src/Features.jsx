import {
  IconRoadmap,
  IconBot,
  IconFileCheck,
  IconClockAlert,
  IconRepeat,
  IconAward,
  IconBuilding,
  IconUser,
  IconArrowRight
} from "./Icons";

function Features({ onGetStarted }) {
  const featuresList = [
    {
      icon: <IconRoadmap size={24} />,
      title: "Approval Roadmap",
      desc: "Personalized step-by-step clearance sequence tailored to your industry, location, and enterprise scale with statutory SLA milestones.",
      tag: null,
      color: "blue"
    },
    {
      icon: <IconBot size={24} />,
      title: "AI Assistant",
      desc: "Guided help for industrial approvals, documents, departments, timelines, and government schemes — rule-based prototype.",
      tag: "Prototype",
      color: "purple"
    },
    {
      icon: <IconFileCheck size={24} />,
      title: "Document Pre-Validation",
      desc: "Upload and pre-validate document formats, file sizes, and readiness before submitting to departments.",
      tag: "Prototype",
      color: "green"
    },
    {
      icon: <IconClockAlert size={24} />,
      title: "Delay Risk Alerts",
      desc: "Early warnings on potential department bottlenecks to keep your project on schedule and within statutory timelines.",
      tag: "Prototype",
      color: "amber"
    },
    {
      icon: <IconRepeat size={24} />,
      title: "Compliance Intelligence",
      desc: "Automated reminders and timeline tracking for annual factory licenses, safety audits, and regulatory returns.",
      tag: "Prototype",
      color: "indigo"
    },
    {
      icon: <IconAward size={24} />,
      title: "Government Schemes",
      desc: "Discover eligible state subsidies, power tariff discounts, and Package Scheme of Incentives (PSI 2019) benefits.",
      tag: "Prototype",
      color: "orange"
    },
    {
      icon: <IconBuilding size={24} />,
      title: "Application Tracking",
      desc: "Monitor all your industrial applications with live status updates, stored securely in PostgreSQL.",
      tag: null,
      color: "navy"
    },
    {
      icon: <IconUser size={24} />,
      title: "User-Specific Dashboard",
      desc: "Personalized portal experience displaying your business credentials, filings, live statistics, and notifications.",
      tag: null,
      color: "teal"
    }
  ];

  return (
    <div className="public-page-container">
      {/* Header */}
      <div className="page-intro-header">
        <div className="mini-badge">PLATFORM CAPABILITIES</div>
        <h1>Features of UdyogFlow</h1>
        <p>
          Everything industrial investors need to navigate approvals, track compliance, and manage their clearance journey.
        </p>
      </div>

      {/* 8 Feature Cards Grid */}
      <div className="features-showcase-grid">
        {featuresList.map((f, i) => (
          <div className="feature-item-card" key={i}>
            <div className={`feature-item-icon icon-${f.color}`}>
              {f.icon}
            </div>
            <div className="feature-item-header">
              <h3>{f.title}</h3>
              {f.tag && (
                <span className="feature-prototype-tag">{f.tag}</span>
              )}
            </div>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="about-cta-box">
        <div>
          <h3>Start with your Approval Roadmap</h3>
          <p>Tell us about your industry and receive your personalized clearance checklist.</p>
        </div>
        {onGetStarted && (
          <button
            type="button"
            className="btn-primary"
            onClick={onGetStarted}
          >
            <span>Get Started Now</span>
            <IconArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Features;

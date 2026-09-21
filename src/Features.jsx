import {
  IconRoadmap,
  IconBot,
  IconFileCheck,
  IconShieldCheck,
  IconClockAlert,
  IconRepeat,
  IconAward,
  IconBell,
  IconArrowRight
} from "./Icons";

function Features({ onGetStarted }) {
  const featuresList = [
    {
      icon: <IconRoadmap size={24} />,
      title: "Smart Approval Roadmap",
      desc: "Step-by-step clearance sequence tailored to your industry, location, and scale.",
      color: "blue"
    },
    {
      icon: <IconBot size={24} />,
      title: "AI Assistant",
      desc: "Instant answers on Maharashtra industrial policies, MPCB pollution categories, and rules.",
      color: "purple"
    },
    {
      icon: <IconFileCheck size={24} />,
      title: "Documents",
      desc: "Pre-validates document formats, resolutions, and digital signatures before submission.",
      color: "green"
    },
    {
      icon: <IconShieldCheck size={24} />,
      title: "Document Reuse",
      desc: "Securely reuse verified company certificates across departments without re-uploading.",
      color: "teal"
    },
    {
      icon: <IconClockAlert size={24} />,
      title: "Delay Alerts",
      desc: "Early warnings on potential department bottlenecks to keep projects on schedule.",
      color: "amber"
    },
    {
      icon: <IconRepeat size={24} />,
      title: "Compliance",
      desc: "Automated reminders for annual factory licenses, inspections, and regulatory returns.",
      color: "indigo"
    },
    {
      icon: <IconAward size={24} />,
      title: "Government Schemes",
      desc: "Discover eligible state subsidies, power tariff discounts, and Package Scheme of Incentives (PSI 2019).",
      color: "orange"
    },
    {
      icon: <IconBell size={24} />,
      title: "Notifications",
      desc: "Real-time SMS and portal alerts on scrutiny stages, queries, and clearance grants.",
      color: "red"
    }
  ];

  return (
    <div className="public-page-container">
      {/* Header */}
      <div className="page-intro-header">
        <div className="mini-badge">PLATFORM CAPABILITIES</div>
        <h1>Key Features of UdyogFlow</h1>
        <p>
          Everything industrial investors need to navigate approvals and compliance smoothly.
        </p>
      </div>

      {/* 8 Feature Cards Grid */}
      <div className="features-showcase-grid">
        {featuresList.map((f, i) => (
          <div className="feature-item-card" key={i}>
            <div className={`feature-item-icon icon-${f.color}`}>
              {f.icon}
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="about-cta-box">
        <div>
          <h3>Start with your Approval Roadmap</h3>
          <p>Tell us about your industry and receive your personalized checklist.</p>
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

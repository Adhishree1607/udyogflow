import { useEffect, useMemo, useState } from "react";
import maharashtraLogo from "./assets/maharashtra-logo.png";
import ApplicationSetup from "./ApplicationSetup";
import ApprovalRoadmap from "./ApprovalRoadmap";
import {
  IconRoadmap,
  IconBot,
  IconShieldCheck,
  IconFileCheck,
  IconClockAlert,
  IconRepeat,
  IconAward,
  IconBell,
  IconBuilding,
  IconCheck,
  IconArrowRight,
  IconSearch,
  IconAlertTriangle,
  IconInfo,
  IconPlus,
  IconHome,
  IconFileText
} from "./Icons";

function BusinessDashboard({ onLogout, onNavigateHome }) {
  const [activeView, setActiveView] = useState("overview"); // overview, roadmap, ai-assistant, pre-validation, document-reuse, delay-prediction, compliance, schemes, alerts
  const [showApplication, setShowApplication] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [tableSearch, setTableSearch] = useState("");
  const [tableStatusFilter, setTableStatusFilter] = useState("all");

  // Accessibility font scaling
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0 = A-, 1 = A, 2 = A+

  // Fetch applications from PostgreSQL
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/applications");
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchApplications();
  }, []);

  // Compute Real Statistics
  const statistics = useMemo(() => {
    const total = applications.length;

    const approved = applications.filter(
      (app) => (app.status || "").toLowerCase() === "approved"
    ).length;

    const inProgress = applications.filter((app) => {
      const status = (app.status || "").toLowerCase();
      return (
        status === "in progress" ||
        status === "in review" ||
        status === "under review"
      );
    }).length;

    const actionRequired = applications.filter(
      (app) => (app.status || "").toLowerCase() === "action required"
    ).length;

    const rejected = applications.filter((app) => {
      const status = (app.status || "").toLowerCase();
      return status === "rejected" || status === "returned";
    }).length;

    const draft = applications.filter(
      (app) => (app.status || "").toLowerCase() === "draft"
    ).length;

    return {
      total,
      approved,
      inProgress,
      actionRequired,
      rejected,
      draft,
    };
  }, [applications]);

  // Donut chart calculation
  const chartTotal =
    statistics.approved + statistics.inProgress + statistics.rejected;

  const approvedPercent =
    chartTotal > 0 ? (statistics.approved / chartTotal) * 100 : 0;
  const progressPercent =
    chartTotal > 0 ? (statistics.inProgress / chartTotal) * 100 : 0;

  const approvedEnd = approvedPercent;
  const progressEnd = approvedPercent + progressPercent;

  const donutBackground =
    chartTotal > 0
      ? `conic-gradient(
          #059669 0% ${approvedEnd}%,
          #d97706 ${approvedEnd}% ${progressEnd}%,
          #dc2626 ${progressEnd}% 100%
        )`
      : "#e2e8f0";

  // Filtered applications table
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const query = tableSearch.toLowerCase();
      const matchesSearch =
        !query ||
        app.business_name?.toLowerCase().includes(query) ||
        app.industry?.toLowerCase().includes(query) ||
        app.location?.toLowerCase().includes(query) ||
        String(app.application_id).includes(query);

      if (!matchesSearch) return false;

      const st = (app.status || "Draft").toLowerCase();
      if (tableStatusFilter === "all") return true;
      if (tableStatusFilter === "approved") return st === "approved";
      if (tableStatusFilter === "in-progress") return st === "in progress" || st === "in review" || st === "under review";
      if (tableStatusFilter === "action-required") return st === "action required";
      if (tableStatusFilter === "draft") return st === "draft";
      return true;
    });
  }, [applications, tableSearch, tableStatusFilter]);

  // Open roadmap view with application
  const openRoadmap = (application) => {
    if (!application) {
      alert("No application available.");
      return;
    }

    setApplicationData({
      applicationId: application.application_id,
      businessName: application.business_name,
      industry: application.industry,
      location: application.location,
      businessType: application.business_type,
    });

    setShowRoadmap(true);
  };

  // Switch font size
  const handleFontSize = (level) => {
    setFontSizeLevel(level);
    const size = level === 0 ? "13px" : level === 1 ? "14px" : "15px";
    document.documentElement.style.fontSize = size;
  };

  // If opening application setup
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

  // If opening roadmap
  if (showRoadmap) {
    return (
      <ApprovalRoadmap
        applicationData={applicationData}
        onBack={() => setShowRoadmap(false)}
      />
    );
  }

  return (
    <div className="portal-layout">
      {/* =========================================================================
          1. TOP OFFICIAL GOVERNMENT HEADER BAR
         ========================================================================= */}
      <header className="gov-topbar">
        <div className="gov-topbar-inner">
          <div className="gov-topbar-brand">
            <img
              src={maharashtraLogo}
              alt="Government of Maharashtra"
              className="gov-logo-img"
            />
            <div className="gov-title-stack">
              <div className="gov-state-name">
                <strong>Government of Maharashtra</strong> · महाराष्ट्र शासन
              </div>
              <div className="gov-dept-name">
                Department of Industries · MAITRI Single Window Portal
              </div>
            </div>
          </div>

          <div className="gov-topbar-tools">
            {/* Accessibility Font Resizer */}
            <div className="gov-accessibility">
              <span className="gov-tool-label">Text Size:</span>
              <button
                type="button"
                className={`tool-btn ${fontSizeLevel === 0 ? "active" : ""}`}
                onClick={() => handleFontSize(0)}
                title="Decrease font size"
              >
                A-
              </button>
              <button
                type="button"
                className={`tool-btn ${fontSizeLevel === 1 ? "active" : ""}`}
                onClick={() => handleFontSize(1)}
                title="Default font size"
              >
                A
              </button>
              <button
                type="button"
                className={`tool-btn ${fontSizeLevel === 2 ? "active" : ""}`}
                onClick={() => handleFontSize(2)}
                title="Increase font size"
              >
                A+
              </button>
            </div>

            <div className="gov-badge-secure">
              <IconShieldCheck size={14} />
              <span>SSL 256-Bit Verified</span>
            </div>

            <button
              type="button"
              className="gov-bell-btn"
              onClick={() => setActiveView("alerts")}
              title="Notifications"
            >
              <IconBell size={18} />
              <span className="bell-badge">3</span>
            </button>

            <div className="gov-user-chip">
              <div className="user-avatar">B</div>
              <div className="user-meta">
                <span className="user-name">Business Investor</span>
                <span className="user-role">Maharashtra Industrial Unit</span>
              </div>
            </div>

            {(onLogout || onNavigateHome) && (
              <button
                type="button"
                className="gov-exit-btn"
                onClick={onLogout || onNavigateHome}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. MAIN PORTAL BODY (SIDEBAR + MAIN CONTENT AREA)
         ========================================================================= */}
      <div className="portal-body-wrapper">
        {/* Left Navigation Sidebar */}
        <aside className="portal-sidebar">
          <div className="sidebar-brand-badge">
            <div className="brand-dot"></div>
            <span>PORTAL NAVIGATION</span>
          </div>

          <nav className="sidebar-nav">
            <button
              type="button"
              className={`nav-item ${activeView === "overview" ? "active" : ""}`}
              onClick={() => setActiveView("overview")}
            >
              <IconHome size={18} />
              <span>Dashboard Overview</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "roadmap" ? "active" : ""}`}
              onClick={() => {
                if (applications.length > 0) {
                  openRoadmap(applications[0]);
                } else {
                  setActiveView("roadmap");
                }
              }}
            >
              <IconRoadmap size={18} />
              <span>Smart Approval Roadmap</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "ai-assistant" ? "active" : ""}`}
              onClick={() => setActiveView("ai-assistant")}
            >
              <IconBot size={18} />
              <span>AI Industrial Assistant</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "pre-validation" ? "active" : ""}`}
              onClick={() => setActiveView("pre-validation")}
            >
              <IconFileCheck size={18} />
              <span>Document Pre-Validation</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "document-reuse" ? "active" : ""}`}
              onClick={() => setActiveView("document-reuse")}
            >
              <IconShieldCheck size={18} />
              <span>Secure Document Reuse</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "delay-prediction" ? "active" : ""}`}
              onClick={() => setActiveView("delay-prediction")}
            >
              <IconClockAlert size={18} />
              <span>Delay Prediction & SLA</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "compliance" ? "active" : ""}`}
              onClick={() => setActiveView("compliance")}
            >
              <IconRepeat size={18} />
              <span>Compliance & Renewals</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "schemes" ? "active" : ""}`}
              onClick={() => setActiveView("schemes")}
            >
              <IconAward size={18} />
              <span>Government Schemes & PSI</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "alerts" ? "active" : ""}`}
              onClick={() => setActiveView("alerts")}
            >
              <IconBell size={18} />
              <span>Alerts & Notifications</span>
              <span className="sidebar-count">3</span>
            </button>
          </nav>

          {/* Quick Help Card */}
          <div className="sidebar-helpline-box">
            <div className="helpline-header">
              <IconInfo size={16} />
              <strong>MAITRI Nodal Desk</strong>
            </div>
            <p>Toll-Free Investor Helpline:</p>
            <span className="helpline-phone">1800 120 8040</span>
            <small>Mon - Sat (9:30 AM to 6:00 PM)</small>
            <button
              type="button"
              className="helpline-ai-btn"
              onClick={() => setActiveView("ai-assistant")}
            >
              Launch AI Assistant →
            </button>
          </div>

          <div className="sidebar-footer-note">
            <span>UdyogFlow Platform v2.4</span>
            <small>Govt of Maharashtra Industrial Portal</small>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="portal-main-content">
          {/* Top Welcome & New Application Banner */}
          <div className="portal-hero-strip">
            <div className="hero-text-group">
              <div className="hero-badge">
                <span className="badge-live-pulse"></span>
                <span>SINGLE WINDOW INDUSTRIAL COMPLIANCE PORTAL</span>
              </div>
              <h1>Industrial Investor Workspace</h1>
              <p>
                Track regulatory scrutiny under the Maharashtra Public Services Guarantee Act.
                All applications are synchronized in real-time with the central MAITRI PostgreSQL repository.
              </p>
            </div>
            <div className="hero-action-group">
              <button
                type="button"
                className="btn-create-app"
                onClick={() => setShowApplication(true)}
              >
                <IconPlus size={18} />
                <span>Submit New Application</span>
              </button>
            </div>
          </div>

          {/* =====================================================================
              VIEW: OVERVIEW (DEFAULT DASHBOARD VIEW)
             ===================================================================== */}
          {activeView === "overview" && (
            <div className="overview-container">
              {/* 1. Statistics Cards Row */}
              <section className="kpi-summary-row">
                <div className="stat-card stat-blue">
                  <div className="stat-icon-wrapper">
                    <IconBuilding size={22} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-label">Total Submissions</span>
                    <strong className="stat-number">
                      {loadingApplications ? "..." : String(statistics.total).padStart(2, "0")}
                    </strong>
                    <span className="stat-subtext">Registered in MAITRI DB</span>
                  </div>
                </div>

                <div className="stat-card stat-green">
                  <div className="stat-icon-wrapper">
                    <IconCheck size={22} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-label">Approved Clearances</span>
                    <strong className="stat-number">
                      {loadingApplications ? "..." : String(statistics.approved).padStart(2, "0")}
                    </strong>
                    <span className="stat-subtext">Issued digitally</span>
                  </div>
                </div>

                <div className="stat-card stat-amber">
                  <div className="stat-icon-wrapper">
                    <IconClockAlert size={22} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-label">Under Department Review</span>
                    <strong className="stat-number">
                      {loadingApplications ? "..." : String(statistics.inProgress).padStart(2, "0")}
                    </strong>
                    <span className="stat-subtext">Active SLA monitoring</span>
                  </div>
                </div>

                <div className="stat-card stat-red">
                  <div className="stat-icon-wrapper">
                    <IconAlertTriangle size={22} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-label">Action Required</span>
                    <strong className="stat-number">
                      {loadingApplications ? "..." : String(statistics.actionRequired).padStart(2, "0")}
                    </strong>
                    <span className="stat-subtext">Clarification requested</span>
                  </div>
                </div>
              </section>

              {/* 2. Grid Row: Real Applications Table + Application Status Donut */}
              <section className="portal-grid-two">
                {/* Real Applications Table */}
                <div className="portal-card applications-card">
                  <div className="card-header-bar">
                    <div className="header-titles">
                      <IconFileText size={18} />
                      <div>
                        <h2>PostgreSQL Registered Applications</h2>
                        <p>Live industrial filings fetched from backend database</p>
                      </div>
                    </div>
                    <div className="card-controls">
                      <div className="table-search-input">
                        <IconSearch size={14} />
                        <input
                          type="text"
                          placeholder="Search enterprise, sector..."
                          value={tableSearch}
                          onChange={(e) => setTableSearch(e.target.value)}
                        />
                      </div>
                      <select
                        className="table-filter-select"
                        value={tableStatusFilter}
                        onChange={(e) => setTableStatusFilter(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="approved">Approved</option>
                        <option value="in-progress">In Progress</option>
                        <option value="action-required">Action Required</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="gov-data-table">
                      <thead>
                        <tr>
                          <th>App ID</th>
                          <th>Enterprise & Sector</th>
                          <th>Location</th>
                          <th>Current Status</th>
                          <th>Filed Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingApplications ? (
                          <tr>
                            <td colSpan="6" className="table-empty-cell">
                              <div className="table-spinner"></div>
                              <span>Loading live application records from PostgreSQL...</span>
                            </td>
                          </tr>
                        ) : filteredApplications.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="table-empty-cell">
                              <IconInfo size={24} />
                              <p>No application records found matching filter.</p>
                            </td>
                          </tr>
                        ) : (
                          filteredApplications.slice(0, 6).map((app) => {
                            const status = app.status || "Draft";
                            const lower = status.toLowerCase();
                            let badgeClass = "badge-pending";
                            if (lower === "approved") badgeClass = "badge-completed";
                            else if (lower === "in progress" || lower === "in review" || lower === "under review")
                              badgeClass = "badge-progress";
                            else if (lower === "action required" || lower === "rejected")
                              badgeClass = "badge-danger";

                            return (
                              <tr key={app.application_id}>
                                <td>
                                  <span className="app-code">
                                    APP-{String(app.application_id).padStart(4, "0")}
                                  </span>
                                </td>
                                <td>
                                  <div className="enterprise-cell">
                                    <strong>{app.business_name}</strong>
                                    <small>{app.industry}</small>
                                  </div>
                                </td>
                                <td>
                                  <span className="location-tag">📍 {app.location}</span>
                                </td>
                                <td>
                                  <span className={`status-pill ${badgeClass}`}>
                                    {status}
                                  </span>
                                </td>
                                <td>
                                  <span className="date-tag">
                                    {app.created_at
                                      ? new Date(app.created_at).toLocaleDateString("en-IN", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        })
                                      : "Recent"}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="table-action-btn"
                                    onClick={() => openRoadmap(app)}
                                  >
                                    <span>Roadmap</span>
                                    <IconArrowRight size={14} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Donut Chart & Breakdown */}
                <div className="portal-card status-breakdown-card">
                  <div className="card-header-bar">
                    <div className="header-titles">
                      <IconShieldCheck size={18} />
                      <div>
                        <h2>Clearance Status Ratio</h2>
                        <p>Aggregated statutory compliance overview</p>
                      </div>
                    </div>
                  </div>

                  <div className="chart-wrapper">
                    <div className="donut-circle" style={{ background: donutBackground }}>
                      <div className="donut-hole">
                        <strong className="donut-total">
                          {loadingApplications ? "..." : String(statistics.total).padStart(2, "0")}
                        </strong>
                        <span className="donut-caption">Applications</span>
                      </div>
                    </div>

                    <div className="chart-legend-list">
                      <div className="legend-item">
                        <span className="legend-marker marker-green"></span>
                        <div className="legend-text">
                          <span>Approved & Issued</span>
                          <strong>{statistics.approved} Files</strong>
                        </div>
                      </div>

                      <div className="legend-item">
                        <span className="legend-marker marker-amber"></span>
                        <div className="legend-text">
                          <span>Department Scrutiny</span>
                          <strong>{statistics.inProgress} Files</strong>
                        </div>
                      </div>

                      <div className="legend-item">
                        <span className="legend-marker marker-red"></span>
                        <div className="legend-text">
                          <span>Action / Clarification</span>
                          <strong>{statistics.actionRequired + statistics.rejected} Files</strong>
                        </div>
                      </div>

                      <div className="legend-item">
                        <span className="legend-marker marker-slate"></span>
                        <div className="legend-text">
                          <span>Draft / In Preparation</span>
                          <strong>{statistics.draft} Files</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Grid Row: Live Roadmap Progress Snippet & Delay Prediction Radar */}
              <section className="portal-grid-two">
                {/* Roadmap Progress Preview */}
                <div className="portal-card">
                  <div className="card-header-bar">
                    <div className="header-titles">
                      <IconRoadmap size={18} />
                      <div>
                        <h2>Active Approval Roadmap Pipeline</h2>
                        <p>Sequential departmental stages under MAITRI</p>
                      </div>
                    </div>
                    {applications.length > 0 && (
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => openRoadmap(applications[0])}
                      >
                        Full Roadmap →
                      </button>
                    )}
                  </div>

                  {applications.length > 0 ? (
                    <div className="roadmap-snippet-body">
                      <div className="snippet-business-tag">
                        <span>Active Enterprise: </span>
                        <strong>{applications[0].business_name}</strong>
                        <span className="snippet-sector">({applications[0].industry})</span>
                      </div>

                      <div className="snippet-stages-row">
                        <div className="snippet-step done">
                          <div className="step-circle">✓</div>
                          <span>Registration</span>
                          <small>Completed</small>
                        </div>
                        <div className="snippet-step-line done"></div>
                        <div className="snippet-step done">
                          <div className="step-circle">✓</div>
                          <span>KYC & Land</span>
                          <small>Verified</small>
                        </div>
                        <div className="snippet-step-line active"></div>
                        <div className="snippet-step active">
                          <div className="step-circle">3</div>
                          <span>MPCB CTE</span>
                          <small>In Review</small>
                        </div>
                        <div className="snippet-step-line"></div>
                        <div className="snippet-step">
                          <div className="step-circle">4</div>
                          <span>Factory License</span>
                          <small>Queued</small>
                        </div>
                        <div className="snippet-step-line"></div>
                        <div className="snippet-step">
                          <div className="step-circle">5</div>
                          <span>Operation NOC</span>
                          <small>Final</small>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-snippet-box">
                      <IconInfo size={24} />
                      <p>No active application roadmap found. Start your first industrial filing above.</p>
                    </div>
                  )}
                </div>

                {/* AI Delay Prediction & Bottleneck Snippet */}
                <div className="portal-card">
                  <div className="card-header-bar">
                    <div className="header-titles">
                      <IconClockAlert size={18} />
                      <div>
                        <h2>AI Delay Prediction & Bottlenecks</h2>
                        <p>Machine-learned scrutiny timeline warnings</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => setActiveView("delay-prediction")}
                    >
                      SLA Radar →
                    </button>
                  </div>

                  <div className="prediction-snippet-list">
                    <div className="prediction-row warning">
                      <div className="pred-icon">⚠️</div>
                      <div className="pred-content">
                        <strong>MPCB Site Scrutiny - Regional Office</strong>
                        <span>Typical queue in selected district is averaging +4 days above SLA. Ensure effluent treatment diagrams are uploaded.</span>
                      </div>
                      <span className="risk-tag risk-medium">Medium Risk</span>
                    </div>

                    <div className="prediction-row safe">
                      <div className="pred-icon">✅</div>
                      <div className="pred-content">
                        <strong>MIDC Water Connection & Power Feasibility</strong>
                        <span>Sub-station clearance automated on MAITRI platform. Expected approval within 48 hours.</span>
                      </div>
                      <span className="risk-tag risk-low">Low Risk</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Feature Showcase Carousel / Grid (The 8 Platform Highlights) */}
              <section className="feature-highlights-section">
                <div className="section-title-wrap">
                  <div className="title-left">
                    <span className="section-eyebrow">UDYOGFLOW PLATFORM CAPABILITIES</span>
                    <h2>Key Industrial Compliance Modules</h2>
                    <p>Designed to accelerate industrialization across Maharashtra's 36 districts.</p>
                  </div>
                </div>

                <div className="feature-cards-grid">
                  <div
                    className="feature-interactive-card"
                    onClick={() => {
                      if (applications.length > 0) openRoadmap(applications[0]);
                      else setActiveView("roadmap");
                    }}
                  >
                    <div className="card-icon-header icon-blue">
                      <IconRoadmap size={22} />
                    </div>
                    <h3>Smart Approval Roadmap</h3>
                    <p>Dynamic dependency matrix mapping clearances across MPCB, MIDC, Fire, DISH & Revenue.</p>
                    <span className="card-explore-link">Explore Roadmap →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("ai-assistant")}
                  >
                    <div className="card-icon-header icon-purple">
                      <IconBot size={22} />
                    </div>
                    <h3>AI Assistant</h3>
                    <p>24/7 intelligent regulatory advisor for Maharashtra industrial policy and clearance FAQs.</p>
                    <span className="card-explore-link">Ask AI Assistant →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("pre-validation")}
                  >
                    <div className="card-icon-header icon-green">
                      <IconFileCheck size={22} />
                    </div>
                    <h3>Document Pre-Validation</h3>
                    <p>Automated format checks, signature verification, and resolution testing before filing.</p>
                    <span className="card-explore-link">Run Validation →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("document-reuse")}
                  >
                    <div className="card-icon-header icon-indigo">
                      <IconShieldCheck size={22} />
                    </div>
                    <h3>Secure Document Reuse</h3>
                    <p>DigiLocker & Maha-Locker vault eliminating repeated document uploads across departments.</p>
                    <span className="card-explore-link">View Vault →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("delay-prediction")}
                  >
                    <div className="card-icon-header icon-amber">
                      <IconClockAlert size={22} />
                    </div>
                    <h3>Delay Prediction</h3>
                    <p>Early-warning bottleneck detection based on historical department turnaround times.</p>
                    <span className="card-explore-link">Check SLA Radar →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("compliance")}
                  >
                    <div className="card-icon-header icon-teal">
                      <IconRepeat size={22} />
                    </div>
                    <h3>Compliance & Renewals</h3>
                    <p>Statutory calendar for annual factory licenses, environmental returns, and safety audits.</p>
                    <span className="card-explore-link">Open Calendar →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("schemes")}
                  >
                    <div className="card-icon-header icon-orange">
                      <IconAward size={22} />
                    </div>
                    <h3>Government Schemes</h3>
                    <p>Explore Package Scheme of Incentives (PSI 2019), capital subsidies, and power tariff rebates.</p>
                    <span className="card-explore-link">Calculate Benefits →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("alerts")}
                  >
                    <div className="card-icon-header icon-red">
                      <IconBell size={22} />
                    </div>
                    <h3>Alerts & Notifications</h3>
                    <p>Instant multi-channel alerts for deadline reminders, inspection visits, and approval grants.</p>
                    <span className="card-explore-link">View Notifications →</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* =====================================================================
              VIEW: AI ASSISTANT (PROTOTYPE MODULE)
             ===================================================================== */}
          {activeView === "ai-assistant" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW · UI DEMONSTRATION</div>
                <h2>AI Industrial Assistant & Regulatory Guide</h2>
                <p>
                  Interactive simulated advisor trained on Maharashtra industrial policies, MPCB pollution categories,
                  and MAITRI inter-departmental approval rules.
                </p>
              </div>

              <div className="ai-chat-layout">
                <div className="chat-window">
                  <div className="chat-messages">
                    <div className="chat-bubble bot">
                      <div className="bubble-avatar"><IconBot size={16} /></div>
                      <div className="bubble-body">
                        <strong>Namaskar! I am UdyogFlow's AI Industrial Guide.</strong>
                        <p>
                          I can assist you with statutory clearance requirements in Maharashtra, identify whether your industry
                          falls into MPCB Red, Orange, Green, or White category, explain PSI 2019 fiscal incentives, and recommend
                          approval sequencing. How can I guide your industrial enterprise today?
                        </p>
                      </div>
                    </div>

                    <div className="chat-bubble user">
                      <div className="bubble-body">
                        <p>What environmental approvals are needed for an Engineering unit in Chakan, Pune?</p>
                      </div>
                    </div>

                    <div className="chat-bubble bot">
                      <div className="bubble-avatar"><IconBot size={16} /></div>
                      <div className="bubble-body">
                        <strong>MAITRI Assessment for Engineering in Pune (Chakan MIDC):</strong>
                        <ul className="chat-list">
                          <li><strong>MPCB Consent:</strong> Engineering units typically fall under the <em>Orange Category</em> (or Green if dry fabrication). You must apply for <strong>Consent to Establish (CTE)</strong> before commencing civil works.</li>
                          <li><strong>DISH Clearance:</strong> Factory Plan Approval under Maharashtra Factories Rules 1963 from the Directorate of Industrial Safety and Health.</li>
                          <li><strong>MIDC Water & Drainage:</strong> Chakan Industrial Area requires MIDC water allotment and CETP connection clearance.</li>
                          <li><strong>Statutory SLA:</strong> CTE standard statutory SLA is 45 days under Maharashtra Right to Services Act.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="chat-suggestions">
                    <span className="sugg-label">Sample Questions:</span>
                    <button type="button" className="sugg-chip">What is PSI 2019 subsidy for Vidarbha?</button>
                    <button type="button" className="sugg-chip">How to get DISH Factory License?</button>
                    <button type="button" className="sugg-chip">What documents are needed for Land 7/12?</button>
                  </div>

                  <div className="chat-input-row">
                    <input
                      type="text"
                      placeholder="Ask about Maharashtra industrial clearances, subsidies, or compliance rules..."
                      defaultValue=""
                    />
                    <button type="button" className="btn-chat-send">Ask Assistant →</button>
                  </div>
                </div>

                <div className="ai-info-sidebar">
                  <h3>Maharashtra Industrial Knowledge Graph</h3>
                  <div className="kg-item">
                    <strong>MPCB Pollution Matrix</strong>
                    <p>63 Red, 83 Orange, 63 Green, 36 White categories indexed.</p>
                  </div>
                  <div className="kg-item">
                    <strong>Inter-departmental SLA Standards</strong>
                    <p>Synchronized with Maharashtra Right to Public Services Act 2015.</p>
                  </div>
                  <div className="kg-item">
                    <strong>Package Scheme of Incentives 2019</strong>
                    <p>Zone A, B, C, D, D+ and No Industry District (NID) grading support.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW: DOCUMENT PRE-VALIDATION (PROTOTYPE MODULE)
             ===================================================================== */}
          {activeView === "pre-validation" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW · UI DEMONSTRATION</div>
                <h2>Automated Document Pre-Validation Engine</h2>
                <p>
                  Evaluates mandatory industrial dossiers prior to departmental submission. Verifies PDF resolutions,
                  digital signatures, valid expiry dates, and government registration stamps.
                </p>
              </div>

              <div className="preval-grid">
                <div className="preval-upload-card">
                  <div className="upload-dropzone">
                    <IconFileCheck size={40} className="drop-icon" />
                    <h3>Drop Industrial Document Here</h3>
                    <p>Supports Land 7/12 Extract, Factory Layout, Environmental Audit, Partnership Deed (PDF/TIFF up to 25MB)</p>
                    <button type="button" className="btn-browse-docs">Browse Files</button>
                  </div>

                  <div className="doc-verification-checklist">
                    <h4>Pre-Submission Automated Checkpoints</h4>
                    <div className="check-item passed">
                      <IconCheck size={16} />
                      <span>Optical Character Recognition (OCR) Text Legibility (min 300 DPI)</span>
                    </div>
                    <div className="check-item passed">
                      <IconCheck size={16} />
                      <span>Class 3 Digital Signature Certificate (DSC) Integrity</span>
                    </div>
                    <div className="check-item passed">
                      <IconCheck size={16} />
                      <span>Land Mutation Stamp Verification against Mahabhulekh Database</span>
                    </div>
                    <div className="check-item passed">
                      <IconCheck size={16} />
                      <span>Architect / Structural Engineer Licensing Stamp</span>
                    </div>
                  </div>
                </div>

                <div className="preval-results-card">
                  <h3>Recent Document Validation Audit</h3>
                  <div className="doc-audit-item valid">
                    <div className="audit-icon">📄</div>
                    <div className="audit-meta">
                      <strong>Factory Layout Plan_Chakan_Rev3.pdf</strong>
                      <small>DISH & Fire Compliance · Validated Today</small>
                    </div>
                    <span className="audit-badge ready">100% Submission Ready</span>
                  </div>

                  <div className="doc-audit-item valid">
                    <div className="audit-icon">📜</div>
                    <div className="audit-meta">
                      <strong>Maharashtra_7_12_Extract_Gat_204.pdf</strong>
                      <small>Revenue Dept Verified · Timestamped</small>
                    </div>
                    <span className="audit-badge ready">Verified Authenticated</span>
                  </div>

                  <div className="doc-audit-item alert">
                    <div className="audit-icon">⚠️</div>
                    <div className="audit-meta">
                      <strong>Power_Load_Sanction_MSEDCL.pdf</strong>
                      <small>Resolution below 200 DPI · Signature blurry</small>
                    </div>
                    <span className="audit-badge warning">Re-Scan Recommended</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW: SECURE DOCUMENT REUSE (PROTOTYPE MODULE)
             ===================================================================== */}
          {activeView === "document-reuse" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW · UI DEMONSTRATION</div>
                <h2>Secure Document Reuse & Enterprise Vault</h2>
                <p>
                  Eliminates duplicate submissions across departments. Verified documents stored in your UdyogFlow Vault
                  are linked across MPCB, MIDC, DISH, and Labor departments via DigiLocker.
                </p>
              </div>

              <div className="vault-grid">
                <div className="vault-doc-card">
                  <div className="vault-doc-header">
                    <span className="vault-type">ENTITY KYC</span>
                    <span className="vault-reused">Reused 4 Times</span>
                  </div>
                  <h3>Company Incorporation (MCA Certificate)</h3>
                  <p>CIN: U29304MH2024PTC128492</p>
                  <div className="vault-departments">
                    <span>MPCB</span>
                    <span>MIDC</span>
                    <span>DISH</span>
                    <span>Commercial Tax</span>
                  </div>
                  <div className="vault-footer">
                    <span className="vault-status">🔒 DigiLocker Authenticated</span>
                  </div>
                </div>

                <div className="vault-doc-card">
                  <div className="vault-doc-header">
                    <span className="vault-type">STATUTORY REGISTRATION</span>
                    <span className="vault-reused">Reused 3 Times</span>
                  </div>
                  <h3>Udyam Registration Certificate</h3>
                  <p>UDYAM-MH-26-0049281</p>
                  <div className="vault-departments">
                    <span>Industries Directorate</span>
                    <span>MIDC</span>
                    <span>Power Subsidy</span>
                  </div>
                  <div className="vault-footer">
                    <span className="vault-status">🔒 MSME Verified</span>
                  </div>
                </div>

                <div className="vault-doc-card">
                  <div className="vault-doc-header">
                    <span className="vault-type">LAND & TITLE</span>
                    <span className="vault-reused">Reused 5 Times</span>
                  </div>
                  <h3>MIDC Land Allotment Order & Agreement</h3>
                  <p>MIDC/RO/PN/PLOT-E-42</p>
                  <div className="vault-departments">
                    <span>MPCB</span>
                    <span>Fire NOC</span>
                    <span>Building Permission</span>
                    <span>Revenue</span>
                  </div>
                  <div className="vault-footer">
                    <span className="vault-status">🔒 Maha-Bhumi Verified</span>
                  </div>
                </div>

                <div className="vault-doc-card">
                  <div className="vault-doc-header">
                    <span className="vault-type">ENVIRONMENTAL</span>
                    <span className="vault-reused">Reused 2 Times</span>
                  </div>
                  <h3>MPCB Baseline Environmental Audit</h3>
                  <p>MPCB/RO-PUNE/CONSENT-00284</p>
                  <div className="vault-departments">
                    <span>MPCB</span>
                    <span>Factory Inspectorate</span>
                  </div>
                  <div className="vault-footer">
                    <span className="vault-status">🔒 MPCB Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW: DELAY PREDICTION (PROTOTYPE MODULE)
             ===================================================================== */}
          {activeView === "delay-prediction" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW · UI DEMONSTRATION</div>
                <h2>AI Delay Prediction & Inter-Departmental SLA Radar</h2>
                <p>
                  Empirical machine learning models calculating queue times across Maharashtra's 36 district offices.
                  Identifies bottlenecks before they cause operational stagnation.
                </p>
              </div>

              <div className="radar-grid">
                <div className="radar-metric-card">
                  <span className="radar-eyebrow">DEPARTMENTAL PERFORMANCE</span>
                  <h3>Maharashtra Pollution Control Board (MPCB)</h3>
                  <div className="radar-stat-line">
                    <span>Statutory SLA: <strong>45 Days</strong></span>
                    <span>Current Avg Turnaround: <strong>49 Days</strong></span>
                  </div>
                  <div className="sla-progress-bar">
                    <div className="sla-fill warning" style={{ width: "88%" }}></div>
                  </div>
                  <span className="radar-alert-note text-amber">
                    ⚠️ Moderate delay risk due to seasonal site inspection backlog in Western Maharashtra.
                  </span>
                </div>

                <div className="radar-metric-card">
                  <span className="radar-eyebrow">DEPARTMENTAL PERFORMANCE</span>
                  <h3>MIDC Water & Infrastructure Clearances</h3>
                  <div className="radar-stat-line">
                    <span>Statutory SLA: <strong>21 Days</strong></span>
                    <span>Current Avg Turnaround: <strong>14 Days</strong></span>
                  </div>
                  <div className="sla-progress-bar">
                    <div className="sla-fill success" style={{ width: "66%" }}></div>
                  </div>
                  <span className="radar-alert-note text-green">
                    ✅ Optimal performance. Automated pipeline operating 7 days ahead of statutory deadline.
                  </span>
                </div>

                <div className="radar-metric-card">
                  <span className="radar-eyebrow">DEPARTMENTAL PERFORMANCE</span>
                  <h3>Directorate of Industrial Safety & Health (DISH)</h3>
                  <div className="radar-stat-line">
                    <span>Statutory SLA: <strong>30 Days</strong></span>
                    <span>Current Avg Turnaround: <strong>28 Days</strong></span>
                  </div>
                  <div className="sla-progress-bar">
                    <div className="sla-fill success" style={{ width: "93%" }}></div>
                  </div>
                  <span className="radar-alert-note text-blue">
                    ℹ️ On track. Pre-submission drawings match standard industrial templates.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW: COMPLIANCE & RENEWALS (PROTOTYPE MODULE)
             ===================================================================== */}
          {activeView === "compliance" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW · UI DEMONSTRATION</div>
                <h2>Statutory Compliance Calendar & Annual Renewals</h2>
                <p>
                  Proactive regulatory oversight preventing business interruptions and legal penalties
                  under Maharashtra factory, environmental, and labor mandates.
                </p>
              </div>

              <div className="compliance-timeline-card">
                <h3>Upcoming Regulatory Deadlines (FY 2026-27)</h3>
                <div className="comp-item urgent">
                  <div className="comp-date">
                    <strong>31</strong>
                    <span>MAR</span>
                  </div>
                  <div className="comp-body">
                    <strong>MPCB Annual Environmental Statement (Form V)</strong>
                    <p>Mandatory for all Red and Orange category industries under Environment (Protection) Rules.</p>
                  </div>
                  <span className="comp-badge due">Due in 10 Days</span>
                </div>

                <div className="comp-item normal">
                  <div className="comp-date">
                    <strong>30</strong>
                    <span>APR</span>
                  </div>
                  <div className="comp-body">
                    <strong>Factory License Renewal under Factories Act 1948</strong>
                    <p>Annual renewal fee submission via GRAS portal for Maharashtra Directorate of Industrial Safety.</p>
                  </div>
                  <span className="comp-badge queued">Upcoming</span>
                </div>

                <div className="comp-item normal">
                  <div className="comp-date">
                    <strong>30</strong>
                    <span>JUN</span>
                  </div>
                  <div className="comp-body">
                    <strong>Annual Fire Safety Audit Report (Form B)</strong>
                    <p>Periodic safety certificate from licensed agency submitted to Maharashtra Fire Services.</p>
                  </div>
                  <span className="comp-badge queued">Scheduled</span>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW: GOVERNMENT SCHEMES & PSI (PROTOTYPE MODULE)
             ===================================================================== */}
          {activeView === "schemes" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW · UI DEMONSTRATION</div>
                <h2>Maharashtra Government Schemes & Incentives (PSI 2019)</h2>
                <p>
                  Discover eligible state fiscal subsidies, power tariff discounts, stamp duty exemptions,
                  and capital grants under the Maharashtra Industrial Policy.
                </p>
              </div>

              <div className="schemes-grid">
                <div className="scheme-card highlighted">
                  <div className="scheme-badge">FLAGSHIP POLICY</div>
                  <h3>Package Scheme of Incentives (PSI 2019)</h3>
                  <p>Incentivizes industrial dispersal to developing areas (Taluka Categories B, C, D, D+).</p>
                  <ul className="scheme-benefits">
                    <li>Industrial Promotion Subsidy (IPS) up to 100% of Fixed Capital Investment</li>
                    <li>Interest Subsidy: 5% on term loan for MSMEs</li>
                    <li>Electricity Duty Exemption for up to 10 years</li>
                    <li>100% Stamp Duty Exemption for land acquisition</li>
                  </ul>
                  <button type="button" className="btn-scheme-apply">Check Enterprise Eligibility →</button>
                </div>

                <div className="scheme-card">
                  <div className="scheme-badge">INNOVATION</div>
                  <h3>Maharashtra State Innovation Society Startup Grant</h3>
                  <p>Financial support up to ₹15 Lakhs for innovative product patents and prototype testing.</p>
                  <ul className="scheme-benefits">
                    <li>Patent filing reimbursement up to ₹2 Lakhs</li>
                    <li>Quality certification fee subsidy</li>
                  </ul>
                  <button type="button" className="btn-scheme-apply secondary">View Guidelines →</button>
                </div>

                <div className="scheme-card">
                  <div className="scheme-badge">GREEN ENERGY</div>
                  <h3>Clean Energy Industrial Transition Rebate</h3>
                  <p>Subsidies for rooftop solar installation and zero-liquid-discharge (ZLD) effluent plants.</p>
                  <ul className="scheme-benefits">
                    <li>Capital grant of 25% on effluent treatment equipment</li>
                    <li>Priority net-metering approval by MSEDCL</li>
                  </ul>
                  <button type="button" className="btn-scheme-apply secondary">View Guidelines →</button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW: ALERTS & NOTIFICATIONS (PROTOTYPE MODULE)
             ===================================================================== */}
          {activeView === "alerts" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW · UI DEMONSTRATION</div>
                <h2>Government Alerts, Notifications & Circulars</h2>
                <p>
                  Official communiques issued by Department of Industries, Maharashtra Pollution Control Board,
                  and MAITRI Single Window Nodal Officers.
                </p>
              </div>

              <div className="alerts-full-list">
                <div className="alert-full-item critical">
                  <div className="alert-left-icon">⚠️</div>
                  <div className="alert-content">
                    <div className="alert-title-row">
                      <strong>MPCB Circular: Mandatory Online Water Quality Monitoring Submission</strong>
                      <span className="alert-time">2 hours ago</span>
                    </div>
                    <p>
                      All units operating with effluent generation exceeding 50 KLD must connect real-time sensor
                      data to the central MPCB server by March 31, 2026.
                    </p>
                  </div>
                </div>

                <div className="alert-full-item info">
                  <div className="alert-left-icon">📢</div>
                  <div className="alert-content">
                    <div className="alert-title-row">
                      <strong>MAITRI Single Window Portal Maintenance Scheduled</strong>
                      <span className="alert-time">Yesterday</span>
                    </div>
                    <p>
                      Scheduled database optimization on Sunday 02:00 AM to 04:00 AM IST. Application filings will
                      be queued and processed seamlessly post-maintenance.
                    </p>
                  </div>
                </div>

                <div className="alert-full-item success">
                  <div className="alert-left-icon">✅</div>
                  <div className="alert-content">
                    <div className="alert-title-row">
                      <strong>New Industrial Sub-Station Energized at Chakan Phase II</strong>
                      <span className="alert-time">3 days ago</span>
                    </div>
                    <p>
                      MSEDCL has commissioned a new 220/33kV substation. Power load feasibility applications for Chakan
                      industrial plots will now be processed with a reduced SLA of 3 days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              PORTAL FOOTER
             ===================================================================== */}
          <footer className="portal-footer">
            <div className="footer-left">
              <span className="footer-copy">
                © 2026 Government of Maharashtra. All rights reserved.
              </span>
              <span className="footer-sub">
                Designed & developed for the Department of Industries · Integrated with MAITRI Single Window Clearances.
              </span>
            </div>
            <div className="footer-links">
              <a href="#home">Home</a>
              <a href="#maitri">MAITRI Guidelines</a>
              <a href="#rti">Right to Information</a>
              <a href="#terms">Terms of Service</a>
              <a href="#help">Helpdesk</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default BusinessDashboard;
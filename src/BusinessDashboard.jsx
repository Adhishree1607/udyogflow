import { useEffect, useMemo, useState } from "react";
import maharashtraLogo from "./assets/maharashtra-logo.png";
import ApplicationSetup from "./ApplicationSetup";
import ApprovalRoadmap from "./ApprovalRoadmap";
import {
  IconHome,
  IconFileText,
  IconRoadmap,
  IconBot,
  IconFileCheck,
  IconClockAlert,
  IconRepeat,
  IconAward,
  IconBell,
  IconUser,
  IconBuilding,
  IconCheck,
  IconArrowRight,
  IconSearch,
  IconAlertTriangle,
  IconInfo,
  IconPlus,
  IconShieldCheck
} from "./Icons";

function BusinessDashboard({ onLogout, onNavigateHome }) {
  // Simplified Views: dashboard, applications, roadmap, ai-assistant, documents, delay-alerts, compliance, schemes, notifications, profile
  const [activeView, setActiveView] = useState("dashboard");
  const [showApplication, setShowApplication] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [tableSearch, setTableSearch] = useState("");
  const [tableStatusFilter, setTableStatusFilter] = useState("all");

  // Accessibility font scaling
  const [fontSizeLevel, setFontSizeLevel] = useState(1);

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
      if (tableStatusFilter === "in-progress")
        return st === "in progress" || st === "in review" || st === "under review";
      if (tableStatusFilter === "action-required")
        return st === "action required";
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

  // Font size toggle
  const handleFontSize = (level) => {
    setFontSizeLevel(level);
    const size = level === 0 ? "13px" : level === 1 ? "14px" : "15px";
    document.documentElement.style.fontSize = size;
  };

  // Sub-flow: New application
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

  // Sub-flow: Roadmap
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
      {/* 1. TOP GOVERNMENT HEADER */}
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
                Department of Industries · UdyogFlow Portal
              </div>
            </div>
          </div>

          <div className="gov-topbar-tools">
            {/* Font Resizer */}
            <div className="gov-accessibility">
              <span className="gov-tool-label">Text:</span>
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

            <button
              type="button"
              className="gov-bell-btn"
              onClick={() => setActiveView("notifications")}
              title="Notifications"
            >
              <IconBell size={18} />
              <span className="bell-badge">3</span>
            </button>

            <button
              type="button"
              className="gov-user-chip"
              onClick={() => setActiveView("profile")}
              title="User Profile"
            >
              <div className="user-avatar">B</div>
              <div className="user-meta">
                <span className="user-name">Business User</span>
                <span className="user-role">Maharashtra Investor</span>
              </div>
            </button>

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

      {/* 2. BODY: SIDEBAR + MAIN VIEW */}
      <div className="portal-body-wrapper">
        {/* Simplified Sidebar */}
        <aside className="portal-sidebar">
          <nav className="sidebar-nav">
            <button
              type="button"
              className={`nav-item ${activeView === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveView("dashboard")}
            >
              <IconHome size={18} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "applications" ? "active" : ""}`}
              onClick={() => setActiveView("applications")}
            >
              <IconFileText size={18} />
              <span>Applications</span>
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
              <span>Approval Roadmap</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "ai-assistant" ? "active" : ""}`}
              onClick={() => setActiveView("ai-assistant")}
            >
              <IconBot size={18} />
              <span>AI Assistant</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "documents" ? "active" : ""}`}
              onClick={() => setActiveView("documents")}
            >
              <IconFileCheck size={18} />
              <span>Documents</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "delay-alerts" ? "active" : ""}`}
              onClick={() => setActiveView("delay-alerts")}
            >
              <IconClockAlert size={18} />
              <span>Delay Alerts</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "compliance" ? "active" : ""}`}
              onClick={() => setActiveView("compliance")}
            >
              <IconRepeat size={18} />
              <span>Compliance</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "schemes" ? "active" : ""}`}
              onClick={() => setActiveView("schemes")}
            >
              <IconAward size={18} />
              <span>Government Schemes</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "notifications" ? "active" : ""}`}
              onClick={() => setActiveView("notifications")}
            >
              <IconBell size={18} />
              <span>Notifications</span>
              <span className="sidebar-count">3</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeView === "profile" ? "active" : ""}`}
              onClick={() => setActiveView("profile")}
            >
              <IconUser size={18} />
              <span>Profile</span>
            </button>
          </nav>

          {/* Helpline box */}
          <div className="sidebar-helpline-box">
            <div className="helpline-header">
              <IconInfo size={16} />
              <strong>Investor Helpline</strong>
            </div>
            <span className="helpline-phone">1800 120 8040</span>
            <small>Mon - Sat (9:30 AM to 6:00 PM)</small>
          </div>

          <div className="sidebar-footer-note">
            <span>UdyogFlow · Govt of Maharashtra</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="portal-main-content">
          {/* Top Banner */}
          <div className="portal-hero-strip">
            <div className="hero-text-group">
              <h1>Business Dashboard</h1>
              <p>Track your applications, statutory clearances, and compliance in one place.</p>
            </div>
            <div className="hero-action-group">
              <button
                type="button"
                className="btn-create-app"
                onClick={() => setShowApplication(true)}
              >
                <IconPlus size={16} />
                <span>New Application</span>
              </button>
            </div>
          </div>

          {/* ===================================================================
              VIEW: DASHBOARD (OVERVIEW)
             =================================================================== */}
          {activeView === "dashboard" && (
            <div className="overview-container">
              {/* 4 Stat Cards */}
              <section className="kpi-summary-row">
                <div
                  className="stat-card stat-blue cursor-pointer"
                  onClick={() => setActiveView("applications")}
                >
                  <div className="stat-icon-wrapper">
                    <IconBuilding size={20} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-label">Total Applications</span>
                    <strong className="stat-number">
                      {loadingApplications ? "..." : String(statistics.total).padStart(2, "0")}
                    </strong>
                    <span className="stat-subtext">Registered in database</span>
                  </div>
                </div>

                <div className="stat-card stat-green">
                  <div className="stat-icon-wrapper">
                    <IconCheck size={20} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-label">Approved</span>
                    <strong className="stat-number">
                      {loadingApplications ? "..." : String(statistics.approved).padStart(2, "0")}
                    </strong>
                    <span className="stat-subtext">Clearances issued</span>
                  </div>
                </div>

                <div className="stat-card stat-amber">
                  <div className="stat-icon-wrapper">
                    <IconClockAlert size={20} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-label">In Progress</span>
                    <strong className="stat-number">
                      {loadingApplications ? "..." : String(statistics.inProgress).padStart(2, "0")}
                    </strong>
                    <span className="stat-subtext">Under department scrutiny</span>
                  </div>
                </div>

                <div className="stat-card stat-red">
                  <div className="stat-icon-wrapper">
                    <IconAlertTriangle size={20} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-label">Action Required</span>
                    <strong className="stat-number">
                      {loadingApplications ? "..." : String(statistics.actionRequired).padStart(2, "0")}
                    </strong>
                    <span className="stat-subtext">Requires your attention</span>
                  </div>
                </div>
              </section>

              {/* Grid: Applications Table + Status Donut */}
              <section className="portal-grid-two">
                {/* Recent Applications Card */}
                <div className="portal-card applications-card">
                  <div className="card-header-bar">
                    <div className="header-titles">
                      <IconFileText size={18} />
                      <div>
                        <h2>Recent Applications</h2>
                        <p>Live applications saved in PostgreSQL</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => setActiveView("applications")}
                    >
                      View All →
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="gov-data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Business & Sector</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingApplications ? (
                          <tr>
                            <td colSpan="5" className="table-empty-cell">
                              <div className="table-spinner"></div>
                              <span>Loading applications...</span>
                            </td>
                          </tr>
                        ) : applications.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="table-empty-cell">
                              <IconInfo size={20} />
                              <p>No applications yet. Click 'New Application' to start.</p>
                            </td>
                          </tr>
                        ) : (
                          applications.slice(0, 4).map((app) => {
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
                                    #{app.application_id}
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

                {/* Status Donut Chart */}
                <div className="portal-card status-breakdown-card">
                  <div className="card-header-bar">
                    <div className="header-titles">
                      <IconShieldCheck size={18} />
                      <div>
                        <h2>Status Breakdown</h2>
                        <p>Current distribution of your filings</p>
                      </div>
                    </div>
                  </div>

                  <div className="chart-wrapper">
                    <div className="donut-circle" style={{ background: donutBackground }}>
                      <div className="donut-hole">
                        <strong className="donut-total">
                          {loadingApplications ? "..." : String(statistics.total).padStart(2, "0")}
                        </strong>
                        <span className="donut-caption">Total</span>
                      </div>
                    </div>

                    <div className="chart-legend-list">
                      <div className="legend-item">
                        <span className="legend-marker marker-green"></span>
                        <div className="legend-text">
                          <span>Approved</span>
                          <strong>{statistics.approved}</strong>
                        </div>
                      </div>

                      <div className="legend-item">
                        <span className="legend-marker marker-amber"></span>
                        <div className="legend-text">
                          <span>In Progress</span>
                          <strong>{statistics.inProgress}</strong>
                        </div>
                      </div>

                      <div className="legend-item">
                        <span className="legend-marker marker-red"></span>
                        <div className="legend-text">
                          <span>Action Needed</span>
                          <strong>{statistics.actionRequired + statistics.rejected}</strong>
                        </div>
                      </div>

                      <div className="legend-item">
                        <span className="legend-marker marker-slate"></span>
                        <div className="legend-text">
                          <span>Draft</span>
                          <strong>{statistics.draft}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Clean Highlight Cards (1-sentence descriptions) */}
              <section className="feature-highlights-section">
                <div className="section-title-wrap">
                  <div className="title-left">
                    <h2>Platform Features</h2>
                    <p>Quick access to all industrial approval and compliance modules.</p>
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
                      <IconRoadmap size={20} />
                    </div>
                    <h3>Approval Roadmap</h3>
                    <p>Track your step-by-step statutory clearances and SLA timelines.</p>
                    <span className="card-explore-link">Open Roadmap →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("ai-assistant")}
                  >
                    <div className="card-icon-header icon-purple">
                      <IconBot size={20} />
                    </div>
                    <h3>AI Assistant</h3>
                    <p>Get instant answers about clearances, MPCB categories, and policies.</p>
                    <span className="card-explore-link">Ask Assistant →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("documents")}
                  >
                    <div className="card-icon-header icon-green">
                      <IconFileCheck size={20} />
                    </div>
                    <h3>Documents</h3>
                    <p>Pre-validate file formats and reuse verified certificates securely.</p>
                    <span className="card-explore-link">Manage Documents →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("delay-alerts")}
                  >
                    <div className="card-icon-header icon-amber">
                      <IconClockAlert size={20} />
                    </div>
                    <h3>Delay Alerts</h3>
                    <p>Identify potential bottlenecks early to prevent project delays.</p>
                    <span className="card-explore-link">Check Alerts →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("compliance")}
                  >
                    <div className="card-icon-header icon-teal">
                      <IconRepeat size={20} />
                    </div>
                    <h3>Compliance</h3>
                    <p>Never miss annual license renewals, safety audits, and returns.</p>
                    <span className="card-explore-link">View Calendar →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("schemes")}
                  >
                    <div className="card-icon-header icon-orange">
                      <IconAward size={20} />
                    </div>
                    <h3>Government Schemes</h3>
                    <p>Explore subsidies and incentives under Package Scheme of Incentives.</p>
                    <span className="card-explore-link">View Schemes →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("notifications")}
                  >
                    <div className="card-icon-header icon-red">
                      <IconBell size={20} />
                    </div>
                    <h3>Notifications</h3>
                    <p>Real-time updates on application status and official circulars.</p>
                    <span className="card-explore-link">View Notifications →</span>
                  </div>

                  <div
                    className="feature-interactive-card"
                    onClick={() => setActiveView("profile")}
                  >
                    <div className="card-icon-header icon-blue">
                      <IconUser size={20} />
                    </div>
                    <h3>Profile</h3>
                    <p>Manage your business entity profile and account settings.</p>
                    <span className="card-explore-link">View Profile →</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ===================================================================
              VIEW: APPLICATIONS (DEDICATED FULL TABLE)
             =================================================================== */}
          {activeView === "applications" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <h2>All Applications</h2>
                <p>Live industrial applications recorded in PostgreSQL database.</p>
              </div>

              <div className="card-controls mb-4">
                <div className="table-search-input">
                  <IconSearch size={14} />
                  <input
                    type="text"
                    placeholder="Search by name, sector..."
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

              <div className="table-responsive">
                <table className="gov-data-table">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Enterprise</th>
                      <th>Sector</th>
                      <th>Location</th>
                      <th>Classification</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingApplications ? (
                      <tr>
                        <td colSpan="7" className="table-empty-cell">
                          <div className="table-spinner"></div>
                          <span>Loading applications...</span>
                        </td>
                      </tr>
                    ) : filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="table-empty-cell">
                          <IconInfo size={20} />
                          <p>No applications match your search criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((app) => {
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
                              <strong>{app.business_name}</strong>
                            </td>
                            <td>{app.industry}</td>
                            <td>📍 {app.location}</td>
                            <td>{app.business_type}</td>
                            <td>
                              <span className={`status-pill ${badgeClass}`}>
                                {status}
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
          )}

          {/* ===================================================================
              VIEW: ROADMAP (IF ACCESSED DIRECTLY FROM SIDEBAR WITHOUT PARAMS)
             =================================================================== */}
          {activeView === "roadmap" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <h2>Approval Roadmap</h2>
                <p>Select an application to view its statutory approval journey.</p>
              </div>

              {applications.length > 0 ? (
                <div className="roadmap-select-list">
                  {applications.map((app) => (
                    <div
                      key={app.application_id}
                      className="app-select-card cursor-pointer"
                      onClick={() => openRoadmap(app)}
                    >
                      <div>
                        <h3>{app.business_name}</h3>
                        <p>{app.industry} · 📍 {app.location}</p>
                      </div>
                      <button type="button" className="btn-secondary">
                        Open Roadmap →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-box">
                  <IconInfo size={24} />
                  <h3>No Applications Available</h3>
                  <p>Start your first application to generate a roadmap.</p>
                  <button
                    type="button"
                    className="btn-primary mt-3"
                    onClick={() => setShowApplication(true)}
                  >
                    Start New Application
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================
              VIEW: AI ASSISTANT (CLEAN PROTOTYPE)
             =================================================================== */}
          {activeView === "ai-assistant" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW</div>
                <h2>AI Assistant</h2>
                <p>Ask questions regarding Maharashtra industrial approvals, MPCB categories, and policies.</p>
              </div>

              <div className="ai-chat-layout">
                <div className="chat-window">
                  <div className="chat-messages">
                    <div className="chat-bubble bot">
                      <div className="bubble-avatar"><IconBot size={16} /></div>
                      <div className="bubble-body">
                        <strong>Namaskar! How can I help you today?</strong>
                        <p>Ask about MPCB pollution categories, DISH factory licensing, or Maharashtra PSI 2019 incentives.</p>
                      </div>
                    </div>

                    <div className="chat-bubble user">
                      <div className="bubble-body">
                        <p>What approvals are needed for an Engineering unit in Pune?</p>
                      </div>
                    </div>

                    <div className="chat-bubble bot">
                      <div className="bubble-avatar"><IconBot size={16} /></div>
                      <div className="bubble-body">
                        <strong>Engineering in Pune typically requires:</strong>
                        <ul className="chat-list">
                          <li>MPCB Consent to Establish (Orange/Green category)</li>
                          <li>DISH Factory Plan Approval (Factories Act 1948)</li>
                          <li>MIDC Land Allotment and Water Connection</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="chat-input-row">
                    <input
                      type="text"
                      placeholder="Type your question here..."
                    />
                    <button type="button" className="btn-chat-send">Send →</button>
                  </div>
                </div>

                <div className="ai-info-sidebar">
                  <h3>Quick Guidelines</h3>
                  <div className="kg-item">
                    <strong>MPCB Clearances</strong>
                    <p>Pollution categorized into Red, Orange, Green, and White.</p>
                  </div>
                  <div className="kg-item">
                    <strong>Statutory SLAs</strong>
                    <p>Protected under Maharashtra Right to Public Services Act.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              VIEW: DOCUMENTS (CLEAN PROTOTYPE)
             =================================================================== */}
          {activeView === "documents" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW</div>
                <h2>Documents</h2>
                <p>Pre-validate mandatory documents and reuse verified certificates across departments.</p>
              </div>

              <div className="vault-grid">
                <div className="vault-doc-card">
                  <div className="vault-doc-header">
                    <span className="vault-type">KYC</span>
                    <span className="vault-reused">Reused 4 Times</span>
                  </div>
                  <h3>Company Incorporation (MCA Certificate)</h3>
                  <p>CIN: U29304MH2024PTC128492</p>
                  <span className="vault-status">🔒 DigiLocker Verified</span>
                </div>

                <div className="vault-doc-card">
                  <div className="vault-doc-header">
                    <span className="vault-type">MSME</span>
                    <span className="vault-reused">Reused 3 Times</span>
                  </div>
                  <h3>Udyam Registration Certificate</h3>
                  <p>UDYAM-MH-26-0049281</p>
                  <span className="vault-status">🔒 MSME Verified</span>
                </div>

                <div className="vault-doc-card">
                  <div className="vault-doc-header">
                    <span className="vault-type">LAND TITLE</span>
                    <span className="vault-reused">Reused 5 Times</span>
                  </div>
                  <h3>MIDC Land Allotment Order</h3>
                  <p>MIDC/RO/PN/PLOT-E-42</p>
                  <span className="vault-status">🔒 Maha-Bhumi Verified</span>
                </div>

                <div className="vault-doc-card">
                  <div className="vault-doc-header">
                    <span className="vault-type">ENVIRONMENTAL</span>
                    <span className="vault-reused">Reused 2 Times</span>
                  </div>
                  <h3>MPCB Baseline Environmental Audit</h3>
                  <p>MPCB/RO-PUNE/CONSENT-00284</p>
                  <span className="vault-status">🔒 MPCB Verified</span>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              VIEW: DELAY ALERTS (CLEAN PROTOTYPE)
             =================================================================== */}
          {activeView === "delay-alerts" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW</div>
                <h2>Delay Alerts</h2>
                <p>Monitor department turnaround times against statutory SLAs to avoid delays.</p>
              </div>

              <div className="radar-grid">
                <div className="radar-metric-card">
                  <span className="radar-eyebrow">DEPARTMENT MONITORING</span>
                  <h3>Maharashtra Pollution Control Board (MPCB)</h3>
                  <div className="radar-stat-line">
                    <span>SLA: <strong>45 Days</strong></span>
                    <span>Average: <strong>49 Days</strong></span>
                  </div>
                  <div className="sla-progress-bar">
                    <div className="sla-fill warning" style={{ width: "88%" }}></div>
                  </div>
                  <span className="radar-alert-note text-amber">
                    ⚠️ Site inspection backlog in Western Maharashtra. Ensure effluent diagrams are uploaded.
                  </span>
                </div>

                <div className="radar-metric-card">
                  <span className="radar-eyebrow">DEPARTMENT MONITORING</span>
                  <h3>MIDC Infrastructure Clearances</h3>
                  <div className="radar-stat-line">
                    <span>SLA: <strong>21 Days</strong></span>
                    <span>Average: <strong>14 Days</strong></span>
                  </div>
                  <div className="sla-progress-bar">
                    <div className="sla-fill success" style={{ width: "66%" }}></div>
                  </div>
                  <span className="radar-alert-note text-green">
                    ✅ Optimal performance. Processing 7 days ahead of statutory deadline.
                  </span>
                </div>

                <div className="radar-metric-card">
                  <span className="radar-eyebrow">DEPARTMENT MONITORING</span>
                  <h3>Directorate of Industrial Safety (DISH)</h3>
                  <div className="radar-stat-line">
                    <span>SLA: <strong>30 Days</strong></span>
                    <span>Average: <strong>28 Days</strong></span>
                  </div>
                  <div className="sla-progress-bar">
                    <div className="sla-fill success" style={{ width: "93%" }}></div>
                  </div>
                  <span className="radar-alert-note text-blue">
                    ℹ️ On track. Standard factory layout submitted.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              VIEW: COMPLIANCE (CLEAN PROTOTYPE)
             =================================================================== */}
          {activeView === "compliance" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW</div>
                <h2>Compliance Calendar</h2>
                <p>Track upcoming statutory renewal deadlines and environmental returns.</p>
              </div>

              <div className="compliance-timeline-card">
                <div className="comp-item urgent">
                  <div className="comp-date">
                    <strong>31</strong>
                    <span>MAR</span>
                  </div>
                  <div className="comp-body">
                    <strong>MPCB Annual Environmental Statement (Form V)</strong>
                    <p>Mandatory for Red and Orange category industries.</p>
                  </div>
                  <span className="comp-badge due">Due Soon</span>
                </div>

                <div className="comp-item normal">
                  <div className="comp-date">
                    <strong>30</strong>
                    <span>APR</span>
                  </div>
                  <div className="comp-body">
                    <strong>Factory License Renewal</strong>
                    <p>Annual renewal under Maharashtra Factories Rules.</p>
                  </div>
                  <span className="comp-badge queued">Upcoming</span>
                </div>

                <div className="comp-item normal">
                  <div className="comp-date">
                    <strong>30</strong>
                    <span>JUN</span>
                  </div>
                  <div className="comp-body">
                    <strong>Annual Fire Safety Audit Report</strong>
                    <p>Form B submission to Maharashtra Fire Services.</p>
                  </div>
                  <span className="comp-badge queued">Scheduled</span>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              VIEW: GOVERNMENT SCHEMES (CLEAN PROTOTYPE)
             =================================================================== */}
          {activeView === "schemes" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW</div>
                <h2>Government Schemes & Incentives</h2>
                <p>Explore fiscal incentives and subsidies under the Maharashtra Industrial Policy.</p>
              </div>

              <div className="schemes-grid">
                <div className="scheme-card highlighted">
                  <div className="scheme-badge">FLAGSHIP</div>
                  <h3>Package Scheme of Incentives (PSI 2019)</h3>
                  <p>Incentives for industrial dispersal into developing talukas (B, C, D, D+).</p>
                  <ul className="scheme-benefits">
                    <li>Industrial Promotion Subsidy up to 100% of Fixed Capital Investment</li>
                    <li>5% Interest Subsidy on term loans for MSMEs</li>
                    <li>Electricity duty exemption for up to 10 years</li>
                  </ul>
                  <button type="button" className="btn-scheme-apply">Check Eligibility →</button>
                </div>

                <div className="scheme-card">
                  <div className="scheme-badge">INNOVATION</div>
                  <h3>MSInS Startup Patent Subsidy</h3>
                  <p>Financial support up to ₹15 Lakhs for patents and quality certifications.</p>
                  <ul className="scheme-benefits">
                    <li>Patent filing reimbursement up to ₹2 Lakhs</li>
                    <li>Quality testing fee reimbursement</li>
                  </ul>
                  <button type="button" className="btn-scheme-apply secondary">View Details →</button>
                </div>

                <div className="scheme-card">
                  <div className="scheme-badge">GREEN ENERGY</div>
                  <h3>Clean Energy Industrial Transition</h3>
                  <p>Subsidies for rooftop solar installation and effluent treatment.</p>
                  <ul className="scheme-benefits">
                    <li>25% capital subsidy on effluent treatment equipment</li>
                    <li>Priority net-metering approval</li>
                  </ul>
                  <button type="button" className="btn-scheme-apply secondary">View Details →</button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              VIEW: NOTIFICATIONS (CLEAN PROTOTYPE)
             =================================================================== */}
          {activeView === "notifications" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <div className="module-tag prototype">PROTOTYPE PREVIEW</div>
                <h2>Notifications & Circulars</h2>
                <p>Official alerts issued by the Department of Industries and MAITRI.</p>
              </div>

              <div className="alerts-full-list">
                <div className="alert-full-item critical">
                  <div className="alert-left-icon">⚠️</div>
                  <div className="alert-content">
                    <div className="alert-title-row">
                      <strong>MPCB Circular: Online Effluent Sensor Data</strong>
                      <span className="alert-time">Today</span>
                    </div>
                    <p>Units generating over 50 KLD effluent must connect sensors by March 31, 2026.</p>
                  </div>
                </div>

                <div className="alert-full-item info">
                  <div className="alert-left-icon">📢</div>
                  <div className="alert-content">
                    <div className="alert-title-row">
                      <strong>MAITRI Scheduled Maintenance Notice</strong>
                      <span className="alert-time">Yesterday</span>
                    </div>
                    <p>Database optimization on Sunday 02:00 AM to 04:00 AM IST.</p>
                  </div>
                </div>

                <div className="alert-full-item success">
                  <div className="alert-left-icon">✅</div>
                  <div className="alert-content">
                    <div className="alert-title-row">
                      <strong>Chakan Phase II Substation Energized</strong>
                      <span className="alert-time">3 days ago</span>
                    </div>
                    <p>Power load feasibility turnaround time reduced to 3 days for Chakan plots.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              VIEW: PROFILE (CLEAN USER SETTINGS)
             =================================================================== */}
          {activeView === "profile" && (
            <div className="module-view-container">
              <div className="module-header-banner">
                <h2>Investor Profile</h2>
                <p>Your registered business profile under Government of Maharashtra Single Window.</p>
              </div>

              <div className="profile-details-card">
                <div className="profile-header-row">
                  <div className="profile-avatar-big">B</div>
                  <div>
                    <h3>Business Investor</h3>
                    <span>Industrial Unit Account · Verified</span>
                  </div>
                </div>

                <div className="profile-info-grid">
                  <div className="profile-field">
                    <label>Account Type</label>
                    <strong>Business Investor (MAITRI Single Window)</strong>
                  </div>
                  <div className="profile-field">
                    <label>Email Address</label>
                    <strong>investor@udyogflow.gov.in</strong>
                  </div>
                  <div className="profile-field">
                    <label>Jurisdiction</label>
                    <strong>State of Maharashtra (All 36 Districts)</strong>
                  </div>
                  <div className="profile-field">
                    <label>Registered Submissions</label>
                    <strong>{applications.length} Applications on File</strong>
                  </div>
                </div>

                <div className="profile-actions-row">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => alert("Profile update form will open in account management.")}
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => alert("Password reset link will be sent to your email.")}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Clean Footer */}
          <footer className="portal-footer">
            <span className="footer-copy">
              © 2026 Government of Maharashtra · UdyogFlow Platform
            </span>
            <div className="footer-links">
              <a href="#maitri" onClick={(e) => { e.preventDefault(); setActiveView("dashboard"); }}>Dashboard</a>
              <a href="#help" onClick={(e) => { e.preventDefault(); setActiveView("ai-assistant"); }}>AI Assistant</a>
              <a href="#notif" onClick={(e) => { e.preventDefault(); setActiveView("notifications"); }}>Notifications</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default BusinessDashboard;
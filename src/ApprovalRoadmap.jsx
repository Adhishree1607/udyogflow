import { useEffect, useState, useMemo } from "react";
import maharashtraLogo from "./assets/maharashtra-logo.png";
import {
  IconArrowLeft,
  IconBuilding,
  IconCheck,
  IconPrinter,
  IconShieldCheck,
  IconSearch,
  IconExternalLink,
  IconClockAlert,
  IconInfo,
  IconBot,
  IconFileText
} from "./Icons";

function ApprovalRoadmap({ applicationData, onBack }) {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        if (!applicationData?.applicationId) {
          setApprovals([]);
          setLoading(false);
          return;
        }
const response = await fetch(
  `http://localhost:5000/api/applications/${applicationData.applicationId}/approvals?user_id=${applicationData.userId}`
);

        if (!response.ok) {
          throw new Error("Failed to fetch approvals from MAITRI database");
        }

        const data = await response.json();
        setApprovals(data);
      } catch (error) {
        console.error("Error fetching approvals:", error);
        setApprovals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, [applicationData]);

  // Statistics
  const completedCount = approvals.filter(
    (a) => (a.status || "").toLowerCase() === "completed"
  ).length;

  const inProgressCount = approvals.filter(
    (a) =>
      (a.status || "").toLowerCase() === "in progress" ||
      (a.status || "").toLowerCase() === "under review"
  ).length;

  const pendingCount = approvals.filter(
    (a) => (a.status || "pending").toLowerCase() === "pending"
  ).length;

  const progressPercentage =
    approvals.length > 0
      ? Math.round((completedCount / approvals.length) * 100)
      : 0;

  // Total SLA Days
  const totalSlaDays = useMemo(() => {
    return approvals.reduce(
      (sum, item) => sum + (parseInt(item.sla_days) || 0),
      0
    );
  }, [approvals]);

  // Total Fees
  const totalFees = useMemo(() => {
    let feeSum = 0;

    approvals.forEach((item) => {
      if (item.fees) {
        const matches = item.fees.match(/\d[\d,]*/g);

        if (matches) {
          matches.forEach((m) => {
            feeSum += parseInt(m.replace(/,/g, ""), 10) || 0;
          });
        }
      }
    });

    return feeSum;
  }, [approvals]);

  // Filtered approvals
  const filteredApprovals = useMemo(() => {
    return approvals.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.service_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.approving_department
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.stage
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      const st = (item.status || "pending").toLowerCase();

      if (activeTab === "completed") return st === "completed";

      if (activeTab === "in-progress")
        return st === "in progress" || st === "under review";

      if (activeTab === "pending") return st === "pending";

      if (activeTab === "pre-establishment")
        return (item.stage || "")
          .toLowerCase()
          .includes("establishment");

      if (activeTab === "pre-operation")
        return (item.stage || "")
          .toLowerCase()
          .includes("operation");

      return true;
    });
  }, [approvals, activeTab, searchTerm]);

  return (
    <div className="roadmap-page">
      {/* Top Government Navigation Header */}
      <header className="gov-strip">
        <div className="gov-strip-inner">
          <div className="gov-brand-left">
            <img
              src={maharashtraLogo}
              alt="Government of Maharashtra"
              className="gov-seal"
            />

            <div className="gov-brand-text">
              <span className="gov-title-en">
                Government of Maharashtra
              </span>

              <span className="gov-title-mr">
                महाराष्ट्र शासन · MAITRI Single Window Clearances
              </span>
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
                <span>Return to Portal</span>
              </button>
            )}

            <button
              type="button"
              className="gov-action-btn"
              onClick={() => window.print()}
            >
              <IconPrinter size={16} />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>
      </header>

      <div className="roadmap-container">
        {/* Breadcrumb */}
        <div className="portal-breadcrumb">
          <span>Home</span>
          <span className="bc-sep">/</span>
          <span>Industrial Approvals</span>
          <span className="bc-sep">/</span>
          <span className="bc-current">
            Statutory Approval Roadmap
          </span>
        </div>

        {/* Header Hero Banner */}
        <div className="roadmap-hero-card">
          <div className="hero-left-col">
            <div className="official-pill">
              <IconShieldCheck size={14} />
              <span>OFFICIAL CLEARANCE BLUEPRINT</span>
            </div>

            <h1>Smart Approval Roadmap</h1>

            <p>
              Automated statutory regulatory pipeline dynamically
              generated through the MAITRI inter-departmental matrix
              for your designated sector and location.
            </p>
          </div>

          <div className="hero-right-col">
            <div className="progress-radial-box">
              <div className="radial-percentage">
                {progressPercentage}%
              </div>

              <div className="radial-label">
                Roadmap Clearances Finalized
              </div>
            </div>
          </div>
        </div>

        {/* Application Metadata Banner */}
        {applicationData && (
          <div className="app-summary-card">
            <div className="summary-header-row">
              <div className="summary-title-group">
                <div className="summary-icon-box">
                  <IconBuilding size={22} />
                </div>

                <div>
                  <span className="meta-overline">
                    ENTERPRISE UNDER SCRUTINY
                  </span>

                  <h2>{applicationData.businessName}</h2>
                </div>
              </div>

              <div className="app-id-pill">
                <span>MAITRI Ref: </span>

                <strong>
                  MH-IND-
                  {String(applicationData.applicationId).padStart(
                    5,
                    "0"
                  )}
                </strong>
              </div>
            </div>

            <div className="summary-meta-grid">
              <div className="meta-cell">
                <span className="meta-key">
                  Industry Sector
                </span>

                <strong className="meta-val">
                  {applicationData.industry}
                </strong>
              </div>

              <div className="meta-cell">
                <span className="meta-key">
                  Unit Location
                </span>

                <strong className="meta-val">
                  📍 {applicationData.location}
                </strong>
              </div>

              <div className="meta-cell">
                <span className="meta-key">
                  Enterprise Category
                </span>

                <strong className="meta-val">
                  {applicationData.businessType}
                </strong>
              </div>

              <div className="meta-cell">
                <span className="meta-key">
                  Total Required Services
                </span>

                <strong className="meta-val">
                  {approvals.length} Statutory Clearances
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="roadmap-kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">
              Cumulative SLA Standard
            </span>

            <div className="kpi-val-group">
              <IconClockAlert
                size={20}
                className="text-blue"
              />

              <strong>{totalSlaDays} Days</strong>
            </div>

            <span className="kpi-hint">
              Under Maharashtra Public Services Guarantee Act
            </span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">
              Estimated Statutory Fees
            </span>

            <div className="kpi-val-group">
              <strong className="text-saffron">
                {totalFees > 0
                  ? `Rs.${totalFees.toLocaleString("en-IN")}`
                  : "As per capital scale"}
              </strong>
            </div>

            <span className="kpi-hint">
              Payable via GRAS Govt Treasury portal
            </span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">
              Clearance Breakdown
            </span>

            <div className="kpi-status-chips">
              <span className="chip-pill chip-completed">
                <IconCheck size={12} /> {completedCount} Approved
              </span>

              <span className="chip-pill chip-progress">
                {inProgressCount} Under Review
              </span>

              <span className="chip-pill chip-pending">
                {pendingCount} Queued
              </span>
            </div>

            <span className="kpi-hint">
              Automatic sequencing prevents rejection
            </span>
          </div>
        </div>

        {/* AI Industrial Advisory Callout */}
        <div className="ai-advisory-banner">
          <div className="ai-advisor-badge">
            <IconBot size={16} />
            <span>MAITRI AI COMPLIANCE ADVISORY</span>
          </div>

          <p>
            <strong>
              Sector Assessment for{" "}
              {applicationData?.industry || "Industrial Unit"}:
            </strong>{" "}
            Prioritize <em>Consent to Establish (CTE)</em> from
            Maharashtra Pollution Control Board (MPCB) concurrently
            with <em>MIDC Land Allotment & Building Plan Approval</em>.
            The platform has pre-sequenced dependent services so you
            can upload required documents in parallel to minimize
            your idle turnaround time.
          </p>
        </div>

        {/* Controls: Search & Tabs */}
        <div className="roadmap-controls-bar">
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${
                activeTab === "all" ? "active" : ""
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Approvals ({approvals.length})
            </button>

            <button
              type="button"
              className={`filter-tab ${
                activeTab === "pre-establishment"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("pre-establishment")
              }
            >
              Pre-Establishment
            </button>

            <button
              type="button"
              className={`filter-tab ${
                activeTab === "pre-operation"
                  ? "active"
                  : ""
              }`}
              onClick={() => setActiveTab("pre-operation")}
            >
              Pre-Operation
            </button>

            <button
              type="button"
              className={`filter-tab ${
                activeTab === "pending" ? "active" : ""
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending ({pendingCount})
            </button>
          </div>

          <div className="roadmap-search">
            <IconSearch size={16} />

            <input
              type="text"
              placeholder="Search clearances, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Approval Cards Timeline */}
        {loading ? (
          <div className="gov-empty-state">
            <div className="gov-spinner"></div>

            <h3>
              Querying MAITRI Single Window Approval Catalog...
            </h3>

            <p>
              Correlating industry profile with Maharashtra
              departmental databases.
            </p>
          </div>
        ) : filteredApprovals.length === 0 ? (
          <div className="gov-empty-state">
            <IconInfo size={32} />

            <h3>No Clearance Records Matching Filter</h3>

            <p>
              Try clearing search keywords or switching tab filters.
            </p>
          </div>
        ) : (
          <div className="approval-timeline-list">
            {filteredApprovals.map((approval, index) => {
              const status = (
                approval.status || "Pending"
              ).toLowerCase();

              const isCompleted = status === "completed";

              const isInProgress =
                status === "in progress" ||
                status === "under review";

              let badgeClass = "badge-pending";
              let badgeText = "Pending Submission";

              if (isCompleted) {
                badgeClass = "badge-completed";
                badgeText = "Approved / Cleared";
              } else if (isInProgress) {
                badgeClass = "badge-progress";
                badgeText = "Under Scrutiny";
              }

              return (
                <div
                  className="roadmap-step-card"
                  key={
                    approval.application_approval_id || index
                  }
                >
                  {/* Step Sequence Marker */}
                  <div className="step-track-col">
                    <div
                      className={`step-counter-circle ${
                        isCompleted
                          ? "circle-done"
                          : isInProgress
                          ? "circle-active"
                          : ""
                      }`}
                    >
                      {isCompleted ? (
                        <IconCheck size={16} />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {index < filteredApprovals.length - 1 && (
                      <div className="step-track-line"></div>
                    )}
                  </div>

                  {/* Main Card Content */}
                  <div className="step-content-box">
                    <div className="step-header-row">
                      <div className="step-title-col">
                        <div className="stage-pill">
                          {approval.stage ||
                            "Statutory Clearance"}
                        </div>

                        <h3>{approval.service_name}</h3>
                      </div>

                      <div
                        className={`approval-status-badge ${badgeClass}`}
                      >
                        {badgeText}
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="step-details-grid">
                      <div className="detail-item">
                        <span className="detail-label">
                          Competent Department
                        </span>

                        <strong className="detail-value">
                          🏛️{" "}
                          {approval.approving_department ||
                            "Govt. of Maharashtra"}
                        </strong>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">
                          Statutory SLA
                        </span>

                        <strong className="detail-value">
                          ⏱️{" "}
                          {approval.sla_days
                            ? `${approval.sla_days} Days`
                            : "Standard SLA"}
                        </strong>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">
                          Prescribed Fees
                        </span>

                        <strong className="detail-value">
                          💳{" "}
                          {approval.fees || "As per scale"}
                        </strong>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">
                          Service Sequence
                        </span>

                        <strong className="detail-value">
                          Step #{index + 1} in Parallel Pipeline
                        </strong>
                      </div>
                    </div>

                    {/* Governing Act / Rule */}
                    {approval.governing_act_rule && (
                      <div className="governing-rule-box">
                        <div className="rule-title">
                          <IconFileText size={14} />

                          <span>
                            Legal Mandate & Governing Act:
                          </span>
                        </div>

                        <p>
                          {approval.governing_act_rule}
                        </p>
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="step-actions-footer">
                      {approval.document_link ? (
                        <a
                          href={approval.document_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-doc-link"
                        >
                          <IconFileText size={14} />

                          <span>
                            Required Document Checklist & Forms
                          </span>

                          <IconExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="action-doc-link disabled">
                          <IconFileText size={14} />

                          <span>
                            Standard KYC & Project Report
                          </span>
                        </span>
                      )}

                      {approval.website && (
                        <a
                          href={approval.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-web-link"
                        >
                          <span>Department Portal</span>

                          <IconExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovalRoadmap;
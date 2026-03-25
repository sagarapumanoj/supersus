import React, { useEffect, useRef, useState } from "react";
import "./AnalyticsDashboard.css";
import { Chart, registerables } from "chart.js";
// Import your map image
import mapImage from "../assets/map.png";

Chart.register(...registerables);

const AnalyticsDashboard = () => {
  const categoryChartRef = useRef(null);
  const departmentChartRef = useRef(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState("volume");
  const [updateTime, setUpdateTime] = useState("Last updated: 5 minutes ago");
  const [liveBadgeText, setLiveBadgeText] = useState("Live");

  // create charts once and clean up on unmount
  useEffect(() => {
    const ctxCategory = document.getElementById("categoryChart").getContext("2d");
    if (categoryChartRef.current) {
      categoryChartRef.current.destroy();
      categoryChartRef.current = null;
    }
    categoryChartRef.current = new Chart(ctxCategory, {
      type: "doughnut",
      data: {
        labels: ["Wi-Fi Issues", "Maintenance", "Hostel Complaints", "Library", "Transport", "Others"],
        datasets: [
          {
            data: [35, 25, 20, 10, 5, 5],
            backgroundColor: ["#4361ee", "#f72585", "#4cc9f0", "#4895ef", "#3f37c9", "#e63946"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "right" } },
      },
    });

    const ctxDept = document.getElementById("departmentChart").getContext("2d");
    if (departmentChartRef.current) {
      departmentChartRef.current.destroy();
      departmentChartRef.current = null;
    }
    departmentChartRef.current = new Chart(ctxDept, {
      type: "bar",
      data: {
        labels: ["IT", "Maintenance", "Hostel", "Library", "Transport"],
        datasets: [
          {
            label: "Resolution Rate (%)",
            data: [85, 72, 90, 95, 78],
            backgroundColor: "#4361ee",
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: (v) => v + "%" },
          },
        },
      },
    });

    // cleanup on unmount
    return () => {
      if (categoryChartRef.current) {
        categoryChartRef.current.destroy();
        categoryChartRef.current = null;
      }
      if (departmentChartRef.current) {
        departmentChartRef.current.destroy();
        departmentChartRef.current = null;
      }
    };
  }, []); // empty deps -> run once

  const handleToggleSidebar = () => setSidebarCollapsed((s) => !s);

  const handleRefresh = () => {
    setLiveBadgeText("Updating...");
    setUpdateTime("Updating...");
    setTimeout(() => {
      setLiveBadgeText("Updated!");
      setUpdateTime("Last updated: Just now");
      setTimeout(() => setLiveBadgeText("Live"), 2000);
    }, 1300);
  };

  const handleApplyFilters = () => {
    setLiveBadgeText("Filters Applied!");
    setTimeout(() => setLiveBadgeText("Live"), 1500);
  };

  const handleResetFilters = () => {
    setLiveBadgeText("Filters Reset!");
    setTimeout(() => setLiveBadgeText("Live"), 1500);
  };

  const handleGenerateReport = (btn) => {
    btn.disabled = true;
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = original;
      setLiveBadgeText("Report Generated!");
      setTimeout(() => setLiveBadgeText("Live"), 1500);
    }, 1800);
  };

  return (
    <div className={`dashboard-root ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`} aria-hidden={sidebarCollapsed}>
        <div className="logo">
          <h3><i className="fas fa-school"></i> CampusCare</h3>
          <p className="muted">Admin Dashboard</p>
        </div>

        <nav className="nav-list">
          <a className="nav-link active"><i className="fas fa-chart-line"></i> Analytics Dashboard</a>
          <a className="nav-link"><i className="fas fa-list"></i> Complaint Management</a>
          <a className="nav-link"><i className="fas fa-users"></i> User Management</a>
          <a className="nav-link"><i className="fas fa-cog"></i> Settings</a>
          <a className="nav-link logout"><i className="fas fa-sign-out-alt"></i> Logout</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <button className="toggle-sidebar" onClick={handleToggleSidebar} aria-label="Toggle sidebar">
            <i className="fas fa-bars"></i>
          </button>

          <h4>Analytics Dashboard</h4>

          <div className="header-actions">
            <span className="badge live-badge">{liveBadgeText}</span>
            <span className="update-time">{updateTime}</span>
            <button className="refresh-btn" onClick={handleRefresh} title="Refresh data">
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </header>

        <section className="filter-bar">
          <div className="filters-row">
            <div className="filter-col">
              <label>Date Range</label>
              <select className="form-select">
                <option>Last 7 Days</option>
                <option selected>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div className="filter-col">
              <label>Category</label>
              <select className="form-select">
                <option selected>All Categories</option>
                <option>Wi-Fi Issues</option>
                <option>Maintenance</option>
                <option>Hostel Complaints</option>
                <option>Library</option>
              </select>
            </div>
            <div className="filter-col">
              <label>Building/Department</label>
              <select className="form-select">
                <option selected>All Locations</option>
                <option>Main Building</option>
                <option>Science Block</option>
                <option>Hostel A</option>
              </select>
            </div>
            <div className="filter-col">
              <label>Priority</label>
              <select className="form-select">
                <option selected>All Priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn btn-outline" onClick={handleResetFilters}><i className="fas fa-undo"></i> Reset Filters</button>
            <button className="btn btn-primary" onClick={handleApplyFilters}><i className="fas fa-filter"></i> Apply Filters</button>
          </div>
        </section>

        <section className="stats-row">
          <div className="stat-card highlight">
            <i className="fas fa-exclamation-circle"></i>
            <div className="number">142</div>
            <div className="label">Open Complaints</div>
          </div>
          <div className="stat-card">
            <i className="fas fa-check-circle text-success"></i>
            <div className="number">327</div>
            <div className="label">Resolved This Month</div>
          </div>
          <div className="stat-card">
            <i className="fas fa-clock text-warning"></i>
            <div className="number">3.2 days</div>
            <div className="label">Avg. Resolution Time</div>
          </div>
          <div className="stat-card">
            <i className="fas fa-fire text-info"></i>
            <div className="number">24%</div>
            <div className="label">Repeat Issues</div>
          </div>
        </section>

        <section className="row two-column">
          <div className="col-left">
            <div className="card">
              <div className="card-header">
                <span>Campus Heatmap - Issue Density</span>
                <div className="btn-group">
                  <button className={`btn small ${viewMode === "volume" ? "active" : ""}`} onClick={() => setViewMode("volume")}>By Volume</button>
                  <button className={`btn small ${viewMode === "priority" ? "active" : ""}`} onClick={() => setViewMode("priority")}>By Priority</button>
                </div>
              </div>
              <div className="card-body heatmap">
                {/* Replace the background with your map image */}
                <div 
                  className="heatmap-background" 
                  style={{ 
                    backgroundImage: `url(${mapImage})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <div className="heatmap-point priority-high" style={{ top: "30%", left: "25%" }} title="Hostel A - 42 issues" />
                  <div className="heatmap-point priority-medium" style={{ top: "45%", left: "60%" }} title="Science Block - 28 issues" />
                  <div className="heatmap-point priority-low" style={{ top: "70%", left: "40%" }} title="Library - 15 issues" />
                  <div className="heatmap-point priority-high" style={{ top: "55%", left: "75%" }} title="Cafeteria - 38 issues" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-right">
            <div className="card">
              <div className="card-header">Complaints by Category</div>
              <div className="card-body chart-area">
                <canvas id="categoryChart" />
              </div>
            </div>
          </div>
        </section>

        <section className="row two-column mt-3">
          <div className="col-left">
            <div className="card">
              <div className="card-header">Top Issues by Building</div>
              <div className="card-body">
                <div className="building-item"><span className="badge">Main Building</span><div className="progress"><div className="progress-bar bar-danger" style={{ width: "35%" }}>Wi-Fi (35%)</div></div></div>
                <div className="building-item"><span className="badge">Hostel A</span><div className="progress"><div className="progress-bar bar-warning" style={{ width: "28%" }}>Plumbing (28%)</div></div></div>
                <div className="building-item"><span className="badge">Science Block</span><div className="progress"><div className="progress-bar bar-info" style={{ width: "22%" }}>AC Issues (22%)</div></div></div>
                <div className="building-item"><span className="badge">Library</span><div className="progress"><div className="progress-bar bar-primary" style={{ width: "15%" }}>Noise (15%)</div></div></div>
              </div>
            </div>
          </div>

          <div className="col-right">
            <div className="card">
              <div className="card-header">Resolution Rate by Department</div>
              <div className="card-body chart-area">
                <canvas id="departmentChart" />
              </div>
            </div>
          </div>
        </section>

        <section className="row mt-3">
          <div className="card full">
            <div className="card-header">
              <span>Recurring Issues - Root Cause Analysis</span>
              <button className="btn btn-primary" onClick={(e) => handleGenerateReport(e.currentTarget)}><i className="fas fa-file-export" /> Generate Report</button>
            </div>
            <div className="card-body table-area">
              <table className="table">
                <thead>
                  <tr>
                    <th>Issue</th><th>Location</th><th>Occurrences</th><th>Root Cause</th><th>Action Plan</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Wi-Fi Connectivity</td><td>Hostel A, 2nd Floor</td><td>42</td><td>Overloaded AP</td><td>Install AP</td><td><span className="badge badge-warning">Pending</span></td></tr>
                  <tr><td>Water Leakage</td><td>Science Block</td><td>18</td><td>Faulty Pipe</td><td>Replace Section</td><td><span className="badge badge-success">Completed</span></td></tr>
                  <tr><td>Power Outages</td><td>Main Building</td><td>27</td><td>Wiring</td><td>Rewire Circuit</td><td><span className="badge badge-info">In Progress</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
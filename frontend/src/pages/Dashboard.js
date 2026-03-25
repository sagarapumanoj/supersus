import React, { useEffect, useRef } from "react";
import "./Dashboard.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  DoughnutController,
  BarController,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  DoughnutController,
  BarController
);

const Dashboard = () => {
  const categoryChartRef = useRef(null);
  const deptChartRef = useRef(null);

  useEffect(() => {
    let categoryChartInstance;
    let deptChartInstance;

    if (categoryChartRef.current) {
      categoryChartInstance = new ChartJS(categoryChartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Wi-Fi Issues", "Maintenance", "Hostel", "Library", "Transport", "Others"],
          datasets: [
            {
              data: [35, 25, 20, 10, 5, 5],
              backgroundColor: [
                "#4361ee",
                "#f72585",
                "#4cc9f0",
                "#4895ef",
                "#3f37c9",
                "#e63946",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "right" } },
        },
      });
    }

    if (deptChartRef.current) {
      deptChartInstance = new ChartJS(deptChartRef.current, {
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
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (value) => value + "%",
              },
            },
          },
        },
      });
    }

    // Cleanup on unmount
    return () => {
      if (categoryChartInstance) categoryChartInstance.destroy();
      if (deptChartInstance) deptChartInstance.destroy();
    };
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h3>🏫 CampusCare</h3>
          <p>Admin Dashboard</p>
        </div>
        <nav>
          <a href="#" className="active">📊 Analytics</a>
          <a href="#">📋 Complaints</a>
          <a href="#">👥 Users</a>
          <a href="#">⚙️ Settings</a>
          <a href="#">🚪 Logout</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="main">
        {/* Header */}
        <div className="header">
          <h4>Analytics Dashboard</h4>
          <div>
            <span className="badge live">Live</span>
            <span className="muted">Last updated: 5 minutes ago</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <select defaultValue="30">
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <select defaultValue="all">
            <option value="all">All Categories</option>
            <option value="wifi">Wi-Fi</option>
            <option value="hostel">Hostel</option>
          </select>
          <select defaultValue="all">
            <option value="all">All Locations</option>
            <option>Main Building</option>
            <option>Science Block</option>
          </select>
          <select defaultValue="all">
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="card">❗ 142 <p>Open Complaints</p></div>
          <div className="card">✅ 327 <p>Resolved This Month</p></div>
          <div className="card">⏳ 3.2 days <p>Avg. Resolution Time</p></div>
          <div className="card">🔥 24% <p>Repeat Issues</p></div>
        </div>

        {/* Charts + Heatmap */}
        <div className="row">
          <div className="card large">
            <h5>Campus Heatmap</h5>
            <div className="heatmap">
              <div className="point high" style={{ top: "30%", left: "25%" }}></div>
              <div className="point medium" style={{ top: "45%", left: "60%" }}></div>
              <div className="point low" style={{ top: "70%", left: "40%" }}></div>
              <div className="point high" style={{ top: "55%", left: "75%" }}></div>
            </div>
          </div>
          <div className="card">
            <h5>Complaints by Category</h5>
            <canvas ref={categoryChartRef}></canvas>
          </div>
        </div>

        <div className="row">
          <div className="card">
            <h5>Top Issues by Building</h5>
            <div className="progress-group">
              <span>Main Building</span>
              <div className="progress"><div style={{ width: "35%" }}>Wi-Fi</div></div>
            </div>
            <div className="progress-group">
              <span>Hostel A</span>
              <div className="progress"><div style={{ width: "28%" }}>Plumbing</div></div>
            </div>
          </div>
          <div className="card">
            <h5>Resolution Rate</h5>
            <canvas ref={deptChartRef}></canvas>
          </div>
        </div>

        {/* Table */}
        <div className="card full">
          <h5>Recurring Issues</h5>
          <table>
            <thead>
              <tr>
                <th>Issue</th>
                <th>Location</th>
                <th>Occurrences</th>
                <th>Root Cause</th>
                <th>Action Plan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Wi-Fi</td>
                <td>Hostel A</td>
                <td>42</td>
                <td>Overloaded Router</td>
                <td>Add more APs</td>
                <td><span className="badge pending">Pending</span></td>
              </tr>
              <tr>
                <td>Water Leak</td>
                <td>Science Block</td>
                <td>18</td>
                <td>Pipe Damage</td>
                <td>Replace Section</td>
                <td><span className="badge success">Completed</span></td>
              </tr>
              <tr>
                <td>Power</td>
                <td>Main Building</td>
                <td>27</td>
                <td>Faulty Wiring</td>
                <td>Rewire</td>
                <td><span className="badge info">In Progress</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

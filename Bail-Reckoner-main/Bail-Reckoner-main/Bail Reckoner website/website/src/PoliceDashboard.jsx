import { useNavigate } from "react-router-dom";
import "./PoliceDashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1>👮 Police Dashboard</h1>

      <div className="dashboard-section">
        <h2>📌 Actions</h2>
        <button className="primary-btn" onClick={() => navigate("/CrimeMap")}>
          🗺️ View Crime Hotspot Map
        </button>
      </div>

      <div className="dashboard-section">
        <h2>📄 Upload FIR</h2>
        <input type="file" className="file-upload" />
      </div>

      <div className="dashboard-section">
        <h2>🧠 Investigation Mindmap</h2>
        <p className="coming-soon">Feature coming soon powered by AI model</p>
      </div>
    </div>
  );
};

export default Dashboard;

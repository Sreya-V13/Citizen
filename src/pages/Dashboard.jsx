import { useContext } from "react";
import { ComplaintContext } from "../context/ComplaintContext";
import { useNavigate } from "react-router-dom";
import { CitizenModules } from "../components/CitizenModules";
import "../styles/global.css";

function Dashboard() {
  const { complaints } = useContext(ComplaintContext);
  const navigate = useNavigate();

  const departments = [
    { name: "Public Works", icon: "🏗️", sub: ["Road damage", "Potholes", "Footpath issue"] },
    { name: "Water & Sanitation", icon: "💧", sub: ["Water leakage", "Drainage overflow", "Sewage issue"] },
    { name: "Health & Safety", icon: "🏥", sub: ["Hospital service issue", "Mosquito breeding", "Public hygiene"] },
    { name: "Electricity", icon: "⚡", sub: ["Power cut", "Transformer fault", "Street light outage"] },
    { name: "Transport & Traffic", icon: "🚌", sub: ["Traffic signal failure", "Illegal parking", "Road blockage"] },
    { name: "Municipal Services", icon: "🏛️", sub: ["waste collection delay", "Encroachment", "Public park maintenance"] },
    { name: "Environment", icon: "🌱", sub: ["Air pollution", "Noise pollution", "Tree cutting"] },
    { name: "Law & Order", icon: "🚓", sub: ["Public disturbance", "Illegal activity", "Safety concern"] },
    { name: "Digital Services", icon: "💻", sub: ["Website issue", "Payment failure", "App malfunction"] }
  ];

  const getCount = (dept) => complaints.filter((c) => c.department === dept).length;

  return (
    <>
      <div className="citizen-header">
        <div>
          <h2>🌍 Citizen Community Portal</h2>
          <p>Collaborate for a better tomorrow.</p>
        </div>
      </div>

      <CitizenModules complaints={complaints} />

      <h3 style={{ margin: "20px 40px", color: "#8a6f5c" }}>🛠️ File a New Report</h3>
      <div className="dept-grid">
        {departments.map((d) => (
          <div
            key={d.name}
            className="dept-card"
            onClick={() => navigate("/add", { state: { department: d.name, categories: d.sub } })}
          >
            <div className="badge">{getCount(d.name)}</div>
            <div className="icon">{d.icon}</div>
            <h3>{d.name}</h3>
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;

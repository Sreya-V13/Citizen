import { useContext } from "react";
import { ComplaintContext } from "../context/ComplaintContext";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function Dashboard() {
  const { complaints } = useContext(ComplaintContext);
  const navigate = useNavigate();

  const departments = [
    {
      name: "Public Works",
      icon: "🏗️",
      sub: [
        "Road damage",
        "Potholes",
        "Footpath issue",
        "Street light",
        "Garbage dump",
        "Bridge issue",
        "Construction debris"
      ],
    },
    {
      name: "Water & Sanitation",
      icon: "💧",
      sub: [
        "Water leakage",
        "Drainage overflow",
        "Sewage issue",
        "Low water pressure",
        "No water supply",
        "Contaminated water"
      ],
    },
    {
      name: "Health & Safety",
      icon: "🏥",
      sub: [
        "Hospital service issue",
        "Mosquito breeding",
        "Food safety violation",
        "Public hygiene",
        "Emergency response",
        "Stray animals"
      ],
    },
    {
      name: "Electricity",
      icon: "⚡",
      sub: [
        "Power cut",
        "Transformer fault",
        "Loose wire",
        "Billing issue",
        "Street light outage",
        "Voltage fluctuation"
      ],
    },
    {
      name: "Transport & Traffic",
      icon: "🚌",
      sub: [
        "Traffic signal failure",
        "Bus delay",
        "Illegal parking",
        "Accident hotspot",
        "Road blockage",
        "Auto fare issue"
      ],
    },
    {
      name: "Municipal Services",
      icon: "🏛️",
      sub: [
        "Birth/death certificate",
        "Property tax issue",
        "Waste collection delay",
        "Encroachment",
        "Public park maintenance",
        "Street vendor complaint"
      ],
    },
    {
      name: "Environment",
      icon: "🌱",
      sub: [
        "Air pollution",
        "Noise pollution",
        "Tree cutting",
        "Water pollution",
        "Industrial pollution",
        "Open burning"
      ],
    },
    {
      name: "Law & Order",
      icon: "🚓",
      sub: [
        "Public disturbance",
        "Illegal activity",
        "Safety concern",
        "Harassment",
        "Crowd management",
        "Unauthorized construction"
      ],
    },
    {
      name: "Digital & Online Services",
      icon: "💻",
      sub: [
        "Website issue",
        "Payment failure",
        "App malfunction",
        "Service downtime",
        "Online fraud report"
      ],
    }
  ];

  const getCount = (dept) =>
    complaints.filter((c) => c.department === dept).length;

  return (
    <>
      {/* ⭐ HEADER */}
      <div className="citizen-header">
        <div>
          <h2>Citizen's Voice</h2>
          <p>Select department to file complaint</p>
        </div>

        <div
          className="status-bar"
          onClick={() => navigate("/track")}
        >
          📋 View Application Status
        </div>
      </div>

      {/* ⭐ GRID */}
      <div className="dept-grid">
        {departments.map((d) => (
          <div
            key={d.name}
            className="dept-card"
            onClick={() =>
              navigate("/add", {
                state: { department: d.name, categories: d.sub },
              })
            }
          >
            <div className="badge">{getCount(d.name)}</div>
            <div className="icon">{d.icon}</div>
            <h3>{d.name}</h3>
            <p>Click to file complaint</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;
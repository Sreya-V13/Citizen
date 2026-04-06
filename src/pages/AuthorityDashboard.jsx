import "../styles/authority.css";

function AuthorityDashboard() {
  const complaints = [
    {
      id: 1,
      category: "Road",
      description: "Huge pothole causing accidents",
      location: "KPHB, Hyderabad",
      priority: "High",
      status: "Pending"
    },
    {
      id: 2,
      category: "Garbage",
      description: "Garbage not collected",
      location: "Bachupally",
      priority: "Normal",
      status: "Pending"
    }
  ];

  return (
    <div className="authority-container">
      <h1>🏛 Authority Dashboard</h1>

      <div className="cards">
        <div className="card">📊 Total: {complaints.length}</div>
        <div className="card high">🔥 High Priority</div>
        <div className="card resolved">✅ Resolved</div>
      </div>

      <div className="complaints">
        {complaints.map((c) => (
          <div className="complaint-card" key={c.id}>
            <h3>{c.category}</h3>
            <p>{c.description}</p>
            <p className="location">📍 {c.location}</p>

            <span className={`badge ${c.priority.toLowerCase()}`}>
              {c.priority}
            </span>

            <div className="actions">
              <button className="assign">Assign Officer</button>
              <button className="approve">Approve</button>
              <button className="reject">Reject</button>
              <button className="resolve">Resolve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuthorityDashboard;
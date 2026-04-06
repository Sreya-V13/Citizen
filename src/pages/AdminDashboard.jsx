import { useState, useContext } from "react";
import { ComplaintContext } from "../context/ComplaintContext";
import { AuthorityModules } from "../components/AuthorityModules";
import "../styles/global.css";

function AdminDashboard() {
  const { complaints, addComplaint } = useContext(ComplaintContext);
  const [filter, setFilter] = useState("All");
  const [remarks, setRemarks] = useState({});

  const updateStatus = async (id, status) => {
    const remark = remarks[id] || "No specific remark provided.";
    const comp = complaints.find(c => c.$id === id);
    const timeline = JSON.parse(comp.timeline || "[]");
    
    // ⭐ Add detailed log entry
    const logEntry = {
      status,
      remark,
      timestamp: new Date().toISOString()
    };
    timeline.push(logEntry);

    await addComplaint({
      ...comp,
      status,
      timeline: JSON.stringify(timeline)
    });
    
    // Clear remark after update
    setRemarks(prev => ({ ...prev, [id]: "" }));
  };

  const filtered = complaints.filter(c => filter === "All" || c.status === filter);

  return (
    <div className="admin-bg" style={{ minHeight: "100vh" }}>
      <div className="citizen-header" style={{ background: "transparent", color: "white", padding: "20px 40px" }}>
        <div>
          <h2 style={{ color: "white" }}>🏛️ Authority Command Center</h2>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>Real-time civic management & audit transparency.</p>
        </div>
      </div>

      <AuthorityModules complaints={complaints} />

      <div className="module-card" style={{ margin: "20px 40px" }}>
        <h4>📋 Management Console</h4>
        <div className="filter-group" style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["All", "Pending", "Accepted", "In Progress", "Resolved"].map(f => (
            <button 
              key={f} 
              className={filter === f ? "primary" : "secondary"}
              onClick={() => setFilter(f)}
              style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", background: filter === f ? "#8a6f5c" : "#eee", color: filter === f ? "white" : "#666" }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="complaint-list">
          {filtered.map(c => {
            const history = JSON.parse(c.timeline || "[]");
            return (
              <div key={c.$id} className="feed-item" style={{ background: "#fdfaf7", padding: "24px", borderRadius: "25px", marginBottom: "20px", display: "block", border: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <h5 style={{ margin: "0", fontSize: "1.2rem" }}>{c.category} <small style={{ color: "#888", fontWeight: "400" }}>({c.department})</small></h5>
                  <span className={`badge ${c.status.toLowerCase().replace(' ', '-')}`} style={{ padding: "6px 15px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "700" }}>{c.status}</span>
                </div>
                
                <p style={{ fontSize: "1rem", color: "#444", marginBottom: "20px", lineHeight: "1.6" }}>{c.desc}</p>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                  <div style={{ padding: "15px", background: "white", borderRadius: "15px", fontSize: "0.9rem", border: "1px solid #f0f0f0" }}>
                    📍 <b>Location</b><br/>{c.location}
                  </div>
                  <div style={{ padding: "15px", background: "white", borderRadius: "15px", fontSize: "0.9rem", border: "1px solid #f0f0f0" }}>
                    📅 <b>Reported On</b><br/>{new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* ⭐ TRANSPARENCY TRACKER (4 STEPS) */}
                <div className="admin-status-tracker" style={{ margin: "20px 0", padding: "20px", background: "rgba(138, 111, 92, 0.05)", borderRadius: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                    <div className={`step-dot ${c.status === 'Pending' ? 'active' : ''}`}>1</div>
                    <div className={`step-line ${c.status !== 'Pending' ? 'active' : ''}`}></div>
                    <div className={`step-dot ${c.status === 'Accepted' ? 'active' : ''}`}>2</div>
                    <div className={`step-line ${['In Progress', 'Resolved'].includes(c.status) ? 'active' : ''}`}></div>
                    <div className={`step-dot ${c.status === 'In Progress' ? 'active' : ''}`}>3</div>
                    <div className={`step-line ${c.status === 'Resolved' ? 'active' : ''}`}></div>
                    <div className={`step-dot ${c.status === 'Resolved' ? 'active' : ''}`}>4</div>
                  </div>
                  
                  {/* ⭐ AUDIT LOG TIMELINE */}
                  <div className="audit-log" style={{ marginTop: "15px", borderLeft: "2px dashed #ddd", paddingLeft: "15px", marginLeft: "10px" }}>
                    <p style={{ fontSize: "0.85rem", color: "#8a6f5c", fontWeight: "700", marginBottom: "10px" }}>📜 Action History</p>
                    {history.length > 0 ? history.map((log, i) => (
                      <div key={i} style={{ marginBottom: "10px", fontSize: "0.8rem", color: "#666" }}>
                        <b>{log.status}</b>: "{log.remark}" <br/>
                        <small>{new Date(log.timestamp).toLocaleString()}</small>
                      </div>
                    )) : <p style={{ fontSize: "0.8rem", color: "#999" }}>No internal actions logged yet.</p>}
                  </div>
                </div>

                {c.image && (
                  <img src={c.image} alt="Evidence" style={{ width: "100%", maxHeight: "250px", objectFit: "cover", borderRadius: "20px", marginBottom: "20px" }} />
                )}

                {/* ⭐ ACTION CONSOLE */}
                <div className="action-console" style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
                  {c.status !== "Resolved" ? (
                    <>
                      <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "10px" }}>✍️ <b>Internal Note</b> (Mandatory for transparency)</p>
                      <textarea 
                        placeholder="Provide details about the current action..."
                        value={remarks[c.$id] || ""}
                        onChange={(e) => setRemarks({...remarks, [c.$id]: e.target.value})}
                        style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ddd", marginBottom: "15px", fontFamily: "inherit" }}
                        rows="2"
                      />
                      <div className="btn-group">
                        {c.status === "Pending" && (
                          <button 
                            disabled={!remarks[c.$id]} 
                            onClick={() => updateStatus(c.$id, "Accepted")} 
                            style={{ background: "#4361ee", color: "white", border: "none", opacity: remarks[c.$id] ? 1 : 0.6 }}
                          >
                            Acknowledge & Accept
                          </button>
                        )}
                        {c.status === "Accepted" && (
                          <button 
                            disabled={!remarks[c.$id]} 
                            onClick={() => updateStatus(c.$id, "In Progress")} 
                            style={{ background: "#f39c12", color: "white", border: "none", opacity: remarks[c.$id] ? 1 : 0.6 }}
                          >
                            Dispatch Ground Staff
                          </button>
                        )}
                        {c.status === "In Progress" && (
                          <button 
                            disabled={!remarks[c.$id]} 
                            onClick={() => updateStatus(c.$id, "Resolved")} 
                            style={{ background: "#27ae60", color: "white", border: "none", opacity: remarks[c.$id] ? 1 : 0.6 }}
                          >
                            Verifying & Mark Resolved
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: "15px", background: "#f0fdf4", color: "#166534", borderRadius: "15px", textAlign: "center", fontWeight: "700", border: "1px solid #bbf7d0" }}>
                      ✅ Issue resolved and archived.
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>✨</div>
              <p>Great job! No pending reports in this queue.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
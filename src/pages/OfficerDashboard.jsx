import { useState, useContext, useEffect } from "react";
import { ComplaintContext } from "../context/ComplaintContext";
import { AuthContext } from "../context/AuthContext";
import FleetMap from "../components/FleetMap";
import "../styles/global.css";

function OfficerDashboard() {
  const { complaints, updateStatus, advancePhase } = useContext(ComplaintContext);
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Assigned");
  const [selectedTask, setSelectedTask] = useState(null);
  const [evidenceFile, setEvidenceFile] = useState({}); // Stores file per task ID
  const [evidencePreview, setEvidencePreview] = useState({});

  const myTasks = complaints.filter(c => 
    (c.assignedOfficerId === user?.id || c.assignedOfficer === user?.name) &&
    (activeTab === "History" ? c.status === "Completed" : c.status !== "Completed")
  );

  const handleUpdate = async (id, status) => {
    const remark = `Status updated to ${status} by officer.`;
    const comp = complaints.find(c => c.$id === id || c.id === id);
    const timeline = JSON.parse(comp.timeline || "[]");
    
    timeline.push({
      status,
      remark,
      timestamp: new Date().toISOString()
    });

    await updateStatus(id, status, { timeline: JSON.stringify(timeline) });
  };

  const handleEvidenceChange = (taskId, file) => {
    if (!file) return;
    setEvidenceFile(prev => ({ ...prev, [taskId]: file }));
    setEvidencePreview(prev => ({ ...prev, [taskId]: URL.createObjectURL(file) }));
  };

  return (
    <div className="admin-bg" style={{ minHeight: "100vh", background: "var(--cv-bg)", color: "white", paddingBottom: "100px", position: "relative" }}>


      <div className="citizen-header" style={{ background: "transparent", color: "white", padding: "80px 60px 40px 60px", position: "relative" }}>
        <div style={{ position: "absolute", top: "40px", left: "60px", background: "rgba(67, 97, 238, 0.1)", padding: "10px 20px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "900", color: "var(--cv-accent)", border: "1px solid rgba(67, 97, 238, 0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
           <div className="pulse-dot"></div> READY TO WORK
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "25px", marginTop: "10px" }}>
          <h1 className="cv-text-gradient" style={{ fontSize: "5rem", fontWeight: "1000", margin: 0, letterSpacing: "-4px", lineHeight: "1" }}>
            Officer Work List
          </h1>
        </div>
      </div>

      <div className="dashboard-grid" style={{ padding: "0 var(--cv-page-padding)", display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px", alignItems: "start" }}>
        
        {/* ⭐ LEFT: TASK LIST */}
        <div className="cv-card hyper-glass" style={{ padding: "50px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "2rem", fontWeight: "950" }}>📋 My Tasks</h3>
              <p style={{ margin: "8px 0 0 0", color: "#94a3b8" }}>Issues assigned to you for repair.</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {["Assigned", "History"].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={{ background: activeTab === t ? "var(--cv-accent)" : "rgba(255,255,255,0.05)", border: "none", padding: "10px 25px", borderRadius: "12px", color: "white", fontWeight: "800", cursor: "pointer" }}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "20px" }}>
            {myTasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8", background: "rgba(255,255,255,0.02)", borderRadius: "20px" }}>
                 <p style={{ fontSize: "1.2rem", fontWeight: "600" }}>No tasks in this section.</p>
              </div>
            ) : (
              myTasks.map(t => (
                <div key={t.$id || t.id} className="cv-card bento-item" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <h4 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "900" }}>{t.category}</h4>
                    <span className={`cv-badge ${t.status.toLowerCase().replace(' ', '-')}`}>{t.status}</span>
                  </div>
                  <p style={{ margin: "0 0 20px 0", color: "#94a3b8" }}>{t.location}</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {t.status === "In Progress" && (
                      <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "15px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                        <p style={{ margin: "0 0 10px 0", fontSize: "0.7rem", color: "var(--cv-accent)", fontWeight: "900", letterSpacing: "1px" }}>📸 UPLOAD WORK EVIDENCE</p>
                        {evidencePreview[t.$id || t.id] ? (
                          <div style={{ position: "relative", marginBottom: "10px" }}>
                            <img src={evidencePreview[t.$id || t.id]} alt="Evidence" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "10px" }} />
                            <button onClick={() => {
                              setEvidenceFile(prev => ({ ...prev, [t.$id || t.id]: null }));
                              setEvidencePreview(prev => ({ ...prev, [t.$id || t.id]: null }));
                            }} style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.5)", border: "none", color: "white", borderRadius: "50%", width: "25px", height: "25px", cursor: "pointer" }}>✕</button>
                          </div>
                        ) : (
                          <label className="cv-upload-label" style={{ display: "block", textAlign: "center", padding: "20px", cursor: "pointer", background: "rgba(255,255,255,0.02)", borderRadius: "10px", transition: "0.3s" }}>
                            <span style={{ fontSize: "1.5rem" }}>📷</span>
                            <p style={{ margin: "5px 0 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>Take or upload photo of repair</p>
                            <input type="file" accept="image/*" onChange={(e) => handleEvidenceChange(t.$id || t.id, e.target.files[0])} style={{ display: "none" }} />
                          </label>
                        )}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                      {t.status !== "Completed" && t.status !== "Verification Pending" && (
                        <button 
                          onClick={() => {
                            if (t.status === "In Progress" && !evidenceFile[t.$id || t.id]) {
                              alert("Please upload an image of the repair first!");
                              return;
                            }
                            advancePhase(t.$id || t.id, t.status, evidenceFile[t.$id || t.id]);
                          }} 
                          style={{ 
                            background: "var(--cv-accent)", 
                            color: "white", 
                            border: "none", 
                            padding: "12px 30px", 
                            borderRadius: "12px", 
                            fontWeight: "900", 
                            cursor: "pointer",
                            flex: "1"
                          }}
                        >
                          {t.status === "Assigned" && "🚀 START DISPATCH"}
                          {t.status === "Dispatched" && "📍 ARRIVED ON-SITE"}
                          {t.status === "On-Site" && "🛠️ BEGIN REPAIR"}
                          {t.status === "In Progress" && "✅ MARK AS FIXED"}
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedTask(t)}
                        style={{ background: "rgba(255,255,255,0.05)", color: "white", border: "none", padding: "12px 30px", borderRadius: "12px", fontWeight: "900", cursor: "pointer", flex: "1" }}
                      >
                        DETAILS
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ⭐ RIGHT: TASK MAP */}
        <div style={{ position: "sticky", top: "40px" }}>
          <div className="cv-card hyper-glass" style={{ padding: "0", borderRadius: "30px", overflow: "hidden", height: "450px" }}>
             <div style={{ padding: "25px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: "900", letterSpacing: "1px" }}>📡 Nearby Task Map</h4>
             </div>
             <div style={{ height: "calc(100% - 70px)" }}>
                <FleetMap />
             </div>
          </div>

          <div className="cv-card bento-item" style={{ marginTop: "25px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--cv-success)", fontWeight: "900", letterSpacing: "1px" }}>OFFICER HEALTH</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                 <span style={{ fontWeight: "700" }}>STABLE</span>
                 <span style={{ fontWeight: "900", color: "var(--cv-success)" }}>GOOD</span>
              </div>
          </div>
        </div>
      </div>

      {/* ⭐ TASK DETAIL MODAL */}
      {selectedTask && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", zIndex: 5000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
           <div className="cv-card hyper-glass" style={{ maxWidth: "600px", width: "100%", padding: "50px", position: "relative" }}>
              <button 
                onClick={() => setSelectedTask(null)}
                style={{ position: "absolute", top: "30px", right: "30px", background: "transparent", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer" }}
              >✕</button>
              
              <span className={`cv-badge ${selectedTask.status.toLowerCase().replace(' ', '-')}`}>{selectedTask.status}</span>
              <h2 style={{ margin: "15px 0", fontSize: "2.5rem", fontWeight: "950" }}>{selectedTask.category}</h2>
              
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "25px", borderRadius: "20px", margin: "30px 0" }}>
                 <p style={{ margin: "0 0 10px 0", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "900", letterSpacing: "2px" }}>📍 INCIDENT LOCATION</p>
                 <p style={{ margin: 0, fontSize: "1.1rem" }}>{selectedTask.location}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                 <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "20px" }}>
                    <p style={{ margin: "0 0 5px 0", fontSize: "0.7rem", color: "#94a3b8", fontWeight: "800" }}>DEPARTMENT</p>
                    <p style={{ margin: 0, fontWeight: "700" }}>{selectedTask.department}</p>
                 </div>
                 <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "20px" }}>
                    <p style={{ margin: "0 0 5px 0", fontSize: "0.7rem", color: "#94a3b8", fontWeight: "800" }}>TICKET ID</p>
                    <p style={{ margin: 0, fontWeight: "700" }}>{selectedTask.$id?.slice(-8).toUpperCase()}</p>
                 </div>
              </div>

              <div style={{ marginTop: "40px" }}>
                 <h4 style={{ fontSize: "1.1rem", marginBottom: "15px" }}>Task Notes</h4>
                 <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>
                    Work required: Verify location issues, execute repair protocol, and submit evidence.
                 </p>
              </div>

              <button 
                onClick={() => setSelectedTask(null)}
                style={{ width: "100%", marginTop: "40px", padding: "18px", background: "white", color: "black", borderRadius: "15px", border: "none", fontWeight: "900", cursor: "pointer", fontSize: "1rem" }}
              >
                 CLOSE DETAILS
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

export default OfficerDashboard;

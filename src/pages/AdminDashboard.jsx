import { useState, useContext, useEffect, useMemo } from "react";
import { ComplaintContext } from "../context/ComplaintContext";
import { AuthContext } from "../context/AuthContext";
import { AuthorityModules } from "../components/AuthorityModules";
import FleetMap from "../components/FleetMap";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup 
} from "react-leaflet";
import L from "leaflet";
import "../styles/global.css";

function AdminDashboard() {
  const { complaints, updateStatus, verifyResolution } = useContext(ComplaintContext);
  const { mockOfficers } = useContext(AuthContext);
  const [filter, setFilter] = useState("All");
  const [selectedOfficer, setSelectedOfficer] = useState({});
  const [analyzing, setAnalyzing] = useState(true);
  const [viewingEvidence, setViewingEvidence] = useState(null); // URL of image to view

  // ⭐ SIMULATE AI COGNITION
  useEffect(() => {
    setAnalyzing(true);
    const timer = setTimeout(() => setAnalyzing(false), 2000);
    return () => clearTimeout(timer);
  }, [complaints.length]);

  const handleDispatch = async (id, officerOverride = null) => {
    const officerId = officerOverride || selectedOfficer[id];
    const officer = mockOfficers.find(o => o.id === officerId);
    if (!officer) {
      alert("Please select an officer first!");
      return;
    }

    const remark = `Task assigned to ${officer.name} (${officer.dept})`;
    const comp = complaints.find(c => c.$id === id || c.id === id);
    const timeline = JSON.parse(comp.timeline || "[]");
    
    timeline.push({
      status: "Assigned",
      remark,
      timestamp: new Date().toISOString()
    });

    await updateStatus(id, "Assigned", { 
      assignedOfficer: officer.name,
      assignedOfficerId: officer.id,
      assignedDept: officer.dept,
      officerLat: officer.lat,
      officerLng: officer.lng,
      timeline: JSON.stringify(timeline)
    });
    alert(`Success! Task assigned to ${officer.name}.`);
  };

  const filtered = complaints
    .filter(c => {
      if (filter === "All") return true;
      if (filter === "Verification") return c.status === "Verification Pending";
      if (filter === "Escalated") return c.status === "Escalated";
      return c.status === filter;
    })
    .sort((a, b) => {
      if (a.status === "Escalated" && b.status !== "Escalated") return -1;
      if (a.status !== "Escalated" && b.status === "Escalated") return 1;
      return 0;
    });

  // ⭐ DYNAMIC AI LOGIC (SMART ASSIGN)
  const smartSuggestion = useMemo(() => {
    const target = complaints.find(c => c.status === "Escalated" || c.status === "Pending");
    if (!target || !target.lat) return null;

    // Find nearest officer from same department
    let nearest = null;
    let minDist = Infinity;

    mockOfficers.forEach(off => {
      if (off.dept === target.department || off.dept === "Public Works") {
        const dist = Math.sqrt(Math.pow(off.lat - target.lat, 2) + Math.pow(off.lng - target.lng, 2));
        if (dist < minDist) {
          minDist = dist;
          nearest = off;
        }
      }
    });

    return { 
      complaint: target, 
      officer: nearest, 
      dist: (minDist * 111).toFixed(1),
      prob: (90 + Math.random() * 8).toFixed(0) 
    };
  }, [complaints, mockOfficers]);

  return (
    <div className="admin-bg" style={{ minHeight: "100vh", background: "var(--cv-bg)", color: "white", paddingBottom: "100px", position: "relative" }}>


      <style>{`
        @keyframes admin-pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .admin-escalated {
          animation: admin-pulse-red 2s infinite;
          border: 1px solid #ef4444 !important;
          background: rgba(239, 68, 68, 0.05) !important;
        }
        @keyframes aiPulse {
          0% { opacity: 0.5; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="citizen-header" style={{ background: "transparent", color: "white", padding: "80px 60px 40px 60px", position: "relative" }}>
        <div style={{ position: "absolute", top: "40px", left: "60px", background: "rgba(67, 97, 238, 0.1)", padding: "10px 20px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "900", color: "var(--cv-accent)", border: "1px solid rgba(67, 97, 238, 0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
           <div className="pulse-dot" style={{ background: '#ef4444' }}></div> ADMIN ACCESS ACTIVE
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "25px", marginTop: "10px" }}>
          <h1 className="cv-text-gradient" style={{ fontSize: "5rem", fontWeight: "1000", margin: 0, letterSpacing: "-4px", lineHeight: "1" }}>
            Admin Control
          </h1>
        </div>
      </div>

      <div style={{ padding: "0 var(--cv-page-padding)", marginBottom: "40px" }}>
         <FleetMap />
      </div>

      <div style={{ padding: "0 var(--cv-page-padding)", marginBottom: "60px" }}>
         <AuthorityModules complaints={complaints} />
      </div>

      <div className="dashboard-grid" style={{ padding: "0 var(--cv-page-padding)", display: "grid", gridTemplateColumns: "1.2fr 400px", gap: "40px", alignItems: "start" }}>
        
        <div className="cv-card hyper-glass" style={{ padding: "50px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "2.2rem", fontWeight: "950", letterSpacing: "-1px" }}>📋 Task List</h3>
              <p style={{ margin: "8px 0 0 0", color: "#94a3b8", fontSize: "0.95rem" }}>Review and assign city issues.</p>
            </div>
            <div className="filter-group" style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,0.02)", padding: "8px", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.08)" }}>
              {["All", "Escalated", "Pending", "Verification", "Completed"].map(f => (
                <button 
                  key={f} 
                  className={`cv-filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                  style={{ 
                    background: filter === f ? (f === 'Escalated' ? '#ef4444' : "var(--cv-accent)") : "transparent",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: "700"
                  }}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-list" style={{ display: "grid", gap: "25px" }}>
            {filtered.map(c => {
              const isEscalated = c.status === "Escalated";
              return (
                <div key={c.$id || c.id} className={`cv-card bento-item ${isEscalated ? 'admin-escalated' : ''}`} style={{ background: "rgba(255,255,255,0.02)", transition: "all 0.3s ease" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "25px" }}>
                    <div>
                      <h4 style={{ margin: "0 0 5px 0", fontSize: "1.4rem", fontWeight: "900" }}>{c.category}</h4>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Ticket: {c.$id?.slice(-6).toUpperCase()}</span>
                        <div style={{ width: "4px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "50%" }}></div>
                        <span style={{ color: "var(--cv-accent)", fontSize: "0.85rem", fontWeight: "700" }}>{c.department?.toUpperCase()}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <span className={`cv-badge ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span>
                      {c.status !== "Pending" && c.status !== "Completed" && (
                        <div style={{ display: "flex", gap: "5px" }}>
                           {["Dispatched", "On-Site", "In Progress"].map((p, idx) => {
                             const isActive = c.status === p;
                             const isPast = (p === "Dispatched" && (c.status === "On-Site" || c.status === "In Progress")) || 
                                          (p === "On-Site" && c.status === "In Progress");
                             return (
                               <div key={p} style={{ width: "20px", height: "4px", background: isActive ? "var(--cv-accent)" : (isPast ? "var(--cv-success)" : "rgba(255,255,255,0.1)"), borderRadius: "2px" }}></div>
                             );
                           })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.05)" }}>
                       <p style={{ margin: "0 0 10px 0", fontSize: "0.7rem", color: "#94a3b8", fontWeight: "800", letterSpacing: "1px" }}>📍 LOCATION</p>
                       <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem" }}>{c.location}</p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.05)" }}>
                       <p style={{ margin: "0 0 10px 0", fontSize: "0.7rem", color: "#94a3b8", fontWeight: "800", letterSpacing: "1px" }}>👤 OFFICER IN CHARGE</p>
                       <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem", color: c.assignedOfficer ? "white" : "#ef4444" }}>
                          {c.assignedOfficer || "WAITING"}
                       </p>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "25px" }}>
                    {(c.status === "Pending" || c.status === "Escalated") && (
                      <div style={{ display: "flex", gap: "15px" }}>
                        <select 
                          value={selectedOfficer[c.$id] || ""} 
                          onChange={(e) => setSelectedOfficer({...selectedOfficer, [c.$id]: e.target.value})}
                          style={{ flex: 1, height: "55px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", padding: "0 20px", fontWeight: "600" }}
                        >
                          <option value="">Select Officer to help...</option>
                          {mockOfficers.map(o => <option key={o.id} value={o.id}>{o.name} ({o.dept})</option>)}
                        </select>
                        <button 
                          onClick={() => handleDispatch(c.$id)} 
                          style={{ background: "var(--cv-accent)", color: "white", border: "none", borderRadius: "15px", padding: "0 35px", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 20px rgba(67, 97, 238, 0.2)" }}
                        >
                          ASSIGN
                        </button>
                      </div>
                    )}

                    {c.status === "Verification Pending" && (
                      <div className="hyper-glass" style={{ padding: "25px", borderRadius: "18px", border: "1px solid var(--cv-success)", background: "rgba(16, 185, 129, 0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                          <div>
                            <h5 style={{ margin: 0, color: "var(--cv-success)", fontSize: "1.1rem", fontWeight: "900" }}>🛡️ CHECK REPAIR</h5>
                            <p style={{ margin: "5px 0 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>Review evidence photo below.</p>
                          </div>
                          <button onClick={() => verifyResolution(c.$id, true)} style={{ background: "var(--cv-success)", color: "white", padding: "12px 35px", borderRadius: "12px", border: "none", fontWeight: "900", cursor: "pointer" }}>APPROVE</button>
                        </div>
                        
                        {c.resolutionImage ? (
                          <div onClick={() => setViewingEvidence(c.resolutionImage)} style={{ cursor: "pointer", position: "relative", overflow: "hidden", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <img src={c.resolutionImage} alt="Work Evidence" style={{ width: "100%", height: "200px", objectFit: "cover", transition: "0.3s" }} />
                            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "0.3s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                               <span style={{ fontWeight: "900", color: "white" }}>VIEW FULL EVIDENCE</span>
                            </div>
                          </div>
                        ) : (
                          <div style={{ padding: "20px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                             <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>No photo evidence provided.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ⭐ RIGHT: ASSIGN HELPER */}
        <div style={{ position: "sticky", top: "40px" }}>
          <div className="cv-card hyper-glass" style={{ padding: "40px", borderRadius: "30px", border: "1px solid rgba(67,97,238,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
               <div style={{ width: "45px", height: "45px", borderRadius: "12px", background: "var(--cv-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🤖</div>
               <div>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "900", letterSpacing: "1px" }}>Assign Helper</h4>
                  <p style={{ margin: 0, fontSize: "0.7rem", color: "#94a3b8", fontWeight: "700" }}>SMART DISPATCH</p>
               </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
              {analyzing ? (
                 <div style={{ textAlign: "center", padding: "40px", animation: "aiPulse 1s infinite alternate" }}>
                    <div style={{ width: "40px", height: "40px", border: "3px solid var(--cv-accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 15px auto" }}></div>
                    <p style={{ fontSize: "0.8rem", color: "var(--cv-accent)", fontWeight: "900", letterSpacing: "2px" }}>CHECKING OFFICERS...</p>
                 </div>
              ) : (
                <>
                  <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                     <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8", fontWeight: "800" }}>OFFICER STATUS</p>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                        <span style={{ fontSize: "1.4rem", fontWeight: "900" }}>GOOD</span>
                        <span style={{ color: "var(--cv-success)", fontWeight: "900" }}>{smartSuggestion ? "94%" : "100%"}</span>
                     </div>
                     <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", marginTop: "10px" }}>
                        <div style={{ width: "94%", height: "100%", background: "var(--cv-success)", borderRadius: "2px" }}></div>
                     </div>
                  </div>

                  {smartSuggestion && smartSuggestion.officer ? (
                    <div className="bento-item hyper-glass" style={{ padding: "25px", background: "rgba(67,97,238,0.1)", border: "1px solid rgba(67,97,238,0.2)" }}>
                       <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: "900", color: "var(--cv-accent)" }}>⚡ SUGGESTION</p>
                       <p style={{ margin: "15px 0", fontSize: "0.9rem", color: "white", lineHeight: "1.5", fontWeight: "500" }}>
                         Officer <b>{smartSuggestion.officer.name}</b> is <b>{smartSuggestion.dist}km</b> away from ticket <b>#{smartSuggestion.complaint.$id?.slice(-4).toUpperCase()}</b>. Chance of success: <b>{smartSuggestion.prob}%</b>.
                       </p>
                       <button 
                         onClick={() => handleDispatch(smartSuggestion.complaint.$id, smartSuggestion.officer.id)}
                         style={{ width: "100%", padding: "12px", background: "var(--cv-accent)", border: "none", borderRadius: "12px", color: "white", fontWeight: "900", cursor: "pointer", fontSize: "0.75rem" }}
                       >
                         QUICK DISPATCH
                       </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontStyle: "italic", fontSize: "0.8rem" }}>
                       Everything is clear or all officers are busy.
                    </div>
                  )}
                </>
              )}

              <div style={{ padding: "15px", textAlign: "center" }}>
                 <p style={{ margin: 0, fontSize: "0.7rem", color: "#94a3b8" }}>Real-time updates provided by Smart-City System v3.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ EVIDENCE VIEWER MODAL */}
      {viewingEvidence && (
        <div 
          onClick={() => setViewingEvidence(null)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.9)", zIndex: 6000, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}
        >
           <div className="cv-card hyper-glass" style={{ maxWidth: "900px", width: "100%", padding: "10px", position: "relative" }}>
              <img src={viewingEvidence} alt="High Res Evidence" style={{ width: "100%", borderRadius: "15px", display: "block" }} />
              <button 
                onClick={() => setViewingEvidence(null)}
                style={{ position: "absolute", top: "-20px", right: "-20px", background: "var(--cv-accent)", border: "none", color: "white", borderRadius: "50%", width: "40px", height: "40px", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }}
              >✕</button>
           </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
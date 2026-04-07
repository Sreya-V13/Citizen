import { useContext, useState } from "react";
import { ComplaintContext } from "../context/ComplaintContext";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup 
} from "react-leaflet";
import L from "leaflet";
import "../styles/global.css";

function TrackComplaint() {
  const { complaints, escalateComplaint } = useContext(ComplaintContext);
  const [search, setSearch] = useState("");

  const SLA_DAYS = 3;
  const isSLAExceeded = (createdAt) => {
    if (!createdAt) return false;
    const diff = Date.now() - new Date(createdAt).getTime();
    return diff > SLA_DAYS * 24 * 60 * 60 * 1000;
  };

  const filtered = complaints.filter((c) =>
    c.category?.toLowerCase().includes(search.toLowerCase()) ||
    c.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="track-page" style={{ background: "var(--cv-bg)", minHeight: "100vh", color: "white" }}>
      <style>{`
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .escalated-pulse {
          animation: pulse-red 2s infinite;
          border: 1px solid #ef4444 !important;
        }
      `}</style>
      
      <div className="citizen-header" style={{ background: "transparent", padding: "80px 60px 40px 60px", position: "relative" }}>
        <div style={{ position: "absolute", top: "40px", left: "60px", background: "rgba(16, 185, 129, 0.1)", padding: "6px 15px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "900", color: "var(--cv-success)", border: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
           <div className="pulse-dot"></div> TELEMETRY UPLINK STABLE
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
          <div>
            <h1 className="cv-text-gradient" style={{ fontSize: "3.5rem", fontWeight: "900", margin: 0 }}>🗺️ Tracking Hub</h1>
            <p style={{ color: "#94a3b8", fontSize: "1.2rem", marginTop: "10px" }}>Real-time geographic accountability and resolution auditing.</p>
          </div>
          <div style={{ position: "relative" }}>
            <input
              placeholder="Filter by Unit or Sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "16px 24px 16px 50px", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "white", width: "350px", fontSize: "0.95rem" }}
            />
            <span style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}>🔍</span>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "100px", color: "#94a3b8" }}>
           <p style={{ fontSize: "1.1rem" }}>📡 All systems clear. No active tracking required.</p>
        </div>
      )}

      <div className="track-list" style={{ padding: "0 60px" }}>
        {filtered.map((c) => {
          const timeline = typeof c.timeline === 'string' ? JSON.parse(c.timeline) : (c.timeline || []);
          const canEscalate = isSLAExceeded(c.createdAt || c.$createdAt) && c.status !== "Completed" && c.status !== "Escalated";
          
          return (
            <div key={c.$id || c.id} className={`cv-card glass-panel ${c.status === 'Escalated' ? 'escalated-pulse' : ''}`} style={{ marginBottom: "50px", padding: "40px", transition: "0.4s" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "15px" }}>
                    {c.category}
                    {c.status === 'Escalated' && <span style={{ fontSize: "0.8rem", background: "#ef4444", color: "white", padding: "4px 12px", borderRadius: "20px", fontWeight: "900" }}>🚨 URGENT: ESCALATED</span>}
                  </h3>
                  <p style={{ margin: "8px 0 0 0", color: "#94a3b8", fontWeight: "600", fontSize: "1rem" }}>{c.department} Department</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                  <span className={`cv-badge ${c.status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: "0.9rem", padding: "8px 24px", fontWeight: "900", letterSpacing: "1px" }}>
                    {c.status}
                  </span>
                  {canEscalate && (
                    <div style={{ textAlign: "right", animation: "slideInRight 0.5s ease" }}>
                      <p style={{ margin: "0 0 10px 0", fontSize: "0.75rem", color: "#ef4444", fontWeight: "900", letterSpacing: "1px" }}>🚨 SLA BREACH DETECTED</p>
                      <button 
                        onClick={() => escalateComplaint(c.$id || c.id)}
                        className="cv-filter-btn"
                        style={{ background: "#ef4444", color: "white", boxShadow: "0 0 30px rgba(239, 68, 68, 0.4)", height: "48px", padding: "0 30px", fontWeight: "900", fontSize: "0.9rem" }}
                      >
                        🔥 ESCALATE TO AUTHORITY
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "50px" }}>
                {/* ⭐ L-COL: DETAILS & TIMELINE */}
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p style={{ margin: "0 0 12px 0", color: "#94a3b8", fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>🚔 UNIT DISPATCH</p>
                      {c.assignedOfficer ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                           <div style={{ width: "50px", height: "50px", background: "rgba(67, 97, 238, 0.15)", border: "1px solid var(--cv-accent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>👮</div>
                           <div>
                             <p style={{ margin: 0, fontWeight: "900", fontSize: "1.2rem" }}>{c.assignedOfficer}</p>
                             <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--cv-accent)", fontWeight: "700" }}>ACTIVE FIELD AGENT</p>
                           </div>
                        </div>
                      ) : (
                        <p style={{ margin: 0, fontStyle: "italic", color: "#64748b", fontWeight: "600" }}>Establishing Unit Link...</p>
                      )}
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p style={{ margin: "0 0 12px 0", color: "#94a3b8", fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>📍 INCIDENT COORDS</p>
                      <p style={{ margin: 0, fontSize: "1rem", fontWeight: "700", lineHeight: "1.5" }}>{c.location || "GEOLOCK: PENDING"}</p>
                    </div>
                  </div>

                  <div style={{ borderLeft: "2px solid rgba(255,255,255,0.05)", paddingLeft: "30px", marginLeft: "12px" }}>
                    <p style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "800", marginBottom: "25px", textTransform: 'uppercase', letterSpacing: "1px" }}>📜 AUDIT TRAIL</p>
                    {timeline.length > 0 ? timeline.map((t, i) => (
                      <div key={i} style={{ position: "relative", marginBottom: "30px" }}>
                        <div style={{ position: "absolute", left: "-37px", top: "4px", width: "12px", height: "12px", borderRadius: "50%", background: t.status === "Completed" ? "var(--cv-success)" : (t.status === 'Escalated' ? '#ef4444' : "var(--cv-accent)"), border: "2px solid var(--cv-bg)", boxShadow: t.status === 'Escalated' ? "0 0 10px #ef4444" : "none" }}></div>
                        <p style={{ margin: 0, fontWeight: "800", fontSize: "1rem", color: t.status === 'Escalated' ? '#ef4444' : "white" }}>{t.status}</p>
                        <p style={{ margin: "4px 0", fontSize: "0.9rem", color: "#94a3b8", lineHeight: "1.5" }}>{t.remark}</p>
                        <small style={{ opacity: 0.4, fontSize: "0.8rem" }}>{new Date(t.timestamp).toLocaleString()}</small>
                      </div>
                    )) : (
                      <p style={{ color: "#475569", fontStyle: "italic" }}>Establishing connection...</p>
                    )}
                  </div>
                </div>

                {/* ⭐ R-COL: INTERACTIVE MAP */}
                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                  {c.lat && (
                    <div style={{ height: "400px", borderRadius: "30px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}>
                      <MapContainer center={[c.lat, c.lng]} zoom={15} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        
                        {/* INCIDENT PIN */}
                        <Marker position={[c.lat, c.lng]}>
                          <Popup style={{ borderRadius: "15px" }}>
                            <div style={{ textAlign: "center" }}>
                              <b style={{ color: "#ef4444" }}>🚩 INCIDENT SITE</b><br/>
                              {c.category}
                            </div>
                          </Popup>
                        </Marker>

                        {/* OFFICER PIN (MOCK LIVE) */}
                        {c.assignedOfficer && (
                           <Marker 
                             position={[c.officerLat || (c.lat + 0.003), c.officerLng || (c.lng - 0.002)]} 
                             icon={L.divIcon({ 
                               html: `<div style="font-size: 2.5rem; filter: drop-shadow(0 0 10px rgba(67, 97, 238, 0.4)); transform: translate(-10px, -20px)">🚔</div>`, 
                               className: 'officer-marker', 
                               iconSize: [40, 40] 
                             })}
                           >
                             <Popup>
                                <div style={{ textAlign: "center" }}>
                                  <b style={{ color: "var(--cv-accent)" }}>👮 {c.assignedOfficer}</b><br/>
                                  Patroling / En Route
                                </div>
                             </Popup>
                           </Marker>
                        )}
                      </MapContainer>
                    </div>
                  )}
                  {c.image && (
                    <div style={{ borderRadius: "30px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", filter: "grayscale(20%)" }}>
                      <img src={c.image} alt="Evidence" style={{ width: "100%", height: "220px", objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrackComplaint;
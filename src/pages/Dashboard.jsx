import { useContext } from "react";
import { ComplaintContext } from "../context/ComplaintContext";
import { useNavigate } from "react-router-dom";
import { CitizenModules } from "../components/CitizenModules";
import "../styles/global.css";

function Dashboard() {
  const { complaints } = useContext(ComplaintContext);
  const navigate = useNavigate();

  const departments = [
    { id: "pw", name: "Public Works", icon: "🏗️", sub: ["Road damage", "Potholes", "Footpath issue"] },
    { id: "ws", name: "Water & Sanitation", icon: "💧", sub: ["Water leakage", "Drainage overflow", "Sewage issue"] },
    { id: "hs", name: "Health & Safety", icon: "🏥", sub: ["Hospital service issue", "Mosquito breeding", "Public hygiene"] },
    { id: "ele", name: "Electricity", icon: "⚡", sub: ["Power cut", "Transformer fault", "Street light outage"] },
    { id: "tra", name: "Transport & Traffic", icon: "🚌", sub: ["Traffic signal failure", "Illegal parking", "Road blockage"] },
    { id: "mun", name: "Municipal Services", icon: "🏛️", sub: ["waste collection delay", "Encroachment", "Public park maintenance"] },
    { id: "env", name: "Environment", icon: "🌱", sub: ["Air pollution", "Noise pollution", "Tree cutting"] },
    { id: "law", name: "Law & Order", icon: "🚓", sub: ["Public disturbance", "Illegal activity", "Safety concern"] },
    { id: "dig", name: "Digital Services", icon: "💻", sub: ["Website issue", "Payment failure", "App malfunction"] }
  ];

  const getCount = (dept) => complaints.filter((c) => c.department === dept).length;
  const resolvedCount = complaints.filter(c => c.status === 'Completed').length;
  const shaperScore = 850 + (resolvedCount * 50);

  return (
    <div style={{ background: "var(--cv-bg)", minHeight: "100vh", color: "white", paddingBottom: "100px", position: "relative" }}>
      {/* ⭐ BACKGROUND DECORATION */}


      <div className="citizen-header" style={{ padding: "80px 60px 40px 60px", background: "transparent", position: "relative" }}>
        <div style={{ position: "absolute", top: "40px", left: "60px", background: "rgba(16, 185, 129, 0.1)", padding: "10px 20px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "900", color: "var(--cv-success)", border: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
           <div className="pulse-dot"></div> SECURE CONNECTION ESTABLISHED
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "25px", marginTop: "10px" }}>
          <div className="civic-orb" style={{ width: "100px", height: "100px", borderRadius: "50%", background: "var(--cv-accent)", position: "relative", border: "2px solid rgba(255,255,255,0.2)" }}>
             <div style={{ position: "absolute", top: "20%", left: "20%", width: "20px", height: "20px", background: "white", borderRadius: "50%", filter: "blur(5px)", opacity: 0.6 }}></div>
          </div>
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--cv-accent)", letterSpacing: "2px" }}>ACTIVE CITIZEN</span>
            <h1 className="cv-text-gradient" style={{ fontSize: "4.5rem", fontWeight: "1000", margin: 0, letterSpacing: "-3px", lineHeight: "1" }}>
              My Dashboard
            </h1>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 60px" }}>
        {/* ⭐ STATS GRID */}
        <div className="glass-bento" style={{ marginBottom: "60px" }}>
           <div className="bento-item">
              <p style={{ margin: 0, fontSize: "0.7rem", color: "#94a3b8", fontWeight: "800", letterSpacing: "1px" }}>TOTAL POINTS</p>
              <h2 style={{ fontSize: "3rem", margin: "10px 0", fontWeight: "950", color: "var(--cv-success)" }}>{shaperScore}</h2>
              <div style={{ height: "4px", background: "var(--cv-success)", borderRadius: "2px", width: "70%" }}></div>
           </div>
           <div className="bento-item">
              <p style={{ margin: 0, fontSize: "0.7rem", color: "#94a3b8", fontWeight: "800", letterSpacing: "1px" }}>ISSUES SOLVED</p>
              <h2 style={{ fontSize: "3rem", margin: "10px 0", fontWeight: "950" }}>{resolvedCount}</h2>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--cv-success)" }}>Top 3% of Region</p>
           </div>
           <div className="bento-item" style={{ background: "rgba(67, 97, 238, 0.1)", borderColor: "rgba(67, 97, 238, 0.3)" }}>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--cv-accent)", fontWeight: "900", letterSpacing: "1px" }}>REWARD LEVEL</p>
              <h2 style={{ fontSize: "1.8rem", margin: "10px 0", fontWeight: "900" }}>🛡️ EXPERT CITIZEN</h2>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>Master of Hyderabad</p>
           </div>
        </div>

        {/* ⭐ BADGES & REWARDS */}
        <section id="hall-of-fame" style={{ marginBottom: "80px" }}>
           <div className="cv-card hyper-glass" style={{ padding: "60px", borderRadius: "40px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ textAlign: "center", marginBottom: "50px" }}>
                <h3 style={{ fontSize: "2.5rem", fontWeight: "950", margin: 0 }}>🏆 My Badges & Rewards</h3>
                <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginTop: "10px" }}>Awards for helping make Hyderabad a better place.</p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "60px", flexWrap: "wrap" }}>
                 {[
                   { icon: "🛡️", label: "Sector Defender", level: "MAX" },
                   { icon: "💧", label: "Water Guardian", level: "8" },
                   { icon: "⚡", label: "Power Specialist", level: "12" },
                   { icon: "🚓", label: "Civic Hero", level: "5" }
                 ].map((badge, i) => (
                   <div key={i} style={{ textAlign: "center" }}>
                      <div className="relic-pedestal" style={{ 
                        width: "160px", 
                        height: "160px", 
                        background: "rgba(255,255,255,0.02)", 
                        borderRadius: "30px", 
                        border: "1px solid rgba(255,255,255,0.08)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        position: "relative", 
                        marginBottom: "20px",
                        overflow: "hidden"
                      }}>
                         <div style={{ fontSize: "4.5rem", animation: "relicSpin 6s linear infinite", filter: "drop-shadow(0 0 20px rgba(67, 97, 238, 0.4))" }}>{badge.icon}</div>
                         <div style={{ position: "absolute", bottom: "-15px", width: "100%", height: "20px", background: "var(--cv-accent)", filter: "blur(20px)", opacity: 0.4 }}></div>
                      </div>
                      <h5 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800" }}>{badge.label}</h5>
                      <p style={{ margin: "5px 0 0 0", color: "var(--cv-accent)", fontSize: "0.85rem", fontWeight: "900" }}>LVL {badge.level}</p>
                   </div>
                 ))}
              </div>
           </div>

           <style>{`
              @keyframes relicSpin {
                from { transform: rotateY(0deg); }
                to { transform: rotateY(360deg); }
              }
              .relic-pedestal:hover {
                background: rgba(67, 97, 238, 0.1) !important;
                border-color: var(--cv-accent) !important;
                transform: translateY(-10px);
                transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              }
           `}</style>
        </section>

        <CitizenModules complaints={complaints} />

        {/* ⭐ SERVICE DIRECTORY */}
        <div style={{ marginTop: "100px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "50px" }}>
            <div>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "950", margin: 0 }}>🏙️ City Departments</h2>
              <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginTop: "10px" }}>Send your reports directly to city units.</p>
            </div>
            <button onClick={() => navigate("/add")} style={{ background: "var(--cv-accent)", color: "white", padding: "18px 40px", borderRadius: "20px", border: "none", fontWeight: "900", cursor: "pointer", boxShadow: "0 15px 30px rgba(67, 97, 238, 0.3)", fontSize: "1rem" }}>
               ⚡ NEW REPORT
            </button>
          </div>
          
          <div className="dept-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "35px" }}>
            {departments.map((d) => (
              <div
                key={d.id}
                className="cv-card bento-item"
                onClick={() => navigate("/add", { state: { department: d.name, categories: d.sub } })}
                style={{ 
                  cursor: "pointer", 
                  padding: "45px",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                }}
              >
                <div style={{ position: "absolute", top: "30px", right: "30px" }} className={`cv-badge ${getCount(d.name) > 0 ? 'accepted' : 'pending'}`}>
                  {getCount(d.name) > 0 ? `${getCount(d.name)} ACTIVE` : "0 ACTIVE"}
                </div>
                <div style={{ fontSize: "4rem", marginBottom: "30px", filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.3))" }}>{d.icon}</div>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "1.6rem", fontWeight: "900" }}>{d.name}</h3>
                <p style={{ fontSize: "1rem", color: "#94a3b8", lineHeight: "1.6", margin: 0 }}>Start a report for {d.sub[0]} and {d.sub[1]}.</p>
                
                <div className="hover-arrow" style={{ position: "absolute", bottom: "35px", right: "35px", opacity: 0, transition: "0.3s" }}>
                   <span style={{ fontSize: "2rem" }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

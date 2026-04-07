import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ComplaintContext } from "../context/ComplaintContext";
import "../styles/global.css";

function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const { complaints } = useContext(ComplaintContext);
  const navigate = useNavigate();

  const [showNotif, setShowNotif] = useState(false);

  const isCitizen = user?.role === "citizen";
  const isAdmin = user?.role === "admin" || user?.role === "authority";
  const isOfficer = user?.role === "officer";

  // Role-specific unread count
  const unread = complaints.filter(c => {
    if (isAdmin) return c.status === "Pending" || c.status === "Escalated";
    if (isOfficer) return c.status === "Assigned" && (c.assignedOfficerId === user?.id || (user?.email && c.assignedOfficerId?.includes(user.email.split('@')[0])));
    if (isCitizen) return c.status !== "Pending"; 
    return false;
  }).length;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="nav" style={{ background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 1000 }}>
      {/* LOGO */}
      <div
        className="logo cv-text-gradient"
        onClick={() => {
          if (!user) navigate("/");
          else if (isAdmin) navigate("/admin");
          else if (isOfficer) navigate("/officer");
          else navigate("/dashboard");
        }}
        style={{ cursor: "pointer", fontSize: "1.8rem", fontWeight: "900", letterSpacing: "-1px" }}
      >
        Citizen Voice
      </div>

      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        {/* ⭐ GUEST LINKS */}
        {!user && (
          <>
            <span onClick={() => scrollToSection("features")} className="nav-item" style={{ cursor: "pointer", opacity: 0.7 }}>Features</span>
            <span onClick={() => scrollToSection("about")} className="nav-item" style={{ cursor: "pointer", opacity: 0.7 }}>About</span>
            <button onClick={() => navigate("/login")} style={{ background: "var(--cv-accent)", color: "white", padding: "12px 25px", borderRadius: "12px", border: "none", fontWeight: "700", cursor: "pointer" }}>
              Sign In
            </button>
          </>
        )}

        {/* ⭐ CITIZEN LINKS */}
        {isCitizen && (
          <>
            <span onClick={() => navigate("/dashboard")} className="nav-item">Home</span>
            <span onClick={() => navigate("/add")} className="nav-item">File Report</span>
            <span onClick={() => navigate("/track")} className="nav-item">Live Track</span>
          </>
        )}

        {/* ⭐ ADMIN LINKS */}
        {isAdmin && (
           <span onClick={() => navigate("/admin")} className="nav-item">🏛️ Command Center</span>
        )}

        {/* ⭐ OFFICER LINKS */}
        {isOfficer && (
           <span onClick={() => navigate("/officer")} className="nav-item">👮 Field Hub</span>
        )}

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div className="bell" onClick={() => setShowNotif(!showNotif)} style={{ position: "relative", cursor: "pointer", fontSize: "1.3rem", transition: "0.3s" }}>
              {unread > 0 && (
                <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "linear-gradient(135deg, #ef4444, #b91c1c)", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "0.65rem", fontWeight: "900", boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)" }}>
                  {unread}
                </span>
              )}
              <span style={{ opacity: showNotif ? 1 : 0.7 }}>🔔</span>
            </div>
            <button 
              onClick={handleLogout} 
              style={{ background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 20px", borderRadius: "10px", cursor: "pointer" }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* NOTIFICATION POPUP */}
      {showNotif && (
        <div 
          className="cv-card glass-panel" 
          style={{ 
            position: "absolute", 
            top: "85px", 
            right: "40px", 
            width: "420px", 
            maxHeight: "600px", 
            overflowY: "auto", 
            zIndex: 1001, 
            padding: "35px", 
            border: "1px solid rgba(255, 255, 255, 0.12)", 
            animation: "slideInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            boxShadow: "0 30px 100px rgba(0,0,0,0.5)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <div>
              <h4 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "900", letterSpacing: "-0.5px" }}>
                {isAdmin ? "📡 Command Feed" : (isOfficer ? "🎯 Operation Radar" : "📜 Sector Updates")}
              </h4>
              <p style={{ margin: "5px 0 0 0", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Real-time telemetry</p>
            </div>
            <div className="pulse-dot" style={{ background: isAdmin ? "#ef4444" : "var(--cv-success)" }}></div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {complaints.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", opacity: 0.5 }}>
                 <p style={{ fontSize: "1.1rem" }}>📡 Awaiting Data Link...</p>
              </div>
            ) : (
              complaints
                .filter(c => {
                  if (isAdmin) return c.status === "Pending" || c.status === "Escalated" || c.status === "Verification Pending";
                  if (isOfficer) return c.status === "Assigned" && (c.assignedOfficerId === user?.id || (user?.email && c.assignedOfficerId?.includes(user.email.split('@')[0])));
                  return true; // Citizens see all their updates
                })
                .slice(0, 10)
                .map((c, i) => {
                  const isHighPriority = c.status === "Escalated" || c.status === "Verification Pending";
                  return (
                    <div 
                      key={i} 
                      onClick={() => {
                        setShowNotif(false);
                        navigate(isAdmin ? "/admin" : (isOfficer ? "/officer" : "/track"));
                      }}
                      style={{ 
                        display: "flex", 
                        gap: "20px", 
                        padding: "20px", 
                        background: isHighPriority ? "rgba(239, 68, 68, 0.05)" : "rgba(255,255,255,0.02)", 
                        borderRadius: "20px", 
                        border: isHighPriority ? `1px solid ${c.status === 'Escalated' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}` : "1px solid rgba(255,255,255,0.05)", 
                        transition: "0.3s",
                        cursor: "pointer"
                      }}
                      className="notif-item"
                    >
                      <div style={{ 
                        fontSize: "1.4rem", 
                        width: "48px", 
                        height: "48px", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        background: isHighPriority ? "rgba(239, 68, 68, 0.1)" : "rgba(67, 97, 238, 0.1)", 
                        borderRadius: "15px",
                        boxShadow: isHighPriority ? "0 0 15px rgba(239, 68, 68, 0.2)" : "none"
                      }}>
                        {c.status === "Escalated" ? "🚨" : (c.status === "Completed" ? "✅" : c.status === "Verification Pending" ? "🔍" : (c.status === "Assigned" ? "🚔" : "📌"))}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                           <p style={{ margin: 0, fontWeight: "800", fontSize: "1rem", color: c.status === "Escalated" ? "#ef4444" : "white" }}>{c.category}</p>
                           <span style={{ fontSize: "0.65rem", opacity: 0.4, fontWeight: "700" }}>{new Date(c.createdAt || c.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.5" }}>
                          {c.status === "Escalated" ? "IMMEDIATE ATTENTION: SLA BREACH" : (c.status === "Verification Pending" ? "Resolution requires authority audit." : (isOfficer ? "New Sector Assignment: Proceed to site." : `Telemetry Update: Ticket state moved to ${c.status.toUpperCase()}`))}
                        </p>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
          
          <div style={{ marginTop: "25px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
             <button style={{ background: "transparent", border: "none", color: "var(--cv-accent)", fontWeight: "900", fontSize: "0.85rem", cursor: "pointer", letterSpacing: "1px" }}>MARK ALL AS SYNCHRONIZED</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
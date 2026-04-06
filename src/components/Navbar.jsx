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

  // unread = pending complaints
  const unread = complaints.filter(c => c.status === "Pending").length;

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

  const isCitizen = user?.role === "citizen";
  const isAdmin = user?.role === "admin" || user?.role === "authority";

  return (

    <div className="nav">
      {/* LOGO */}
      <div
        className="logo"
        onClick={() => navigate(user ? (isCitizen ? "/dashboard" : "/admin") : "/")}
        style={{ cursor: "pointer" }}
      >
        Citizen Voice
      </div>

      <div className="nav-links">
        {/* ⭐ GUEST LINKS */}
        {!user && (
          <>
            <span onClick={() => scrollToSection("features")} className="nav-item">Features</span>
            <span onClick={() => scrollToSection("about")} className="nav-item">About</span>
            <button className="login-btn" onClick={() => navigate("/login")} style={{ background: "#4361ee", color: "white", padding: "10px 25px", borderRadius: "10px", border: "none", fontWeight: "700", cursor: "pointer" }}>
              Sign In
            </button>
          </>
        )}


        {/* ⭐ AUTHENTICATED LINKS */}
        {isCitizen && (
          <>
            <span onClick={() => navigate("/dashboard")} className="nav-item">Home</span>
            <span onClick={() => navigate("/add")} className="nav-item">Add Report</span>
            <span onClick={() => navigate("/track")} className="nav-item">My Trackings</span>
          </>
        )}

        {isAdmin && (
          <span onClick={() => navigate("/admin")} className="nav-item">Command Center</span>
        )}

        {user && (
          <>
            <div className="bell" onClick={() => setShowNotif(!showNotif)}>
              {unread > 0 && <span className="bell-badge">{unread}</span>}
              🔔
            </div>
            <button className="logout" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>

      {/* NOTIFICATION POPUP */}
      {showNotif && (
        <div className="notif-popup">
          <h4>Notifications</h4>
          {complaints.length === 0 ? <p>No notifications</p> : complaints.map((c, i) => (
            <div key={i} className="notif-item">📌 {c.department} - {c.status}</div>
          ))}
        </div>
      )}
    </div>
  );
}


export default Navbar;
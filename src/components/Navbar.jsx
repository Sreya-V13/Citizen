import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ComplaintContext } from "../context/ComplaintContext";
import "../styles/global.css";

function Navbar() {
  const { logout } = useContext(AuthContext);
  const { complaints } = useContext(ComplaintContext);
  const navigate = useNavigate();

  const [showNotif, setShowNotif] = useState(false);

  // unread = pending complaints
  const unread = complaints.filter(c => c.status === "pending").length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="nav">
      {/* LOGO */}
      <div
        className="logo"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        Citizen Voice
      </div>

      <div className="nav-links">

        {/* HOME */}
        <span onClick={() => navigate("/dashboard")} className="nav-item">
          Home
        </span>

        {/* ADD */}
        <span onClick={() => navigate("/add")} className="nav-item">
          Add
        </span>

        {/* TRACK */}
        <span onClick={() => navigate("/track")} className="nav-item">
          Track
        </span>

        {/* ADMIN (optional access) */}
        <span onClick={() => navigate("/admin")} className="nav-item">
          Admin
        </span>

        {/* NOTIFICATION BELL */}
        <div className="bell" onClick={() => setShowNotif(!showNotif)}>
          🔔
          {unread > 0 && <span className="bell-badge">{unread}</span>}
        </div>

        {/* NOTIFICATION POPUP */}
        {showNotif && (
          <div className="notif-popup">
            <h4>Notifications</h4>

            {complaints.length === 0 ? (
              <p>No notifications</p>
            ) : (
              complaints.map((c, i) => (
                <div key={i} className="notif-item">
                  📌 {c.department} - {c.status}
                </div>
              ))
            )}
          </div>
        )}

        {/* LOGOUT */}
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}

export default Navbar;
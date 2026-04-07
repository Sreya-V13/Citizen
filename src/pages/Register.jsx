import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/auth.css";

function Register() {
  const { register } = useContext(AuthContext);
  const location = useLocation();
  const [role, setRole] = useState(location.state?.role || null);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    if (!email || !pass || !name) {
      setError("Please fill all fields");
      return;
    }

    try {
      if (role === "admin" && pin !== "1234") {
        setError("Invalid Authority PIN");
        return;
      }
      if (role === "officer" && pin !== "2024") {
        setError("Invalid Field Officer PIN");
        return;
      }

      await register({ role, email, password: pass, name });
      if (role === "admin") navigate("/admin");
      else if (role === "officer") navigate("/officer");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  /* ⭐ ROLE SELECTION SPLIT (3-WAY) */
  if (!role) {
    return (
      <div className="split">
        <div className="auth-bg">
          <div className="blob"></div>
          <div className="blob"></div>
        </div>
        
        <div className="left" onClick={() => setRole("citizen")}>
          <div className="role-card">
            <div className="icon">🌱</div>
            <h1 className="cv-text-gradient">Citizen</h1>
            <p>Join the movement. Start reporting issues today.</p>
          </div>
        </div>

        <div className="middle" onClick={() => setRole("officer")}>
          <div className="role-card">
            <div className="icon">🛠️</div>
            <h1 className="cv-text-gradient">Officer</h1>
            <p>Field specialist? Sign up to resolve civic tasks.</p>
          </div>
        </div>

        <div className="right" onClick={() => setRole("admin")}>
          <div className="role-card">
            <div className="icon">🛡️</div>
            <h1 className="cv-text-gradient">Authority</h1>
            <p>Administrative lead? Manage and oversee resolution.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`auth ${role}`}>
      <div className="auth-bg">
        <div className="blob"></div>
        <div className="blob"></div>
      </div>
      <div className="auth-card">

        <h2 className="cv-text-gradient">
          {role === "citizen" ? "Citizen SignUp" : 
           role === "officer" ? "Officer SignUp" : "Authority SignUp"}
        </h2>

        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={{ position: "relative" }}>
            <input
              type={show ? "text" : "password"}
              placeholder="Create Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <span 
              className="password-toggle"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>

          {(role === "admin" || role === "officer") && (
            <input
              type="text"
              placeholder={`${role === "admin" ? "Authority" : "Officer"} Validation PIN`}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          )}
        </div>

        <button onClick={handleRegister}>
          Create Account
        </button>

        <div 
          className="footer-link"
          onClick={() => {
            setRole(null);
            setError("");
          }}
        >
          ← Change Role
        </div>

        <div 
          className="footer-link"
          style={{ marginTop: "10px", fontSize: "0.9rem" }}
          onClick={() => navigate("/")}
        >
          Already have an account? Sign In
        </div>
      </div>
    </div>
  );
}

export default Register;

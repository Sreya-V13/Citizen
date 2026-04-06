import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ ONLY HERE

  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pin, setPin] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  /* ⭐ ROLE SELECTION SPLIT */
  if (!role) {
    return (
      <div className="split">
        <div className="auth-bg">
          <div className="blob"></div>
          <div className="blob"></div>
        </div>
        <div className="left" onClick={() => setRole("citizen")}>

          <div className="role-card">
            <div className="icon">🏠</div>
            <h1>Citizen</h1>
            <p>Empower your community. Report civic issues in seconds.</p>
          </div>
        </div>

        <div className="right" onClick={() => setRole("admin")}>
          <div className="role-card">
            <div className="icon">🏛️</div>
            <h1>Authority</h1>
            <p>Streamline infrastructure management. Resolve reports efficiently.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = async () => {
    setError("");

    try {
      if (role === "admin") {
        await login({ role: "authority", email, password: pass, pin });
        navigate("/admin");
      } else {
        await login({ role: "citizen", email, password: pass });
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check credentials.");
    }
  };

  /* ⭐ LOGIN PAGE */

  return (
    <div className={`auth ${role}`}>
      <div className="auth-bg">
        <div className="blob"></div>
        <div className="blob"></div>
      </div>
      <div className="auth-card">

        <h2>{role === "citizen" ? "Citizen Login" : "Authority Login"}</h2>

        {error && <div className="error">{error}</div>}

        <div className="form-group">
          {role === "admin" && (
            <input
              type="text"
              placeholder="Official Authority PIN"
              value={pin}
              autoFocus
              onChange={(e) => setPin(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={{ position: "relative" }}>
            <input
              type={show ? "text" : "password"}
              placeholder="Enter Password"
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
        </div>

        <button onClick={handleLogin}>
          Sign In
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
          onClick={() => navigate("/register", { state: { role } })}
        >
          New to Citizen Voice? Create Account
        </div>

      </div>
    </div>
  );
}


export default Login;
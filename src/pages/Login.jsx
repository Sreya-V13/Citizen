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

  /* ⭐ ROLE SELECTION */
  if (!role) {
    return (
      <div className="split">
        <div className="left" onClick={() => setRole("citizen")}>
          <div className="role-card">
            <div className="icon">🏠</div>
            <h1>Citizen</h1>
            <p>Report civic issues easily</p>
          </div>
        </div>

        <div className="right" onClick={() => setRole("admin")}>
          <div className="role-card">
            <div className="icon">🏛️</div>
            <h1>Authority</h1>
            <p>Manage complaints efficiently</p>
          </div>
        </div>
      </div>
    );
  }

  /* ⭐ LOGIN VALIDATION */
  const handleLogin = () => {
    setError("");

    if (role === "admin") {
      if (
        pin === "1234" &&
        email === "1234@gmail.com" &&
        pass === "1234@1234"
      ) {
        login({ role: "authority", email });
        navigate("/admin"); // ✅ authority only
      } else {
        setError("Invalid Authority Credentials");
      }
    } else {
      if (email && pass) {
        login({ role: "citizen", email });
        navigate("/dashboard"); // ✅ citizen only
      } else {
        setError("Enter Email and Password");
      }
    }
  };

  /* ⭐ LOGIN PAGE */
  return (
    <div className={`auth ${role}`}>
      <div className="auth-card">

        <h2>
          {role === "citizen"
            ? "Citizen Login"
            : "Authority Login"}
        </h2>

        {role === "admin" && (
          <input
            placeholder="Official Authority PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={{ position: "relative" }}>
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <span
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "14px",
              color: "#7d5a4f"
            }}
            onClick={() => setShow(!show)}
          >
            {show ? "Hide" : "Show"}
          </span>
        </div>

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {error}
          </p>
        )}

        <button onClick={handleLogin}>
          Login
        </button>

        <p
          style={{
            marginTop: "15px",
            cursor: "pointer",
            color: "#7d5a4f"
          }}
          onClick={() => setRole(null)}
        >
          ← Change Role
        </p>

      </div>
    </div>
  );
}

export default Login;
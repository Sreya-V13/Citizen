import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container" style={{ background: "transparent", color: "white", paddingBottom: "100px" }}>
      {/* ⭐ PHASE 3 CYBER-TRACE BACKGROUND */}

      
      {/* ⭐ FLOATING NAV */}
      <nav style={{ position: "fixed", top: "30px", left: "50%", transform: "translateX(-50%)", zIndex: 1000, width: "auto", display: "flex", gap: "10px" }}>
        <div className="cv-card" style={{ padding: "10px 30px", borderRadius: "100px", display: "flex", gap: "30px", alignItems: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontWeight: "900", fontSize: "0.9rem", color: "var(--cv-accent)", cursor: "pointer" }}>CITY HELP CENTER</span>
          <div style={{ width: "1px", height: "15px", background: "rgba(255,255,255,0.2)" }}></div>
          <button onClick={() => navigate('/login')} style={{ background: "transparent", border: "none", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" }}>SIGN IN</button>
        </div>
      </nav>

      {/* ⭐ HERO SECTION */}
      <section className="hero" style={{ padding: "180px 60px 80px 60px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)" }}></div>
        <h1 className="cv-text-gradient" style={{ fontSize: "5rem", fontWeight: "1000", letterSpacing: "-4px", lineHeight: "0.9", marginBottom: "30px" }}>
          Service <br/> Hyderabad
        </h1>
        <p style={{ fontSize: "1.3rem", color: "#94a3b8", maxWidth: "800px", margin: "0 auto 40px auto", fontWeight: "500", lineHeight: "1.5" }}>
          Your one-stop dashboard to report city issues, track repairs in real-time, 
          and see how your community is getting better every day.
        </p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <button className="cv-card" onClick={() => navigate('/login')} style={{ background: "var(--cv-accent)", padding: "18px 45px", borderRadius: "15px", border: "none", color: "white", fontWeight: "900", cursor: "pointer", boxShadow: "0 0 30px rgba(67, 97, 238, 0.4)" }}>
            REPORT AN ISSUE
          </button>
          <button className="cv-card" onClick={() => navigate('/login')} style={{ padding: "18px 45px", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontWeight: "900", cursor: "pointer" }}>
            SEE LIVE MAP
          </button>
        </div>
      </section>

      {/* ⭐ LIVE UPDATES (BENTO GRID) */}
      <section style={{ padding: "0 60px" }}>
        <div className="glass-bento" style={{ gridTemplateColumns: "1.5fr 1fr 1fr", gridTemplateRows: "repeat(2, 220px)" }}>
          <div className="bento-item" style={{ gridRow: "span 2", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "900" }}>🏙️ Live City Updates</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Real-time look at city-wide repairs.</p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "150px" }}>
               {[40, 70, 45, 90, 65, 80, 50, 95, 75, 85].map((h, i) => (
                 <div key={i} style={{ flex: 1, height: `${h}%`, background: "linear-gradient(to top, var(--cv-accent), #4cc9f0)", borderRadius: "5px", opacity: 0.8 + (i * 0.02) }}></div>
               ))}
            </div>
          </div>
          
          <div className="bento-item" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--cv-success)", fontWeight: "900", letterSpacing: "2px" }}>SUCCESS RATE</span>
            <h2 style={{ fontSize: "3.5rem", margin: "10px 0", fontWeight: "950" }}>98.4%</h2>
            <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
              <div style={{ width: "98.4%", height: "100%", background: "var(--cv-success)", borderRadius: "2px" }}></div>
            </div>
          </div>

          <div className="bento-item" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--cv-accent)", fontWeight: "900", letterSpacing: "2px" }}>REPAIR TRUCKS</span>
            <h2 style={{ fontSize: "3.5rem", margin: "10px 0", fontWeight: "950" }}>423</h2>
            <div className="pulse-dot"></div>
          </div>

          <div className="bento-item" style={{ gridColumn: "span 2", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <div>
                <h4 style={{ margin: 0, fontSize: "1.1rem" }}>Average Repair Time</h4>
                <p style={{ margin: "5px 0 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>Fixed over 1,200 issues this week!</p>
             </div>
             <div style={{ fontSize: "2rem", fontWeight: "900", color: "var(--cv-accent)" }}>⚡ Fast</div>
          </div>
        </div>
      </section>

      {/* ⭐ FOOTER CTA */}
      <div style={{ padding: '120px 60px', textAlign: 'center', position: "relative" }}>
        <h2 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "30px" }}>Ready to make a difference?</h2>
        <button className="cv-card" onClick={() => navigate('/login')} style={{ background: "white", color: "black", padding: "20px 60px", borderRadius: "100px", border: "none", fontWeight: "1000", cursor: "pointer", fontSize: "1.1rem" }}>
          JOIN NOW
        </button>
      </div>
    </div>
  );
}

export default Home;

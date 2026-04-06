import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-bg-blob"></div>
      
      {/* ⭐ HERO SECTION */}
      <section className="hero">
        <h1>Transforming Our City, <br/> One Voice at a Time.</h1>
        <p>
          Connect with local authorities to report infrastructure gaps, track resolution live, 
          and take part in the digital transformation of our urban community.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => navigate('/login')}>Get Started</button>
          <button className="btn-secondary" onClick={() => navigate('/login')}>View City Impact</button>
        </div>
      </section>

      {/* ⭐ IMPACT STATS BAR */}
      <section className="stats-bar">
        <div className="stat-item">
          <h2>1.2K+</h2>
          <p>Reports Filed</p>
        </div>
        <div className="stat-item">
          <h2>85%</h2>
          <p>Resolution Rate</p>
        </div>
        <div className="stat-item">
          <h2>4.2/5</h2>
          <p>Citizen Satisfaction</p>
        </div>
        <div className="stat-item">
          <h2>24/7</h2>
          <p>Real-time Tracking</p>
        </div>
      </section>

      {/* ⭐ HOW IT WORKS SECTION (ABOUT) */}
      <section id="about" className="how-it-works" style={{ padding: '100px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '50px' }}>How It Works</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', maxWidth: '1100px', margin: '0 auto' }}>
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>Identify & Snap</h3>
            <p>See a civic issue in Hyderabad? Take a photo and select the category in our smart GHMC-aligned wizard.</p>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <h3>Track Progress</h3>
            <p>Get real-time updates as the Municipal Authorities (GHMC/HMWS&SB) acknowledge your report.</p>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <h3>See the Change</h3>
            <p>View the resolution evidence and earn impact points for making Hyderabad a better city.</p>
          </div>
        </div>
      </section>

      {/* ⭐ IMPACT STORIES SECTION */}
      <section className="impact-stories" style={{ padding: '100px 20px' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '50px' }}>Real Impact in Hyderabad</h2>
        <div className="features">
          <div className="feat-card" style={{ borderLeft: '4px solid #4361ee' }}>
            <p style={{ fontStyle: 'italic', color: '#fff' }}>"The street lights near Banjara Hills Rd No. 12 were out for weeks. Reported it on Citizen Voice, and GHMC fixed it within 24 hours!"</p>
            <h4 style={{ marginTop: '20px', color: '#4361ee' }}>— Residents of Banjara Hills</h4>
          </div>
          <div className="feat-card" style={{ borderLeft: '4px solid #f72585' }}>
            <p style={{ fontStyle: 'italic', color: '#fff' }}>"A major water pipeline leakage near HITEC City Metro was wasting tons of water. HMWS&SB responded swiftly after my report."</p>
            <h4 style={{ marginTop: '20px', color: '#f72585' }}>— Srinivas K., Tech Professional</h4>
          </div>
        </div>
      </section>

      {/* ⭐ FEATURES GRID */}
      <section id="features" className="features">
        <div className="feat-card">
          <span>📢</span>
          <h3>GHMC Integrated</h3>
          <p>Directly aligned with Hyderabad Municipal departments for faster routing of civic complaints.</p>
        </div>
        <div className="feat-card">
          <span>🛰️</span>
          <h3>Live Tracking</h3>
          <p>Monitor your report status from 'Pending' to 'Resolved' with real-time GHMC officer remarks.</p>
        </div>
        <div className="feat-card">
          <span>🛡️</span>
          <h3>Verified Solutions</h3>
          <p>Every resolution is verified with on-site photos and digital signatures from Hyderabad authorities.</p>
        </div>
        <div className="feat-card">
          <span>🏆</span>
          <h3>City Leaderboard</h3>
          <p>Join thousands of Hyderabadis in the 'Saaf Hyderabad' initiative and earn rewards for active reporting.</p>
        </div>
      </section>


      {/* ⭐ FOOTER CTA */}
      <div style={{ padding: '100px 20px', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to make a change?</h2>
        <button className="btn-primary" onClick={() => navigate('/login')}>Join the Movement</button>
      </div>
    </div>
  );
}

export default Home;

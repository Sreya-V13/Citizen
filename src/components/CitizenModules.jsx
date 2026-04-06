import React from "react";

export const CitizenModules = ({ complaints }) => {
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;
  
  return (
    <div className="module-grid">
      {/* ⭐ MODULE 1: COMMUNITY WALL */}
      <div className="module-card">
        <h4>📢 Community Wall</h4>
        <div className="feed">
          {complaints.slice(0, 3).map((c, i) => (
            <div key={i} className="feed-item">
              <div className="feed-icon">📍</div>
              <div className="feed-info">
                <p><b>{c.category}</b> reported in {c.location?.split(',')[0]}</p>
                <p><small>{c.status} • {new Date(c.createdAt).toLocaleDateString()}</small></p>
              </div>
            </div>
          ))}
          {complaints.length === 0 && <p>No recent activity.</p>}
        </div>
      </div>

      {/* ⭐ MODULE 2: IMPACT LEADERBOARD */}
      <div className="module-card">
        <h4>🏆 Top Impact Citizens</h4>
        <div className="leaderboard">
          <div className="lb-item">
            <span className="lb-rank">1</span>
            <span>Shashank V.</span>
            <span className="lb-score">1240 pts</span>
          </div>
          <div className="lb-item">
            <span className="lb-rank">2</span>
            <span>Asritha K.</span>
            <span className="lb-score">890 pts</span>
          </div>
          <div className="lb-item">
            <span className="lb-rank">3</span>
            <span>You</span>
            <span className="lb-score">{(resolvedCount * 10) + (complaints.length * 2)} pts</span>
          </div>
        </div>
      </div>

      {/* ⭐ MODULE 3: QUICK STATS */}
      <div className="module-card">
        <h4>📊 Your Activity</h4>
        <div className="chart-container">
          <div className="chart-bar" style={{ height: '40%' }} data-label="Filed"></div>
          <div className="chart-bar" style={{ height: `${(resolvedCount / (complaints.length || 1)) * 100}%` }} data-label="Resolved"></div>
          <div className="chart-bar" style={{ height: '10%' }} data-label="Impact"></div>
        </div>
      </div>
    </div>
  );
};

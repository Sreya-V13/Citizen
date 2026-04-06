import React from "react";

export const AuthorityModules = ({ complaints }) => {
  const pendingCount = complaints.filter(c => c.status === "Pending").length;
  const inProgressCount = complaints.filter(c => c.status === "In Progress").length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;

  return (
    <div className="module-grid">
      {/* ⭐ MODULE 1: PRIORITY QUEUE */}
      <div className="module-card">
        <h4>🚨 Urgent Priority Queue</h4>
        <div className="feed">
          {complaints.filter(c => c.status === "Pending").slice(0, 3).map((c, i) => (
            <div key={i} className="feed-item">
              <div className="feed-icon">⏳</div>
              <div className="feed-info">
                <p><b>{c.department}</b> - {c.category}</p>
                <p><small>Waiting since: {new Date(c.createdAt).toLocaleTimeString()}</small></p>
              </div>
            </div>
          ))}
          {pendingCount === 0 && <p>Queue is clean! No urgent issues.</p>}
        </div>
      </div>

      {/* ⭐ MODULE 2: DEPARTMENT ANALYTICS */}
      <div className="module-card">
        <h4>📈 Performance Overview</h4>
        <div className="chart-container">
          <div className="chart-bar" style={{ height: `${(pendingCount / (complaints.length || 1)) * 100}%` }} data-label="Pending"></div>
          <div className="chart-bar" style={{ height: `${(inProgressCount / (complaints.length || 1)) * 100}%` }} data-label="Working"></div>
          <div className="chart-bar" style={{ height: `${(resolvedCount / (complaints.length || 1)) * 100}%` }} data-label="Resolved"></div>
        </div>
      </div>

      {/* ⭐ MODULE 3: RESOLUTION EFFICIENCY */}
      <div className="module-card">
        <h4>⚡ Efficiency Stats</h4>
        <div className="leaderboard">
          <div className="lb-item">
            <span>Avg. Resolution Time</span>
            <span className="lb-score">4.2 hrs</span>
          </div>
          <div className="lb-item">
            <span>Citizen Satisfaction</span>
            <span className="lb-score">92%</span>
          </div>
          <div className="lb-item">
            <span>Public Trust Index</span>
            <span className="lb-score">8.5/10</span>
          </div>
        </div>
      </div>
    </div>
  );
};

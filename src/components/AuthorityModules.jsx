import React from "react";
import "../styles/global.css";

export const AuthorityModules = ({ complaints }) => {
  const pendingCount = complaints.filter(c => c.status === "Pending").length;
  const inProgressCount = complaints.filter(c => c.status === "In Progress").length;
  const resolvedCount = complaints.filter(c => c.status === "Completed").length;
  const escalatedCount = complaints.filter(c => c.status === "Escalated").length;

  return (
    <div className="module-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
      
      {/* ⭐ MODULE 1: PRIORITY QUEUE (SIREN) */}
      <div className="cv-card glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>🚨 Operational Queue</h4>
          <span style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 10px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: '900' }}>HIGH LOAD</span>
        </div>
        <div className="feed" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {complaints.filter(c => c.status === "Pending" || c.status === "Escalated").slice(0, 3).map((c, i) => (
            <div key={i} className="feed-item" style={{ background: c.status === 'Escalated' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '18px', border: c.status === 'Escalated' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '15px', alignItems: 'center', transition: '0.3s' }}>
              <div style={{ width: '40px', height: '40px', background: c.status === 'Escalated' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(67, 97, 238, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                 {c.status === 'Escalated' ? '🚨' : '📌'}
              </div>
              <div className="feed-info" style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem', color: 'white' }}>{c.category}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: c.status === 'Escalated' ? '#ef4444' : '#94a3b8' }}>
                   {c.status === 'Escalated' ? 'SLA BREACH ALERT' : `Waiting ${new Date(c.createdAt || c.$createdAt).toLocaleTimeString()}`}
                </p>
              </div>
            </div>
          ))}
          {pendingCount + escalatedCount === 0 && (
             <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                <p>Establishing command parity...</p>
             </div>
          )}
        </div>
      </div>

      {/* ⭐ MODULE 2: PERFORMANCE ANALYTICS */}
      <div className="cv-card glass-panel" style={{ padding: '30px' }}>
        <h4 style={{ margin: '0 0 25px 0', fontSize: '1.2rem', fontWeight: '800' }}>📊 Fleet Distribution</h4>
        <div className="chart-container" style={{ display: 'flex', alignItems: 'flex-end', height: '120px', gap: '20px', padding: '0 10px', marginBottom: '20px' }}>
          <div className="chart-bar" style={{ height: `${(pendingCount / (complaints.length || 1)) * 100}%`, background: 'linear-gradient(to top, #f59e0b, #fbbf24)', width: '100%', borderRadius: '8px', position: 'relative' }}>
             <span style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.7rem', fontWeight: '800' }}>{pendingCount}</span>
          </div>
          <div className="chart-bar" style={{ height: `${(inProgressCount / (complaints.length || 1)) * 100}%`, background: 'linear-gradient(to top, #4361ee, #4895ef)', width: '100%', borderRadius: '8px', position: 'relative' }}>
             <span style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.7rem', fontWeight: '800' }}>{inProgressCount}</span>
          </div>
          <div className="chart-bar" style={{ height: `${(resolvedCount / (complaints.length || 1)) * 100}%`, background: 'linear-gradient(to top, #10b981, #34d399)', width: '100%', borderRadius: '8px', position: 'relative' }}>
             <span style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.7rem', fontWeight: '800' }}>{resolvedCount}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8' }}>
          <span>Unassigned</span>
          <span>Field Units</span>
          <span>Resolved</span>
        </div>
      </div>

      {/* ⭐ MODULE 3: EFFICIENCY STATS */}
      <div className="cv-card glass-panel" style={{ padding: '30px' }}>
        <h4 style={{ margin: '0 0 25px 0', fontSize: '1.2rem', fontWeight: '800' }}>⚡ Efficiency Metrics</h4>
        <div className="metrics" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[
            { label: "Avg. Dispatch Time", value: "1.2 hrs", trend: "-10%", color: "var(--cv-accent)" },
            { label: "Resolution Success", value: "94.2%", trend: "+2.5%", color: "var(--cv-success)" },
            { label: "Escalation Rate", value: `${((escalatedCount / (complaints.length || 1)) * 100).toFixed(1)}%`, trend: "LIVE", color: escalatedCount > 0 ? "#ef4444" : "var(--cv-success)" }
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>{m.label}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', fontWeight: '900', color: 'white' }}>{m.value}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: m.color, fontWeight: '800' }}>{m.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

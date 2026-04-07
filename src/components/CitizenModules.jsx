import React from "react";
import "../styles/global.css";

export const CitizenModules = ({ complaints }) => {
  const resolvedCount = complaints.filter(c => c.status === "Completed" || c.status === "Resolved").length;
  
  return (
    <div className="module-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
      
      {/* ⭐ MODULE 1: COMMUNITY FEED */}
      <div className="cv-card glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>📢 Community Activity</h4>
          <div className="pulse-dot"></div>
        </div>
        <div className="feed" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {complaints.slice(0, 3).map((c, i) => (
            <div key={i} className="feed-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '15px', alignItems: 'center', transition: '0.3s' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(67, 97, 238, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📍</div>
              <div className="feed-info" style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem', color: 'white' }}>{c.category}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                   <span style={{ fontSize: '0.75rem', color: 'var(--cv-accent)', fontWeight: '700' }}>{c.status}</span>
                   <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(c.createdAt || c.$createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
          {complaints.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
               <p style={{ fontSize: '0.9rem' }}>Loading latest reports...</p>
            </div>
          )}
        </div>
      </div>

      {/* ⭐ MODULE 2: TOP CITIZENS */}
      <div className="cv-card glass-panel" style={{ padding: '30px' }}>
        <h4 style={{ margin: '0 0 25px 0', fontSize: '1.2rem', fontWeight: '800' }}>🏆 Top Citizens</h4>
        <div className="leaderboard" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { rank: 1, name: "Prashanth M.", score: "15,400", trend: "+20%" },
            { rank: 2, name: "Sreya K.", score: "12,890", trend: "+15%" },
            { rank: 3, name: "You", score: `${(resolvedCount * 100) + (complaints.length * 20)}`, trend: "LIVE" }
          ].map((u, i) => (
            <div key={i} className="lb-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: i === 2 ? 'rgba(67, 97, 238, 0.1)' : 'rgba(255,255,255,0.02)', borderRadius: '18px', border: i === 2 ? '1px solid var(--cv-accent)' : '1px solid transparent' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', background: i === 0 ? 'linear-gradient(135deg, #fbbf24, #d97706)' : (i === 1 ? 'linear-gradient(135deg, #cbd5e1, #64748b)' : 'rgba(255,255,255,0.1)'), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '900', color: i < 2 ? 'white' : 'inherit' }}>{u.rank}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem' }}>{u.name}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: i === 2 ? 'var(--cv-accent)' : '#94a3b8' }}>{u.trend} ACTIVITY</p>
                </div>
              </div>
              <span style={{ fontWeight: '900', color: 'white', letterSpacing: '0.5px' }}>{u.score} <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>Points</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ MODULE 3: ACTIVITY STATS */}
      <div className="cv-card glass-panel" style={{ padding: '30px' }}>
        <h4 style={{ margin: '0 0 25px 0', fontSize: '1.2rem', fontWeight: '800' }}>📊 My Impact</h4>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '120px', gap: '20px', marginBottom: '20px', padding: '0 10px' }}>
          <div style={{ height: '60%', background: 'linear-gradient(to top, #4361ee, #4895ef)', width: '100%', borderRadius: '8px', position: 'relative' }}>
             <span style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.7rem', fontWeight: '800' }}>{complaints.length}</span>
          </div>
          <div style={{ height: `${(resolvedCount / (complaints.length || 1)) * 100}%`, background: 'linear-gradient(to top, #10b981, #34d399)', width: '100%', borderRadius: '8px', position: 'relative' }}>
             <span style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.7rem', fontWeight: '800', color: 'var(--cv-success)' }}>{resolvedCount}</span>
          </div>
          <div style={{ height: '30%', background: 'linear-gradient(to top, #f59e0b, #fbbf24)', width: '100%', borderRadius: '8px', position: 'relative' }}>
             <span style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.7rem', fontWeight: '800', color: 'var(--cv-warning)' }}>{(resolvedCount * 1.5).toFixed(0)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8' }}>
          <span>Reports</span>
          <span>Success</span>
          <span>Efficiency</span>
        </div>
        <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
           <p style={{ margin: 0, fontSize: '0.85rem' }}>🎯 Your success rate: <b style={{ color: 'var(--cv-success)' }}>{((resolvedCount / (complaints.length || 1)) * 100).toFixed(0)}%</b></p>
        </div>
      </div>

      {/* ⭐ MODULE 4: REPAIR JOURNEY */}
      <div className="cv-card" style={{ padding: '30px', gridColumn: 'span 2' }}>
         <h4 style={{ margin: '0 0 25px 0', fontSize: '1.2rem', fontWeight: '800' }}>🎞️ Repair Journey</h4>
         {complaints.filter(c => c.status === 'Completed').length > 0 ? (
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.6)', padding: '5px 12px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '900', color: 'white', zIndex: 2 }}>BEFORE</div>
                <div style={{ height: '220px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', filter: 'grayscale(0.8)' }}>
                   🚧
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                 <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(16,185,129,0.8)', padding: '5px 12px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '900', color: 'white', zIndex: 2 }}>AFTER</div>
                 <div style={{ height: '220px', borderRadius: '20px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--cv-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                    ✅
                 </div>
              </div>
              <div style={{ gridColumn: 'span 2', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <p style={{ margin: 0, fontSize: '0.9rem', color: "#94a3b8" }}>
                    <b style={{ color: 'white' }}>Note:</b> Task <span style={{ color: 'var(--cv-success)' }}>{complaints.filter(c => c.status === 'Completed')[0].category}</span> successfully verified by city staff. Issue resolved.
                 </p>
              </div>
           </div>
         ) : (
           <div style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>
              <p style={{ fontSize: '1rem' }}>Repair proof will appear here once issues are fixed.</p>
           </div>
         )}
      </div>
    </div>
  );
};

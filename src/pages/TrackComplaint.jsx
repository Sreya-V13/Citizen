import { useContext, useState } from "react";
import { ComplaintContext } from "../context/ComplaintContext";
import "../styles/global.css";

function TrackComplaint() {
  const { complaints } = useContext(ComplaintContext);
  const [search, setSearch] = useState("");

  const filtered = complaints.filter((c) =>
    c.category?.toLowerCase().includes(search.toLowerCase()) ||
    c.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="track-page animated-bg">

      <div className="track-header">
        <h2>📋 Track Your Complaints</h2>

        <input
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          🚫 No complaints found
        </div>
      )}

      <div className="track-list">
        {filtered.map((c) => {
          const timeline = typeof c.timeline === 'string' ? JSON.parse(c.timeline) : (c.timeline || []);
          return (
            <div key={c.$id || c.id} className="track-card">

              {/* ⭐ TOP */}
              <div className="track-top">
                <h3>{c.department}</h3>
                <span className={`status ${c.status}`}>
                  {c.status}
                </span>
              </div>

              <p><b>Category:</b> {c.category}</p>
              <p><b>Description:</b> {c.desc}</p>
              <p><b>Location:</b> {c.location}</p>

              {/* ⭐ IMAGE */}
              {c.image && (
                <img src={c.image} className="img-preview" alt="Complaint" />
              )}

              {/* ⭐ ENHANCED AUDIT TIMELINE */}
              <div className="track-timeline" style={{ marginTop: "20px", borderLeft: "2px solid #8a6f5c", paddingLeft: "20px" }}>
                {timeline.length > 0 ? timeline.map((t, i) => (
                  <div key={i} className="timeline-step" style={{ position: "relative", marginBottom: "15px" }}>
                    <div style={{ position: "absolute", left: "-27px", top: "5px", width: "12px", height: "12px", borderRadius: "50%", background: "#8a6f5c" }}></div>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#8a6f5c", textTransform: "uppercase" }}>{t.status}</span>
                    <p style={{ margin: "4px 0", fontSize: "0.9rem", color: "#444" }}>{t.remark}</p>
                    <small style={{ color: "#999" }}>{new Date(t.timestamp).toLocaleString()}</small>
                  </div>
                )) : (
                  <div className="timeline-step" style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "-27px", top: "5px", width: "12px", height: "12px", borderRadius: "50%", background: "#ccc" }}></div>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#999" }}>PENDING</span>
                    <p style={{ margin: "4px 0", fontSize: "0.9rem", color: "#999" }}>Awaiting acknowledgment from authority.</p>
                  </div>
                )}
              </div>


            </div>
          );
        })}

      </div>
    </div>
  );
}

export default TrackComplaint;
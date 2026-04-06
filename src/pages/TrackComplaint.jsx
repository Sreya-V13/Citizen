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
        {filtered.map((c) => (
          <div key={c.id} className="track-card">

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
              <img src={c.image} className="img-preview" />
            )}

            {/* ⭐ TIMELINE */}
            <div className="timeline">
              {c.timeline.map((t, i) => (
                <div key={i} className="step active">
                  {t}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default TrackComplaint;
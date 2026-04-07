import React, { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from "react-leaflet";
import L from "leaflet";
import { ComplaintContext } from "../context/ComplaintContext";
import { AuthContext } from "../context/AuthContext";
import "leaflet/dist/leaflet.css";

// ⭐ CUSTOM MARKERS
const createIcon = (color, emoji, status) => {
  const isResolved = status === 'Completed' || status === 'Verification Pending';
  return L.divIcon({
    html: `
      <div class="marker-container ${isResolved ? 'healing-wave' : ''}" style="position: relative;">
        ${isResolved ? `<div class="ripple-ring" style="border-color: ${color}"></div>` : ''}
        <div style="background: ${color}; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 15px ${color}88; font-size: 1.2rem; position: relative; z-index: 2;">
          ${emoji}
        </div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [35, 35],
    iconAnchor: [17, 35]
  });
};

const icons = {
  Pending: createIcon("#f59e0b", "📌", "Pending"),
  Assigned: createIcon("#4361ee", "⚙️", "Assigned"),
  "In Progress": createIcon("#4361ee", "⚙️", "In Progress"),
  Escalated: createIcon("#ef4444", "🚨", "Escalated"),
  "Verification Pending": createIcon("#10b981", "🔍", "Verification Pending"),
  Completed: createIcon("#10b981", "✅", "Completed"),
  Officer: L.divIcon({
    html: `
      <div class="marker-container" style="position: relative;">
        <div style="background: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid var(--cv-accent); box-shadow: 0 0 20px rgba(67, 97, 238, 0.4); font-size: 1.5rem; position: relative; z-index: 2;">
          🚔
        </div>
      </div>
    `,
    className: 'officer-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })
};

// ⭐ AUTO-ZOOM TO MARKERS
function ZoomManager({ markers }) {
  const map = useMap();
  useEffect(() => {
    const validMarkers = markers.filter(m => m.lat && m.lng);
    if (validMarkers.length > 0) {
      // If only one marker (selected), zoom in tightly for pinpoint accuracy
      if (validMarkers.length === 1) {
        map.setView([validMarkers[0].lat, validMarkers[0].lng], 18, { animate: true });
      } else {
        const bounds = L.latLngBounds(validMarkers.map(m => [m.lat, m.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [markers, map]);
  return null;
}

const FleetMap = () => {
  const { complaints } = useContext(ComplaintContext);
  const { mockOfficers } = useContext(AuthContext);
  const [officerLocs, setOfficerLocs] = useState(mockOfficers);

  // ⭐ SIMULATE LIVE MOVEMENT (Civic-Tech Demo Logic)
  useEffect(() => {
    const interval = setInterval(() => {
      setOfficerLocs(prev => prev.map(off => ({
        ...off,
        lat: off.lat + (Math.random() - 0.5) * 0.001,
        lng: off.lng + (Math.random() - 0.5) * 0.001
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cv-card glass-panel" style={{ height: "450px", width: "100%", padding: 0, overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 1000, background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(10px)", padding: "10px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
        <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: "900", letterSpacing: "1px", color: "var(--cv-accent)" }}>📍 LIVE MAP VIEW</h4>
        <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#94a3b8" }}>{complaints.length} INCIDENTS • {mockOfficers.length} UNITS ACTIVE</p>
      </div>

      {/* ⭐ STATIC LIGHT HEADER */}

      {/* ⭐ STABLE FLAT MAP WRAPPER (Removed 3D POV) */}
      <div className="map-view-stable" style={{ height: "100%", width: "100%", position: "relative" }}>
        <MapContainer 
          center={[17.3850, 78.4867]} 
          zoom={12} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* ⭐ COMPLAINT MARKERS */}
        {complaints.map(c => (
          c.lat && c.lng && (
            <Marker key={c.$id || c.id} position={[c.lat, c.lng]} icon={icons[c.status] || icons.Pending}>
              <Popup className="cv-popup">
                <div style={{ padding: "5px" }}>
                   <p style={{ margin: 0, fontWeight: "800", color: "var(--cv-primary)" }}>{c.category}</p>
                   <p style={{ margin: "4px 0", fontSize: "0.8rem" }}>Status: <b>{c.status}</b></p>
                   <span style={{ fontSize: "0.7rem", color: "#666" }}>Ticket: {c.$id?.slice(-6).toUpperCase()}</span>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {/* ⭐ OFFICER MARKERS */}
        {officerLocs.map(off => (
          <Marker key={off.id} position={[off.lat, off.lng]} icon={icons.Officer}>
            <Popup>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontWeight: "800" }}>{off.name}</p>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#666" }}>{off.dept} Unit</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* ⭐ LIVE ROUTES (UBER/RAPIDO STYLE) */}
        {complaints.filter(c => c.assignedOfficerId && c.lat && c.lng).map(c => {
           const officer = officerLocs.find(o => o.id === c.assignedOfficerId);
           if (!officer) return null;
           
           return (
             <Polyline 
               key={`route-${c.$id || c.id}`}
               positions={[[officer.lat, officer.lng], [c.lat, c.lng]]}
               pathOptions={{
                 color: "var(--cv-accent)",
                 weight: 4,
                 opacity: 0.6,
                 dashArray: "10, 10",
                 lineCap: "round"
               }}
               className="live-route-path"
             />
           );
        })}

        {/* ⭐ SECTOR HEALTH (AI CLUSTERING) REMOVED OVERLAY */}

        <ZoomManager markers={complaints} />
      </MapContainer>
      </div>

      <style>{`
        .leaflet-container { background: #f1f5f9 !important; }
        .cv-popup .leaflet-popup-content-wrapper { border-radius: 12px; background: white; color: #0f172a; font-family: 'Outfit', sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .cv-popup .leaflet-popup-tip { background: white; }

        /* ⭐ STABLE MAP STYLES */
        .map-view-stable {
          transition: 0.3s ease;
        }

        /* ⭐ LIVE ROUTE ANIMATION (UBER/RAPIDO STYLE) */
        .live-route-path {
          animation: dashMove 3s linear infinite;
          filter: drop-shadow(0 0 8px var(--cv-accent));
        }
        @keyframes dashMove {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }

        /* ⭐ HEALING RIPPLE */
        .ripple-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 35px;
          height: 35px;
          border: 2px solid;
          border-radius: 50%;
          animation: healRipple 2s infinite;
          opacity: 0;
          z-index: 1;
        }
        @keyframes healRipple {
          0% { width: 35px; height: 35px; opacity: 0.8; }
          100% { width: 120px; height: 120px; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FleetMap;

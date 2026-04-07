import { useState, useContext, useEffect } from "react";
import { ComplaintContext } from "../context/ComplaintContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker
} from "react-leaflet";
import L from "leaflet";
import "../styles/global.css";

/* ⭐ leaflet marker fix */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

function AddComplaint() {
  const { addComplaint } = useContext(ComplaintContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // ⭐ STEP TRACKER

  const department = state?.department || "General";
  const categories = [...(state?.categories || []), "Other"];

  const [category, setCategory] = useState("");
  const [custom, setCustom] = useState("");
  const [desc, setDesc] = useState("");

  const [mode, setMode] = useState("current");
  const [locText, setLocText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [coords, setCoords] = useState(null);

  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ⭐ CURRENT GPS + REVERSE GEOCODE */
  useEffect(() => {
    if (mode === "current" && step === 3) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        setLocText(data.display_name);
      });
    }
  }, [mode, step]);

  /* ⭐ AUTOCOMPLETE INDIA */
  useEffect(() => {
    if (mode !== "custom" || locText.length < 3) return;

    const fetchSuggestions = async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${locText},India`
      );
      const data = await res.json();
      setSuggestions(data.slice(0, 5));
    }
    fetchSuggestions();
  }, [locText, mode]);

  const selectSuggestion = (s) => {
    setLocText(s.display_name);
    setCoords({
      lat: parseFloat(s.lat),
      lng: parseFloat(s.lon)
    });
    setSuggestions([]);
  }

  const handleImg = (e) => {
    const file = e.target.files[0];
    setImg(file);
    setPreview(URL.createObjectURL(file));
  }

  const submit = async () => {
    const finalCat = category === "Other" ? custom : category;

    await addComplaint({
      department,
      category: finalCat,
      desc,
      location: locText,
      lat: coords?.lat || 17.3850,
      lng: coords?.lng || 78.4867,
      status: "Pending",
      timeline: JSON.stringify([{ status: "Submitted", remark: "Complaint filed successfully", timestamp: new Date().toISOString() }])
    }, img);

    navigate("/track");
  }


  return (
    <div className="complaint-page" style={{ background: 'var(--cv-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px' }}>
      <div className="complaint-card glass-panel" style={{ width: '600px', position: 'relative' }}>
        
        {/* ⭐ PROGRESS BAR */}
        <div className="wizard-progress">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-line ${step === 2 ? 'active' : (step === 3 ? 'full' : '')}`}></div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        <div style={{ marginBottom: '35px' }}>
          <h2 className="cv-text-gradient" style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>{department} Dispatch</h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '5px' }}>Phase {step} of 3: Operational Connectivity</p>
        </div>

        {/* ⭐ STEP 1: CATEGORY */}
        {step === 1 && (
          <div className="step-content">
            <label style={{ fontWeight: '700', opacity: 0.8, fontSize: '0.85rem' }}>NATURE OF DISPATCH</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Core Issue</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {category === "Other" && (
              <input
                placeholder="Specify Incident Detail"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
            )}

            <button disabled={!category} onClick={() => setStep(2)} style={{ background: 'var(--cv-accent)', color: 'white', border: 'none', borderRadius: '12px', padding: '16px', fontWeight: '800', width: '100%', marginTop: '20px', cursor: 'pointer', opacity: !category ? 0.5 : 1 }}>
               Initialize Incident →
            </button>
          </div>
        )}

        {/* ⭐ STEP 2: EVIDENCE */}
        {step === 2 && (
          <div className="step-content">
            <label style={{ fontWeight: '700', opacity: 0.8, fontSize: '0.85rem' }}>INCIDENT BRIEF</label>
            <textarea
              placeholder="Provide a precise overview of the situation..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={{ minHeight: '120px' }}
            />

            <button 
              className="ai-btn mini" 
              onClick={() => {
                const text = desc.toLowerCase();
                if (text.includes("pothole")) setCategory("Pothole repair");
                else if (text.includes("garbage")) setCategory("Garbage Collection");
                else if (text.includes("water")) setCategory("Water Leakage");
                else if (text.includes("light")) setCategory("Street Light Fix");
              }}
              style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '10px', fontSize: '0.75rem', marginBottom: '20px', cursor: 'pointer' }}
            >
              ✨ AI Pulse Mapping
            </button>

            <label className="upload" style={{ background: 'rgba(67, 97, 238, 0.1)', border: '1px dashed var(--cv-accent)', color: 'var(--cv-accent)', padding: '20px', borderRadius: '15px', display: 'block', textAlign: 'center', cursor: 'pointer', fontWeight: '700' }}>
              {img ? "✅ EVIDENCE LOGGED" : "📸 UPLOAD VISUAL EVIDENCE"}
              <input type="file" hidden onChange={handleImg}/>
            </label>

            {preview && <img src={preview} className="img-preview" style={{ width: '100%', borderRadius: '15px', marginTop: '15px' }} />}

            <div className="btn-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '15px', marginTop: '30px' }}>
              <button onClick={() => setStep(1)} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', borderRadius: '12px', padding: '16px', fontWeight: '700' }}>BACK</button>
              <button disabled={!desc} onClick={() => setStep(3)} style={{ background: 'var(--cv-accent)', color: 'white', border: 'none', borderRadius: '12px', padding: '16px', fontWeight: '800' }}>GEO-TAG SITE →</button>
            </div>
          </div>
        )}

        {/* ⭐ STEP 3: LOCATION */}
        {step === 3 && (
          <div className="step-content">
            <label style={{ fontWeight: '700', opacity: 0.8, fontSize: '0.85rem' }}>GEOGRAPHIC SITE UPLINK</label>
            <div className="toggle" style={{ display: 'flex', gap: '15px', margin: '20px 0' }}>
              <label style={{ flex: 1, background: mode === 'current' ? 'var(--cv-accent)' : 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: '0.3s', fontWeight: '700', fontSize: '0.85rem', border: mode === 'current' ? '1px solid var(--cv-accent)' : '1px solid rgba(255,255,255,0.1)' }}>
                <input type="radio" hidden checked={mode === "current"} onChange={() => setMode("current")} />
                🛰️ LIVE GPS
              </label>
              <label style={{ flex: 1, background: mode === 'custom' ? 'var(--cv-accent)' : 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: '0.3s', fontWeight: '700', fontSize: '0.85rem', border: mode === 'custom' ? '1px solid var(--cv-accent)' : '1px solid rgba(255,255,255,0.1)' }}>
                <input type="radio" hidden checked={mode === "custom"} onChange={() => setMode("custom")} />
                🔍 MANUAL
              </label>
            </div>

            <input
              placeholder="Detecting geographic coordinates..."
              value={locText}
              onChange={(e) => setLocText(e.target.value)}
              style={{ marginBottom: '10px' }}
            />

            {mode === "custom" && suggestions.length > 0 && (
              <div className="suggestions" style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', marginTop: '-5px', position: 'absolute', width: 'calc(100% - 80px)', zIndex: 100 }}>
                {suggestions.map((s, i) => (
                  <div key={i} className="suggestion" onClick={() => selectSuggestion(s)} style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: '0.85rem' }}>
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}

            {coords && (
              <div className="map-wrapper" style={{ height: '220px', borderRadius: '20px', overflow: 'hidden', margin: '20px 0', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <MapContainer key={coords.lat + coords.lng} center={coords} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                  <Marker draggable position={coords} eventHandlers={{ dragend: (e) => setCoords(e.target.getLatLng()) }} />
                </MapContainer>
              </div>
            )}

            <div className="btn-group" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginTop: '30px' }}>
              <button onClick={() => setStep(2)} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', borderRadius: '12px', padding: '16px', fontWeight: '700' }}>BACK</button>
              <button onClick={submit} style={{ background: 'var(--cv-accent)', color: 'white', border: 'none', borderRadius: '12px', padding: '16px', fontWeight: '900', boxShadow: '0 10px 20px rgba(67, 97, 238, 0.3)' }}>FILE COMPLAINT 🚀</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AddComplaint;
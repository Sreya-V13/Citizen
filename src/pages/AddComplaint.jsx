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
      coords: JSON.stringify(coords), 
      status: "Pending",
      timeline: JSON.stringify(["Submitted"])
    }, img);

    navigate("/track");
  }

  return (
    <div className="complaint-page animated-bg">
      <div className="complaint-card wizard">
        
        {/* ⭐ PROGRESS BAR */}
        <div className="wizard-progress">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        <h2>{department}</h2>
        <p className="step-label">Step {step} of 3</p>

        {/* ⭐ STEP 1: CATEGORY */}
        {step === 1 && (
          <div className="step-content">
            <label>What is the issue about?</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {category === "Other" && (
              <input
                placeholder="Name your issue"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
            )}

            <button disabled={!category} onClick={() => setStep(2)}>Next Step →</button>
          </div>
        )}

        {/* ⭐ STEP 2: EVIDENCE */}
        {step === 2 && (
          <div className="step-content">
            <label>Provide some details & evidence</label>
            <textarea
              placeholder="Describe the issue in detail..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
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
            >
              ✨ Smart Categorize
            </button>

            <label className="upload">
              {img ? "✅ Image Selected" : "📸 Upload Photo Evidence"}
              <input type="file" hidden onChange={handleImg}/>
            </label>

            {preview && <img src={preview} className="img-preview" />}

            <div className="btn-group">
              <button className="secondary" onClick={() => setStep(1)}>Back</button>
              <button disabled={!desc} onClick={() => setStep(3)}>Next Step →</button>
            </div>
          </div>
        )}

        {/* ⭐ STEP 3: LOCATION */}
        {step === 3 && (
          <div className="step-content">
            <label>Where is this issue located?</label>
            <div className="toggle">
              <label>
                <input type="radio" checked={mode === "current"} onChange={() => setMode("current")} />
                Live GPS
              </label>
              <label>
                <input type="radio" checked={mode === "custom"} onChange={() => setMode("custom")} />
                Manual
              </label>
            </div>

            <input
              placeholder="Search or enter location"
              value={locText}
              onChange={(e) => setLocText(e.target.value)}
            />

            {mode === "custom" && suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((s, i) => (
                  <div key={i} className="suggestion" onClick={() => selectSuggestion(s)}>
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}

            {coords && (
              <div className="map-wrapper mini shadow-sm">
                <MapContainer key={coords.lat + coords.lng} center={coords} zoom={15} className="map-container">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker draggable position={coords} eventHandlers={{ dragend: (e) => setCoords(e.target.getLatLng()) }} />
                </MapContainer>
              </div>
            )}

            <div className="btn-group">
              <button className="secondary" onClick={() => setStep(2)}>Back</button>
              <button className="primary" onClick={submit}>File Complaint 🚀</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AddComplaint;
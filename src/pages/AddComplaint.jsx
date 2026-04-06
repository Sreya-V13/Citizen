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

function AddComplaint(){
  const { addComplaint } = useContext(ComplaintContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const department = state?.department || "General";
  const categories = [...(state?.categories || []), "Other"];

  const [category,setCategory]=useState("");
  const [custom,setCustom]=useState("");
  const [desc,setDesc]=useState("");

  const [mode,setMode]=useState("current");
  const [locText,setLocText]=useState("");
  const [suggestions,setSuggestions]=useState([]);
  const [coords,setCoords]=useState(null);

  const [img,setImg]=useState(null);
  const [preview,setPreview]=useState(null);

  /* ⭐ CURRENT GPS + REVERSE GEOCODE */
  useEffect(()=>{
    if(mode==="current"){
      navigator.geolocation.getCurrentPosition(async (pos)=>{
        const lat=pos.coords.latitude;
        const lng=pos.coords.longitude;

        setCoords({lat,lng});

        /* reverse geocode */
        const res=await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data=await res.json();
        setLocText(data.display_name);
      });
    }
  },[mode]);

  /* ⭐ AUTOCOMPLETE INDIA */
  useEffect(()=>{
    if(mode!=="custom" || locText.length<3) return;

    const fetchSuggestions=async()=>{
      const res=await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${locText},India`
      );
      const data=await res.json();
      setSuggestions(data.slice(0,5));
    }
    fetchSuggestions();
  },[locText,mode]);

  /* ⭐ select suggestion */
  const selectSuggestion=(s)=>{
    setLocText(s.display_name);
    setCoords({
      lat:parseFloat(s.lat),
      lng:parseFloat(s.lon)
    });
    setSuggestions([]);
  }

  /* ⭐ image */
  const handleImg=(e)=>{
    const file=e.target.files[0];
    setImg(file);
    setPreview(URL.createObjectURL(file));
  }

  const submit=()=>{
    const finalCat = category==="Other" ? custom : category;

    addComplaint({
      department,
      category:finalCat,
      desc,
      location:locText,
      coords,
      image:preview,
      status:"Pending",
      timeline:["Submitted"]
    });

    navigate("/track");
  }

  return(
    <div className="complaint-page animated-bg">
      <div className="complaint-card">

        <h2>{department}</h2>

        {/* ⭐ CATEGORY */}
        <select value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option>Select category</option>
          {categories.map(c=><option key={c}>{c}</option>)}
        </select>

        {category==="Other" && (
          <input
            placeholder="Enter custom category"
            value={custom}
            onChange={(e)=>setCustom(e.target.value)}
          />
        )}

        {/* ⭐ DESCRIPTION */}
        <textarea
          placeholder="Describe complaint"
          value={desc}
          onChange={(e)=>setDesc(e.target.value)}
        />

        {/* ⭐ LOCATION OPTION */}
        <div className="toggle">
          <label>
            <input
              type="radio"
              checked={mode==="current"}
              onChange={()=>setMode("current")}
            />
            Use current location
          </label>

          <label>
            <input
              type="radio"
              checked={mode==="custom"}
              onChange={()=>setMode("custom")}
            />
            Custom location
          </label>
        </div>

        {/* ⭐ LOCATION INPUT (always visible now) */}
        <input
          placeholder="Location"
          value={locText}
          onChange={(e)=>setLocText(e.target.value)}
        />

        {/* ⭐ AUTOCOMPLETE */}
        {mode==="custom" && suggestions.length>0 && (
          <div className="suggestions">
            {suggestions.map((s,i)=>(
              <div
                key={i}
                className="suggestion"
                onClick={()=>selectSuggestion(s)}
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}

        {/* ⭐ MAP */}
        {coords && (
  <div className="map-wrapper">
    <MapContainer
      key={coords.lat + coords.lng}
      center={coords}
      zoom={13}
      className="map-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        draggable
        position={coords}
        eventHandlers={{
          dragend: (e) => setCoords(e.target.getLatLng())
        }}
      />
    </MapContainer>
  </div>
)}

        {/* ⭐ IMAGE */}
        <label className="upload">
          Upload complaint image
          <input type="file" hidden onChange={handleImg}/>
        </label>

        {preview && <img src={preview} className="img-preview" />}

        <button onClick={submit}>Submit Complaint</button>
      </div>
    </div>
  )
}

export default AddComplaint;
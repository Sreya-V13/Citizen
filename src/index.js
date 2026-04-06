import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
<<<<<<< HEAD
import "leaflet/dist/leaflet.css";
=======
>>>>>>> cc3b72fb4e70e078ad05d87ce9a75a1dd8dc5e4d

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import AddComplaint from "./pages/AddComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import AdminDashboard from "./pages/AdminDashboard";

import { ComplaintProvider } from "./context/ComplaintContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ComplaintProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* ✅ Hide navbar ONLY on login and register pages */}
      {location.pathname !== "/login" && location.pathname !== "/register" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddComplaint />} />
        <Route path="/track" element={<TrackComplaint />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
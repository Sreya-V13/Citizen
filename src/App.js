import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddComplaint from "./pages/AddComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import AdminDashboard from "./pages/AdminDashboard";

import { ComplaintProvider } from "./context/ComplaintContext";
import { AuthProvider } from "./context/AuthContext";   // ✅ ADD THIS

function App() {
  return (
    <AuthProvider>   {/* ✅ VERY IMPORTANT */}
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
      {/* ✅ Hide navbar on login page */}
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddComplaint />} />
        <Route path="/track" element={<TrackComplaint />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
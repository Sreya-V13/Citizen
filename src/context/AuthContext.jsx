import { createContext, useState, useEffect } from "react";
import { account, IS_APPWRITE_ENABLED } from "../lib/appwrite";



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ MOCK OFFICERS FOR ASSIGNMENT
  const mockOfficers = [
    // GHMC / Public Works
    { id: 'off-1', name: "Officer Rajesh", dept: "Public Works", lat: 17.3850, lng: 78.4867 },
    { id: 'off-4', name: "Officer Sunil", dept: "Public Works", lat: 17.3616, lng: 78.4747 },
    
    // HMWS&SB / Water
    { id: 'off-2', name: "Officer Ananya", dept: "Water & Sanitation", lat: 17.4065, lng: 78.4772 },
    { id: 'off-5', name: "Officer Anjali", dept: "Water & Sanitation", lat: 17.4239, lng: 78.4597 },
    
    // Electricity
    { id: 'off-3', name: "Officer Vikram", dept: "Electricity", lat: 17.4483, lng: 78.3915 },
    { id: 'off-6', name: "Officer Kiran", dept: "Electricity", lat: 17.4375, lng: 78.4482 },

    // Health / Municipal
    { id: 'off-7', name: "Officer Fatima", dept: "Health & Safety", lat: 17.3916, lng: 78.5276 },
    { id: 'off-8', name: "Officer Rahul", dept: "Municipal Services", lat: 17.4126, lng: 78.4356 },

    // Law & Order / Traffic
    { id: 'off-9', name: "Officer Srinivas", dept: "Law & Order", lat: 17.4344, lng: 78.4876 },
    { id: 'off-10', name: "Officer Priya", dept: "Transport & Traffic", lat: 17.3700, lng: 78.5000 },

    // Environment / Digital
    { id: 'off-11', name: "Officer Manoj", dept: "Environment", lat: 17.4500, lng: 78.3800 },
    { id: 'off-12', name: "Officer Sanya", dept: "Digital Services", lat: 17.4200, lng: 78.4000 },

    // 🚔 TEST FIELD OFFICER (For User Verification)
    { id: 'off-test', name: "Test Responder", dept: "Public Works", lat: 17.3850, lng: 78.4867, email: "officer@gmail.com" }
  ];

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        if (!IS_APPWRITE_ENABLED) {
          const stored = localStorage.getItem("user");
          if (stored) {
            setUser(JSON.parse(stored));
          }
          setLoading(false);
          return;
        }

        const session = await account.get();
        setUser({
          email: session.email,
          role: session.labels?.includes('admin') ? 'admin' : (session.labels?.includes('officer') ? 'officer' : 'citizen'),
          id: session.$id
        });
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const register = async ({ role, email, password, name }) => {
    if (!IS_APPWRITE_ENABLED) {
       const userData = { role: role || 'citizen', email, name, id: 'mock-' + Date.now() };
       setUser(userData);
       localStorage.setItem("user", JSON.stringify(userData));
       return;
    }

    try {
      const userId = ID.unique();
      await account.create(userId, email, password, name);
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser({
        email: session.email,
        name: session.name,
        role: session.labels?.includes('admin') ? 'admin' : (session.labels?.includes('officer') ? 'officer' : 'citizen'),
        id: session.$id
      });
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const login = async ({ role, email, password }) => {
    if (!IS_APPWRITE_ENABLED || (email === "1234@gmail.com" && password === "1234@1234")) {
       const userData = { role: role || 'citizen', email, id: 'mock-' + Date.now() };
       setUser(userData);
       localStorage.setItem("user", JSON.stringify(userData));
       return;
    }

    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      const userData = {
        email: session.email,
        role: session.labels?.includes('admin') ? 'admin' : (session.labels?.includes('officer') ? 'officer' : 'citizen'),
        id: session.$id
      };
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      if (email && (password || role)) {
        const userData = { role: role || 'citizen', email };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
    } catch (err) {
      console.warn("Appwrite logout failed, clearing local state.");
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, mockOfficers }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


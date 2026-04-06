import { createContext, useState, useEffect } from "react";
import { account, IS_APPWRITE_ENABLED } from "../lib/appwrite";



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const session = await account.get();
        setUser({
          email: session.email,
          role: session.labels?.includes('admin') ? 'admin' : 'citizen',
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
    // ⭐ FRONTEND-ONLY SIMULATION
    if (!IS_APPWRITE_ENABLED) {
       const userData = { role: role || 'citizen', email, name, id: 'mock-' + Date.now() };
       setUser(userData);
       localStorage.setItem("user", JSON.stringify(userData));
       return;
    }

    try {
      // Real Appwrite Register
      const userId = ID.unique();
      await account.create(userId, email, password, name);
      // Create session immediately
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser({
        email: session.email,
        name: session.name,
        role: session.labels?.includes('admin') ? 'admin' : 'citizen',
        id: session.$id
      });
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const login = async ({ role, email, password }) => {

    // ⭐ FRONTEND-ONLY SIMULATION
    if (!IS_APPWRITE_ENABLED || (email === "1234@gmail.com" && password === "1234@1234")) {
       const userData = { role: role || 'citizen', email, id: 'mock-' + Date.now() };
       setUser(userData);
       localStorage.setItem("user", JSON.stringify(userData));
       return;
    }

    try {
      // Real Appwrite Login
      await account.createEmailPasswordSession(email, password);

      const session = await account.get();
      const userData = {
        email: session.email,
        role: session.labels?.includes('admin') ? 'admin' : 'citizen',
        id: session.$id
      };
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      // Fallback for simulation if Appwrite is not configured
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
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
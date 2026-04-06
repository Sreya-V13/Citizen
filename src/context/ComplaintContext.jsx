import { createContext, useState, useEffect } from "react";

export const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {

  // ⭐ LOAD from localStorage
  const [complaints, setComplaints] = useState(() => {
    const data = localStorage.getItem("complaints");
    return data ? JSON.parse(data) : [];
  });

  // ⭐ SAVE to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("complaints", JSON.stringify(complaints));
  }, [complaints]);

  const addComplaint = (complaint) => {
    setComplaints((prev) => [...prev, complaint]);
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint }}>
      {children}
    </ComplaintContext.Provider>
  );
};
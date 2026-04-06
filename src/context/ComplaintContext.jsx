import { createContext, useState, useEffect } from "react";
import { databases, storage, APPWRITE_PROJECT_ID, IS_APPWRITE_ENABLED, ID, Query } from "../lib/appwrite";



export const ComplaintContext = createContext();

export const DATABASE_ID = 'citizen_voice';
export const COLLECTION_ID = 'complaints';
export const BUCKET_ID = 'complaint_images';

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ INITIAL LOAD from Appwrite
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!IS_APPWRITE_ENABLED) {
        const data = localStorage.getItem("complaints");
        setComplaints(data ? JSON.parse(data) : []);
        setLoading(false);
        return;
      }

      try {
        const response = await databases.listDocuments(

          DATABASE_ID,
          COLLECTION_ID,
          [Query.orderDesc("$createdAt")]
        );
        setComplaints(response.documents);
      } catch (err) {
        console.warn("Appwrite Database not found, using localStorage fallback.");
        const data = localStorage.getItem("complaints");
        setComplaints(data ? JSON.parse(data) : []);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // ⭐ REAL-TIME SUBSCRIPTION
  useEffect(() => {
    if (!IS_APPWRITE_ENABLED) return;

    const unsubscribe = databases.client.subscribe(

      `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
      (response) => {
        if (response.events.includes("databases.*.collections.*.documents.*.create")) {
          setComplaints((prev) => [response.payload, ...prev]);
        }
        if (response.events.includes("databases.*.collections.*.documents.*.update")) {
          setComplaints((prev) =>
            prev.map((c) => (c.$id === response.payload.$id ? response.payload : c))
          );
        }
      }
    );
    return () => unsubscribe();
  }, []);

  const addComplaint = async (complaintData, imageFile) => {
    if (!IS_APPWRITE_ENABLED) {
       const existingIndex = complaints.findIndex(c => c.$id === complaintData.$id);
       
       if (existingIndex !== -1) {
          // ⭐ UPDATE EXISTING
          const updatedComplaints = [...complaints];
          updatedComplaints[existingIndex] = { 
            ...complaints[existingIndex], 
            ...complaintData,
            updatedAt: new Date().toISOString() 
          };
          setComplaints(updatedComplaints);
          localStorage.setItem("complaints", JSON.stringify(updatedComplaints));
          return;
       }

       // ⭐ CREATE NEW
       const newComplaint = { 
          ...complaintData, 
          id: Date.now(), 
          $id: 'mock-' + Date.now(),
          image: complaintData.image || null,
          createdAt: new Date().toISOString()
       };
       const newList = [newComplaint, ...complaints];
       setComplaints(newList);
       localStorage.setItem("complaints", JSON.stringify(newList));
       return;
    }


    try {
      let imageUrl = null;

      if (imageFile) {
        const upload = await storage.createFile(BUCKET_ID, ID.unique(), imageFile);
        imageUrl = storage.getFileView(BUCKET_ID, upload.$id);
      }

      const complaint = {
        ...complaintData,
        image: imageUrl || complaintData.image,
        $id: ID.unique(),
        createdAt: new Date().toISOString()
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        complaint
      );
      
      // Local state is updated by the subscription, but we can do it manually for speed
      setComplaints((prev) => [response, ...prev]);
    } catch (err) {
      console.error("Appwrite Complaint Add failed:", err);
      // Fallback
      const newComplaint = { ...complaintData, id: Date.now() };
      setComplaints((prev) => [newComplaint, ...prev]);
      localStorage.setItem("complaints", JSON.stringify([newComplaint, ...complaints]));
    }
  };

  const updateStatus = async (id, status) => {
     try {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, { status });
     } catch (err) {
        setComplaints(prev => prev.map(c => c.$id === id || c.id === id ? { ...c, status } : c));
     }
  }

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, updateStatus, loading }}>
      {children}
    </ComplaintContext.Provider>
  );
};

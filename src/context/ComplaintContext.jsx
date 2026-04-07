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

       // ⭐ CREATE NEW WITH LOCATION (MOCK)
       const newComplaint = { 
          ...complaintData, 
          id: Date.now(), 
          $id: 'mock-' + Date.now(),
          image: complaintData.image || null,
          lat: complaintData.lat || 17.3850, // Default to Hyd
          lng: complaintData.lng || 78.4867,
          status: "Pending",
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
        lat: complaintData.lat,
        lng: complaintData.lng,
        status: "Pending",
        $id: ID.unique(),
        createdAt: new Date().toISOString()
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        complaint
      );
      
      setComplaints((prev) => [response, ...prev]);
    } catch (err) {
      console.error("Appwrite Complaint Add failed:", err);
      const newComplaint = { ...complaintData, id: Date.now(), status: "Pending" };
      setComplaints((prev) => [newComplaint, ...prev]);
      localStorage.setItem("complaints", JSON.stringify([newComplaint, ...complaints]));
    }
  };

  const updateStatus = async (id, status, extra = {}) => {
     // ⭐ OPTIMISTIC UPDATE
     setComplaints(prev => prev.map(c => c.$id === id || c.id === id ? { ...c, status, ...extra } : c));

     try {
        if (IS_APPWRITE_ENABLED) {
           await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, { status, ...extra });
        }
     } catch (err) {
        console.error("Appwrite Update failed, falling back to local storage:", err);
     }

     // Update localStorage as well
     const data = localStorage.getItem("complaints");
     if (data) {
        const list = JSON.parse(data);
        const updated = list.map(c => c.$id === id || c.id === id ? { ...c, status, ...extra } : c);
        localStorage.setItem("complaints", JSON.stringify(updated));
     }
  }
  // ⭐ MANDATORY VERIFICATION BY ADMIN
  const verifyResolution = async (id, approved = true) => {
    const status = approved ? "Completed" : "Re-Opened";
    const remark = approved ? "Verification successful. Issue closed." : "Verification failed. Work rejected.";
    
    // Add to timeline
    const complaint = complaints.find(c => c.$id === id || c.id === id);
    const timeline = Array.isArray(complaint.timeline) ? [...complaint.timeline] : (typeof complaint.timeline === 'string' ? JSON.parse(complaint.timeline) : []);
    timeline.push({ status, remark, timestamp: new Date().toISOString() });
    
    await updateStatus(id, status, { timeline: JSON.stringify(timeline) });
  };
  // ⭐ ESCALATE ISSUE (IF SLA EXCEEDED)
  const escalateComplaint = async (id, reason = "Escalated by Citizen due to delay.") => {
    const complaint = complaints.find(c => c.$id === id || c.id === id);
    const timeline = Array.isArray(complaint.timeline) ? [...complaint.timeline] : (typeof complaint.timeline === 'string' ? JSON.parse(complaint.timeline) : []);
    
    timeline.push({ 
      status: "Escalated", 
      remark: reason, 
      timestamp: new Date().toISOString() 
    });

    await updateStatus(id, "Escalated", { timeline: JSON.stringify(timeline) });
  };

  // ⭐ ADVANCE OPERATIONAL PHASE
  const advancePhase = async (id, currentStatus, imageFile = null) => {
    let nextStatus = currentStatus;
    let remark = "";
    let resolutionImage = null;

    switch (currentStatus) {
      case "Assigned":
        nextStatus = "Dispatched";
        remark = "Officer has been dispatched to the location.";
        break;
      case "Dispatched":
        nextStatus = "On-Site";
        remark = "Officer has arrived at the incident site.";
        break;
      case "On-Site":
        nextStatus = "In Progress";
        remark = "Repair and service work has commenced.";
        break;
      case "In Progress":
        nextStatus = "Verification Pending";
        remark = "Work completed by officer. Awaiting administrative verification.";
        break;
      default:
        return;
    }

    const complaint = complaints.find(c => c.$id === id || c.id === id);
    if (!complaint) return;

    // Handle Resolution Image Upload
    if (imageFile) {
        if (IS_APPWRITE_ENABLED) {
            try {
                const upload = await storage.createFile(BUCKET_ID, ID.unique(), imageFile);
                resolutionImage = storage.getFileView(BUCKET_ID, upload.$id);
            } catch (err) {
                console.error("Resolution image upload failed:", err);
            }
        } else {
            // Mock image URL for local development
            resolutionImage = URL.createObjectURL(imageFile);
        }
    }
    
    const timeline = Array.isArray(complaint.timeline) ? [...complaint.timeline] : (typeof complaint.timeline === 'string' ? JSON.parse(complaint.timeline) : []);
    timeline.push({ 
        status: nextStatus, 
        remark, 
        timestamp: new Date().toISOString(),
        evidence: resolutionImage 
    });

    await updateStatus(id, nextStatus, { 
        timeline: JSON.stringify(timeline),
        resolutionImage: resolutionImage || complaint.resolutionImage
    });
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, updateStatus, verifyResolution, escalateComplaint, advancePhase, loading }}>
      {children}
    </ComplaintContext.Provider>
  );
};


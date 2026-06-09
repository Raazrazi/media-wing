import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { PosterRequest } from "../types/Request";
import type { Result } from "../types/Result";
import type { MinusPoint } from "../types/MinusPoint";
import type { GalleryItem } from "../types/Gallery";
import type { Announcement } from "../types/Announcement";
import api from "../services/api";

export type UserRole = "Requester" | "Media Chairman" | "Media Wing Administrator";

export interface SystemSettings {
  portalName: string;
  chairman: string;
  deadline: number;
  email: string;
}

export interface ActivityNotification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface RequestContextType {
  requests: PosterRequest[];
  currentRole: UserRole;
  settings: SystemSettings;
  notifications: ActivityNotification[];
  results: Result[];
  minusPoints: MinusPoint[];
  galleryItems: GalleryItem[];
  announcements: Announcement[];
  addRequest: (request: Omit<PosterRequest, "requestId" | "createdAt" | "status">) => Promise<PosterRequest>;
  updateRequestStatus: (id: string, status: PosterRequest["status"], remarks?: string) => Promise<void>;
  updateSettings: (settings: SystemSettings) => Promise<void>;
  setCurrentRole: (role: UserRole) => void;
  addNotification: (message: string) => void;
  markNotificationsAsRead: () => void;
  seedDemoData: () => Promise<void>;
  clearDatabase: () => Promise<void>;
  addResult: (result: Omit<Result, "points" | "isPublished"> & { isPublished?: boolean }) => Promise<Result>;
  updateResult: (id: string, resultData: Partial<Result>) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  publishResult: (id: string, isPublished: boolean) => Promise<void>;
  addMinusPoint: (minusPoint: Omit<MinusPoint, "createdAt">) => Promise<MinusPoint>;
  deleteMinusPoint: (id: string) => Promise<void>;
  addGalleryItem: (item: Omit<GalleryItem, "createdAt">) => Promise<GalleryItem>;
  updateGalleryItem: (id: string, itemData: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  addAnnouncement: (announcement: Omit<Announcement, "createdAt">) => Promise<Announcement>;
  deleteAnnouncement: (id: string) => Promise<void>;
  fetchStudent: (admissionNo: string) => Promise<{ admissionNo: string, studentName: string, className: string } | null>;
  uploadDataset: (collectionName: string, file: File) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

const initialMockRequests: PosterRequest[] = [
  {
    requestId: "REQ-2026-001",
    programName: "Mock Hajj Demonstration",
    programTitle: "Labbaik Awareness Campaign",
    venue: "Main Auditorium & Courtyard",
    committee: "Hajj Campaign Committee",
    category: "Cultural",
    description: "An awareness and practical demonstration program to educate students and public about the rituals and spiritual significance of Hajj. Will feature a mock Kaaba structure setup.",
    posterRequirements: "Include clean, high-resolution calligraphy and elegant Islamic architecture outline. Avoid cluttered details. Physical flex print required (10x8ft).",
    contactPerson: "Ahmed Jasim",
    email: "media.chairman.disa@gmail.com",
    eventDateTime: "2026-06-25T10:00",
    priority: "High",
    status: "Pending",
    remarks: "Awaiting final layout confirmation from organizing secretary.",
    createdAt: "2026-06-05T09:30:00Z"
  },
  {
    requestId: "REQ-2026-002",
    programName: "World Cup Panel Discussion",
    programTitle: "The Beautiful Game: Tactics & Trends",
    venue: "Seminar Hall - Block B",
    committee: "LSRW Club (Literature & Sports)",
    category: "Sports",
    description: "An interactive panel discussion analyzing tactical developments, team dynamics, and future impacts of the FIFA World Cup tournament. Open to all sports enthusiasts.",
    posterRequirements: "Vibrant sport-centric colors, modern abstract layout, football silhouettes. High resolution for Instagram feed post (1:1 aspect ratio).",
    contactPerson: "Adhil Shah",
    email: "adhil.shah@union.edu",
    eventDateTime: "2026-06-28T16:00",
    priority: "Normal",
    status: "Approved",
    remarks: "Approved. Designer assigned. Ready for distribution once layout is completed.",
    createdAt: "2026-06-06T14:15:00Z"
  },
  {
    requestId: "REQ-2026-003",
    programName: "College Archives Exhibition",
    programTitle: "Echoes of History: College Union Retrospective",
    venue: "Library Exhibition Corridor",
    committee: "History & Archives Club",
    category: "Academic",
    description: "Exhibition displaying historical Union newsletters, student declarations, vintage photos, and award plaques dating back to 1980.",
    posterRequirements: "Sepia and dark copper tones. Vintage typography, textured paper look. Digital promotion only.",
    contactPerson: "Nadeem Ahmed",
    email: "nadeem.ahmed@union.edu",
    eventDateTime: "2026-06-12T11:00",
    priority: "Normal",
    status: "Rejected",
    remarks: "Rejected: Conflicting schedule with University Semester Examinations. Please submit a rescheduled date request.",
    createdAt: "2026-06-07T08:00:00Z"
  },
  {
    requestId: "REQ-2026-004",
    programName: "Mega Tree Plantation Drive",
    programTitle: "Go Green: 1000 Saplings Campaign",
    venue: "Campus North Belt & Boundary Walls",
    committee: "Environment Cell",
    category: "Social",
    description: "Large scale sapling plantation drive in association with the District Forest Department. Volunters from all class unions participating.",
    posterRequirements: "Natural eco-themed colors, clean green leaf design elements. Physical poster (A3 size) + WhatsApp story graphic.",
    contactPerson: "Safa Fathima",
    email: "safa.fathima@union.edu",
    eventDateTime: "2026-06-10T09:00",
    priority: "Normal",
    status: "Completed",
    remarks: "Poster designed, approved, and successfully posted. Physical prints delivered to campus notice boards.",
    createdAt: "2026-06-04T10:00:00Z"
  }
];

const defaultSettings: SystemSettings = {
  portalName: "Students Union Media Portal",
  chairman: "Ahmed Jasim",
  deadline: 48,
  email: "media.chairman.disa@gmail.com"
};

const initialNotifications: ActivityNotification[] = [
  {
    id: "notif-1",
    message: "Request REQ-2026-003 for 'College Archives Exhibition' was rejected due to exam conflict.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false
  },
  {
    id: "notif-2",
    message: "Request REQ-2026-002 for 'World Cup Panel Discussion' was approved by Chairman.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: false
  },
  {
    id: "notif-3",
    message: "New poster request REQ-2026-001 submitted by Hajj Campaign Committee.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true
  }
];

const initialMockResults: Result[] = [
  {
    programName: "Debate Competition",
    studentName: "Muhammed",
    className: "WIDAD",
    prize: "1st",
    points: 10,
    isPublished: true
  },
  {
    programName: "Essay Writing",
    studentName: "Ameen",
    className: "IFADA",
    prize: "2nd",
    points: 7,
    isPublished: true
  },
  {
    programName: "Quiz Competition",
    studentName: "Nihad",
    className: "WAFD",
    prize: "3rd",
    points: 5,
    isPublished: true
  }
];

const initialMockMinusPoints: MinusPoint[] = [
  {
    className: "WIDAD",
    reason: "Late Submission of Poster Request REQ-2026-003",
    points: 5,
    approvedBy: "Ahmed Jasim",
    date: "2026-06-07"
  },
  {
    className: "IFADA",
    reason: "Rule Violation in Sports Flex Setup",
    points: 3,
    approvedBy: "Ahmed Jasim",
    date: "2026-06-06"
  }
];

const initialMockGallery: GalleryItem[] = [
  {
    title: "Mock Hajj Poster",
    description: "Elegant calligraphy poster designed for Hajj awareness seminar.",
    category: "Posters",
    thumbnail: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&auto=format&fit=crop&q=60",
    mediaFile: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=60",
    isFeatured: true,
    isPublished: true
  },
  {
    title: "World Cup Tactics Post",
    description: "Social media feed graphics containing match analytics and squad layout.",
    category: "Posts",
    thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60",
    mediaFile: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60",
    isFeatured: true,
    isPublished: true
  },
  {
    title: "Eco Campaign Reel Video",
    description: "Promotional short video for tree plantation drive around campus walls.",
    category: "Videos",
    thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=60",
    mediaFile: "https://www.w3schools.com/html/mov_bbb.mp4",
    isFeatured: false,
    isPublished: true
  }
];

const initialMockAnnouncements: Announcement[] = [
  {
    title: "Poster Registration Mandatory Deadline Reminder",
    content: "Please ensure all publicity design poster requests are registered in the queue strictly 48 hours prior to event scheduled timings. Late applications will be automatically blocked by the system validation checks.",
    date: "2026-06-08",
    isImportant: true
  },
  {
    title: "Championship Leaderboard is Live",
    content: "Championship leaderboard statistics and aggregate net points are calculated in real time. Inspect your class standings on the public portal dashboard.",
    date: "2026-06-08",
    isImportant: false
  }
];

export function RequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<PosterRequest[]>(() => {
    const saved = localStorage.getItem("union_media_requests");
    return saved ? JSON.parse(saved) : initialMockRequests;
  });

  const [currentRole, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem("union_media_role");
    return (saved as UserRole) || "Media Chairman";
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettingsState] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem("union_media_settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [notifications, setNotifications] = useState<ActivityNotification[]>(() => {
    const saved = localStorage.getItem("union_media_notifications");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [results, setResults] = useState<Result[]>(() => {
    const saved = localStorage.getItem("union_media_results");
    return saved ? JSON.parse(saved) : initialMockResults;
  });

  const [minusPoints, setMinusPoints] = useState<MinusPoint[]>(() => {
    const saved = localStorage.getItem("union_media_minus_points");
    return saved ? JSON.parse(saved) : initialMockMinusPoints;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem("union_media_gallery");
    return saved ? JSON.parse(saved) : initialMockGallery;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem("union_media_announcements");
    return saved ? JSON.parse(saved) : initialMockAnnouncements;
  });

  useEffect(() => {
    localStorage.setItem("union_media_requests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("union_media_role", currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem("union_media_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("union_media_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("union_media_results", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem("union_media_minus_points", JSON.stringify(minusPoints));
  }, [minusPoints]);

  useEffect(() => {
    localStorage.setItem("union_media_gallery", JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem("union_media_announcements", JSON.stringify(announcements));
  }, [announcements]);

  // Sync with Backend API
  useEffect(() => {
    const fetchDataFromBackend = async () => {
      try {
        const [requestsRes, settingsRes, resultsRes, minusRes, galleryRes, announceRes] = await Promise.all([
          api.get("/requests"),
          api.get("/settings"),
          api.get("/results"),
          api.get("/minus-points"),
          api.get("/gallery"),
          api.get("/announcements")
        ]);
        
        setRequests(requestsRes.data);
        setSettingsState(settingsRes.data);
        setResults(resultsRes.data);
        setMinusPoints(minusRes.data);
        setGalleryItems(galleryRes.data);
        setAnnouncements(announceRes.data);
        console.log("Successfully synced data from MongoDB backend");
      } catch (error) {
        console.error("Failed to fetch data from backend. Using localStorage fallback:", error);
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataFromBackend();
  }, []);

  const setCurrentRole = (role: UserRole) => {
    setRoleState(role);
  };

  const clearError = () => {
    setError(null);
  };

  const addNotification = (message: string) => {
    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Actions
  const addRequest = async (
    requestData: Omit<PosterRequest, "requestId" | "createdAt" | "status">
  ) => {
    try {
      const response = await api.post("/requests", requestData);
      const newRequest = response.data;
      setRequests(prev => [newRequest, ...prev]);
      addNotification(`New request ${newRequest.requestId} for '${newRequest.programName}' has been submitted.`);
      return newRequest;
    } catch (error) {
      console.error("Failed to add request:", error);
      addNotification("Error: Failed to submit request to database.");
      throw error;
    }
  };

  const updateRequestStatus = async (
    id: string,
    status: PosterRequest["status"],
    remarks?: string
  ) => {
    try {
      const response = await api.put(`/requests/${id}/status`, { status, remarks });
      const updatedRequest = response.data;
      setRequests(prev =>
        prev.map(r => {
          if (r.requestId === id) {
            addNotification(`Request ${id} status updated to '${status}'.`);
            return updatedRequest;
          }
          return r;
        })
      );
    } catch (error) {
      console.error("Failed to update request status:", error);
      addNotification("Error: Failed to update request status in database.");
      throw error;
    }
  };

  const updateSettings = async (newSettings: SystemSettings) => {
    try {
      const response = await api.put("/settings", newSettings);
      const updatedSettings = response.data;
      setSettingsState(updatedSettings);
      addNotification("System settings have been updated.");
    } catch (error) {
      console.error("Failed to update settings:", error);
      addNotification("Error: Failed to update settings in database.");
      throw error;
    }
  };

  // Results Actions
  const addResult = async (resultData: Omit<Result, "points" | "isPublished"> & { isPublished?: boolean }) => {
    try {
      let points = 5;
      if (resultData.prize === "1st") points = 10;
      else if (resultData.prize === "2nd") points = 7;

      const isPublished = resultData.isPublished ?? false;
      const payload = { ...resultData, points, isPublished };
      const response = await api.post("/results", payload);
      const newResult = response.data;
      setResults(prev => [newResult, ...prev]);
      addNotification(`New draft result added for '${newResult.programName}'.`);
      return newResult;
    } catch (error) {
      console.error("Failed to add result:", error);
      const mockResult: Result = {
        _id: `res-${Date.now()}`,
        ...resultData,
        points: resultData.prize === "1st" ? 10 : resultData.prize === "2nd" ? 7 : 5,
        isPublished: resultData.isPublished ?? false,
        createdAt: new Date().toISOString()
      };
      setResults(prev => [mockResult, ...prev]);
      addNotification(`Draft result added locally (fallback) for '${mockResult.programName}'.`);
      return mockResult;
    }
  };

  const updateResult = async (id: string, resultData: Partial<Result>) => {
    try {
      const response = await api.put(`/results/${id}`, resultData);
      const updated = response.data;
      setResults(prev => prev.map(r => r._id === id ? updated : r));
      addNotification(`Result updated successfully.`);
    } catch (error) {
      console.error("Failed to update result:", error);
      setResults(prev => prev.map(r => r._id === id ? { ...r, ...resultData } : r));
    }
  };

  const deleteResult = async (id: string) => {
    try {
      await api.delete(`/results/${id}`);
      setResults(prev => prev.filter(r => r._id !== id));
      addNotification("Result deleted successfully.");
    } catch (error) {
      console.error("Failed to delete result:", error);
      setResults(prev => prev.filter(r => r._id !== id));
    }
  };

  const publishResult = async (id: string, isPublished: boolean) => {
    try {
      const response = await api.put(`/results/${id}/publish`, { isPublished });
      const updated = response.data;
      setResults(prev => prev.map(r => r._id === id ? updated : r));
      addNotification(`Result ${isPublished ? "published" : "hidden"} successfully.`);
    } catch (error) {
      console.error("Failed to publish result:", error);
      setResults(prev => prev.map(r => r._id === id ? { ...r, isPublished } : r));
    }
  };

  // Minus Points Actions
  const addMinusPoint = async (minusData: Omit<MinusPoint, "createdAt">) => {
    try {
      const response = await api.post("/minus-points", minusData);
      const newMinus = response.data;
      setMinusPoints(prev => [newMinus, ...prev]);
      addNotification(`Minus points applied to class ${newMinus.className}.`);
      return newMinus;
    } catch (error) {
      console.error("Failed to add minus point:", error);
      const mockMinus: MinusPoint = {
        _id: `minus-${Date.now()}`,
        ...minusData,
        createdAt: new Date().toISOString()
      };
      setMinusPoints(prev => [mockMinus, ...prev]);
      addNotification(`Minus points applied locally (fallback) to class ${mockMinus.className}.`);
      return mockMinus;
    }
  };

  const deleteMinusPoint = async (id: string) => {
    try {
      await api.delete(`/minus-points/${id}`);
      setMinusPoints(prev => prev.filter(m => m._id !== id));
      addNotification("Minus point deduction removed.");
    } catch (error) {
      console.error("Failed to delete minus point:", error);
      setMinusPoints(prev => prev.filter(m => m._id !== id));
    }
  };

  // Gallery Actions
  const addGalleryItem = async (itemData: Omit<GalleryItem, "createdAt">) => {
    try {
      const response = await api.post("/gallery", itemData);
      const newItem = response.data;
      setGalleryItems(prev => [newItem, ...prev]);
      addNotification(`Media gallery item '${newItem.title}' added.`);
      return newItem;
    } catch (error) {
      console.error("Failed to add gallery item:", error);
      const mockItem: GalleryItem = {
        _id: `gal-${Date.now()}`,
        ...itemData,
        createdAt: new Date().toISOString()
      };
      setGalleryItems(prev => [mockItem, ...prev]);
      addNotification(`Media gallery item '${mockItem.title}' added locally.`);
      return mockItem;
    }
  };

  const updateGalleryItem = async (id: string, itemData: Partial<GalleryItem>) => {
    try {
      const response = await api.put(`/gallery/${id}`, itemData);
      const updated = response.data;
      setGalleryItems(prev => prev.map(item => item._id === id ? updated : item));
    } catch (error) {
      console.error("Failed to update gallery item:", error);
      setGalleryItems(prev => prev.map(item => item._id === id ? { ...item, ...itemData } : item));
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      await api.delete(`/gallery/${id}`);
      setGalleryItems(prev => prev.filter(item => item._id !== id));
      addNotification("Gallery item deleted successfully.");
    } catch (error) {
      console.error("Failed to delete gallery item:", error);
      setGalleryItems(prev => prev.filter(item => item._id !== id));
    }
  };

  // Announcements Actions
  const addAnnouncement = async (announceData: Omit<Announcement, "createdAt">) => {
    try {
      const response = await api.post("/announcements", announceData);
      const newAnnounce = response.data;
      setAnnouncements(prev => [newAnnounce, ...prev]);
      addNotification(`New announcement published.`);
      return newAnnounce;
    } catch (error) {
      console.error("Failed to add announcement:", error);
      const mockAnnounce: Announcement = {
        _id: `ann-${Date.now()}`,
        ...announceData,
        createdAt: new Date().toISOString()
      };
      setAnnouncements(prev => [mockAnnounce, ...prev]);
      addNotification(`Announcement added locally.`);
      return mockAnnounce;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
      addNotification("Announcement deleted successfully.");
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
    }
  };

  const seedDemoData = async () => {
    try {
      await api.post("/seed");
      const [reqs, settingsRes, resultsRes, minusRes, galleryRes, announceRes] = await Promise.all([
        api.get("/requests"),
        api.get("/settings"),
        api.get("/results"),
        api.get("/minus-points"),
        api.get("/gallery"),
        api.get("/announcements")
      ]);
      setRequests(reqs.data);
      setSettingsState(settingsRes.data);
      setResults(resultsRes.data);
      setMinusPoints(minusRes.data);
      setGalleryItems(galleryRes.data);
      setAnnouncements(announceRes.data);
      setNotifications(initialNotifications);
      addNotification("Database seeded with sample demo requests.");
    } catch (error) {
      console.error("Failed to seed database:", error);
      setRequests(initialMockRequests);
      setSettingsState(defaultSettings);
      setResults(initialMockResults);
      setMinusPoints(initialMockMinusPoints);
      setGalleryItems(initialMockGallery);
      setAnnouncements(initialMockAnnouncements);
      setNotifications(initialNotifications);
      addNotification("Database seeded locally with mock datasets.");
    }
  };

  const clearDatabase = async () => {
    try {
      await api.delete("/clear");
      setRequests([]);
      setResults([]);
      setMinusPoints([]);
      setGalleryItems([]);
      setAnnouncements([]);
      addNotification("Database cleared.");
    } catch (error) {
      console.error("Failed to clear database:", error);
      setRequests([]);
      setResults([]);
      setMinusPoints([]);
      setGalleryItems([]);
      setAnnouncements([]);
      addNotification("Database cleared locally.");
    }
  };

  const fetchStudent = async (admissionNo: string) => {
    try {
      const response = await api.get(`/students/${admissionNo}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch student:", error);
      return null;
    }
  };

  const uploadDataset = async (collectionName: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("dataset", file);
      
      await api.post(`/upload/${collectionName}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      addNotification(`Dataset successfully uploaded to ${collectionName}. Please refresh to see changes.`);
    } catch (error) {
      console.error("Failed to upload dataset:", error);
      addNotification("Error: Failed to upload dataset.");
      throw error;
    }
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        currentRole,
        settings,
        notifications,
        results,
        minusPoints,
        galleryItems,
        announcements,
        addRequest,
        updateRequestStatus,
        updateSettings,
        setCurrentRole,
        addNotification,
        markNotificationsAsRead,
        seedDemoData,
        clearDatabase,
        addResult,
        updateResult,
        deleteResult,
        publishResult,
        addMinusPoint,
        deleteMinusPoint,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addAnnouncement,
        deleteAnnouncement,
        fetchStudent,
        uploadDataset,
        isLoading,
        error,
        clearError
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequests must be used within a RequestProvider");
  }
  return context;
}

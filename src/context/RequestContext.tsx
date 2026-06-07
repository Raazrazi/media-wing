import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { PosterRequest } from "../types/Request";
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
  addRequest: (request: Omit<PosterRequest, "requestId" | "createdAt" | "status">) => Promise<PosterRequest>;
  updateRequestStatus: (id: string, status: PosterRequest["status"], remarks?: string) => Promise<void>;
  updateSettings: (settings: SystemSettings) => Promise<void>;
  setCurrentRole: (role: UserRole) => void;
  addNotification: (message: string) => void;
  markNotificationsAsRead: () => void;
  seedDemoData: () => Promise<void>;
  clearDatabase: () => Promise<void>;
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
  chairman: "Prof. K. A. Rahman",
  deadline: 48,
  email: "media@union.edu"
};

const initialNotifications: ActivityNotification[] = [
  {
    id: "notif-1",
    message: "Request REQ-2026-003 for 'College Archives Exhibition' was rejected due to exam conflict.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false
  },
  {
    id: "notif-2",
    message: "Request REQ-2026-002 for 'World Cup Panel Discussion' was approved by Chairman.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: false
  },
  {
    id: "notif-3",
    message: "New poster request REQ-2026-001 submitted by Hajj Campaign Committee.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true
  }
];

export function RequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<PosterRequest[]>(() => {
    const saved = localStorage.getItem("union_media_requests");
    return saved ? JSON.parse(saved) : initialMockRequests;
  });

  const [currentRole, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem("union_media_role");
    return (saved as UserRole) || "Media Chairman"; // Default to admin for easier evaluation
  });

  const [settings, setSettingsState] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem("union_media_settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [notifications, setNotifications] = useState<ActivityNotification[]>(() => {
    const saved = localStorage.getItem("union_media_notifications");
    return saved ? JSON.parse(saved) : initialNotifications;
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

  // Fetch data from backend on mount
  useEffect(() => {
    const fetchDataFromBackend = async () => {
      try {
        const [requestsRes, settingsRes] = await Promise.all([
          api.get("/requests"),
          api.get("/settings")
        ]);
        
        setRequests(requestsRes.data);
        setSettingsState(settingsRes.data);
        console.log("Successfully synced data from MongoDB backend");
      } catch (error) {
        console.error("Failed to fetch data from backend. Using localStorage fallback:", error);
        // Already initialized with localStorage data, so no action needed
      }
    };

    fetchDataFromBackend();
  }, []); // Run only on mount

  const setCurrentRole = (role: UserRole) => {
    setRoleState(role);
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

  const addRequest = async (
    requestData: Omit<PosterRequest, "requestId" | "createdAt" | "status">
  ) => {
    try {
      // Call backend API to save to MongoDB
      const response = await api.post("/requests", requestData);
      const newRequest = response.data;
      
      // Update local state
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
      // Call backend API to update in MongoDB
      const response = await api.put(`/requests/${id}/status`, { status, remarks });
      const updatedRequest = response.data;
      
      // Update local state
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
      // Call backend API to update in MongoDB
      const response = await api.put("/settings", newSettings);
      const updatedSettings = response.data;
      
      // Update local state
      setSettingsState(updatedSettings);
      addNotification("System settings have been updated.");
    } catch (error) {
      console.error("Failed to update settings:", error);
      addNotification("Error: Failed to update settings in database.");
      throw error;
    }
  };

  const seedDemoData = async () => {
    try {
      // Call backend API to seed database
      await api.post("/seed");
      
      // Refresh local state from backend
      const response = await api.get("/requests");
      setRequests(response.data);
      
      const settingsResponse = await api.get("/settings");
      setSettingsState(settingsResponse.data);
      
      setNotifications(initialNotifications);
      addNotification("Database seeded with sample demo requests.");
    } catch (error) {
      console.error("Failed to seed database:", error);
      addNotification("Error: Failed to seed database.");
      throw error;
    }
  };

  const clearDatabase = async () => {
    try {
      // Call backend API to clear database
      await api.delete("/clear");
      
      // Update local state
      setRequests([]);
      addNotification("Database cleared.");
    } catch (error) {
      console.error("Failed to clear database:", error);
      addNotification("Error: Failed to clear database.");
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
        addRequest,
        updateRequestStatus,
        updateSettings,
        setCurrentRole,
        addNotification,
        markNotificationsAsRead,
        seedDemoData,
        clearDatabase
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

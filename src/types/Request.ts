export interface PosterRequest {
  _id?: string;
  requestId: string;
  programName: string;
  programTitle: string;
  venue: string;
  committee: string;
  category: string;
  description: string;
  posterRequirements: string;
  contactPerson: string;
  email: string;
  eventDateTime: string;
  priority: "Normal" | "High" | "Urgent";
  status: "Pending" | "Approved" | "Rejected" | "Completed" | "On Hold";
  remarks?: string;
  createdAt: string;
}

export interface SystemSettings {
  portalName: string;
  chairman: string;
  deadline: number;
  email: string;
}
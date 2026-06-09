export interface MinusPoint {
  _id?: string;
  className: "SIDRA" | "USRA" | "WAFD" | "WIDAD" | "ITHIHAD" | "IFADA";
  reason: string;
  points: number;
  approvedBy: string;
  date: string;
  createdAt?: string;
}

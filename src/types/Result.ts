export interface Result {
  _id?: string;
  programName: string;
  studentName: string;
  className: "SIDRA" | "USRA" | "WAFD" | "WIDAD" | "ITHIHAD" | "IFADA";
  prize: "1st" | "2nd" | "3rd";
  points: number;
  isPublished: boolean;
  createdAt?: string;
}

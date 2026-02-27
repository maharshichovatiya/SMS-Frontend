import api from "../Axios";
import { Student } from "./Student";

export interface DashboardSummary {
  students: number;
  teachers: number;
  classes: number;
  subjects: number;
}

// RecentAdmission is now the same as Student
export type RecentAdmission = Student;

export interface RecentTeacher {
  id: string;
  employeeCode: string;
  designation: string;
  highestQualification: string;
  specialization: string | null;
  totalExpMonths: number;
  dateOfJoining: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto: string | null;
  };
}

export interface RecentAdmissionsResponse {
  statusCode: number;
  message: string;
  data: Student[];
  Total_Records: number;
}

export interface RecentTeachersResponse {
  statusCode: number;
  message: string;
  data: RecentTeacher[];
  Total_Records: number;
}

export interface DashboardSummaryResponse {
  statusCode: number;
  message: string;
  data: DashboardSummary;
}

export const dashboardApis = {
  getSummary: async () => {
    const res = await api.get<DashboardSummaryResponse>("/dashboard/summary");
    return res.data;
  },
  getRecentAdmissions: async () => {
    const res = await api.get<RecentAdmissionsResponse>(
      "/dashboard/recent-admission",
      { params: { page: 1, limit: 20 } },
    );
    return res.data;
  },
  getRecentTeachers: async () => {
    const res = await api.get<RecentTeachersResponse>(
      "/dashboard/recent-teachers",
    );
    return res.data;
  },
};

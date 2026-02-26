import api from "./Client";

export interface DashboardSummary {
  students: number;
  teachers: number;
  classes: number;
  subjects: number;
}

export interface RecentAdmission {
  student_id: string;
  student_admission_no: string;
  student_admission_date: string;
  user_first_name: string;
  user_last_name: string;
  academicYear_year_name: string;
  class_class_no: number;
  class_section: string;
}

export interface RecentTeacher {
  teacher_id: string;
  teacher_employee_no: string;
  teacher_joining_date: string;
  user_first_name: string;
  user_last_name: string;
  teacher_specialization: string;
  teacher_qualification: string;
  teacher_experience: number;
}

export interface RecentAdmissionsResponse {
  statusCode: number;
  message: string;
  data: RecentAdmission[];
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

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

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  passingMarks?: number;
  maxMarks?: number;
}

export interface ClassData {
  classId: string;
  className: string;
  section: string;
  studentCount: number;
  students?: Student[];
  subjects?: Subject[];
}

export interface TeacherDashboardSummary {
  totalStudents: number;
  classes: ClassData[];
  summary: {
    totalClasses: number;
    averageStudentsPerClass: number;
  };
}

export interface ClassDashboardResponse {
  statusCode: number;
  message: string;
  data: {
    totalStudents: number;
    classes: ClassData[];
    subjects: number;
    summary: {
      totalClasses: number;
      totalSubjects: number;
      averageStudentsPerClass: number;
    };
  };
}

export interface SubjectDashboardResponse {
  statusCode: number;
  message: string;
  data: {
    totalSubjects: number;
    totalClasses: number;
    subjectsByClass: {
      classId: string;
      className: string;
      section: string;
      subjects: Subject[];
    }[];
    summary: {
      averageSubjectsPerClass: number;
    };
  };
}

export interface TeacherDashboardResponse {
  statusCode: number;
  message: string;
  data: TeacherDashboardSummary;
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
  getTeacherDashboardData: async () => {
    const res = await api.get<TeacherDashboardResponse>(
      "/dashboard/students/classteacher",
    );
    return res.data;
  },
  getClassData: async () => {
    const res = await api.get<ClassDashboardResponse>(
      "/dashboard/students/class",
    );
    return res.data;
  },
  getSubjectData: async () => {
    const res = await api.get<SubjectDashboardResponse>("/dashboard/subjects");
    return res.data;
  },
};

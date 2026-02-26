import api from "./Client";

export interface Chapter {
  id: string;
  chapterNo: number;
  chapterName: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  subjectName: string;
  subjectCode: string;
  passingMarks: number;
  maxMarks: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
}

export interface ClassSubject {
  id: string;
  subject: Subject;
}

export interface Class {
  id: string;
  classNo: number;
  section: string;
  classTeacherId: string | null;
  studentCapacity: number | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  classSubjects: ClassSubject[];
  classTeacher: null | {
    id: string;
    name: string;
    email: string;
  };
}

export interface AcademicYear {
  id: string;
  yearName: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: "active" | "completed" | "upcoming";
}

export interface ClassListResponse {
  statusCode: number;
  message: string;
  data: Class[];
  Total_Records: number;
}

export interface AcademicYearListResponse {
  data: AcademicYear[];
}

export const classApis = {
  getAll: async () => {
    const res = await api.get<ClassListResponse>("/classes");
    return res.data;
  },

  getAcademicYears: async (): Promise<AcademicYear[]> => {
    const res = await api.get<AcademicYearListResponse>("/academic-year");
    return res.data.data;
  },

  assignStudentToClass: async (
    studentId: string,
    classId: string,
    academicYearId: string,
  ): Promise<void> => {
    await api.post("/student-academic", {
      studentId,
      classId,
      academicYearId,
    });
  },
};

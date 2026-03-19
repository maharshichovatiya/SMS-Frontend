import api from "../Axios";

export interface ClassTeacherStudent {
  id: string;
  name: string;
  status: string;
}

export interface ClassTeacherClass {
  id: string;
  className: string;
  students: ClassTeacherStudent[];
}

export interface ClassTeacherData {
  class: ClassTeacherClass;
}

export interface Subject {
  id: string;
  subjectName: string;
  students: ClassTeacherStudent[];
}

export interface ClassWithSubjects {
  id: string;
  className: string;
  subjects: Subject[];
}

export interface StudentSummary {
  totalStudents: number;
  totalActiveStudents: number;
  totalInactiveStudents: number;
}

export interface ClassTeacherResponse {
  statusCode: number;
  message: string;
  data: {
    statusCode: number;
    message: string;
    data: {
      classTeacher: ClassTeacherData;
      classes: ClassWithSubjects[];
      studentSummary: StudentSummary;
    };
  };
}

export const fetchClassTeacherData = async (): Promise<ClassTeacherData> => {
  const response = await api.get<ClassTeacherResponse>("/dashboard/teacher");
  return response.data.data.data.classTeacher;
};

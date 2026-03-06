export interface Chapter {
  id?: string;
  chapterName: string;
  chapterNo: number;
  status?: string;
}

export interface Teacher {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  // Additional fields from API response
  status?: string;
  userId?: string;
  employeeCode?: string;
  staffCategory?: string;
  department?: string;
  designation?: string;
  highestQualification?: string;
  specialization?: string;
  totalExpMonths?: number;
  salaryPackage?: string;
  dateOfJoining?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Class {
  id: string;
  className: string;
  section: string;
  classTeacherId: string | null;
  studentCapacity: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  classSubjects: ClassSubjectItem[];
}

export interface ClassSubjectItem {
  id: string;
  subject: Subject;
  teacher?: Teacher;
}

export interface Subject {
  id: string;
  subjectName: string;
  subjectCode: string;
  passingMarks: number;
  maxMarks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[];

  classInfo?: {
    id: string;
    className: string;
    section: string;
  };

  classSubjectId?: string;
}

export interface SubjectWithClassSubjects {
  id: string;
  subjectName: string;
  subjectCode: string;
  passingMarks: number;
  maxMarks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[];
  classSubjects?: {
    id: string;
    class: {
      id: string;
      className: string;
      section: string;
      classTeacherId?: string;
      studentCapacity?: number;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    teacher?: {
      id: string;
      status: string;
      userId: string;
      employeeCode: string;
      staffCategory: string;
      department: string;
      designation: string;
      highestQualification?: string;
      specialization?: string;
      totalExpMonths?: number;
      salaryPackage?: string;
      dateOfJoining?: string;
      createdAt: string;
      updatedAt: string;
    };
  }[];
}

export interface SubjectWithClasses {
  id: string;
  subjectName: string;
  subjectCode: string;
  passingMarks: number;
  maxMarks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[]; // Direct chapters array in subject

  classSubjects: {
    id: string;
    class: {
      id: string;
      className: string;
      section: string;
      classTeacherId: string | null;
      studentCapacity: number;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    teacher?: Teacher;
  }[];
}

/* =========================
   REQUEST TYPES
========================= */

export interface CreateSubjectData {
  subjectName: string;
  subjectCode: string;
  passingMarks: number;
  maxMarks: number;
  chapters: Chapter[];
}

export interface UpdateSubjectData {
  subjectName?: string;
  subjectCode?: string;
  passingMarks?: number;
  maxMarks?: number;
  chapters?: Chapter[];
  status?: "active" | "inactive";
}

export interface AssignClassData {
  subjectId: string;
  classId: string;
  teacherId: string;
}

export interface SubjectListResponse {
  data: Subject[];
}

export interface ClassSubjectListResponse {
  statusCode: number;
  message: string;
  data: Class[];
  Total_Records: number;
}

export interface AssignClassResponse {
  id: string;
  subjectId: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

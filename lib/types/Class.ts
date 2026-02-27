// Shared user interface
export interface StaffUser {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  profilePhoto?: string | null;
}

// Shared teacher/staff interface
export interface StaffMember {
  id: string;
  status: string;
  userId: string;
  employeeCode: string;
  staffCategory: string;
  department: string;
  designation: string;
  highestQualification: string;
  specialization?: string | null;
  totalExpMonths: number;
  salaryPackage: string;
  dateOfJoining: string;
  createdAt: string;
  updatedAt: string;
  user: StaffUser | null;
}

export interface ClassSubjectDetail {
  id: string;
  subjectName: string;
  subjectCode: string;
  passingMarks: number;
  maxMarks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassSubject {
  id: string;
  subject: ClassSubjectDetail;
  teacher: StaffMember | null;
}

export interface ClassItem {
  id: string;
  classNo: number | string;
  section: string;
  classTeacherId: string | null;
  studentCapacity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  classTeacher: StaffMember | null;
  classSubjects: ClassSubject[];
  studentAcademics?: unknown[];
  studentCount: number;
  subjectCount: number;
  teacherCount: number;
}

export interface GetClassesResponse {
  success: boolean;
  data?: ClassItem[];
  total?: number;
  message?: string;
}

export interface CreateClassResponse {
  success: boolean;
  data?: ClassItem;
  message?: string;
}

export interface UpdateClassResponse {
  success: boolean;
  data?: ClassItem;
  message?: string;
}

export interface DeleteClassResponse {
  success: boolean;
  message?: string;
}

import { ClassFormData } from "@/lib/validations/classForm";

export interface ClassTeacherUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ClassTeacher {
  id: string;
  status: string;
  userId: string;
  employeeCode: string;
  staffCategory: string;
  department: string;
  designation: string;
  highestQualification: string;
  specialization?: string;
  totalExpMonths: number;
  salaryPackage: string;
  dateOfJoining: string;
  createdAt: string;
  updatedAt: string;
  user?: ClassTeacherUser;
}

export interface ClassItem {
  id: string;
  classNo: string;
  section: string;
  classTeacherId: string;
  studentCapacity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  classTeacher: ClassTeacher;
}

export interface GetClassesResponse {
  success: boolean;
  data?: ClassItem[];
  total?: number;
  message?: string;
}

export interface GetClassResponse {
  success: boolean;
  data?: ClassItem;
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

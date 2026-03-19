import { AxiosError } from "axios";
import api from "@/lib/Axios";

export interface StudentUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  phone: string;
  gender: string;
  dob: string;
  bloodGroup: string | null;
  aadhaarNo: string | null;
  panNo: string | null;
  permanentAddress: string | null;
  currentAddress: string | null;
  profilePhoto: string | null;
  bankName: string | null;
  accountNo: string | null;
  ifscCode: string | null;
  branch: string | null;
  tokenVersion: number;
  school: {
    id: string;
    name: string;
    address: string;
    affiliationBoard: string;
    establishmentYear: number;
    schoolCode: string;
    contact: string;
    emailOfficial: string;
    emailAdmin: string;
    websiteUrl: string | null;
    logoUrl: string | null;
    schoolTimingStart: string | null;
    schoolTimingEnd: string | null;
    mediumOfInstruction: string;
    type: string;
  };
  role: {
    id: string;
    roleName: string;
  };
}

export interface AcademicYear {
  id: string;
  yearName: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  schoolId: string;
  className: string;
  section: string;
  classTeacherId: string | null;
  studentCapacity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Academic {
  id: string;
  rollNo: string | null;
  promotionStatus: string | null;
  percentage: string | null;
  remarks: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  academicYear: AcademicYear;
  class: Class;
}

export interface StudentProfileData {
  id: string;
  admissionNo: string;
  rollNo: string | null;
  admissionDate: string;
  fatherName: string | null;
  fatherPhone: string | null;
  motherName: string | null;
  guardianName: string | null;
  familyAnnualIncome: string | null;
  medicalConditions: string | null;
  status: string;
  user: StudentUser;
  academics: Academic[];
}

export interface StudentProfileResponse {
  statusCode: number;
  message: string;
  data: {
    success: boolean;
    data: StudentProfileData;
    message: string;
  };
}

export const getStudentProfile = async (): Promise<StudentProfileData> => {
  try {
    const response = await api.get<StudentProfileResponse>(
      "/student/profile/me",
    );
    return response.data.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || "Failed to fetch student profile",
    );
  }
};

export interface UpdateStudentProfilePayload {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  phone?: string | null;
  gender?: string;
  dob?: string;
  bloodGroup?: string | null;
  aadhaarNo?: string | null;
  panNo?: string | null;
  permanentAddress?: string | null;
  currentAddress?: string | null;
  bankName?: string | null;
  accountNo?: string | null;
  ifscCode?: string | null;
  branch?: string | null;
  password?: string;
}

export const updateStudentProfile = async (
  id: string,
  payload: UpdateStudentProfilePayload,
): Promise<StudentProfileData> => {
  try {
    const response = await api.patch<StudentProfileResponse>(
      `/student/profile/${id}`,
      payload,
    );
    return response.data.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || "Failed to update student profile",
    );
  }
};

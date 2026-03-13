import { AxiosError } from "axios";
import api from "@/lib/Axios";
import { getFromLocalStorage } from "@/lib/utils/localStorage";
import { ApiResponse } from "../types/Teacher";

export interface TeacherProfileData {
  id: string;
  status: "active" | "inactive";
  userId: string;
  employeeCode: string;
  staffCategory: string;
  department: string;
  designation: string;
  highestQualification: string;
  specialization: string | null;
  totalExpMonths: number | null;
  salaryPackage: string;
  dateOfJoining: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
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
    school: {
      id: string;
      name: string;
      address: string;
      affiliationBoard: string;
      establishmentYear: string | null;
      schoolCode: string | null;
      contact: string | null;
      emailOfficial: string | null;
      emailAdmin: string | null;
      websiteUrl: string | null;
      logoUrl: string | null;
      schoolTimingStart: string | null;
      schoolTimingEnd: string | null;
      mediumOfInstruction: string | null;
      type: string | null;
    };
    role: {
      id: string;
      roleName: string;
    };
  };
}

export interface TeacherProfileResponse {
  statusCode: number;
  message: string;
  data: TeacherProfileData;
}

export interface UpdateTeacherProfilePayload {
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

export const getTeacherProfile = async (): Promise<TeacherProfileData> => {
  try {
    const userId = getFromLocalStorage("userId");

    if (!userId) {
      throw new Error("User ID not found in localStorage");
    }

    const apiUrl = `/teachers/user/${userId}`;

    const response = await api.get<TeacherProfileResponse>(apiUrl);

    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || "Failed to fetch teacher profile",
    );
  }
};

export const updateTeacherProfile = async (
  id: string,
  payload: UpdateTeacherProfilePayload,
): Promise<ApiResponse<TeacherProfileData>> => {
  try {
    const response = await api.patch<TeacherProfileResponse>(
      `/teachers/profile/${id}`,
      payload,
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;

    return {
      success: false,
      message:
        err.response?.data?.message || "Failed to update teacher profile",
    };
  }
};

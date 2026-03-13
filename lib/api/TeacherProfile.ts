import { AxiosError } from "axios";
import api from "@/lib/Axios";

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
    const response = await api.get<TeacherProfileResponse>("/teachers/profile");
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
): Promise<TeacherProfileData> => {
  try {
    const body: Partial<UpdateTeacherProfilePayload> = {
      firstName: payload.firstName,
      lastName: payload.lastName,
    };

    if (payload.middleName !== undefined) {
      body.middleName = payload.middleName;
    }

    if (payload.phone !== undefined) {
      body.phone = payload.phone;
    }

    if (payload.gender !== undefined) {
      body.gender = payload.gender;
    }

    if (payload.dob !== undefined) {
      body.dob = payload.dob;
    }

    if (payload.bloodGroup !== undefined) {
      body.bloodGroup = payload.bloodGroup;
    }

    if (payload.aadhaarNo !== undefined) {
      body.aadhaarNo = payload.aadhaarNo;
    }

    if (payload.panNo !== undefined) {
      body.panNo = payload.panNo;
    }

    if (payload.permanentAddress !== undefined) {
      body.permanentAddress = payload.permanentAddress;
    }

    if (payload.currentAddress !== undefined) {
      body.currentAddress = payload.currentAddress;
    }

    if (payload.bankName !== undefined) {
      body.bankName = payload.bankName;
    }

    if (payload.accountNo !== undefined) {
      body.accountNo = payload.accountNo;
    }

    if (payload.ifscCode !== undefined) {
      body.ifscCode = payload.ifscCode;
    }

    if (payload.branch !== undefined) {
      body.branch = payload.branch;
    }

    if (payload.password) {
      body.password = payload.password;
    }

    const response = await api.patch<TeacherProfileResponse>(
      `/teachers/profile/${id}`,
      body,
    );
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || "Failed to update teacher profile",
    );
  }
};

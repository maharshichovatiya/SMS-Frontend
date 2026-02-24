import api from "./client";
import { PersonalDetails } from "@/lib/validations/signupSchema";

interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface BackendSchoolTypes {
  name: string;
  type: "private" | "govt" | "aided";
  address: string;
  emailOfficial: string;
  contact: string;
  mediumOfInstruction: "english" | "hindi";
  affiliationBoard: "cbse" | "icse" | "state" | "ib" | "cambridge";
  schoolCode?: string;
  establishmentYear?: number;
  emailAdmin?: string;
  websiteUrl?: string;
}

export interface Role {
  id: string;
  roleName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolResponse {
  id: string;
}

export interface SignupPayload extends PersonalDetails {
  schoolId: string;
}

export const authApi = {
  getRoles: () => api.get<ApiResponse<Role[]>>("/role"),

  signup: (data: SignupPayload) =>
    api.post<ApiResponse<{ id: string }>>("/auth/register", data),

  createSchool: (schoolData: BackendSchoolTypes) =>
    api.post<ApiResponse<SchoolResponse>>("/school", schoolData),
};

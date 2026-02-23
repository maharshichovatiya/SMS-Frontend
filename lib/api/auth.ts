import api from "./client";
import { PersonalDetails } from "@/lib/validations/signupSchema";

export interface BackendSchoolDto {
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

export const getRoles = () => api.get("/role");

export const signup = (data: PersonalDetails & { schoolId: string }) =>
  api.post("auth/register", data);

export const createSchool = (schoolData: BackendSchoolDto) =>
  api.post("school", schoolData);

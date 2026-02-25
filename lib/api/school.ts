import { AxiosError } from "axios";
import api from "@/lib/axios";

export interface SchoolData {
  id: string;
  name: string;
  address: string | null;
  affiliationBoard: string | null;
  establishmentYear: number | null;
  schoolCode: string | null;
  contact: string | null;
  emailOfficial: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  schoolTimingStart: string | null;
  schoolTimingEnd: string | null;
  mediumOfInstruction: string | null;
}

export interface SchoolResponse {
  statusCode: number;
  message: string;
  data: SchoolData;
}

export const getSchoolById = async (id: string): Promise<SchoolData> => {
  try {
    const response = await api.get<SchoolResponse>(`/school/${id}`);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to fetch school");
  }
};

export const updateSchool = async (
  id: string,
  payload: Partial<SchoolData>,
): Promise<SchoolData> => {
  try {
    const response = await api.patch<SchoolResponse>(`/school/${id}`, payload);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to update school");
  }
};

export const deleteSchool = async (id: string): Promise<void> => {
  try {
    await api.delete(`/school/${id}`);
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to delete school");
  }
};

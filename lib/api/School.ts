import { AxiosError } from "axios";
import api from "@/lib/Axios";
import { SchoolData, SchoolResponse } from "../types/School";

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

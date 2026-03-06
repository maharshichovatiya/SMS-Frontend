import { AxiosError } from "axios";
import { ClassFormData } from "@/lib/validations/ClassSchema";
import {
  GetClassesResponse,
  CreateClassResponse,
  UpdateClassResponse,
  DeleteClassResponse,
} from "@/lib/types/Class";
import api from "../Axios";

export const getClassSummary = async (
  search?: string,
  availability?: string,
  type?: string,
  section?: string,
  capacity?: string,
  studentCount?: string,
  page: number = 1,
  limit: number = 9,
): Promise<GetClassesResponse> => {
  try {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (availability) params.availability = availability;
    if (type) params.type = type;
    if (section) params.section = section;
    if (capacity) params.capacity = capacity;
    if (studentCount) params.studentCount = studentCount;
    params.page = String(page);
    params.limit = String(limit);

    const res = await api.get("/classes/class-summary", { params });

    return {
      success: true,
      data: res.data.data.data,
      total: res.data.data.meta?.total,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch classes.",
    };
  }
};
export const createClass = async (
  data: ClassFormData,
): Promise<CreateClassResponse> => {
  try {
    const res = await api.post("/classes", data);
    return { success: true, data: res.data.data };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to create class.",
    };
  }
};

export const updateClass = async (
  id: string,
  data: Partial<ClassFormData>,
): Promise<UpdateClassResponse> => {
  try {
    const res = await api.patch(`/classes/${id}`, data);
    return { success: true, data: res.data.data };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update class.",
    };
  }
};

export const deleteClass = async (id: string): Promise<DeleteClassResponse> => {
  try {
    await api.delete(`/classes/${id}`);
    return { success: true };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to delete class.",
    };
  }
};

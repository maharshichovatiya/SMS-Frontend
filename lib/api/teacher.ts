import { AxiosError } from "axios";
import api from "@/lib/axios";
import { GetTeachers, Teacher } from "../types/Teacher";

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiError = {
  success: false;
  message: string;
};

type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Matches actual API response shape:
// { statusCode, message, data: { data: [...], Total_Records: number } }
export type GetTeachersResponse = {
  statusCode: number;
  message: string;
  data: {
    data: GetTeachers[];
    Total_Records: number;
  };
};

export const getAllTeachers = async (): Promise<{
  success: boolean;
  data?: GetTeachers[];
  total?: number;
  message?: string;
}> => {
  try {
    const res = await api.get<GetTeachersResponse>("/teachers");

    return {
      success: true,
      data: res.data.data.data,
      total: res.data.data.Total_Records,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;

    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch teachers.",
    };
  }
};

export const createTeacher = async (
  data: Teacher,
): Promise<ApiResponse<Teacher>> => {
  try {
    const res = await api.post<Teacher>("/teachers", data);

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;

    return {
      success: false,
      message: err.response?.data?.message || "Failed to create teacher.",
    };
  }
};

export const updateTeacher = async (
  id: string,
  data: Partial<Teacher>,
): Promise<ApiResponse<Teacher>> => {
  try {
    const res = await api.patch(`/teachers/${id}`, data);

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;

    return {
      success: false,
      message: err.response?.data?.message || "Failed to update teacher.",
    };
  }
};

export const deleteTeacher = async (id: string): Promise<ApiResponse<null>> => {
  try {
    await api.delete(`/teachers/${id}`);

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;

    return {
      success: false,
      message: err.response?.data?.message || "Failed to delete teacher.",
    };
  }
};

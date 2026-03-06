import { AxiosError } from "axios";
import api from "@/lib/Axios";
import { ApiResponse, GetTeachers, Teacher } from "../types/Teacher";

export type GetTeachersResponse = {
  statusCode: number;
  message: string;
  data: {
    data: GetTeachers[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
};

export const getAllTeachers = async (
  search?: string,
  department?: string,
  gender?: string,
  staffCategory?: string,
  status?: string,
  experience?: string,
  salary?: string,
  ageGroup?: string,
  tenure?: string,
  page: number = 1,
  limit: number = 9,
): Promise<{
  success: boolean;
  data?: GetTeachers[];
  total?: number;
  message?: string;
}> => {
  try {
    const params: Record<string, string> = {};

    if (search) params.search = search;
    if (department) params.department = department;
    if (gender) params.gender = gender;
    if (staffCategory) params.staffType = staffCategory;
    if (status) params.status = status;
    if (experience) params.experienceRange = experience;
    if (salary) params.salaryRange = salary;
    if (ageGroup) params.ageGroup = ageGroup;
    if (tenure) params.tenure = tenure;
    params.page = String(page);
    params.limit = String(limit);

    const res = await api.get<GetTeachersResponse>("/teachers", { params });

    return {
      success: true,
      data: res.data.data.data,
      total: res.data.data.meta.total,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch teachers.",
    };
  }
};

export const updateTeacherStatus = async (
  id: string,
  status: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    await api.patch(`/teachers/status/${id}`, { status });
    return { success: true };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update status",
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

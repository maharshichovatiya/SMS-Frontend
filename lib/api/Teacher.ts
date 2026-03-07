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

export const getTeachersForAssignClass = async (): Promise<{
  success: boolean;
  data?: {
    id: string;
    employeeCode: string;
    staffCategory: string;
    department: string;
    designation: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      school: {
        id: string;
        name: string;
      };
    };
  }[];
  message?: string;
}> => {
  try {
    const res = await api.get("/teachers/findallassignclass");
    return {
      success: true,
      data: res.data.data,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch teachers",
    };
  }
};

export const getAllTeachers = async (
  search?: string,
  department?: string[],
  gender?: string[],
  staffCategory?: string[],
  status?: string[],
  experience?: string[],
  salary?: string[],
  ageGroup?: string[],
  tenure?: string[],
  page: number = 1,
  limit: number = 6,
): Promise<{
  success: boolean;
  data?: GetTeachers[];
  total?: number;
  message?: string;
}> => {
  try {
    const res = await api.get<GetTeachersResponse>("/teachers", {
      params: {
        search: search || undefined,
        department: department?.length ? department : undefined,
        gender: gender?.length ? gender : undefined,
        staffType: staffCategory?.length ? staffCategory : undefined,
        status: status?.length ? status : undefined,
        experienceRange: experience?.length ? experience : undefined,
        salaryRange: salary?.length ? salary : undefined,
        ageGroup: ageGroup?.length ? ageGroup : undefined,
        tenure: tenure?.length ? tenure : undefined,
        page: String(page),
        limit: String(limit),
      },
      paramsSerializer: {
        indexes: null,
      },
    });

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

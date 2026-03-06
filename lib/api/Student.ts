import api from "../Axios";
import { StudentFormValues } from "@/lib/validations/StudentSchema";
import { ApiResponse } from "../types/Auth";
import {
  Student,
  StudentListResponse,
  StudentQueryParams,
  RecordStatus,
} from "@/lib/types/StudentTypes";

// Re-export types for backward compatibility
export type { Student, StudentListResponse, StudentQueryParams };
export { RecordStatus };

const filterEmptyOptionalFields = (
  data:
    | StudentFormValues
    | Partial<StudentFormValues>
    | (Omit<StudentFormValues, "familyAnnualIncome"> & {
        familyAnnualIncome?: number;
      }),
) => {
  const filteredData: Record<string, string | number> = {};

  Object.keys(data).forEach(key => {
    const value = data[key as keyof typeof data];

    if (value !== "" && value !== null && value !== undefined) {
      filteredData[key] = value;
    }
  });

  return filteredData;
};

export const studentApis = {
  getAll: async (params?: StudentQueryParams) => {
    // Convert classId and gender arrays to comma-separated strings for API
    const convertedParams = params
      ? {
          ...params,
          classId: Array.isArray(params.classId)
            ? params.classId.join(",")
            : params.classId,
          gender: Array.isArray(params.gender)
            ? params.gender.join(",")
            : params.gender,
        }
      : params;

    const res = await api.get<ApiResponse<StudentListResponse>>("/student", {
      params: convertedParams,
    });
    return res.data;
  },
  addStudent: async (
    data: (Omit<StudentFormValues, "familyAnnualIncome"> & {
      familyAnnualIncome?: number;
      roleId: string;
      schoolId: string;
    }) & {
      academic?: {
        classId: string;
        academicYearId: string;
        rollNo?: string | null;
      };
    },
  ) => {
    const filteredData = filterEmptyOptionalFields(data);
    const res = await api.post<ApiResponse<Student>>("/student", filteredData);
    return res.data;
  },
  updateStudent: async (
    id: string,
    data: Partial<StudentFormValues> & {
      academic?: {
        classId: string;
        academicYearId: string;
        rollNo?: string | null;
      };
    },
  ) => {
    const filteredData = filterEmptyOptionalFields(data);

    const res = await api.patch<ApiResponse<Student>>(
      `/student/${id}`,
      filteredData,
    );
    return res.data;
  },
  deleteStudent: async (id: string) => {
    const res = await api.delete<ApiResponse<void>>(`/student/${id}`);
    return res.data;
  },
  updateStudentStatus: async (id: string, status: "active" | "inactive") => {
    const res = await api.patch<ApiResponse<Student>>(`/student/status/${id}`, {
      status,
    });
    return res.data;
  },
};

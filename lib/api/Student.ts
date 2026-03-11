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
    | (Omit<StudentFormValues, "familyAnnualIncome" | "rollNo"> & {
        familyAnnualIncome?: number;
      })
    | ((Omit<StudentFormValues, "familyAnnualIncome" | "rollNo"> & {
        familyAnnualIncome?: number;
        roleId: string;
        schoolId: string;
      }) & {
        academic?: {
          classId: string;
          academicYearId: string;
          rollNo?: string | null;
        };
      }),
) => {
  const filteredData: Record<string, unknown> = {};

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
    if (!params) {
      const res = await api.get<ApiResponse<StudentListResponse>>("/student");
      return res.data;
    }

    // Convert classId and gender arrays to comma-separated strings for API
    // Only include the parameter if it has values
    const convertedParams: Record<string, string | number | undefined> = {};

    Object.keys(params).forEach(key => {
      const value = params[key as keyof StudentQueryParams];

      if (value !== undefined && value !== null && value !== "") {
        if (key === "classId" && Array.isArray(value)) {
          if (value.length > 0) {
            convertedParams[key] = value.join(",");
          }
        } else if (key === "gender" && Array.isArray(value)) {
          if (value.length > 0) {
            convertedParams[key] = value.join(",");
          }
        } else {
          // Type assertion for non-array values
          (convertedParams as Record<string, string | number>)[key] = value as
            | string
            | number;
        }
      }
    });

    const res = await api.get<ApiResponse<StudentListResponse>>("/student", {
      params: convertedParams,
    });
    return res.data;
  },
  addStudent: async (
    data: (Omit<StudentFormValues, "familyAnnualIncome" | "rollNo"> & {
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
    const filteredData: Record<string, unknown> = {};
    Object.keys(data).forEach(key => {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined) {
        filteredData[key] = value;
      }
    });

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

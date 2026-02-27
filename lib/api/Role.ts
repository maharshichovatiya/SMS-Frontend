import { AxiosError } from "axios";
import api from "@/lib/Axios";
import { GetRoleResponse, Role } from "../types/Role";

export const getRoles = async (): Promise<{
  success: boolean;
  data?: Role[];
  message?: string;
}> => {
  try {
    const res = await api.get<GetRoleResponse>("/role");

    return {
      success: true,
      data: res.data.data,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;

    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch roles.",
    };
  }
};

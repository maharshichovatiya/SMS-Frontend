import { AxiosError } from "axios";
import { ClassFormData } from "@/lib/validations/classForm";
import {
  ClassItem,
  GetClassesResponse,
  GetClassResponse,
  CreateClassResponse,
  UpdateClassResponse,
  DeleteClassResponse,
} from "@/lib/types/class";
import api from "../axios";

export const getAllClasses = async (): Promise<GetClassesResponse> => {
  try {
    const res = await api.get("/classes");
    console.log(res.data.data);
    return {
      success: true,
      data: res.data.data,
      total: res.data.data.length,
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

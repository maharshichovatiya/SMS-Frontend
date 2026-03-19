import { AxiosError } from "axios";
import api from "@/lib/Axios";
import type { ApiNotice } from "@/lib/types/Notice";

export type { ApiNotice } from "@/lib/types/Notice";

export interface NoticeTarget {
  id: string;
  noticeId: string;
  targetType: string;
  targetId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeResponse {
  statusCode: number;
  message: string;
  data: {
    notices: ApiNotice[];
    total: number;
  };
}

export const getNotices = async (): Promise<ApiNotice[]> => {
  try {
    const response = await api.get<NoticeResponse>("/notices");
    return response.data.data.notices;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to fetch notices");
  }
};

export interface CreateNoticePayload {
  title: string;
  description: string;
  noticeType: string;
  priority: "high" | "medium" | "low";
  publishDate: string;
  expiryDate: string;
  attachmentUrl?: string | null;
}

export const createNotice = async (
  payload: CreateNoticePayload,
): Promise<ApiNotice> => {
  try {
    const response = await api.post<{ data: ApiNotice }>("/notices", payload);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to create notice");
  }
};

export const updateNotice = async (
  id: string,
  payload: Partial<CreateNoticePayload>,
): Promise<ApiNotice> => {
  try {
    const response = await api.patch<{ data: ApiNotice }>(
      `/notices/${id}`,
      payload,
    );
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to update notice");
  }
};

export const deleteNotice = async (id: string): Promise<void> => {
  try {
    await api.delete(`/notices/${id}`);
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to delete notice");
  }
};

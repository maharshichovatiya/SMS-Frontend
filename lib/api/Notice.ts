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
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FetchNoticesParams {
  page?: number;
  limit?: number;
}

export const getNotices = async (
  params: FetchNoticesParams = {},
): Promise<{ notices: ApiNotice[]; total: number; totalPages: number }> => {
  try {
    const { page = 1, limit = 4 } = params;
    const response = await api.get<NoticeResponse>("/notices", {
      params: { page, limit },
    });
    const data = response.data.data;
    const notices = data.notices ?? [];
    const total = data.total ?? notices.length;
    const totalPages = data.totalPages ?? Math.max(1, Math.ceil(total / limit));
    return { notices, total, totalPages };
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
  noticeTargets?: Array<{
    targetType: string;
    targetId: string;
  }>;
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

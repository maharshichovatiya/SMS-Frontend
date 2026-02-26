import { AxiosError } from "axios";
import api from "@/lib/Axios";

export interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  school: string;
}

export interface ProfileResponse {
  statusCode: number;
  message: string;
  data: ProfileData;
}

export const getProfile = async (): Promise<ProfileData> => {
  try {
    const response = await api.get<ProfileResponse>("/auth/profile");
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to fetch profile");
  }
};

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  newPassword?: string;
}

export const updateProfile = async (
  id: string,
  payload: UpdateProfilePayload,
): Promise<ProfileData> => {
  try {
    const body: Partial<UpdateProfilePayload> = {
      firstName: payload.firstName,
      lastName: payload.lastName,
    };

    if (payload.newPassword) {
      body.newPassword = payload.newPassword;
    }

    const response = await api.patch<ProfileResponse>(
      `/auth/update-profile/${id}`,
      body,
    );
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to update profile");
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/auth/delete-user/${id}`);
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to delete user");
  }
};

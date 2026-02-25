import Cookies from "js-cookie";
import { AxiosError } from "axios";

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiError = {
  success: false;
  message: string;
};

type ApiResponse<T> = ApiSuccess<T> | ApiError;

type ErrorResponse = {
  message?: string;
};

type LoginResponse = {
  statusCode: number;
  data?: {
    email?: string;
  };
};

type VerifyOtpResponse = {
  data: {
    statusCode: number;
    accessToken: string;
    refreshToken: string;
    userId: string;
    schoolId: string;
  };
};

type ForgotPasswordResponse = {
  statusCode: number;
  message: string;
};

type ResetPasswordResponse = {
  statusCode: number;
  message: string;
};

type ResendOtpResponse = {
  statusCode: number;
  message: string;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<ApiResponse<LoginResponse>> => {
  try {
    const res = await api.post<LoginResponse>("/auth/login", data);

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message: err.response?.data?.message || "Login failed. Please try again.",
    };
  }
};

export const verifyOtp = async (data: {
  email: string;
  otp: string;
}): Promise<ApiResponse<VerifyOtpResponse>> => {
  try {
    const res = await api.post<VerifyOtpResponse>("/auth/verify-otp", data);

    Cookies.set("accessToken", res.data.data.accessToken, {
      expires: 1,
    });

    Cookies.set("refreshToken", res.data.data.refreshToken, {
      expires: 7,
    });

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message: err.response?.data?.message || "Verification failed",
    };
  }
};

export const resendOtp = async (data: {
  email: string;
}): Promise<ApiResponse<ResendOtpResponse>> => {
  try {
    const res = await api.post<ResendOtpResponse>("/auth/resend-otp", data);

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Failed to resend OTP. Please try again.",
    };
  }
};

export const forgotPassword = async (email: {
  email: string;
}): Promise<ApiResponse<ForgotPasswordResponse>> => {
  try {
    const res = await api.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      email,
    );

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Failed to send reset link. Please try again.",
    };
  }
};

export const resetPassword = async (data: {
  token: string;
  newPassword: string;
}): Promise<ApiResponse<ResetPasswordResponse>> => {
  try {
    const res = await api.post<ResetPasswordResponse>(
      "/auth/reset-password",
      data,
    );

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Failed to reset password. Please try again.",
    };
  }
};

import { PersonalDetails } from "@/lib/validations/signupSchema";
import api from "../axios";

export interface BackendSchoolDto {
  name: string;
  type: "private" | "govt" | "aided";
  address: string;
  emailOfficial: string;
  contact: string;
  mediumOfInstruction: "english" | "hindi";
  affiliationBoard: "cbse" | "icse" | "state" | "ib" | "cambridge";
  schoolCode?: string;
  establishmentYear?: number;
  emailAdmin?: string;
  websiteUrl?: string;
}

export interface Role {
  id: string;
  roleName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const getRoles = () => api.get("/role");

export const signup = (data: PersonalDetails & { schoolId: string }) =>
  api.post("auth/register", data);

export const createSchool = (schoolData: BackendSchoolDto) =>
  api.post("school", schoolData);

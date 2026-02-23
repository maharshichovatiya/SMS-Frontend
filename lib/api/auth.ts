import Cookies from "js-cookie";
import api from "@/lib/axios";
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
    userId?: string;
  };
};

type VerifyOtpResponse = {
  statusCode: number;
  accessToken: string;
  refreshToken: string;
};

type ForgotPasswordResponse = {
  statusCode: number;
  message: string;
};

type ResetPasswordResponse = {
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

/* =======================
   VERIFY OTP
======================= */

export const verifyOtp = async (data: {
  userId: string;
  otp: string;
}): Promise<ApiResponse<VerifyOtpResponse>> => {
  try {
    const res = await api.post<VerifyOtpResponse>("/auth/verify-otp", data);

    if (res.data.statusCode === 200) {
      Cookies.set("accessToken", res.data.accessToken, {
        expires: 1,
      });

      Cookies.set("refreshToken", res.data.refreshToken, {
        expires: 7,
      });
    }

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

/* =======================
   FORGOT PASSWORD
======================= */

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

/* =======================
   RESET PASSWORD
======================= */

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

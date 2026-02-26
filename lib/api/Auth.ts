import Cookies from "js-cookie";

import { PersonalDetails } from "@/lib/validations/SignUpSchema";
import api from "../Axios";
import { AxiosError } from "axios";

type ApiSuccess<T> = {
  success: true;
  statusCode: number;
  message: string;
  data: T;
};

type ApiError = {
  success: false;
  statusCode: number;
  message: string;
  data: null;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

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
      statusCode: 200,
      message: "Login successful",
      data: res.data,
    };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      statusCode: 400,
      message:
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.",
      data: null,
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
      statusCode: 200,
      message: "OTP verified successfully",
      data: res.data,
    };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      statusCode: 400,
      message:
        err.response?.data?.message || err.message || "Verification failed",
      data: null,
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
      statusCode: res.data.statusCode,
      message: res.data.message,
      data: res.data,
    };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      statusCode: err.response?.status ?? 500,
      message:
        err.response?.data?.message ||
        "Failed to resend OTP. Please try again.",
      data: null,
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
      statusCode: 200,
      message: "Reset link sent successfully",
      data: res.data,
    };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      statusCode: 400,
      message:
        err.response?.data?.message ||
        err.message ||
        "Failed to send reset link. Please try again.",
      data: null,
    };
  }
};

export const logout = async (): Promise<ApiResponse<null>> => {
  try {
    const refreshToken = Cookies.get("refreshToken");

    await api.post("/auth/logout", { refreshToken });

    Cookies.remove("refreshToken");
    Cookies.remove("accessToken");

    return {
      success: true,
      statusCode: 200,
      message: "Logged out successfully",
      data: null,
    };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      statusCode: 400,
      message:
        err.response?.data?.message ||
        err.message ||
        "Failed to logout. Please try again.",
      data: null,
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
      statusCode: 200,
      message: "Password reset successfully",
      data: res.data,
    };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      statusCode: 400,
      message:
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password. Please try again.",
      data: null,
    };
  }
};
export interface BackendSchoolTypes {
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

export interface SchoolResponse {
  id: string;
}

export interface SignupPayload extends PersonalDetails {
  schoolId: string;
}

export const authApi = {
  getRoles: async () => {
    const response = await api.get<ApiResponse<Role[]>>("/role");
    return response.data;
  },

  signup: async (data: SignupPayload) => {
    const response = await api.post<
      ApiResponse<{ id: string; accessToken?: string; refreshToken?: string }>
    >("/auth/register", data);

    if (
      response.data.statusCode === 201 &&
      response.data.data?.accessToken &&
      response.data.data?.refreshToken
    ) {
      Cookies.set("accessToken", response.data.data.accessToken, {
        expires: 1,
      });

      Cookies.set("refreshToken", response.data.data.refreshToken, {
        expires: 7,
      });
    }

    return response.data;
  },

  createSchool: async (schoolData: BackendSchoolTypes) => {
    const response = await api.post<ApiResponse<SchoolResponse>>(
      "/school",
      schoolData,
    );
    return response.data;
  },
};

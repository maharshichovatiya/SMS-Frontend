export type ApiSuccess<T> = {
  success: true;
  statusCode: number;
  message: string;
  data: T;
};

export type ApiError = {
  success: false;
  statusCode: number;
  message: string;
  data: null;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type ErrorResponse = {
  message?: string;
};

export type LoginResponse = {
  statusCode: number;
  data?: {
    email?: string;
  };
};

export type VerifyOtpResponse = {
  data: {
    statusCode: number;
    accessToken: string;
    refreshToken: string;
    userId: string;
    schoolId: string;
  };
};

export type ForgotPasswordResponse = {
  statusCode: number;
  message: string;
};

export type ResetPasswordResponse = {
  statusCode: number;
  message: string;
};

export type ResendOtpResponse = {
  statusCode: number;
  message: string;
};

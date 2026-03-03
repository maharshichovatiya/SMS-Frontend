import toast from "react-hot-toast";

export const showToast = {
  success: (message: string) => {
    return toast.success(message, {
      icon: "✓",
    });
  },

  error: (message: string) => {
    return toast.error(message, {
      icon: "✕",
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      icon: "⏳",
    });
  },

  info: (message: string) => {
    return toast(message, {
      icon: "ℹ",
      style: {
        border: "1px solid var(--color-blue)",
      },
    });
  },

  apiError: (error: unknown) => {
    let message = "Something went wrong. Please try again.";

    if (error && typeof error === "object" && "response" in error) {
      const responseError = error as {
        response?: {
          data?: {
            message?: string;
            error?: string | string[];
            errors?: { [key: string]: string | string[] };
          };
        };
      };

      // Handle different error response formats
      const responseData = responseError.response?.data;

      if (responseData?.message) {
        message = responseData.message;
      } else if (responseData?.error) {
        // Handle string or array of errors - show only first error if array
        if (Array.isArray(responseData.error)) {
          message = responseData.error?.[0];
        } else {
          message = responseData.error;
        }
      } else if (responseData?.errors) {
        // Handle validation errors object - show only first error if array
        const errorMessages = Object.values(responseData.errors).flat();
        message = errorMessages?.[0];
      }
    } else if (error && typeof error === "object" && "message" in error) {
      const messageError = error as { message?: string };
      message = messageError.message || message;
    }

    return toast.error(message, {
      icon: "✕",
      duration: 5000,
    });
  },

  apiSuccess: (message: string) => {
    return toast.success(message, {
      icon: "✓",
      duration: 3000,
    });
  },
};

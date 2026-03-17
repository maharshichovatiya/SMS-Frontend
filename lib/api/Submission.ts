import api from "../Axios";

export interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  className: string;
  section: string;
  status: "submitted" | "pending" | "overdue" | "graded";
  submittedDate?: string;
  grade?: string;
  feedback?: string;
  file?: string;
  fileName?: string;
  fileSize?: number;
}

export interface FeedbackPayload {
  status: "approved" | "rejected";
  marksObtained?: number;
  feedback?: string;
}

export interface SubmissionsResponse {
  success: boolean;
  data: {
    submissions: StudentSubmission[];
    total: number;
    submitted: number;
    graded: number;
    pending: number;
    late: number;
  };
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  data?: StudentSubmission;
}

export const submissionApis = {
  getSubmissionsByHomework: async (
    homeworkId: string,
  ): Promise<SubmissionsResponse> => {
    const response = await api.get(`/homework/${homeworkId}/submissions`);
    return response.data;
  },

  submitFeedback: async (
    homeworkId: string,
    studentId: string,
    feedbackData: FeedbackPayload,
  ): Promise<FeedbackResponse> => {
    const response = await api.post(
      `/homework/${homeworkId}/submissions/${studentId}/review`,
      feedbackData,
    );
    return response.data;
  },

  downloadSubmission: async (
    homeworkId: string,
    studentId: string,
    fileName: string,
  ): Promise<Blob> => {
    const response = await api.get(
      `/homework/${homeworkId}/submissions/${studentId}/download`,
      {
        responseType: "blob",
        params: { fileName },
      },
    );
    return response.data;
  },

  getSubmissionStats: async (
    homeworkId: string,
  ): Promise<{
    total: number;
    submitted: number;
    graded: number;
    pending: number;
    late: number;
  }> => {
    const response = await api.get(`/homework/${homeworkId}/submissions/stats`);
    return response.data;
  },
};

import api from "../Axios";
import { StudentSubmissionResponse } from "../types/Homework";

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

export { type StudentSubmissionResponse };

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

  getStudentSubmissions: async (): Promise<StudentSubmissionResponse> => {
    const res = await api.get("/homework-submissions/student");
    return res.data;
  },

  submitHomework: async (data: { homeworkId: string; attachments: File[] }) => {
    const formData = new FormData();
    formData.append("homeworkId", data.homeworkId);

    data.attachments.forEach(file => {
      formData.append(`attachments`, file);
    });

    const res = await api.post("/homework-submissions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  updateSubmission: async (
    submissionId: string,
    data: {
      attachments: File[];
      attachmentDate: string;
    },
  ) => {
    const formData = new FormData();
    formData.append("attachmentDate", data.attachmentDate);

    data.attachments.forEach(file => {
      formData.append(`attachments`, file);
    });

    const res = await api.patch(
      `/homework-submissions/${submissionId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  },
};

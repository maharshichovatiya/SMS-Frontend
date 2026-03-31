import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  submissionApis,
  StudentSubmission,
  FeedbackPayload,
  StudentSubmissionResponse,
} from "../api/Submission";
import { StudentSubmissionItem } from "../types/Homework";

interface SubmissionState {
  submissions: StudentSubmission[];
  currentHomeworkSubmissions: StudentSubmission[];
  studentSubmissions: StudentSubmissionItem[] | null;
  stats: {
    total: number;
    submitted: number;
    graded: number;
    pending: number;
    late: number;
  } | null;
  loading: boolean;
  error: string | null;
  feedbackLoading: boolean;
  feedbackError: string | null;
  downloadLoading: boolean;
  downloadError: string | null;
  submitLoading: boolean;
  submitError: string | null;
}

const initialState: SubmissionState = {
  submissions: [],
  currentHomeworkSubmissions: [],
  studentSubmissions: null,
  stats: null,
  loading: false,
  error: null,
  feedbackLoading: false,
  feedbackError: null,
  downloadLoading: false,
  downloadError: null,
  submitLoading: false,
  submitError: null,
};

export const fetchSubmissionsByHomework = createAsyncThunk(
  "submissions/fetchByHomework",
  async (homeworkId: string, { rejectWithValue }) => {
    try {
      const response =
        await submissionApis.getSubmissionsByHomework(homeworkId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch submissions",
      );
    }
  },
);

export const fetchStudentSubmissions = createAsyncThunk<
  StudentSubmissionResponse,
  void,
  { rejectValue: string }
>("submissions/fetchStudentSubmissions", async (_, { rejectWithValue }) => {
  try {
    return await submissionApis.getStudentSubmissions();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Failed to fetch student submissions",
    );
  }
});

export const submitStudentHomework = createAsyncThunk<
  StudentSubmissionResponse,
  { homeworkId: string; attachments: File[] },
  { rejectValue: string }
>("submissions/submitStudentHomework", async (data, { rejectWithValue }) => {
  try {
    return await submissionApis.submitHomework(data);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to submit homework",
    );
  }
});

export const updateStudentSubmission = createAsyncThunk<
  unknown,
  {
    submissionId: string;
    attachments: File[];
  },
  { rejectValue: string }
>("submissions/updateStudentSubmission", async (data, { rejectWithValue }) => {
  try {
    return await submissionApis.updateSubmission(data.submissionId, {
      attachments: data.attachments,
    });
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to update submission",
    );
  }
});

export const submitFeedback = createAsyncThunk(
  "submissions/submitFeedback",
  async (
    {
      homeworkId,
      studentId,
      feedbackData,
    }: { homeworkId: string; studentId: string; feedbackData: FeedbackPayload },
    { rejectWithValue },
  ) => {
    try {
      const response = await submissionApis.submitFeedback(
        homeworkId,
        studentId,
        feedbackData,
      );
      return { studentId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to submit feedback",
      );
    }
  },
);

export const downloadSubmission = createAsyncThunk(
  "submissions/download",
  async (
    {
      homeworkId,
      studentId,
      fileName,
    }: { homeworkId: string; studentId: string; fileName: string },
    { rejectWithValue },
  ) => {
    try {
      const blob = await submissionApis.downloadSubmission(
        homeworkId,
        studentId,
        fileName,
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { studentId, fileName };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to download submission",
      );
    }
  },
);

export const fetchSubmissionStats = createAsyncThunk(
  "submissions/fetchStats",
  async (homeworkId: string, { rejectWithValue }) => {
    try {
      return await submissionApis.getSubmissionStats(homeworkId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch submission stats",
      );
    }
  },
);

const submissionSlice = createSlice({
  name: "submissions",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearFeedbackError: state => {
      state.feedbackError = null;
    },
    clearDownloadError: state => {
      state.downloadError = null;
    },
    clearSubmitError: state => {
      state.submitError = null;
    },
    setCurrentHomeworkSubmissions: (state, action) => {
      state.currentHomeworkSubmissions = action.payload;
    },
    updateSubmissionInList: (state, action) => {
      const { studentId, updates } = action.payload;
      const index = state.currentHomeworkSubmissions.findIndex(
        sub => sub.studentId === studentId,
      );
      if (index !== -1) {
        state.currentHomeworkSubmissions[index] = {
          ...state.currentHomeworkSubmissions[index],
          ...updates,
        };
      }
    },
    resetSubmissionState: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSubmissionsByHomework.pending, state => {
        state.loading = true;
      })
      .addCase(fetchSubmissionsByHomework.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHomeworkSubmissions = action.payload.submissions;
        state.stats = {
          total: action.payload.total,
          submitted: action.payload.submitted,
          graded: action.payload.graded,
          pending: action.payload.pending,
          late: action.payload.late,
        };
      })
      .addCase(fetchSubmissionsByHomework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder.addCase(fetchStudentSubmissions.fulfilled, (state, action) => {
      state.studentSubmissions = action.payload.data?.data?.homework || [];
    });

    builder
      .addCase(submitStudentHomework.pending, state => {
        state.submitLoading = true;
      })
      .addCase(submitStudentHomework.fulfilled, state => {
        state.submitLoading = false;
      })
      .addCase(submitStudentHomework.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload as string;
      });

    builder.addCase(updateStudentSubmission.fulfilled, state => {
      state.submitLoading = false;
    });

    builder.addCase(submitFeedback.fulfilled, (state, action) => {
      const { studentId, data } = action.payload;
      if (data) {
        const index = state.currentHomeworkSubmissions.findIndex(
          sub => sub.studentId === studentId,
        );
        if (index !== -1) {
          state.currentHomeworkSubmissions[index] = data;
        }
      }
    });

    builder.addCase(downloadSubmission.fulfilled, state => {
      state.downloadLoading = false;
    });

    builder.addCase(fetchSubmissionStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });
  },
});

export const {
  clearError,
  clearFeedbackError,
  clearDownloadError,
  clearSubmitError,
  setCurrentHomeworkSubmissions,
  updateSubmissionInList,
  resetSubmissionState,
} = submissionSlice.actions;

export default submissionSlice.reducer;

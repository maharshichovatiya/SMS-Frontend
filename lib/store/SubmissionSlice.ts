import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  submissionApis,
  StudentSubmission,
  FeedbackPayload,
} from "../api/Submission";

interface SubmissionState {
  submissions: StudentSubmission[];
  currentHomeworkSubmissions: StudentSubmission[];
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
}

const initialState: SubmissionState = {
  submissions: [],
  currentHomeworkSubmissions: [],
  stats: null,
  loading: false,
  error: null,
  feedbackLoading: false,
  feedbackError: null,
  downloadLoading: false,
  downloadError: null,
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
      const response = await submissionApis.getSubmissionStats(homeworkId);
      return response;
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
        state.error = null;
      })
      .addCase(fetchSubmissionsByHomework.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHomeworkSubmissions = action.payload.submissions;
        state.stats =
          action.payload.total !== undefined
            ? {
                total: action.payload.total,
                submitted: action.payload.submitted,
                graded: action.payload.graded,
                pending: action.payload.pending,
                late: action.payload.late,
              }
            : null;
        state.error = null;
      })
      .addCase(fetchSubmissionsByHomework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(submitFeedback.pending, state => {
        state.feedbackLoading = true;
        state.feedbackError = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.feedbackLoading = false;
        const { studentId, data } = action.payload;
        if (data.data) {
          const index = state.currentHomeworkSubmissions.findIndex(
            sub => sub.studentId === studentId,
          );
          if (index !== -1) {
            state.currentHomeworkSubmissions[index] = data.data;
          }
        }
        state.feedbackError = null;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.feedbackLoading = false;
        state.feedbackError = action.payload as string;
      });

    builder
      .addCase(downloadSubmission.pending, state => {
        state.downloadLoading = true;
        state.downloadError = null;
      })
      .addCase(downloadSubmission.fulfilled, state => {
        state.downloadLoading = false;
        state.downloadError = null;
      })
      .addCase(downloadSubmission.rejected, (state, action) => {
        state.downloadLoading = false;
        state.downloadError = action.payload as string;
      });

    builder
      .addCase(fetchSubmissionStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchSubmissionStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearFeedbackError,
  clearDownloadError,
  setCurrentHomeworkSubmissions,
  updateSubmissionInList,
  resetSubmissionState,
} = submissionSlice.actions;

export default submissionSlice.reducer;

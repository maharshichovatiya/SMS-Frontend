import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getStudentSummary,
  getUpcomingHomework,
  getStudentSubjects,
} from "@/lib/api/StudentDashboard";
import {
  StudentDashboardSummary,
  UpcomingHomework,
  StudentSubject,
} from "@/lib/types/StudentDashboard";

interface StudentDashboardState {
  summary: StudentDashboardSummary | null;
  upcomingHomework: UpcomingHomework[];
  subjects: StudentSubject[];
  loading: {
    summary: boolean;
    upcomingHomework: boolean;
    subjects: boolean;
  };
  error: {
    summary: string | null;
    upcomingHomework: string | null;
    subjects: string | null;
  };
}

const initialState: StudentDashboardState = {
  summary: null,
  upcomingHomework: [],
  subjects: [],
  loading: {
    summary: false,
    upcomingHomework: false,
    subjects: false,
  },
  error: {
    summary: null,
    upcomingHomework: null,
    subjects: null,
  },
};

export const fetchStudentSummary = createAsyncThunk(
  "studentDashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getStudentSummary();
      return data;
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch student summary",
      );
    }
  },
);

export const fetchUpcomingHomework = createAsyncThunk(
  "studentDashboard/fetchUpcomingHomework",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUpcomingHomework();
      return data;
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch upcoming homework",
      );
    }
  },
);

export const fetchStudentSubjects = createAsyncThunk(
  "studentDashboard/fetchStudentSubjects",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getStudentSubjects();
      return data;
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch student subjects",
      );
    }
  },
);

const studentDashboardSlice = createSlice({
  name: "studentDashboard",
  initialState,
  reducers: {
    clearStudentDashboardErrors: state => {
      state.error = {
        summary: null,
        upcomingHomework: null,
        subjects: null,
      };
    },
    clearStudentDashboardData: state => {
      state.summary = null;
      state.upcomingHomework = [];
      state.subjects = [];
    },
  },
  extraReducers: builder => {
    // Summary
    builder.addCase(fetchStudentSummary.pending, state => {
      state.loading.summary = true;
      state.error.summary = null;
    });
    builder.addCase(
      fetchStudentSummary.fulfilled,
      (state, action: PayloadAction<StudentDashboardSummary>) => {
        state.loading.summary = false;
        state.summary = action.payload;
      },
    );
    builder.addCase(fetchStudentSummary.rejected, (state, action) => {
      state.loading.summary = false;
      state.error.summary = action.payload as string;
    });

    // Upcoming Homework
    builder.addCase(fetchUpcomingHomework.pending, state => {
      state.loading.upcomingHomework = true;
      state.error.upcomingHomework = null;
    });
    builder.addCase(
      fetchUpcomingHomework.fulfilled,
      (state, action: PayloadAction<UpcomingHomework[]>) => {
        state.loading.upcomingHomework = false;
        state.upcomingHomework = action.payload;
      },
    );
    builder.addCase(fetchUpcomingHomework.rejected, (state, action) => {
      state.loading.upcomingHomework = false;
      state.error.upcomingHomework = action.payload as string;
    });

    // Subjects
    builder.addCase(fetchStudentSubjects.pending, state => {
      state.loading.subjects = true;
      state.error.subjects = null;
    });
    builder.addCase(
      fetchStudentSubjects.fulfilled,
      (state, action: PayloadAction<StudentSubject[]>) => {
        state.loading.subjects = false;
        state.subjects = action.payload;
      },
    );
    builder.addCase(fetchStudentSubjects.rejected, (state, action) => {
      state.loading.subjects = false;
      state.error.subjects = action.payload as string;
    });
  },
});

export const { clearStudentDashboardErrors, clearStudentDashboardData } =
  studentDashboardSlice.actions;

export default studentDashboardSlice.reducer;

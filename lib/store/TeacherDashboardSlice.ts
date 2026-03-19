import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../Axios";

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ClassData {
  classId: string;
  className: string;
  section: string;
  studentCount: number;
  students: Student[];
}

export interface TeacherDashboardSummary {
  totalStudents: number;
  classes: ClassData[];
  summary: {
    totalClasses: number;
    averageStudentsPerClass: number;
  };
}

export interface TeacherDashboardResponse {
  statusCode: number;
  message: string;
  data: TeacherDashboardSummary;
}

export interface TeacherDashboardState {
  data: TeacherDashboardSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: TeacherDashboardState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchTeacherDashboardData = createAsyncThunk<
  TeacherDashboardSummary,
  void,
  { rejectValue: string }
>("teacherDashboard/fetchData", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<TeacherDashboardResponse>(
      "/dashboard/students/classteacher",
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred",
    );
  }
});

const teacherDashboardSlice = createSlice({
  name: "teacherDashboard",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetData: state => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTeacherDashboardData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTeacherDashboardData.fulfilled,
        (state, action: PayloadAction<TeacherDashboardSummary>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchTeacherDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dashboard data";
      });
  },
});

export const { clearError, resetData } = teacherDashboardSlice.actions;
export default teacherDashboardSlice.reducer;

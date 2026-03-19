import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../Axios";

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string | null;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  name?: string;
  email: string;
  phone: string;
  admissionDate?: string | null;
  dob?: string | null;
  gender?: string | null;
  status?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  guardianName?: string | null;
  familyAnnualIncome?: string | null;
  medicalConditions?: string | null;
  bloodGroup?: string | null;
  aadhaarNo?: string | null;
  panNo?: string | null;
  permanentAddress?: string | null;
  currentAddress?: string | null;
  bankName?: string | null;
  accountNo?: string | null;
  ifscCode?: string | null;
  branch?: string | null;
  fatherPhone?: string | null;
  academics?: {
    id?: string;
    rollNo?: string | null;
    status?: string | null;
    promotionStatus?: string | null;
    percentage?: string | null;
    remarks?: string | null;
    createdAt?: string;
    updatedAt?: string;
    academicYear?: {
      id?: string;
      yearName?: string | null;
      startDate?: string | null;
      endDate?: string | null;
      isCurrent?: boolean;
      status?: string | null;
    };
    class?: {
      id?: string;
      className?: string | null;
      section?: string | null;
    };
  }[];
  role?: {
    id: string;
    roleName: string;
  };
  school?: {
    id: string;
    name: string;
    address: string;
  };
}

export interface ClassTeacherClass {
  id: string;
  className: string;
  students: Student[];
}

export interface ClassTeacherData {
  class: ClassTeacherClass;
}

export interface TeacherClass {
  id: string;
  className: string;
  students: Student[];
}

export interface TeacherDashboardSummary {
  classTeacher: ClassTeacherData;
  classes: TeacherClass[];
}

export interface TeacherDashboardResponse {
  statusCode: number;
  message: string;
  data: {
    statusCode: number;
    message: string;
    data: {
      classTeacher: ClassTeacherData;
      classes: TeacherClass[];
    };
  };
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
    const response =
      await api.get<TeacherDashboardResponse>("/dashboard/teacher");
    return response.data.data.data;
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

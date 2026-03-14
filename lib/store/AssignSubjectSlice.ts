import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { dashboardApis } from "@/lib/api/Dashboard";

export interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  passingMarks?: number;
  maxMarks?: number;
}

export interface SubjectClass {
  classId: string;
  className: string;
  section: string;
  subjects: Subject[];
}

export interface AssignSubjectData {
  totalSubjects: number;
  totalClasses: number;
  subjectsByClass: SubjectClass[];
  summary: {
    averageSubjectsPerClass: number;
  };
}

export interface AssignSubjectState {
  data: AssignSubjectData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AssignSubjectState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchAssignSubjectData = createAsyncThunk<
  AssignSubjectData,
  void,
  { rejectValue: string }
>("assignSubject/fetchData", async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardApis.getSubjectData();
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred",
    );
  }
});

const assignSubjectSlice = createSlice({
  name: "assignSubject",
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
      .addCase(fetchAssignSubjectData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAssignSubjectData.fulfilled,
        (state, action: PayloadAction<AssignSubjectData>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchAssignSubjectData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch assign subject data";
      });
  },
});

export const { clearError, resetData } = assignSubjectSlice.actions;
export default assignSubjectSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getTeachersForAssignClass } from "@/lib/api/Teacher";

export interface AssignTeacher {
  id: string;
  employeeCode: string;
  staffCategory: string;
  department: string;
  designation: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    school: {
      id: string;
      name: string;
    };
  };
}

interface TeacherState {
  assignTeachers: AssignTeacher[];
  loading: boolean;
  error: string | null;
  hasLoadedOnce: boolean; // Track if data has been loaded at least once
}

const initialState: TeacherState = {
  assignTeachers: [],
  loading: false,
  error: null,
  hasLoadedOnce: false,
};

// Async thunk for fetching assign teachers - gets only active teachers for class assignment
export const fetchAssignTeachers = createAsyncThunk(
  "teacher/fetchAssignTeachers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTeachersForAssignClass();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to fetch teachers");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch teachers",
      );
    }
  },
);

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Fetch assign teachers
    builder
      .addCase(fetchAssignTeachers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAssignTeachers.fulfilled,
        (state, action: PayloadAction<AssignTeacher[]>) => {
          state.loading = false;
          state.assignTeachers = action.payload;
          state.error = null;
          state.hasLoadedOnce = true; // Mark as loaded
        },
      )
      .addCase(fetchAssignTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = teacherSlice.actions;
export default teacherSlice.reducer;

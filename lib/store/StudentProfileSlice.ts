import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getStudentProfile,
  updateStudentProfile,
} from "@/lib/api/StudentProfile";
import {
  StudentProfileData,
  UpdateStudentProfilePayload,
} from "@/lib/api/StudentProfile";

interface StudentProfileState {
  profile: StudentProfileData | null;
  loading: boolean;
  error: string | null;
  hasLoadedOnce: boolean;
}

const initialState: StudentProfileState = {
  profile: null,
  loading: false,
  error: null,
  hasLoadedOnce: false,
};

export const fetchStudentProfile = createAsyncThunk(
  "studentProfile/fetchStudentProfile",
  async (_, { rejectWithValue }) => {
    try {
      const profileData = await getStudentProfile();
      return profileData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch student profile",
      );
    }
  },
);

export const updateStudentProfileAsync = createAsyncThunk(
  "studentProfile/updateStudentProfile",
  async (
    { id, payload }: { id: string; payload: UpdateStudentProfilePayload },
    { rejectWithValue },
  ) => {
    try {
      const updatedProfile = await updateStudentProfile(id, payload);
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to update student profile",
      );
    }
  },
);

const studentProfileSlice = createSlice({
  name: "studentProfile",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<StudentProfileData>) => {
      state.profile = action.payload;
    },
    resetProfile: state => {
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.hasLoadedOnce = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStudentProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStudentProfile.fulfilled,
        (state, action: PayloadAction<StudentProfileData>) => {
          state.loading = false;
          state.profile = action.payload;
          state.error = null;
          state.hasLoadedOnce = true;
        },
      )
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStudentProfileAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateStudentProfileAsync.fulfilled,
        (state, action: PayloadAction<StudentProfileData>) => {
          state.loading = false;
          state.profile = action.payload;
          state.error = null;
        },
      )
      .addCase(updateStudentProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateProfile, resetProfile } =
  studentProfileSlice.actions;
export default studentProfileSlice.reducer;

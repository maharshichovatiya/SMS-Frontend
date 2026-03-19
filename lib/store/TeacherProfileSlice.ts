import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getTeacherProfile } from "@/lib/api/TeacherProfile";
import { TeacherProfileData } from "@/lib/api/TeacherProfile";

interface TeacherProfileState {
  profile: TeacherProfileData | null;
  loading: boolean;
  error: string | null;
  hasLoadedOnce: boolean;
}

const initialState: TeacherProfileState = {
  profile: null,
  loading: false,
  error: null,
  hasLoadedOnce: false,
};

export const fetchTeacherProfile = createAsyncThunk(
  "teacherProfile/fetchTeacherProfile",
  async (_, { rejectWithValue }) => {
    try {
      const profileData = await getTeacherProfile();
      return profileData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch teacher profile",
      );
    }
  },
);

const teacherProfileSlice = createSlice({
  name: "teacherProfile",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<TeacherProfileData>) => {
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
      .addCase(fetchTeacherProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTeacherProfile.fulfilled,
        (state, action: PayloadAction<TeacherProfileData>) => {
          state.loading = false;
          state.profile = action.payload;
          state.error = null;
          state.hasLoadedOnce = true;
        },
      )
      .addCase(fetchTeacherProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateProfile, resetProfile } =
  teacherProfileSlice.actions;
export default teacherProfileSlice.reducer;

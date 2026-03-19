import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { dashboardApis, ClassDashboardResponse } from "@/lib/api/Dashboard";

export interface AssignClassState {
  data: ClassDashboardResponse["data"] | null;
  loading: boolean;
  error: string | null;
}

const initialState: AssignClassState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchAssignClassData = createAsyncThunk<
  ClassDashboardResponse["data"],
  void,
  { rejectValue: string }
>("assignClass/fetchData", async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardApis.getClassData();
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "data" in error.response &&
      typeof error.response.data === "object" &&
      error.response.data !== null &&
      "message" in error.response.data
        ? (error.response.data as { message: string }).message
        : "Failed to fetch assign class data";
    return rejectWithValue(errorMessage);
  }
});

const assignClassSlice = createSlice({
  name: "assignClass",
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
      .addCase(fetchAssignClassData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAssignClassData.fulfilled,
        (state, action: PayloadAction<ClassDashboardResponse["data"]>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchAssignClassData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch assign class data";
      });
  },
});

export const { clearError, resetData } = assignClassSlice.actions;
export default assignClassSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  type ApiNotice,
} from "@/lib/api/Notice";
import { mapApiNoticeToNotice, type Notice } from "@/lib/types/Notice";

interface NoticeState {
  notices: Notice[];
  apiNotices: ApiNotice[];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: NoticeState = {
  notices: [],
  apiNotices: [],
  loading: false,
  error: null,
  total: 0,
};

// Async thunks
export const fetchNotices = createAsyncThunk(
  "notices/fetchNotices",
  async (_, { rejectWithValue }) => {
    try {
      const apiNotices = await getNotices();
      const notices = apiNotices.map(mapApiNoticeToNotice);
      return { notices, apiNotices, total: apiNotices.length };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch notices",
      );
    }
  },
);

export const addNotice = createAsyncThunk(
  "notices/addNotice",
  async (
    noticeData: {
      title: string;
      description: string;
      noticeType: string;
      priority: "high" | "medium" | "low";
      publishDate: string;
      expiryDate: string;
      attachmentUrl?: string | null;
      noticeTargets?: Array<{
        targetType: string;
        targetId: string;
      }>;
    },
    { rejectWithValue },
  ) => {
    try {
      const newApiNotice = await createNotice(noticeData);
      const newNotice = mapApiNoticeToNotice(newApiNotice);
      return { apiNotice: newApiNotice, notice: newNotice };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create notice",
      );
    }
  },
);

export const editNotice = createAsyncThunk(
  "notices/editNotice",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        title: string;
        description: string;
        noticeType: string;
        priority: "high" | "medium" | "low";
        publishDate: string;
        expiryDate: string;
        attachmentUrl?: string | null;
        noticeTargets?: Array<{
          targetType: string;
          targetId: string;
        }>;
      }>;
    },
    { rejectWithValue },
  ) => {
    try {
      const updatedApiNotice = await updateNotice(id, data);
      const updatedNotice = mapApiNoticeToNotice(updatedApiNotice);
      return { apiNotice: updatedApiNotice, notice: updatedNotice };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update notice",
      );
    }
  },
);

export const removeNotice = createAsyncThunk(
  "notices/removeNotice",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteNotice(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete notice",
      );
    }
  },
);

const noticeSlice = createSlice({
  name: "notices",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearNotices: state => {
      state.notices = [];
      state.apiNotices = [];
      state.total = 0;
    },
  },
  extraReducers: builder => {
    // Fetch notices
    builder
      .addCase(fetchNotices.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNotices.fulfilled,
        (
          state,
          action: PayloadAction<{
            notices: Notice[];
            apiNotices: ApiNotice[];
            total: number;
          }>,
        ) => {
          state.loading = false;
          state.notices = action.payload.notices;
          state.apiNotices = action.payload.apiNotices;
          state.total = action.payload.total;
          state.error = null;
        },
      )
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add notice
    builder
      .addCase(addNotice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addNotice.fulfilled,
        (
          state,
          action: PayloadAction<{ apiNotice: ApiNotice; notice: Notice }>,
        ) => {
          state.loading = false;
          state.apiNotices.unshift(action.payload.apiNotice);
          state.notices.unshift(action.payload.notice);
          state.total += 1;
          state.error = null;
        },
      )
      .addCase(addNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Edit notice
    builder
      .addCase(editNotice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        editNotice.fulfilled,
        (
          state,
          action: PayloadAction<{ apiNotice: ApiNotice; notice: Notice }>,
        ) => {
          state.loading = false;
          const apiIndex = state.apiNotices.findIndex(
            notice => notice.id === action.payload.apiNotice.id,
          );
          if (apiIndex !== -1) {
            state.apiNotices[apiIndex] = action.payload.apiNotice;
          }
          const uiIndex = state.notices.findIndex(
            notice => notice.id === action.payload.notice.id,
          );
          if (uiIndex !== -1) {
            state.notices[uiIndex] = action.payload.notice;
          }
          state.error = null;
        },
      )
      .addCase(editNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Remove notice
    builder
      .addCase(removeNotice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeNotice.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.apiNotices = state.apiNotices.filter(
            notice => notice.id !== action.payload,
          );
          state.notices = state.notices.filter(
            notice => notice.id !== action.payload,
          );
          state.total -= 1;
          state.error = null;
        },
      )
      .addCase(removeNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearNotices } = noticeSlice.actions;
export default noticeSlice.reducer;

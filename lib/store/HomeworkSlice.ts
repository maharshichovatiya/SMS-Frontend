import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Homework,
  CreateHomeworkPayload,
  AssignToClassesPayload,
  AssignToStudentsPayload,
  StudentHomework,
  StudentHomeworkListResponse,
  StudentSubmissionResponse,
  StudentSubmissionItem,
} from "../types/Homework";
import { homeworkApis } from "../api/Homework";

interface HomeworkState {
  homeworkList: {
    count: number;
    homework: Homework[];
  } | null;
  studentHomeworkList: {
    count: number;
    homework: StudentHomework[];
  } | null;
  studentSubmissions: {
    data: StudentSubmissionItem[];
  } | null;
  currentHomework: Homework | null;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  assignLoading: boolean;
  assignError: string | null;
  submitLoading: boolean;
  submitError: string | null;
}

const initialState: HomeworkState = {
  homeworkList: null,
  studentHomeworkList: null,
  studentSubmissions: null,
  currentHomework: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  assignLoading: false,
  assignError: null,
  submitLoading: false,
  submitError: null,
};

export const fetchAllHomework = createAsyncThunk(
  "homework/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await homeworkApis.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch homework",
      );
    }
  },
);

export const fetchStudentHomework = createAsyncThunk<
  StudentHomeworkListResponse,
  void,
  { rejectValue: string }
>("homework/fetchStudentHomework", async (_, { rejectWithValue }) => {
  try {
    const response = await homeworkApis.getStudentHomework();
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Failed to fetch student homework",
    );
  }
});

export const fetchStudentSubmissions = createAsyncThunk<
  StudentSubmissionResponse,
  void,
  { rejectValue: string }
>("homework/fetchStudentSubmissions", async (_, { rejectWithValue }) => {
  try {
    const response = await homeworkApis.getStudentSubmissions();
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Failed to fetch student submissions",
    );
  }
});

export const submitStudentHomework = createAsyncThunk<
  StudentSubmissionResponse,
  {
    homeworkId: string;
    studentId: string;
    attachments: File[];
    attachmentDate: string;
  },
  { rejectValue: string }
>("homework/submitStudentHomework", async (data, { rejectWithValue }) => {
  try {
    const response = await homeworkApis.submitHomework(data);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to submit homework",
    );
  }
});

export const fetchHomeworkById = createAsyncThunk(
  "homework/fetchById",
  async (homeworkId: string, { rejectWithValue }) => {
    try {
      const response = await homeworkApis.getById(homeworkId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch homework details",
      );
    }
  },
);

export const createNewHomework = createAsyncThunk(
  "homework/create",
  async (data: CreateHomeworkPayload, { rejectWithValue }) => {
    try {
      const response = await homeworkApis.create(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create homework",
      );
    }
  },
);

export const assignHomeworkToClassesAsync = createAsyncThunk(
  "homework/assignToClasses",
  async (
    { homeworkId, data }: { homeworkId: string; data: AssignToClassesPayload },
    { rejectWithValue },
  ) => {
    try {
      const response = await homeworkApis.assignToClasses(homeworkId, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to assign homework to classes",
      );
    }
  },
);

export const assignHomeworkToStudentsAsync = createAsyncThunk(
  "homework/assignToStudents",
  async (
    { homeworkId, data }: { homeworkId: string; data: AssignToStudentsPayload },
    { rejectWithValue },
  ) => {
    try {
      const response = await homeworkApis.assignToStudents(homeworkId, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to assign homework to students",
      );
    }
  },
);

export const updateHomeworkAsync = createAsyncThunk(
  "homework/update",
  async (
    {
      homeworkId,
      data,
    }: { homeworkId: string; data: Partial<CreateHomeworkPayload> },
    { rejectWithValue },
  ) => {
    try {
      const response = await homeworkApis.update(homeworkId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update homework",
      );
    }
  },
);

export const deleteHomeworkAsync = createAsyncThunk(
  "homework/delete",
  async (homeworkId: string, { rejectWithValue }) => {
    try {
      await homeworkApis.delete(homeworkId);
      return homeworkId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete homework",
      );
    }
  },
);

const homeworkSlice = createSlice({
  name: "homework",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearCreateError: state => {
      state.createError = null;
    },
    clearAssignError: state => {
      state.assignError = null;
    },
    clearSubmitError: state => {
      state.submitError = null;
    },
    clearCurrentHomework: state => {
      state.currentHomework = null;
    },
    resetHomeworkState: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllHomework.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllHomework.fulfilled, (state, action) => {
        state.loading = false;
        state.homeworkList = {
          count: action.payload.data?.data?.count || 0,
          homework: action.payload.data?.data?.homework || [],
        };
        state.error = null;
      })
      .addCase(fetchAllHomework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchStudentHomework.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentHomework.fulfilled, (state, action) => {
        state.loading = false;
        state.studentHomeworkList = {
          count: action.payload.data?.data?.count || 0,
          homework: action.payload.data?.data?.homework || [],
        };
        state.error = null;
      })
      .addCase(fetchStudentHomework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchHomeworkById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeworkById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHomework = action.payload;
        state.error = null;
      })
      .addCase(fetchHomeworkById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createNewHomework.pending, state => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createNewHomework.fulfilled, state => {
        state.createLoading = false;
        state.createError = null;
      })
      .addCase(createNewHomework.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      });

    builder
      .addCase(assignHomeworkToClassesAsync.pending, state => {
        state.assignLoading = true;
        state.assignError = null;
      })
      .addCase(assignHomeworkToClassesAsync.fulfilled, state => {
        state.assignLoading = false;
        state.assignError = null;
      })
      .addCase(assignHomeworkToClassesAsync.rejected, (state, action) => {
        state.assignLoading = false;
        state.assignError = action.payload as string;
      });

    builder
      .addCase(fetchStudentSubmissions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.studentSubmissions = {
          data: action.payload.data?.data || [],
        };
        state.error = null;
      })
      .addCase(fetchStudentSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(assignHomeworkToStudentsAsync.pending, state => {
        state.assignLoading = true;
        state.assignError = null;
      })
      .addCase(assignHomeworkToStudentsAsync.fulfilled, state => {
        state.assignLoading = false;
        state.assignError = null;
      })
      .addCase(assignHomeworkToStudentsAsync.rejected, (state, action) => {
        state.assignLoading = false;
        state.assignError = action.payload as string;
      });

    builder
      .addCase(updateHomeworkAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHomeworkAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHomework = action.payload;
        state.error = null;
      })
      .addCase(updateHomeworkAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteHomeworkAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHomeworkAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (state.homeworkList) {
          state.homeworkList.homework = state.homeworkList.homework.filter(
            (hw: { homeworkId: string }) => hw.homeworkId !== action.payload,
          );
        }
        if (state.currentHomework?.id === action.payload) {
          state.currentHomework = null;
        }
        state.error = null;
      })
      .addCase(deleteHomeworkAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(submitStudentHomework.pending, state => {
        state.submitLoading = true;
        state.submitError = null;
      })
      .addCase(submitStudentHomework.fulfilled, state => {
        state.submitLoading = false;
        state.submitError = null;
      })
      .addCase(submitStudentHomework.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearCreateError,
  clearAssignError,
  clearSubmitError,
  clearCurrentHomework,
  resetHomeworkState,
} = homeworkSlice.actions;

export default homeworkSlice.reducer;

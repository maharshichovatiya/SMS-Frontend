import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  subjectApis,
  SubjectWithClassSubjects,
  AssignClassData,
} from "@/lib/api/Subject";

interface SubjectsState {
  // Data
  subjects: SubjectWithClassSubjects[];

  // Loading states
  loading: boolean;
  isDeleting: boolean;
  modalLoading: boolean;

  // Error handling
  error: string | null;

  // Search and filters
  searchQuery: string;
  debouncedSearch: string;
  minPassingMarks: string;
  maxPassingMarks: string;
  minTotalMarks: string;
  maxTotalMarks: string;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalSubjects: number;
  totalPages: number;

  // Modal states
  selectedSubject: SubjectWithClassSubjects | null;
  editingSubject: SubjectWithClassSubjects | null;
  creatingChapters: {
    subject: SubjectWithClassSubjects;
    classInfo: NonNullable<SubjectWithClassSubjects["classSubjects"]>[0] | null;
  } | null;
  deletingId: string | null;
  deletingSubject: SubjectWithClassSubjects | null;
  deletingChapter: {
    subjectId: string;
    chapterId: string;
    chapterName: string;
  } | null;
  isAssignModalOpen: boolean;
  selectedSubjectId: string;
  selectedClassId: string;
  selectedTeacherId: string;
  activeTab: "classes" | "chapters";

  // Flags
  hasLoadedOnce: boolean;
}

const initialState: SubjectsState = {
  subjects: [],
  loading: false,
  isDeleting: false,
  modalLoading: false,
  error: null,
  searchQuery: "",
  debouncedSearch: "",
  minPassingMarks: "",
  maxPassingMarks: "",
  minTotalMarks: "",
  maxTotalMarks: "",
  currentPage: 1,
  pageSize: 6,
  totalSubjects: 0,
  totalPages: 0,
  selectedSubject: null,
  editingSubject: null,
  creatingChapters: null,
  deletingId: null,
  deletingSubject: null,
  deletingChapter: null,
  isAssignModalOpen: false,
  selectedSubjectId: "",
  selectedClassId: "",
  selectedTeacherId: "",
  activeTab: "classes",
  hasLoadedOnce: false,
};

// Async thunks
export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { subjects: SubjectsState };
      const {
        currentPage,
        pageSize,
        debouncedSearch,
        minPassingMarks,
        maxPassingMarks,
        minTotalMarks,
        maxTotalMarks,
      } = state.subjects;

      const response = await subjectApis.getAllForPage(
        currentPage,
        pageSize,
        debouncedSearch,
        minPassingMarks ? Number(minPassingMarks) : undefined,
        maxPassingMarks ? Number(maxPassingMarks) : undefined,
        minTotalMarks ? Number(minTotalMarks) : undefined,
        maxTotalMarks ? Number(maxTotalMarks) : undefined,
      );

      return {
        data: response.data,
        meta: response.meta,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch subjects",
      );
    }
  },
);

export const assignClassToSubject = createAsyncThunk(
  "subjects/assignClassToSubject",
  async (payload: AssignClassData, { rejectWithValue }) => {
    try {
      await subjectApis.assignClassToSubject(payload);
      return payload;
    } catch (error) {
      // Pass through the actual error instead of generic fallback
      return rejectWithValue(error);
    }
  },
);

export const deleteClassAssignment = createAsyncThunk(
  "subjects/deleteClassAssignment",
  async (classId: string, { rejectWithValue }) => {
    try {
      await subjectApis.delete(classId);
      return classId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete assignment",
      );
    }
  },
);

export const deleteSubject = createAsyncThunk(
  "subjects/deleteSubject",
  async (subjectId: string, { rejectWithValue }) => {
    try {
      await subjectApis.deleteSubject(subjectId);
      return subjectId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete subject",
      );
    }
  },
);

export const deleteChapter = createAsyncThunk(
  "subjects/deleteChapter",
  async (
    { subjectId, chapterId }: { subjectId: string; chapterId: string },
    { rejectWithValue },
  ) => {
    try {
      await subjectApis.deleteChapter(subjectId, chapterId);
      return { subjectId, chapterId };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete chapter",
      );
    }
  },
);

const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    // Search and filters
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDebouncedSearch: (state, action: PayloadAction<string>) => {
      state.debouncedSearch = action.payload;
    },
    setMinPassingMarks: (state, action: PayloadAction<string>) => {
      state.minPassingMarks = action.payload;
    },
    setMaxPassingMarks: (state, action: PayloadAction<string>) => {
      state.maxPassingMarks = action.payload;
    },
    setMinTotalMarks: (state, action: PayloadAction<string>) => {
      state.minTotalMarks = action.payload;
    },
    setMaxTotalMarks: (state, action: PayloadAction<string>) => {
      state.maxTotalMarks = action.payload;
    },
    clearFilters: state => {
      state.searchQuery = "";
      state.debouncedSearch = "";
      state.minPassingMarks = "";
      state.maxPassingMarks = "";
      state.minTotalMarks = "";
      state.maxTotalMarks = "";
      state.currentPage = 1;
    },

    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },

    // Modal states
    setSelectedSubject: (
      state,
      action: PayloadAction<SubjectWithClassSubjects | null>,
    ) => {
      state.selectedSubject = action.payload;
    },
    setEditingSubject: (
      state,
      action: PayloadAction<SubjectWithClassSubjects | null>,
    ) => {
      state.editingSubject = action.payload;
    },
    setCreatingChapters: (
      state,
      action: PayloadAction<{
        subject: SubjectWithClassSubjects;
        classInfo:
          | NonNullable<SubjectWithClassSubjects["classSubjects"]>[0]
          | null;
      } | null>,
    ) => {
      state.creatingChapters = action.payload;
    },
    setDeletingId: (state, action: PayloadAction<string | null>) => {
      state.deletingId = action.payload;
    },
    setDeletingSubject: (
      state,
      action: PayloadAction<SubjectWithClassSubjects | null>,
    ) => {
      state.deletingSubject = action.payload;
    },
    setDeletingChapter: (
      state,
      action: PayloadAction<{
        subjectId: string;
        chapterId: string;
        chapterName: string;
      } | null>,
    ) => {
      state.deletingChapter = action.payload;
    },
    setIsAssignModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAssignModalOpen = action.payload;
    },
    setSelectedSubjectId: (state, action: PayloadAction<string>) => {
      state.selectedSubjectId = action.payload;
    },
    setSelectedClassId: (state, action: PayloadAction<string>) => {
      state.selectedClassId = action.payload;
    },
    setSelectedTeacherId: (state, action: PayloadAction<string>) => {
      state.selectedTeacherId = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<"classes" | "chapters">) => {
      state.activeTab = action.payload;
    },

    // Assignment form reset
    resetAssignmentForm: state => {
      state.selectedSubjectId = "";
      state.selectedClassId = "";
      state.selectedTeacherId = "";
    },

    // Clear error
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Fetch subjects
    builder
      .addCase(fetchSubjects.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.data;
        state.totalSubjects = action.payload.meta.total;
        state.totalPages = action.payload.meta.totalPages;
        state.error = null;
        state.hasLoadedOnce = true;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Assign class to subject
    builder
      .addCase(assignClassToSubject.pending, state => {
        state.modalLoading = true;
        state.error = null;
      })
      .addCase(assignClassToSubject.fulfilled, state => {
        state.modalLoading = false;
        state.isAssignModalOpen = false;
        state.error = null;
        // Reset form
        state.selectedSubjectId = "";
        state.selectedClassId = "";
        state.selectedTeacherId = "";
      })
      .addCase(assignClassToSubject.rejected, (state, action) => {
        state.modalLoading = false;
        state.error = action.payload as string;
      });

    // Delete class assignment
    builder
      .addCase(deleteClassAssignment.pending, state => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteClassAssignment.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deletingId = null;
        state.error = null;

        // Update selectedSubject to remove the deleted class
        if (state.selectedSubject && state.selectedSubject.classSubjects) {
          state.selectedSubject = {
            ...state.selectedSubject,
            classSubjects: state.selectedSubject.classSubjects.filter(
              cls => cls.id !== action.payload,
            ),
          };
        }
      })
      .addCase(deleteClassAssignment.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });

    // Delete subject
    builder
      .addCase(deleteSubject.pending, state => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, state => {
        state.isDeleting = false;
        state.deletingSubject = null;
        state.error = null;
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });

    // Delete chapter
    builder
      .addCase(deleteChapter.pending, state => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteChapter.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deletingChapter = null;
        state.error = null;

        // Update selectedSubject to remove the deleted chapter
        if (state.selectedSubject && state.selectedSubject.chapters) {
          state.selectedSubject = {
            ...state.selectedSubject,
            chapters: state.selectedSubject.chapters.filter(
              chapter => chapter.id !== action.payload.chapterId,
            ),
          };
        }
      })
      .addCase(deleteChapter.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setDebouncedSearch,
  setMinPassingMarks,
  setMaxPassingMarks,
  setMinTotalMarks,
  setMaxTotalMarks,
  clearFilters,
  setCurrentPage,
  setPageSize,
  setSelectedSubject,
  setEditingSubject,
  setCreatingChapters,
  setDeletingId,
  setDeletingSubject,
  setDeletingChapter,
  setIsAssignModalOpen,
  setSelectedSubjectId,
  setSelectedClassId,
  setSelectedTeacherId,
  setActiveTab,
  resetAssignmentForm,
  clearError,
} = subjectsSlice.actions;

export default subjectsSlice.reducer;

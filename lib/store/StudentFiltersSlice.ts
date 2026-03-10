import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { classApis, Class, AcademicYear } from "@/lib/api/Class";
import { showToast } from "@/lib/utils/Toast";

export interface StudentFilterValues {
  classId?: string[];
  academicYearId?: string;
  gender?: string[];
  fromDate?: string;
  toDate?: string;
  fromFamilyIncome?: string;
  toFamilyIncome?: string;
}

interface FilterData {
  classes: Class[];
  academicYears: AcademicYear[];
}

const DEFAULT_FILTERS: StudentFilterValues = {
  classId: [],
  academicYearId: undefined,
  gender: [],
  fromDate: undefined,
  toDate: undefined,
  fromFamilyIncome: undefined,
  toFamilyIncome: undefined,
};

interface StudentFiltersState {
  filters: StudentFilterValues;
  isOpen: boolean;
  data: FilterData;
  loading: boolean;
  error: string | null;
}

const initialState: StudentFiltersState = {
  filters: DEFAULT_FILTERS,
  isOpen: false,
  data: {
    classes: [],
    academicYears: [],
  },
  loading: false,
  error: null,
};

// Async thunk for fetching filter data
export const fetchStudentFilterData = createAsyncThunk(
  "studentFilters/fetchFilterData",
  async (_, { rejectWithValue }) => {
    try {
      const [classesData, academicYearsData] = await Promise.all([
        classApis.getAll(),
        classApis.getAcademicYears(),
      ]);
      return {
        classes: classesData,
        academicYears: academicYearsData,
      };
    } catch (error) {
      showToast.apiError(error);
      return rejectWithValue("Failed to fetch filter data");
    }
  },
);

const studentFiltersSlice = createSlice({
  name: "studentFilters",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<StudentFilterValues>) => {
      state.filters = action.payload;
    },
    updateFilter: (
      state,
      action: PayloadAction<{
        key: keyof StudentFilterValues;
        value: StudentFilterValues[keyof StudentFilterValues];
      }>,
    ) => {
      const { key, value } = action.payload;
      // Type assertion to handle the dynamic assignment
      (
        state.filters as Record<
          string,
          StudentFilterValues[keyof StudentFilterValues]
        >
      )[key] = value;
    },
    toggleFilterOption: (
      state,
      action: PayloadAction<{
        key: keyof StudentFilterValues;
        option: string;
        checked?: boolean;
      }>,
    ) => {
      const { key, option, checked } = action.payload;

      // Handle array filters (classId, gender)
      if (key === "classId" || key === "gender") {
        const current = (state.filters[key] as string[]) ?? [];

        // If checked is provided, use it; otherwise toggle
        const shouldAdd =
          checked !== undefined ? checked : !current.includes(option);

        if (shouldAdd) {
          (state.filters[key] as string[]) = current.includes(option)
            ? current
            : [...current, option];
        } else {
          (state.filters[key] as string[]) = current.filter(v => v !== option);
        }
      }
      // Handle single selection filters (academicYearId)
      else {
        const currentValue = state.filters[key];
        // If checked is provided, use it; otherwise toggle
        const shouldSet =
          checked !== undefined ? checked : currentValue !== option;

        if (shouldSet) {
          if (key === "academicYearId") {
            state.filters.academicYearId = option;
          }
        } else {
          state.filters[key] = undefined;
        }
      }
    },
    clearFilters: state => {
      state.filters = DEFAULT_FILTERS;
    },
    toggleFiltersPanel: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    resetError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStudentFilterData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentFilterData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentFilterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  updateFilter,
  toggleFilterOption,
  clearFilters,
  toggleFiltersPanel,
  resetError,
} = studentFiltersSlice.actions;

// Selectors
export const selectStudentFilters = (state: {
  studentFilters: StudentFiltersState;
}) => state.studentFilters.filters;

export const selectStudentFiltersData = (state: {
  studentFilters: StudentFiltersState;
}) => state.studentFilters.data;

export const selectStudentFiltersLoading = (state: {
  studentFilters: StudentFiltersState;
}) => state.studentFilters.loading;

export const selectStudentFiltersError = (state: {
  studentFilters: StudentFiltersState;
}) => state.studentFilters.error;

export const selectStudentFiltersOpen = (state: {
  studentFilters: StudentFiltersState;
}) => state.studentFilters.isOpen;

export const selectActiveStudentFiltersCount = (state: {
  studentFilters: StudentFiltersState;
}) => {
  const filters = state.studentFilters.filters;
  return Object.values(filters).filter(
    value =>
      value !== undefined &&
      value !== "" &&
      (Array.isArray(value) ? value.length > 0 : true),
  ).length;
};

export default studentFiltersSlice.reducer;

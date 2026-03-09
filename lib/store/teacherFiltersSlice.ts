import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TeacherFilterValues {
  search: string;
  department: string[];
  experience?: string[];
  salary?: string[];
  ageGroup?: string[];
  tenure?: string[];
  gender?: string[];
  status?: string[];
}

const DEFAULT_FILTERS: TeacherFilterValues = {
  search: "",
  department: [],
  experience: [],
  salary: [],
  ageGroup: [],
  tenure: [],
  gender: [],
  status: [],
};

interface TeacherFiltersState {
  filters: TeacherFilterValues;
  isOpen: boolean;
}

const initialState: TeacherFiltersState = {
  filters: DEFAULT_FILTERS,
  isOpen: false,
};

const teacherFiltersSlice = createSlice({
  name: "teacherFilters",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TeacherFilterValues>) => {
      state.filters = action.payload;
    },
    toggleFilterOption: (
      state,
      action: PayloadAction<{ key: keyof TeacherFilterValues; option: string }>,
    ) => {
      const { key, option } = action.payload;
      const current = (state.filters[key] as string[]) ?? [];
      const exists = current.includes(option);

      if (exists) {
        (state.filters[key] as string[]) = current.filter(v => v !== option);
      } else {
        (state.filters[key] as string[]) = [...current, option];
      }
    },
    clearFilters: state => {
      state.filters = DEFAULT_FILTERS;
    },
    toggleFiltersPanel: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setStatus: (state, action: PayloadAction<string[]>) => {
      state.filters.status = action.payload;
    },
  },
});

export const {
  setFilters,
  toggleFilterOption,
  clearFilters,
  toggleFiltersPanel,
  setSearch,
  setStatus,
} = teacherFiltersSlice.actions;

export default teacherFiltersSlice.reducer;

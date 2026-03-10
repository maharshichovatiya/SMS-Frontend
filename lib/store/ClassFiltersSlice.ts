import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ClassFilterValues {
  search: string;
  type: string;
  availability?: string[];
  section?: string[];
  capacity?: string[];
  studentCount?: string[];
}

const DEFAULT_FILTERS: ClassFilterValues = {
  search: "",
  type: "all",
  availability: [],
  section: [],
  capacity: [],
  studentCount: [],
};

export interface ClassFiltersState {
  filters: ClassFilterValues;
  isOpen: boolean;
}

const initialState: ClassFiltersState = {
  filters: DEFAULT_FILTERS,
  isOpen: false,
};

const classFiltersSlice = createSlice({
  name: "classFilters",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ClassFilterValues>) => {
      state.filters = action.payload;
    },
    toggleFilterOption: (
      state,
      action: PayloadAction<{ key: keyof ClassFilterValues; option: string }>,
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
    setType: (state, action: PayloadAction<string>) => {
      state.filters.type = action.payload;
    },
  },
});

export const {
  setFilters,
  toggleFilterOption,
  clearFilters,
  toggleFiltersPanel,
  setSearch,
  setType,
} = classFiltersSlice.actions;

export default classFiltersSlice.reducer;

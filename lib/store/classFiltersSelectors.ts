import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./index";

export const selectClassFilters = (state: RootState) =>
  state.classFilters.filters;
export const selectFiltersPanelOpen = (state: RootState) =>
  state.classFilters.isOpen;

export const selectSearchFilter = createSelector(
  [selectClassFilters],
  filters => filters.search,
);

export const selectTypeFilter = createSelector(
  [selectClassFilters],
  filters => filters.type,
);

export const selectAvailabilityFilters = createSelector(
  [selectClassFilters],
  filters => filters.availability ?? [],
);

export const selectSectionFilters = createSelector(
  [selectClassFilters],
  filters => filters.section ?? [],
);

export const selectCapacityFilters = createSelector(
  [selectClassFilters],
  filters => filters.capacity ?? [],
);

export const selectStudentCountFilters = createSelector(
  [selectClassFilters],
  filters => filters.studentCount ?? [],
);

export const selectHasActiveFilters = createSelector(
  [selectClassFilters],
  filters =>
    (filters.availability?.length ?? 0) > 0 ||
    (filters.section?.length ?? 0) > 0 ||
    (filters.capacity?.length ?? 0) > 0 ||
    (filters.studentCount?.length ?? 0) > 0,
);

export const selectActiveFilterCount = createSelector(
  [selectClassFilters],
  filters =>
    [
      ...(filters.availability ?? []),
      ...(filters.section ?? []),
      ...(filters.capacity ?? []),
      ...(filters.studentCount ?? []),
    ].length,
);

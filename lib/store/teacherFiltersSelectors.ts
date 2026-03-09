import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./index";

export const selectTeacherFilters = (state: RootState) =>
  state.teacherFilters.filters;
export const selectTeacherFiltersPanelOpen = (state: RootState) =>
  state.teacherFilters.isOpen;

export const selectTeacherSearchFilter = createSelector(
  [selectTeacherFilters],
  filters => filters.search,
);

export const selectTeacherDepartmentFilters = createSelector(
  [selectTeacherFilters],
  filters => filters.department ?? [],
);

export const selectTeacherExperienceFilters = createSelector(
  [selectTeacherFilters],
  filters => filters.experience ?? [],
);

export const selectTeacherSalaryFilters = createSelector(
  [selectTeacherFilters],
  filters => filters.salary ?? [],
);

export const selectTeacherAgeGroupFilters = createSelector(
  [selectTeacherFilters],
  filters => filters.ageGroup ?? [],
);

export const selectTeacherTenureFilters = createSelector(
  [selectTeacherFilters],
  filters => filters.tenure ?? [],
);

export const selectTeacherGenderFilters = createSelector(
  [selectTeacherFilters],
  filters => filters.gender ?? [],
);

export const selectTeacherStatusFilters = createSelector(
  [selectTeacherFilters],
  filters => filters.status ?? [],
);

export const selectTeacherHasActiveFilters = createSelector(
  [selectTeacherFilters],
  filters =>
    (filters.department?.length ?? 0) > 0 ||
    (filters.experience?.length ?? 0) > 0 ||
    (filters.salary?.length ?? 0) > 0 ||
    (filters.ageGroup?.length ?? 0) > 0 ||
    (filters.tenure?.length ?? 0) > 0 ||
    (filters.gender?.length ?? 0) > 0 ||
    (filters.status?.length ?? 0) > 0,
);

export const selectTeacherActiveFilterCount = createSelector(
  [selectTeacherFilters],
  filters =>
    [
      ...(filters.department ?? []),
      ...(filters.experience ?? []),
      ...(filters.salary ?? []),
      ...(filters.ageGroup ?? []),
      ...(filters.tenure ?? []),
      ...(filters.gender ?? []),
      ...(filters.status ?? []),
    ].filter(Boolean).length,
);

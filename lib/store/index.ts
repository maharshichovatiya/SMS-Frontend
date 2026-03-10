import { configureStore } from "@reduxjs/toolkit";
import classFiltersReducer from "./ClassFiltersSlice";
import teacherFiltersReducer from "./TeacherFiltersSlice";
import studentFiltersReducer from "./StudentFiltersSlice";
import studentDataReducer from "./StudentDataSlice";

export const store = configureStore({
  reducer: {
    classFilters: classFiltersReducer,
    teacherFilters: teacherFiltersReducer,
    studentFilters: studentFiltersReducer,
    studentData: studentDataReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

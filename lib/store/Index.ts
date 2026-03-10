import { configureStore } from "@reduxjs/toolkit";
import classFiltersReducer from "./ClassFiltersSlice";
import teacherFiltersReducer from "./TeacherFiltersSlice";
import authReducer from "./AuthSlice";
import teacherReducer from "./TeacherSlice";

export const store = configureStore({
  reducer: {
    classFilters: classFiltersReducer,
    teacherFilters: teacherFiltersReducer,
    auth: authReducer,
    teacher: teacherReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

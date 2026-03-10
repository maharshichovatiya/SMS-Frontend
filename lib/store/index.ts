import { configureStore } from "@reduxjs/toolkit";
import classFiltersReducer from "./classFiltersSlice";
import teacherFiltersReducer from "./teacherFiltersSlice";
import authReducer from "./authSlice";
import teacherReducer from "./teacherSlice";

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

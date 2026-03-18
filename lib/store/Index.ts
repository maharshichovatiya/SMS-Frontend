import { configureStore } from "@reduxjs/toolkit";
import classFiltersReducer from "./ClassFiltersSlice";
import teacherFiltersReducer from "./TeacherFiltersSlice";
import studentFiltersReducer from "./StudentFiltersSlice";
import studentDataReducer from "./StudentDataSlice";
import authReducer from "./AuthSlice";
import teacherReducer from "./TeacherSlice";
import subjectsReducer from "./SubjectsSlice";
import teacherProfileReducer from "./TeacherProfileSlice";
import homeworkReducer from "./HomeworkSlice";
import homeworkFormReducer from "./HomeworkFormSlice";
import teacherDashboardReducer from "./TeacherDashboardSlice";
import assignClassReducer from "./AssignClassSlice";
import assignSubjectReducer from "./AssignSubjectSlice";
import submissionReducer from "./SubmissionSlice";

export const store = configureStore({
  reducer: {
    classFilters: classFiltersReducer,
    teacherFilters: teacherFiltersReducer,
    studentFilters: studentFiltersReducer,
    studentData: studentDataReducer,
    auth: authReducer,
    teacher: teacherReducer,
    subjects: subjectsReducer,
    teacherProfile: teacherProfileReducer,
    homework: homeworkReducer,
    homeworkForm: homeworkFormReducer,
    teacherDashboard: teacherDashboardReducer,
    assignClass: assignClassReducer,
    assignSubject: assignSubjectReducer,
    submissions: submissionReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

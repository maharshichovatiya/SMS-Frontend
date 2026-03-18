import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getClassSummary } from "@/lib/api/Classes";
import { studentApis } from "@/lib/api/Student";
import { subjectApis } from "@/lib/api/Subject";

export interface ClassData {
  id: string;
  name: string;
  className: string;
  section: string;
  studentCapacity: number;
  status: string;
  studentCount: number;
  subjectCount: number;
  teacherCount: number;
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  classId: string | null;
}

export interface SubjectData {
  id: string;
  subjectName: string;
}

interface HomeworkFormDataState {
  subjects: SubjectData[];
  classes: ClassData[];
  students: StudentData[];

  loading: {
    subjects: boolean;
    classes: boolean;
    students: boolean;
  };

  error: {
    subjects: string | null;
    classes: string | null;
    students: string | null;
  };
}

const initialState: HomeworkFormDataState = {
  subjects: [],
  classes: [],
  students: [],

  loading: {
    subjects: false,
    classes: false,
    students: false,
  },

  error: {
    subjects: null,
    classes: null,
    students: null,
  },
};

// Async thunks
export const fetchSubjectsForHomework = createAsyncThunk(
  "homeworkForm/fetchSubjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await subjectApis.getAllForPage(1, 100); // Get more subjects
      return response.data.map(subject => ({
        id: subject.id,
        subjectName: subject.subjectName,
      }));
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch subjects",
      );
    }
  },
);

export const fetchClassesForHomework = createAsyncThunk(
  "homeworkForm/fetchClasses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getClassSummary();
      if (response.success && response.data) {
        return response.data.map(cls => ({
          id: cls.id,
          name: `${cls.className}-${cls.section}`,
          className: String(cls.className),
          section: cls.section,
          studentCapacity: cls.studentCapacity,
          status: cls.status,
          studentCount: cls.studentCount,
          subjectCount: cls.subjectCount,
          teacherCount: cls.teacherCount,
        }));
      }
      throw new Error("No class data available");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch classes",
      );
    }
  },
);

export const fetchStudentsForHomework = createAsyncThunk(
  "homeworkForm/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await studentApis.getAll();
      if (response.data && response.data.data) {
        return response.data.data.map(student => ({
          id: student.id,
          name: `${student.user.firstName} ${student.user.lastName}`,
          email: student.user.email,
          classId:
            student.academics && student.academics.length > 0
              ? student.academics[0].class.id
              : null,
        }));
      }
      throw new Error("No student data available");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch students",
      );
    }
  },
);

const homeworkFormSlice = createSlice({
  name: "homeworkForm",
  initialState,
  reducers: {
    clearErrors: state => {
      state.error = { subjects: null, classes: null, students: null };
    },
    resetData: state => {
      state.subjects = [];
      state.classes = [];
      state.students = [];
      state.error = { subjects: null, classes: null, students: null };
    },
  },
  extraReducers: builder => {
    // Fetch subjects
    builder
      .addCase(fetchSubjectsForHomework.pending, state => {
        state.loading.subjects = true;
        state.error.subjects = null;
      })
      .addCase(fetchSubjectsForHomework.fulfilled, (state, action) => {
        state.loading.subjects = false;
        state.subjects = action.payload;
        state.error.subjects = null;
      })
      .addCase(fetchSubjectsForHomework.rejected, (state, action) => {
        state.loading.subjects = false;
        state.error.subjects = action.payload as string;
      });

    // Fetch classes
    builder
      .addCase(fetchClassesForHomework.pending, state => {
        state.loading.classes = true;
        state.error.classes = null;
      })
      .addCase(fetchClassesForHomework.fulfilled, (state, action) => {
        state.loading.classes = false;
        state.classes = action.payload;
        state.error.classes = null;
      })
      .addCase(fetchClassesForHomework.rejected, (state, action) => {
        state.loading.classes = false;
        state.error.classes = action.payload as string;
      });

    // Fetch students
    builder
      .addCase(fetchStudentsForHomework.pending, state => {
        state.loading.students = true;
        state.error.students = null;
      })
      .addCase(fetchStudentsForHomework.fulfilled, (state, action) => {
        state.loading.students = false;
        state.students = action.payload;
        state.error.students = null;
      })
      .addCase(fetchStudentsForHomework.rejected, (state, action) => {
        state.loading.students = false;
        state.error.students = action.payload as string;
      });
  },
});

export const { clearErrors, resetData } = homeworkFormSlice.actions;

// Selectors
export const selectHomeworkFormSubjects = (state: {
  homeworkForm: HomeworkFormDataState;
}) => state.homeworkForm.subjects;

export const selectHomeworkFormClasses = (state: {
  homeworkForm: HomeworkFormDataState;
}) => state.homeworkForm.classes;

export const selectHomeworkFormStudents = (state: {
  homeworkForm: HomeworkFormDataState;
}) => state.homeworkForm.students;

export const selectHomeworkFormLoading = (state: {
  homeworkForm: HomeworkFormDataState;
}) => state.homeworkForm.loading;

export const selectHomeworkFormError = (state: {
  homeworkForm: HomeworkFormDataState;
}) => state.homeworkForm.error;

export default homeworkFormSlice.reducer;

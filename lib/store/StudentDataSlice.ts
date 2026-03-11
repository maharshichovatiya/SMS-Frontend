import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  studentApis,
  Student as ApiStudent,
  RecordStatus,
} from "@/lib/api/Student";
import { authApi, Role } from "@/lib/api/Auth";
import { Student } from "@/components/tables/StudentTable";
import { showToast } from "@/lib/utils/Toast";

interface StudentSearchParams {
  search?: string;
  status?: RecordStatus;
  classId?: string | string[];
  sectionId?: string;
  gender?: string | string[];
  academicYearId?: string;
  fromDate?: string;
  toDate?: string;
  fromFamilyIncome?: number;
  toFamilyIncome?: number;
}

interface StudentDataState {
  students: Student[];
  totalStudents: number;
  currentPage: number;
  pageSize: number;
  searchParams: StudentSearchParams;
  loading: boolean;
  error: string | null;
  shouldRefresh: boolean;

  // UI State (persistent across navigation)
  searchQuery: string;
  status: RecordStatus | "all";

  // Roles data
  roles: Role[];
  studentRoleId: string | null;
  rolesLoading: boolean;
  rolesError: string | null;
}

const initialState: StudentDataState = {
  students: [],
  totalStudents: 0,
  currentPage: 1,
  pageSize: 5,
  searchParams: {},
  loading: false,
  error: null,
  shouldRefresh: false,

  // UI State (persistent across navigation)
  searchQuery: "",
  status: "all",

  // Roles data
  roles: [],
  studentRoleId: null,
  rolesLoading: false,
  rolesError: null,
};

// Transform API student to UI student
const transformStudent = (apiStudent: ApiStudent): Student => {
  const hasClassAssignment =
    apiStudent.academics && apiStudent.academics.length > 0;
  const currentAcademic = hasClassAssignment ? apiStudent.academics[0] : null;

  return {
    id: apiStudent.id,
    firstName: apiStudent.user.firstName,
    middleName: apiStudent.user.middleName,
    lastName: apiStudent.user.lastName,
    email: apiStudent.user.email,
    phone: apiStudent.user.phone,
    rollNo: currentAcademic?.rollNo || apiStudent.rollNo,
    admissionDate: apiStudent.admissionDate,
    class: currentAcademic
      ? `${currentAcademic.class.className}-${currentAcademic.class.section}`
      : "Unassigned",
    classId: currentAcademic?.class.id,
    academicYear: currentAcademic?.academicYear.yearName,
    academicYearId: currentAcademic?.academicYear.id,
    dob: apiStudent.user.dob || "N/A",
    gender: apiStudent.user.gender || null,
    guardian: apiStudent.guardianName || "N/A",
    status: apiStudent.status
      ? apiStudent.status.charAt(0).toUpperCase() + apiStudent.status.slice(1)
      : "Unknown",
    fatherName: apiStudent.fatherName || "",
    fatherPhone: apiStudent.fatherPhone || "",
    motherName: apiStudent.motherName || "",
    guardianName: apiStudent.guardianName || "",
    familyAnnualIncome: apiStudent.familyAnnualIncome || "",
    medicalConditions: apiStudent.medicalConditions || "",
    bloodGroup: apiStudent.user.bloodGroup || "",
    aadhaarNo: apiStudent.user.aadhaarNo || "",
    panNo: apiStudent.user.panNo || "",
    permanentAddress: apiStudent.user.permanentAddress || "",
    currentAddress: apiStudent.user.currentAddress || "",
    bankName: apiStudent.user.bankName || "",
    accountNo: apiStudent.user.accountNo || "",
    ifscCode: apiStudent.user.ifscCode || "",
    branch: apiStudent.user.branch || "",
  };
};

// Async thunk for fetching students
export const fetchStudents = createAsyncThunk(
  "studentData/fetchStudents",
  async (
    {
      page,
      pageSize,
      searchParams,
      forceRefresh = false,
    }: {
      page: number;
      pageSize: number;
      searchParams: StudentSearchParams;
      forceRefresh?: boolean;
    },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as { studentData: StudentDataState };

      // Skip fetch if data is current unless forceRefresh
      if (
        !forceRefresh &&
        state.studentData.currentPage === page &&
        state.studentData.pageSize === pageSize &&
        JSON.stringify(state.studentData.searchParams) ===
          JSON.stringify(searchParams)
      ) {
        return {
          students: state.studentData.students,
          totalStudents: state.studentData.totalStudents,
          fromCache: true,
        };
      }

      const response = await studentApis.getAll({
        page: Math.max(1, Number(page) || 1),
        limit: Math.max(1, Number(pageSize) || 10),
        search: searchParams?.search,
        status: searchParams?.status,
        classId: searchParams?.classId,
        sectionId: searchParams?.sectionId,
        gender: searchParams?.gender,
        academicYearId: searchParams?.academicYearId,
        fromDate: searchParams?.fromDate,
        toDate: searchParams?.toDate,
        fromFamilyIncome: searchParams?.fromFamilyIncome,
        toFamilyIncome: searchParams?.toFamilyIncome,
      });

      if (response.data && response.data.data) {
        const transformedStudents = response.data.data
          .filter(
            (apiStudent: ApiStudent) =>
              apiStudent.status.toLowerCase() !== "deleted",
          )
          .map(transformStudent);

        return {
          students: transformedStudents,
          totalStudents: response.data.meta.total,
          fromCache: false,
        };
      } else {
        throw new Error("Error fetching students");
      }
    } catch (error) {
      showToast.apiError(error);
      return rejectWithValue("Failed to fetch students");
    }
  },
);

// Async thunk for fetching roles
export const fetchRoles = createAsyncThunk(
  "studentData/fetchRoles",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { studentData: StudentDataState };

      // Only fetch roles if not already loaded
      if (state.studentData.roles.length > 0) {
        return {
          roles: state.studentData.roles,
          studentRoleId: state.studentData.studentRoleId,
          fromCache: true,
        };
      }

      const response = await authApi.getRoles();
      const studentRole = response.data?.find(
        (role: Role) => role.roleName.toLowerCase() === "student",
      );

      return {
        roles: response.data || [],
        studentRoleId: studentRole?.id || null,
        fromCache: false,
      };
    } catch (error) {
      showToast.apiError(error);
      return rejectWithValue("Failed to fetch roles");
    }
  },
);

const studentDataSlice = createSlice({
  name: "studentData",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when changing page size
    },
    setSearchParams: (state, action: PayloadAction<StudentSearchParams>) => {
      state.searchParams = action.payload;
      state.currentPage = 1; // Reset to first page when search params change
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatus: (state, action: PayloadAction<RecordStatus | "all">) => {
      state.status = action.payload;
    },
    invalidateCache: state => {
      state.shouldRefresh = true;
    },
    resetError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStudents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.shouldRefresh = false;

        if (!action.payload.fromCache) {
          state.students = action.payload.students;
          state.totalStudents = action.payload.totalStudents;
        }
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRoles.pending, state => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = null;

        if (!action.payload.fromCache) {
          state.roles = action.payload.roles;
          state.studentRoleId = action.payload.studentRoleId;
        }
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload as string;
      });
  },
});

export const {
  setCurrentPage,
  setPageSize,
  setSearchParams,
  setSearchQuery,
  setStatus,
  invalidateCache,
  resetError,
} = studentDataSlice.actions;

// Selectors
export const selectStudentData = (state: { studentData: StudentDataState }) =>
  state.studentData.students;

export const selectStudentTotal = (state: { studentData: StudentDataState }) =>
  state.studentData.totalStudents;

export const selectStudentLoading = (state: {
  studentData: StudentDataState;
}) => state.studentData.loading;

export const selectStudentError = (state: { studentData: StudentDataState }) =>
  state.studentData.error;

export const selectStudentPagination = (state: {
  studentData: StudentDataState;
}) => ({
  currentPage: state.studentData.currentPage,
  pageSize: state.studentData.pageSize,
  totalStudents: state.studentData.totalStudents,
});

export const selectStudentSearchParams = (state: {
  studentData: StudentDataState;
}) => state.studentData.searchParams;

export const selectRoles = (state: { studentData: StudentDataState }) =>
  state.studentData.roles;

export const selectStudentRoleId = (state: { studentData: StudentDataState }) =>
  state.studentData.studentRoleId;

export const selectRolesLoading = (state: { studentData: StudentDataState }) =>
  state.studentData.rolesLoading;

export const selectRolesError = (state: { studentData: StudentDataState }) =>
  state.studentData.rolesError;

export const selectSearchQuery = (state: { studentData: StudentDataState }) =>
  state.studentData.searchQuery;

export const selectStatus = (state: { studentData: StudentDataState }) =>
  state.studentData.status;

export default studentDataSlice.reducer;

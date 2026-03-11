import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getFromLocalStorage = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

const setToLocalStorage = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

const removeFromLocalStorage = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export interface AuthState {
  userId: string | null;
  schoolId: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userId: getFromLocalStorage("userId"),
  schoolId: getFromLocalStorage("schoolId"),
  role: getFromLocalStorage("role"),
  isAuthenticated: !!(
    getFromLocalStorage("userId") && getFromLocalStorage("schoolId")
  ),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ userId: string; schoolId: string; role: string }>,
    ) => {
      state.userId = action.payload.userId;
      state.schoolId = action.payload.schoolId;
      state.role = action.payload.role;
      state.isAuthenticated = true;

      setToLocalStorage("userId", action.payload.userId);
      setToLocalStorage("schoolId", action.payload.schoolId);
      setToLocalStorage("role", action.payload.role);
    },
    clearAuth: state => {
      state.userId = null;
      state.schoolId = null;
      state.role = null;
      state.isAuthenticated = false;

      removeFromLocalStorage("userId");
      removeFromLocalStorage("schoolId");
      removeFromLocalStorage("role");
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      state.isAuthenticated = !!(action.payload && state.schoolId);

      setToLocalStorage("userId", action.payload);
    },
    setSchoolId: (state, action: PayloadAction<string>) => {
      state.schoolId = action.payload;
      state.isAuthenticated = !!(action.payload && state.userId);

      setToLocalStorage("schoolId", action.payload);
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;

      setToLocalStorage("role", action.payload);
    },
  },
});

export const { setAuth, clearAuth, setUserId, setSchoolId, setRole } =
  authSlice.actions;

export default authSlice.reducer;

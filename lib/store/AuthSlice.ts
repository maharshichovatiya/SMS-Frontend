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
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userId: getFromLocalStorage("userId"),
  schoolId: getFromLocalStorage("schoolId"),
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
      action: PayloadAction<{ userId: string; schoolId: string }>,
    ) => {
      state.userId = action.payload.userId;
      state.schoolId = action.payload.schoolId;
      state.isAuthenticated = true;

      setToLocalStorage("userId", action.payload.userId);
      setToLocalStorage("schoolId", action.payload.schoolId);
    },
    clearAuth: state => {
      state.userId = null;
      state.schoolId = null;
      state.isAuthenticated = false;

      removeFromLocalStorage("userId");
      removeFromLocalStorage("schoolId");
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
  },
});

export const { setAuth, clearAuth, setUserId, setSchoolId } = authSlice.actions;

export default authSlice.reducer;

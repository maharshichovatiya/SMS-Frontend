// Redux Action Types

export interface ReduxAction<T = unknown> {
  type: string;
  payload?: T;
}

export interface AuthAction {
  type:
    | "auth/setAuth"
    | "auth/clearAuth"
    | "auth/setUserId"
    | "auth/setSchoolId";
  payload?: {
    userId?: string;
    schoolId?: string;
  };
}

export type AppDispatchAction = AuthAction | ReduxAction;

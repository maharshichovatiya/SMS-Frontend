export const getFromLocalStorage = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

export const setToLocalStorage = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

export const removeFromLocalStorage = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export const getAuthData = () => {
  return {
    userId: getFromLocalStorage("userId"),
    schoolId: getFromLocalStorage("schoolId"),
    role: getFromLocalStorage("role"),
  };
};

export const isUserAuthenticated = (): boolean => {
  const { userId, schoolId } = getAuthData();
  return !!(userId && schoolId);
};

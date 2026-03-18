import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/Index";
import { fetchTeacherProfile } from "@/lib/store/TeacherProfileSlice";
import { useEffect } from "react";
import { AppDispatch } from "@/lib/store/Index";

export const useTeacherProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    profile: teacherData,
    loading,
    error,
    hasLoadedOnce,
  } = useSelector((state: RootState) => state.teacherProfile);

  const { userId } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userId && !hasLoadedOnce && !loading) {
      dispatch(fetchTeacherProfile());
    }
  }, [dispatch, userId, hasLoadedOnce, loading]);

  useEffect(() => {}, [teacherData, loading, error, hasLoadedOnce]);

  const refetch = () => {
    if (userId) {
      dispatch(fetchTeacherProfile());
    }
  };

  return {
    teacherData,
    loading,
    error,
    hasLoadedOnce,
    refetch,
    userId,
  };
};

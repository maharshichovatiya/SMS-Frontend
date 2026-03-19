import api from "../Axios";
import {
  StudentDashboardSummaryResponse,
  UpcomingHomeworkResponse,
  StudentSubjectsResponse,
} from "../types/StudentDashboard";

export const getStudentSummary = async () => {
  const res = await api.get<{ data: StudentDashboardSummaryResponse }>(
    "/dashboard/student/summary",
  );
  return res.data.data.data;
};

export const getUpcomingHomework = async () => {
  const res = await api.get<{ data: UpcomingHomeworkResponse }>(
    "/dashboard/student/upcoming-homework",
  );
  return res.data.data.data;
};

export const getStudentSubjects = async () => {
  const res = await api.get<{ data: StudentSubjectsResponse }>(
    "/dashboard/student/subjects",
  );
  return res.data.data.data;
};

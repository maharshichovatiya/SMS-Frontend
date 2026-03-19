export interface StudentDashboardSummary {
  pendingHomework: {
    count: number;
    dueTomorrow?: number;
  };
  submittedHomework: {
    count: number;
  };
  gradedHomework: {
    count: number;
  };
  resources: {
    count: number;
  };
}

export interface UpcomingHomework {
  title: string;
  subjectName: string;
  dueDate: string;
  submissionStatus: string;
}

export interface StudentSubject {
  subjectName: string;
  teacherFirstName: string;
  teacherLastName: string;
}

export interface StudentDashboardSummaryResponse {
  statusCode: number;
  message: string;
  data: StudentDashboardSummary;
}

export interface UpcomingHomeworkResponse {
  statusCode: number;
  message: string;
  data: UpcomingHomework[];
}

export interface StudentSubjectsResponse {
  statusCode: number;
  message: string;
  data: StudentSubject[];
}

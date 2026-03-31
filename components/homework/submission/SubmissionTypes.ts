export interface StudentSubmission {
  id: string;
  submissionId?: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded" | "rejected";
  submittedAt?: string;
  file?: string;
  fileSize?: string;
  grade?: string;
  feedback?: string;
  notes?: string;
  teacher: string;
  description: string;
  className: string;
  maxMarks?: number;
  fileUrl?: string;
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getLetterGrade = (
  marksObtained: number | null | undefined,
): string => {
  if (
    marksObtained === null ||
    marksObtained === undefined ||
    isNaN(marksObtained)
  )
    return "—";
  if (marksObtained >= 90) return "A+";
  if (marksObtained >= 80) return "A";
  if (marksObtained >= 70) return "B";
  if (marksObtained >= 60) return "C";
  if (marksObtained >= 50) return "D";
  if (marksObtained >= 35) return "E";
  return "F";
};

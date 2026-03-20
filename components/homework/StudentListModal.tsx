"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/Index";
import { downloadSubmission } from "../../lib/store/SubmissionSlice";
import { homeworkApis } from "@/lib/api/Homework";
import { HomeworkStudent } from "@/lib/types/Homework";

const getLetterGrade = (marksObtained: number | null | undefined): string => {
  if (marksObtained === null || marksObtained === undefined) return "—";
  if (marksObtained >= 90) return "A+";
  if (marksObtained >= 80) return "A";
  if (marksObtained >= 70) return "B";
  if (marksObtained >= 60) return "C";
  if (marksObtained >= 50) return "D";
  if (marksObtained >= 35) return "E";
  return "F";
};

interface Student {
  id: string;
  name: string;
  email: string;
  className: string;
  section: string;
  status: "submitted" | "pending" | "overdue" | "graded";
  submittedDate?: string;
  grade?: string;
  marksObtained?: number;
  feedback?: string;
  file?: string;
  submissionId?: string;
}

interface HomeworkUser {
  firstName: string;
  lastName: string;
  email: string;
}

interface HomeworkData {
  id: string;
  title: string;
  totalAssignedTo?: number;
  submittedCount?: number;
  gradedCount?: number;
  pendingCount?: number;
}

export type { HomeworkData };

interface StudentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeworkTitle: string;
  homeworkId?: string;
  homeworkData?: HomeworkData;
}

export const StudentListModal: React.FC<StudentListModalProps> = ({
  isOpen,
  onClose,
  homeworkTitle,
  homeworkId,
  homeworkData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { feedbackLoading } = useSelector(
    (state: RootState) => state.submissions,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    status: "approved" as "approved" | "rejected",
    marksObtained: 0,
    feedback: "",
  });
  const [expandedFeedback, setExpandedFeedback] = useState<{
    [key: string]: boolean;
  }>({});
  const [homeworkStudents, setHomeworkStudents] = useState<HomeworkStudent[]>(
    [],
  );
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [apiStats, setApiStats] = useState<{
    totalStudents: number;
    submittedCount: number;
    pendingCount: number;
    totalGraded: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen && homeworkId) {
      const fetchHomeworkStudents = async () => {
        try {
          setStudentsLoading(true);
          const response = await homeworkApis.getHomeworkStudents(homeworkId);
          const students = response.data?.data?.students;
          const stats = response.data?.data;

          if (stats) {
            setApiStats({
              totalStudents: stats.totalStudents,
              submittedCount: stats.submittedCount,
              pendingCount: stats.pendingCount,
              totalGraded: stats.totalGraded,
            });
          }

          if (students && students.length > 0) {
            setHomeworkStudents(students);
          } else {
            setHomeworkStudents([]);
          }
        } catch (error) {
          setHomeworkStudents([]);
        } finally {
          setStudentsLoading(false);
        }
      };

      fetchHomeworkStudents();
    } else if (!isOpen) {
      setHomeworkStudents([]);
      setApiStats(null);
    }
  }, [isOpen, homeworkId]);
  const localStudents = React.useMemo(() => {
    if (!isOpen) return [];

    if (homeworkStudents.length > 0) {
      const mappedStudents = homeworkStudents.map((apiStudent): Student => {
        return {
          id: apiStudent.studentId,
          name: `${apiStudent.firstName || ""} ${apiStudent.lastName || ""}`.trim(),
          email: apiStudent.email || "",
          className: apiStudent.className || "",
          section: apiStudent.section || "",
          status:
            (apiStudent.submission?.status as string) === "approved"
              ? "graded"
              : (apiStudent.submission?.status as string) === "rejected"
                ? "graded"
                : apiStudent.submission?.status === "submitted"
                  ? "submitted"
                  : "pending",
          submittedDate: apiStudent.submission?.submissionDate
            ? new Date(apiStudent.submission.submissionDate).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )
            : undefined,
          marksObtained: apiStudent.submission?.marksObtained ?? undefined,
          grade: getLetterGrade(apiStudent.submission?.marksObtained),
          feedback: apiStudent.submission?.feedback || undefined,
          file: apiStudent.submission?.attachments?.[0]?.fileName,
          submissionId: apiStudent.submission?.id,
        };
      });
      return mappedStudents;
    }

    return [];
  }, [isOpen, homeworkStudents]);

  // Use API statistics if available, otherwise calculate from local students
  const totalStudents =
    apiStats?.totalStudents ??
    homeworkData?.totalAssignedTo ??
    homeworkStudents.length ??
    localStudents.length;
  const submittedCount =
    apiStats?.submittedCount ??
    homeworkData?.submittedCount ??
    localStudents.filter(s => s.status === "submitted").length;
  const gradedCount =
    apiStats?.totalGraded ??
    homeworkData?.gradedCount ??
    localStudents.filter(s => s.status === "graded").length;
  const pendingCount =
    apiStats?.pendingCount ??
    homeworkData?.pendingCount ??
    localStudents.filter(s => s.status === "pending").length;
  const totalSubmitted = submittedCount + gradedCount;
  const lateCount = localStudents.filter(s => s.status === "overdue").length;
  const notSubmittedCount = pendingCount;
  const progressPercentage =
    totalStudents > 0 ? Math.round((totalSubmitted / totalStudents) * 100) : 0;

  // Filter students based on active filter
  const filteredStudents = localStudents.filter(student => {
    switch (activeFilter) {
      case "submitted":
        return student.status === "submitted";
      case "graded":
        return student.status === "graded";
      case "late":
        return student.status === "overdue";
      case "not_submitted":
        return student.status === "pending";
      default:
        return true;
    }
  });

  const filterOptions = [
    { label: "All", value: "all", count: totalStudents },
    { label: "Submitted", value: "submitted", count: submittedCount },
    { label: "Graded", value: "graded", count: gradedCount },
    {
      label: "Not Submitted",
      value: "not_submitted",
      count: notSubmittedCount,
    },
  ];

  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "submitted":
        return "var(--color-blue-light)";
      case "graded":
        return "var(--color-green-light)";
      case "pending":
        return "var(--color-amber-light)";
      case "overdue":
        return "var(--color-rose-light)";
      default:
        return "#f3f4f6";
    }
  };

  const getStatusTextColor = (status: Student["status"]) => {
    switch (status) {
      case "submitted":
        return "var(--color-blue)";
      case "graded":
        return "var(--color-green)";
      case "pending":
        return "var(--color-amber)";
      case "overdue":
        return "var(--color-rose)";
      default:
        return "#6b7280";
    }
  };

  const _getBorderColor = (status: Student["status"]) => {
    switch (status) {
      case "submitted":
        return "var(--color-blue)";
      case "graded":
        return "var(--color-green)";
      case "pending":
        return "var(--color-amber)";
      case "overdue":
        return "var(--color-rose)";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: Student["status"]) => {
    switch (status) {
      case "submitted":
        return "Submitted";
      case "graded":
        return "Graded";
      case "pending":
        return "Not Submitted";
      case "overdue":
        return "Late";
      default:
        return "Unknown";
    }
  };

  const handleFeedbackClick = (student: Student) => {
    setSelectedStudent(student);
    setFeedbackForm({
      status: student.status === "graded" ? "approved" : "approved",
      marksObtained: student.grade ? parseInt(student.grade) : 0,
      feedback: student.feedback || "",
    });
    setShowFeedbackModal(true);
  };

  const toggleFeedbackPanel = (studentId: string) => {
    setExpandedFeedback(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSubmitFeedback = async () => {
    if (!selectedStudent || !selectedStudent.submissionId) return;

    try {
      await homeworkApis.reviewSubmission(selectedStudent.submissionId, {
        status: feedbackForm.status,
        marksObtained: feedbackForm.marksObtained || undefined,
        feedback: feedbackForm.feedback || undefined,
      });

      // Refresh the student list after successful review
      if (homeworkId) {
        const response = await homeworkApis.getHomeworkStudents(homeworkId);
        const students = response.data?.data?.students;
        const stats = response.data?.data;

        if (stats) {
          setApiStats({
            totalStudents: stats.totalStudents,
            submittedCount: stats.submittedCount,
            pendingCount: stats.pendingCount,
            totalGraded: stats.totalGraded,
          });
        }

        if (students) {
          setHomeworkStudents(students);
        }
      }

      setShowFeedbackModal(false);
      setSelectedStudent(null);
    } catch (_error) {}
  };

  const handleDownload = async (student: Student) => {
    if (!homeworkId || !student.file) return;

    try {
      await dispatch(
        downloadSubmission({
          homeworkId,
          studentId: student.id,
          fileName: student.file,
        }),
      ).unwrap();
    } catch (_error) {}
  };

  if (!isOpen) return null;

  if (studentsLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[999]">
        <div
          className="absolute inset-0 bg-[rgba(17,24,39,0.45)] backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
          <div className="flex flex-col items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[999]">
      <div
        className="absolute inset-0 bg-[rgba(17,24,39,0.55)] backdrop-blur-[6px]"
        onClick={onClose}
      />

      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[20px] shadow-[0_24px_80px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden relative">
        <div className="bg-white p-6 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {homeworkTitle}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Mathematics · Class 10-A · Sunita Mishra · Due: Mar 15, 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {totalSubmitted}
              </div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
                Submitted
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
              <div className="text-3xl font-bold text-emerald-500">
                {gradedCount}
              </div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
                Graded
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
              <div className="text-3xl font-bold text-amber-500">
                {pendingCount}
              </div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
                Pending
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-700">
                Submission Progress
              </div>
              <div className="text-sm font-bold text-blue-600">
                {progressPercentage}% ({totalSubmitted}/{totalStudents})
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {filterOptions.map(filter => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg font-medium mb-2">
                  No students found
                </div>
                <div className="text-sm">
                  No students match the selected filter.
                </div>
              </div>
            ) : (
              filteredStudents.map((student, index) => {
                const initials = student.name
                  .split(" ")
                  .map(n => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                // Get avatar color based on student index for variety
                const avatarColors = [
                  "bg-blue-500",
                  "bg-emerald-500",
                  "bg-violet-500",
                  "bg-rose-500",
                  "bg-amber-500",
                  "bg-cyan-500",
                  "bg-pink-500",
                  "bg-indigo-500",
                ];
                const avatarColor = avatarColors[index % avatarColors.length];

                return (
                  <div
                    key={student.id}
                    className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
                  >
                    {/* Row 1: Avatar, Name, ID, Status, Grade */}
                    <div className="flex items-center justify-between">
                      {/* Left: Avatar, Name, ID */}
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div
                          className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0`}
                        >
                          <span className="text-white font-semibold text-sm">
                            {initials}
                          </span>
                        </div>

                        {/* Name and ID */}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {student.name}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            ST-2026-00{index + 1}
                          </p>
                        </div>
                      </div>

                      {/* Right: Status and Grade */}
                      <div className="flex items-center gap-4">
                        {/* Status Badge */}
                        {student.status === "graded" && (
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                            <span>Graded</span>
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}

                        {student.status === "submitted" && (
                          <div className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                            Submitted
                          </div>
                        )}

                        {student.status === "pending" && (
                          <div className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                            Not Submitted
                          </div>
                        )}

                        {student.status === "overdue" && (
                          <div className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-medium">
                            Late
                          </div>
                        )}

                        {/* Grade */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Grade:</span>
                          {student.status === "graded" ? (
                            <span className="inline-flex items-center justify-center w-10 h-7 bg-white border border-gray-200 rounded-md text-sm font-semibold text-gray-700">
                              {student.grade || "A+"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-10 h-7 bg-white border border-gray-200 rounded-md text-sm text-gray-400">
                              —
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Date, File, Action Buttons - Single row */}
                    {student.status !== "pending" && (
                      <div className="flex items-center mt-3 pl-16">
                        {/* Date */}
                        {student.submittedDate && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-shrink-0">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{student.submittedDate}</span>
                          </div>
                        )}

                        {/* File */}
                        {student.file && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 ml-6">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            <span className="truncate max-w-[200px]">
                              {student.file.split("/").pop() || student.file}
                            </span>
                          </div>
                        )}

                        {/* Spacer to push buttons right */}
                        <div className="flex-1"></div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {student.file && (
                            <button
                              onClick={() => handleDownload(student)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <svg
                                className="w-4 h-4 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              Download
                            </button>
                          )}

                          <button
                            onClick={() => handleFeedbackClick(student)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            Feedback
                          </button>

                          {student.status === "submitted" && (
                            <button
                              onClick={() => handleFeedbackClick(student)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors whitespace-nowrap"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Save Grade
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showFeedbackModal && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[999]">
          <div
            className="absolute inset-0 bg-[rgba(17,24,39,0.55)] backdrop-blur-[6px]"
            onClick={() => setShowFeedbackModal(false)}
          />
          <div className="bg-[var(--color-surface)] rounded-[20px] shadow-[0_24px_80px_rgba(0,0,0,0.25)] w-full max-w-md relative">
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text)]">
                    Provide Feedback
                  </h3>
                  <p className="text-[var(--color-text-2)] mt-1">
                    {selectedStudent.name} - {homeworkTitle}
                  </p>
                </div>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-bg)] cursor-pointer transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Status
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="approved"
                      checked={feedbackForm.status === "approved"}
                      onChange={e =>
                        setFeedbackForm({
                          ...feedbackForm,
                          status: e.target.value as "approved" | "rejected",
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-[var(--color-green)] mr-1">✓</span>
                    Approved
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="rejected"
                      checked={feedbackForm.status === "rejected"}
                      onChange={e =>
                        setFeedbackForm({
                          ...feedbackForm,
                          status: e.target.value as "approved" | "rejected",
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-[var(--color-rose)] mr-1">✗</span>
                    Rejected
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Grade
                </label>
                <input
                  type="text"
                  value={
                    feedbackForm.marksObtained && feedbackForm.marksObtained > 0
                      ? feedbackForm.marksObtained.toString()
                      : ""
                  }
                  onChange={e => {
                    const value = e.target.value;
                    const parsed = parseInt(value);
                    setFeedbackForm({
                      ...feedbackForm,
                      marksObtained: value === "" || isNaN(parsed) ? 0 : parsed,
                    });
                  }}
                  className="w-full px-3 py-2 border-[1.5px] border-[var(--color-border)] rounded-[8px] bg-[var(--color-surface)] text-[13px] font-bold text-center text-[var(--color-text)] focus:outline-none"
                  placeholder="—"
                  maxLength={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Feedback
                </label>
                <textarea
                  rows={4}
                  value={feedbackForm.feedback}
                  onChange={e =>
                    setFeedbackForm({
                      ...feedbackForm,
                      feedback: e.target.value,
                    })
                  }
                  placeholder="Provide feedback to the student..."
                  className="w-full px-4 py-3 border-[1.5px] border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] text-[13px] text-[var(--color-text)] resize-none focus:outline-none focus:border-[var(--color-border-focus)] transition-all leading-[1.5]"
                />
              </div>
            </div>

            <div className="p-6 border-t border-[var(--color-border)] flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 text-[var(--color-text)] bg-[var(--color-surface)] border-[1.5px] border-[var(--color-border)] rounded-lg transition-all"
                disabled={feedbackLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-4 py-2 bg-[var(--color-blue)] text-white rounded-lg transition-all flex items-center disabled:opacity-50"
                disabled={feedbackLoading}
              >
                {feedbackLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

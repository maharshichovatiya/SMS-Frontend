"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/Index";
import {
  fetchSubmissionsByHomework,
  submitFeedback,
  downloadSubmission,
} from "../../lib/store/SubmissionSlice";

interface Student {
  id: string;
  name: string;
  email: string;
  className: string;
  section: string;
  status: "submitted" | "pending" | "overdue" | "graded";
  submittedDate?: string;
  grade?: string;
  feedback?: string;
  file?: string;
}

interface StudentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeworkTitle: string;
  students: Student[];
  homeworkId?: string;
}

export const StudentListModal: React.FC<StudentListModalProps> = ({
  isOpen,
  onClose,
  homeworkTitle,
  students,
  homeworkId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentHomeworkSubmissions, loading, feedbackLoading } = useSelector(
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
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedFeedback, setExpandedFeedback] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (isOpen && homeworkId) {
      dispatch(fetchSubmissionsByHomework(homeworkId));
    }
  }, [isOpen, homeworkId, dispatch]);

  const filteredStudents = currentHomeworkSubmissions.filter(student => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || student.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

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

  const getBorderColor = (status: Student["status"]) => {
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

  const totalStudents = currentHomeworkSubmissions.length;
  const submittedCount = currentHomeworkSubmissions.filter(
    s => s.status === "submitted",
  ).length;
  const gradedCount = currentHomeworkSubmissions.filter(
    s => s.status === "graded",
  ).length;
  const lateCount = currentHomeworkSubmissions.filter(
    s => s.status === "overdue",
  ).length;
  const pendingCount = currentHomeworkSubmissions.filter(
    s => s.status === "pending",
  ).length;
  const totalSubmitted = submittedCount + gradedCount + lateCount;
  const progressPercentage =
    totalStudents > 0 ? Math.round((totalSubmitted / totalStudents) * 100) : 0;

  const handleFeedbackClick = (student: Student) => {
    setSelectedStudent(student);
    setFeedbackForm({
      status: student.status === "graded" ? "approved" : "approved",
      marksObtained: parseInt(student.grade || "0") || 0,
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
    if (!selectedStudent || !homeworkId) return;

    try {
      await dispatch(
        submitFeedback({
          homeworkId,
          studentId: selectedStudent.id,
          feedbackData: {
            status: feedbackForm.status,
            marksObtained: feedbackForm.marksObtained,
            feedback: feedbackForm.feedback,
          },
        }),
      ).unwrap();

      setShowFeedbackModal(false);
      setSelectedStudent(null);
    } catch (error) {}
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
    } catch (error) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[999]">
      <div
        className="absolute inset-0 bg-[rgba(17,24,39,0.55)] backdrop-blur-[6px]"
        onClick={onClose}
      />

      <div className="bg-[var(--color-bg)] w-full max-w-4xl max-h-[90vh] rounded-[20px] shadow-[0_24px_80px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden relative">
        <div className="bg-[var(--color-surface)] p-[22px_28px] border-b-[1.5px] border-[var(--color-border)] flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-[18px] font-extrabold text-[var(--color-text)] tracking-[-0.4px]">
                {homeworkTitle}
              </h2>
              <p className="text-[13px] text-[var(--color-text-2)] mt-[2px]">
                Student Submissions & Feedback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-[10px] border-[1.5px] border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center cursor-pointer text-[var(--color-text-2)] transition-all flex-shrink-0"
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

        <div className="flex-1 overflow-y-auto p-[22px_28px_28px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-blue)]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-3 mb-5">
                <div className="bg-[var(--color-surface)] border-[1.5px] border-[var(--color-border)] rounded-[10px] p-[14px_16px] text-center">
                  <div className="text-[24px] font-extrabold text-[var(--color-blue)] leading-none mb-[3px]">
                    {totalSubmitted}
                  </div>
                  <div className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-[0.5px]">
                    Submitted
                  </div>
                </div>
                <div className="bg-[var(--color-surface)] border-[1.5px] border-[var(--color-border)] rounded-[10px] p-[14px_16px] text-center">
                  <div className="text-[24px] font-extrabold text-[var(--color-green)] leading-none mb-[3px]">
                    {gradedCount}
                  </div>
                  <div className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-[0.5px]">
                    Graded
                  </div>
                </div>
                <div className="bg-[var(--color-surface)] border-[1.5px] border-[var(--color-border)] rounded-[10px] p-[14px_16px] text-center">
                  <div className="text-[24px] font-extrabold text-[var(--color-amber)] leading-none mb-[3px]">
                    {pendingCount}
                  </div>
                  <div className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-[0.5px]">
                    Pending
                  </div>
                </div>
                <div className="bg-[var(--color-surface)] border-[1.5px] border-[var(--color-border)] rounded-[10px] p-[14px_16px] text-center">
                  <div className="text-[24px] font-extrabold text-[var(--color-rose)] leading-none mb-[3px]">
                    {lateCount}
                  </div>
                  <div className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-[0.5px]">
                    Late
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="text-[12px] font-bold text-[var(--color-text-2)]">
                  Submission Progress
                </div>
                <div className="text-[12px] font-extrabold text-[var(--color-blue)] ml-auto">
                  {progressPercentage}% ({totalSubmitted}/{totalStudents})
                </div>
              </div>
              <div className="bg-[var(--color-bg-2)] rounded-[6px] h-2 overflow-hidden mb-4">
                <div
                  className="h-full rounded-[6px] bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-indigo)] transition-all duration-[0.6s] ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="flex gap-1.5 mb-4">
                {[
                  {
                    key: "all",
                    label: `All (${currentHomeworkSubmissions.length})`,
                  },
                  { key: "submitted", label: `Submitted (${submittedCount})` },
                  { key: "graded", label: `Graded (${gradedCount})` },
                  { key: "late", label: `Late (${lateCount})` },
                  { key: "pending", label: `Not Submitted (${pendingCount})` },
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterStatus(filter.key)}
                    className={`px-[14px] py-[6px] rounded-[100px] text-[12px] font-semibold cursor-pointer border-[1.5px] transition-all ${
                      filterStatus === filter.key
                        ? "bg-[var(--color-blue)] text-white border-[var(--color-blue)]"
                        : "bg-[var(--color-surface)] text-[var(--color-text-2)] border-[var(--color-border)]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search students by name, email, or class..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-[1.5px] border-[var(--color-border)] rounded-[11px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all"
                />
              </div>

              <div className="space-y-2.5">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12 text-[var(--color-text-3)]">
                    <div className="text-4xl mb-3 opacity-50">📭</div>
                    <div className="text-[15px] font-semibold text-[var(--color-text-2)] mb-1">
                      No Students Found
                    </div>
                    <div className="text-[13px] text-[var(--color-text-3)]">
                      {searchTerm
                        ? "No students match your search criteria."
                        : "No students assigned to this homework."}
                    </div>
                  </div>
                ) : (
                  filteredStudents.map((student, index) => {
                    let cardClasses =
                      "bg-[var(--color-surface)] border-[1.5px] border-[var(--color-border)] rounded-[10px] p-[16px_18px] transition-all";

                    if (student.status === "pending") {
                      cardClasses +=
                        " border-l-3 border-l-[var(--color-amber)] bg-[var(--color-amber-light)]";
                    }
                    if (student.status === "overdue") {
                      cardClasses += " border-l-3 border-l-[var(--color-rose)]";
                    }
                    if (student.status === "graded") {
                      cardClasses +=
                        " border-l-3 border-l-[var(--color-green)]";
                    }

                    return (
                      <div key={student.id} className={cardClasses}>
                        <div className="flex items-center gap-3 mb-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-indigo)] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                            {student.studentName
                              .split(" ")
                              .map(n => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-bold text-[var(--color-text)]">
                              {student.studentName}
                            </div>
                            <div className="text-[11px] text-[var(--color-text-2)]">
                              {student.studentEmail}
                            </div>
                          </div>
                          <span
                            className="px-[11px] py-[3px] rounded-[100px] text-[11.5px] font-semibold"
                            style={{
                              background: getStatusColor(student.status),
                              color: getStatusTextColor(student.status),
                            }}
                          >
                            {getStatusText(student.status)}
                          </span>
                        </div>

                        {student.status !== "pending" && (
                          <div className="flex items-center gap-4 flex-wrap text-[12.5px] text-[var(--color-text-2)] mb-2">
                            {student.submittedDate && (
                              <span>
                                {new Date(
                                  student.submittedDate,
                                ).toLocaleString()}
                              </span>
                            )}
                            {student.file && <span>{student.file}</span>}
                            {student.grade && (
                              <span>Grade: {student.grade}</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          {student.status === "pending" ? (
                            <div className="flex items-center gap-1 text-[var(--color-amber)] text-[12.5px]">
                              <span>Has not submitted yet</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {student.file && (
                                <button
                                  onClick={() => handleDownload(student)}
                                  className="px-[12px] py-[5px] rounded-[8px] text-[11.5px] font-semibold cursor-pointer border-[1.5px] border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-2)] transition-all"
                                >
                                  Download
                                </button>
                              )}
                              <button
                                onClick={() => handleFeedbackClick(student)}
                                className="px-[12px] py-[5px] rounded-[8px] text-[11.5px] font-semibold cursor-pointer border-[1.5px] border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-2)] transition-all"
                              >
                                Feedback
                              </button>
                              {student.status !== "graded" && (
                                <button className="px-[12px] py-[5px] rounded-[8px] text-[11.5px] font-semibold cursor-pointer bg-[var(--color-green)] text-white border-[1.5px] border-[var(--color-green)] transition-all">
                                  Save Grade
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {expandedFeedback[student.id] && (
                          <div className="mt-2.5 pt-2.5 border-t border-[var(--color-border)]">
                            <textarea
                              className="w-full min-h-[68px] p-[10px_14px] border-[1.5px] border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] text-[13px] text-[var(--color-text)] resize-none focus:outline-none focus:border-[var(--color-border-focus)] transition-all leading-[1.5]"
                              placeholder={`Write feedback for ${student.studentName}...`}
                              defaultValue={student.feedback || ""}
                            />
                            <div className="flex items-center gap-2 mt-2 justify-end">
                              <button
                                onClick={() => toggleFeedbackPanel(student.id)}
                                className="px-[12px] py-[5px] rounded-[8px] text-[11.5px] font-semibold cursor-pointer border-[1.5px] border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-2)] transition-all"
                              >
                                Cancel
                              </button>
                              <button className="px-[12px] py-[5px] rounded-[8px] text-[11.5px] font-semibold cursor-pointer bg-[var(--color-green)] text-white border-[1.5px] border-[var(--color-green)] transition-all">
                                Save Feedback
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
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
                    {selectedStudent.studentName} - {homeworkTitle}
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
                  value={feedbackForm.marksObtained}
                  onChange={e =>
                    setFeedbackForm({
                      ...feedbackForm,
                      marksObtained: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border-[1.5px] border-[var(--color-border)] rounded-[8px] bg-[var(--color-surface)] text-[13px] font-bold text-center text-[var(--color-text)] focus:outline-none"
                  placeholder="—"
                  maxLength="3"
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

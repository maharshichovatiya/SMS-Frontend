"use client";

import { HomeworkCardClassic } from "@/components/homework/HomeworkCardClassic";
import { HomeworkDetailModal } from "@/components/homework/HomeworkDetailModal";
import { StudentSubmissionModal } from "@/components/homework/StudentSubmissionModal";
import { StudentSubmissionTable } from "@/components/homework/StudentSubmissionTable";
import PageHeader from "@/components/layout/PageHeader";
import {
  fetchStudentHomework,
  fetchStudentSubmissions,
} from "@/lib/store/HomeworkSlice";
import { AppDispatch, RootState } from "@/lib/store/Index";
import { StudentHomework, StudentSubmissionItem } from "@/lib/types/Homework";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface StudentSubmission {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  submittedAt?: string;
  file?: string;
  fileSize?: string;
  grade?: string;
  feedback?: string;
  notes?: string;
  teacher: string;
  description: string;
  className: string;
}

interface TransformedHomework {
  id: string;
  title: string;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
  submitted: number;
  total: number;
  status: "active" | "completed" | "overdue";
  description: string;
  chapterName?: string;
  chapterId?: string;
}

export default function HomeworkPage() {
  const dispatch = useDispatch<AppDispatch>();
  const homeworkList = useSelector(
    (state: RootState) => state.homework.studentHomeworkList,
  );
  const submissionsList = useSelector(
    (state: RootState) => state.homework.studentSubmissions,
  );
  const loading = useSelector((state: RootState) => state.homework.loading);
  const error = useSelector((state: RootState) => state.homework.error);

  const [selectedHomework, setSelectedHomework] =
    useState<StudentHomework | null>(null);
  const [selectedHomeworkDetail, setSelectedHomeworkDetail] =
    useState<StudentHomework | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<StudentSubmission | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  useEffect(() => {
    dispatch(fetchStudentHomework());
    dispatch(fetchStudentSubmissions());
  }, [dispatch]);

  // Transform API data to match StudentSubmission interface
  const transformSubmissionData = (
    item: StudentSubmissionItem,
  ): StudentSubmission => {
    const isSubmitted = item.submission !== null;
    const isGraded = isSubmitted && item.submission?.grade !== null;

    return {
      id: item.id,
      title: item.title,
      subject: item.subject.subjectName,
      dueDate: item.dueDate,
      status: isGraded ? "graded" : isSubmitted ? "submitted" : "pending",
      submittedAt: isSubmitted ? item.submission?.submittedAt : undefined,
      file: isSubmitted ? item.submission?.fileUrl : undefined,
      fileSize: isSubmitted ? item.submission?.fileSize : undefined,
      grade: isGraded ? item.submission?.grade : undefined,
      feedback: isGraded ? item.submission?.feedback : undefined,
      teacher: "Teacher", // Will be updated when teacher info is available
      description: item.description,
      className: item.classno || "Not Assigned",
    };
  };

  // Use real submissions data when available
  const transformedSubmissions: StudentSubmission[] = submissionsList?.data
    ? submissionsList.data.map(transformSubmissionData)
    : [];

  const handleViewDetails = async (homeworkId: string) => {
    setSelectedHomework(homeworkId);
    setDetailLoading(true);

    const homeworkData = homeworkList?.homework?.find(
      hw => hw.id === homeworkId,
    );

    if (homeworkData) {
      setSelectedHomeworkDetail(homeworkData);
    } else {
      setSelectedHomeworkDetail(null);
      setSelectedHomework(null);
    }
    setDetailLoading(false);
  };

  // Student submission handlers
  const handleViewSubmission = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
    setShowSubmissionModal(true);
  };

  const handleSubmitHomework = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
    setShowSubmissionModal(true);
  };

  const handleSubmissionSubmit = async (_data: {
    file: File;
    notes: string;
  }) => {
    // if (!selectedSubmission) return;
    // console.log(selectedSubmission?.id, data);
    // TODO: Implement actual API call for submission
    // This would be a POST request to submit homework
    // await homeworkApis.submitHomework(selectedSubmission.id, data);
    // For now, just refresh the data to show updated status
    // dispatch(fetchStudentSubmissions());
    // Close modal
    // setShowSubmissionModal(false);
    // setSelectedSubmission(null);
  };

  const transformedHomeworkList: TransformedHomework[] =
    homeworkList?.homework?.map((hw: StudentHomework) => ({
      id: hw.id,
      title: hw.title,
      subject: hw.subject?.subjectName || hw.subject.subjectName,
      class: hw.classno || "Not Assigned",
      teacher:
        `${hw.teacher?.firstName} ${hw.teacher?.lastName}` || "Not Assigned",
      dueDate: hw.dueDate,
      submitted: 0, // Will be updated when submission data is available
      total: 1,
      status: hw.isOverdue ? "overdue" : "active",
      description: hw.description,
      chapterName: hw.chapter?.chapterName || "",
      chapterId: hw.chapterId || undefined,
    })) || [];

  if (loading && !homeworkList) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading homework...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={() => dispatch(fetchStudentHomework())}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const showHomeworkDetail = selectedHomework !== null;

  return (
    <div>
      <PageHeader
        title="My Homework"
        description="View and manage your homework assignments"
        icon={BookOpen}
        iconBgColor="--blue-light"
        iconColor="--blue"
      />

      <div
        className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl mb-[18px] shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden animate-fadeUp"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="px-[22px] py-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search homework..."
              className="w-full px-4 py-3 border-[1.5px] border-[#dde3f5] rounded-lg font-[var(--font-sans)] text-[13.5px] text-[#111827] outline-none transition-all duration-200 bg-[#fafbff] cursor-text focus:border-[#3d6cf4] focus:shadow-[0_0_0_3px_rgba(61,108,244,0.1)]"
            />
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] animate-fadeUp"
        style={{ animationDelay: "0.3s" }}
      >
        {transformedHomeworkList.map(hw => (
          <div
            key={hw.id}
            className="animate-fadeUp"
            style={{ animationDelay: "0.1s" }}
          >
            <HomeworkCardClassic
              id={hw.id}
              title={hw.title}
              subject={hw.subject}
              className={hw.class || ""}
              teacher={hw.teacher}
              dueDate={hw.dueDate}
              submitted={hw.submitted}
              total={hw.total}
              status={hw.status}
              description={hw.description}
              chapterName={hw.chapterName}
              isModalOpen={!!selectedHomework}
              onViewDetails={() => handleViewDetails(hw.id)}
              onEdit={() => {}} // No editing for students
              onDelete={() => {}} // No deletion for students
              onStudentAssignment={() => {}} // No assignment for students
              onClassClick={() => {}} // No class management for students
            />
          </div>
        ))}
      </div>

      {/* Student Submissions Table */}
      <div className="mt-8">
        <StudentSubmissionTable
          submissions={transformedSubmissions}
          onViewSubmission={handleViewSubmission}
          onSubmitHomework={handleSubmitHomework}
        />
      </div>

      {showHomeworkDetail && (
        <>
          {detailLoading ? (
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[var(--z-modal)]">
              <div
                className="absolute inset-0 bg-[rgba(17,24,39,0.45)] backdrop-blur-sm"
                onClick={() => {
                  setSelectedHomework(null);
                  setSelectedHomeworkDetail(null);
                }}
              />
              <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-xl w-full max-w-md p-8 relative">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Loading homework details...</p>
                </div>
              </div>
            </div>
          ) : (
            <HomeworkDetailModal
              isOpen={!!selectedHomework}
              onClose={() => {
                setSelectedHomework(null);
                setSelectedHomeworkDetail(null);
              }}
              homework={selectedHomeworkDetail}
              onClassClick={() => {}}
            />
          )}
        </>
      )}

      {/* Student Submission Modal */}
      {showSubmissionModal && selectedSubmission && (
        <StudentSubmissionModal
          isOpen={showSubmissionModal}
          onClose={() => {
            setShowSubmissionModal(false);
            setSelectedSubmission(null);
          }}
          submission={selectedSubmission}
          onSubmit={handleSubmissionSubmit}
        />
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

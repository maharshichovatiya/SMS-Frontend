"use client";

import { HomeworkCardClassic } from "@/components/homework/HomeworkCardClassic";
import { HomeworkDetailModal } from "@/components/homework/HomeworkDetailModal";
import { StudentSubmissionModal } from "@/components/homework/StudentSubmissionModal";
import type { StudentSubmission } from "@/components/homework/submission/SubmissionTypes";
import { StudentSubmissionTable } from "@/components/homework/StudentSubmissionTable";
import PageHeader from "@/components/layout/PageHeader";
import {
  fetchStudentSubmissions,
  submitStudentHomework,
} from "@/lib/store/SubmissionSlice";
import { fetchStudentHomework } from "@/lib/store/HomeworkSlice";
import HomeworkSkeleton from "@/components/skeletons/HomeworkSkeleton";
import { AppDispatch, RootState } from "@/lib/store/Index";
import { StudentHomework, StudentSubmissionItem } from "@/lib/types/Homework";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  chapterNo?: number;
}

export default function HomeworkPage() {
  const dispatch = useDispatch<AppDispatch>();
  const homeworkList = useSelector(
    (state: RootState) => state.homework.studentHomeworkList,
  );
  const studentSubmissions = useSelector(
    (state: RootState) => state.submissions.studentSubmissions,
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

  const transformSubmissionData = (
    item: StudentSubmissionItem,
  ): StudentSubmission => {
    const isSubmitted = item.submission !== null;
    const isGraded = isSubmitted && item.submission?.marksObtained !== null;
    const isRejected = isSubmitted && item.submission?.status === "rejected";

    return {
      id: item.homeworkId,
      title: item.title,
      subject: item.subject.subjectName,
      dueDate: item.dueDate,
      status: isRejected
        ? "rejected"
        : isGraded
          ? "graded"
          : isSubmitted
            ? "submitted"
            : "pending",
      submittedAt: isSubmitted ? item.submission?.submissionDate : undefined,
      file: isSubmitted
        ? item.submission?.submissionAttachments?.[0]?.fileName
        : undefined,
      fileSize: isSubmitted
        ? item.submission?.submissionAttachments?.[0]?.fileSize
        : undefined,
      grade: isGraded ? item.submission?.marksObtained?.toString() : undefined,
      feedback: isGraded ? (item.submission?.feedback ?? undefined) : undefined,
      fileUrl: isSubmitted
        ? item.submission?.submissionAttachments?.[0]?.fileUrl
        : undefined,
      teacher: `${item.teacher.firstName} ${item.teacher.lastName}`,
      description: item.description,
      className: item.subject.subjectName,
      maxMarks: item.subject.maxMarks,
    };
  };

  const transformedSubmissions: StudentSubmission[] = studentSubmissions
    ? studentSubmissions.map(transformSubmissionData)
    : [];

  const handleViewDetails = async (homeworkId: string) => {
    setDetailLoading(true);

    const homeworkData = homeworkList?.homework?.find(
      hw => hw.id === homeworkId,
    );

    if (homeworkData) {
      setSelectedHomeworkDetail(homeworkData);
      setSelectedHomework(homeworkData);
    } else {
      setSelectedHomeworkDetail(null);
      setSelectedHomework(null);
    }
    setDetailLoading(false);
  };

  const handleViewSubmission = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
    setShowSubmissionModal(true);
  };

  const handleSubmitHomework = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
    setShowSubmissionModal(true);
  };

  const handleSubmissionSubmit = async (data: { file: File }) => {
    if (!selectedSubmission) return;

    const result = await dispatch(
      submitStudentHomework({
        homeworkId: selectedSubmission.id,
        attachments: [data.file],
      }),
    );

    if (submitStudentHomework.fulfilled.match(result)) {
      dispatch(fetchStudentSubmissions());
    }
  };

  const transformedHomeworkList: TransformedHomework[] =
    homeworkList?.homework?.map((hw: StudentHomework) => ({
      id: hw.id,
      title: hw.title,
      subject: hw.subject?.subjectName || hw.subject.subjectName,
      class: hw.classno || "Not Assigned",
      teacher:
        `${hw.teacher?.firstName} ${hw.teacher?.lastName}` || "Not Assigned",
      dueDate: new Date(hw.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      submitted: 0,
      total: 1,
      status: hw.isOverdue ? "overdue" : "active",
      description: hw.description,
      chapterName: hw.chapter?.chapterName || "",
      chapterId: hw.chapter?.id || hw.chapterId || undefined,
      chapterNo: hw.chapter?.chapterNo || undefined,
    })) || [];

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

  const showHomeworkDetail = selectedHomework !== null || detailLoading;

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
        className="grid mt-5 grid-cols-1 md:grid-cols-2 gap-[24px] animate-fadeUp"
        style={{ animationDelay: "0.3s" }}
      >
        {loading && !homeworkList ? (
          <HomeworkSkeleton />
        ) : transformedHomeworkList.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24 text-[var(--text-2)] col-span-1 md:col-span-2 w-full text-center">
            <BookOpen className="w-12 h-12 mb-3 opacity-30 mx-auto" />
            <p className="text-lg font-medium">No homework assigned yet</p>
            <p className="text-sm mt-1">
              Check back later for new assignments.
            </p>
          </div>
        ) : (
          transformedHomeworkList.map(hw => (
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
                chapterNo={hw.chapterNo}
                teacher={hw.teacher}
                dueDate={hw.dueDate}
                submitted={hw.submitted}
                total={hw.total}
                status={hw.status}
                description={hw.description}
                chapterName={hw.chapterName}
                isModalOpen={!!selectedHomework}
                showActions={false}
                onViewDetails={() => handleViewDetails(hw.id)}
                onEdit={() => {}}
                onDelete={() => {}}
                onStudentAssignment={() => {}}
              />
            </div>
          ))
        )}
      </div>

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

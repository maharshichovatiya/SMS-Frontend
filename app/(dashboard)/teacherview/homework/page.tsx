"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HomeworkCardClassic } from "@/components/homework/HomeworkCardClassic";
import { StudentListModal } from "@/components/homework/StudentListModal";
import { HomeworkDetailModal } from "@/components/homework/HomeworkDetailModal";
import { ClassStudentsModal } from "@/components/homework/ClassStudentsModal";
import { CreateHomeworkForm } from "@/components/homework/CreateHomeworkForm";
import { fetchAllHomework, createNewHomework } from "@/lib/store/HomeworkSlice";
import { homeworkApis } from "@/lib/api/Homework";
import { RootState } from "@/lib/store/Index";
import { Subject } from "@/lib/types/SubjectTypes";
import api from "@/lib/Axios";
import { getClassSummary } from "@/lib/api/Classes";

interface Student {
  id: string;
  name: string;
  email: string;
  className: string;
  section: string;
  status: "submitted" | "pending" | "overdue" | "graded";
  submittedDate?: string;
  grade?: number;
  feedback?: string;
}

interface Submission {
  studentName: string;
  studentId: string;
  submittedDate: string;
  status: "submitted" | "graded" | "late" | "pending";
  grade?: string;
  feedback?: string;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rollNo?: string;
  admissionNo?: string;
  classId: string;
  className: string;
  section: string;
}

interface ClassItem {
  id: string;
  name: string;
  className: string;
  section: string;
  studentCapacity: number;
}

interface SubjectsByClassItem {
  subjects: Array<{
    subjectId: string;
    subjectName: string;
    subjectCode: string;
    passingMarks: number;
    maxMarks: number;
  }>;
}

interface ApiClassItem {
  id: string;
  className: string;
  section: string;
}

interface ApiStudentItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  rollNo?: string;
  admissionNo?: string;
}

interface ApiClassData {
  classId: string;
  className: string;
  section: string;
  students: ApiStudentItem[];
}

interface HomeworkAssignmentClass {
  className: string;
  section: string;
  classStudents?: Array<{
    student?: {
      id: string;
      user: { firstName: string; lastName: string; email: string };
      status: string;
    };
  }>;
}

interface HomeworkAssignment {
  class?: HomeworkAssignmentClass;
  student?: {
    id: string;
    user: { firstName: string; lastName: string; email: string };
    status: string;
  };
}

interface HomeworkOriginalData {
  assignments?: HomeworkAssignment[];
}

interface HomeworkForAssignment {
  id: string;
  title: string;
  originalData?: HomeworkOriginalData;
}

interface HomeworkListItem {
  id: string;
  title: string;
  subject: string | { subjectName: string };
  dueDate: string;
  submittedCount?: number;
  totalAssignedTo?: number;
  description?: string;
}

interface HomeworkListResponse {
  homework?: HomeworkListItem[];
  data?: { homework?: Array<{ id: string }> };
}

interface CreateHomeworkData {
  title: string;
  subject: string;
  dueDate: string;
  description?: string;
  instructions?: string;
  assignedTo: string;
  selectedClass?: string;
  selectedClasses?: string[];
  selectedStudents?: string[];
  allowLateSubmission?: boolean;
  maxFileSize?: number;
  attachments?: (string | File)[];
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
}

export default function HomeworkPage() {
  const dispatch = useDispatch();
  const { homeworkList, loading, error, createLoading, createError } =
    useSelector((state: RootState) => state.homework);

  const [selectedHomework, setSelectedHomework] =
    useState<HomeworkListItem | null>(null);
  const [selectedHomeworkDetail, setSelectedHomeworkDetail] =
    useState<HomeworkListItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [homeworkStudents, setHomeworkStudents] = useState<Student[]>([]);
  const [, setHomeworkStudentsLoading] = useState(false);
  const [isTeacher] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHomework, setEditingHomework] =
    useState<TransformedHomework | null>(null);
  const [showStudentAssignment, setShowStudentAssignment] = useState(false);
  const [selectedHomeworkForStudents, setSelectedHomeworkForStudents] =
    useState<HomeworkForAssignment | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [, setSubjectsLoading] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [, setClassesLoading] = useState(false);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [, setStudentsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [showClassStudents, setShowClassStudents] = useState(false);

  useEffect(() => {
    dispatch(fetchAllHomework() as Parameters<typeof dispatch>[0]);

    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      const response = await api.get("/dashboard/subjects");
      const subjectsData = response.data.data;

      if (subjectsData && subjectsData.subjectsByClass) {
        const uniqueSubjects = new Map<string, Subject>();

        (subjectsData.subjectsByClass as SubjectsByClassItem[]).forEach(
          classData => {
            if (classData.subjects) {
              classData.subjects.forEach(subject => {
                if (!uniqueSubjects.has(subject.subjectId)) {
                  uniqueSubjects.set(subject.subjectId, {
                    id: subject.subjectId,
                    subjectName: subject.subjectName,
                    subjectCode: subject.subjectCode,
                    passingMarks: subject.passingMarks,
                    maxMarks: subject.maxMarks,
                    status: "active",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                }
              });
            }
          },
        );
        setSubjects(Array.from(uniqueSubjects.values()));
      } else {
        setSubjects([]);
      }
      setSubjectsLoading(false);
    };

    const fetchClasses = async () => {
      setClassesLoading(true);
      const response = await getClassSummary();

      if (response.success && response.data) {
        const extractedClasses = (response.data as ApiClassItem[]).map(
          classItem => ({
            id: classItem.id,
            name: `${classItem.className} - ${classItem.section}`,
            className: classItem.className,
            section: classItem.section,
            studentCapacity: 0,
          }),
        );
        setClasses(extractedClasses);
      } else {
        setClasses([]);
      }
      setClassesLoading(false);
    };

    const fetchStudents = async () => {
      setStudentsLoading(true);
      const response = await api.get("/dashboard/students/classteacher");

      if (response.data && response.data.data) {
        const studentsData = response.data.data;
        const extractedStudents: StudentData[] = [];

        if (studentsData.classes && Array.isArray(studentsData.classes)) {
          (studentsData.classes as ApiClassData[]).forEach(classData => {
            if (classData.students && Array.isArray(classData.students)) {
              classData.students.forEach(student => {
                extractedStudents.push({
                  id: student.id,
                  name: `${student.firstName} ${student.lastName}`,
                  classId: classData.classId,
                  email: student.email,
                  phone: student.phone,
                  rollNo: student.rollNo,
                  admissionNo: student.admissionNo,
                  className: classData.className,
                  section: classData.section,
                });
              });
            }
          });
        }

        setStudents(extractedStudents);
      } else {
        setStudents([]);
      }
      setStudentsLoading(false);
    };

    fetchSubjects();
    fetchClasses();
    fetchStudents();
  }, [dispatch]);

  const handleDeleteHomework = async (homeworkId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this homework? This action cannot be undone.",
      )
    ) {
      const response = await homeworkApis.delete(homeworkId);
      if (response) {
        dispatch(fetchAllHomework() as Parameters<typeof dispatch>[0]);
      }
    }
  };

  const handleViewDetails = async (homeworkId: string) => {
    setSelectedHomework(homeworkId);
    setDetailLoading(true);

    const homeworkData = (
      homeworkList as unknown as HomeworkListResponse
    )?.homework?.find(hw => hw.id === homeworkId);

    if (homeworkData) {
      setSelectedHomeworkDetail(homeworkData);
    } else {
      const fallbackData = (
        homeworkList as unknown as HomeworkListResponse
      )?.data?.homework?.find(hw => hw.id === homeworkId);

      if (fallbackData) {
        setSelectedHomeworkDetail(fallbackData as unknown as HomeworkListItem);
        setSelectedHomework(fallbackData as unknown as HomeworkListItem);
      } else {
        setSelectedHomeworkDetail(null);
        setSelectedHomework(null);
      }
    }
    setDetailLoading(false);
  };

  const handleStudentAssignment = (homework: HomeworkForAssignment) => {
    setSelectedHomeworkForStudents(homework);
    setShowStudentAssignment(true);
    setHomeworkStudentsLoading(true);
    setHomeworkStudents([]);

    const homeworkData = (homeworkList as unknown as HomeworkListResponse)
      ?.homework;
    const currentHomework = homeworkData?.find(
      (hw: HomeworkListItem) => hw.id === homework.id,
    );
    const studentsFromAssignments: Student[] = [];

    if (currentHomework?.assignments) {
      currentHomework.assignments.forEach((assignment: HomeworkAssignment) => {
        if (assignment.class && assignment.class.classStudents) {
          assignment.class.classStudents.forEach(
            (classStudent: {
              student?: {
                id: string;
                user: { firstName: string; lastName: string; email: string };
                status: string;
              };
            }) => {
              if (
                classStudent.student &&
                classStudent.student.status === "active"
              ) {
                studentsFromAssignments.push({
                  id: classStudent.student.id,
                  name: `${classStudent.student.user.firstName} ${classStudent.student.user.lastName}`,
                  email: classStudent.student.user.email,
                  className: assignment.class?.className || "",
                  section: assignment.class?.section || "",
                  status: "pending",
                  submittedDate: undefined,
                  grade: undefined,
                  feedback: undefined,
                });
              }
            },
          );
        }

        if (assignment.student && assignment.student.user) {
          const student = assignment.student;
          studentsFromAssignments.push({
            id: student.id,
            name: `${student.user.firstName} ${student.user.lastName}`,
            email: student.user.email,
            className: "Individual Assignment",
            section: "",
            status: student.status === "submitted" ? "submitted" : "pending",
          });
        }
      });
    }

    setHomeworkStudents(studentsFromAssignments);
    setHomeworkStudentsLoading(false);
  };

  const handleClassClick = async (classId: string) => {
    const response = await api.get(`/dashboard/classes/${classId}/students`);

    if (response.data && response.data.students) {
      const classStudents = response.data.students.map(
        (student: {
          id: string;
          user: { firstName: string; lastName: string; email: string };
          admissionNo: string;
          className: string;
          section: string;
        }) => ({
          id: student.id,
          user: student.user,
          admissionNo: student.admissionNo,
          email: student.user.email,
          className: student.className,
          section: student.section,
        }),
      );

      setSelectedClass(
        classStudents.length > 0
          ? {
              id: classId,
              name: classStudents[0].className,
              className: classStudents[0].className,
              section: classStudents[0].section,
              studentCapacity: 0,
            }
          : null,
      );

      setShowClassStudents(true);
    } else {
      setSelectedClass(null);
    }
  };

  const handleEditHomework = async () => {
    setShowCreateForm(false);
    setEditingHomework(null);
  };

  const handleCreateHomework = async (data: CreateHomeworkData) => {
    const subject = subjects.find((s: Subject) => s.id === data.subject);
    if (!subject) return;

    let assignToClasses: Array<{ classId: string }> = [];
    let assignToStudents: Array<{ studentId: string }> = [];

    if (data.assignedTo === "singleClass" && data.selectedClass) {
      assignToClasses = [{ classId: data.selectedClass }];
    }
    if (data.selectedClasses && data.selectedClasses.length > 0) {
      assignToClasses = data.selectedClasses.map(classId => ({ classId }));
    }
    if (data.assignedTo === "allClasses") {
      assignToClasses = classes.map((cls: ClassItem) => ({ classId: cls.id }));
    }
    if (data.selectedStudents && data.selectedStudents.length > 0) {
      assignToStudents = data.selectedStudents.map(studentId => ({
        studentId,
      }));
    }

    const apiData = {
      title: data.title,
      subject: subject.id,
      assignedDate: new Date().toISOString(),
      dueDate: new Date(data.dueDate).toISOString(),
      description: data.description,
      assignToClasses,
      assignToStudents,
      allowLateSubmission: data.allowLateSubmission,
      maxFileSize: data.maxFileSize,
      attachments: (data.attachments || []).filter(
        (file): file is File => file instanceof File,
      ),
    };

    const result = await dispatch(
      createNewHomework(apiData) as Parameters<typeof dispatch>[0],
    );

    if (createNewHomework.rejected.match(result)) {
      throw new Error(
        (result.payload as string) || "Failed to create homework",
      );
    }

    setShowCreateForm(false);
    dispatch(fetchAllHomework() as Parameters<typeof dispatch>[0]);
  };

  const transformedHomeworkList: TransformedHomework[] =
    (homeworkList as unknown as HomeworkListResponse)?.homework?.map(hw => ({
      id: hw.id,
      title: hw.title,
      subject:
        typeof hw.subject === "string"
          ? hw.subject
          : ((hw.subject as { subjectName: string })?.subjectName ?? "Subject"),
      class: "Class",
      teacher: "Teacher",
      dueDate: new Date(hw.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      submitted: hw.submittedCount ?? 0,
      total: hw.totalAssignedTo ?? 0,
      status: "active" as const,
      description: hw.description ?? "",
    })) || [];

  const allSubmissions: Submission[] = [];
  void allSubmissions;

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
            onClick={() =>
              dispatch(fetchAllHomework() as Parameters<typeof dispatch>[0])
            }
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
    <div className="font-[var(--font-sans)] min-h-screen relative">
      {(selectedHomework || showStudentAssignment || showCreateForm) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 pointer-events-none" />
      )}

      <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl mb-[18px] shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden animate-fadeUp">
        <div
          className="h-1.5"
          style={{ background: `linear-gradient(90deg, #3d6cf4, #6c47f5)` }}
        />
        <div className="px-4 sm:px-7 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-[#9aa5c4] uppercase tracking-[0.5px] mb-1.5 font-[var(--font-sans)]">
                Academic Management
              </div>
              <div className="text-xl sm:text-2xl font-extrabold tracking-[-0.5px] text-[#111827] font-[var(--font-sans)] leading-[1.2]">
                Homework Management
              </div>
              <div className="text-[12px] sm:text-[13.5px] text-[#5c6a8a] mt-1 font-[var(--font-sans)]">
                Track assignments and manage student submissions
              </div>
            </div>
            {isTeacher && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full sm:w-auto px-[22px] py-2.5 rounded-[11px] border-none bg-[#3d6cf4] text-[13.5px] font-semibold text-white cursor-pointer font-[var(--font-sans)] shadow-[0_4px_14px_rgba(61,108,244,0.3)] transition-all duration-180 flex items-center justify-center gap-1.5"
                >
                  Create Homework
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
              isModalOpen={
                !!(selectedHomework || showStudentAssignment || showCreateForm)
              }
              onViewDetails={() => handleViewDetails(hw.id)}
              onEdit={() => {
                setEditingHomework(hw);
                setShowCreateForm(true);
              }}
              onDelete={() => handleDeleteHomework(hw.id)}
              onStudentAssignment={() => handleStudentAssignment(hw)}
              onClassClick={handleClassClick}
            />
          </div>
        ))}
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
              onClassClick={handleClassClick}
            />
          )}
        </>
      )}

      {showStudentAssignment && selectedHomeworkForStudents && (
        <StudentListModal
          isOpen={showStudentAssignment}
          onClose={() => setShowStudentAssignment(false)}
          homeworkTitle={selectedHomeworkForStudents?.title || "Homework"}
          students={homeworkStudents}
        />
      )}

      {showClassStudents && selectedClass && (
        <ClassStudentsModal
          isOpen={showClassStudents}
          onClose={() => setShowClassStudents(false)}
          classInfo={selectedClass}
        />
      )}

      {showCreateForm && (
        <>
          <CreateHomeworkForm
            onClose={() => {
              setShowCreateForm(false);
              setEditingHomework(null);
            }}
            onSubmit={
              editingHomework ? handleEditHomework : handleCreateHomework
            }
            subjects={subjects || []}
            classes={classes}
            students={students}
            loading={createLoading}
            error={createError}
            editingHomework={
              editingHomework as {
                title: string;
                description: string;
                instructions: string;
                subject: string;
                chapterId?: string;
                assignedTo:
                  | "singleClass"
                  | "singleStudent"
                  | "multipleStudents";
                selectedClass: string;
                selectedClasses: string[];
                selectedGroup: string;
                selectedStudents: string[];
                dueDate: string;
                maxFileSize: number;
                allowLateSubmission: boolean;
                attachments: (string | File)[];
              } | null
            }
          />
        </>
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

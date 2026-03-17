"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HomeworkCardClassic } from "@/components/homework/HomeworkCardClassic";
import {
  StudentListModal,
  HomeworkData,
} from "@/components/homework/StudentListModal";
import {
  StudentListModal,
  HomeworkData,
} from "@/components/homework/StudentListModal";
import { HomeworkDetailModal } from "@/components/homework/HomeworkDetailModal";
import { ClassStudentsModal } from "@/components/homework/ClassStudentsModal";
import { CreateHomeworkForm } from "@/components/homework/CreateHomeworkForm";
import { fetchAllHomework, createNewHomework } from "@/lib/store/HomeworkSlice";
import { homeworkApis } from "@/lib/api/Homework";
import { RootState } from "@/lib/store/Index";
import { Subject } from "@/lib/types/SubjectTypes";
import { subjectApis } from "@/lib/api/Subject";
import api from "@/lib/Axios";
import { BookOpen } from "lucide-react";
import { getClassSummary } from "@/lib/api/Classes";
import PageHeader from "@/components/layout/PageHeader";

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
  subjectId: string;
  dueDate: string;
  description?: string;
  chapterId?: string;
  assignedTo?: "singleClass" | "singleStudent" | "multipleStudents";
  selectedClass?: string;
  selectedClasses?: string[];
  selectedGroup?: string;
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
  chapterId?: string;
  chapterName?: string;
  chapterNo?: number;
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
  const [homeworkStudents, _setHomeworkStudents] = useState<Student[]>([]);
  const [, setHomeworkStudentsLoading] = useState(false);
  const [_isTeacher] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHomework, setEditingHomework] =
    useState<TransformedHomework | null>(null);
  const [showStudentAssignment, setShowStudentAssignment] = useState(false);
  const [selectedHomeworkForStudents, setSelectedHomeworkForStudents] =
    useState<HomeworkData | null>(null);
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
      try {
        const subjectsData = await subjectApis.getAll();
        let subjectsArray: Subject[] = [];
        if (Array.isArray(subjectsData)) {
          subjectsArray = subjectsData;
        } else if (
          subjectsData &&
          typeof subjectsData === "object" &&
          "data" in subjectsData &&
          Array.isArray((subjectsData as { data: Subject[] }).data)
        ) {
          subjectsArray = (subjectsData as { data: Subject[] }).data;
        } else if (
          subjectsData &&
          typeof subjectsData === "object" &&
          "subjects" in subjectsData &&
          Array.isArray((subjectsData as { subjects: Subject[] }).subjects)
        ) {
          subjectsArray = (subjectsData as { subjects: Subject[] }).subjects;
        }

        setSubjects(subjectsArray);
      } catch {
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
          (studentsData.classes as ApiClassData[]).forEach(
            (classData: ApiClassData) => {
              if (classData.students && Array.isArray(classData.students)) {
                classData.students.forEach((student: ApiStudentItem) => {
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
            },
          );
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
        dispatch(
          fetchAllHomework() as unknown as Parameters<typeof dispatch>[0],
        );
      }
    }
  };

  const handleViewDetails = async (homeworkId: string) => {
    setSelectedHomework(homeworkId);
    setDetailLoading(true);

    if (homeworkList && homeworkList.homework) {
      const homeworkData = homeworkList.homework.find(
        (hw: HomeworkListItem) => hw.id === homeworkId,
      );

      if (homeworkData) {
        setSelectedHomeworkDetail(homeworkData);
      } else {
        const fallbackData = homeworkList.homework?.find(
          (hw: HomeworkListItem) => hw.id === homeworkId,
        );

        if (fallbackData) {
          setSelectedHomeworkDetail(fallbackData);
          setSelectedHomework(fallbackData);
        } else {
          setSelectedHomeworkDetail(null);
          setSelectedHomework(null);
        }
      }
    }
    setDetailLoading(false);
  };

  const handleStudentAssignment = (homework: HomeworkListItem) => {
    setShowStudentAssignment(true);
    setHomeworkStudentsLoading(true);
    _setHomeworkStudents([]);

    const homeworkData = (homeworkList as unknown as HomeworkListResponse)
      ?.homework;
    const currentHomework = homeworkData?.find(
      (hw: { id: string }) => hw.id === homework.id,
    );

    if (currentHomework) {
      setSelectedHomeworkForStudents(
        currentHomework as unknown as HomeworkData,
      );
    }

    const studentsFromAssignments: Student[] = [];

    if (
      currentHomework &&
      "assignments" in currentHomework &&
      Array.isArray(currentHomework.assignments)
    ) {
      (currentHomework.assignments as HomeworkAssignment[]).forEach(
        (assignment: HomeworkAssignment) => {
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
        },
      );
    }

    _setHomeworkStudents(studentsFromAssignments);
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

  const handleEditHomework = async (data: CreateHomeworkData) => {
    if (!editingHomework?.id) {
      throw new Error("Homework ID is required for editing");
    }

    try {
      const apiData = {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate).toISOString(),
      };

      const newAttachments = (data.attachments || []).filter(
        (file): file is File => file instanceof File,
      );

      if (newAttachments.length > 0) {
        const formData = new FormData();
        formData.append("title", apiData.title);
        if (apiData.description) {
          formData.append("description", apiData.description);
        }
        formData.append("dueDate", apiData.dueDate);

        newAttachments.forEach((file: File) => {
          formData.append("attachments", file);
        });

        await api.patch(`/homework/${editingHomework.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await homeworkApis.update(editingHomework.id, apiData);
      }

      setShowCreateForm(false);
      setEditingHomework(null);
      dispatch(fetchAllHomework() as unknown as Parameters<typeof dispatch>[0]);
    } catch (_error) {
      throw new Error(
        _error instanceof Error ? _error.message : "Failed to update homework",
      );
    }
  };

  const handleCreateHomework = async (data: CreateHomeworkData) => {
    const subject = subjects.find((s: Subject) => s.id === data.subjectId);
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
      subjectId: subject.id,
      assignedDate: new Date().toISOString(),
      dueDate: new Date(data.dueDate).toISOString(),
      description: data.description,
      chapterId: data.chapterId || null,
      assignToClasses,
      assignToStudents,
      allowLateSubmission: data.allowLateSubmission,
      maxFileSize: data.maxFileSize,
      attachments: (data.attachments || []).filter(
        (file): file is File => file instanceof File,
      ),
    };

    const result = await dispatch(
      createNewHomework(apiData) as unknown as Parameters<typeof dispatch>[0],
    );

    if (createNewHomework.rejected.match(result)) {
      throw new Error(
        (result.payload as string) || "Failed to create homework",
      );
    }

    setShowCreateForm(false);
    dispatch(fetchAllHomework() as unknown as Parameters<typeof dispatch>[0]);
  };

  interface HomeworkItem {
    id: string;
    title: string;
    subject?: string | { subjectName: string };
    dueDate: string;
    submittedCount?: number;
    totalAssignedTo?: number;
    description?: string;
    chapterId?: string;
    chapterName?: string;
    chapterNo?: number;
    chapter?: {
      id: string;
      chapterName: string;
      chapterNo: number;
    };
  }

  const transformedHomeworkList: TransformedHomework[] =
    (homeworkList as unknown as HomeworkListResponse)?.homework?.map(
      (hw: HomeworkItem) => ({
        id: hw.id,
        title: hw.title,
        subject:
          typeof hw.subject === "object" &&
          hw.subject !== null &&
          "subjectName" in hw.subject
            ? hw.subject.subjectName
            : (hw.subject as string) || "Subject",
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
        chapterId: hw.chapterId || hw.chapter?.id,
        chapterName: hw.chapterName || hw.chapter?.chapterName,
        chapterNo: hw.chapterNo || hw.chapter?.chapterNo,
      }),
    ) || [];

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
              dispatch(
                fetchAllHomework() as unknown as Parameters<typeof dispatch>[0],
              )
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
    <div>
      <PageHeader
        title="Homework Management"
        description="Track assignments and manage student submissions"
        icon={BookOpen}
        iconBgColor="--blue-light"
        iconColor="--blue"
        buttonText="Create Homework"
        onButtonClick={() => setShowCreateForm(true)}
      />

      <div
        className="grid mt-5 grid-cols-1 md:grid-cols-2 gap-[24px] animate-fadeUp"
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
              chapterNo={hw.chapterNo}
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
          homeworkId={selectedHomeworkForStudents?.id}
          homeworkData={selectedHomeworkForStudents}
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
            loading={createLoading}
            error={createError}
            editingHomework={null}
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

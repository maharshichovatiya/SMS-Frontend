import React, { useState, useEffect } from "react";
import { Book, Trash2, User } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { SubjectWithClassSubjects } from "@/lib/api/Subject";
import { ChangeTeacherModal } from "./ChangeTeacherModal";
import { GetTeachers } from "@/lib/types/Teacher";

type ClassSubjectType = NonNullable<
  SubjectWithClassSubjects["classSubjects"]
>[0];

interface SubjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: SubjectWithClassSubjects | null;
  activeTab: "classes" | "chapters";
  setActiveTab: (tab: "classes" | "chapters") => void;
  onDeleteClass: (classId: string) => void;
  onDeleteChapter: (chapterId: string, chapterName: string) => void;
  onChangeTeacher?: (classSubjectId: string, teacherId: string) => void;
  onRefreshSubject?: () => void;
}

export function SubjectDetailsModal({
  isOpen,
  onClose,
  subject,
  activeTab,
  setActiveTab,
  onDeleteClass,
  onDeleteChapter,
  onChangeTeacher,
  onRefreshSubject,
}: SubjectDetailsModalProps) {
  const [changeTeacherModal, setChangeTeacherModal] = useState(false);
  const [selectedClassSubject, setSelectedClassSubject] =
    useState<ClassSubjectType | null>(null);

  const [localSubject, setLocalSubject] =
    useState<SubjectWithClassSubjects | null>(null);

  // Update local subject when prop changes
  useEffect(() => {
    setLocalSubject(subject);
  }, [subject]);

  const openChangeTeacherModal = (cls: ClassSubjectType) => {
    setSelectedClassSubject(cls);
    setChangeTeacherModal(true);
  };

  const handleTeacherSuccess = async (
    selectedTeacher: string,
    newTeacherData: GetTeachers | null,
  ) => {
    // Update local subject immediately to show new teacher
    if (localSubject && selectedClassSubject) {
      const updatedClassSubjects = localSubject.classSubjects?.map(cls => {
        if (cls.id === selectedClassSubject.id) {
          return {
            ...cls,
            teacher: newTeacherData
              ? {
                  id: newTeacherData.id,
                  status: newTeacherData.status || "active",
                  userId: newTeacherData.user.id,
                  employeeCode: newTeacherData.employeeCode,
                  staffCategory: newTeacherData.staffCategory,
                  department: newTeacherData.department,
                  designation: newTeacherData.designation,
                  highestQualification: newTeacherData.highestQualification,
                  specialization: newTeacherData.specialization || undefined,
                  totalExpMonths: newTeacherData.totalExpMonths || undefined,
                  salaryPackage: newTeacherData.salaryPackage || undefined,
                  dateOfJoining: newTeacherData.dateOfJoining,
                  createdAt: newTeacherData.createdAt,
                  updatedAt: newTeacherData.updatedAt,
                  user: newTeacherData.user,
                }
              : undefined,
          };
        }
        return cls;
      });

      setLocalSubject({
        ...localSubject,
        classSubjects: updatedClassSubjects,
      });
    }

    // Refresh subject data from server to ensure consistency
    if (onRefreshSubject) {
      await onRefreshSubject();
    }

    // Optionally call onChangeTeacher if provided for parent component updates
    if (onChangeTeacher && selectedClassSubject) {
      await onChangeTeacher(selectedClassSubject.id, selectedTeacher);
    }

    setChangeTeacherModal(false);
    setSelectedClassSubject(null);
  };

  if (!localSubject) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={localSubject.subjectName || "Subject Details"}
        description={`Curriculum details for ${localSubject.subjectName}`}
      >
        <div className="w-[900px] max-h-[80vh] overflow-y-auto pr-1">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center bg-blue-light text-blue">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text)]">
                  {localSubject.subjectName}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[var(--text-3)] text-sm">
                    {localSubject.classSubjects?.length || 0} class
                    {(localSubject.classSubjects?.length || 0) !== 1
                      ? "es"
                      : ""}{" "}
                    assigned
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-[var(--border)] mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("classes")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "classes"
                      ? "border-[var(--blue)] text-[var(--blue)]"
                      : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
                  }`}
                >
                  Classes ({localSubject.classSubjects?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("chapters")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "chapters"
                      ? "border-[var(--blue)] text-[var(--blue)]"
                      : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
                  }`}
                >
                  All Chapters (
                  {localSubject.chapters?.filter(
                    chapter => chapter.status !== "deleted",
                  ).length || 0}
                  )
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "classes" ? (
                !localSubject.classSubjects ||
                localSubject.classSubjects.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-[var(--surface-3)] flex items-center justify-center mx-auto mb-3">
                      <Book className="w-6 h-6 text-[var(--text-3)]" />
                    </div>
                    <p className="text-[var(--text-2)]">
                      No classes assigned to this subject yet
                    </p>
                  </div>
                ) : (
                  <div>
                    {localSubject.classSubjects?.map(cls => (
                      <div
                        key={cls.id}
                        className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl overflow-hidden mb-4"
                      >
                        <div className="bg-[var(--surface-3)] px-5 py-3 border-b border-[var(--border)]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div>
                                <h3 className="font-semibold text-[var(--text)]">
                                  Class {cls.class.className}-
                                  {cls.class.section}
                                </h3>
                                {cls.teacher && (
                                  <p className="text-sm text-[var(--text-2)] mt-1">
                                    Teacher:{" "}
                                    {cls.teacher.user?.firstName &&
                                    cls.teacher.user?.lastName
                                      ? `${cls.teacher.user.firstName} ${cls.teacher.user.lastName}`
                                      : cls.teacher.employeeCode || "N/A"}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openChangeTeacherModal(cls)}
                                className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--blue-light)] text-[var(--blue)] cursor-pointer flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--blue-light)] hover:bg-[var(--blue)] hover:text-[var(--text-inverse)]"
                                title="Change Teacher"
                              >
                                <User size={14} strokeWidth={1.8} />
                              </button>
                              <button
                                onClick={() => onDeleteClass(cls.id)}
                                className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--rose-light)] text-[var(--rose)] cursor-pointer flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--rose-light)] hover:bg-[var(--rose)] hover:text-[var(--text-inverse)]"
                                title="Remove Class Assignment"
                              >
                                <Trash2 size={14} strokeWidth={1.8} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* Chapters Tab */
                <div>
                  {localSubject.chapters && localSubject.chapters.length > 0 ? (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider">
                        All Chapters
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {localSubject.chapters
                          .filter(chapter => chapter.status !== "deleted")
                          .sort((a, b) => a.chapterNo - b.chapterNo)
                          .map((chapter, index) => (
                            <div
                              key={chapter.id || index}
                              className="bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-4"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-[var(--text)] mb-1">
                                    {chapter.chapterName}
                                  </h4>
                                  <p className="text-xs text-[var(--blue)]">
                                    Chapter {chapter.chapterNo}
                                  </p>
                                </div>
                                {chapter.id && (
                                  <button
                                    onClick={() =>
                                      chapter.id &&
                                      onDeleteChapter(
                                        chapter.id,
                                        chapter.chapterName,
                                      )
                                    }
                                    className="w-6 h-6 rounded-[var(--radius-sm)] cursor-pointer bg-[var(--rose-light)] text-[var(--rose)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--rose-light)] hover:bg-[var(--rose)] hover:text-[var(--text-inverse)]"
                                    title="Delete Chapter"
                                  >
                                    <Trash2 size={12} strokeWidth={1.8} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-[var(--surface-3)] flex items-center justify-center mx-auto mb-3">
                        <Book className="w-6 h-6 text-[var(--text-3)]" />
                      </div>
                      <p className="text-[var(--text-2)]">No chapters found</p>
                      <p className="text-sm text-[var(--text-3)] mt-2">
                        Add chapters to see them here
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <ChangeTeacherModal
        isOpen={changeTeacherModal}
        onClose={() => setChangeTeacherModal(false)}
        selectedClassSubject={selectedClassSubject}
        onSuccess={handleTeacherSuccess}
      />
    </>
  );
}

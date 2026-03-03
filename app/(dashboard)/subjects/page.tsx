"use client";

import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { BookOpen, Plus, Book, Pencil, Trash2, Search } from "lucide-react";
import Modal from "@/components/ui/Modal";
import SubjectForm from "@/components/forms/SubjectForm";
import ClassChapterForm from "@/components/forms/ClassChapterForm";
import CreateChapterForm from "@/components/forms/CreateChapterForm";
import SubjectCardSkeleton from "@/components/skeletons/SubjectCardSkeleton";
import {
  subjectApis,
  SubjectWithClasses,
  Subject,
  AssignClassData,
  Chapter,
} from "@/lib/api/Subject";
import { classApis, Class } from "@/lib/api/Class";
import { getAllTeachers } from "@/lib/api/Teacher";
import { GetTeachers } from "@/lib/types/Teacher";
import { showToast } from "@/lib/utils/Toast";

export default function Subjects() {
  const [subjects, setSubjects] = useState<SubjectWithClasses[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Debounce search query (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [selectedSubject, setSelectedSubject] =
    useState<SubjectWithClasses | null>(null);
  const [editingSubject, setEditingSubject] =
    useState<SubjectWithClasses | null>(null);
  const [editingClassSubject, setEditingClassSubject] = useState<{
    subject: SubjectWithClasses;
    classInfo: SubjectWithClasses["classes"][0];
  } | null>(null);
  const [creatingChapters, setCreatingChapters] = useState<{
    subject: SubjectWithClasses;
    classInfo: SubjectWithClasses["classes"][0];
  } | null>(null);

  const handleChapterCreated = (newChapter: {
    chapterName: string;
    chapterNo: number;
  }) => {
    setCreatingChapters(prev => {
      if (!prev) return prev;

      // Update the classInfo to include the new chapter
      const updatedChapters = [...(prev.classInfo.chapters || []), newChapter];
      const updatedClassInfo = {
        ...prev.classInfo,
        chapters: updatedChapters,
      };

      return {
        ...prev,
        classInfo: updatedClassInfo,
      };
    });
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingSubject, setDeletingSubject] =
    useState<SubjectWithClasses | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [allTeachers, setAllTeachers] = useState<GetTeachers[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await subjectApis.getAllForPage(debouncedSearch);
      setSubjects(data);
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const fetchAssignmentData = async () => {
    try {
      setModalLoading(true);
      const [subjectsData, classesData, teachersData] = await Promise.all([
        subjectApis.getAll(),
        classApis.getAll(),
        getAllTeachers(),
      ]);
      setAllSubjects(subjectsData);
      setAllClasses(classesData);
      if (teachersData.success && teachersData.data) {
        setAllTeachers(teachersData.data);
      }
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAssignModalOpen = () => {
    setIsAssignModalOpen(true);
    fetchAssignmentData();
  };

  const handleAssign = async () => {
    try {
      const payload: AssignClassData = {
        subjectId: selectedSubjectId,
        classId: selectedClassId,
        teacherId: selectedTeacherId,
      };
      await subjectApis.assignClassToSubject(payload);
      showToast.success("Assigned subject to class successfully!");
      setIsAssignModalOpen(false);
      setSelectedSubjectId("");
      setSelectedClassId("");
      setSelectedTeacherId("");
      fetchSubjects();
    } catch (error) {
      showToast.apiError(error);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await subjectApis.delete(deletingId);
      showToast.success("Assignment removed successfully!");

      // Update the selectedSubject to remove the deleted class
      if (selectedSubject) {
        const updatedSubject = {
          ...selectedSubject,
          classes: selectedSubject.classes.filter(
            cls => cls.classSubjectId !== deletingId,
          ),
        };
        setSelectedSubject(updatedSubject);
      }

      setDeletingId(null);
      fetchSubjects();
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSubject = async () => {
    if (!deletingSubject) return;
    try {
      setIsDeleting(true);
      await subjectApis.delete(deletingSubject.id);
      showToast.success("Subject deleted successfully!");
      setDeletingSubject(null);
      fetchSubjects();
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="animate-fade-up">
      <PageHeader
        title="Subjects"
        description={`${subjects.length} subjects across all grades with detailed curriculum`}
        icon={BookOpen}
        iconBgColor="--amber-light"
        iconColor="--amber"
        buttonText="Add Subject"
        onButtonClick={() => setEditingSubject({} as SubjectWithClasses)}
        buttonIcon={Plus}
        secondaryButton={{
          text: "Assign Class",
          onClick: handleAssignModalOpen,
        }}
      />

      {/* Search Bar */}
      <div className="flex justify-end mt-6 px-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--text-3)" }}
          />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-full bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-muted)] focus:border-[var(--border-focus)] w-64 transition-all duration-[var(--duration)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <SubjectCardSkeleton key={i} />
          ))
        ) : subjects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-[var(--text-3)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
              {debouncedSearch ? "No Subjects Found" : "No Subjects Available"}
            </h3>
            <p className="text-sm text-[var(--text-2)] mb-4">
              {debouncedSearch
                ? `No subjects match "${debouncedSearch}". Try a different search term.`
                : "Subject management is currently under development."}
            </p>
            <p className="text-xs text-[var(--text-3)]">
              {debouncedSearch
                ? "Clear the search to see all subjects."
                : 'Click "Add Subject" to create your first subject when the feature is available.'}
            </p>
          </div>
        ) : (
          subjects.map((subject, idx) => (
            <div
              key={subject.id}
              className="bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-sm)] animate-fade-up hover:border-[var(--border-focus)] transition-all duration-[var(--duration)] flex flex-col"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="flex-1">
                <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-4 bg-blue-light text-blue">
                  <Book className="w-6 h-6" />
                </div>

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-[17px] font-bold text-[var(--text)] mb-1">
                      {subject.subjectName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-[var(--text-3)]">
                        {subject.classes.length} class
                        {subject.classes.length !== 1 ? "es" : ""} assigned
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-1">
                  {subject.classes.slice(0, 2).map(cls => (
                    <div
                      key={cls.classSubjectId}
                      className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-[var(--text)]">
                          Class {cls.classInfo.classNo}-{cls.classInfo.section}
                        </span>
                        {cls.teacher && (
                          <span className="text-[11px] font-medium text-[var(--blue)] px-2 py-0.5 bg-[var(--blue-light)] rounded-full">
                            {cls.teacher.firstName} {cls.teacher.lastName}
                          </span>
                        )}
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setDeletingId(cls.classSubjectId);
                          }}
                          className="w-6 h-6 rounded-[var(--radius-sm)] cursor-pointer bg-[var(--rose-light)] text-[var(--rose)] hover:bg-[var(--rose)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)]"
                          title="Remove Assignment"
                        >
                          <Trash2 size={12} strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {subject.classes.length > 2 && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedSubject(subject);
                      }}
                      className="w-full text-center text-xs text-[var(--blue)] hover:text-[var(--blue-dark)] font-medium py-2 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)] hover:bg-[var(--surface-3)] transition-colors"
                    >
                      +{subject.classes.length - 2} more classes
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <button
                  onClick={() => setSelectedSubject(subject)}
                  className="text-[var(--blue)] text-sm font-medium hover:text-[var(--blue-dark)] transition-colors cursor-pointer"
                >
                  View Details →
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setEditingSubject(subject);
                  }}
                  className="w-8 h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--blue-light)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--blue-light)]"
                  title="Edit Subject"
                >
                  <Pencil size={14} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={!!selectedSubject}
        onClose={() => setSelectedSubject(null)}
        title={selectedSubject?.subjectName || "Subject Details"}
        description={`Curriculum details for ${selectedSubject?.subjectName}`}
      >
        {selectedSubject && (
          <div className="w-[900px] max-h-[80vh] overflow-y-auto pr-1">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center bg-blue-light text-blue">
                  <Book className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text)]">
                    {selectedSubject.subjectName}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[var(--text-3)] text-sm">
                      {selectedSubject.classes.length} class
                      {selectedSubject.classes.length !== 1 ? "es" : ""}{" "}
                      assigned
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {selectedSubject.classes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-[var(--surface-3)] flex items-center justify-center mx-auto mb-3">
                      <Book className="w-6 h-6 text-[var(--text-3)]" />
                    </div>
                    <p className="text-[var(--text-2)]">
                      No classes assigned to this subject yet
                    </p>
                  </div>
                ) : (
                  selectedSubject.classes.map(cls => (
                    <div
                      key={cls.classSubjectId}
                      className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl overflow-hidden"
                    >
                      <div className="bg-[var(--surface-3)] px-5 py-3 border-b border-[var(--border)]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-light text-blue flex items-center justify-center text-sm font-bold">
                              {cls.classInfo.classNo}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[var(--text)]">
                                Class {cls.classInfo.classNo}-
                                {cls.classInfo.section}
                              </h3>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-[var(--text-3)]">
                                  {cls.chapters.length} chapter
                                  {cls.chapters.length !== 1 ? "s" : ""}
                                </p>
                                {cls.teacher && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-[var(--border)]"></span>
                                    <p className="text-xs font-medium text-[var(--blue)]">
                                      Teacher: {cls.teacher.firstName}{" "}
                                      {cls.teacher.lastName}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setEditingClassSubject({
                                  subject: selectedSubject!,
                                  classInfo: cls,
                                })
                              }
                              className="w-8 h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--blue-light)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--blue-light)]"
                              title="Edit Chapters"
                            >
                              <Pencil size={14} strokeWidth={1.8} />
                            </button>
                            <button
                              onClick={() =>
                                setCreatingChapters({
                                  subject: selectedSubject!,
                                  classInfo: cls,
                                })
                              }
                              className="w-8 h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--green-light)] text-[var(--green)] hover:bg-[var(--green)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--green-light)]"
                              title="Create Chapters"
                            >
                              <Plus size={14} strokeWidth={1.8} />
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setDeletingId(cls.classSubjectId);
                              }}
                              className="w-8 h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--rose-light)] text-[var(--rose)] hover:bg-[var(--rose)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--rose-light)]"
                              title="Remove Class Assignment"
                            >
                              <Trash2 size={14} strokeWidth={1.8} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        {cls.chapters.length > 0 ? (
                          <div className="space-y-3">
                            <p className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider mb-3">
                              Curriculum Chapters
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {cls.chapters.map(
                                (chapter: Chapter, i: number) => (
                                  <div
                                    key={chapter.id || i}
                                    className="flex items-center gap-3 p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)] hover:border-[var(--border-focus)] transition-colors"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-blue-light text-blue flex items-center justify-center text-sm font-bold flex-shrink-0">
                                      {chapter.chapterNo}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-[var(--text)]">
                                        {chapter.chapterName}
                                      </p>
                                      <p className="text-xs text-[var(--text-3)]">
                                        Chapter {chapter.chapterNo}
                                      </p>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] flex items-center justify-center mx-auto mb-2">
                              <Book className="w-5 h-5 text-[var(--text-3)]" />
                            </div>
                            <p className="text-sm text-[var(--text-2)]">
                              No chapters added yet
                            </p>
                            <p className="text-xs text-[var(--text-3)] mt-1">
                              Add chapters to this class for the subject
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!editingSubject}
        onClose={() => setEditingSubject(null)}
        title={editingSubject?.id ? "Edit Subject" : "Add Subject"}
        description={
          editingSubject?.id
            ? "Update the subject information below."
            : "Fill in the details below to create a new subject."
        }
      >
        <div className="w-[560px]">
          <SubjectForm
            initialData={editingSubject?.id ? editingSubject : undefined}
            onClose={() => setEditingSubject(null)}
            onSubmitSuccess={() => {
              setEditingSubject(null);
              fetchSubjects();
            }}
          />
        </div>
      </Modal>

      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Remove Assignment"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeletingId(null)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-5 py-2 text-sm font-semibold text-[var(--text-inverse)] bg-[var(--rose)] rounded-[var(--radius-sm)] hover:bg-[var(--rose-dark)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </>
        }
      >
        <div className="w-[380px] flex flex-col items-center text-center py-2">
          <p className="text-sm text-[var(--text-3)]">
            Are you sure you want to remove this{" "}
            <span className="font-semibold text-[var(--text)]">
              subject assignment
            </span>
            ? This action cannot be undone.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Class to Subject"
        description="Select a subject and class to assign them together."
      >
        <div className="w-[600px]">
          {modalLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-[var(--text-3)] ml-2">
                Loading data...
              </span>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                  Select Subject
                  <span className="text-[var(--rose)] ml-0.5">*</span>
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={e => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                >
                  <option value="">Choose a subject...</option>
                  {allSubjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                  Select Class
                  <span className="text-[var(--rose)] ml-0.5">*</span>
                </label>
                <select
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                >
                  <option value="">Choose a class...</option>
                  {allClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.classNo}-{cls.section}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                  Select Teacher
                  <span className="text-[var(--rose)] ml-0.5">*</span>
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={e => setSelectedTeacherId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                >
                  <option value="">Choose a teacher...</option>
                  {allTeachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.user.firstName} {teacher.user.lastName} (
                      {teacher.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="cursor-pointer px-5 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] transition-colors duration-[var(--duration)] h-10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssign}
                  disabled={
                    !selectedSubjectId || !selectedClassId || !selectedTeacherId
                  }
                  className="btn-primary cursor-pointer px-5 py-2 text-sm rounded-[var(--radius-sm)] h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Class Chapter Editing Modal */}
      <Modal
        isOpen={!!editingClassSubject}
        onClose={() => setEditingClassSubject(null)}
        title={`Edit Chapters - Class ${editingClassSubject?.classInfo.classInfo.classNo}-${editingClassSubject?.classInfo.classInfo.section}`}
        description={`Manage chapters for ${editingClassSubject?.subject.subjectName} in this class`}
      >
        {editingClassSubject && (
          <div className="w-[600px]">
            <ClassChapterForm
              subject={editingClassSubject.subject}
              classInfo={editingClassSubject.classInfo}
              onClose={() => setEditingClassSubject(null)}
              onSubmitSuccess={async () => {
                await fetchSubjects();
                setEditingClassSubject(null);
                // Update the selectedSubject with the latest data to show updated chapters
                const updatedSubjects = await subjectApis.getAllForPage();
                const updatedSubject = updatedSubjects.find(
                  s => s.id === selectedSubject?.id,
                );
                if (updatedSubject) {
                  setSelectedSubject(updatedSubject);
                }
              }}
            />
          </div>
        )}
      </Modal>

      {/* Subject Delete Modal */}
      <Modal
        isOpen={!!deletingSubject}
        onClose={() => setDeletingSubject(null)}
        title="Delete Subject"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeletingSubject(null)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteSubject}
              disabled={isDeleting}
              className="px-5 py-2 text-sm font-semibold text-[var(--text-inverse)] bg-[var(--rose)] rounded-[var(--radius-sm)] hover:bg-[var(--rose-dark)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </>
        }
      >
        <div className="w-[380px] flex flex-col items-center text-center py-2">
          <p className="text-sm text-[var(--text-3)]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[var(--text)]">
              {deletingSubject?.subjectName}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* Create Chapters Modal */}
      <Modal
        isOpen={!!creatingChapters}
        onClose={() => setCreatingChapters(null)}
        title="Create Chapters"
        description={`Add new chapters to ${creatingChapters?.subject.subjectName}`}
      >
        {creatingChapters && (
          <CreateChapterForm
            key={creatingChapters.classInfo.chapters?.length}
            subject={creatingChapters.subject}
            classInfo={creatingChapters.classInfo}
            chaptersCount={creatingChapters.classInfo.chapters?.length}
            onClose={() => setCreatingChapters(null)}
            onSubmitSuccess={async () => {
              setCreatingChapters(null);
              await fetchSubjects();
              // Update the selectedSubject with the latest data to show updated chapters
              const updatedSubjects = await subjectApis.getAllForPage();
              const updatedSelectedSubject = updatedSubjects.find(
                s => s.id === selectedSubject?.id,
              );
              if (updatedSelectedSubject) {
                setSelectedSubject(updatedSelectedSubject);
              }
            }}
            onChapterCreated={handleChapterCreated}
          />
        )}
      </Modal>
    </section>
  );
}

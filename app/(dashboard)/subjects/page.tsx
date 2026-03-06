"use client";

import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import { BookOpen, Search, Plus } from "lucide-react";
import SubjectCardSkeleton from "@/components/skeletons/SubjectCardSkeleton";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { SubjectDetailsModal } from "@/components/subjects/Modals/SubjectDetailsModal";
import { AssignClassModal } from "@/components/subjects/Modals/AssignClassModal";
import { SubjectFormModal } from "@/components/subjects/Modals/SubjectFormModal";
import { DeleteAssignmentModal } from "@/components/subjects/Modals/DeleteAssignmentModal";
import { SubjectDeleteModal } from "@/components/subjects/Modals/SubjectDeleteModal";
import { CreateChaptersModal } from "@/components/subjects/Modals/CreateChaptersModal";
import { ChapterDeleteModal } from "@/components/subjects/Modals/ChapterDeleteModal";
import { useSubjects } from "@/lib/hooks/UseSubjects";
import { SubjectWithClasses } from "@/lib/api/Subject";

export default function Subjects() {
  const {
    subjects,
    loading,
    searchQuery,
    selectedSubject,
    editingSubject,
    creatingChapters,
    deletingId,
    isDeleting,
    deletingSubject,
    deletingChapter,
    isAssignModalOpen,
    allClasses,
    allTeachers,
    selectedSubjectId,
    selectedClassId,
    selectedTeacherId,
    modalLoading,
    activeTab,
    setSearchQuery,
    setSelectedSubject,
    setEditingSubject,
    setCreatingChapters,
    setDeletingId,
    setDeletingSubject,
    setDeletingChapter,
    setIsAssignModalOpen,
    setSelectedSubjectId,
    setSelectedClassId,
    setSelectedTeacherId,
    setActiveTab,
    handleAssignModalOpen,
    handleAssign,
    handleDelete,
    handleDeleteSubject,
    handleDeleteChapter,
    fetchSubjects,
  } = useSubjects();

  const handleAssignClass = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    handleAssignModalOpen();
  };

  const handleAddChapter = (subject: SubjectWithClasses) => {
    if (subject.classSubjects.length > 0) {
      setCreatingChapters({
        subject: subject,
        classInfo: subject.classSubjects[0],
      });
    }
  };

  const handleDeleteClass = (classId: string) => {
    setDeletingId(classId);
  };

  const handleDeleteChapterFromModal = (
    chapterId: string,
    chapterName: string,
  ) => {
    if (selectedSubject) {
      setDeletingChapter({
        subjectId: selectedSubject.id,
        chapterId,
        chapterName,
      });
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
      />

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 mt-6 px-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filters can be added here if needed in future */}
        </div>

        {/* Search Bar - Right side */}
        <div className="flex items-center gap-3">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              {searchQuery ? "No Subjects Found" : "No Subjects Available"}
            </h3>
            <p className="text-sm text-[var(--text-2)] mb-4">
              {searchQuery
                ? `No subjects match "${searchQuery}". Try a different search term.`
                : "Subject management is currently under development."}
            </p>
            <p className="text-xs text-[var(--text-3)]">
              {searchQuery
                ? "Clear the search to see all subjects."
                : 'Click "Add Subject" to create your first subject when the feature is available.'}
            </p>
          </div>
        ) : (
          subjects.map((subject, idx) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              index={idx}
              onViewDetails={setSelectedSubject}
              onAssignClass={handleAssignClass}
              onAddChapter={handleAddChapter}
              onEditSubject={setEditingSubject}
              onDeleteSubject={setDeletingSubject}
            />
          ))
        )}
      </div>

      {/* Subject Details Modal */}
      <SubjectDetailsModal
        isOpen={!!selectedSubject}
        onClose={() => setSelectedSubject(null)}
        subject={selectedSubject}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDeleteClass={handleDeleteClass}
        onDeleteChapter={handleDeleteChapterFromModal}
      />

      {/* Subject Form Modal */}
      <SubjectFormModal
        isOpen={!!editingSubject}
        onClose={() => setEditingSubject(null)}
        editingSubject={editingSubject}
        fetchSubjects={fetchSubjects}
      />

      {/* Delete Assignment Modal */}
      <DeleteAssignmentModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />

      {/* Assign Class Modal */}
      <AssignClassModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        modalLoading={modalLoading}
        allClasses={allClasses}
        allTeachers={allTeachers}
        selectedSubjectId={selectedSubjectId}
        selectedClassId={selectedClassId}
        selectedTeacherId={selectedTeacherId}
        setSelectedClassId={setSelectedClassId}
        setSelectedTeacherId={setSelectedTeacherId}
        onAssign={handleAssign}
        subjects={subjects}
      />

      {/* Subject Delete Modal */}
      <SubjectDeleteModal
        isOpen={!!deletingSubject}
        onClose={() => setDeletingSubject(null)}
        isDeleting={isDeleting}
        deletingSubject={deletingSubject}
        handleDeleteSubject={handleDeleteSubject}
      />

      {/* Create Chapters Modal */}
      <CreateChaptersModal
        isOpen={!!creatingChapters}
        onClose={() => setCreatingChapters(null)}
        creatingChapters={creatingChapters}
        fetchSubjects={fetchSubjects}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        subjects={subjects}
      />

      {/* Chapter Delete Modal */}
      <ChapterDeleteModal
        isOpen={!!deletingChapter}
        onClose={() => setDeletingChapter(null)}
        isDeleting={isDeleting}
        deletingChapter={deletingChapter}
        handleDeleteChapter={handleDeleteChapter}
      />
    </section>
  );
}

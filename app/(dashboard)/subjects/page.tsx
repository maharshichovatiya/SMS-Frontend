"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "@/components/layout/PageHeader";
import { BookOpen, Search, Plus } from "lucide-react";
import SubjectCardSkeleton from "@/components/skeletons/SubjectCardSkeleton";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { SubjectWithClassSubjects } from "@/lib/types/SubjectTypes";
import { SubjectDetailsModal } from "@/components/subjects/Modals/SubjectDetailsModal";
import { AssignClassModal } from "@/components/subjects/Modals/AssignClassModal";
import { SubjectFormModal } from "@/components/subjects/Modals/SubjectFormModal";
import { DeleteAssignmentModal } from "@/components/subjects/Modals/DeleteAssignmentModal";
import { SubjectDeleteModal } from "@/components/subjects/Modals/SubjectDeleteModal";
import { CreateChaptersModal } from "@/components/subjects/Modals/CreateChaptersModal";
import { ChapterDeleteModal } from "@/components/subjects/Modals/ChapterDeleteModal";
import SubjectFilters from "@/components/subjects/SubjectFilters";
import Pagination from "@/components/ui/Pagination";
import {
  fetchSubjects,
  assignClassToSubject,
  deleteClassAssignment,
  deleteSubject,
  deleteChapter,
  setSearchQuery,
  setDebouncedSearch,
  setMinPassingMarks,
  setMaxPassingMarks,
  setMinTotalMarks,
  setMaxTotalMarks,
  clearFilters,
  setCurrentPage,
  setPageSize,
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
} from "@/lib/store/SubjectsSlice";
import { fetchStudentFilterData } from "@/lib/store/StudentFiltersSlice";
import { fetchAssignTeachers } from "@/lib/store/TeacherSlice";
import { showToast } from "@/lib/utils/Toast";
import type { RootState, AppDispatch } from "@/lib/store/Index";

export default function Subjects() {
  const PAGE_SIZE_OPTIONS = [6, 9, 12];
  const dispatch = useDispatch<AppDispatch>();

  // Select subjects state
  const subjectsState = useSelector((state: RootState) => state.subjects);
  const {
    subjects,
    loading,
    searchQuery,
    debouncedSearch,
    minPassingMarks,
    maxPassingMarks,
    minTotalMarks,
    maxTotalMarks,
    selectedSubject,
    editingSubject,
    creatingChapters,
    deletingId,
    isDeleting,
    deletingSubject,
    deletingChapter,
    isAssignModalOpen,
    selectedSubjectId,
    selectedClassId,
    selectedTeacherId,
    modalLoading,
    activeTab,
    currentPage,
    pageSize,
    totalSubjects,
    totalPages,
  } = subjectsState;

  // Select classes and teachers state
  const studentFiltersState = useSelector(
    (state: RootState) => state.studentFilters,
  );
  const teacherState = useSelector((state: RootState) => state.teacher);
  const { data: studentFiltersData } = studentFiltersState;
  const { classes: allClasses } = studentFiltersData;
  const { assignTeachers: allTeachers } = teacherState;

  // Debounce search query effect
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setDebouncedSearch(searchQuery));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  // Fetch subjects when dependencies change
  useEffect(() => {
    dispatch(fetchSubjects());
  }, [
    dispatch,
    currentPage,
    pageSize,
    debouncedSearch,
    minPassingMarks,
    maxPassingMarks,
    minTotalMarks,
    maxTotalMarks,
  ]);

  // Reset to first page when search or filters change
  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [
    dispatch,
    debouncedSearch,
    minPassingMarks,
    maxPassingMarks,
    minTotalMarks,
    maxTotalMarks,
  ]);

  // Preload classes and teachers data on page mount
  useEffect(() => {
    // Load classes data if not already loaded
    if (!studentFiltersState.data.classes.length) {
      dispatch(fetchStudentFilterData());
    }
    // Load teachers data if not already loaded
    if (!teacherState.hasLoadedOnce) {
      dispatch(fetchAssignTeachers());
    }
  }, [
    dispatch,
    studentFiltersState.data.classes.length,
    teacherState.hasLoadedOnce,
  ]);

  const handleAssignClass = (subjectId: string) => {
    dispatch(setSelectedSubjectId(subjectId));
    dispatch(setIsAssignModalOpen(true));
  };

  const handleAddChapter = (subject: SubjectWithClassSubjects) => {
    dispatch(
      setCreatingChapters({
        subject: subject,
        classInfo: subject.classSubjects?.[0] || null,
      }),
    );
  };

  const handleDeleteClass = (classId: string) => {
    dispatch(setDeletingId(classId));
  };

  const handleDeleteChapterFromModal = (
    chapterId: string,
    chapterName: string,
  ) => {
    if (selectedSubject) {
      dispatch(
        setDeletingChapter({
          subjectId: selectedSubject.id,
          chapterId,
          chapterName,
        }),
      );
    }
  };

  const handleAssign = async () => {
    try {
      await dispatch(
        assignClassToSubject({
          subjectId: selectedSubjectId,
          classId: selectedClassId,
          teacherId: selectedTeacherId,
        }),
      ).unwrap();
      showToast.success("Assigned subject to class successfully!");
      dispatch(fetchSubjects());
    } catch (error) {
      showToast.apiError(error);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await dispatch(deleteClassAssignment(deletingId)).unwrap();
      showToast.success("Assignment removed successfully!");
      dispatch(fetchSubjects());
    } catch (error) {
      showToast.apiError(error);
    }
  };

  const handleDeleteSubject = async () => {
    if (!deletingSubject) return;
    try {
      await dispatch(deleteSubject(deletingSubject.id)).unwrap();
      showToast.success("Subject deleted successfully!");
      dispatch(fetchSubjects());
    } catch (error) {
      showToast.apiError(error);
    }
  };

  const handleDeleteChapter = async () => {
    if (!deletingChapter) return;
    try {
      await dispatch(
        deleteChapter({
          subjectId: deletingChapter.subjectId,
          chapterId: deletingChapter.chapterId,
        }),
      ).unwrap();
      showToast.success("Chapter deleted successfully!");
      dispatch(fetchSubjects());
    } catch (error) {
      showToast.apiError(error);
    }
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize));
  };

  return (
    <section className="animate-fade-up">
      <PageHeader
        title="Subjects"
        description={`${totalSubjects} subjects across all grades with detailed curriculum`}
        icon={BookOpen}
        iconBgColor="--amber-light"
        iconColor="--amber"
        buttonText="Add Subject"
        onButtonClick={() =>
          dispatch(setEditingSubject({} as SubjectWithClassSubjects))
        }
        buttonIcon={Plus}
      />

      {/* Search Bar and Filters */}
      <div className="flex items-center justify-between gap-4 mt-6 px-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filters can be added here if needed in future */}
        </div>

        {/* Search Bar and Filter Button - Right side */}
        <div className="flex items-center gap-3">
          <SubjectFilters
            filters={{
              minPassingMarks,
              maxPassingMarks,
              minTotalMarks,
              maxTotalMarks,
            }}
            onClearFilters={handleClearFilters}
            onApplyFilters={filters => {
              dispatch(setMinPassingMarks(filters.minPassingMarks || ""));
              dispatch(setMaxPassingMarks(filters.maxPassingMarks || ""));
              dispatch(setMinTotalMarks(filters.minTotalMarks || ""));
              dispatch(setMaxTotalMarks(filters.maxTotalMarks || ""));
            }}
          />

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={e => dispatch(setSearchQuery(e.target.value))}
              className="pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-full bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-muted)] focus:border-[var(--border-focus)] w-64 transition-all duration-[var(--duration)]"
            />
          </div>
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
              onViewDetails={subject => dispatch(setSelectedSubject(subject))}
              onAssignClass={handleAssignClass}
              onAddChapter={handleAddChapter}
              onEditSubject={subject => dispatch(setEditingSubject(subject))}
              onDeleteSubject={subject => dispatch(setDeletingSubject(subject))}
            />
          ))
        )}
      </div>
      {/* Pagination Controls */}
      {!loading && subjects.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalSubjects}
          itemsPerPage={PAGE_SIZE_OPTIONS}
          onPageChange={page => dispatch(setCurrentPage(page))}
          onPageSizeChange={handlePageSizeChange}
          itemName="subjects"
        />
      )}

      {/* Subject Details Modal */}
      <SubjectDetailsModal
        isOpen={!!selectedSubject}
        onClose={() => dispatch(setSelectedSubject(null))}
        subject={selectedSubject}
        activeTab={activeTab}
        setActiveTab={tab => dispatch(setActiveTab(tab))}
        onDeleteClass={handleDeleteClass}
        onDeleteChapter={handleDeleteChapterFromModal}
      />

      {/* Subject Form Modal */}
      <SubjectFormModal
        isOpen={!!editingSubject}
        onClose={() => dispatch(setEditingSubject(null))}
        editingSubject={editingSubject}
        fetchSubjects={async () => {
          await dispatch(fetchSubjects());
        }}
      />

      {/* Delete Assignment Modal */}
      <DeleteAssignmentModal
        isOpen={!!deletingId}
        onClose={() => dispatch(setDeletingId(null))}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />

      {/* Assign Class Modal */}
      <AssignClassModal
        isOpen={isAssignModalOpen}
        onClose={() => dispatch(setIsAssignModalOpen(false))}
        modalLoading={modalLoading}
        allClasses={allClasses}
        allTeachers={allTeachers}
        selectedSubjectId={selectedSubjectId}
        selectedClassId={selectedClassId}
        selectedTeacherId={selectedTeacherId}
        setSelectedClassId={id => dispatch(setSelectedClassId(id))}
        setSelectedTeacherId={id => dispatch(setSelectedTeacherId(id))}
        onAssign={handleAssign}
        subjects={subjects}
      />

      {/* Subject Delete Modal */}
      <SubjectDeleteModal
        isOpen={!!deletingSubject}
        onClose={() => dispatch(setDeletingSubject(null))}
        isDeleting={isDeleting}
        deletingSubject={deletingSubject}
        handleDeleteSubject={handleDeleteSubject}
      />

      {/* Create Chapters Modal */}
      <CreateChaptersModal
        isOpen={!!creatingChapters}
        onClose={() => dispatch(setCreatingChapters(null))}
        creatingChapters={creatingChapters}
        fetchSubjects={async () => {
          await dispatch(fetchSubjects());
        }}
        selectedSubject={selectedSubject}
        setSelectedSubject={subject => dispatch(setSelectedSubject(subject))}
        subjects={subjects}
      />

      {/* Chapter Delete Modal */}
      <ChapterDeleteModal
        isOpen={!!deletingChapter}
        onClose={() => dispatch(setDeletingChapter(null))}
        isDeleting={isDeleting}
        deletingChapter={deletingChapter}
        handleDeleteChapter={handleDeleteChapter}
      />
    </section>
  );
}

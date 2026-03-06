import { useState, useEffect, useCallback } from "react";
import {
  subjectApis,
  SubjectWithClassSubjects,
  AssignClassData,
} from "@/lib/api/Subject";
import { classApis, Class } from "@/lib/api/Class";
import { getAllTeachers } from "@/lib/api/Teacher";
import { GetTeachers } from "@/lib/types/Teacher";
import { showToast } from "@/lib/utils/Toast";

export interface UseSubjectsReturn {
  // State
  subjects: SubjectWithClassSubjects[];
  loading: boolean;
  searchQuery: string;
  debouncedSearch: string;
  minPassingMarks: string;
  maxPassingMarks: string;
  minTotalMarks: string;
  maxTotalMarks: string;
  selectedSubject: SubjectWithClassSubjects | null;
  editingSubject: SubjectWithClassSubjects | null;
  creatingChapters: {
    subject: SubjectWithClassSubjects;
    classInfo: NonNullable<SubjectWithClassSubjects["classSubjects"]>[0];
  } | null;
  deletingId: string | null;
  isDeleting: boolean;
  deletingSubject: SubjectWithClassSubjects | null;
  deletingChapter: {
    subjectId: string;
    chapterId: string;
    chapterName: string;
  } | null;
  isAssignModalOpen: boolean;
  allClasses: Class[];
  allTeachers: GetTeachers[];
  selectedSubjectId: string;
  selectedClassId: string;
  selectedTeacherId: string;
  modalLoading: boolean;
  activeTab: "classes" | "chapters";

  // Pagination state
  currentPage: number;
  pageSize: number;
  totalSubjects: number;
  totalPages: number;

  // Actions
  setSearchQuery: (query: string) => void;
  setMinPassingMarks: (value: string) => void;
  setMaxPassingMarks: (value: string) => void;
  setMinTotalMarks: (value: string) => void;
  setMaxTotalMarks: (value: string) => void;
  clearFilters: () => void;
  setSelectedSubject: (subject: SubjectWithClassSubjects | null) => void;
  setEditingSubject: (subject: SubjectWithClassSubjects | null) => void;
  setCreatingChapters: (
    data: {
      subject: SubjectWithClassSubjects;
      classInfo: NonNullable<SubjectWithClassSubjects["classSubjects"]>[0];
    } | null,
  ) => void;
  setDeletingId: (id: string | null) => void;
  setDeletingSubject: (subject: SubjectWithClassSubjects | null) => void;
  setDeletingChapter: (
    data: {
      subjectId: string;
      chapterId: string;
      chapterName: string;
    } | null,
  ) => void;
  setIsAssignModalOpen: (open: boolean) => void;
  setSelectedSubjectId: (id: string) => void;
  setSelectedClassId: (id: string) => void;
  setSelectedTeacherId: (id: string) => void;
  setActiveTab: (tab: "classes" | "chapters") => void;

  // Pagination actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handlePrev: () => void;
  handleNext: () => void;

  // Handlers
  handleAssignModalOpen: () => void;
  handleAssign: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleDeleteSubject: () => Promise<void>;
  handleDeleteChapter: () => Promise<void>;
  fetchSubjects: () => Promise<void>;
}

export function useSubjects(): UseSubjectsReturn {
  const [subjects, setSubjects] = useState<SubjectWithClassSubjects[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [minPassingMarks, setMinPassingMarks] = useState<string>("");
  const [maxPassingMarks, setMaxPassingMarks] = useState<string>("");
  const [minTotalMarks, setMinTotalMarks] = useState<string>("");
  const [maxTotalMarks, setMaxTotalMarks] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Debounce search query (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [selectedSubject, setSelectedSubject] =
    useState<SubjectWithClassSubjects | null>(null);
  const [editingSubject, setEditingSubject] =
    useState<SubjectWithClassSubjects | null>(null);
  const [creatingChapters, setCreatingChapters] = useState<{
    subject: SubjectWithClassSubjects;
    classInfo: NonNullable<SubjectWithClassSubjects["classSubjects"]>[0];
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingSubject, setDeletingSubject] =
    useState<SubjectWithClassSubjects | null>(null);
  const [deletingChapter, setDeletingChapter] = useState<{
    subjectId: string;
    chapterId: string;
    chapterName: string;
  } | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [allTeachers, setAllTeachers] = useState<GetTeachers[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"classes" | "chapters">("classes");

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await subjectApis.getAllForPage(
        currentPage,
        pageSize,
        debouncedSearch,
        minPassingMarks ? Number(minPassingMarks) : undefined,
        maxPassingMarks ? Number(maxPassingMarks) : undefined,
        minTotalMarks ? Number(minTotalMarks) : undefined,
        maxTotalMarks ? Number(maxTotalMarks) : undefined,
      );
      setSubjects(response.data);
      setTotalSubjects(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    debouncedSearch,
    minPassingMarks,
    maxPassingMarks,
    minTotalMarks,
    maxTotalMarks,
  ]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const fetchAssignmentData = async () => {
    try {
      setModalLoading(true);
      const [classesData, teachersData] = await Promise.all([
        classApis.getAll(),
        getAllTeachers(undefined, undefined, undefined, undefined, "active"),
      ]);
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
      if (selectedSubject && selectedSubject.classSubjects) {
        const updatedSubject = {
          ...selectedSubject,
          classSubjects: selectedSubject.classSubjects.filter(
            cls => cls.id !== deletingId,
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
      await subjectApis.deleteSubject(deletingSubject.id);
      showToast.success("Subject deleted successfully!");
      setDeletingSubject(null);
      fetchSubjects();
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteChapter = async () => {
    if (!deletingChapter) return;
    try {
      setIsDeleting(true);
      await subjectApis.deleteChapter(
        deletingChapter.subjectId,
        deletingChapter.chapterId,
      );
      showToast.success("Chapter deleted successfully!");
      setDeletingChapter(null);

      // Refresh subjects data
      await fetchSubjects();

      // Update selectedSubject with latest data
      const updatedSubjectsResponse = await subjectApis.getAllForPage(
        currentPage,
        pageSize,
        debouncedSearch,
      );
      const updatedSubject = updatedSubjectsResponse.data.find(
        (s: SubjectWithClassSubjects) => s.id === selectedSubject?.id,
      );
      if (updatedSubject) {
        setSelectedSubject(updatedSubject);
      }
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    minPassingMarks,
    maxPassingMarks,
    minTotalMarks,
    maxTotalMarks,
  ]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setMinPassingMarks("");
    setMaxPassingMarks("");
    setMinTotalMarks("");
    setMaxTotalMarks("");
  };

  // Pagination handlers
  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  // Reset to first page when page size changes
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return {
    // State
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
    allClasses,
    allTeachers,
    selectedSubjectId,
    selectedClassId,
    selectedTeacherId,
    modalLoading,
    activeTab,

    // Pagination state
    currentPage,
    pageSize,
    totalSubjects,
    totalPages,

    // Actions
    setSearchQuery,
    setMinPassingMarks,
    setMaxPassingMarks,
    setMinTotalMarks,
    setMaxTotalMarks,
    clearFilters,
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

    // Pagination actions
    setCurrentPage,
    setPageSize: handlePageSizeChange,
    handlePrev,
    handleNext,

    // Handlers
    handleAssignModalOpen,
    handleAssign,
    handleDelete,
    handleDeleteSubject,
    handleDeleteChapter,
    fetchSubjects,
  };
}

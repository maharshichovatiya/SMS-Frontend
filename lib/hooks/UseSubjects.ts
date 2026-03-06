import { useState, useEffect, useCallback } from "react";
import {
  subjectApis,
  SubjectWithClasses,
  AssignClassData,
} from "@/lib/api/Subject";
import { classApis, Class } from "@/lib/api/Class";
import { getAllTeachers } from "@/lib/api/Teacher";
import { GetTeachers } from "@/lib/types/Teacher";
import { showToast } from "@/lib/utils/Toast";

export interface UseSubjectsReturn {
  // State
  subjects: SubjectWithClasses[];
  loading: boolean;
  searchQuery: string;
  debouncedSearch: string;
  selectedSubject: SubjectWithClasses | null;
  editingSubject: SubjectWithClasses | null;
  creatingChapters: {
    subject: SubjectWithClasses;
    classInfo: SubjectWithClasses["classSubjects"][0];
  } | null;
  deletingId: string | null;
  isDeleting: boolean;
  deletingSubject: SubjectWithClasses | null;
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

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedSubject: (subject: SubjectWithClasses | null) => void;
  setEditingSubject: (subject: SubjectWithClasses | null) => void;
  setCreatingChapters: (
    data: {
      subject: SubjectWithClasses;
      classInfo: SubjectWithClasses["classSubjects"][0];
    } | null,
  ) => void;
  setDeletingId: (id: string | null) => void;
  setDeletingSubject: (subject: SubjectWithClasses | null) => void;
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

  // Handlers
  handleAssignModalOpen: () => void;
  handleAssign: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleDeleteSubject: () => Promise<void>;
  handleDeleteChapter: () => Promise<void>;
  fetchSubjects: () => Promise<void>;
}

export function useSubjects(): UseSubjectsReturn {
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
  const [creatingChapters, setCreatingChapters] = useState<{
    subject: SubjectWithClasses;
    classInfo: SubjectWithClasses["classSubjects"][0];
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingSubject, setDeletingSubject] =
    useState<SubjectWithClasses | null>(null);
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
      const [classesData, teachersData] = await Promise.all([
        classApis.getAll(),
        getAllTeachers(),
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
      if (selectedSubject) {
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
      const updatedSubjects = await subjectApis.getAllForPage();
      const updatedSubject = updatedSubjects.find(
        s => s.id === selectedSubject?.id,
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

  return {
    // State
    subjects,
    loading,
    searchQuery,
    debouncedSearch,
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

    // Actions
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

    // Handlers
    handleAssignModalOpen,
    handleAssign,
    handleDelete,
    handleDeleteSubject,
    handleDeleteChapter,
    fetchSubjects,
  };
}

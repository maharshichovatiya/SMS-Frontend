import api from "../Axios";
import {
  Chapter,
  Subject,
  SubjectWithClassSubjects,
  SubjectWithClasses,
  CreateSubjectData,
  UpdateSubjectData,
  AssignClassData,
  SubjectListResponse,
  SubjectPaginatedResponse,
  AssignClassResponse,
  PaginationMeta,
} from "@/lib/types/SubjectTypes";

// Re-export types for backward compatibility
export type {
  Chapter,
  Subject,
  SubjectWithClassSubjects,
  SubjectWithClasses,
  CreateSubjectData,
  UpdateSubjectData,
  AssignClassData,
  SubjectListResponse,
  AssignClassResponse,
};

export const subjectApis = {
  getAll: async (): Promise<Subject[]> => {
    const res = await api.get<SubjectListResponse>("/subjects");
    return res.data.data;
  },

  getAllForPage: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    minPassingMarks?: number,
    maxPassingMarks?: number,
    minTotalMarks?: number,
    maxTotalMarks?: number,
  ): Promise<{ data: SubjectWithClassSubjects[]; meta: PaginationMeta }> => {
    const params: Record<string, string | number> = { page, limit };
    if (search) params.search = search;
    if (minPassingMarks !== undefined) params.minPassingMarks = minPassingMarks;
    if (maxPassingMarks !== undefined) params.maxPassingMarks = maxPassingMarks;
    if (minTotalMarks !== undefined) params.minTotalMarks = minTotalMarks;
    if (maxTotalMarks !== undefined) params.maxTotalMarks = maxTotalMarks;

    const res = await api.get<SubjectPaginatedResponse>("/subjects", {
      params,
    });

    return {
      data: res.data.data.data,
      meta: res.data.data.meta,
    };
  },

  getById: async (id: string): Promise<Subject> => {
    const res = await api.get<{ data: Subject }>(`/class-subject/${id}`);
    return res.data.data;
  },

  create: async (data: CreateSubjectData): Promise<Subject> => {
    const res = await api.post<{ data: Subject }>("/subjects", data);
    return res.data.data;
  },

  assignClassToSubject: async (
    data: AssignClassData,
  ): Promise<AssignClassResponse> => {
    const res = await api.post<{ data: AssignClassResponse }>(
      "/class-subject",
      data,
    );
    return res.data.data;
  },

  addChaptersToSubject: async (
    subjectId: string,
    chaptersData: { chapters: { chapterNo: number; chapterName: string }[] },
  ): Promise<{ chapters: { chapterNo: number; chapterName: string }[] }> => {
    const res = await api.post<{
      chapters: { chapterNo: number; chapterName: string }[];
    }>(`/subjects/${subjectId}/chapters`, chaptersData);
    return res.data;
  },

  deleteChapter: async (
    subjectId: string,
    chapterId: string,
  ): Promise<void> => {
    await api.delete(`/subjects/${subjectId}/chapters/${chapterId}`);
  },

  update: async (id: string, data: UpdateSubjectData): Promise<Subject> => {
    const res = await api.patch<{ data: Subject }>(`/subjects/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/class-subject/${id}`);
  },

  deleteSubject: async (id: string): Promise<void> => {
    await api.delete(`/subjects/${id}`);
  },
};

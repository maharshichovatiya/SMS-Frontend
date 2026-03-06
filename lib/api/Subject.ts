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
  ): Promise<{ data: SubjectWithClasses[]; meta: PaginationMeta }> => {
    const params: Record<string, string | number> = { page, limit };
    if (search) params.search = search;

    const res = await api.get<SubjectPaginatedResponse>("/subjects", {
      params,
    });

    // Transform SubjectWithClassSubjects[] to SubjectWithClasses[] format
    const transformedData = res.data.data.data.map(
      (subject: SubjectWithClassSubjects) => ({
        id: subject.id,
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode,
        passingMarks: subject.passingMarks,
        maxMarks: subject.maxMarks,
        status: subject.status,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt,
        chapters: subject.chapters || [], // Include chapters from API response
        classSubjects:
          subject.classSubjects?.map(classSubject => ({
            id: classSubject.id,
            class: {
              id: classSubject.class.id,
              className: classSubject.class.className,
              section: classSubject.class.section,
              classTeacherId: classSubject.class.classTeacherId || null,
              studentCapacity: classSubject.class.studentCapacity || 0,
              status: classSubject.class.status,
              createdAt: classSubject.class.createdAt,
              updatedAt: classSubject.class.updatedAt,
            },
            teacher: classSubject.teacher,
          })) || [], // Use classSubjects directly as required by SubjectWithClasses
      }),
    );

    return {
      data: transformedData,
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

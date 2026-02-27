import api from "../Axios";

export interface Chapter {
  chapterName: string;
  chapterNo: number;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Class {
  id: string;
  classNo: number;
  section: string;
  classTeacherId: string | null;
  studentCapacity: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  classSubjects: ClassSubjectItem[];
}

export interface ClassSubjectItem {
  id: string;
  subject: Subject;
  teacher?: Teacher;
}

export interface Subject {
  id: string;
  subjectName: string;
  subjectCode: string;
  passingMarks: number;
  maxMarks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[];

  classInfo?: {
    id: string;
    classNo: number;
    section: string;
  };

  classSubjectId?: string;
}

export interface SubjectWithClasses {
  id: string;
  subjectName: string;
  subjectCode: string;
  passingMarks: number;
  maxMarks: number;
  status: string;
  createdAt: string;
  updatedAt: string;

  classes: {
    classSubjectId: string;
    classInfo: {
      id: string;
      classNo: number;
      section: string;
    };
    chapters: Chapter[];
    teacher?: Teacher;
  }[];
}

/* =========================
   REQUEST TYPES
========================= */

export interface CreateSubjectData {
  subjectName: string;
  subjectCode: string;
  passingMarks: number;
  maxMarks: number;
  chapters: Chapter[];
}

export interface UpdateSubjectData {
  subjectName?: string;
  subjectCode?: string;
  passingMarks?: number;
  maxMarks?: number;
  chapters?: Chapter[];
  status?: "active" | "inactive";
}

export interface AssignClassData {
  subjectId: string;
  classId: string;
  teacherId: string;
}

export interface SubjectListResponse {
  data: Subject[];
}

export interface ClassSubjectListResponse {
  statusCode: number;
  message: string;
  data: Class[];
  Total_Records: number;
}

export interface AssignClassResponse {
  id: string;
  subjectId: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

export const subjectApis = {
  getAll: async (): Promise<Subject[]> => {
    const res = await api.get<SubjectListResponse>("/subjects");
    return res.data.data;
  },

  getAllForPage: async (): Promise<SubjectWithClasses[]> => {
    const res = await api.get<ClassSubjectListResponse>("/class-subject");

    const subjectMap = new Map<string, SubjectWithClasses>();

    res.data.data.forEach((classItem: Class) => {
      if (!classItem.classSubjects?.length) return;

      classItem.classSubjects.forEach((classSubject: ClassSubjectItem) => {
        const subject = classSubject.subject;
        if (!subject) return;

        // create subject if not exists
        if (!subjectMap.has(subject.id)) {
          subjectMap.set(subject.id, {
            id: subject.id,
            subjectName: subject.subjectName,
            subjectCode: subject.subjectCode,
            passingMarks: subject.passingMarks,
            maxMarks: subject.maxMarks,
            status: subject.status,
            createdAt: subject.createdAt,
            updatedAt: subject.updatedAt,
            classes: [],
          });
        }

        subjectMap.get(subject.id)!.classes.push({
          classSubjectId: classSubject.id,
          classInfo: {
            id: classItem.id,
            classNo: classItem.classNo,
            section: classItem.section,
          },
          chapters: subject.chapters || [],
          teacher: classSubject.teacher,
        });
      });
    });

    return Array.from(subjectMap.values());
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

  update: async (id: string, data: UpdateSubjectData): Promise<Subject> => {
    const res = await api.patch<{ data: Subject }>(`/subjects/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/class-subject/${id}`);
  },
};

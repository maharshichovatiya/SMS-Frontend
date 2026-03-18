import api from "../Axios";

export interface UploadedBy {
  id: string;
  name: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  resourceType: "PDF" | "Video" | "Notes" | "Link";
  uploadedBy: UploadedBy;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  chapterId: string;
  chapterName: string;
  chapterNo: number;
  resources: Resource[];
}

export interface Subject {
  subjectId: string;
  subjectName: string;
  chapters: Chapter[];
}

export interface Class {
  classId: string;
  className: string;
  subjects: Subject[];
}

export interface ChapterResourcesResponse {
  statusCode: number;
  message: string;
  data: Class[];
  Total_Records: number;
}

export const resourcesApis = {
  getChapterResources: async (): Promise<Class[]> => {
    const res = await api.get<ChapterResourcesResponse>("/chapter-resources");
    return res.data.data;
  },
};

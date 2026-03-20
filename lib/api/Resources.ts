import api from "../Axios";

export interface UploadedBy {
  id: string;
  name: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  resourceType:
    | "PDF"
    | "Word"
    | "PowerPoint"
    | "Image"
    | "Text"
    | "Link"
    | "Notes";
  fileUrl?: string;
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

export interface CreateResourceData {
  chapterId: string;
  title: string;
  uploadedBy: string;
  description?: string;
  resourceType?:
    | "PDF"
    | "Word"
    | "PowerPoint"
    | "Image"
    | "Text"
    | "Link"
    | "Notes";
  file?: File;
  fileUrl?: string;
}

export const resourcesApis = {
  getChapterResources: async (): Promise<Class[]> => {
    const res = await api.get<ChapterResourcesResponse>("/chapter-resources");
    return res.data.data;
  },

  deleteResource: async (id: string): Promise<void> => {
    await api.delete(`/chapter-resources/${id}`);
  },

  createResource: async (data: CreateResourceData): Promise<Resource> => {
    const formData = new FormData();
    formData.append("chapterId", data.chapterId);
    formData.append("title", data.title);
    formData.append("uploadedBy", data.uploadedBy);

    if (data.description) {
      formData.append("description", data.description);
    }

    if (data.resourceType) {
      formData.append("resourceType", data.resourceType);
    }

    if (data.file) {
      formData.append("file", data.file);
    } else if (data.fileUrl) {
      formData.append("fileUrl", data.fileUrl);
    }

    const res = await api.post("/chapter-resources", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  },
};

export interface Resource {
  id: string;
  title: string;
  description?: string;
  resourceType:
    | "PDF"
    | "Word"
    | "PowerPoint"
    | "Image"
    | "Text"
    | "Link"
    | "Notes";
  fileUrl?: string;
  uploadedBy: {
    id: string;
    name: string;
  };
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

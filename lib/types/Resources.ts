export interface Resource {
  title: string;
  type: "PDF" | "Video" | "Notes" | "Link";
  size: string;
  bg: string;
}

export interface Chapter {
  name: string;
  resources: Resource[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  color: string;
  chapters: Chapter[];
}

export interface Class {
  id: string;
  code: string;
  name: string;
  level: string;
  color: string;
  gradient: string;
  subjects: Subject[];
}

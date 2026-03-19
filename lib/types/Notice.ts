export interface Notice {
  id: string;
  type: string;
  icon: string;
  title: string;
  body: string;
  priority: "high" | "medium" | "low";
  borderColor: string;
  iconColor: string;
  hasAttachment: boolean;
  author: string;
  date: string;
}

export type NoticeFilterType = "all" | "general" | "exam" | "holiday" | "event";

export interface ApiNotice {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  noticeType: string;
  priority: "high" | "medium" | "low";
  sentBy: string;
  sentByUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  publishDate: string;
  expiryDate: string;
  attachmentUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  noticeTargets: unknown[];
}

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
  authorRole?: string;
  date: string;
}

export type NoticeFilterType = "all" | "general" | "exam" | "holiday" | "event";

export const mapApiNoticeToNotice = (apiNotice: ApiNotice): Notice => {
  const getIconAndColor = (noticeType: string) => {
    switch (noticeType.toLowerCase()) {
      case "exam":
        return {
          icon: "FileText",
          iconColor: "#ef4444",
          borderColor: "#ef4444",
        };
      case "holiday":
        return {
          icon: "Calendar",
          iconColor: "#22c55e",
          borderColor: "#22c55e",
        };
      case "event":
        return {
          icon: "PartyPopper",
          iconColor: "#f59e0b",
          borderColor: "#f59e0b",
        };
      case "general":
      default:
        return {
          icon: "Megaphone",
          iconColor: "#3b82f6",
          borderColor: "#3b82f6",
        };
    }
  };

  const { icon, iconColor, borderColor } = getIconAndColor(
    apiNotice.noticeType,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return {
    id: apiNotice.id,
    type:
      apiNotice.noticeType.charAt(0).toUpperCase() +
      apiNotice.noticeType.slice(1) +
      " Notice",
    icon,
    title: apiNotice.title,
    body: apiNotice.description,
    priority: apiNotice.priority,
    borderColor,
    iconColor,
    hasAttachment: !!apiNotice.attachmentUrl,
    author: apiNotice.sentByUser
      ? `${apiNotice.sentByUser.firstName} ${apiNotice.sentByUser.lastName}`
      : "Admin",
    authorRole: apiNotice.sentByUser?.role,
    date: formatDate(apiNotice.publishDate),
  };
};

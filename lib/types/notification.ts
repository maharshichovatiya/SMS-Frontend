export type NotificationType =
  | "exam"
  | "homework"
  | "submission"
  | "holiday"
  | "resource"
  | "event"
  | "admission"
  | "general";

export type NotificationPriority = "high" | "medium" | "low";

export type UserRole = "admin" | "teacher" | "student";

export interface NotificationSender {
  name: string;
  role: string;
  initials: string;
  avatarGradient: [string, string];
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  sender: NotificationSender;
  timestamp: string;
  isRead: boolean;
  hasAttachment: boolean;
  attachmentName: string | null;
  targetRoles: UserRole[];
  targetClasses: string[];
}

export interface NotificationFilter {
  id: string;
  label: string;
  emoji: string;
}

export interface NotificationTypeConfig {
  color: string;
  bgVar: string;
  fgVar: string;
  borderVar: string;
  emoji: string;
  label: string;
}

export interface NotificationsData {
  notifications: Notification[];
  filters: NotificationFilter[];
  typeConfig: Record<NotificationType, NotificationTypeConfig>;
}

export interface NotificationBadgeProps {
  priority: NotificationPriority;
}

export interface NotificationAvatarProps {
  initials: string;
  gradient: [string, string];
  size?: "sm" | "md" | "lg";
}

export interface NotificationIconProps {
  type: NotificationType;
  typeConfig: Record<NotificationType, NotificationTypeConfig>;
}

export interface NotificationCardProps {
  notification: Notification;
  typeConfig: Record<NotificationType, NotificationTypeConfig>;
  onMarkRead: (id: string) => void;
}

export interface NotificationFilterBarProps {
  filters: NotificationFilter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  counts: Record<string, number>;
}

export interface NotificationStatsProps {
  total: number;
  unread: number;
  high: number;
}

export interface NotificationsPageProps {
  initialRole?: UserRole;
}

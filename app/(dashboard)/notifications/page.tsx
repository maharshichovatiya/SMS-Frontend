"use client";
import PageHeader from "@/components/layout/PageHeader";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bell } from "lucide-react";
import NotificationItem from "@/components/notifications/NotificationItem";
import NotificationSkeleton from "@/components/skeletons/NotificationSkeleton";
import { fetchNotices } from "@/lib/store/NoticeSlice";
import { RootState } from "@/lib/store/Index";
import type { AppDispatch } from "@/lib/store/Index";
import type { ApiNotice } from "@/lib/types/Notice";

interface Notification {
  id: string;
  icon: string;
  bgColor: string;
  message: string;
  time: string;
  isUnread: boolean;
  author?: string;
  authorRole?: string;
  priority?: "high" | "medium" | "low";
}

const mapNoticeToNotification = (notice: ApiNotice): Notification => {
  const getIconAndBgColor = (noticeType: string) => {
    switch (noticeType.toLowerCase()) {
      case "exam":
        return { icon: "FileText", bgColor: "var(--rose-l)" };
      case "holiday":
        return { icon: "Calendar", bgColor: "var(--amber-l)" };
      case "event":
        return { icon: "Megaphone", bgColor: "var(--blue-l)" };
      case "general":
      default:
        return { icon: "Megaphone", bgColor: "var(--green-l)" };
    }
  };

  const { icon, bgColor } = getIconAndBgColor(notice.noticeType);

  const formatRelativeTime = (dateString: string) => {
    const noticeDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - noticeDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return noticeDate.toLocaleDateString();
  };

  return {
    id: `notice-${notice.id}`,
    icon,
    bgColor,
    message: `<strong>${notice.title}</strong> - ${notice.description}`,
    time: formatRelativeTime(notice.createdAt),
    isUnread: notice.status === "active",
    author: notice.sentByUser
      ? `${notice.sentByUser.firstName} ${notice.sentByUser.lastName}`
      : "Admin",
    authorRole: notice.sentByUser?.role,
    priority: notice.priority,
  };
};

function Page() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const {
    apiNotices,
    loading: noticesLoading,
    error: noticesError,
  } = useSelector((state: RootState) => state.notices);

  useEffect(() => {
    const fetchNoticesData = async () => {
      try {
        setLoading(true);
        setError(null);
        await dispatch(fetchNotices()).unwrap();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch notices",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNoticesData();
  }, [dispatch]);

  useEffect(() => {
    if (apiNotices.length > 0) {
      const noticeNotifications = apiNotices.map(mapNoticeToNotification);
      setNotifications(noticeNotifications);
    }
  }, [apiNotices]);

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isUnread: false })),
    );
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isUnread: !notification.isUnread }
          : notification,
      ),
    );
  };

  if (error || noticesError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error || noticesError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay updated with latest activities"
        icon={Bell}
        iconBgColor="--green-light"
        iconColor="--green"
        buttonText="Mark All Read"
        onButtonClick={handleMarkAllRead}
      />

      <div className="mt-5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] divide-y divide-[var(--border)]">
        {loading || noticesLoading ? (
          <NotificationSkeleton />
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No notifications</div>
            <p className="text-gray-400 mt-2">You&apos;re all caught up!</p>
          </div>
        ) : (
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Page;

"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { BookOpen } from "lucide-react";
import { RootState } from "@/lib/store/Index";
import NotificationFilters from "./NotificationFilters";
import PageHeader from "@/components/layout/PageHeader";

interface Notification {
  id: string;
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
  isRead: boolean;
  type: string;
  sender?: {
    name: string;
    role: string;
    initials: string;
    avatarGradient: [string, string];
  };
  hasAttachment?: boolean;
  attachmentName?: string;
}

const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}> = ({ notification, onMarkAsRead }) => {
  const [hovered, setHovered] = useState(false);

  const getPriorityColor = () => {
    switch (notification.priority) {
      case "high":
        return "bg-[var(--color-rose)]";
      case "medium":
        return "bg-[var(--color-amber)]";
      case "low":
        return "bg-[var(--color-green)]";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeStyles = () => {
    switch (notification.type) {
      case "homework":
        return {
          label: "Homework",
          bg: "bg-[var(--notification-accent-light)]",
          text: "text-[var(--notification-accent)]",
        };
      case "academic":
        return {
          label: "Academic",
          bg: "bg-[var(--notification-accent-light)]",
          text: "text-[var(--notification-accent)]",
        };
      case "meeting":
        return {
          label: "Meeting",
          bg: "bg-[var(--notification-accent-light)]",
          text: "text-[var(--notification-accent)]",
        };
      case "admission":
        return {
          label: "Admission",
          bg: "bg-[var(--notification-accent-light)]",
          text: "text-[var(--notification-accent)]",
        };
      case "system":
        return {
          label: "System",
          bg: "bg-[var(--notification-accent-light)]",
          text: "text-[var(--notification-accent)]",
        };
      case "library":
        return {
          label: "Library",
          bg: "bg-[var(--notification-accent-light)]",
          text: "text-[var(--notification-accent)]",
        };
      default:
        return {
          label: "General",
          bg: "bg-[var(--notification-accent-light)]",
          text: "text-[var(--notification-accent)]",
        };
    }
  };

  const typeConfig = getTypeStyles();
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now.getTime() - then.getTime()) / (1000 * 60));

    if (diff < 60) return "Just now";
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  return (
    <div
      className={`flex items-start gap-4 px-6 py-[18px] border-b border-[var(--notification-border)] cursor-pointer relative transition-all duration-200 ${
        notification.isRead
          ? "bg-[var(--notification-bg)]"
          : "bg-[var(--notification-unread-bg)] border-l-[3px] border-l-[var(--notification-unread-border)]"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!notification.isRead && (
        <div
          className={`absolute top-5 right-5 w-2 h-2 rounded-full border-2 border-[var(--notification-bg)] ${getPriorityColor()}`}
        />
      )}

      <div
        className={`w-10 h-10 rounded-[var(--radius-sm)] ${typeConfig.bg} ${typeConfig.text} flex items-center justify-center text-sm font-bold flex-shrink-0 border border-[var(--notification-accent-light)]`}
      >
        {typeConfig.label.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={`text-[10px] font-bold uppercase tracking-[0.6px] mb-1 font-[var(--font-sans)] ${typeConfig.text}`}
        >
          {typeConfig.label}
        </div>

        <div
          className={`text-sm font-[var(--font-sans)] leading-[1.3] mb-1 ${
            notification.isRead ? "font-semibold" : "font-bold"
          } text-[var(--notification-text-primary)]`}
        >
          {notification.title}
        </div>

        <div
          className="text-[13px] text-[var(--notification-text-secondary)] leading-[1.5] mb-2.5 font-[var(--font-sans)] overflow-hidden line-clamp-2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {notification.message}
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {notification.sender && (
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 font-[var(--font-sans)]"
                style={{
                  background: `linear-gradient(135deg, ${notification.sender.avatarGradient[0]}, ${notification.sender.avatarGradient[1]})`,
                }}
              >
                {notification.sender.initials}
              </div>
              <span className="text-[12px] font-semibold text-[var(--notification-text-primary)] font-[var(--font-sans)]">
                {notification.sender.name}
              </span>
              <span className="text-[11px] text-[var(--notification-text-muted)] font-[var(--font-sans)]">
                · {notification.sender.role}
              </span>
            </div>
          )}

          <span className="text-[11px] text-[var(--notification-text-secondary)] font-[var(--font-sans)]">
            {getTimeAgo(notification.timestamp)}
          </span>

          <span className="text-[11px] font-semibold px-[10px] py-0.5 rounded-full font-[var(--font-sans)] bg-[var(--notification-badge-bg)] text-[var(--notification-badge-text)]">
            {notification.priority.toUpperCase()}
          </span>

          {notification.hasAttachment && (
            <span className="text-[11px] text-[var(--notification-accent)] font-semibold flex items-center gap-0.5 font-[var(--font-sans)] cursor-pointer hover:underline">
              {notification.attachmentName}
            </span>
          )}
        </div>
      </div>

      {!notification.isRead && onMarkAsRead && (
        <div
          className={`ml-auto flex gap-1.5 transition-opacity duration-150 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={e => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            className="px-[10px] py-1 rounded-[var(--radius-xs)] border-[1.5px] border-[var(--notification-border)] bg-[var(--notification-bg)] text-[11px] font-semibold text-[var(--notification-accent)] cursor-pointer font-[var(--font-sans)] transition-all duration-150 hover:bg-[var(--notification-accent-light)]"
          >
            Mark Read
          </button>
        </div>
      )}
    </div>
  );
};

const NotificationPage: React.FC = () => {
  const userRole =
    useSelector((state: RootState) => state.auth.role) || "teacher";

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New homework assignment",
      message:
        "Ms. Johnson assigned Chapter 5 exercises for Class 10-A. Due date is Friday.",
      priority: "high",
      timestamp: "2026-03-12T10:30:00Z",
      isRead: false,
      type: "homework",
      sender: {
        name: "Sarah Johnson",
        role: "teacher",
        initials: "SJ",
        avatarGradient: ["#3d6cf4", "#6c47f5"],
      },
      hasAttachment: true,
      attachmentName: "homework.pdf",
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("all");

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    return notifications.filter(n => n.priority === activeFilter);
  }, [notifications, activeFilter]);

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      all: notifications.length,
      high: notifications.filter(n => n.priority === "high").length,
      medium: notifications.filter(n => n.priority === "medium").length,
      low: notifications.filter(n => n.priority === "low").length,
    };
    return result;
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const unread = filteredNotifications.filter(n => !n.isRead);
  const read = filteredNotifications.filter(n => n.isRead);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay updated with latest activities"
        icon={BookOpen}
        iconBgColor="--blue-light"
        iconColor="--blue"
      />
      <NotificationFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      <div className="bg-[var(--notification-bg)] border-[1.5px] border-[var(--notification-border)] rounded-[var(--radius-md)] overflow-hidden">
        <div className="px-[22px] py-4 border-b border-[var(--notification-border)] flex items-center justify-between bg-[var(--notification-bg-hover)]">
          <div>
            <div className="text-[15px] font-bold text-[var(--notification-text-primary)]">
              {activeFilter === "all"
                ? "All Notifications"
                : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Priority Notifications`}
            </div>
            <div className="text-[12px] text-[var(--notification-text-secondary)] mt-0.5">
              {filteredNotifications.length} notification
              {filteredNotifications.length !== 1 ? "s" : ""}
              {unread.length > 0 && ` · ${unread.length} unread`}
            </div>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-15 text-[var(--notification-text-muted)]">
            <div className="text-base font-bold text-[var(--notification-text-primary)] mb-1.5 font-[var(--font-sans)]">
              No {activeFilter === "all" ? "" : activeFilter} notifications
            </div>
            <div className="text-[13px] text-[var(--notification-text-muted)] font-[var(--font-sans)]">
              {activeFilter === "all"
                ? "You're all caught up! No notifications at the moment."
                : `No notifications in "${activeFilter}" category yet.`}
            </div>
          </div>
        ) : (
          <>
            {unread.length > 0 && (
              <>
                <div className="px-5 py-2.5 pb-1.5 text-[10px] font-bold text-[var(--notification-text-muted)] uppercase tracking-[0.7px] bg-[var(--notification-bg-hover)] border-b border-[var(--notification-border)]">
                  Unread · {unread.length}
                </div>
                {unread.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </>
            )}

            {read.length > 0 && (
              <>
                <div
                  className={`px-5 py-2.5 pb-1.5 text-[10px] font-bold text-[var(--notification-text-muted)] uppercase tracking-[0.7px] bg-[var(--color-surface-2)] border-b border-[var(--notification-border)] ${
                    unread.length > 0
                      ? "border-t border-[var(--notification-border)]"
                      : ""
                  }`}
                >
                  Earlier · {read.length}
                </div>
                {read.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;

"use client";
import PageHeader from "@/components/layout/PageHeader";
import { useState } from "react";
import { Bell } from "lucide-react";
import NotificationItem from "@/components/notifications/NotificationItem";

interface Notification {
  id: string;
  icon: string;
  bgColor: string;
  message: string;
  time: string;
  isUnread: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    icon: "FileText",
    bgColor: "var(--rose-l)",
    message:
      "<strong>Mid-Term Exam Schedule</strong> has been published. Check the notice board for details.",
    time: "10 min ago",
    isUnread: true,
  },
  {
    id: "2",
    icon: "ClipboardCheck",
    bgColor: "var(--blue-l)",
    message:
      "New homework <strong>Quadratic Equations</strong> assigned by Sunita Mishra for Class 10-A.",
    time: "1 hr ago",
    isUnread: true,
  },
  {
    id: "3",
    icon: "Check",
    bgColor: "var(--green-l)",
    message:
      "<strong>32 students</strong> have submitted Quadratic Equations homework.",
    time: "2 hrs ago",
    isUnread: true,
  },
  {
    id: "4",
    icon: "Megaphone",
    bgColor: "var(--amber-l)",
    message:
      "<strong>Holi Holiday</strong> notice posted. School closed March 14-15.",
    time: "5 hrs ago",
    isUnread: false,
  },
  {
    id: "5",
    icon: "BookOpen",
    bgColor: "var(--indigo-l)",
    message:
      "New resource <strong>Quadratic Equations Notes</strong> uploaded by Sunita Mishra.",
    time: "Yesterday",
    isUnread: false,
  },
  {
    id: "6",
    icon: "Video",
    bgColor: "var(--cyan-l)",
    message:
      "Video resource <strong>Chemical Bonding Lecture</strong> added to Science chapter.",
    time: "Yesterday",
    isUnread: false,
  },
  {
    id: "7",
    icon: "Calendar",
    bgColor: "var(--rose-l)",
    message:
      "<strong>Science Exhibition 2026</strong> registration open. Deadline: March 22.",
    time: "2 days ago",
    isUnread: false,
  },
  {
    id: "8",
    icon: "User",
    bgColor: "var(--green-l)",
    message:
      "<strong>Arjun Kumar</strong> admitted to Class 10-A successfully.",
    time: "3 days ago",
    isUnread: false,
  },
];

function Page() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

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

      <div className="mt-5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)]">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={handleNotificationClick}
          />
        ))}
      </div>
    </div>
  );
}

export default Page;

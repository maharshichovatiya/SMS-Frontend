import {
  BookOpen,
  Calendar,
  Check,
  ClipboardCheck,
  FileText,
  Megaphone,
  User,
  Video,
} from "lucide-react";

interface Notification {
  id: string;
  icon: string;
  bgColor: string;
  message: string;
  time: string;
  isUnread: boolean;
}

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: string) => void;
}

const getLucideIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    FileText: <FileText className="w-4 h-4" />,
    ClipboardCheck: <ClipboardCheck className="w-4 h-4" />,
    Check: <Check className="w-4 h-4" />,
    Megaphone: <Megaphone className="w-4 h-4" />,
    BookOpen: <BookOpen className="w-4 h-4" />,
    Video: <Video className="w-4 h-4" />,
    Calendar: <Calendar className="w-4 h-4" />,
    User: <User className="w-4 h-4" />,
  };
  return iconMap[iconName] || <FileText className="w-4 h-4" />;
};

export default function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  return (
    <div
      key={notification.id}
      onClick={() => onClick(notification.id)}
      className={`flex items-start gap-3 px-[18px] py-[14px] border-b border-[var(--border)] transition-colors duration-100 cursor-pointer hover:bg-[#fafbff] ${notification.isUnread ? "bg-[var(--bg)]" : ""}`}
    >
      <div
        className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0 text-[16px] text-[var(--text)]"
        style={{ backgroundColor: notification.bgColor }}
      >
        {getLucideIcon(notification.icon)}
      </div>

      <div>
        <div
          className="text-[13px] text-[var(--text2)] leading-[1.5]"
          dangerouslySetInnerHTML={{ __html: notification.message }}
        />
        <div className="text-[11px] text-[var(--text3)] mt-[3px]">
          {notification.time}
        </div>
      </div>
    </div>
  );
}

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
import TruncatedText from "@/components/ui/TruncatedText";

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

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: string) => void;
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return (
        <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-[10px] uppercase tracking-wider font-bold">
          High Priority
        </span>
      );
    case "medium":
      return (
        <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-[10px] uppercase tracking-wider font-bold">
          Medium Priority
        </span>
      );
    case "low":
      return (
        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[10px] uppercase tracking-wider font-bold">
          Low Priority
        </span>
      );
    default:
      return null;
  }
};

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

const stripHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

export default function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const plainTextMessage = stripHtml(notification.message);

  return (
    <div
      key={notification.id}
      onClick={() => onClick(notification.id)}
      className={`flex items-start gap-3 px-[18px] py-[14px]  transition-colors duration-100 cursor-pointer hover:bg-[#fafbff] first:rounded-t-[var(--radius-md)] 
      last:rounded-b-[var(--radius-md)] ${notification.isUnread ? "bg-[var(--bg)]" : ""}`}
    >
      <div
        className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0 text-[16px] text-[var(--text)]"
        style={{ backgroundColor: notification.bgColor }}
      >
        {getLucideIcon(notification.icon)}
      </div>

      <div className="flex-1">
        <div className="text-[13px] text-[var(--text2)] leading-[1.5]">
          <TruncatedText
            text={plainTextMessage}
            maxChars={120}
            className="inline"
          />
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {notification.priority && getPriorityBadge(notification.priority)}
          {notification.author && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-gray-500 font-medium">
                {notification.author}
              </span>
              {notification.authorRole && (
                <span className="px-1.5 py-[2px] bg-slate-100 text-slate-600 rounded text-[9px] uppercase font-bold tracking-wider border border-slate-200 leading-none">
                  {notification.authorRole}
                </span>
              )}
            </div>
          )}
          <div className="text-[11px] text-[var(--text3)]">
            {notification.time}
          </div>
        </div>
      </div>
    </div>
  );
}

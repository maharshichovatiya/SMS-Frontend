import {
  Megaphone,
  FileText,
  Calendar,
  PartyPopper,
  Paperclip,
} from "lucide-react";
import TruncatedText from "@/components/ui/TruncatedText";

interface Notice {
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

interface NoticeCardProps {
  notice: Notice;
  index: number;
}

const getLucideIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    FileText: <FileText className="w-4 h-4" />,
    Calendar: <Calendar className="w-4 h-4" />,
    Megaphone: <Megaphone className="w-4 h-4" />,
    PartyPopper: <PartyPopper className="w-4 h-4" />,
  };
  return iconMap[iconName] || <FileText className="w-4 h-4" />;
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return (
        <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-xs font-semibold">
          High Priority
        </span>
      );
    case "medium":
      return (
        <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-semibold">
          Medium Priority
        </span>
      );
    case "low":
      return (
        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
          Low Priority
        </span>
      );
    default:
      return null;
  }
};

export default function NoticeCard({ notice, index }: NoticeCardProps) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm transition-all duration-200 relative hover:-translate-y-0.5 hover:shadow-md"
      style={{
        animationDelay: `${index * 0.04}s`,
      }}
    >
      <div
        className="text-xs font-bold uppercase tracking-wide mb-1.5 flex items-center"
        style={{ color: notice.iconColor }}
      >
        {getLucideIcon(notice.icon)}
        <span className="ml-1">{notice.type}</span>
      </div>
      <div className="text-base font-bold mb-1">{notice.title}</div>
      <div className="text-sm text-gray-600 mb-3">
        <TruncatedText text={notice.body} maxChars={150} />
      </div>
      <div className="flex items-center gap-2 pt-2.5 border-t border-gray-200 text-xs text-gray-600 flex-wrap">
        {getPriorityBadge(notice.priority)}
        {notice.hasAttachment && (
          <span>
            <Paperclip className="w-3 h-3 inline mr-1" />
            {notice.priority === "high" ? "Attachment" : "Guidelines"}
          </span>
        )}
        <span className="ml-auto">
          By: {notice.author} · {notice.date}
        </span>
      </div>
    </div>
  );
}

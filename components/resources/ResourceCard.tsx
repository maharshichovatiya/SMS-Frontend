import { FileText, Play, Eye, Link, Download } from "lucide-react";
import { Subject, Chapter, Resource } from "@/lib/types/Resources";

interface ResourceCardProps {
  resource: Resource;
  chapter: Chapter;
  selectedSubject: Subject | null;
}

const getResourceIcon = (iconName: string): React.ReactNode => {
  const iconMap: { [key: string]: React.ReactNode } = {
    FileText: <FileText className="w-6 h-6" />,
    Play: <Play className="w-6 h-6" />,
    Link: <Link className="w-6 h-6" />,
  };
  return iconMap[iconName] || <FileText className="w-6 h-6" />;
};

export default function ResourceCard({
  resource,
  chapter,
  selectedSubject,
}: ResourceCardProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-4 hover:border-[var(--blue)] transition-colors cursor-pointer flex flex-col">
      <div
        className="w-16 h-16 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: `var(--${resource.bg}-light)` }}
      >
        {getResourceIcon(resource.icon)}
      </div>
      <h4 className="font-semibold text-[var(--text)] mb-2">
        {resource.title}
      </h4>
      <div className="text-xs text-[var(--text-3)] space-y-1 w-full">
        <div className="flex justify-between">
          <span className="font-medium">{selectedSubject?.name}</span>
          <span className="px-2 py-0.5  text-xs">{resource.type}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{chapter.name}</span>
          <span>{resource.size}</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between border-t border-[var(--border)] pt-3">
        <button
          className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs hover:opacity-80 transition-opacity ${
            resource.type === "PDF"
              ? "border-red-200 bg-red-50 text-red-600"
              : resource.type === "Video"
                ? "border-blue-200 bg-blue-50 text-blue-600"
                : resource.type === "Notes"
                  ? "border-yellow-200 bg-yellow-50 text-yellow-600"
                  : "border-gray-200 bg-gray-50 text-gray-600"
          }`}
        >
          {resource.type}
        </button>
        <button
          className={`flex items-center gap-2 px-3 py-1.5 border border-[var(--border)] rounded-lg text-xs transition-colors ${
            resource.type === "PDF"
              ? "hover:bg-red-100 hover:text-red-600 hover:border-red-200"
              : resource.type === "Video"
                ? "hover:bg-blue-100 hover:text-blue-600 hover:border-blue-200"
                : resource.type === "Notes"
                  ? "hover:bg-yellow-100 hover:text-yellow-600 hover:border-yellow-200"
                  : "hover:bg-gray-100 hover:text-gray-600 hover:border-gray-200"
          }`}
        >
          {resource.type === "PDF" && <Download className="w-3 h-3" />}
          {resource.type === "Video" && <Play className="w-3 h-3" />}
          {resource.type === "Notes" && <Eye className="w-3 h-3" />}
          {resource.type === "Link" && <Link className="w-3 h-3" />}
          {resource.type === "PDF"
            ? "Download"
            : resource.type === "Video"
              ? "Watch"
              : resource.type === "Notes"
                ? "View"
                : "Open"}
        </button>
      </div>
    </div>
  );
}

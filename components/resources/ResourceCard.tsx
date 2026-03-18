import { FileText, Play, Eye, Link, Download } from "lucide-react";
import { Subject, Chapter, Resource } from "@/lib/types/Resources";

interface ResourceCardProps {
  resource: Resource;
  chapter: Chapter;
  selectedSubject: Subject | null;
  onUploadClick?: (chapter: Chapter, subject: Subject) => void;
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
  onUploadClick,
}: ResourceCardProps) {
  const getResourceIcon = (resourceType: string): React.ReactNode => {
    switch (resourceType) {
      case "PDF":
        return <FileText className="w-6 h-6" />;
      case "Video":
        return <Play className="w-6 h-6" />;
      case "Link":
        return <Link className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getResourceColor = (resourceType: string): string => {
    switch (resourceType) {
      case "PDF":
        return "red";
      case "Video":
        return "blue";
      case "Notes":
        return "yellow";
      default:
        return "gray";
    }
  };

  const color = getResourceColor(resource.resourceType);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-4 hover:border-[var(--blue)] transition-colors cursor-pointer flex flex-col">
      <div
        className="w-16 h-16 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: `var(--${color}-light)` }}
      >
        {getResourceIcon(resource.resourceType)}
      </div>
      <h4 className="font-semibold text-[var(--text)] mb-2">
        {resource.title}
      </h4>
      <p className="text-xs text-[var(--text-3)] mb-2 line-clamp-2">
        {resource.description}
      </p>
      <div className="text-xs text-[var(--text-3)] space-y-1 w-full">
        <div className="flex justify-between">
          <span className="font-medium">{selectedSubject?.subjectName}</span>
          <span className="px-2 py-0.5 text-xs">{resource.resourceType}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{chapter.chapterName}</span>
          <span>{resource.uploadedBy.name}</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between border-t border-[var(--border)] pt-3">
        <button
          onClick={() => onUploadClick?.(chapter, selectedSubject!)}
          className="flex items-center gap-2 px-3 py-1.5 border border-[var(--border)] rounded-lg text-xs hover:opacity-80 transition-opacity bg-[var(--surface)] hover:bg-[var(--bg-2)]"
        >
          <Download className="w-3 h-3" />
          Upload Resource
        </button>
        <button
          className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs transition-colors ${
            resource.resourceType === "PDF"
              ? "border-red-200 bg-red-50 text-red-600"
              : resource.resourceType === "Video"
                ? "border-blue-200 bg-blue-50 text-blue-600"
                : resource.resourceType === "Notes"
                  ? "border-yellow-200 bg-yellow-50 text-yellow-600"
                  : "border-gray-200 bg-gray-50 text-gray-600"
          }`}
        >
          {resource.resourceType === "PDF" && <Download className="w-3 h-3" />}
          {resource.resourceType === "Video" && <Play className="w-3 h-3" />}
          {resource.resourceType === "Notes" && <Eye className="w-3 h-3" />}
          {resource.resourceType === "Link" && <Link className="w-3 h-3" />}
          {resource.resourceType === "PDF"
            ? "Download"
            : resource.resourceType === "Video"
              ? "Watch"
              : resource.resourceType === "Notes"
                ? "View"
                : "Open"}
        </button>
      </div>
    </div>
  );
}

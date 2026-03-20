import React, { useState } from "react";
import {
  FileText,
  Play,
  Link,
  Download,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  BookOpen,
  Calendar,
  User,
  Hash,
  Loader2,
} from "lucide-react";
import { Subject, Chapter, Resource } from "@/lib/types/Resources";
import { showToast } from "@/lib/utils/Toast";

interface ResourceCardProps {
  resource: Resource;
  chapter: Chapter;
  selectedSubject: Subject | null;
  isTeacher?: boolean;
  onDeleteClick?: (resource: Resource) => void;
}

export default function ResourceCard({
  resource,
  chapter,
  selectedSubject,
  isTeacher = false,
  onDeleteClick,
}: ResourceCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const getResourceDetails = (
    resourceType: string,
  ): { icon: React.ReactNode; color: string; label: string } => {
    switch (resourceType) {
      case "PDF":
        return {
          icon: <FileText className="w-6 h-6" />,
          color: "blue",
          label: "PDF",
        };
      case "Video":
        return {
          icon: <Play className="w-6 h-6" />,
          color: "blue",
          label: "Video",
        };
      case "Image":
        return {
          icon: <ImageIcon className="w-6 h-6" />,
          color: "blue",
          label: "Image",
        };
      case "Link":
        return {
          icon: <Link className="w-6 h-6" />,
          color: "blue",
          label: "Link",
        };
      case "Notes":
        return {
          icon: <BookOpen className="w-6 h-6" />,
          color: "blue",
          label: "Notes",
        };
      default:
        return {
          icon: <FileText className="w-6 h-6" />,
          color: "blue",
          label: resourceType,
        };
    }
  };

  const { icon, color, label } = getResourceDetails(resource.resourceType);

  const handleOpenInNewTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (resource.fileUrl) {
      window.open(resource.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!resource.fileUrl || isDownloading) return;

    try {
      setIsDownloading(true);
      const response = await fetch(resource.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const fileExtension = resource.fileUrl.split(".").pop()?.split("?")[0];
      const fileName = resource.title
        .toLowerCase()
        .includes(fileExtension || "")
        ? resource.title
        : `${resource.title}.${fileExtension || "pdf"}`;

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const formattedDate = new Date(resource.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div
      className="group bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-5 hover:border-[var(--blue)] transition-all duration-[var(--duration)] cursor-pointer flex flex-col relative overflow-hidden"
      style={{ boxShadow: "var(--shadow-sm)" }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "var(--shadow)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onClick={handleOpenInNewTab}
    >
      {/* Top Header */}
      <div className="flex items-start gap-4 mb-3">
        {/* Large Resource Icon */}
        <div
          className="flex items-center justify-center w-14 h-14 rounded-xl shrink-0 transition-transform group-hover:scale-105"
          style={{
            backgroundColor: `var(--${color}-light)`,
            color: `var(--${color})`,
          }}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <h4 className="font-bold text-[var(--text)] text-lg leading-tight group-hover:text-[var(--blue)] transition-colors line-clamp-2 mb-1">
            {resource.title}
          </h4>
          {selectedSubject && (
            <div className="text-xs font-semibold text-[var(--text-3)] truncate">
              {selectedSubject.subjectName}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-4 flex-1">
        {resource.description ? (
          <p className="text-sm text-[var(--text-2)] line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        ) : (
          <p className="text-sm text-[var(--text-3)] italic">
            No description provided
          </p>
        )}
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs text-[var(--text-2)] bg-[var(--surface-2)] p-3 rounded-xl mb-4 border border-[var(--border)]">
        {/* Chapter Details & Type Badge */}
        <div className="col-span-2 flex items-center justify-between pb-2 mb-1 border-b border-[var(--border)] border-dashed">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <Hash className="w-3.5 h-3.5 text-[var(--blue)] shrink-0" />
            <span className="font-semibold text-[var(--text)] truncate">
              Ch {chapter.chapterNo}: {chapter.chapterName}
            </span>
          </div>
          <div
            className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
            style={{
              backgroundColor: `var(--${color}-light)`,
              color: `var(--${color})`,
              borderColor: `var(--${color}-muted)`,
            }}
          >
            {label}
          </div>
        </div>

        {/* Footer: Uploaded By & Date */}
        <div className="col-span-2 flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <User className="w-3.5 h-3.5 text-[var(--text-3)] shrink-0" />
            <span
              className="truncate text-[var(--text-3)]"
              title={resource.uploadedBy.name}
            >
              Uploaded by:{" "}
              <span className="font-medium text-[var(--text)]">
                {resource.uploadedBy.name}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-[var(--text-3)] shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto flex justify-between gap-2 pt-2">
        {/* Open */}
        <button
          onClick={handleOpenInNewTab}
          title="Open in new tab"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] hover:bg-[var(--blue-light)] hover:border-[var(--blue)] hover:text-[var(--blue)] transition-all duration-[var(--duration)] cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          Open
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          title="Download"
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all duration-[var(--duration)] cursor-pointer ${
            isDownloading
              ? "bg-[var(--bg-2)] border-[var(--border)] text-[var(--text-3)] cursor-wait"
              : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] hover:bg-[var(--blue-light)] hover:border-[var(--blue)] hover:text-[var(--blue)]"
          }`}
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isDownloading ? "..." : "Download"}
        </button>

        {/* Delete — only for teachers/admins */}
        {isTeacher && (
          <button
            onClick={e => {
              e.stopPropagation();
              onDeleteClick?.(resource);
            }}
            title="Delete resource"
            className="flex-none flex items-center justify-center px-3 py-2 rounded-xl text-sm font-semibold border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-[var(--duration)] cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

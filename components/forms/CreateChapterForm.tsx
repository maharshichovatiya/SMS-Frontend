"use client";

import { useState } from "react";
import { SubjectWithClasses } from "@/lib/api/Subject";
import { subjectApis } from "@/lib/api/Subject";
import { showToast } from "@/lib/utils/Toast";

interface CreateChapterFormProps {
  subject: SubjectWithClasses;
  classInfo: SubjectWithClasses["classSubjects"][0];
  chaptersCount?: number;
  onClose: () => void;
  onSubmitSuccess: () => void;
  onChapterCreated?: (newChapter: {
    chapterName: string;
    chapterNo: number;
  }) => void;
}

export default function CreateChapterForm({
  subject,
  classInfo,
  chaptersCount,
  onClose,
  onSubmitSuccess,
  onChapterCreated,
}: CreateChapterFormProps) {
  const [chapter, setChapter] = useState<{
    chapterName: string;
    chapterNo: number;
  }>({ chapterName: "", chapterNo: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentChaptersCount, setCurrentChaptersCount] = useState(
    chaptersCount || subject.chapters?.length || 0,
  );

  const updateChapter = (
    field: "chapterName" | "chapterNo",
    value: string | number,
  ) => {
    setChapter((prev: { chapterName: string; chapterNo: number }) => ({
      ...prev,
      [field]: field === "chapterNo" ? Number(value) : value,
    }));
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    try {
      setIsSubmitting(true);

      // Validate that chapter name is not empty
      if (chapter.chapterName.trim() === "") {
        showToast.error("Chapter name cannot be empty");
        return;
      }

      // Validate chapter number
      if (chapter.chapterNo < 1) {
        showToast.error("Chapter number must be greater than 0");
        return;
      }

      // Validate chapter name length
      if (chapter.chapterName.length > 50) {
        showToast.error("Chapter name cannot exceed 50 characters");
        return;
      }

      // Make API call to add chapter to this subject
      await subjectApis.addChaptersToSubject(subject.id, chapter);

      showToast.success("Chapter created successfully!");

      // Update the local chapters count immediately
      setCurrentChaptersCount((prev: number) => prev + 1);

      // First notify about the new chapter, then handle success
      if (onChapterCreated) {
        onChapterCreated(chapter);
      }

      // Close modal and refresh data after a brief delay to ensure state updates
      setTimeout(() => {
        onSubmitSuccess();
      }, 100);
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form noValidate>
      <div className="space-y-6">
        <div className="mb-4 p-3 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)]">
          <p className="text-sm font-semibold text-[var(--text)]">
            {subject.subjectName}
          </p>
          <p className="text-xs text-[var(--text-3)]">
            Class {classInfo.class.className}-{classInfo.class.section}
          </p>
          <p className="text-xs text-[var(--text-3)] mt-1">
            Existing chapters: {currentChaptersCount}
          </p>
        </div>

        {/* Chapter */}
        <div>
          <div className="mb-1.5">
            <label className="text-xs font-bold text-[var(--text)] uppercase tracking-wide">
              Chapter
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="No."
              min="1"
              value={chapter.chapterNo}
              onChange={e => {
                const value = parseInt(e.target.value) || 0;
                if (value >= 1) {
                  updateChapter("chapterNo", value);
                }
              }}
              className={`w-16 px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                chapter.chapterNo < 1
                  ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                  : "border-[var(--border)]"
              }`}
            />
            <input
              type="text"
              placeholder="Chapter name"
              value={chapter.chapterName}
              onChange={e => updateChapter("chapterName", e.target.value)}
              className={`flex-1 px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                chapter.chapterName.trim() === ""
                  ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                  : "border-[var(--border)]"
              }`}
            />
          </div>

          {chapter.chapterName.trim() === "" && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              Chapter name cannot be empty
            </p>
          )}
          {chapter.chapterNo < 1 && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              Chapter number must be greater than 0
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] transition-colors duration-[var(--duration)] h-[52px] cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="btn-primary px-5 h-auto py-2 text-sm rounded-[var(--radius-sm)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Create Chapter"}
        </button>
      </div>
    </form>
  );
}

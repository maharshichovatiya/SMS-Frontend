"use client";

import { useState } from "react";
import { SubjectWithClasses } from "@/lib/api/Subject";
import { subjectApis } from "@/lib/api/Subject";
import { showToast } from "@/lib/utils/Toast";

interface ClassChapterFormProps {
  subject: SubjectWithClasses;
  classInfo: SubjectWithClasses["classSubjects"][0];
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function ClassChapterForm({
  subject,
  classInfo,
  onClose,
  onSubmitSuccess,
}: ClassChapterFormProps) {
  const [chapters, setChapters] = useState<
    { id?: string; chapterName: string; chapterNo: number }[]
  >(
    (subject.chapters || []).length > 0
      ? subject.chapters || []
      : [{ chapterName: "", chapterNo: 1 }],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateChapter = (
    index: number,
    field: "chapterName" | "chapterNo",
    value: string | number,
  ) => {
    const newChapters = [...chapters];
    newChapters[index] = {
      ...newChapters[index],
      [field]: field === "chapterNo" ? Number(value) : value,
    };
    setChapters(newChapters);
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    try {
      setIsSubmitting(true);

      // Validate that no chapter names are empty
      const emptyChapters = chapters.filter(
        chapter => chapter.chapterName.trim() === "",
      );
      if (emptyChapters.length > 0) {
        showToast.error("Chapter names cannot be empty");
        return;
      }

      const filteredChapters = chapters.filter(
        chapter => chapter.chapterName.trim() !== "",
      );

      if (filteredChapters.length === 0) {
        showToast.error("At least one chapter is required");
        return;
      }

      // Validate chapter numbers
      const invalidChapters = filteredChapters.filter(
        chapter => chapter.chapterNo < 1,
      );
      if (invalidChapters.length > 0) {
        showToast.error("Chapter numbers must be greater than 0");
        return;
      }

      // Validate chapter names
      const invalidNames = filteredChapters.filter(
        chapter => chapter.chapterName.length > 50,
      );
      if (invalidNames.length > 0) {
        showToast.error("Chapter names cannot exceed 50 characters");
        return;
      }

      // Make API call to update chapters for this subject
      const cleanChapters = filteredChapters.map(
        ({ id, chapterName, chapterNo }) => ({
          ...(id && { id }),
          chapterName,
          chapterNo,
        }),
      );

      const updatedSubject = await subjectApis.update(subject.id, {
        subjectName: subject.subjectName,
        passingMarks: subject.passingMarks,
        maxMarks: subject.maxMarks,
        chapters: cleanChapters,
      });

      // Update local state with the API response
      setChapters(updatedSubject.chapters || cleanChapters);

      showToast.success("Chapters updated successfully!");
      onSubmitSuccess();
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
        </div>

        {/* Chapters */}
        <div>
          <div className="mb-1.5">
            <label className="text-xs font-bold text-[var(--text)] uppercase tracking-wide">
              Chapters
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
          </div>

          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="No."
                  min="1"
                  value={chapter.chapterNo}
                  onChange={e => {
                    const value = parseInt(e.target.value) || 0;
                    if (value >= 1) {
                      updateChapter(index, "chapterNo", value);
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
                  placeholder={`Chapter ${index + 1} name`}
                  value={chapter.chapterName}
                  onChange={e =>
                    updateChapter(index, "chapterName", e.target.value)
                  }
                  className={`flex-1 px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                    chapter.chapterName.trim() === ""
                      ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                      : "border-[var(--border)]"
                  }`}
                />
              </div>
            ))}
          </div>

          {chapters.some(chapter => chapter.chapterName.trim() === "") && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              Chapter names cannot be empty
            </p>
          )}
          {chapters.filter(chapter => chapter.chapterName.trim() !== "")
            .length === 0 && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              At least one chapter is required
            </p>
          )}
          {chapters.some(chapter => chapter.chapterNo < 1) && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              Chapter numbers must be greater than 0
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
          {isSubmitting ? "Saving..." : "Update Chapters"}
        </button>
      </div>
    </form>
  );
}

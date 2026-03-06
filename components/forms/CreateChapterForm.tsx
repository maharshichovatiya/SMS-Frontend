"use client";

import { useState } from "react";
import { SubjectWithClassSubjects } from "@/lib/api/Subject";
import { subjectApis } from "@/lib/api/Subject";
import { showToast } from "@/lib/utils/Toast";
import { Plus, Trash2 } from "lucide-react";

interface CreateChapterFormProps {
  subject: SubjectWithClassSubjects;
  classInfo: NonNullable<SubjectWithClassSubjects["classSubjects"]>[0];
  chaptersCount?: number;
  onClose: () => void;
  onSubmitSuccess: () => void;
  onChapterCreated?: (
    newChapters: {
      chapterName: string;
      chapterNo: number;
    }[],
  ) => void;
}

export default function CreateChapterForm({
  subject,
  classInfo,
  chaptersCount,
  onClose,
  onSubmitSuccess,
  onChapterCreated,
}: CreateChapterFormProps) {
  const [chapters, setChapters] = useState<
    {
      chapterName: string;
      chapterNo: number;
    }[]
  >([
    {
      chapterName: "",
      chapterNo: (chaptersCount || subject.chapters?.length || 0) + 1,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentChaptersCount, setCurrentChaptersCount] = useState(
    chaptersCount || subject.chapters?.length || 0,
  );

  const addChapter = () => {
    const nextChapterNo =
      Math.max(...chapters.map(c => c.chapterNo), currentChaptersCount) + 1;
    setChapters(prev => [
      ...prev,
      { chapterName: "", chapterNo: nextChapterNo },
    ]);
  };

  const removeChapter = (index: number) => {
    if (chapters.length > 1) {
      setChapters(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateChapter = (
    index: number,
    field: "chapterName" | "chapterNo",
    value: string | number,
  ) => {
    setChapters(prev =>
      prev.map((chapter, i) =>
        i === index
          ? {
              ...chapter,
              [field]: field === "chapterNo" ? Number(value) : value,
            }
          : chapter,
      ),
    );
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    try {
      setIsSubmitting(true);

      // Validate all chapters
      const validChapters = chapters.filter(
        chapter =>
          chapter.chapterName.trim() !== "" &&
          chapter.chapterNo >= 1 &&
          chapter.chapterName.length <= 15,
      );

      if (validChapters.length === 0) {
        showToast.error("Please add at least one valid chapter");
        return;
      }

      // Check for duplicate chapter numbers
      const chapterNumbers = validChapters.map(c => c.chapterNo);
      const uniqueChapterNumbers = new Set(chapterNumbers);
      if (chapterNumbers.length !== uniqueChapterNumbers.size) {
        showToast.error("Chapter numbers must be unique");
        return;
      }

      // Validate chapter name length
      if (validChapters.some(chapter => chapter.chapterName.length > 15)) {
        showToast.error("Chapter name cannot exceed 15 characters");
        return;
      }

      // Make API call to add multiple chapters
      await subjectApis.addChaptersToSubject(subject.id, {
        chapters: validChapters,
      });

      showToast.success(
        `${validChapters.length} chapters created successfully!`,
      );

      // Update the local chapters count immediately
      setCurrentChaptersCount((prev: number) => prev + validChapters.length);

      // First notify about the new chapters, then handle success
      if (onChapterCreated) {
        onChapterCreated(validChapters);
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

        {/* Chapters */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--text)] uppercase tracking-wide">
              Chapters
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
            <button
              type="button"
              onClick={addChapter}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[var(--text-inverse)] bg-[var(--blue)] border border-[var(--blue)] rounded-[var(--radius-sm)] hover:bg-[var(--blue-dark)] hover:border-[var(--blue-dark)] transition-colors duration-[var(--duration)] cursor-pointer"
            >
              <Plus size={14} />
              Add Chapter
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
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
                  placeholder="Chapter name"
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
                <button
                  type="button"
                  onClick={() => removeChapter(index)}
                  disabled={chapters.length === 1}
                  className="w-8 h-8 flex items-center justify-center text-[var(--rose)] hover:text-[var(--rose-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {chapters.some(chapter => chapter.chapterName.trim() === "") && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              All chapter names must be filled
            </p>
          )}
          {chapters.some(chapter => chapter.chapterNo < 1) && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              All chapter numbers must be greater than 0
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
          {isSubmitting
            ? "Creating..."
            : `Create ${chapters.length} Chapter${chapters.length > 1 ? "s" : ""}`}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subjectApis, Subject, SubjectWithClasses } from "@/lib/api/Subject";
import {
  createSubjectSchema,
  updateSubjectSchema,
  CreateSubjectFormValues,
  UpdateSubjectFormValues,
} from "@/lib/validations/SubjectSchema";
import { showToast } from "@/lib/utils/Toast";

interface SubjectFormProps {
  initialData?: Subject | SubjectWithClasses;
  onSubmitSuccess?: () => void;
  onClose: () => void;
}

export default function SubjectForm({
  initialData,
  onSubmitSuccess,
  onClose,
}: SubjectFormProps) {
  const isEditMode = !!initialData;
  const [chapters, setChapters] = useState<
    { chapterName: string; chapterNo: number }[]
  >(
    isEditMode && initialData
      ? (initialData as SubjectWithClasses).chapters || []
      : [{ chapterName: "", chapterNo: 1 }],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateSubjectFormValues | UpdateSubjectFormValues>({
    resolver: zodResolver(
      isEditMode ? updateSubjectSchema : createSubjectSchema,
    ),
    defaultValues: {
      subjectName: initialData?.subjectName || "",
      subjectCode: initialData?.subjectCode || "",
      passingMarks: initialData?.passingMarks || 35,
      maxMarks: initialData?.maxMarks || 100,
      chapters: isEditMode
        ? (initialData as SubjectWithClasses).chapters || []
        : [{ chapterName: "", chapterNo: 1 }],
    },
  });

  useEffect(() => {
    if (initialData && (initialData as SubjectWithClasses).chapters) {
      reset({
        subjectName: initialData.subjectName || "",
        subjectCode: initialData.subjectCode || "",
        passingMarks: initialData.passingMarks || 35,
        maxMarks: initialData.maxMarks || 100,
        chapters: (initialData as SubjectWithClasses).chapters || [],
      });
      setChapters((initialData as SubjectWithClasses).chapters || []);
    }
  }, [initialData, reset]);

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
    setValue("chapters", newChapters);
  };

  const onSubmit = async (
    data: CreateSubjectFormValues | UpdateSubjectFormValues,
  ) => {
    try {
      setIsSubmitting(true);

      if (isEditMode && initialData?.id) {
        // For edit mode, include changed fields in the payload
        const changedFields: Partial<UpdateSubjectFormValues> = {};

        // Compare each field with initial data and only include if changed
        if (data.subjectName !== initialData.subjectName) {
          changedFields.subjectName = data.subjectName;
        }
        if (data.subjectCode !== initialData.subjectCode) {
          changedFields.subjectCode = data.subjectCode;
        }
        if (data.passingMarks !== initialData.passingMarks) {
          changedFields.passingMarks = data.passingMarks;
        }
        if (data.maxMarks !== initialData.maxMarks) {
          changedFields.maxMarks = data.maxMarks;
        }

        // Check if chapters have changed
        const initialChapters =
          (initialData as SubjectWithClasses).chapters || [];

        const currentChapters = chapters.filter(
          chapter => chapter.chapterName.trim() !== "",
        );

        // Simple comparison - check if length or any chapter details differ
        const chaptersChanged =
          initialChapters.length !== currentChapters.length ||
          initialChapters.some((initialChapter, index) => {
            const currentChapter = currentChapters[index];
            return (
              !currentChapter ||
              initialChapter.chapterNo !== currentChapter.chapterNo ||
              initialChapter.chapterName !== currentChapter.chapterName
            );
          });

        if (chaptersChanged) {
          changedFields.chapters = currentChapters.map((chapter, index) => {
            // Find corresponding original chapter to get its ID
            const originalChapter = initialChapters[index];
            return {
              id: originalChapter?.id, // Use ID from original chapter
              chapterName: chapter.chapterName,
              chapterNo: chapter.chapterNo,
            };
          });
        }

        // Only send update if there are actual changes
        if (Object.keys(changedFields).length === 0) {
          showToast.info("No changes detected");
          return;
        }

        await subjectApis.update(initialData.id, changedFields);
        showToast.success("Subject updated successfully!");
      } else {
        // For create mode, include all fields including chapters
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

        const submitData = {
          ...data,
          chapters: filteredChapters,
        };

        await subjectApis.create(submitData as CreateSubjectFormValues);
        showToast.success("Subject created successfully!");
      }

      onSubmitSuccess?.();
      onClose();
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-6">
        {/* Subject Name */}
        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Subject Name
            <span className="text-[var(--rose)] ml-0.5">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Mathematics, Science, English"
            {...register("subjectName")}
            className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
              errors.subjectName
                ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                : "border-[var(--border)]"
            }`}
          />
          {errors.subjectName && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              {errors.subjectName.message}
            </p>
          )}
        </div>

        {/* Subject Code */}
        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Subject Code
            <span className="text-[var(--rose)] ml-0.5">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. MATH102, SCI201"
            {...register("subjectCode")}
            className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
              errors.subjectCode
                ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                : "border-[var(--border)]"
            }`}
          />
          {errors.subjectCode && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              {errors.subjectCode.message}
            </p>
          )}
        </div>

        {/* Marks Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
              Passing Marks
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
            <input
              type="number"
              placeholder="35"
              min="1"
              {...register("passingMarks", {
                valueAsNumber: true,
              })}
              className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                errors.passingMarks
                  ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                  : "border-[var(--border)]"
              }`}
            />
            {errors.passingMarks && (
              <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                {errors.passingMarks.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
              Maximum Marks
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
            <input
              type="number"
              placeholder="100"
              min="1"
              {...register("maxMarks", {
                valueAsNumber: true,
              })}
              className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                errors.maxMarks
                  ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                  : "border-[var(--border)]"
              }`}
            />
            {errors.maxMarks && (
              <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                {errors.maxMarks.message}
              </p>
            )}
          </div>
        </div>

        {/* Chapters - Show in both create and edit modes */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
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
                  className="flex-1 px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] border-[var(--border)]"
                />
              </div>
            ))}
          </div>

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
          onClick={handleCancel}
          className="px-5 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] transition-colors duration-[var(--duration)] h-[52px] cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-5 h-auto py-2 text-sm rounded-[var(--radius-sm)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Subject"
              : "Create Subject"}
        </button>
      </div>
    </form>
  );
}

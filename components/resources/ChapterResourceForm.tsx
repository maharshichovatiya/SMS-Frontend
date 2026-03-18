"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createChapterResourceSchema,
  CreateChapterResourceFormValues,
} from "@/lib/validations/ChapterResourceSchema";
import { showToast } from "@/lib/utils/Toast";
import { FileText, Video, FileText as Notes, Link, Upload } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ChapterResourceFormProps {
  chapterId?: string;
  chapterName?: string;
  subjectName?: string;
  onSubmitSuccess?: () => void;
  onClose: () => void;
}

const resourceTypes = [
  { value: "PDF", label: "PDF Document", icon: FileText, color: "rose" },
  { value: "Video", label: "Video", icon: Video, color: "blue" },
  { value: "Notes", label: "Notes", icon: Notes, color: "amber" },
  { value: "Link", label: "Link", icon: Link, color: "green" },
];

// Custom Select Component with Icons
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    icon: LucideIcon;
    color: string;
  }>;
  placeholder: string;
  error?: string;
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  error,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);
  const SelectedIcon = selectedOption?.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] appearance-none cursor-pointer flex items-center justify-between ${
          error
            ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
            : "border-[var(--border)]"
        }`}
      >
        <div className="flex items-center gap-2">
          {SelectedIcon && <SelectedIcon className="w-4 h-4" />}
          <span className={selectedOption ? "" : "text-[var(--text-3)]"}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <svg
          className="w-4 h-4 text-[var(--text-3)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] shadow-lg max-h-60 overflow-auto">
          {options.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] flex items-center gap-2 transition-colors duration-[var(--duration)]"
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs font-medium text-[var(--rose)]">{error}</p>
      )}
    </div>
  );
}

export default function ChapterResourceForm({
  chapterId,
  chapterName,
  subjectName,
  onSubmitSuccess,
  onClose,
}: ChapterResourceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateChapterResourceFormValues>({
    resolver: zodResolver(createChapterResourceSchema),
    mode: "onSubmit",
    defaultValues: {
      chapterId: chapterId || "",
      resourceType: "PDF",
      status: "active" as const,
    },
  });

  const selectedResourceType = watch("resourceType");

  const onSubmit: SubmitHandler<
    CreateChapterResourceFormValues
  > = async data => {
    try {
      setIsSubmitting(true);

      // TODO: Replace with actual API call

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast.success("Resource uploaded successfully!");
      onSubmitSuccess?.();
      onClose();
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-6">
        {/* Chapter Info */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-2">
            Chapter Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                Chapter Name
              </label>
              <input
                type="text"
                value={chapterName || ""}
                disabled
                className="w-full px-3.5 py-2.5 text-sm text-[var(--text-3)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                Subject Name
              </label>
              <input
                type="text"
                value={subjectName || ""}
                disabled
                className="w-full px-3.5 py-2.5 text-sm text-[var(--text-3)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Resource Title */}
        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Resource Title
            <span className="text-[var(--rose)] ml-0.5">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter resource title"
            {...register("title")}
            className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
              errors.title
                ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                : "border-[var(--border)]"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Resource Type */}
        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Resource Type
            <span className="text-[var(--rose)] ml-0.5">*</span>
          </label>
          <CustomSelect
            value={selectedResourceType || ""}
            onChange={value =>
              setValue(
                "resourceType",
                value as "PDF" | "Video" | "Notes" | "Link",
              )
            }
            options={resourceTypes}
            placeholder="Select resource type"
            error={errors.resourceType?.message}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Description
          </label>
          <textarea
            placeholder="Enter resource description (optional)"
            rows={4}
            {...register("description")}
            className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] resize-vertical ${
              errors.description
                ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                : "border-[var(--border)]"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* File URL - Only show for Link type */}
        {selectedResourceType === "Link" && (
          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
              File URL
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/resource"
              {...register("fileUrl")}
              className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                errors.fileUrl
                  ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                  : "border-[var(--border)]"
              }`}
            />
            {errors.fileUrl && (
              <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                {errors.fileUrl.message}
              </p>
            )}
          </div>
        )}

        {/* File Upload - Show for non-Link types */}
        {selectedResourceType !== "Link" && (
          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
              Upload File
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
            <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-[var(--text-3)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text)]">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-[var(--text-3)]">
                {selectedResourceType === "PDF" && "PDF files only"}
                {selectedResourceType === "Video" && "MP4, AVI, MOV files"}
                {selectedResourceType === "Notes" && "TXT, DOC, DOCX files"}
              </p>
            </div>
          </div>
        )}

        {/* Hidden Fields */}
        <input type="hidden" {...register("chapterId")} />
        <input
          type="hidden"
          {...register("uploadedBy")}
          value="current-user-id"
        />
        <input type="hidden" {...register("status")} value="active" />
      </div>

      {/* Form Actions */}
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
          {isSubmitting ? "Uploading..." : "Upload Resource"}
        </button>
      </div>
    </form>
  );
}

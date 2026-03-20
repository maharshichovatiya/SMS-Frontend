"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createChapterResourceSchema,
  CreateChapterResourceFormValues,
} from "@/lib/validations/ChapterResourceSchema";
import { showToast } from "@/lib/utils/Toast";
import {
  FileText,
  FileText as Notes,
  Link,
  Upload,
  FileType,
  Presentation,
  Image,
  FileCode,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import {
  fetchSubjectsForHomework,
  selectHomeworkFormSubjects,
  selectHomeworkFormLoading,
  SubjectData,
} from "@/lib/store/HomeworkFormSlice";
import { subjectApis } from "@/lib/api/Subject";
import { Chapter } from "@/lib/types/SubjectTypes";
import { AppDispatch } from "@/lib/store/Index";
import { resourcesApis } from "@/lib/api/Resources";

const selectAuth = (state: {
  auth: {
    userId: string | null;
    schoolId: string | null;
    role: string | null;
    isAuthenticated: boolean;
  };
}) => state.auth;

interface ChapterResourceFormProps {
  chapterId?: string;
  chapterName?: string;
  subjectId?: string;
  subjectName?: string;
  onSubmitSuccess?: () => void;
  onClose: () => void;
}

const resourceTypes = [
  { value: "PDF", label: "PDF Document", icon: FileText, color: "rose" },
  { value: "Word", label: "Word Document", icon: FileType, color: "blue" },
  {
    value: "PowerPoint",
    label: "PowerPoint",
    icon: Presentation,
    color: "orange",
  },
  { value: "Image", label: "Image", icon: Image, color: "purple" },
  { value: "Text", label: "Text File", icon: FileCode, color: "gray" },
  { value: "Link", label: "Link", icon: Link, color: "green" },
  { value: "Notes", label: "Notes", icon: Notes, color: "amber" },
];

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
  chapterName: _chapterName,
  subjectId,
  subjectName: _subjectName,
  onSubmitSuccess,
  onClose,
}: ChapterResourceFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const subjects = useSelector(selectHomeworkFormSubjects);
  const reduxLoading = useSelector(selectHomeworkFormLoading);
  const auth = useSelector(selectAuth);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectId || "");
  const [selectedChapterId, setSelectedChapterId] = useState(chapterId || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchSubjectsForHomework());
  }, [dispatch]);

  useEffect(() => {
    const fetchChapters = async () => {
      if (selectedSubjectId) {
        try {
          setChaptersLoading(true);
          const chaptersData =
            await subjectApis.getChaptersBySubject(selectedSubjectId);
          const chaptersArray = Array.isArray(chaptersData) ? chaptersData : [];
          setChapters(chaptersArray);
        } catch (error) {
          setChapters([]);
        } finally {
          setChaptersLoading(false);
        }
      } else {
        setChapters([]);
      }
    };

    fetchChapters();
  }, [selectedSubjectId]);

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
      title: "",
      description: "",
      resourceType: "PDF",
      fileUrl: "",
      status: "active",
    },
  });

  const selectedResourceType = watch("resourceType");

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedChapterId("");
    setValue("chapterId", "");
  };

  const handleChapterChange = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setValue("chapterId", chapterId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0];
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB <= 50) {
        setSelectedFile(file);
      } else {
        showToast.error("File size must be less than 50MB");
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const onSubmit = async (data: CreateChapterResourceFormValues) => {
    if (!selectedChapterId) {
      showToast.error("Please select a chapter");
      return;
    }
    if (selectedResourceType !== "Link" && !selectedFile) {
      showToast.error("Please upload a file");
      return;
    }
    if (!auth.userId) {
      showToast.error("You must be logged in to upload resources");
      return;
    }

    try {
      setIsSubmitting(true);

      const resourceData = {
        chapterId: selectedChapterId,
        title: data.title,
        description: data.description,
        resourceType: data.resourceType,
        uploadedBy: auth.userId,
        file: selectedFile || undefined,
        fileUrl: selectedResourceType === "Link" ? data.fileUrl : undefined,
      };

      await resourcesApis.createResource(resourceData);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
              Subject
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
            <select
              value={selectedSubjectId}
              onChange={e => handleSubjectChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)]"
              disabled={reduxLoading.subjects}
            >
              <option value="">
                {reduxLoading.subjects
                  ? "Loading subjects..."
                  : "Select Subject"}
              </option>
              {Array.isArray(subjects) &&
                subjects.map((subject: SubjectData) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subjectName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
              Chapter
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
            <select
              value={selectedChapterId}
              onChange={e => handleChapterChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedSubjectId || chaptersLoading}
            >
              <option value="">
                {chaptersLoading ? "Loading chapters..." : "Select Chapter"}
              </option>
              {Array.isArray(chapters) &&
                chapters.map(chapter => (
                  <option key={chapter.id} value={chapter.id}>
                    Chapter {chapter.chapterNo}: {chapter.chapterName}
                  </option>
                ))}
            </select>
          </div>
        </div>

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

        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Resource Type
            <span className="text-[var(--rose)] ml-0.5">*</span>
          </label>
          <CustomSelect
            value={selectedResourceType || ""}
            onChange={value => {
              setValue(
                "resourceType",
                value as
                  | "PDF"
                  | "Word"
                  | "PowerPoint"
                  | "Image"
                  | "Text"
                  | "Link"
                  | "Notes",
              );
              setSelectedFile(null);
            }}
            options={resourceTypes}
            placeholder="Select resource type"
            error={errors.resourceType?.message}
          />
        </div>

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

        {selectedResourceType !== "Link" && (
          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
              Upload File
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>

            {selectedFile ? (
              <div className="flex items-center justify-between p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--blue)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-[var(--text-3)]">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-[var(--rose)] hover:text-[var(--rose)] text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept={
                    selectedResourceType === "PDF"
                      ? ".pdf"
                      : selectedResourceType === "Word"
                        ? ".doc,.docx"
                        : selectedResourceType === "PowerPoint"
                          ? ".ppt,.pptx"
                          : selectedResourceType === "Image"
                            ? ".jpg,.jpeg,.png,.gif,.webp"
                            : selectedResourceType === "Text"
                              ? ".txt"
                              : ".txt,.doc,.docx"
                  }
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-[var(--text-3)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--text)]">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-[var(--text-3)]">
                    {selectedResourceType === "PDF" &&
                      "PDF files only (max 50MB)"}
                    {selectedResourceType === "Word" &&
                      "Word documents (.doc, .docx) (max 50MB)"}
                    {selectedResourceType === "PowerPoint" &&
                      "PowerPoint files (.ppt, .pptx) (max 50MB)"}
                    {selectedResourceType === "Image" &&
                      "Image files (.jpg, .png, .gif) (max 50MB)"}
                    {selectedResourceType === "Text" &&
                      "Text files (.txt) (max 50MB)"}
                    {selectedResourceType === "Notes" &&
                      "Notes files (.txt, .doc, .docx) (max 50MB)"}
                  </p>
                </label>
              </div>
            )}
          </div>
        )}

        <input
          type="hidden"
          {...register("chapterId")}
          value={selectedChapterId}
        />
        <input type="hidden" {...register("status")} value="active" />
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
          {isSubmitting ? "Uploading..." : "Upload Resource"}
        </button>
      </div>
    </form>
  );
}

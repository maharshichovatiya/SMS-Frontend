"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/Index";
import { classApis, Class as ClassType } from "@/lib/api/Class";
import { getTeachersForAssignClass } from "@/lib/api/Teacher";
import { AssignTeacher } from "@/lib/store/TeacherSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createNoticeSchema,
  CreateNoticeFormValues,
} from "@/lib/validations/NoticeSchema";
import { showToast } from "@/lib/utils/Toast";
import { addNotice, editNotice } from "@/lib/store/NoticeSlice";
import type { AppDispatch } from "@/lib/store/Index";
import {
  Megaphone,
  FileText,
  Calendar,
  PartyPopper,
  AlertTriangle,
  Info,
  CheckCircle,
  Users,
  BookOpen,
  School,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

import { ApiNotice } from "@/lib/api/Notice";

interface NoticeFormProps {
  onSubmitSuccess?: () => void;
  onClose: () => void;
  initialData?: ApiNotice | null;
}

const noticeTypes = [
  { value: "general", label: "General", icon: Megaphone },
  { value: "exam", label: "Exam", icon: FileText },
  { value: "holiday", label: "Holiday", icon: Calendar },
  { value: "event", label: "Event", icon: PartyPopper },
];

const priorityLevels = [
  { value: "high", label: "High", icon: AlertTriangle },
  { value: "medium", label: "Medium", icon: Info },
  { value: "low", label: "Low", icon: CheckCircle },
];

const targetOptions = [
  { value: "school", label: "All School", icon: School },
  { value: "class", label: "Specific Classes", icon: BookOpen },
  { value: "teacher", label: "Specific Teachers", icon: Users },
];

// Custom Select Component with Icons
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; icon: LucideIcon }>;
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

export default function NoticeForm({
  onSubmitSuccess,
  onClose,
  initialData,
}: NoticeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const schoolId = useSelector((state: RootState) => state.auth.schoolId);

  const [classes, setClasses] = useState<ClassType[]>([]);
  const [teachers, setTeachers] = useState<AssignTeacher[]>([]);
  const [loadingTargets, setLoadingTargets] = useState(false);

  const getInitialTargetType = () => {
    if (
      !initialData ||
      !initialData.noticeTargets ||
      initialData.noticeTargets.length === 0
    )
      return undefined;
    const targetInfo = initialData.noticeTargets[0] as { targetType?: string };
    return targetInfo.targetType as "school" | "class" | "teacher" | undefined;
  };

  const getInitialTargetIds = () => {
    if (
      !initialData ||
      !initialData.noticeTargets ||
      initialData.noticeTargets.length === 0
    )
      return [];
    return initialData.noticeTargets.map(
      t => (t as { targetId: string }).targetId,
    );
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateNoticeFormValues>({
    resolver: zodResolver(createNoticeSchema),
    mode: "onSubmit",
    defaultValues: initialData
      ? {
          title: initialData.title,
          body: initialData.description,
          type: initialData.noticeType as
            | "general"
            | "exam"
            | "holiday"
            | "event",
          priority: initialData.priority,
          publishDate: initialData.publishDate.split("T")[0],
          expireDate: initialData.expiryDate.split("T")[0],
          targetType: getInitialTargetType(),
          targetIds: getInitialTargetIds(),
        }
      : undefined,
  });

  const selectedType = watch("type");
  const selectedPriority = watch("priority");
  const selectedTargetType = watch("targetType");
  const selectedTargetIds = watch("targetIds");

  useEffect(() => {
    const fetchTargets = async () => {
      if (selectedTargetType === "class" && classes.length === 0) {
        setLoadingTargets(true);
        try {
          const cls = await classApis.getAll();
          setClasses(cls);
        } catch {}
        setLoadingTargets(false);
      } else if (selectedTargetType === "teacher" && teachers.length === 0) {
        setLoadingTargets(true);
        try {
          const res = await getTeachersForAssignClass();
          if (res.success && res.data) setTeachers(res.data);
        } catch {}
        setLoadingTargets(false);
      }
    };
    fetchTargets();
  }, [selectedTargetType, classes.length, teachers.length]);

  const handleTargetToggle = (id: string) => {
    const current = selectedTargetIds || [];
    if (current.includes(id)) {
      setValue(
        "targetIds",
        current.filter((t: string) => t !== id),
      );
    } else {
      setValue("targetIds", [...current, id]);
    }
  };

  const onSubmit: SubmitHandler<CreateNoticeFormValues> = async data => {
    try {
      setIsSubmitting(true);

      // Map form data to API payload
      const noticeTargets =
        data.targetType === "school"
          ? [{ targetType: "school", targetId: schoolId || "" }]
          : (data.targetIds || []).map(id => ({
              targetType: data.targetType,
              targetId: id,
            }));

      if (
        data.targetType !== "school" &&
        (!data.targetIds || data.targetIds.length === 0)
      ) {
        showToast.error(`Please select at least one ${data.targetType}`);
        setIsSubmitting(false);
        return;
      }

      const apiPayload = {
        title: data.title,
        description: data.body,
        noticeType: data.type,
        priority: data.priority,
        publishDate: data.publishDate,
        expiryDate: data.expireDate,
        noticeTargets,
      };

      let result;
      if (initialData) {
        result = await dispatch(
          editNotice({ id: initialData.id, data: apiPayload }),
        );
        if (editNotice.fulfilled.match(result)) {
          showToast.success("Notice updated successfully!");
          onSubmitSuccess?.();
          onClose();
        } else {
          throw new Error(
            (result.payload as string) || "Failed to update notice",
          );
        }
      } else {
        result = await dispatch(addNotice(apiPayload));
        if (addNotice.fulfilled.match(result)) {
          showToast.success("Notice created successfully!");
          onSubmitSuccess?.();
          onClose();
        } else {
          throw new Error(
            (result.payload as string) || "Failed to create notice",
          );
        }
      }
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-6">
        {/* Target Audience */}
        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Target Audience
            <span className="text-[var(--rose)] ml-0.5">*</span>
          </label>
          <CustomSelect
            value={selectedTargetType || ""}
            onChange={value => {
              setValue("targetType", value as "school" | "class" | "teacher");
              setValue("targetIds", []);
            }}
            options={targetOptions}
            placeholder="Select target audience"
            error={errors.targetType?.message}
          />
        </div>

        {selectedTargetType === "class" && (
          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
              Select Classes
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
            {loadingTargets ? (
              <p className="text-sm text-[var(--text-3)]">Loading classes...</p>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-[var(--border)] rounded-[var(--radius-sm)] bg-[var(--surface-2)]">
                {classes.map(cls => (
                  <label
                    key={cls.id}
                    className="flex items-center p-3 border-b border-[var(--border)] hover:bg-[var(--surface)] cursor-pointer last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={(selectedTargetIds || []).includes(cls.id)}
                      onChange={() => handleTargetToggle(cls.id)}
                      className="w-4 h-4 text-[var(--primary)] border-[var(--border)] rounded focus:ring-[var(--primary)]"
                    />
                    <div className="ml-3 font-medium text-sm text-[var(--text)]">
                      Class {cls.className}{" "}
                      {cls.section ? `- ${cls.section}` : ""}
                    </div>
                  </label>
                ))}
              </div>
            )}
            {errors.targetIds && (
              <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                {errors.targetIds.message}
              </p>
            )}
          </div>
        )}

        {selectedTargetType === "teacher" && (
          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
              Select Teachers
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
            {loadingTargets ? (
              <p className="text-sm text-[var(--text-3)]">
                Loading teachers...
              </p>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-[var(--border)] rounded-[var(--radius-sm)] bg-[var(--surface-2)]">
                {teachers.map(teacher => (
                  <label
                    key={teacher.id}
                    className="flex items-center p-3 border-b border-[var(--border)] hover:bg-[var(--surface)] cursor-pointer last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={(selectedTargetIds || []).includes(teacher.id)}
                      onChange={() => handleTargetToggle(teacher.id)}
                      className="w-4 h-4 text-[var(--primary)] border-[var(--border)] rounded focus:ring-[var(--primary)]"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-sm text-[var(--text)]">
                        {teacher.user?.firstName} {teacher.user?.lastName}
                      </div>
                      <div className="text-xs text-[var(--text-3)]">
                        {teacher.employeeCode} • {teacher.department}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            {errors.targetIds && (
              <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                {errors.targetIds.message}
              </p>
            )}
          </div>
        )}

        {/* Notice Type */}
        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Notice Type
            <span className="text-[var(--rose)] ml-0.5">*</span>
          </label>
          <CustomSelect
            value={selectedType || ""}
            onChange={value =>
              setValue(
                "type",
                value as "general" | "exam" | "holiday" | "event",
              )
            }
            options={noticeTypes}
            placeholder="Select notice type"
            error={errors.type?.message}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Notice Title
            <span className="text-[var(--rose)] ml-0.5">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter notice title"
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
            Notice Content
            <span className="text-[var(--rose)] ml-0.5">*</span>
          </label>
          <textarea
            placeholder="Enter detailed notice content..."
            rows={5}
            {...register("body")}
            className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] resize-vertical ${
              errors.body
                ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                : "border-[var(--border)]"
            }`}
          />
          {errors.body && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              {errors.body.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Priority Level
            <span className="text-[var(--rose)] ml-0.5">*</span>
          </label>
          <CustomSelect
            value={selectedPriority || ""}
            onChange={value =>
              setValue("priority", value as "high" | "medium" | "low")
            }
            options={priorityLevels}
            placeholder="Select priority level"
            error={errors.priority?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
              Publish Date
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
            <input
              type="date"
              min={getTodayDate()}
              {...register("publishDate")}
              className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                errors.publishDate
                  ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                  : "border-[var(--border)]"
              }`}
            />
            {errors.publishDate && (
              <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                {errors.publishDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
              Expiry Date
              <span className="text-[var(--rose)] ml-0.5">*</span>
            </label>
            <input
              type="date"
              min={getTomorrowDate()}
              {...register("expireDate")}
              className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                errors.expireDate
                  ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                  : "border-[var(--border)]"
              }`}
            />
            {errors.expireDate && (
              <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                {errors.expireDate.message}
              </p>
            )}
          </div>
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
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
              ? "Update Notice"
              : "Post Notice"}
        </button>
      </div>
    </form>
  );
}

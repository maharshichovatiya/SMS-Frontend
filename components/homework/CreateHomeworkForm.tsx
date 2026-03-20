"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { subjectApis } from "@/lib/api/Subject";
import { Chapter } from "@/lib/types/SubjectTypes";
import {
  fetchSubjectsForHomework,
  fetchClassesForHomework,
  fetchStudentsForHomework,
  selectHomeworkFormSubjects,
  selectHomeworkFormClasses,
  selectHomeworkFormStudents,
  selectHomeworkFormLoading,
  ClassData,
  StudentData,
  SubjectData,
} from "@/lib/store/HomeworkFormSlice";
import { AppDispatch } from "@/lib/store/Index";
import {
  homeworkFormSchema,
  editHomeworkFormSchema,
  HomeworkFormValues,
  EditHomeworkFormValues,
} from "@/lib/validations/HomeworkSchema";

interface HomeworkData {
  title: string;
  description: string;
  subjectId: string;
  chapterId?: string;
  assignedTo: "singleClass" | "singleStudent" | "multipleStudents";
  selectedClass: string;
  selectedClasses: string[];
  selectedGroup: string;
  selectedStudents: string[];
  dueDate: string;
  attachments: (string | File)[];
  allowLateSubmission?: boolean;
  maxFileSize?: number;
}

interface CreateHomeworkFormProps {
  onClose: () => void;
  onSubmit: (homeworkData: HomeworkData) => void;
  loading?: boolean;
  error?: string | null;
  editingHomework?: HomeworkData | null;
}

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const inputCls = (hasError: boolean) =>
  `w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
    hasError
      ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
      : "border-[var(--border)]"
  }`;

const labelCls =
  "block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide";

const errorCls = "mt-1 text-xs font-medium text-[var(--rose)]";

export const CreateHomeworkForm: React.FC<CreateHomeworkFormProps> = ({
  onClose,
  onSubmit,
  loading = false,
  editingHomework = null,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isEditMode = !!editingHomework;

  const subjects = useSelector(selectHomeworkFormSubjects);
  const classes = useSelector(selectHomeworkFormClasses);
  const students = useSelector(selectHomeworkFormStudents);
  const reduxLoading = useSelector(selectHomeworkFormLoading);

  // Attachments are managed outside RHF (File objects can't be in RHF state)
  const [attachments, setAttachments] = useState<(string | File)[]>(
    editingHomework?.attachments || [],
  );
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);

  const schema = isEditMode ? editHomeworkFormSchema : homeworkFormSchema;

  type FormValues = typeof isEditMode extends true
    ? EditHomeworkFormValues
    : HomeworkFormValues;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HomeworkFormValues | EditHomeworkFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: editingHomework?.title || "",
      description: editingHomework?.description || "",
      subjectId: editingHomework?.subjectId || "",
      chapterId: editingHomework?.chapterId || "",
      assignedTo: editingHomework?.assignedTo || "singleClass",
      selectedClass: editingHomework?.selectedClass || "",
      selectedClasses: editingHomework?.selectedClasses || [],
      selectedGroup: editingHomework?.selectedGroup || "",
      selectedStudents: editingHomework?.selectedStudents || [],
      dueDate: editingHomework?.dueDate
        ? editingHomework.dueDate.split("T")[0]
        : getTodayDate(),
    } as HomeworkFormValues,
    mode: "onSubmit",
  });

  const watchedSubjectId = watch("subjectId" as keyof HomeworkFormValues);
  const watchedAssignedTo = watch(
    "assignedTo" as keyof HomeworkFormValues,
  ) as string;
  const watchedSelectedClass = watch(
    "selectedClass" as keyof HomeworkFormValues,
  ) as string;
  const watchedSelectedStudents = watch(
    "selectedStudents" as keyof HomeworkFormValues,
  ) as string[];

  useEffect(() => {
    dispatch(fetchSubjectsForHomework());
    dispatch(fetchClassesForHomework());
    dispatch(fetchStudentsForHomework());
  }, [dispatch]);

  useEffect(() => {
    const fetchChapters = async () => {
      if (watchedSubjectId && !isEditMode) {
        try {
          setChaptersLoading(true);
          const data = await subjectApis.getChaptersBySubject(watchedSubjectId);
          setChapters(Array.isArray(data) ? data : []);
        } catch {
          setChapters([]);
        } finally {
          setChaptersLoading(false);
        }
      } else {
        setChapters([]);
      }
    };
    fetchChapters();
  }, [watchedSubjectId, isEditMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      f => f.size / (1024 * 1024) <= 10,
    );
    setAttachments(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleStudentToggle = (studentId: string) => {
    const current = (watchedSelectedStudents as string[]) || [];
    const updated = current.includes(studentId)
      ? current.filter(id => id !== studentId)
      : [...current, studentId];
    setValue("selectedStudents" as keyof HomeworkFormValues, updated as never);
  };

  const onFormSubmit = (data: HomeworkFormValues | EditHomeworkFormValues) => {
    const payload: HomeworkData = {
      title: data.title,
      description: data.description,
      subjectId:
        (data as HomeworkFormValues).subjectId ||
        editingHomework?.subjectId ||
        "",
      chapterId: (data as HomeworkFormValues).chapterId,
      assignedTo: (data as HomeworkFormValues).assignedTo || "singleClass",
      selectedClass: (data as HomeworkFormValues).selectedClass || "",
      selectedClasses: (data as HomeworkFormValues).selectedClasses || [],
      selectedGroup: (data as HomeworkFormValues).selectedGroup || "",
      selectedStudents: (data as HomeworkFormValues).selectedStudents || [],
      dueDate: data.dueDate,
      attachments,
    };
    onSubmit(payload);
  };
  const filteredStudents = students.filter((s: StudentData) =>
    watchedSelectedClass ? s.classId === watchedSelectedClass : true,
  );

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[var(--z-modal)]">
        <div
          className="absolute inset-0 bg-[rgba(17,24,39,0.45)] backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="bg-white border border-[var(--border)] rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative pointer-events-auto">
          <div className="relative p-6 border-b border-[var(--border)]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="pr-12">
              <h2 className="text-xl font-semibold text-[var(--text)] mb-1">
                {isEditMode ? "Edit Homework" : "Create Homework"}
              </h2>
              <p className="text-sm text-[var(--text-3)]">
                {isEditMode
                  ? "Update homework details"
                  : "Assign homework to classes, groups, or individual students"}
              </p>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-6">
            <form
              onSubmit={handleSubmit(onFormSubmit)}
              noValidate
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--text)] pb-2 border-b border-[var(--border)] uppercase tracking-wide">
                  Basic Information
                </h3>

                <div>
                  <label className={labelCls}>
                    Homework Title <span className="text-[var(--rose)]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter homework title"
                    {...register("title")}
                    className={inputCls(!!errors.title)}
                  />
                  {errors.title && (
                    <p className={errorCls}>{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>
                    Description <span className="text-[var(--rose)]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter homework description"
                    {...register("description")}
                    className={`${inputCls(!!errors.description)} resize-none`}
                  />
                  {errors.description && (
                    <p className={errorCls}>{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Attachments</label>
                  <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center text-[var(--text-3)] hover:text-[var(--text-2)]"
                    >
                      <svg
                        className="w-8 h-8 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="text-sm">Click to upload files</span>
                      <span className="text-xs mt-1">Max file size: 10 MB</span>
                    </label>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-wide">
                        Attached Files ({attachments.length})
                      </h4>
                      {attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-[var(--surface-2)] rounded border border-[var(--border)]"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <svg
                              className="w-4 h-4 text-[var(--text-3)] flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="text-sm text-[var(--text)] truncate">
                              {typeof file === "string" ? file : file.name}
                            </span>
                            <span className="text-xs text-[var(--text-3)] flex-shrink-0">
                              (
                              {typeof file === "string"
                                ? "—"
                                : (file.size / (1024 * 1024)).toFixed(2)}{" "}
                              MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="text-[var(--rose)] hover:text-[var(--rose-dark)] text-xs font-medium ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {!isEditMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>
                        Subject <span className="text-[var(--rose)]">*</span>
                      </label>
                      <select
                        {...register("subjectId")}
                        disabled={reduxLoading.subjects}
                        className={inputCls(
                          !!(errors as Record<string, { message?: string }>)
                            .subjectId,
                        )}
                      >
                        <option value="">
                          {reduxLoading.subjects
                            ? "Loading subjects…"
                            : "Select Subject"}
                        </option>
                        {Array.isArray(subjects) &&
                          subjects.map((s: SubjectData) => (
                            <option key={s.id} value={s.id}>
                              {s.subjectName}
                            </option>
                          ))}
                      </select>
                      {(errors as Record<string, { message?: string }>)
                        .subjectId && (
                        <p className={errorCls}>
                          {
                            (errors as Record<string, { message?: string }>)
                              .subjectId?.message
                          }
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelCls}>Chapter (Optional)</label>
                      <select
                        {...register("chapterId")}
                        disabled={!watchedSubjectId || chaptersLoading}
                        className={inputCls(false)}
                      >
                        <option value="">
                          {chaptersLoading
                            ? "Loading chapters…"
                            : "Select Chapter"}
                        </option>
                        {chapters.map(ch => (
                          <option key={ch.id} value={ch.id}>
                            Chapter {ch.chapterNo}: {ch.chapterName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>
                      Due Date <span className="text-[var(--rose)]">*</span>
                    </label>
                    <input
                      type="date"
                      min={getTodayDate()}
                      {...register("dueDate")}
                      className={inputCls(!!errors.dueDate)}
                    />
                    {errors.dueDate && (
                      <p className={errorCls}>{errors.dueDate.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {!isEditMode && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text)] pb-2 border-b border-[var(--border)] uppercase tracking-wide">
                    Assignment Settings
                  </h3>

                  <div>
                    <label className={labelCls}>
                      Assign To <span className="text-[var(--rose)]">*</span>
                    </label>
                    <Controller
                      name={"assignedTo" as keyof HomeworkFormValues}
                      control={control as never}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {(
                            [
                              "singleClass",
                              "singleStudent",
                              "multipleStudents",
                            ] as const
                          ).map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => field.onChange(opt)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                field.value === opt
                                  ? "bg-[var(--blue)] text-white"
                                  : "bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--bg-2)]"
                              }`}
                            >
                              {opt === "singleClass"
                                ? "Single Class"
                                : opt === "singleStudent"
                                  ? "Single Student"
                                  : "Multiple Students"}
                            </button>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  {watchedAssignedTo === "singleClass" && (
                    <div>
                      <label className={labelCls}>
                        Select Class{" "}
                        <span className="text-[var(--rose)]">*</span>
                      </label>
                      <Controller
                        name={"selectedClass" as keyof HomeworkFormValues}
                        control={control as never}
                        render={({ field }) =>
                          classes.length === 0 ? (
                            <div className="text-center py-4 text-[var(--text-3)] text-sm">
                              {reduxLoading.classes
                                ? "Loading classes…"
                                : "No classes available"}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {classes.map((cls: ClassData) => (
                                <button
                                  key={cls.id}
                                  type="button"
                                  onClick={() => field.onChange(cls.id)}
                                  className={`p-3 rounded-lg border text-left transition-colors ${
                                    field.value === cls.id
                                      ? "border-[var(--blue)] bg-[var(--blue-light)]"
                                      : "border-[var(--border)] hover:border-[var(--border-focus)]"
                                  }`}
                                >
                                  <div className="font-medium text-[var(--text)] text-sm">
                                    {cls.name}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )
                        }
                      />
                      {(errors as Record<string, { message?: string }>)
                        .selectedClass && (
                        <p className={errorCls}>
                          {
                            (errors as Record<string, { message?: string }>)
                              .selectedClass?.message
                          }
                        </p>
                      )}
                    </div>
                  )}

                  {(watchedAssignedTo === "singleStudent" ||
                    watchedAssignedTo === "multipleStudents") && (
                    <div>
                      <label className={labelCls}>
                        Filter by Class (Optional)
                      </label>
                      <Controller
                        name={"selectedClass" as keyof HomeworkFormValues}
                        control={control as never}
                        render={({ field }) => (
                          <select
                            value={field.value as string}
                            onChange={e => field.onChange(e.target.value)}
                            className={`${inputCls(false)} mb-4`}
                          >
                            <option value="">All Classes</option>
                            {classes.map((cls: ClassData) => (
                              <option key={cls.id} value={cls.id}>
                                {cls.name}
                              </option>
                            ))}
                          </select>
                        )}
                      />

                      <label className={labelCls}>
                        Select Students{" "}
                        <span className="text-[var(--rose)]">*</span>
                      </label>

                      {students.length === 0 ? (
                        <div className="text-center py-4 text-[var(--text-3)] text-sm">
                          {reduxLoading.students
                            ? "Loading students…"
                            : "No students available"}
                        </div>
                      ) : filteredStudents.length === 0 ? (
                        <div className="text-center py-4 text-[var(--text-3)] text-sm">
                          No students found for selected class
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto border border-[var(--border)] rounded-lg">
                          {filteredStudents.map((student: StudentData) => (
                            <label
                              key={student.id}
                              className="flex items-center p-3 border-b border-[var(--border)] hover:bg-[var(--surface-2)] cursor-pointer last:border-b-0"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  Array.isArray(watchedSelectedStudents) &&
                                  watchedSelectedStudents.includes(student.id)
                                }
                                onChange={() => handleStudentToggle(student.id)}
                                className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded"
                              />
                              <div className="ml-3">
                                <div className="font-medium text-[var(--text)] text-sm">
                                  {student.name}
                                </div>
                                <div className="text-xs text-[var(--text-3)]">
                                  {classes.find(
                                    (c: ClassData) => c.id === student.classId,
                                  )?.name || "No class"}
                                </div>
                                {student.email && (
                                  <div className="text-xs text-[var(--text-3)]">
                                    {student.email}
                                  </div>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      )}

                      {(errors as Record<string, { message?: string }>)
                        .selectedStudents && (
                        <p className={errorCls}>
                          {
                            (errors as Record<string, { message?: string }>)
                              .selectedStudents?.message
                          }
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="flex items-center gap-2 px-6 py-2 btn-primary text-sm font-semibold rounded-[var(--radius-sm)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting || loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {isEditMode ? "Updating…" : "Creating…"}
                    </>
                  ) : (
                    <>{isEditMode ? "Update Homework" : "Create Homework"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

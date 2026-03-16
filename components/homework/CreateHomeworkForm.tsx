"use client";

import React, { useState } from "react";

interface CreateHomeworkFormProps {
  onClose: () => void;
  onSubmit: (homeworkData: HomeworkData) => void;
  subjects?: string[];
  chapters?: Array<{ id: string; chapterName: string; chapterNo: number }>;
  classes?: Array<{
    id: string;
    name: string;
    className: string;
    section: string;
  }>;
  students?: Array<{
    id: string;
    name: string;
    classId: string | null;
    email: string;
  }>;
  loading?: boolean;
  error?: string | null;
  editingHomework?: HomeworkData | null;
}

interface HomeworkData {
  title: string;
  description: string;
  instructions: string;
  subject: string;
  chapterId?: string;
  assignedTo:
    | "singleClass"
    | "multipleClasses"
    | "allClasses"
    | "singleStudent"
    | "multipleStudents";
  selectedClass: string;
  selectedClasses: string[];
  selectedGroup: string;
  selectedStudents: string[];
  dueDate: string;
  maxFileSize: number;
  allowLateSubmission: boolean;
  attachments: (string | File)[];
}

const mockClasses = [
  { id: "1", name: "Class 10-A" },
  { id: "2", name: "Class 10-B" },
  { id: "3", name: "Class 9-A" },
  { id: "4", name: "Class 9-B" },
  { id: "5", name: "Class 11-C" },
];

const mockGroups = [
  { id: "1", name: "Science Group", classId: "1" },
  { id: "2", name: "Math Group", classId: "1" },
  { id: "3", name: "English Group", classId: "2" },
  { id: "4", name: "Physics Group", classId: "3" },
];

const mockStudents = [
  { id: "1", name: "Arjun Kumar", classId: "1", groupId: "1" },
  { id: "2", name: "Priya Shah", classId: "1", groupId: "1" },
  { id: "3", name: "Divya Mehta", classId: "1", groupId: "2" },
  { id: "4", name: "Kavya Patel", classId: "2", groupId: "3" },
  { id: "5", name: "Rohan Desai", classId: "2", groupId: "3" },
  { id: "6", name: "Sneha Iyer", classId: "3", groupId: "4" },
];

const mockSubjects = [
  "Mathematics",
  "Science",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "Geography",
];

export const CreateHomeworkForm: React.FC<CreateHomeworkFormProps> = ({
  onClose,
  onSubmit,
  subjects = mockSubjects,
  chapters = [],
  classes = mockClasses,
  students = mockStudents,
  loading = false,
  error: _error = null,
  editingHomework = null,
}) => {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState<HomeworkData>({
    title: editingHomework?.title || "",
    description: editingHomework?.description || "",
    instructions: editingHomework?.instructions || "",
    subject: editingHomework?.subject || "",
    chapterId: editingHomework?.chapterId || "",
    assignedTo: editingHomework?.assignedTo || "singleClass",
    selectedClass: editingHomework?.selectedClass || "",
    selectedClasses: editingHomework?.selectedClasses || [],
    selectedGroup: editingHomework?.selectedGroup || "",
    selectedStudents: editingHomework?.selectedStudents || [],
    dueDate: editingHomework?.dueDate || "",
    maxFileSize: editingHomework?.maxFileSize || 10,
    allowLateSubmission:
      editingHomework?.allowLateSubmission !== undefined
        ? editingHomework.allowLateSubmission
        : true,
    attachments: [],
  });

  const [errors, setErrors] = useState<Partial<HomeworkData>>({});

  const handleInputChange = (
    field: keyof HomeworkData,
    value: string | number | boolean | string[] | File[],
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleStudentToggle = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentId)
        ? prev.selectedStudents.filter(id => id !== studentId)
        : [...prev.selectedStudents, studentId],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const fileSizeMB = file.size / (1024 * 1024);
      return fileSizeMB <= formData.maxFileSize;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles],
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<HomeworkData> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.instructions.trim())
      newErrors.instructions = "Instructions are required";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";

    if (formData.assignedTo === "singleClass" && !formData.selectedClass) {
      newErrors.selectedClass = "Please select a class";
    }
    if (
      formData.assignedTo === "multipleClasses" &&
      formData.selectedClasses.length === 0
    ) {
      (newErrors as Partial<HomeworkData>).selectedClasses = [
        "Please select at least one class",
      ];
    }
    if (
      formData.assignedTo === "multipleStudents" &&
      formData.selectedStudents.length === 0
    ) {
      newErrors.selectedGroup = "Please select a group";
    }
    if (
      formData.assignedTo === "singleStudent" &&
      formData.selectedStudents.length === 0
    ) {
      newErrors.selectedStudents = ["Please select at least one student"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const _filteredGroups = mockGroups.filter(group =>
    formData.selectedClass ? group.classId === formData.selectedClass : true,
  );

  const filteredStudents = students.filter(student => {
    if (formData.selectedClass && student.classId !== formData.selectedClass) {
      return false;
    }
    return true;
  });

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[var(--z-modal)]">
        <div
          className="absolute inset-0 bg-[rgba(17,24,39,0.45)] backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative pointer-events-auto">
          <div className="relative p-6 border-b border-gray-100">
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {editingHomework ? "Edit Homework" : "Create Homework"}
              </h2>
              <p className="text-sm text-gray-600">
                {editingHomework
                  ? "Update homework details"
                  : "Assign homework to classes, groups, or individual students"}
              </p>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Homework Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => handleInputChange("title", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter homework title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter homework description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions *
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={e =>
                      handleInputChange("instructions", e.target.value)
                    }
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.instructions ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter detailed instructions for the homework"
                  />
                  {errors.instructions && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.instructions}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
                      className="cursor-pointer flex flex-col items-center justify-center text-gray-600 hover:text-gray-800"
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
                      <span className="text-xs text-gray-500">
                        Max file size: {formData.maxFileSize}MB
                      </span>
                    </label>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Attached Files ({formData.attachments.length})
                      </h4>
                      {formData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                        >
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4 text-gray-500"
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
                            <span className="text-sm text-gray-700 truncate">
                              {typeof file === "string" ? file : file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              (
                              {typeof file === "string"
                                ? "0"
                                : (file.size / (1024 * 1024)).toFixed(2)}{" "}
                              MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={e =>
                        handleInputChange("subject", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.subject ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject, index) => (
                        <option
                          key={`subject-${index}-${subject}`}
                          value={subject}
                        >
                          {subject}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chapter (Optional)
                    </label>
                    <select
                      value={formData.chapterId || ""}
                      onChange={e =>
                        handleInputChange("chapterId", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Chapter</option>
                      {chapters.map(chapter => (
                        <option key={chapter.id} value={chapter.id}>
                          Chapter {chapter.chapterNo}: {chapter.chapterName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      min={getTodayDate()}
                      onChange={e =>
                        handleInputChange("dueDate", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.dueDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.dueDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dueDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
                  Assignment Settings
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {(
                      [
                        "singleClass",
                        "multipleClasses",
                        "allClasses",
                        "singleStudent",
                        "multipleStudents",
                      ] as const
                    ).map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleInputChange("assignedTo", option)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.assignedTo === option
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {option === "singleClass"
                          ? "Single Class"
                          : option === "multipleClasses"
                            ? "Multiple Classes"
                            : option === "allClasses"
                              ? "All Classes"
                              : option === "singleStudent"
                                ? "Single Student"
                                : "Multiple Students"}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.assignedTo === "singleClass" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Class *
                    </label>
                    {classes.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        {loading
                          ? "Loading classes..."
                          : "No classes available"}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {classes.map(cls => (
                          <button
                            key={cls.id}
                            type="button"
                            onClick={() =>
                              handleInputChange("selectedClass", cls.id)
                            }
                            className={`p-3 rounded-lg border text-left transition-colors ${
                              formData.selectedClass === cls.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <div className="font-medium text-gray-900">
                              {cls.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.selectedClass && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.selectedClass}
                      </p>
                    )}
                  </div>
                )}

                {formData.assignedTo === "multipleClasses" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Multiple Classes *
                    </label>
                    {classes.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        {loading
                          ? "Loading classes..."
                          : "No classes available"}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3">
                        {classes.map(cls => (
                          <label
                            key={cls.id}
                            className="flex items-center p-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedClasses.includes(
                                cls.id,
                              )}
                              onChange={e => {
                                if (e.target.checked) {
                                  handleInputChange("selectedClasses", [
                                    ...formData.selectedClasses,
                                    cls.id,
                                  ]);
                                } else {
                                  handleInputChange(
                                    "selectedClasses",
                                    formData.selectedClasses.filter(
                                      id => id !== cls.id,
                                    ),
                                  );
                                }
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">
                                {cls.name}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                    {formData.selectedClasses.length === 0 && (
                      <p className="text-red-500 text-sm mt-1">
                        Please select at least one class
                      </p>
                    )}
                  </div>
                )}

                {formData.assignedTo === "singleStudent" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Class (Optional)
                    </label>
                    <select
                      value={formData.selectedClass}
                      onChange={e =>
                        handleInputChange("selectedClass", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    >
                      <option value="">All Classes</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Students *
                    </label>

                    {students.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        {loading
                          ? "Loading students..."
                          : "No students available"}
                      </div>
                    ) : filteredStudents.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No students found for the selected class
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
                        {filteredStudents.map(student => (
                          <label
                            key={student.id}
                            className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedStudents.includes(
                                student.id,
                              )}
                              onChange={() => handleStudentToggle(student.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {(
                                  student as {
                                    className?: string;
                                    section?: string;
                                    email?: string;
                                  }
                                ).className &&
                                (
                                  student as {
                                    className?: string;
                                    section?: string;
                                    email?: string;
                                  }
                                ).section
                                  ? `${(student as { className?: string; section?: string; email?: string }).className} - ${(student as { className?: string; section?: string; email?: string }).section}`
                                  : classes.find(c => c.id === student.classId)
                                      ?.name || "No class"}
                              </div>
                              {(student as { email?: string }).email && (
                                <div className="text-xs text-gray-400">
                                  {(student as { email?: string }).email}
                                </div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                    {errors.selectedStudents &&
                      Array.isArray(errors.selectedStudents) && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.selectedStudents[0]}
                        </p>
                      )}
                  </div>
                )}

                {formData.assignedTo === "multipleStudents" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Class (Optional)
                    </label>
                    <select
                      value={formData.selectedClass}
                      onChange={e =>
                        handleInputChange("selectedClass", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    >
                      <option value="">All Classes</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Students *
                    </label>
                    {filteredStudents.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No students available
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3">
                        {filteredStudents.map(student => (
                          <label
                            key={student.id}
                            className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedStudents.includes(
                                student.id,
                              )}
                              onChange={() => handleStudentToggle(student.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {(
                                  student as {
                                    className?: string;
                                    section?: string;
                                    email?: string;
                                  }
                                ).className &&
                                (
                                  student as {
                                    className?: string;
                                    section?: string;
                                    email?: string;
                                  }
                                ).section
                                  ? `${(student as { className?: string; section?: string; email?: string }).className} - ${(student as { className?: string; section?: string; email?: string }).section}`
                                  : classes.find(c => c.id === student.classId)
                                      ?.name || "No class"}
                              </div>
                              {(student as { email?: string }).email && (
                                <div className="text-xs text-gray-400">
                                  {(student as { email?: string }).email}
                                </div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                    {errors.selectedStudents &&
                      Array.isArray(errors.selectedStudents) && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.selectedStudents[0]}
                        </p>
                      )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
                  Additional Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max File Size (MB)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.maxFileSize}
                      onChange={e =>
                        handleInputChange(
                          "maxFileSize",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowLate"
                      checked={formData.allowLateSubmission}
                      onChange={e =>
                        handleInputChange(
                          "allowLateSubmission",
                          e.target.checked,
                        )
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="allowLate"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Allow Late Submission
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingHomework ? "Update Homework" : "Create Homework"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

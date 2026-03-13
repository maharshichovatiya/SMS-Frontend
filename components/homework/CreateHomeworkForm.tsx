"use client";

import React, { useState } from "react";

interface CreateHomeworkFormProps {
  onClose: () => void;
  onSubmit: (homeworkData: HomeworkData) => void;
}

interface HomeworkData {
  title: string;
  description: string;
  subject: string;
  assignedTo: "class" | "group" | "student" | "all";
  selectedClass: string;
  selectedGroup: string;
  selectedStudents: string[];
  dueDate: string;
  maxFileSize: number;
  allowLateSubmission: boolean;
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
}) => {
  const [formData, setFormData] = useState<HomeworkData>({
    title: "",
    description: "",
    subject: "",
    assignedTo: "class",
    selectedClass: "",
    selectedGroup: "",
    selectedStudents: [],
    dueDate: "",
    maxFileSize: 10,
    allowLateSubmission: true,
  });

  const [errors, setErrors] = useState<Partial<HomeworkData>>({});

  const handleInputChange = (
    field: keyof HomeworkData,
    value: string | number | boolean | string[],
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

  const validateForm = () => {
    const newErrors: Partial<HomeworkData> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";

    if (formData.assignedTo === "class" && !formData.selectedClass) {
      newErrors.selectedClass = "Please select a class";
    }
    if (formData.assignedTo === "group" && !formData.selectedGroup) {
      newErrors.selectedGroup = "Please select a group";
    }
    if (
      formData.assignedTo === "student" &&
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

  const filteredGroups = mockGroups.filter(group =>
    formData.selectedClass ? group.classId === formData.selectedClass : true,
  );

  const filteredStudents = mockStudents.filter(student => {
    if (formData.selectedClass && student.classId !== formData.selectedClass)
      return false;
    if (formData.selectedGroup && student.groupId !== formData.selectedGroup)
      return false;
    return true;
  });

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm z-[350] pointer-events-none" />

      <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
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
                Create Homework
              </h2>
              <p className="text-sm text-gray-600">
                Assign homework to classes, groups, or individual students
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
                      {mockSubjects.map(subject => (
                        <option key={subject} value={subject}>
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
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(["class", "group", "student", "all"] as const).map(
                      option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            handleInputChange("assignedTo", option)
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            formData.assignedTo === option
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {option === "all"
                            ? "All Classes"
                            : option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {formData.assignedTo === "class" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Class *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mockClasses.map(cls => (
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
                    {errors.selectedClass && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.selectedClass}
                      </p>
                    )}
                  </div>
                )}

                {formData.assignedTo === "group" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Class First
                    </label>
                    <select
                      value={formData.selectedClass}
                      onChange={e =>
                        handleInputChange("selectedClass", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    >
                      <option value="">Select Class</option>
                      {mockClasses.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>

                    {formData.selectedClass && (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Group *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredGroups.map(group => (
                            <button
                              key={group.id}
                              type="button"
                              onClick={() =>
                                handleInputChange("selectedGroup", group.id)
                              }
                              className={`p-3 rounded-lg border text-left transition-colors ${
                                formData.selectedGroup === group.id
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <div className="font-medium text-gray-900">
                                {group.name}
                              </div>
                            </button>
                          ))}
                        </div>
                        {errors.selectedGroup && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.selectedGroup}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}

                {formData.assignedTo === "student" && (
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
                      {mockClasses.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>

                    {formData.selectedClass && (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Filter by Group (Optional)
                        </label>
                        <select
                          value={formData.selectedGroup}
                          onChange={e =>
                            handleInputChange("selectedGroup", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        >
                          <option value="">All Groups</option>
                          {filteredGroups.map(group => (
                            <option key={group.id} value={group.id}>
                              {group.name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Students *
                    </label>
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
                              {
                                mockClasses.find(c => c.id === student.classId)
                                  ?.name
                              }
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
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
                  Create Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

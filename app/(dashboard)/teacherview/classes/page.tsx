"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, Building, Eye, Edit, Award } from "lucide-react";
import {
  fetchAssignSubjectData,
  clearError,
} from "@/lib/store/AssignSubjectSlice";
import { RootState, AppDispatch } from "@/lib/store/Index";
import { showToast } from "@/lib/utils/Toast";
import CommonTeacherHeader from "@/components/layout/CommonTeacherHeader";

export default function AssignSubject() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.assignSubject,
  );
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAssignSubjectData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (loading) {
    return null;
  }

  return (
    <CommonTeacherHeader
      title="Assign Classes & Subjects"
      subtitle="Manage and view subject assignments efficiently"
      useApiData={false}
      userRole="teacher"
    >
      {!data?.subjectsByClass || data.subjectsByClass.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] p-16 text-center">
          <div className="w-20 h-20 bg-[var(--blue-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-[var(--blue)]" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--text)] mb-3">
            No Subject Assignments
          </h3>
          <p className="text-[var(--text-2)] max-w-md mx-auto">
            No subject assignments found. Start by assigning subjects to
            classes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-[var(--blue)]" />
                Classes
              </h3>
              <div className="space-y-3">
                {data.subjectsByClass.map((classData, index) => (
                  <div
                    key={classData.classId}
                    onClick={() =>
                      setSelectedClass(
                        selectedClass === classData.classId
                          ? null
                          : classData.classId,
                      )
                    }
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedClass === classData.classId
                        ? "bg-[var(--blue-light)] border-[var(--blue)] shadow-md"
                        : "bg-[var(--surface-2)] border-[var(--border)] hover:bg-[var(--bg)] hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)] rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[var(--text)] truncate">
                          Class {classData.className}-{classData.section}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[var(--text-2)]">
                            {classData.subjects?.length || 0} subjects
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedClass ? (
              data.subjectsByClass
                .filter(classData => classData.classId === selectedClass)
                .map(classData => (
                  <div
                    key={classData.classId}
                    className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative bg-[var(--surface)] border-b border-[var(--border)] p-8">
                      <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-[var(--blue-light)] rounded-2xl flex items-center justify-center flex-shrink-0 border border-[var(--border)]">
                              <Building className="w-8 h-8 text-[var(--blue)]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl lg:text-3xl font-bold text-[var(--text)]">
                                  Class {classData.className}-
                                  {classData.section}
                                </h2>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-[var(--text-2)]">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-[var(--blue)]" />
                                  <span className="font-medium">
                                    {classData.subjects?.length || 0} Subjects
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Award className="w-4 h-4 text-[var(--green)]" />
                                  <span className="font-medium">
                                    Subject Assignments
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-[var(--blue)]" />
                          Assigned Subjects
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                          <span>
                            {classData.subjects?.length || 0} subjects assigned
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classData.subjects?.map(subject => (
                          <div
                            key={subject.subjectId}
                            className="bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)]"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-[var(--blue-light)] to-[var(--indigo-light)] rounded-xl flex items-center justify-center flex-shrink-0 border border-[var(--border)]">
                                <BookOpen className="w-6 h-6 text-[var(--blue)]" />
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  className="w-8 h-8 rounded-lg bg-[var(--blue-light)] text-[var(--blue)] flex items-center justify-center border border-[var(--border)] hover:bg-[var(--blue)] hover:text-white transition-colors"
                                  title="View Details"
                                >
                                  <Eye size={14} strokeWidth={1.5} />
                                </button>
                                <button
                                  className="w-8 h-8 rounded-lg bg-[var(--blue-light)] text-[var(--blue)] flex items-center justify-center border border-[var(--border)] hover:bg-[var(--blue)] hover:text-white transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={14} strokeWidth={1.5} />
                                </button>
                              </div>
                            </div>

                            {subject.passingMarks && subject.maxMarks && (
                              <div className="bg-gradient-to-br from-[var(--surface-2)] via-[var(--surface)] to-[var(--surface-2)] rounded-xl p-4 border border-[var(--border)]">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between p-2 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                                    <span className="text-xs text-[var(--text-2)] font-semibold uppercase tracking-wider">
                                      Subject Name
                                    </span>
                                    <span className="text-sm font-bold text-[var(--blue)]">
                                      {subject.subjectName}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between p-2 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                                    <span className="text-xs text-[var(--text-2)] font-semibold uppercase tracking-wider">
                                      Subject Code
                                    </span>
                                    <span className="text-sm font-bold text-[var(--indigo)] font-mono">
                                      {subject.subjectCode}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between p-2 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                                    <span className="text-xs text-[var(--text-2)] font-semibold uppercase tracking-wider">
                                      Passing Marks
                                    </span>
                                    <span className="text-sm font-bold text-[var(--amber)]">
                                      {subject.passingMarks}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between p-2 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                                    <span className="text-xs text-[var(--text-2)] font-semibold uppercase tracking-wider">
                                      Max Marks
                                    </span>
                                    <span className="text-sm font-bold text-[var(--green)]">
                                      {subject.maxMarks}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {(!classData.subjects ||
                        classData.subjects.length === 0) && (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-[var(--blue-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-[var(--blue)]" />
                          </div>
                          <h4 className="text-lg font-semibold text-[var(--text)] mb-2">
                            No Subjects Assigned
                          </h4>
                          <p className="text-[var(--text-2)]">
                            This class doesn&apos;t have any subjects assigned
                            yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] p-16 text-center">
                <div className="w-20 h-20 bg-[var(--blue-light)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-[var(--blue)]" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text)] mb-3">
                  Select a Class
                </h3>
                <p className="text-[var(--text-2)] max-w-md mx-auto">
                  Choose a class from list to view subject assignments.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </CommonTeacherHeader>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, Building, ArrowLeft } from "lucide-react";
import {
  fetchAssignSubjectData,
  clearError,
  SubjectClass,
} from "@/lib/store/AssignSubjectSlice";
import { RootState, AppDispatch } from "@/lib/store/Index";
import { showToast } from "@/lib/utils/Toast";
import PageHeader from "@/components/layout/PageHeader";

interface SelectedClassData extends SubjectClass {
  classId: string;
  className: string;
  section: string;
  subjects: {
    subjectId: string;
    subjectName: string;
    subjectCode: string;
    passingMarks?: number;
    maxMarks?: number;
  }[];
}

export default function AssignSubject() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.assignSubject,
  );
  const [selectedClass, setSelectedClass] = useState<SelectedClassData | null>(
    null,
  );

  useEffect(() => {
    dispatch(fetchAssignSubjectData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleBackToClasses = () => {
    setSelectedClass(null);
  };

  const handleClassClick = (classData: SelectedClassData) => {
    setSelectedClass(classData);
  };

  if (loading) {
    return null;
  }

  const classes = data?.subjectsByClass || [];

  const renderClasses = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
      {classes.map((classItem: SubjectClass, index: number) => (
        <div
          key={classItem.classId}
          onClick={() => handleClassClick(classItem as SelectedClassData)}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] p-5 cursor-pointer hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)] rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="font-bold text-[var(--text)] text-lg">
                Class {classItem.className}-{classItem.section}
              </div>
              <div className="text-sm text-[var(--text-2)] mt-1">
                {classItem.subjects?.length || 0} subjects
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSubjects = () => {
    if (!selectedClass) return null;

    return (
      <div className="mt-5">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
          <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-[var(--border)] flex-wrap gap-2">
            <div>
              <div className="text-[17px] font-bold text-[var(--text)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--blue-light)] flex items-center justify-center">
                  <Building className="w-5 h-5 text-[var(--blue)]" />
                </div>
                Class {selectedClass.className}-{selectedClass.section}
                <div className="text-sm text-[var(--text-2)] mt-[2px]">
                  ({selectedClass.subjects?.length || 0} Subjects)
                </div>
              </div>
            </div>
          </div>

          <div className="p-[18px]">
            {selectedClass.subjects && selectedClass.subjects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                      <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-[var(--text-2)] uppercase">
                        Subject Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-[var(--text-2)] uppercase">
                        Subject Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-[var(--text-2)] uppercase">
                        Passing Marks
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-[var(--text-2)] uppercase">
                        Max Marks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClass.subjects.map((subject, idx) => (
                      <tr
                        key={subject.subjectId}
                        className={`border-b border-[var(--border)] ${idx % 2 === 0 ? "bg-[var(--surface)]" : "bg-[var(--surface-2)]"}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[var(--blue-light)] rounded-lg flex items-center justify-center flex-shrink-0 border border-[var(--border)]">
                              <BookOpen className="w-4 h-4 text-[var(--blue)]" />
                            </div>
                            <span className="font-medium text-[var(--text)]">
                              {subject.subjectName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--indigo-light)] text-[var(--indigo)] border border-[var(--border)]">
                            {subject.subjectCode}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-[var(--amber)]">
                            {subject.passingMarks || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-[var(--green)]">
                            {subject.maxMarks || "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[var(--surface-2)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-[var(--text-3)]" />
                </div>
                <h4 className="text-lg font-semibold text-[var(--text)] mb-2">
                  No Subjects Assigned
                </h4>
                <p className="text-[var(--text-2)]">
                  This class doesn&apos;t have any subjects assigned yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Assign Classes & Subjects"
        description={
          selectedClass
            ? `Subjects in Class ${selectedClass.className}-${selectedClass.section}`
            : "Select a class to view subjects"
        }
        icon={BookOpen}
        iconBgColor="--blue-light"
        iconColor="--blue"
      />

      {selectedClass && (
        <button
          onClick={handleBackToClasses}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer border border-gray-200 bg-white text-gray-500 transition-all duration-150 mb-4 mt-4 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Classes
        </button>
      )}

      <div className="flex items-center gap-2 text-sm text-[var(--text-2)] mt-4">
        <span
          className={`cursor-pointer ${!selectedClass ? "text-[var(--blue)] font-semibold" : "hover:text-[var(--blue)]"}`}
          onClick={handleBackToClasses}
        >
          Classes
        </span>
        {selectedClass && (
          <>
            <span>/</span>
            <span className="text-[var(--blue)] font-semibold">
              Class {selectedClass.className}-{selectedClass.section}
            </span>
          </>
        )}
      </div>

      {classes.length === 0 ? (
        <div className="bg-[var(--surface)] mt-5 border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] p-16 text-center">
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
      ) : selectedClass ? (
        renderSubjects()
      ) : (
        renderClasses()
      )}
    </div>
  );
}

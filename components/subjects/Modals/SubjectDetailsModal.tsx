import React from "react";
import { Book, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { SubjectWithClassSubjects } from "@/lib/api/Subject";

interface SubjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: SubjectWithClassSubjects | null;
  activeTab: "classes" | "chapters";
  setActiveTab: (tab: "classes" | "chapters") => void;
  onDeleteClass: (classId: string) => void;
  onDeleteChapter: (chapterId: string, chapterName: string) => void;
}

export function SubjectDetailsModal({
  isOpen,
  onClose,
  subject,
  activeTab,
  setActiveTab,
  onDeleteClass,
  onDeleteChapter,
}: SubjectDetailsModalProps) {
  if (!subject) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subject.subjectName || "Subject Details"}
      description={`Curriculum details for ${subject.subjectName}`}
    >
      <div className="w-[900px] max-h-[80vh] overflow-y-auto pr-1">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center bg-blue-light text-blue">
              <Book className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text)]">
                {subject.subjectName}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[var(--text-3)] text-sm">
                  {subject.classSubjects?.length || 0} class
                  {(subject.classSubjects?.length || 0) !== 1 ? "es" : ""}{" "}
                  assigned
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-[var(--border)] mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("classes")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "classes"
                    ? "border-[var(--blue)] text-[var(--blue)]"
                    : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
                }`}
              >
                Classes ({subject.classSubjects?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("chapters")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "chapters"
                    ? "border-[var(--blue)] text-[var(--blue)]"
                    : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
                }`}
              >
                All Chapters (
                {subject.chapters?.filter(
                  chapter => chapter.status !== "deleted",
                ).length || 0}
                )
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "classes" ? (
              !subject.classSubjects || subject.classSubjects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-[var(--surface-3)] flex items-center justify-center mx-auto mb-3">
                    <Book className="w-6 h-6 text-[var(--text-3)]" />
                  </div>
                  <p className="text-[var(--text-2)]">
                    No classes assigned to this subject yet
                  </p>
                </div>
              ) : (
                <div>
                  {subject.classSubjects?.map(cls => (
                    <div
                      key={cls.id}
                      className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl overflow-hidden"
                    >
                      <div className="bg-[var(--surface-3)] px-5 py-3 border-b border-[var(--border)]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-light text-blue flex items-center justify-center text-sm font-bold">
                              {cls.class.className}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[var(--text)]">
                                Class {cls.class.className}-{cls.class.section}
                              </h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onDeleteClass(cls.id)}
                              className="w-8 h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--rose-light)] text-[var(--rose)] hover:bg-[var(--rose)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--rose-light)]"
                              title="Remove Class Assignment"
                            >
                              <Trash2 size={14} strokeWidth={1.8} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Chapters Tab */
              <div>
                {subject.chapters && subject.chapters.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider">
                      All Chapters
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {subject.chapters
                        .filter(chapter => chapter.status !== "deleted")
                        .sort((a, b) => a.chapterNo - b.chapterNo)
                        .map((chapter, index) => (
                          <div
                            key={chapter.id || index}
                            className="bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-4 hover:border-[var(--border-focus)] transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-light text-blue flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {chapter.chapterNo}
                              </div>
                              {chapter.id && (
                                <button
                                  onClick={() =>
                                    chapter.id &&
                                    onDeleteChapter(
                                      chapter.id,
                                      chapter.chapterName,
                                    )
                                  }
                                  className="w-6 h-6 rounded-[var(--radius-sm)] cursor-pointer bg-[var(--rose-light)] text-[var(--rose)] hover:bg-[var(--rose)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)]"
                                  title="Delete Chapter"
                                >
                                  <Trash2 size={12} strokeWidth={1.8} />
                                </button>
                              )}
                            </div>
                            <h4 className="font-medium text-[var(--text)] mb-1">
                              {chapter.chapterName}
                            </h4>
                            <p className="text-xs text-[var(--blue)] mt-1">
                              Chapter {chapter.chapterNo}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-[var(--surface-3)] flex items-center justify-center mx-auto mb-3">
                      <Book className="w-6 h-6 text-[var(--text-3)]" />
                    </div>
                    <p className="text-[var(--text-2)]">No chapters found</p>
                    <p className="text-sm text-[var(--text-3)] mt-2">
                      Add chapters to see them here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

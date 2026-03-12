"use client";
import PageHeader from "@/components/layout/PageHeader";
import { resourcesData } from "@/lib/constants/ResourcesData";
import { Class, Subject } from "@/lib/types/Resources";
import { ArrowLeft, FolderOpen, Plus } from "lucide-react";
import { useState } from "react";

function Page() {
  const [currentView, setCurrentView] = useState<
    "classes" | "subjects" | "chapters"
  >("classes");
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [resourceFilter, setResourceFilter] = useState<string>("all");

  // Initialize with active class
  const activeClass = resourcesData.find(c => c.code === "10-A");
  if (activeClass && currentView === "classes" && !selectedClass) {
    setSelectedClass(activeClass);
    setCurrentView("subjects");
  }

  const handleBackToClasses = () => {
    setCurrentView("classes");
    setSelectedClass(null);
    setSelectedSubject(null);
  };

  const handleBackToSubjects = () => {
    setCurrentView("subjects");
    setSelectedSubject(null);
  };

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentView("chapters");
  };

  const getIconComponent = (iconName: string): React.ReactNode => {
    const iconMap: { [key: string]: React.ReactNode } = {
      calc: (
        <div className="w-8 h-8 flex items-center justify-center text-white bg-blue-500 rounded-lg text-lg">
          ∑
        </div>
      ),
      flask: (
        <div className="w-8 h-8 flex items-center justify-center text-white bg-green-500 rounded-lg text-lg">
          ⚗
        </div>
      ),
      lang: (
        <div className="w-8 h-8 flex items-center justify-center text-white bg-indigo-500 rounded-lg text-lg">
          📝
        </div>
      ),
      code: (
        <div className="w-8 h-8 flex items-center justify-center text-white bg-cyan-500 rounded-lg text-lg">
          &lt;/&gt;
        </div>
      ),
      chart: (
        <div className="w-8 h-8 flex items-center justify-center text-white bg-amber-500 rounded-lg text-lg">
          📊
        </div>
      ),
      history: (
        <div className="w-8 h-8 flex items-center justify-center text-white bg-rose-500 rounded-lg text-lg">
          📚
        </div>
      ),
    };
    return (
      iconMap[iconName] || (
        <div className="w-8 h-8 flex items-center justify-center text-white bg-gray-500 rounded-lg text-lg">
          📄
        </div>
      )
    );
  };
  const getTotalResources = (subject: Subject) => {
    return subject.chapters.reduce(
      (total, chapter) => total + chapter.resources.length,
      0,
    );
  };

  const renderBreadcrumb = () => {
    if (currentView === "classes") {
      return (
        <div className="mt-5 flex items-center gap-1.5 mb-4.5 text-sm font-medium text-[var(--text-2)] flex-wrap">
          <span className="font-bold text-[var(--text)]">📚 All Classes</span>
        </div>
      );
    } else if (currentView === "subjects") {
      return (
        <div className="mt-5 flex items-center gap-1.5 mb-4.5 text-sm font-medium text-[var(--text-2)] flex-wrap">
          <button
            onClick={handleBackToClasses}
            className="font-semibold text-[var(--blue)] hover:text-[var(--blue-d)] hover:underline transition-colors"
          >
            📚 All Classes
          </button>
          <span className="text-xs text-[var(--text-3)] select-none">/</span>
          <span className="font-bold text-[var(--text)]">
            {selectedClass?.code} - {selectedClass?.name}
          </span>
        </div>
      );
    } else {
      return (
        <div className="mt-5 flex items-center gap-1.5 mb-4.5 text-sm font-medium text-[var(--text-2)] flex-wrap">
          <button
            onClick={handleBackToClasses}
            className="font-semibold text-[var(--blue)] hover:text-[var(--blue-d)] hover:underline transition-colors"
          >
            📚 All Classes
          </button>
          <span className="text-xs text-[var(--text-3)] select-none">/</span>
          <button
            onClick={handleBackToSubjects}
            className="font-semibold text-[var(--blue)] hover:text-[var(--blue-d)] hover:underline transition-colors"
          >
            {selectedClass?.code} - {selectedClass?.name}
          </button>
          <span className="text-xs text-[var(--text-3)] select-none">/</span>
          <span className="font-bold text-[var(--text)]">
            {selectedSubject?.name}
          </span>
        </div>
      );
    }
  };

  const renderClasses = () => {
    const bgColorMap: { [key: string]: { fg: string; bg: string } } = {
      blue: { fg: "blue", bg: "lightblue" },
      green: { fg: "green", bg: "lightgreen" },
      orange: { fg: "orange", bg: "lightorange" },
      purple: { fg: "purple", bg: "lightpurple" },
      cyan: { fg: "cyan", bg: "lightcyan" },
      rose: { fg: "rose", bg: "lightrose" },
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {resourcesData.map((classItem, i) => {
          const totalRes = classItem.subjects.reduce(
            (sum, s) =>
              sum +
              s.chapters.reduce((cSum, ch) => cSum + ch.resources.length, 0),
            0,
          );
          const col = bgColorMap[classItem.color] || bgColorMap.blue;
          return (
            <div
              key={classItem.id}
              className="relative bg-white border border-gray-200 rounded-md p-4 cursor-pointer transition-all duration-150 overflow-hidden hover:border-blue-500 hover:-translate-y-0.5"
              style={{
                animationDelay: `${(0.04 * (i + 1)).toFixed(2)}s`,
                animation: "slideUp 0.4s ease-out forwards",
                opacity: 0,
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => {
                setSelectedClass(classItem);
                setCurrentView("subjects");
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.75 rounded-t-md"
                style={{
                  background: `linear-gradient(90deg,${classItem.gradient})`,
                }}
              ></div>
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: col.fg }}
              >
                {classItem.code}
              </div>
              <div className="text-sm text-gray-500 mb-3">{classItem.name}</div>
              <div className="text-xs text-gray-400">
                <span style={{ color: col.fg }}>
                  {classItem.subjects.length}
                </span>{" "}
                Subjects · <span className="text-gray-600">{totalRes}</span>{" "}
                Resources
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSubjects = () => {
    if (!selectedClass) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedClass.subjects.map(subject => (
          <div
            key={subject.id}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-4 hover:border-[var(--blue)] transition-all duration-150 cursor-pointer hover:-translate-y-0.5"
            onClick={() => handleSubjectClick(subject)}
            style={{ boxShadow: "var(--shadow-sm)" }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "var(--shadow)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex-shrink-0">
                {getIconComponent(subject.icon)}
              </div>
              <div className="px-2 py-1 bg-[var(--bg)] rounded text-xs font-semibold text-[var(--text)]">
                {subject.code}
              </div>
            </div>
            <h3 className="font-bold text-[var(--text)] mb-3">
              {subject.name}
            </h3>
            <div className="border-b border-dashed border-[var(--border)] pb-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                <span>👨‍🏫</span>
                <span>{subject.teacher}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-lg font-bold">
              <div className="text-center">
                <div className="text-[var(--text)]">
                  {subject.chapters.length}
                </div>
                <div className="text-xs text-[var(--text-3)] font-normal">
                  Chapters
                </div>
              </div>
              <div className="text-center">
                <div className="text-[var(--text)]">
                  {getTotalResources(subject)}
                </div>
                <div className="text-xs text-[var(--text-3)] font-normal">
                  Resources
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderChapters = () => {
    if (!selectedSubject) return null;

    const filteredChapters = selectedSubject.chapters.map(chapter => ({
      ...chapter,
      resources: chapter.resources.filter(
        resource =>
          resourceFilter === "all" ||
          resource.type.toLowerCase() === resourceFilter.toLowerCase(),
      ),
    }));

    return (
      <div>
        <div className="flex gap-2 mb-6">
          {["all", "pdf", "video", "notes"].map(type => (
            <button
              key={type}
              onClick={() => setResourceFilter(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                resourceFilter === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {filteredChapters.map((chapter, chapterIndex) => (
          <div
            key={chapterIndex}
            className="mb-8 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)]"
          >
            <div className="bg-[var(--surface)] border-b border-[var(--border)]">
              <div className="flex flex-col justify-between m-4">
                <h3 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
                  {chapter.name}
                </h3>
                <div className="text-sm text-[var(--text-2)]">
                  {chapter.resources.length} Resources
                </div>
              </div>
            </div>

            {chapter.resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4 mt-4">
                {chapter.resources.map((resource, resourceIndex) => (
                  <div
                    key={resourceIndex}
                    className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-4 hover:border-[var(--blue)] transition-colors cursor-pointer flex flex-col"
                  >
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: `var(--${resource.bg}-light)` }}
                    >
                      <span className="text-2xl">{resource.icon}</span>
                    </div>
                    <h4 className="font-semibold text-[var(--text)] mb-2">
                      {resource.title}
                    </h4>
                    <div className="text-xs text-[var(--text-3)] space-y-1 w-full">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {selectedSubject?.name}
                        </span>
                        <span className="px-2 py-0.5  text-xs">
                          {resource.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{chapter.name}</span>
                        <span>{resource.size}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between border-t border-[var(--border)] pt-3">
                      <button
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs hover:opacity-80 transition-opacity ${
                          resource.type === "PDF"
                            ? "border-red-200 bg-red-50 text-red-600"
                            : resource.type === "Video"
                              ? "border-blue-200 bg-blue-50 text-blue-600"
                              : resource.type === "Notes"
                                ? "border-yellow-200 bg-yellow-50 text-yellow-600"
                                : "border-gray-200 bg-gray-50 text-gray-600"
                        }`}
                      >
                        {resource.type}
                      </button>
                      <button
                        className={`flex items-center gap-2 px-3 py-1.5 border border-[var(--border)] rounded-lg text-xs transition-colors ${
                          resource.type === "PDF"
                            ? "hover:bg-red-100 hover:text-red-600 hover:border-red-200"
                            : resource.type === "Video"
                              ? "hover:bg-blue-100 hover:text-blue-600 hover:border-blue-200"
                              : resource.type === "Notes"
                                ? "hover:bg-yellow-100 hover:text-yellow-600 hover:border-yellow-200"
                                : "hover:bg-gray-100 hover:text-gray-600 hover:border-gray-200"
                        }`}
                      >
                        {resource.type === "PDF" && <span>📥</span>}
                        {resource.type === "Video" && <span>▶️</span>}
                        {resource.type === "Notes" && <span>👁️</span>}
                        {resource.type === "Link" && <span>🔗</span>}
                        {resource.type === "PDF"
                          ? "Download"
                          : resource.type === "Video"
                            ? "Watch"
                            : resource.type === "Notes"
                              ? "View"
                              : "Open"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--text-3)]">
                No resources found for this chapter
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case "classes":
        return renderClasses();
      case "subjects":
        return renderSubjects();
      case "chapters":
        return renderChapters();
      default:
        return null;
    }
  };

  return (
    <div>
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <PageHeader
        title="Resources"
        description={
          currentView === "classes"
            ? "Browse study materials by class and subject"
            : currentView === "subjects"
              ? `Subjects and resources for ${selectedClass?.code}`
              : `Resources for ${selectedSubject?.name}`
        }
        icon={FolderOpen}
        iconBgColor="lightcyan"
        iconColor="cyan"
        buttonText="Upload Resource"
        onButtonClick={() => {
          /* TODO: Implement upload functionality */
        }}
        buttonIcon={Plus}
      />

      {renderBreadcrumb()}

      {currentView !== "classes" && (
        <button
          onClick={
            currentView === "subjects"
              ? handleBackToClasses
              : handleBackToSubjects
          }
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer border border-gray-200 bg-white text-gray-500 transition-all duration-150 mb-4 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {currentView === "subjects" ? "Classes" : "Subjects"}
        </button>
      )}

      {renderContent()}
    </div>
  );
}

export default Page;

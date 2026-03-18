"use client";
import PageHeader from "@/components/layout/PageHeader";
import { resourcesData } from "@/lib/constants/ResourcesData";
import { Class, Subject, Chapter } from "@/lib/types/Resources";
import { useState } from "react";
import { ArrowLeft, FolderOpen, Plus } from "lucide-react";
import Breadcrumb from "@/components/resources/Breadcrumb";
import ClassCard from "@/components/resources/ClassCard";
import SubjectCard from "@/components/resources/SubjectCard";
import ChapterHeader from "@/components/resources/ChapterHeader";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourceFilter from "@/components/resources/ResourceFilter";
import ChapterResourceModal from "@/components/resources/ChapterResourceModal";

type ResourceType = "all" | "pdf" | "video" | "notes";

function Page() {
  const [currentView, setCurrentView] = useState<
    "classes" | "subjects" | "chapters"
  >("classes");
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [resourceFilter, setResourceFilter] = useState<ResourceType>("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const handleBackToClasses = () => {
    setCurrentView("classes");
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
  };

  const handleBackToSubjects = () => {
    setCurrentView("subjects");
    setSelectedSubject(null);
    setSelectedChapter(null);
  };

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    // Set's first chapter as selected by default
    if (subject.chapters.length > 0) {
      setSelectedChapter(subject.chapters[0]);
    }
    setCurrentView("chapters");
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
  };

  const handleUploadResource = () => {
    if (currentView === "classes" && selectedClass) {
      const firstSubject = selectedClass.subjects[0];
      const firstChapter = firstSubject?.chapters[0];
      if (firstSubject && firstChapter) {
        setSelectedSubject(firstSubject);
        setSelectedChapter(firstChapter);
        setIsModalOpen(true);
      }
    } else if (currentView === "subjects" && selectedSubject) {
      const firstChapter = selectedSubject.chapters[0];
      if (firstChapter) {
        setSelectedChapter(firstChapter);
        setIsModalOpen(true);
      }
    } else if (
      currentView === "chapters" &&
      selectedSubject &&
      selectedChapter
    ) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const renderClasses = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {resourcesData.map((classItem, i) => (
          <ClassCard
            key={classItem.id}
            classItem={classItem}
            index={i}
            onClick={classItem => {
              setSelectedClass(classItem);
              setCurrentView("subjects");
            }}
          />
        ))}
      </div>
    );
  };

  const renderSubjects = () => {
    if (!selectedClass) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedClass.subjects.map(subject => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onClick={handleSubjectClick}
          />
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
        <ResourceFilter
          resourceFilter={resourceFilter}
          onFilterChange={setResourceFilter}
        />
        {filteredChapters.map((chapter, chapterIndex) => (
          <div
            key={chapterIndex}
            className="mb-8 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)]"
          >
            <ChapterHeader
              chapter={chapter}
              isSelected={selectedChapter?.name === chapter.name}
              onClick={() => handleChapterSelect(chapter)}
            />
            {chapter.resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4 mt-4">
                {chapter.resources.map((resource, resourceIndex) => (
                  <ResourceCard
                    key={resourceIndex}
                    resource={resource}
                    chapter={chapter}
                    selectedSubject={selectedSubject}
                    onUploadClick={(chapter, subject) => {
                      setSelectedChapter(chapter);
                      setIsModalOpen(true);
                    }}
                  />
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
        onButtonClick={handleUploadResource}
        buttonIcon={Plus}
        buttonDisabled={
          (currentView === "classes" && !selectedClass) ||
          (currentView === "subjects" && !selectedSubject) ||
          (currentView === "chapters" && (!selectedSubject || !selectedChapter))
        }
      />

      <Breadcrumb
        currentView={currentView}
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
        onBackToClasses={handleBackToClasses}
        onBackToSubjects={handleBackToSubjects}
      />

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

      <ChapterResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={() => {}}
        chapterId={selectedChapter?.id}
        chapterName={selectedChapter?.name}
        subjectName={selectedSubject?.name}
      />
    </div>
  );
}

export default Page;

"use client";
import PageHeader from "@/components/layout/PageHeader";
import { resourcesApis } from "@/lib/api/Resources";
import { Class, Subject, Chapter, Resource } from "@/lib/types/Resources";
import ResourceDeleteModal from "@/components/resources/ResourceDeleteModal";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/Index";
import { ArrowLeft, FolderOpen, Plus } from "lucide-react";
import Breadcrumb from "@/components/resources/Breadcrumb";
import ClassCard from "@/components/resources/ClassCard";
import SubjectCard from "@/components/resources/SubjectCard";
import ChapterHeader from "@/components/resources/ChapterHeader";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourceFilter, {
  ResourceType,
} from "@/components/resources/ResourceFilter";
import ChapterResourceModal from "@/components/resources/ChapterResourceModal";
import { showToast } from "@/lib/utils/Toast";
import ResourceSkeleton from "@/components/skeletons/ResourceSkeleton";

function Page() {
  const [currentView, setCurrentView] = useState<
    "classes" | "subjects" | "chapters"
  >("classes");
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [resourceFilter, setResourceFilter] = useState<ResourceType>("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [resourcesData, setResourcesData] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const userRole = useSelector((state: RootState) => state.auth.role);
  const isStudent = userRole === "student";
  const isTeacher = !isStudent;

  const fetchResources = useCallback(async () => {
    try {
      const data = await resourcesApis.getChapterResources();
      setResourcesData(data);
    } catch (_error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDeleteResource = async () => {
    if (!resourceToDelete) return;
    setIsDeleting(true);
    try {
      await resourcesApis.deleteResource(resourceToDelete.id);
      setResourceToDelete(null);
      await fetchResources();
    } catch (_error) {
      showToast.apiError(_error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Initialize with active class
  // const activeClass = resourcesData.find(c => c.code === "10-A");
  // if (activeClass && currentView === "classes" && !selectedClass) {
  //   setSelectedClass(activeClass);
  //   setCurrentView("subjects");
  // }

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
    // Set's first chapter as selected by default
    if (subject.chapters.length > 0) {
      setSelectedChapter(subject.chapters[0]);
    }
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
        {resourcesData.length > 0 ? (
          resourcesData.map((classItem, i) => (
            <ClassCard
              key={classItem.classId}
              classItem={classItem}
              index={i}
              onClick={classItem => {
                setSelectedClass(classItem);
                setCurrentView("subjects");
              }}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-24 text-[var(--text-2)] col-span-1 md:col-span-3 w-full text-center">
            <FolderOpen className="w-12 h-12 mb-3 opacity-30 mx-auto" />
            <p className="text-lg font-medium">No classes assigned yet</p>
            <p className="text-sm mt-1">
              Classes assigned to you will appear here.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderSubjects = () => {
    if (!selectedClass) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedClass.subjects.length > 0 ? (
          selectedClass.subjects.map(subject => (
            <SubjectCard
              key={subject.subjectId}
              subject={subject}
              onClick={handleSubjectClick}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-24 text-[var(--text-2)] col-span-1 md:col-span-3 w-full text-center">
            <FolderOpen className="w-12 h-12 mb-3 opacity-30 mx-auto" />
            <p className="text-lg font-medium">No subjects found</p>
            <p className="text-sm mt-1">
              {`There are currently no subjects assigned to "${selectedClass.className}".`}
            </p>
          </div>
        )}
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
          resource.resourceType.toLowerCase() === resourceFilter.toLowerCase(),
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
            key={chapter.chapterId}
            className="mb-8 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)]"
          >
            <ChapterHeader
              chapter={chapter}
              isSelected={selectedChapter?.chapterName === chapter.chapterName}
              onClick={() => handleChapterSelect(chapter)}
            />
            {chapter.resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4 mt-4">
                {chapter.resources.map((resource, resourceIndex) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    chapter={chapter}
                    selectedSubject={selectedSubject}
                    isTeacher={isTeacher}
                    onDeleteClick={res => setResourceToDelete(res)}
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
    if (loading) {
      return <ResourceSkeleton />;
    }

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
              ? `Subjects and resources for ${selectedClass?.className}`
              : `Resources for ${selectedSubject?.subjectName}`
        }
        icon={FolderOpen}
        iconBgColor="--cyan-light"
        iconColor="--cyan"
        {...(!isStudent && {
          buttonText: "Upload Resource",
          onButtonClick: handleUploadResource,
          buttonIcon: Plus,
          buttonDisabled:
            (currentView === "classes" && !selectedClass) ||
            (currentView === "subjects" && !selectedSubject) ||
            (currentView === "chapters" &&
              (!selectedSubject || !selectedChapter)),
        })}
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

      {/* Chapter Resource Upload Modal - only for admin/teacher */}
      {!isStudent && (
        <ChapterResourceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmitSuccess={() => {
            fetchResources();
          }}
          chapterId={selectedChapter?.chapterId}
          chapterName={selectedChapter?.chapterName}
          subjectId={selectedSubject?.subjectId}
          subjectName={selectedSubject?.subjectName}
        />
      )}

      {/* Delete Confirmation Modal - only for teacher/admin */}
      {isTeacher && (
        <ResourceDeleteModal
          isOpen={!!resourceToDelete}
          onClose={() => setResourceToDelete(null)}
          resource={resourceToDelete}
          onConfirm={handleDeleteResource}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default Page;

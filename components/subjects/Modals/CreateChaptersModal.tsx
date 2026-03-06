import React from "react";
import Modal from "@/components/ui/Modal";
import CreateChapterForm from "@/components/forms/CreateChapterForm";
import { SubjectWithClassSubjects } from "@/lib/api/Subject";

interface CreateChaptersModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatingChapters: {
    subject: SubjectWithClassSubjects;
    classInfo: NonNullable<SubjectWithClassSubjects["classSubjects"]>[0];
  } | null;
  fetchSubjects: () => Promise<void>;
  selectedSubject: SubjectWithClassSubjects | null;
  setSelectedSubject: (subject: SubjectWithClassSubjects | null) => void;
  subjects: SubjectWithClassSubjects[];
}

export function CreateChaptersModal({
  isOpen,
  onClose,
  creatingChapters,
  fetchSubjects,
  selectedSubject,
  setSelectedSubject,
  subjects,
}: CreateChaptersModalProps) {
  if (!creatingChapters) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Chapters"
      description={`Add new chapters to ${creatingChapters.subject.subjectName}`}
    >
      <div className="w-full max-w-[600px] sm:w-[600px]">
        <CreateChapterForm
          key={creatingChapters.subject.chapters?.length}
          subject={creatingChapters.subject}
          classInfo={creatingChapters.classInfo}
          chaptersCount={creatingChapters.subject.chapters?.length}
          onClose={onClose}
          onSubmitSuccess={async () => {
            onClose();
            await fetchSubjects();
            // Update the selectedSubject with the latest data to show updated chapters
            const updatedSelectedSubject = subjects?.find(
              (s: SubjectWithClassSubjects) => s.id === selectedSubject?.id,
            );
            if (updatedSelectedSubject) {
              setSelectedSubject(updatedSelectedSubject);
            }
          }}
          onChapterCreated={undefined}
        />
      </div>
    </Modal>
  );
}

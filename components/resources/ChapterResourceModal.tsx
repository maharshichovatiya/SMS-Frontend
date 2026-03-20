"use client";

import ChapterResourceForm from "@/components/resources/ChapterResourceForm";
import Modal from "@/components/ui/Modal";

interface ChapterResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  chapterId?: string;
  chapterName?: string;
  subjectId?: string;
  subjectName?: string;
}

export default function ChapterResourceModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  chapterId,
  chapterName,
  subjectId,
  subjectName,
}: ChapterResourceModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Resource"
      description={`Add new resource to ${chapterName || "selected chapter"}`}
      className="max-w-2xl"
    >
      <ChapterResourceForm
        chapterId={chapterId}
        chapterName={chapterName}
        subjectId={subjectId}
        subjectName={subjectName}
        onSubmitSuccess={onSubmitSuccess}
        onClose={onClose}
      />
    </Modal>
  );
}

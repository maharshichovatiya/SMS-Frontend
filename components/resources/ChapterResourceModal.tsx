"use client";

import Modal from "@/components/ui/Modal";
import ChapterResourceForm from "@/components/resources/ChapterResourceForm";

interface ChapterResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  chapterId?: string;
  chapterName?: string;
  subjectName?: string;
}

export default function ChapterResourceModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  chapterId,
  chapterName,
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
        subjectName={subjectName}
        onSubmitSuccess={onSubmitSuccess}
        onClose={onClose}
      />
    </Modal>
  );
}

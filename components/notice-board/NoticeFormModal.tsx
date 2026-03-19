"use client";

import Modal from "@/components/ui/Modal";
import NoticeForm from "@/components/notice-board/NoticeForm";

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function NoticeFormModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: NoticeFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Notice"
      description="Fill in the details below to create a new notice"
      className="max-w-2xl"
    >
      <NoticeForm onSubmitSuccess={onSubmitSuccess} onClose={onClose} />
    </Modal>
  );
}

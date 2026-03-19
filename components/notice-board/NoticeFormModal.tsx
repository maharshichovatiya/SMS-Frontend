"use client";

import Modal from "@/components/ui/Modal";
import NoticeForm from "@/components/notice-board/NoticeForm";

import { ApiNotice } from "@/lib/api/Notice";

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  notice?: ApiNotice | null;
}

export default function NoticeFormModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  notice,
}: NoticeFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={notice ? "Edit Notice" : "Create New Notice"}
      description={
        notice
          ? "Update the details of the notice below"
          : "Fill in the details below to create a new notice"
      }
      className="max-w-2xl"
    >
      <NoticeForm
        onSubmitSuccess={onSubmitSuccess}
        onClose={onClose}
        initialData={notice}
      />
    </Modal>
  );
}

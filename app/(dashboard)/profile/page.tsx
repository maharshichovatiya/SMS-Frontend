"use client";

import ProfileForm from "@/components/forms/ProfileForm";
import SchoolForm from "@/components/forms/SchoolForm";
import Modal from "@/components/ui/Modal";
import { deleteSchool } from "@/lib/api/school";
import { deleteUser } from "@/lib/api/profile";
import { Settings, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    try {
      setDeleting(true);
      const schoolId = localStorage.getItem("schoolId") ?? "";
      const userId = localStorage.getItem("userId") ?? "";
      await Promise.all([deleteSchool(schoolId), deleteUser(userId)]);
      setIsOpen(false);
      router.replace("/signin");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div
        className="
          flex items-center justify-between
          bg-[var(--surface)]
          border border-[var(--border)]
          rounded-[var(--radius-xl)]
          px-8 py-6
          shadow-[var(--shadow)]
        "
      >
        <div className="flex items-center gap-5">
          <div
            className="
              flex items-center justify-center
              w-14 h-14
              rounded-[var(--radius-md)]
              bg-[var(--blue-light)]
            "
          >
            <Settings className="w-6 h-6 text-[var(--blue)]" />
          </div>

          <div>
            <h1 className="text-[22px] font-bold text-[var(--text)]">
              Settings
            </h1>
            <p className="text-[14px] text-[var(--text-2)] mt-1">
              Manage system preferences and configuration
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="
            flex items-center gap-2
            px-4 py-2
            rounded-[var(--radius-sm)]
            border border-red-200
            bg-red-50
            text-sm font-medium text-red-600
            hover:bg-red-100
            transition
          "
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>

      <div className="flex flex-col gap-4 my-4">
        <div>
          <ProfileForm />
        </div>
        <div>
          <SchoolForm />
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => !deleting && setIsOpen(false)}
        title="Delete Account?"
        description="This will permanently delete the admin account and school along with all its data. This action cannot be undone."
        footer={
          <>
            <button
              onClick={() => setIsOpen(false)}
              disabled={deleting}
              className="
                px-4 py-2
                rounded-[var(--radius-sm)]
                border border-[var(--border)]
                bg-[var(--surface)]
                text-sm font-medium text-[var(--text-2)]
                hover:bg-[var(--bg-2)]
                transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="
                px-4 py-2
                rounded-[var(--radius-sm)]
                bg-red-600
                text-sm font-medium text-white
                hover:bg-red-700
                transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </>
        }
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
      </Modal>
    </div>
  );
}

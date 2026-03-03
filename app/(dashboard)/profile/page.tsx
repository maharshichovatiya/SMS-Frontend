"use client";

import Cookies from "js-cookie";
import ProfileForm from "@/components/forms/ProfileForm";
import SchoolForm from "@/components/forms/SchoolForm";
import Modal from "@/components/ui/Modal";
import { deleteSchool } from "@/lib/api/School";
import { deleteUser } from "@/lib/api/Profile";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/utils/Toast";

export default function SettingsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const schoolId = localStorage.getItem("schoolId");
      const userId = localStorage.getItem("userId");

      if (!schoolId || !userId) {
        showToast.error("User or School ID not found");
        return;
      }

      setDeleting(true);

      await Promise.all([deleteSchool(schoolId), deleteUser(userId)]);

      showToast.success("Profile deleted successfully");

      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("schoolId");

      setIsOpen(false);
      router.replace("/signin");
    } catch (error) {
      const err = error as Error;
      showToast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className="w-full bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] px-6 py-4 flex items-center justify-between"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-[var(--radius-sm)] flex items-center justify-center"
            style={{ backgroundColor: "var(--blue-light)" }}
          >
            <Settings
              className="w-5 h-5"
              strokeWidth={1.8}
              style={{ color: "var(--blue)" }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text)] leading-tight">
              Settings
            </h1>
            <p className="text-sm text-[var(--text-3)] mt-0.5">
              Manage system preferences and configuration
            </p>
          </div>
        </div>

        {/* <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-[var(--radius-sm)] border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 transition"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button> */}
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
        className="max-w-lg"
        footer={
          <>
            <button
              onClick={() => setIsOpen(false)}
              disabled={deleting}
              className="
          px-4 py-2
          rounded-[var(--radius-sm)]
          cursor-pointer
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
          cursor-pointer
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
        <p className="text-sm text-[var(--text-2)]">
          This will permanently delete the admin account and school along with
          all its data. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

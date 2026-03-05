"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProfile, updateProfile } from "@/lib/api/Profile";
import { showToast } from "@/lib/utils/Toast";
import { User, Shield, Lock, Eye, EyeOff, Pencil } from "lucide-react";
import {
  ProfileFormData,
  profileSchema,
} from "@/lib/validations/ProfileSchema";
import Modal from "@/components/ui/Modal";

export default function ProfileForm() {
  const [profileId, setProfileId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [savedName, setSavedName] = useState({ firstName: "", lastName: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileId(data.id ?? "");
        setEmail(data.email ?? "");
        reset({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          password: "",
        });
        setSavedName({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
        });
      } catch (error) {
        const err = error as Error;
        showToast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(profileId, {
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      });
      showToast.success("Profile updated successfully");
      reset({ ...data, password: "" });
      setSavedName({ firstName: data.firstName, lastName: data.lastName });
      setIsEditOpen(false);
    } catch (error: unknown) {
      let message = "Profile not updated";
      if (error instanceof Error) {
        message = error.message;
      }
      showToast.error(message);
    }
  };

  const handleOpenEdit = () => {
    reset({
      firstName: savedName.firstName,
      lastName: savedName.lastName,
      password: "",
    });
    setShowPassword(false);
    setIsEditOpen(true);
  };

  if (loading)
    return <div className="p-4 text-[var(--text-2)]">Loading...</div>;

  return (
    <>
      <div
        className="
          bg-[var(--surface)]
          border border-[var(--border)]
          rounded-[var(--radius-xl)]
          shadow-[var(--shadow)]
          overflow-hidden
        "
      >
        <div
          className="
            px-8 py-4
            border-b border-[var(--border)]
            bg-[var(--surface-2)]
            flex items-center justify-between
          "
        >
          <h2 className="text-lg font-semibold text-[var(--text)]">
            Admin Profile
          </h2>
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--text-2)] hover:bg-[var(--bg-2)] transition cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div
            className="
              flex items-center justify-between
              bg-[var(--bg-2)]
              rounded-[var(--radius-lg)]
              p-6
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  w-12 h-12
                  rounded-full
                  flex items-center justify-center
                  text-white font-bold text-xl
                "
                style={{ background: "var(--grad-primary)" }}
              >
                {savedName.firstName?.charAt(0).toUpperCase()}
                {savedName.lastName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[var(--text)]">
                  {savedName.firstName} {savedName.lastName}
                </p>
                <p className="text-sm text-[var(--text-2)]">{email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedName.firstName}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="label-base">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedName.lastName}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">Email</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={email}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="label-base">Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value="Admin"
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => !isSubmitting && setIsEditOpen(false)}
        title="Edit Admin Profile"
        className="max-w-xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              disabled={isSubmitting}
              className="
                px-5 py-3
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
              form="profile-edit-form"
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </>
        }
      >
        <form
          id="profile-edit-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="First Name"
                  className={`input-base pl-9 ${errors.firstName ? "error" : ""}`}
                />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px]">
                {errors.firstName?.message}
              </span>
            </div>
            <div className="w-full">
              <label className="label-base">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Last Name"
                  className={`input-base pl-9 ${errors.lastName ? "error" : ""}`}
                />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px]">
                {errors.lastName?.message}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value="Admin"
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="label-base">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Leave blank to keep current"
                  className={`input-base pl-9 pr-10 ${errors.password ? "error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px]">
                {errors.password?.message}
              </span>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

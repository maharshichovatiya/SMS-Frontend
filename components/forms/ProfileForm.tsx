"use client";

import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "@/lib/api/profile";
import toast from "react-hot-toast";

const initialState = {
  id: "",
  firstName: "",
  lastName: "",
  role: "",
  newPassword: "",
};

export default function ProfileForm() {
  const [form, setForm] = useState(initialState);
  const [savedForm, setSavedForm] = useState(initialState);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const isChange =
    form.firstName !== savedForm.firstName ||
    form.lastName !== savedForm.lastName ||
    form.newPassword !== savedForm.newPassword;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const fetched = {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          newPassword: "",
        };
        setForm(fetched);
        setSavedForm(fetched);
        setEmail(data.email);
      } catch (error) {
        const err = error as Error;
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(form.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        newPassword: form.newPassword,
      });
      toast.success("Profile Update successfully");
      setSavedForm(form);
    } catch (error) {
      toast.success("Profile not update");
    }
  };

  if (loading)
    return <div className="p-4 text-[var(--text-2)]">Loading...</div>;

  return (
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
        "
      >
        <h2 className="text-lg font-semibold text-[var(--text)]">
          Admin Profile
        </h2>
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
                w-10 h-10
                rounded-full
                flex items-center justify-center
                text-white font-bold text-xl
                bg-[var(--grad-primary)]
              "
            >
              {form.firstName.charAt(0).toUpperCase()}
              {form.lastName.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-[var(--text)]">
                {form.firstName} {form.lastName}
              </p>
              <p className="text-sm text-[var(--text-2)]">
                {form.role} · {email}
              </p>
            </div>
          </div>

          <button
            className="
              px-4 py-2
              rounded-[var(--radius-sm)]
              border border-[var(--border)]
              bg-[var(--surface)]
              text-sm font-medium
              text-[var(--text-2)]
              hover:bg-[var(--blue-light)]
              transition
            "
          >
            Edit Photo
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full">
            <label className="label-base">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="input-base pl-4"
            />
          </div>

          <div className="w-full">
            <label className="label-base">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="input-base pl-4"
            />
          </div>
        </div>

        <div>
          <label className="label-base">Role</label>
          <input
            type="text"
            name="role"
            value={form.role}
            disabled
            className="
              input-base pl-4
              bg-[var(--bg-2)]
              text-[var(--text-2)]
              cursor-not-allowed
            "
          />
        </div>

        <div>
          <label className="label-base">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="input-base pl-4"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={!isChange}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

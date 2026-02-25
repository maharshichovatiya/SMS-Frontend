"use client";

import React, { useState, useEffect } from "react";
import { getSchoolById, updateSchool, SchoolData } from "@/lib/api/school";
import toast from "react-hot-toast";

const initialState = {
  name: "",
  address: "",
  affiliationBoard: "",
  establishmentYear: "",
  schoolCode: "",
  contact: "",
  emailOfficial: "",
  websiteUrl: "",
  schoolTimingStart: "",
  schoolTimingEnd: "",
  mediumOfInstruction: "",
};

export default function SchoolForm() {
  const [form, setForm] = useState(initialState);
  const [savedForm, setSavedForm] = useState(initialState);
  const [schoolId, setSchoolId] = useState("");
  const [loading, setLoading] = useState(true);

  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const id = localStorage.getItem("schoolId") ?? "";
        setSchoolId(id);
        const data = await getSchoolById(id);
        const fetched = {
          name: data.name ?? "",
          address: data.address ?? "",
          affiliationBoard: data.affiliationBoard ?? "",
          establishmentYear: data.establishmentYear?.toString() ?? "",
          schoolCode: data.schoolCode ?? "",
          contact: data.contact ?? "",
          emailOfficial: data.emailOfficial ?? "",
          websiteUrl: data.websiteUrl ?? "",
          schoolTimingStart: data.schoolTimingStart ?? "",
          schoolTimingEnd: data.schoolTimingEnd ?? "",
          mediumOfInstruction: data.mediumOfInstruction ?? "",
        };
        setForm(fetched);
        setSavedForm(fetched);
      } catch (error) {
        const err = error as Error;
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toNullable = (val: string) => (val.trim() === "" ? null : val.trim());

  const handleSave = async () => {
    try {
      await updateSchool(schoolId, {
        name: form.name,
        address: toNullable(form.address),
        affiliationBoard: toNullable(form.affiliationBoard),
        establishmentYear: form.establishmentYear
          ? Number(form.establishmentYear)
          : null,
        schoolCode: toNullable(form.schoolCode),
        contact: toNullable(form.contact),
        emailOfficial: toNullable(form.emailOfficial),
        websiteUrl: toNullable(form.websiteUrl),
        schoolTimingStart: toNullable(form.schoolTimingStart),
        schoolTimingEnd: toNullable(form.schoolTimingEnd),
        mediumOfInstruction: toNullable(form.mediumOfInstruction),
      });
      setSavedForm(form);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
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
          px-8 py-5
          border-b border-[var(--border)]
          bg-[var(--surface-2)]
        "
      >
        <h2 className="text-lg font-semibold text-[var(--text)]">
          School Information
        </h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-full">
            <label className="label-base">School Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input-base pl-4"
            />
          </div>
          <div className="w-full">
            <label className="label-base">Affiliation Board</label>
            <input
              type="text"
              name="affiliationBoard"
              value={form.affiliationBoard}
              onChange={handleChange}
              className="input-base pl-4"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full">
            <label className="label-base">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="input-base pl-4"
            />
          </div>
          <div className="w-full">
            <label className="label-base">Establishment Year</label>
            <input
              type="number"
              name="establishmentYear"
              value={form.establishmentYear}
              onChange={handleChange}
              className="input-base pl-4"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full">
            <label className="label-base">Official Email</label>
            <input
              type="email"
              name="emailOfficial"
              value={form.emailOfficial}
              onChange={handleChange}
              className="input-base pl-4"
            />
          </div>
          <div className="w-full">
            <label className="label-base">Contact</label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className="input-base pl-4"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full">
            <label className="label-base">School Code</label>
            <input
              type="text"
              name="schoolCode"
              value={form.schoolCode}
              onChange={handleChange}
              className="input-base pl-4"
            />
          </div>
          <div className="w-full">
            <label className="label-base">Medium of Instruction</label>
            <input
              type="text"
              name="mediumOfInstruction"
              value={form.mediumOfInstruction}
              onChange={handleChange}
              className="input-base pl-4"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full">
            <label className="label-base">School Timing Start</label>
            <input
              type="time"
              name="schoolTimingStart"
              value={form.schoolTimingStart}
              onChange={handleChange}
              className="input-base pl-4"
            />
          </div>
          <div className="w-full">
            <label className="label-base">School Timing End</label>
            <input
              type="time"
              name="schoolTimingEnd"
              value={form.schoolTimingEnd}
              onChange={handleChange}
              className="input-base pl-4"
            />
          </div>
        </div>

        <div>
          <label className="label-base">Website URL</label>
          <input
            type="url"
            name="websiteUrl"
            value={form.websiteUrl}
            onChange={handleChange}
            className="input-base pl-4"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

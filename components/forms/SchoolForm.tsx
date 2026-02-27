"use client";

import React, { useState, useEffect } from "react";
import { getSchoolById, updateSchool } from "@/lib/api/School";
import { showToast } from "@/lib/utils/Toast";
import {
  School,
  BookMarked,
  MapPin,
  CalendarDays,
  Mail,
  Phone,
  Hash,
  Languages,
  Clock,
  Globe,
} from "lucide-react";

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
        showToast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
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
      showToast.success("School updated successfully");
    } catch (error) {
      const err = error as Error;
      showToast.error(err.message);
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
      <div className="px-8 py-5 border-b border-[var(--border)] bg-[var(--surface-2)]">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          School Information
        </h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-full">
            <label className="label-base">School Name</label>
            <div className="relative">
              <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-base pl-9"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="label-base">Affiliation Board</label>
            <div className="relative">
              <BookMarked className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
              <select
                name="affiliationBoard"
                value={form.affiliationBoard}
                onChange={handleChange}
                className="input-base pl-9"
              >
                <option value="">Select Board</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
                <option value="IB">IB</option>
                <option value="Cambridge">Cambridge</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="label-base">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-[var(--text-3)]" />
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                cols={4}
                className="input-base pl-9 resize-none py-2 w-full min-h-[120px]"
              />
            </div>
          </div>
          <div className="flex-[1]">
            <label className="label-base">Establishment Year</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                type="number"
                name="establishmentYear"
                value={form.establishmentYear}
                onChange={handleChange}
                className="input-base pl-9 w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full">
            <label className="label-base">Official Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                type="email"
                name="emailOfficial"
                value={form.emailOfficial}
                onChange={handleChange}
                className="input-base pl-9"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="label-base">Contact</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                className="input-base pl-9"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full">
            <label className="label-base">School Code</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                type="text"
                name="schoolCode"
                value={form.schoolCode}
                onChange={handleChange}
                className="input-base pl-9"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="label-base">Medium of Instruction</label>
            <div className="relative">
              <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
              <select
                name="mediumOfInstruction"
                value={form.mediumOfInstruction}
                onChange={handleChange}
                className="input-base pl-9"
              >
                <option value="">Select Medium</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
                <option value="Bengali">Bengali</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full">
            <label className="label-base">School Timing Start</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                type="time"
                name="schoolTimingStart"
                value={form.schoolTimingStart}
                onChange={handleChange}
                className="input-base pl-9"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="label-base">School Timing End</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                type="time"
                name="schoolTimingEnd"
                value={form.schoolTimingEnd}
                onChange={handleChange}
                className="input-base pl-9"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="label-base">Website URL</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
            <input
              type="url"
              name="websiteUrl"
              value={form.websiteUrl}
              onChange={handleChange}
              className="input-base pl-9"
            />
          </div>
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

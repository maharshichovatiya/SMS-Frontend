"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Building2,
} from "lucide-react";
import { SchoolFormData, schoolSchema } from "@/lib/validations/SchoolSchema";

export default function SchoolForm() {
  const [schoolId, setSchoolId] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: "",
      type: "",
      affiliationBoard: "",
      address: "",
      establishmentYear: "",
      emailOfficial: "",
      contact: "",
      schoolCode: "",
      mediumOfInstruction: "",
      schoolTimingStart: "",
      schoolTimingEnd: "",
      websiteUrl: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const id = localStorage.getItem("schoolId") ?? "";
        setSchoolId(id);
        const data = await getSchoolById(id);
        reset({
          name: data.name ?? "",
          type: data.type ?? "",
          affiliationBoard: data.affiliationBoard ?? "",
          address: data.address ?? "",
          establishmentYear: data.establishmentYear?.toString() ?? "",
          emailOfficial: data.emailOfficial ?? "",
          contact: data.contact ?? "",
          schoolCode: data.schoolCode ?? "",
          mediumOfInstruction: data.mediumOfInstruction ?? "",
          schoolTimingStart: data.schoolTimingStart ?? "",
          schoolTimingEnd: data.schoolTimingEnd ?? "",
          websiteUrl: data.websiteUrl ?? "",
        });
      } catch (error) {
        const err = error as Error;
        showToast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, []);

  const toNullable = (val?: string) =>
    !val || val.trim() === "" ? null : val.trim();

  const onSubmit = async (data: SchoolFormData) => {
    try {
      await updateSchool(schoolId, {
        name: data.name,
        type: toNullable(data.type),
        address: toNullable(data.address),
        affiliationBoard: toNullable(data.affiliationBoard),
        establishmentYear: data.establishmentYear
          ? Number(data.establishmentYear)
          : null,
        schoolCode: toNullable(data.schoolCode),
        contact: toNullable(data.contact),
        emailOfficial: toNullable(data.emailOfficial),
        websiteUrl: toNullable(data.websiteUrl),
        schoolTimingStart: toNullable(data.schoolTimingStart),
        schoolTimingEnd: toNullable(data.schoolTimingEnd),
        mediumOfInstruction: toNullable(data.mediumOfInstruction),
      });
      reset(data);
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

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-full">
            <label className="label-base">School Name</label>
            <div className="relative">
              <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                {...register("name")}
                type="text"
                placeholder="School Name"
                className={`input-base pl-9 ${errors.name ? "error" : ""}`}
              />
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.name?.message}
            </span>
          </div>
          <div className="w-full">
            <label className="label-base">Type</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
              <select
                {...register("type")}
                className={`input-base pl-9 appearance-none ${errors.type ? "error" : ""}`}
              >
                <option value="">Select Type</option>
                <option value="private">Private</option>
                <option value="govt">Government</option>
              </select>
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.type?.message}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-full">
            <label className="label-base">Affiliation Board</label>
            <div className="relative">
              <BookMarked className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
              <select
                {...register("affiliationBoard")}
                className={`input-base pl-9 appearance-none ${errors.affiliationBoard ? "error" : ""}`}
              >
                <option value="">Select Board</option>
                <option value="cbse">CBSE</option>
                <option value="icse">ICSE</option>
                <option value="state">State Board</option>
              </select>
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.affiliationBoard?.message}
            </span>
          </div>
          <div className="w-full">
            <label className="label-base">Medium of Instruction</label>
            <div className="relative">
              <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
              <select
                {...register("mediumOfInstruction")}
                className={`input-base pl-9 appearance-none ${errors.mediumOfInstruction ? "error" : ""}`}
              >
                <option value="">Select Medium</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="gujarati">Gujarati</option>
                <option value="other">Other</option>
              </select>
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.mediumOfInstruction?.message}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-1">
            <label className="label-base">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-[var(--text-3)]" />
              <textarea
                {...register("address")}
                rows={2}
                className={`input-base pl-9 resize-none py-2 w-full min-h-[120px] ${errors.address ? "error" : ""}`}
              />
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.address?.message}
            </span>
          </div>
          <div className="flex-1">
            <label className="label-base">Establishment Year</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
              <select
                {...register("establishmentYear")}
                className={`input-base pl-9 appearance-none ${errors.establishmentYear ? "error" : ""}`}
              >
                <option value="">Select Year</option>
                {Array.from(
                  { length: new Date().getFullYear() - 1800 },
                  (_, i) => new Date().getFullYear() - 1 - i,
                ).map(year => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.establishmentYear?.message}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-full">
            <label className="label-base">Official Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                {...register("emailOfficial")}
                type="email"
                placeholder="school@example.com"
                className={`input-base pl-9 ${errors.emailOfficial ? "error" : ""}`}
              />
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.emailOfficial?.message}
            </span>
          </div>
          <div className="w-full">
            <label className="label-base">Contact</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                {...register("contact")}
                type="text"
                placeholder="98765 43210"
                className={`input-base pl-9 ${errors.contact ? "error" : ""}`}
              />
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.contact?.message}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-full">
            <label className="label-base">School Code</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                {...register("schoolCode")}
                type="text"
                placeholder="e.g. SCH-001"
                className={`input-base pl-9 ${errors.schoolCode ? "error" : ""}`}
              />
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.schoolCode?.message}
            </span>
          </div>
          <div className="w-full">
            <label className="label-base">School Timing Start</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                {...register("schoolTimingStart")}
                type="time"
                className={`input-base pl-9 ${errors.schoolTimingStart ? "error" : ""}`}
              />
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.schoolTimingStart?.message}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-full">
            <label className="label-base">Website URL</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                {...register("websiteUrl")}
                type="url"
                placeholder="https://www.school.com"
                className={`input-base pl-9 ${errors.websiteUrl ? "error" : ""}`}
              />
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.websiteUrl?.message}
            </span>
          </div>
          <div className="w-full">
            <label className="label-base">School Timing End</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                {...register("schoolTimingEnd")}
                type="time"
                className={`input-base pl-9 ${errors.schoolTimingEnd ? "error" : ""}`}
              />
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.schoolTimingEnd?.message}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

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
  ChevronDown,
  Pencil,
} from "lucide-react";
import { SchoolFormData, schoolSchema } from "@/lib/validations/SchoolSchema";
import Modal from "@/components/ui/Modal";

export default function SchoolForm() {
  const [schoolId, setSchoolId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [savedData, setSavedData] = useState<SchoolFormData>({
    name: "",
    type: "",
    affiliationBoard: "",
    address: "",
    establishmentYear: "",
    emailOfficial: "",
    emailAdmin: "",
    contact: "",
    schoolCode: "",
    mediumOfInstruction: "",
    schoolTimingStart: "",
    schoolTimingEnd: "",
    websiteUrl: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: savedData,
    mode: "onSubmit",
  });

  const schoolTimingStart = watch("schoolTimingStart");

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const id = localStorage.getItem("schoolId") ?? "";
        setSchoolId(id);
        const data = await getSchoolById(id);
        const mapped: SchoolFormData = {
          name: data.name ?? "",
          type: data.type ?? "",
          affiliationBoard: data.affiliationBoard ?? "",
          address: data.address ?? "",
          establishmentYear: data.establishmentYear?.toString() ?? "",
          emailOfficial: data.emailOfficial ?? "",
          emailAdmin: data.emailAdmin ?? "",
          contact: data.contact ?? "",
          schoolCode: data.schoolCode ?? "",
          mediumOfInstruction: data.mediumOfInstruction ?? "",
          schoolTimingStart: data.schoolTimingStart ?? "",
          schoolTimingEnd: data.schoolTimingEnd ?? "",
          websiteUrl: data.websiteUrl ?? "",
        };
        setSavedData(mapped);
        reset(mapped);
      } catch (error) {
        let message = "Something went wrong";
        if (error && typeof error === "object" && "message" in error) {
          const errorMsg = (error as { message: unknown }).message;
          if (Array.isArray(errorMsg) && errorMsg.length > 0) {
            message = errorMsg[0] || "Something went wrong";
          } else if (typeof errorMsg === "string") {
            message = errorMsg;
          }
        }
        showToast.error(message);
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
        emailAdmin: toNullable(data.emailAdmin),
        websiteUrl: toNullable(data.websiteUrl),
        schoolTimingStart: toNullable(data.schoolTimingStart),
        schoolTimingEnd: toNullable(data.schoolTimingEnd),
        mediumOfInstruction: toNullable(data.mediumOfInstruction),
      });
      setSavedData({ ...data });
      reset(data);
      showToast.success("School updated successfully");
      setIsEditOpen(false);
    } catch (error) {
      let message = "Something went wrong";
      if (error && typeof error === "object" && "message" in error) {
        const errorMsg = (error as { message: unknown }).message;
        if (Array.isArray(errorMsg) && errorMsg.length > 0) {
          message = errorMsg[0] || "Something went wrong";
        } else if (typeof errorMsg === "string") {
          message = errorMsg;
        }
      }
      showToast.error(message);
    }
  };

  const handleOpenEdit = () => {
    reset(savedData);
    setIsEditOpen(true);
  };

  if (loading)
    return <div className="p-4 text-[var(--text-2)]">Loading...</div>;

  return (
    <>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow)] overflow-hidden">
        <div className="px-8 py-5 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text)]">
            School Information
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
          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">School Name</label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedData.name}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="label-base">Type</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedData.type}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">Affiliation Board</label>
              <div className="relative">
                <BookMarked className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedData.affiliationBoard}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="label-base">Medium of Instruction</label>
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedData.mediumOfInstruction}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <label className="label-base">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-[var(--text-3)]" />
                <textarea
                  value={savedData.address}
                  disabled
                  rows={2}
                  className="input-base pl-9 resize-none py-2 w-full min-h-[120px] bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="label-base">Establishment Year</label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedData.establishmentYear}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">Official Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedData.emailOfficial}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="label-base">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedData.emailAdmin}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">Contact</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedData.contact}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="label-base">School Code</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedData.schoolCode}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">School Timing Start</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedData.schoolTimingStart}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="label-base">School Timing End</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedData.schoolTimingEnd}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="text"
                  value={savedData.websiteUrl}
                  disabled
                  className="input-base pl-9 bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                />
              </div>
            </div>
            <div className="w-full" />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => !isSubmitting && setIsEditOpen(false)}
        title="Edit School Information"
        className="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              disabled={isSubmitting}
              className="px-5 py-3 rounded-[var(--radius-sm)] cursor-pointer border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--text-2)] hover:bg-[var(--bg-2)] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              form="school-edit-form"
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
          id="school-edit-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">
                School Name <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  {...register("name")}
                  type="text"
                  placeholder="School Name"
                  className={`input-base pl-9 ${errors.name ? "error" : ""}`}
                />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
                {errors.name?.message}
              </span>
            </div>
            <div className="w-full">
              <label className="label-base">
                Type <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
                <select
                  {...register("type")}
                  className={`input-base pl-9 pr-9 appearance-none ${errors.type ? "error" : ""}`}
                >
                  <option value="">Select Type</option>
                  <option value="private">Private</option>
                  <option value="govt">Government</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
                {errors.type?.message}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">
                Affiliation Board{" "}
                <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <BookMarked className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
                <select
                  {...register("affiliationBoard")}
                  className={`input-base pl-9 pr-9 appearance-none ${errors.affiliationBoard ? "error" : ""}`}
                >
                  <option value="">Select Board</option>
                  <option value="cbse">CBSE</option>
                  <option value="icse">ICSE</option>
                  <option value="state">State Board</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
                {errors.affiliationBoard?.message}
              </span>
            </div>
            <div className="w-full">
              <label className="label-base">
                Medium of Instruction{" "}
                <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
                <select
                  {...register("mediumOfInstruction")}
                  className={`input-base pl-9 pr-9 appearance-none ${errors.mediumOfInstruction ? "error" : ""}`}
                >
                  <option value="">Select Medium</option>
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="gujarati">Gujarati</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
                {errors.mediumOfInstruction?.message}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <label className="label-base">
                Address <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-[var(--text-3)]" />
                <textarea
                  {...register("address")}
                  rows={2}
                  className={`input-base pl-9 resize-none py-2 w-full min-h-[120px] ${errors.address ? "error" : ""}`}
                />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
                {errors.address?.message}
              </span>
            </div>
            <div className="flex-1 mt-3">
              <label className="label-base">Establishment Year</label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
                <select
                  {...register("establishmentYear")}
                  className={`input-base pl-9 pr-9 appearance-none ${errors.establishmentYear ? "error" : ""}`}
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
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none z-10" />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
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
                  type="text"
                  placeholder="school@example.com"
                  className={`input-base pl-9 ${errors.emailOfficial ? "error" : ""}`}
                />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
                {errors.emailOfficial?.message}
              </span>
            </div>
            <div className="w-full">
              <label className="label-base">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  {...register("emailAdmin")}
                  type="text"
                  placeholder="admin@school.com"
                  className={`input-base pl-9 ${errors.emailAdmin ? "error" : ""}`}
                />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
                {errors.emailAdmin?.message}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">Contact</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  {...register("contact")}
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  onKeyDown={e => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      ![
                        "Backspace",
                        "Delete",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className={`input-base pl-9 ${errors.contact ? "error" : ""}`}
                />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
                {errors.contact?.message}
              </span>
            </div>
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
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
                {errors.schoolCode?.message}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-full">
              <label className="label-base">School Timing Start</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  {...register("schoolTimingStart")}
                  type="time"
                  onInvalid={e => e.preventDefault()}
                  onChange={e => {
                    register("schoolTimingStart").onChange(e);
                    setValue("schoolTimingEnd", "", {
                      shouldValidate: false,
                      shouldDirty: true,
                    });
                  }}
                  className={`input-base pl-9 ${errors.schoolTimingStart ? "error" : ""}`}
                />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
                {errors.schoolTimingStart?.message}
              </span>
            </div>
            <div className="w-full">
              <label className="label-base">
                School Timing End
                <span className="text-xs font-normal text-[var(--text-3)] ml-1">
                  (max 8 hrs)
                </span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  {...register("schoolTimingEnd")}
                  type="time"
                  onInvalid={e => e.preventDefault()}
                  disabled={!schoolTimingStart}
                  className={`input-base pl-9 ${
                    !schoolTimingStart
                      ? "bg-[var(--bg-2)] text-[var(--text-2)] cursor-not-allowed"
                      : ""
                  } ${errors.schoolTimingEnd ? "error" : ""}`}
                />
              </div>
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
                {errors.schoolTimingEnd?.message}
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
              <span className="text-xs text-[var(--rose)] min-h-[16px] block">
                {errors.websiteUrl?.message}
              </span>
            </div>
            <div className="w-full" />
          </div>
        </form>
      </Modal>
    </>
  );
}

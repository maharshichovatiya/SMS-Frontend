"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Mail, Lock, User, Phone, School, Eye, EyeOff } from "lucide-react";
import { PersonalDetails, SchoolDetails } from "@/lib/validations/SignUpSchema";

const baseInput =
  "w-full h-12 bg-[var(--color-surface-2)] border rounded-xl text-base text-[var(--color-text)] placeholder:text-[var(--color-text-3)] outline-none transition-all focus:bg-white focus:ring-3 focus:ring-[var(--color-blue)]/10";

const inputClass = (hasError: boolean, extra = "pl-10") =>
  `${baseInput} ${extra} ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-[var(--color-border)] focus:border-[var(--color-border-focus)]"
  }`;

const selectClass = (hasError: boolean) =>
  `${baseInput} px-4 cursor-pointer ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-[var(--color-border)] focus:border-[var(--color-border-focus)]"
  }`;

const errorMsg = (msg?: string) =>
  msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

interface PersonalFormProps {
  form: UseFormReturn<PersonalDetails>;
  showPass: boolean;
  setShowPass: (val: boolean) => void;
  pwStrength: number;
  pwColors: string[];
  pwLabels: string[];
  roles: Array<{ id: string; roleName: string; status: string }>;
  rolesLoading: boolean;
}

export function PersonalDetailsForm({
  form,
  showPass,
  setShowPass,
  pwStrength,
  pwColors,
  pwLabels,
}: PersonalFormProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = form;
  const password = watch("password") ?? "";

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-widest text-[#9aa5c4] mb-3">
        Personal Information
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            First Name <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)] pointer-events-none" />
            <input
              type="text"
              placeholder="John"
              maxLength={50}
              {...register("firstName", {
                onChange: e => {
                  e.target.value = e.target.value
                    .replace(/[^a-zA-Z\s]/g, "")
                    .slice(0, 50);
                },
              })}
              className={inputClass(!!errors.firstName)}
            />
          </div>
          {errorMsg(errors.firstName?.message)}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Middle Name{" "}
            <span className="text-red-500 text-lg opacity-0">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)] pointer-events-none" />
            <input
              type="text"
              placeholder="William"
              maxLength={50}
              {...register("middleName", {
                onChange: e => {
                  e.target.value = e.target.value
                    .replace(/[^a-zA-Z\s]/g, "")
                    .slice(0, 50);
                },
              })}
              className={`${baseInput} pl-10 border-[var(--color-border)] focus:border-[var(--color-border-focus)]`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Last Name <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)] pointer-events-none" />
            <input
              type="text"
              placeholder="Smith"
              maxLength={50}
              {...register("lastName", {
                onChange: e => {
                  e.target.value = e.target.value
                    .replace(/[^a-zA-Z\s]/g, "")
                    .slice(0, 50);
                },
              })}
              className={inputClass(!!errors.lastName)}
            />
          </div>
          {errorMsg(errors.lastName?.message)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Work Email <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)] pointer-events-none" />
            <input
              type="email"
              placeholder="admin@school.edu"
              maxLength={100}
              {...register("email")}
              className={inputClass(!!errors.email)}
            />
          </div>
          {errorMsg(errors.email?.message)}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Phone <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)] pointer-events-none" />
            <input
              type="tel"
              placeholder="(555) 000-0000"
              maxLength={10}
              {...register("phone", {
                onChange: e => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    e.target.value = value;
                  } else {
                    e.target.value = value.slice(0, 10);
                  }
                },
              })}
              className={inputClass(!!errors.phone)}
            />
          </div>
          {errorMsg(errors.phone?.message)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-3">
        <div></div>
        <div></div>
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-[#9aa5c4] mb-3">
        Security
      </p>
      <div className="grid grid-cols-1 mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text)] mb-2">
          Password <span className="text-red-500 text-lg">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)] pointer-events-none" />
          <input
            type={showPass ? "text" : "password"}
            placeholder="Min. 8 characters"
            {...register("password")}
            className={inputClass(!!errors.password, "pl-10 pr-12")}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] hover:text-[var(--color-text-2)] transition-colors p-1 rounded-lg hover:bg-[var(--color-surface-2)]"
          >
            {showPass ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errorMsg(errors.password?.message)}

        {password.length > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex gap-1.5 flex-1">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    pwStrength >= i
                      ? pwColors[pwStrength]
                      : "bg-[var(--border)]"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[var(--text-2)] whitespace-nowrap">
              {pwLabels[pwStrength]}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

interface SchoolFormProps {
  form: UseFormReturn<SchoolDetails>;
}

export function SchoolDetailsForm({ form }: SchoolFormProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = form;
  const adminEmail = watch("adminEmail");

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-widest text-[#9aa5c4] mb-3">
        School Information
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            School Name <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)] pointer-events-none" />
            <input
              type="text"
              placeholder="Riverside Academy"
              maxLength={100}
              {...register("schoolName", {
                onChange: e => {
                  e.target.value = e.target.value
                    .replace(/[^a-zA-Z0-9\s&.,'-]/g, "")
                    .slice(0, 100);
                },
              })}
              className={inputClass(!!errors.schoolName)}
            />
          </div>
          {errorMsg(errors.schoolName?.message)}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            School Type <span className="text-red-500 text-lg">*</span>
          </label>
          <select
            {...register("schoolType")}
            className={selectClass(!!errors.schoolType)}
          >
            <option value="">Select Type</option>
            <option value="private">Private</option>
            <option value="govt">Government</option>
          </select>
          {errorMsg(errors.schoolType?.message)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Full Address <span className="text-red-500 text-lg">*</span>
          </label>
          <textarea
            placeholder="123 School Street, City, State - 123456"
            maxLength={200}
            {...register("address", {
              onChange: e => {
                e.target.value = e.target.value
                  .replace(/[^a-zA-Z0-9\s,.-/#]/g, "")
                  .slice(0, 200);
              },
            })}
            rows={3}
            className={`w-full bg-[var(--color-surface-2)] border rounded-xl text-base text-[var(--color-text)] placeholder:text-[var(--color-text-3)] outline-none transition-all focus:bg-white focus:ring-3 focus:ring-[var(--color-blue)]/10 p-4 ${
              errors.address
                ? "border-red-500 focus:border-red-500"
                : "border-[var(--color-border)] focus:border-[var(--color-border-focus)]"
            }`}
          />
          {errorMsg(errors.address?.message)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Official Email <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)] pointer-events-none" />
            <input
              type="email"
              placeholder="contact@school.edu"
              maxLength={100}
              {...register("officialEmail")}
              className={inputClass(!!errors.officialEmail)}
            />
          </div>
          {errorMsg(errors.officialEmail?.message)}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Contact Number <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)] pointer-events-none" />
            <input
              type="tel"
              placeholder="(555) 000-0000"
              maxLength={10}
              {...register("contactNumber", {
                onChange: e => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    e.target.value = value;
                  } else {
                    e.target.value = value.slice(0, 10);
                  }
                },
              })}
              className={inputClass(!!errors.contactNumber)}
            />
          </div>
          {errorMsg(errors.contactNumber?.message)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Medium of Instruction{" "}
            <span className="text-red-500 text-lg">*</span>
          </label>
          <select
            {...register("mediumOfInstruction")}
            className={selectClass(!!errors.mediumOfInstruction)}
          >
            <option value="">Select Medium</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="gujarati">Gujarati</option>
            <option value="other">Other</option>
          </select>
          {errorMsg(errors.mediumOfInstruction?.message)}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Affiliation Board <span className="text-red-500 text-lg">*</span>
          </label>
          <select
            {...register("affiliationBoard")}
            className={selectClass(!!errors.affiliationBoard)}
          >
            <option value="">Select Board</option>
            <option value="cbse">CBSE</option>
            <option value="icse">ICSE</option>
            <option value="state">State Board</option>
          </select>
          {errorMsg(errors.affiliationBoard?.message)}
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-[#9aa5c4] mb-3 mt-4">
        Additional Information (Optional)
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            School Code
          </label>
          <input
            type="text"
            placeholder="Auto-generated or manual"
            maxLength={20}
            {...register("schoolCode", {
              onChange: e => {
                e.target.value = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "")
                  .slice(0, 20);
              },
            })}
            className={`${baseInput} px-4 border-[var(--color-border)] focus:border-[var(--color-border-focus)]`}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Establishment Year
          </label>
          <select
            {...register("establishmentYear")}
            className={selectClass(!!errors.establishmentYear)}
          >
            <option value="">Select Year</option>
            {Array.from({ length: new Date().getFullYear() - 1799 }, (_, i) => {
              const year = 1800 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)] pointer-events-none" />
            <input
              type="email"
              placeholder="Defaults to your email"
              maxLength={100}
              {...register("adminEmail")}
              className={`${baseInput} pl-10 ${errors.adminEmail ? "border-red-500 focus:border-red-500" : "border-[var(--color-border)] focus:border-[var(--color-border-focus)]"}`}
            />
          </div>
          {errors.adminEmail &&
            adminEmail &&
            errorMsg(errors.adminEmail?.message)}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Website URL
          </label>
          <input
            type="url"
            placeholder="https://edu.com"
            maxLength={200}
            {...register("websiteUrl", {
              onChange: e => {
                let value = e.target.value;
                if (
                  value &&
                  !value.startsWith("http://") &&
                  !value.startsWith("https://")
                ) {
                  value = "https://" + value;
                }
                if (value.length <= 200) {
                  e.target.value = value;
                } else {
                  e.target.value = value.slice(0, 200);
                }
              },
            })}
            className={`${baseInput} px-4 border-[var(--color-border)] focus:border-[var(--color-border-focus)]`}
          />
        </div>
      </div>
    </>
  );
}

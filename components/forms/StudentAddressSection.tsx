"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Home } from "lucide-react";
import { StudentFormValues } from "@/lib/validations/StudentSchema";

interface StudentAddressSectionProps {
  register: UseFormRegister<StudentFormValues>;
  errors: FieldErrors<StudentFormValues>;
  sameAsPermanent: boolean;
}

export default function StudentAddressSection({
  register,
  errors,
  sameAsPermanent,
}: StudentAddressSectionProps) {
  return (
    <div className="pt-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="section-label">Address Information</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-1">
          <label className="label-base">Current Address</label>
          <div className="relative">
            <Home
              className="absolute left-3 top-3 pt-2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <textarea
              {...register("currentAddress")}
              placeholder="Enter your current address..."
              rows={4}
              style={{ minHeight: "90px" }}
              className={`input-base pl-9 pt-2 resize-none ${errors.currentAddress ? "error" : ""}`}
            />
          </div>
          {errors.currentAddress && (
            <span className="text-xs text-[var(--rose)]">
              {errors.currentAddress.message}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 my-2">
          <input
            type="checkbox"
            id="sameAsPermanent"
            {...register("sameAsPermanent")}
            className="w-4 h-4 text-[var(--blue)] bg-[var(--bg-2)] border-[var(--border)] rounded focus:ring-[var(--blue-light)] focus:ring-2 cursor-pointer"
          />
          <label
            htmlFor="sameAsPermanent"
            className="text-sm text-[var(--text-2)] cursor-pointer select-none"
          >
            Permanent address same as current address
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">Permanent Address</label>
          <div className="relative">
            <Home
              className="absolute left-3 top-3 pt-2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <textarea
              {...register("permanentAddress")}
              placeholder="Enter your permanent address..."
              rows={4}
              style={{ minHeight: "90px" }}
              disabled={sameAsPermanent}
              className={`input-base pl-9 pt-2 resize-none ${errors.permanentAddress ? "error" : ""} ${sameAsPermanent ? "opacity-60 cursor-not-allowed" : ""}`}
            />
          </div>
          {errors.permanentAddress && (
            <span className="text-xs text-[var(--rose)]">
              {errors.permanentAddress.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Lock, Eye, EyeOff } from "lucide-react";
import { ResetPasswordFormData } from "@/lib/validations/resetPasswordSchema";

const baseInput =
  "w-full h-12 bg-[var(--color-surface-2)] border rounded-xl text-base text-[var(--color-text)] placeholder:text-[var(--color-text-3)] outline-none transition-all focus:bg-white focus:ring-3 focus:ring-[var(--color-blue)]/10 pl-10 pr-12";

const fieldInput = (hasError: boolean) =>
  `${baseInput} ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-[var(--color-border)] focus:border-[var(--color-border-focus)]"
  }`;

interface ResetPasswordFormProps {
  form: UseFormReturn<ResetPasswordFormData>;
  showPass: boolean;
  setShowPass: (val: boolean) => void;
  showConfirmPass: boolean;
  setShowConfirmPass: (val: boolean) => void;
}

export function ResetPasswordForm({
  form,
  showPass,
  setShowPass,
  showConfirmPass,
  setShowConfirmPass,
}: ResetPasswordFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-widest text-[#9aa5c4] mb-5 mt-8">
        New Password
      </p>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text)] mb-2">
            New Password <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)] pointer-events-none" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters"
              {...register("password")}
              className={fieldInput(!!errors.password)}
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
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text)] mb-2">
            Confirm New Password <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)] pointer-events-none" />
            <input
              type={showConfirmPass ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className={fieldInput(!!errors.confirmPassword)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] hover:text-[var(--color-text-2)] transition-colors p-1 rounded-lg hover:bg-[var(--color-surface-2)]"
            >
              {showConfirmPass ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Lock,
  CheckCircle,
  Shield,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/lib/validations/resetPasswordSchema";
import { ResetPasswordForm } from "@/components/forms/resetPasswordForm";
import toast from "react-hot-toast";
import { resetPassword } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);

    const token = searchParams.get("token");

    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword({
        token,
        newPassword: data.password,
      });

      if (result.statusCode === 200) {
        toast.success("Password reset successfully");
        router.push("/signin");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  const isComplete = !!password && !!confirmPassword && password.length >= 8;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="w-full mx-2 sm:mx-5 md:mx-7 lg:mx-12 flex rounded-[28px] overflow-hidden shadow-[0_0_0_1px_rgba(61,108,244,0.08),0_32px_80px_rgba(61,108,244,0.13)] bg-white flex-col lg:flex-row">
        <div className="hidden lg:flex flex-col justify-start gap-10 w-[46%] bg-gradient-to-br from-[var(--blue)] to-[var(--indigo)] p-12 relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20"
              style={{ boxShadow: "var(--shadow-blue)" }}
            >
              <GraduationCap
                className="w-5 h-5"
                style={{ color: "var(--text-inverse)" }}
              />
            </div>
            <div>
              <p className="text-[var(--text-inverse)] font-bold text-[15px]">
                School Management System
              </p>
              <p className="text-[var(--text-inverse)]/50 text-[10px] uppercase tracking-widest font-medium">
                Password Reset
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-[var(--text-inverse)] text-[36px] font-extrabold leading-[1.1] tracking-tight">
              Reset Your Password
              <br />
              <span className="text-[var(--text-inverse)]/50 font-normal">
                and regain access to your account.
              </span>
            </h2>
            <p className="text-[var(--text-inverse)] mt-1.5 leading-relaxed max-w-[330px]">
              Enter your email address and create a new secure password. Make
              sure its strong and memorable.
            </p>
            <div className="space-y-3 text-[var(--text-inverse)] text-[15px]">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/15">
                  <Lock
                    className="w-4 h-4"
                    style={{ color: "var(--text-inverse)" }}
                  />
                </span>
                <span>Secure password encryption</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/15">
                  <CheckCircle
                    className="w-4 h-4"
                    style={{ color: "var(--text-inverse)" }}
                  />
                </span>
                <span>Instant account recovery</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/15">
                  <Shield
                    className="w-4 h-4"
                    style={{ color: "var(--text-inverse)" }}
                  />
                </span>
                <span>Enhanced security features</span>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="w-full lg:w-[54%]">
          <div className="p-5 lg:p-12">
            <div className="flex flex-col gap-6 mb-10 pb-8 border-b border-[var(--border)]">
              <div>
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--blue)] mb-3">
                  <span className="w-5 h-[2px] rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)]" />
                  Reset Password
                </span>
                <h1 className="text-3xl font-extrabold text-[var(--text)] tracking-tight leading-tight">
                  Create a new password
                </h1>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ResetPasswordForm
                form={form}
                showPass={showPass}
                setShowPass={setShowPass}
                showConfirmPass={showConfirmPass}
                setShowConfirmPass={setShowConfirmPass}
              />

              <div className="flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[var(--border)]">
                <Link
                  href="/signin"
                  className="flex-shrink-0 h-13 px-6 border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-[var(--color-surface-2)] transition-all duration-200 min-w-[140px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign in
                </Link>

                <button
                  type="submit"
                  disabled={loading || !isComplete}
                  className="flex-shrink-0 h-13 px-8 bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)] text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 relative overflow-hidden min-w-[180px]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Resetting…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Reset Password <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

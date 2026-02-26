"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/ForgotPasswordSchema";
import toast from "react-hot-toast";
import { forgotPassword } from "@/lib/api/Auth";

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setSentEmail(data.email);
    const result = await forgotPassword(data);

    if (result.success) {
      toast.success("Reset link sent to your email");
    } else {
      toast.error(result.message);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full flex flex-col items-center text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: "var(--grad-primary)" }}
        >
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>

        <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue)] mb-3">
          <span className="inline-block w-5 h-0.5 rounded-full bg-[var(--grad-primary)]" />
          Email Sent Successfully
          <span className="inline-block w-5 h-0.5 rounded-full bg-[var(--grad-primary)]" />
        </div>

        <h1 className="text-3xl font-extrabold text-[var(--text)] tracking-tight leading-tight mb-3">
          Check your inbox
        </h1>
        <p className="text-sm text-[var(--text-2)] leading-relaxed mb-2 max-w-xs">
          We&apos;ve sent a password reset link to
        </p>
        <p className="text-sm font-semibold text-[var(--blue)] mb-6">
          {sentEmail}
        </p>
        <p className="text-xs text-[var(--text-2)] leading-relaxed mb-8 max-w-xs">
          Click the link in the email to reset your password. The link will
          expire in 15 minutes.
        </p>

        <Link
          href="/signin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-2)] hover:text-[var(--text)] transition-colors duration-[var(--duration)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue)] mb-4">
        <span className="inline-block w-5 h-0.5 rounded-full bg-[var(--grad-primary)]" />
        Password Recovery
      </div>

      <h1 className="text-3xl font-extrabold text-[var(--text)] tracking-tight leading-tight mb-2">
        Forgot password?
      </h1>
      <p className="text-sm text-[var(--text-2)] leading-relaxed mb-8">
        No worries. Enter your admin email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="label-base">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none" />
            <input
              type="email"
              placeholder="admin@school.edu"
              {...register("email")}
              className={`input-base ${errors.email ? "border-red-400 focus:ring-red-300" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending link…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Send Reset Link <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </button>

        <div className="flex items-center justify-center pt-1">
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-2)] hover:text-[var(--text)] transition-colors duration-[var(--duration)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

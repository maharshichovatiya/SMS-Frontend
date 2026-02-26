"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInSchema,
  type SignInFormValues,
} from "@/lib/validations/SignInSchema";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/Auth";
import { showToast } from "@/lib/utils/Toast";
import toast from "react-hot-toast";

export default function SignInForm() {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const result = await login(data);

      if (result.statusCode === 200) {
        showToast.success("OTP sent to your login email");

        if (result?.data?.data?.email) {
          localStorage.setItem("email", result?.data?.data?.email);
        }

        router.push("/verify-otp");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error("sign in failed");
    }
  };

  return (
    <div className="w-full">
      <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue)] mb-4">
        <span className="inline-block w-5 h-0.5 rounded-full bg-[var(--grad-primary)]" />
        Admin Access
      </div>

      <h1 className="text-3xl font-extrabold text-[var(--text)] tracking-tight leading-tight mb-2">
        Welcome back
      </h1>
      <p className="text-sm text-[var(--text-2)] leading-relaxed mb-8">
        Sign in to access your school dashboard.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
            Email Address <span className="text-red-500  text-lg">*</span>
          </label>
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

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
              Password <span className="text-red-500  text-lg">*</span>
            </label>
            <button
              onClick={() => router.push("forgot-password")}
              type="button"
              className="text-xs text-[var(--blue)] font-semibold hover:underline underline-offset-2"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••••"
              {...register("password")}
              className={`input-base has-right ${errors.password ? "border-red-400 focus:ring-red-300" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-2)] p-1.5 rounded-[var(--radius-xs)] hover:bg-[var(--bg-2)] transition-colors duration-[var(--duration)]"
            >
              {showPass ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--text-2)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[var(--blue)] hover:underline underline-offset-2"
            >
              Sign up
            </Link>
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-4"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

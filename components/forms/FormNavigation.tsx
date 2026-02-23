import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  loading: boolean;
  isPersonalStepComplete: boolean;
  isSchoolStepComplete: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function FormNavigation({
  currentStep,
  loading,
  isPersonalStepComplete,
  isSchoolStepComplete,
  onPrev,
  onNext,
}: FormNavigationProps) {
  return (
    <div className="flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
      <div className="flex items-center gap-3">
        {currentStep === 2 && (
          <button
            type="button"
            onClick={onPrev}
            className="h-13 px-6 border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-[var(--color-surface-2)] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <p className="text-[var(--text-md)]">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline underline-offset-2 rounded-2xl"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="flex gap-3">
        {currentStep === 1 ? (
          <button
            type="button"
            onClick={onNext}
            disabled={loading || !isPersonalStepComplete}
            className="flex-shrink-0 h-13 px-8 bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)] text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 relative overflow-hidden min-w-[140px]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Next…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Next Step <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading || !isSchoolStepComplete}
            className="flex-shrink-0 h-13 px-8 bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)] text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 relative overflow-hidden min-w-[180px]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create Account <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MailCheck,
  ShieldCheck,
  Clock,
  RefreshCw,
  GraduationCap,
  PartyPopper,
} from "lucide-react";
import { verifyOtp } from "@/lib/api/Auth";
import { showToast } from "@/lib/utils/Toast";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(90);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef<HTMLInputElement[]>([]);

  const code = otp.join("");
  const filled = code.length === 4;

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  function focus(i: number) {
    inputs.current[i]?.focus();
  }

  function handleChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError("");
    if (val) focus(Math.min(i + 1, 3));
    else focus(Math.max(i - 1, 0));
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    setOtp([...digits.padEnd(4).split("")].map((d, i) => digits[i] ?? ""));
    focus(Math.min(digits.length, 3));
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();

    if (!filled) return;

    setLoading(true);
    setError("");

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const result = await verifyOtp({
        userId,
        otp: code,
      });

      if (result.statusCode === 200) {
        showToast.success("Email verified successfully!");
        setVerified(true);
        localStorage.removeItem("userId");
      } else {
        setError(result.message || "Incorrect code. Please try again.");
        setOtp(["", "", "", ""]);
        focus(0);
      }
    } catch (error) {
      showToast.apiError(error);
      setError("Verification failed. Please try again.");
      setOtp(["", "", "", ""]);
      focus(0);
    }

    setLoading(false);
  }

  function handleResend() {
    setOtp(["", "", "", ""]);
    setError("");
    setTimer(30);
    focus(0);
  }

  const features = [
    { icon: <Clock className="w-4 h-4" />, text: "Code expires in 10 minutes" },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      text: "256-bit encrypted & secure",
    },
    {
      icon: <RefreshCw className="w-4 h-4" />,
      text: "Resend after 30 seconds",
    },
  ];

  if (verified) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div
          className="w-full max-w-sm rounded-[var(--radius-xl)] overflow-hidden"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div className="px-10 py-12 flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center mb-8">
              <div
                className="absolute w-28 h-28 rounded-full animate-ping opacity-30"
                style={{ background: "var(--green-muted)" }}
              />
              <div
                className="absolute w-20 h-20 rounded-full"
                style={{ background: "var(--green-light)" }}
              />
              <div
                className="relative text-white w-18 h-18 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--grad-success)",
                  boxShadow: "var(--shadow-green)",
                }}
              >
                <MailCheck />
              </div>
            </div>

            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 mb-4 border"
              style={{
                background: "var(--green-light)",
                borderColor: "var(--green-muted)",
                color: "var(--green)",
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Identity Verified
              </span>
            </span>

            <h2
              className="text-2xl font-extrabold tracking-tight mb-2"
              style={{ color: "var(--text)" }}
            >
              You&apos;re all set! <PartyPopper size={16} className="inline" />
            </h2>
            <p
              className="text-sm leading-relaxed mb-8 max-w-xs"
              style={{ color: "var(--text-2)" }}
            >
              Email verified. Your school admin account is now fully active and
              ready to use.
            </p>

            <Link
              href="/dashboard"
              className="flex w-full h-12 items-center justify-center font-bold text-sm rounded-[var(--radius-sm)] transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "var(--grad-success)",
                color: "var(--text-inverse)",
                boxShadow: "var(--shadow-green)",
              }}
            >
              Go to Dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      <main className="flex-1 flex items-center justify-center py-8">
        <div
          className="w-full max-w-[980px] flex flex-col lg:flex-row rounded-[var(--radius-xl)] overflow-hidden"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div
            className="hidden lg:flex flex-col justify-between w-[42%] p-12 relative overflow-hidden border-r"
            style={{
              background:
                "linear-gradient(135deg, var(--bg) 0%, var(--blue-light) 100%)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--blue-glow) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                maskImage:
                  "radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)",
              }}
            />

            <div className="relative z-10 flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center"
                style={{
                  background: "var(--grad-primary)",
                  boxShadow: "var(--shadow-blue)",
                }}
              >
                <GraduationCap
                  className="w-5 h-5"
                  style={{ color: "var(--text-inverse)" }}
                />
              </div>
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: "var(--text)" }}
                >
                  School Management System
                </p>
                <p
                  className="text-xs uppercase tracking-widest font-medium"
                  style={{ color: "var(--text-3)" }}
                >
                  Admin Portal
                </p>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative mb-8 flex items-center justify-center">
                <div
                  className="absolute w-32 h-32 rounded-full border-2 animate-ping opacity-30"
                  style={{ borderColor: "var(--blue-muted)" }}
                />
                <div
                  className="absolute w-24 h-24 rounded-full border"
                  style={{ borderColor: "var(--blue-muted)" }}
                />
                <div
                  className="relative w-24 h-24 rounded-[var(--radius-lg)] flex items-center justify-center"
                  style={{
                    background: "var(--grad-primary)",
                    boxShadow: "var(--shadow-blue)",
                  }}
                >
                  <MailCheck
                    className="w-10 h-10"
                    style={{ color: "var(--text-inverse)" }}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <h3
                className="text-xl font-extrabold tracking-tight mb-2"
                style={{ color: "var(--text)" }}
              >
                Check your inbox
              </h3>
              <p
                className="text-xs leading-relaxed max-w-[210px]"
                style={{ color: "var(--text-2)" }}
              >
                A 4-digit code was sent to verify your identity.
              </p>
            </div>

            <div className="relative z-10 space-y-2.5">
              {features.map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-[var(--radius-sm)] px-4 py-3 border"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <span
                    className="flex-shrink-0"
                    style={{ color: "var(--blue)" }}
                  >
                    {icon}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-2)" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-10 lg:py-14">
            <div className="w-full max-w-sm">
              <div className="mb-10">
                <span
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: "var(--blue)" }}
                >
                  <span
                    className="w-5 h-0.5 rounded-full"
                    style={{ background: "var(--grad-primary)" }}
                  />
                  Email Verification
                </span>
                <h1
                  className="text-3xl font-extrabold tracking-tight leading-tight mb-3"
                  style={{ color: "var(--text)" }}
                >
                  Enter your 4-digit code
                </h1>
                <p className="text-sm mb-3" style={{ color: "var(--text-2)" }}>
                  We sent a code to your mail
                </p>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 border"
                  style={{
                    background: "var(--blue-light)",
                    borderColor: "var(--border)",
                  }}
                >
                  <MailCheck
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: "var(--blue)" }}
                  />
                </div>
              </div>

              <form onSubmit={handleVerify}>
                <div className="flex gap-4 mb-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => {
                        if (el) inputs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      autoComplete="one-time-code"
                      onChange={e => handleChange(i, e.target.value)}
                      onPaste={i === 0 ? handlePaste : undefined}
                      className="w-16 h-16 text-center text-4xl font-bold font-mono leading-none rounded-2xl border-2 outline-none transition-all duration-150 focus:scale-105"
                      style={{
                        background: error
                          ? "var(--rose-light)"
                          : digit
                            ? "var(--blue-light)"
                            : "var(--surface-2)",
                        borderColor: error
                          ? "var(--rose)"
                          : digit
                            ? "var(--blue)"
                            : "var(--border)",
                        color: error
                          ? "var(--rose)"
                          : digit
                            ? "var(--blue)"
                            : "var(--text)",
                        boxShadow: "none",
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = error
                          ? "var(--rose)"
                          : "var(--blue)";
                        e.target.style.boxShadow = error
                          ? "0 0 0 4px var(--rose-muted)"
                          : "0 0 0 4px var(--blue-muted)";
                      }}
                      onBlur={e => {
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  ))}
                </div>

                <p className="text-xs mb-6" style={{ color: "var(--text-3)" }}>
                  You can paste the code directly into the first box.
                </p>

                {error && (
                  <div
                    className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-4 py-3 mb-5 border"
                    style={{
                      background: "var(--rose-light)",
                      borderColor: "var(--rose-muted)",
                    }}
                  >
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--rose)" }}
                    >
                      {error}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!filled || loading}
                  className="btn-primary w-full mb-5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                      Verifying…
                    </>
                  ) : (
                    "Verify Email →"
                  )}
                </button>

                <div
                  className="flex items-center justify-center gap-2 text-sm"
                  style={{ color: "var(--text-2)" }}
                >
                  <span>Didn&apos;t receive the code?</span>
                  {timer > 0 ? (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold font-mono border"
                      style={{
                        background: "var(--amber-light)",
                        borderColor: "var(--amber-muted)",
                        color: "var(--amber)",
                      }}
                    >
                      <Clock className="w-3 h-3" /> 00:
                      {String(timer).padStart(2, "0")}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="inline-flex items-center gap-1.5 font-bold hover:underline underline-offset-2"
                      style={{ color: "var(--blue)" }}
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Resend code
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

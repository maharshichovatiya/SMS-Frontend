import { GraduationCap, ShieldCheck, Clock, KeyRound } from "lucide-react";
import ForgotPasswordForm from "@/components/forms/Forgotpasswordform";

const tips = [
  {
    icon: <ShieldCheck className="w-4 h-4 text-white/80" />,
    label: "Reset links expire in 30 minutes",
  },
  {
    icon: <Clock className="w-4 h-4 text-white/80" />,
    label: "Check your spam folder if not received",
  },
  {
    icon: <KeyRound className="w-4 h-4 text-white/80" />,
    label: "You'll be prompted to set a new password",
  }, // <-- FIX THIS TOO
];

export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col font-[var(--font-sans)]">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full mx-20 flex rounded-[var(--radius-xl)] overflow-hidden shadow-[0_0_0_1px_rgba(61,108,244,0.08),var(--shadow-xl)] bg-[var(--surface)] min-h-[580px]">
          <div
            className="hidden lg:flex flex-col justify-between w-[44%] py-11 relative overflow-hidden"
            style={{ background: "var(--grad-primary)" }}
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/[0.07]" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/[0.05]" />

            <div className="relative z-10 w-[82%] mx-auto flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center">
                <div
                  className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center"
                  style={{ boxShadow: "var(--shadow-blue)" }}
                >
                  <GraduationCap
                    className="w-5 h-5"
                    style={{ color: "var(--text-inverse)" }}
                  />
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  School Management System
                </p>
                <p className="text-white/50 text-xs uppercase tracking-widest font-medium">
                  Admin Portal
                </p>
              </div>
            </div>

            <div className="relative z-10 w-[82%] mx-auto space-y-5">
              <h2 className="text-white text-4xl font-extrabold leading-tight tracking-tight">
                Account Recovery
                <br />
                <span className="text-white/45 font-normal">
                  made simple & secure.
                </span>
              </h2>

              <p className="text-white/60 leading-relaxed max-w-xs">
                We&apos;ll send a secure link to your registered email so you
                can regain access to your admin dashboard quickly.
              </p>

              <ul className="space-y-3">
                {tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-white/75 text-xs"
                  >
                    <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/[0.14] flex items-center justify-center flex-shrink-0">
                      {tip.icon}
                    </span>
                    {tip.label === "You'll be prompted to set a new password"
                      ? "You\u2019ll be prompted to set a new password"
                      : tip.label}
                  </li>
                ))}
              </ul>
            </div>

            <div />
          </div>

          <div className="flex-1 flex items-center justify-center w-full h-full lg:py-14">
            <div className="w-[72%] mx-auto">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

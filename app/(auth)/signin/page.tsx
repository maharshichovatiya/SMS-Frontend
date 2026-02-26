import { GraduationCap } from "lucide-react";
import SignInForm from "@/components/forms/Signinform";
import { ShieldCheck, BarChart2, Zap } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const features = [
  { icon: ShieldCheck, label: "Role-based secure access" },
  { icon: BarChart2, label: "Real-time performance reports" },
  { icon: Zap, label: "Fast daily operations" },
];
export default async function SignInPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (token) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col font-[var(--font-sans)]">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full mx-20 flex rounded-[var(--radius-xl)] overflow-hidden shadow-[0_0_0_1px_rgba(61,108,244,0.08),var(--shadow-xl)] bg-[var(--surface)] min-h-[580px]">
          <div
            className="hidden lg:flex flex-col justify-between w-[44%] py-11 relative overflow-hidden"
            style={{ background: "var(--grad-primary)" }}
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/[0.07] pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/[0.05] pointer-events-none" />

            <div className="relative z-10 w-[82%] mx-auto flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-xl">
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
                Secure Admin Access
                <br />
                <span className="text-white/45 font-normal">
                  for School Operations.
                </span>
              </h2>

              <p className="text-white/60 leading-relaxed max-w-xs">
                Built for administrators who want faster decisions, accurate
                reports, and smooth day-to-day control.
              </p>

              <ul className="space-y-3">
                {features.map(item => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.label}
                      className="flex items-center gap-3 text-white/75 text-xs"
                    >
                      <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/[0.14] flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-white/75" />
                      </span>
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div />
          </div>

          <div className="flex-1 flex items-center justify-center w-full h-full lg:py-14">
            <div className="w-[72%] mx-auto">
              <SignInForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

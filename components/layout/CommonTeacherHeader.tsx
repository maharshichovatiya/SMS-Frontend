"use client";

import { useTeacherProfile } from "@/lib/hooks/UseTeacherProfile";

interface CommonTeacherHeaderProps {
  title?: string;
  subtitle?: string;
  useApiData?: boolean;
  userRole?: string;
}

export default function CommonTeacherHeader({
  title,
  useApiData = false,
  userRole = "teacher",
  children,
}: CommonTeacherHeaderProps & { children?: React.ReactNode }) {
  const { teacherData, loading } = useTeacherProfile();
  const displayName =
    useApiData && teacherData
      ? `${teacherData?.user?.firstName} ${teacherData?.user?.lastName}`
      : title || "Teacher Name";

  const displayDesignation =
    useApiData && teacherData
      ? `${teacherData?.designation} · ${teacherData?.department} Dept.`
      : "Senior Teacher · Computer Science Dept.";

  const displayEmployeeCode =
    useApiData && teacherData ? teacherData?.employeeCode : "EMP001";

  const displayStatus =
    useApiData && teacherData ? teacherData?.status : "active";

  const initials =
    useApiData && teacherData
      ? `${teacherData?.user?.firstName?.charAt(0) || ""}${teacherData?.user?.lastName?.charAt(0) || ""}`.toUpperCase()
      : (() => {
          if (title) {
            const words = title.trim().split(" ");
            if (words.length >= 2) {
              return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
            } else if (words.length === 1 && words[0].length >= 2) {
              return words[0].substring(0, 2).toUpperCase();
            }
          }
          return "TE";
        })();

  return (
    <div className="font-[var(--font-sans)] min-h-screen bg-[var(--color-bg)] p-0">
      <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl mb-[18px] shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden animate-fadeUp">
        <div className="px-7 py-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-[18px]">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-extrabold text-white font-[var(--font-sans)] flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, #3d6cf4, #6c47f5)`,
                  boxShadow: `0 6px 20px #3d6cf450`,
                }}
              >
                {loading ? "..." : initials}
              </div>

              <div
                className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-[2.5px] border-white ${
                  displayStatus === "active" ? "bg-[#12a47e]" : "bg-[#e83b6a]"
                }`}
              />
            </div>

            <div>
              <div className="text-2xl font-extrabold tracking-[-0.5px] text-[#111827] font-[var(--font-sans)] leading-[1.2]">
                {loading ? "Loading..." : displayName}
              </div>
              <div className="text-[13.5px] text-[#5c6a8a] mt-1 font-[var(--font-sans)]">
                {loading ? "Loading..." : displayDesignation}
              </div>
              <div className="flex items-center flex-wrap gap-2 mt-2">
                <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full bg-[#eef1ff] text-[#3d6cf4] font-mono">
                  {loading ? "..." : displayEmployeeCode}
                </span>

                <span
                  className={`text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full font-[var(--font-sans)] ${
                    displayStatus === "active"
                      ? "bg-[#e6faf5] text-[#12a47e]"
                      : "bg-[#fff0f4] text-[#e83b6a]"
                  }`}
                >
                  {displayStatus}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2.5 items-center">
            <span className="px-[14px] py-1.5 rounded-full bg-[#eef1ff] text-[#3d6cf4] text-[12px] font-bold capitalize border-[1.5px] border-[#3d6cf4]">
              {userRole} View
            </span>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}

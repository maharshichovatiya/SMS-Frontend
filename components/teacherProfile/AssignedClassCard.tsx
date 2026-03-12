import React from "react";
import { AssignedClassCardProps } from "../../lib/types/teacher-profile";

const colorMap: Record<string, { bg: string; fg: string }> = {
  "10-A": { bg: "#eef1ff", fg: "#3d6cf4" },
  "9-B": { bg: "#f0edff", fg: "#6c47f5" },
  "11-C": { bg: "#fff8e6", fg: "#e08c17" },
  "8-A": { bg: "#e6f7fd", fg: "#0ea5c9" },
  "12-B": { bg: "#e6faf5", fg: "#12a47e" },
};

const AssignedClassCard: React.FC<AssignedClassCardProps> = ({ cls }) => {
  const col = colorMap[cls.code] ?? { bg: "#f0f4ff", fg: "#3d6cf4" };

  return (
    <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-xl p-[18px] shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0_8px_28px_rgba(61,108,244,0.12)] relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${col.fg}, ${col.fg}88)`,
        }}
      />

      <div className="flex items-start justify-between mt-1.5 mb-3">
        <div
          className="text-2xl font-extrabold tracking-tight"
          style={{
            color: col.fg,
            fontFamily: "var(--font-sans)",
          }}
        >
          {cls.code}
        </div>
        {cls.isClassTeacher && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e6faf5] text-[#12a47e] font-[var(--font-sans)]">
            Class Teacher
          </span>
        )}
      </div>

      <div className="text-[13.5px] font-bold text-[#111827] font-[var(--font-sans)] mb-1">
        {cls.grade}
      </div>
      <div className="text-xs text-[#5c6a8a] font-[var(--font-sans)] mb-3">
        {cls.subject}
      </div>

      <div className="flex justify-between pt-2.5 border-t border-[#dde3f5]">
        <div className="text-center">
          <div
            className="text-lg font-extrabold"
            style={{
              color: col.fg,
              fontFamily: "var(--font-sans)",
              letterSpacing: "-0.025em",
            }}
          >
            {cls.students}
          </div>
          <div className="text-[10px] text-[#9aa5c4] font-semibold uppercase tracking-[0.025em] font-[var(--font-sans)]">
            Students
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-extrabold text-[#12a47e] font-[var(--font-sans)]">
            {cls.isClassTeacher ? "CT" : "—"}
          </div>
          <div className="text-[10px] text-[#9aa5c4] font-semibold uppercase tracking-[0.025em] font-[var(--font-sans)]">
            Role
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedClassCard;

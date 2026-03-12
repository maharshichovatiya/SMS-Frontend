import React from "react";
import { ProfileStatsProps } from "../../lib/types/teacher-profile";

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const items = [
    {
      label: "Total Students",
      value: stats.totalStudents || 0,
      color: "#3d6cf4",
      bg: "#eef1ff",
    },
    {
      label: "Classes Assigned",
      value: stats.classesAssigned || 0,
      color: "#0ea5c9",
      bg: "#e6f7fd",
    },
    {
      label: "Homework Assigned",
      value: stats.homeworkAssigned || 0,
      color: "#6c47f5",
      bg: "#f0edff",
    },
    {
      label: "Years Experience",
      value: stats.yearsOfExperience || 0,
      color: "#e08c17",
      bg: "#fff8e6",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="bg-white border-[1.5px] border-[#dde3f5] rounded-xl p-4 shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] text-center transition-all duration-200 hover:translate-y-[-3px] hover:shadow-[0_8px_28px_rgba(61,108,244,0.12)] cursor-default"
          style={{
            animation: `fadeUp 0.4s ease both`,
            animationDelay: `${0.05 * (i + 1)}s`,
          }}
        >
          <div
            className="text-2xl font-extrabold tracking-tight mb-1"
            style={{
              color: item.color,
              fontFamily: "var(--font-sans)",
            }}
          >
            {item.value}
          </div>
          <div
            className="text-xs font-bold uppercase tracking-[0.5px] leading-tight"
            style={{
              color: "#9aa5c4",
              fontFamily: "var(--font-sans)",
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;

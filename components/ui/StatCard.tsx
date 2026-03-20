import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  glowColor: string;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  animationDelay?: string;
  size?: "sm" | "md" | "lg";
}

export default function StatCard({
  icon,
  iconBg,
  iconColor,
  glowColor,
  label,
  value,
  trend,
  trendUp = true,
  animationDelay = "0s",
  size = "md",
}: StatCardProps) {
  const sizeClasses = {
    sm: {
      container: "px-4 py-[18px]",
      icon: "w-9 h-9",
      label: "text-[11px]",
      value: "text-[24px]",
      trend: "text-[11px]",
    },
    md: {
      container: "px-5 py-[22px]",
      icon: "w-11 h-11",
      label: "text-[13px]",
      value: "text-[32px]",
      trend: "text-[12px]",
    },
    lg: {
      container: "px-6 py-[26px]",
      icon: "w-12 h-12",
      label: "text-[14px]",
      value: "text-[38px]",
      trend: "text-[13px]",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl ${currentSize.container} shadow-[var(--shadow)] relative overflow-hidden cursor-default animate-fade-up`}
      style={{ animationDelay }}
    >
      <div
        className="absolute -right-[30px] -top-[30px] w-[100px] h-[100px] rounded-full opacity-[0.08]"
        style={{ background: glowColor }}
      />
      <div
        className={`${currentSize.icon} rounded-xl flex items-center justify-center mb-4 ${iconBg}`}
        style={{ color: iconColor }}
      >
        {icon}
      </div>
      <div
        className={`${currentSize.label} font-bold text-[var(--text-2)] uppercase tracking-[0.5px] mb-2`}
      >
        {label}
      </div>
      <div
        className={`${currentSize.value} font-extrabold tracking-[-1.5px] text-[var(--text)] mb-[8px] leading-none`}
      >
        {value}
      </div>
      {trend && (
        <div
          className={`${currentSize.trend} font-semibold ${trendUp ? "text-[var(--green)]" : "text-[var(--rose)]"}`}
        >
          {trend}
        </div>
      )}
    </div>
  );
}

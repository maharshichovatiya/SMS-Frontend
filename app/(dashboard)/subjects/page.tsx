import React from "react";

const subjects = [
  {
    name: "Mathematics",
    meta: "Grades 6–12 · Core",
    badge: "Core",
    badgeClass: "bg-blue-light text-blue",
    classes: "12 classes",
    iconColor: "bg-blue-light text-blue",
    delay: "0.04s",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1v11a1 1 0 001 1z"
        />
      </svg>
    ),
  },
  {
    name: "Science",
    meta: "Grades 6–10 · Core",
    badge: "Core",
    badgeClass: "bg-green-light text-green",
    classes: "10 classes",
    iconColor: "bg-green-light text-green",
    delay: "0.08s",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
  {
    name: "English",
    meta: "Grades 1–12 · Core",
    badge: "Core",
    badgeClass: "bg-indigo-light text-indigo",
    classes: "14 classes",
    iconColor: "bg-indigo-light text-indigo",
    delay: "0.12s",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
    ),
  },
  {
    name: "Accountancy",
    meta: "Grades 11–12 · Commerce",
    badge: "Commerce",
    badgeClass: "bg-amber-light text-amber",
    classes: "4 classes",
    iconColor: "bg-amber-light text-amber",
    delay: "0.16s",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    name: "Computer Science",
    meta: "Grades 9–12 · Elective",
    badge: "Elective",
    badgeClass: "bg-cyan-light text-cyan",
    classes: "6 classes",
    iconColor: "bg-cyan-light text-cyan",
    delay: "0.20s",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    name: "Physical Education",
    meta: "Grades 1–12 · Mandatory",
    badge: "Mandatory",
    badgeClass: "bg-rose-light text-rose",
    classes: "14 classes",
    iconColor: "bg-rose-light text-rose",
    delay: "0.24s",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
        />
      </svg>
    ),
  },
  {
    name: "History",
    meta: "Grades 6–10 · Social",
    badge: "Social",
    badgeClass: "bg-indigo-light text-indigo",
    classes: "8 classes",
    iconColor: "bg-indigo-light text-indigo",
    delay: "0.28s",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
      </svg>
    ),
  },
  {
    name: "Geography",
    meta: "Grades 6–10 · Social",
    badge: "Social",
    badgeClass: "bg-green-light text-green",
    classes: "7 classes",
    iconColor: "bg-green-light text-green",
    delay: "0.32s",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default function Subjects() {
  return (
    <section className="animate-fade-up">
      <div className="bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-2xl p-[22px_26px] mb-[18px] flex items-center justify-between flex-wrap gap-[14px] shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-[14px]">
          <div className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center shrink-0 bg-[var(--amber-light)] text-[var(--amber)]">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <div className="text-[25px] font-extrabold tracking-[-0.6px] text-[var(--text)]">
              Subjects
            </div>
            <div className="text-sm text-[var(--text-2)] mt-[1px]">
              34 academic subjects offered this year
            </div>
          </div>
        </div>
        <button className="flex items-center gap-[7px] px-5 py-[10px] bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)] text-white rounded-[11px] text-[13.5px] font-semibold shadow-[var(--shadow-blue)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-[180ms] whitespace-nowrap relative overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
          <span className="relative z-10 flex items-center gap-[7px]">
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Subject
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map((sj, idx) => (
          <div
            key={idx}
            className="bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow-sm)] block animate-fade-up"
            style={{ animationDelay: sj.delay }}
          >
            <div
              className={`w-[46px] h-[46px] rounded-[13px] flex items-center justify-center mb-3 ${sj.iconColor}`}
            >
              <div className="w-[22px] h-[22px]">{sj.icon}</div>
            </div>
            <div className="text-[15.5px] font-bold mb-[3px] text-[var(--text)]">
              {sj.name}
            </div>
            <div className="text-[12.5px] text-[var(--text-2)]">{sj.meta}</div>
            <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-[var(--border)]">
              <span
                className={`inline-flex items-center px-[11px] py-[3px] rounded-full text-[11.5px] font-semibold ${sj.badgeClass}`}
              >
                {sj.badge}
              </span>
              <div className="text-[13.5px] font-bold text-[var(--blue)]">
                {sj.classes}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

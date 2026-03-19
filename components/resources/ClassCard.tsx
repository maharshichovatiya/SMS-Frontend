import { Class } from "@/lib/types/Resources";

interface ClassCardProps {
  classItem: Class;
  onClick: (classItem: Class) => void;
  index: number;
}

const bgColorMap: { [key: string]: { fg: string; bg: string } } = {
  blue: { fg: "blue", bg: "lightblue" },
  green: { fg: "green", bg: "lightgreen" },
  orange: { fg: "orange", bg: "lightorange" },
  purple: { fg: "purple", bg: "lightpurple" },
  cyan: { fg: "cyan", bg: "lightcyan" },
  rose: { fg: "rose", bg: "lightrose" },
};

export default function ClassCard({
  classItem,
  onClick,
  index,
}: ClassCardProps) {
  const totalRes = classItem.subjects.reduce(
    (sum, s) =>
      sum + s.chapters.reduce((cSum, ch) => cSum + ch.resources.length, 0),
    0,
  );
  const col = bgColorMap.blue;

  return (
    <div
      key={classItem.classId}
      className="relative bg-white border border-gray-200 rounded-md p-4 cursor-pointer transition-all duration-150 overflow-hidden hover:border-blue-500 hover:-translate-y-0.5"
      style={{
        animationDelay: `${(0.04 * (index + 1)).toFixed(2)}s`,
        animation: "slideUp 0.4s ease-out forwards",
        opacity: 0,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
      onClick={() => onClick(classItem)}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.75 rounded-t-md"
        style={{ background: `linear-gradient(90deg, #3b82f6, #06b6d4)` }}
      ></div>
      <div className="text-2xl font-bold mb-1" style={{ color: col.fg }}>
        {classItem.className}
      </div>
      <div className="text-sm text-gray-500 mb-3">{classItem.className}</div>
      <div className="text-xs text-gray-400">
        <span style={{ color: col.fg }}>{classItem.subjects.length}</span>{" "}
        Subjects · <span className="text-gray-600">{totalRes}</span> Resources
      </div>
    </div>
  );
}

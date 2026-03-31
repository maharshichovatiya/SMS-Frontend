import { Megaphone } from "lucide-react";

interface NoticeSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function NoticeSearch({
  placeholder = "Search notices...",
  value = "",
  onChange,
}: NoticeSearchProps) {
  return (
    <div className="relative">
      <Megaphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-full bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-muted)] focus:border-[var(--border-focus)] w-64 transition-all duration-[var(--duration)]"
      />
    </div>
  );
}

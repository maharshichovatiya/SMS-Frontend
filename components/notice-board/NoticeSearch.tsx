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
        className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-full bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-200"
      />
    </div>
  );
}

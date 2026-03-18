type ResourceType = "all" | "pdf" | "video" | "notes";

interface ResourceFilterProps {
  resourceFilter: ResourceType;
  onFilterChange: (filter: ResourceType) => void;
}

export default function ResourceFilter({
  resourceFilter,
  onFilterChange,
}: ResourceFilterProps) {
  const filterOptions: ResourceType[] = ["all", "pdf", "video", "notes"];

  return (
    <div className="flex gap-2 mb-6">
      {filterOptions.map(type => (
        <button
          key={type}
          onClick={() => onFilterChange(type)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            resourceFilter === type
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
}

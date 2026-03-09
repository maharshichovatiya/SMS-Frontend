interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  itemsPerPage: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  itemName?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  itemName = "items",
}: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem =
    totalItems > 0 ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div className="flex items-center justify-between px-4 py-4 mt-6">
      <div className="flex items-center gap-4">
        <p className="text-sm text-[var(--text-3)]">
          Showing {startItem}–{endItem} of {totalItems.toLocaleString()}{" "}
          {itemName}
        </p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--text-3)]">
            Items per page:
          </label>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-1 text-sm text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
          >
            {itemsPerPage.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-5 py-2 text-sm font-bold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--surface-2)] hover:border-[var(--border-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-sm active:translate-y-[1px]"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-6 py-2 text-sm font-bold text-[var(--text-inverse)] rounded-[var(--radius-sm)] hover:translate-y-[-2px] disabled:translate-y-0 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer shadow-md"
          style={{ background: "var(--grad-primary)" }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

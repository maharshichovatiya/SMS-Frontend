import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-panel {
          animation: modalIn 200ms var(--ease-bounce) both;
        }
      `}</style>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[var(--z-modal)]">
        <div
          className="absolute inset-0 bg-[rgba(17,24,39,0.45)] backdrop-blur-sm"
          onClick={onClose}
        />

        <div
          className={`
            modal-panel relative flex flex-col w-full
            max-h-[90vh]
            bg-[var(--surface)]
            rounded-[var(--radius-xl)]
            max-w-max
            border border-[var(--border)]
          `}
        >
          {title && (
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm mt-1 text-[var(--text-2)]">
                    {description}
                  </p>
                )}
              </div>

              <button
                onClick={onClose}
                className="flex cursor-pointer items-center justify-center w-8 h-8 ml-4 shrink-0 rounded-[var(--radius-xs)] text-[var(--text-3)] hover:bg-[var(--bg-2)] transition"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

          {footer && (
            <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-[var(--border)]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

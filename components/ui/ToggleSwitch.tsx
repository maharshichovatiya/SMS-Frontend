interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function ToggleSwitch({
  isOn,
  onToggle,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-[var(--duration)] ease-in-out ${
        isOn ? "bg-[var(--green)]" : "bg-[var(--text-3)]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-[var(--surface)] transition-transform duration-[var(--duration)] ease-in-out shadow-sm ${
          isOn ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

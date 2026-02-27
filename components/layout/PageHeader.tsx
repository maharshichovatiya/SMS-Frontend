import { LucideIcon } from "lucide-react";

interface ButtonProps {
  text?: string;
  onClick?: () => void;
  icon?: LucideIcon;
}

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonIcon?: LucideIcon;
  secondaryButton?: ButtonProps;
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  iconBgColor,
  iconColor,
  buttonText,
  onButtonClick,
  buttonIcon: ButtonIcon,
  secondaryButton,
}: PageHeaderProps) {
  return (
    <div
      className="w-full bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] px-6 py-4 flex items-center justify-between"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-[var(--radius-sm)] flex items-center justify-center"
          style={{ backgroundColor: `var(${iconBgColor})` }}
        >
          <Icon
            className="w-5 h-5"
            strokeWidth={1.8}
            style={{ color: `var(${iconColor})` }}
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text)] leading-tight">
            {title}
          </h1>
          <p className="text-sm text-[var(--text-3)] mt-0.5">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {secondaryButton && (
          <button
            className="btn-primary px-5 text-sm rounded-[var(--radius-sm)] h-10"
            onClick={secondaryButton.onClick}
          >
            {secondaryButton.icon && (
              <secondaryButton.icon className="w-4 h-4 mr-2" />
            )}
            {secondaryButton.text}
          </button>
        )}
        {buttonText && onButtonClick && (
          <button
            className="btn-primary px-5 text-sm rounded-[var(--radius-sm)] h-10"
            onClick={onButtonClick}
          >
            {ButtonIcon && <ButtonIcon className="w-4 h-4" />}
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

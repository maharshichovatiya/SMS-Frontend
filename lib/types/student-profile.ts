export type ProfileTab = "overview" | "personal" | "academic" | "school";

export interface ProfileFieldProps {
  label: string;
  value: string | number | readonly string[];
  isEditing?: boolean;
  type?: "text" | "email" | "tel" | "date" | "number" | "select";
  options?: string[] | { value: string; label: string }[];
  onChange?: (value: string) => void;
  readOnly?: boolean;
  mono?: boolean;
}

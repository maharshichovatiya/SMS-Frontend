export function formatExperience(totalMonths: number): string {
  if (!totalMonths || totalMonths === 0) return "0 months";

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) return `${months}m`;
  if (months === 0) return `${years}y`;
  return `${years}y ${months}m`;
}

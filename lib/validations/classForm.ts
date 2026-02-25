import z from "zod";

export const classSchema = z.object({
  classNo: z.string().min(1, "Class name is required"),
  section: z.string().min(1, "Section is required"),
  classTeacherId: z.string().min(1, "Class teacher is required"),
  studentCapacity: z.coerce.number().min(1, "Capacity must be at least 1"),
});

export type ClassFormData = z.infer<typeof classSchema>;

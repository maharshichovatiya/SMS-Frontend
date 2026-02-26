import z from "zod";

export const classSchema = z.object({
  classNo: z
    .string()
    .min(1, "Class number is required")
    .refine(val => {
      const num = parseInt(val);
      return num >= 1 && num <= 10;
    }, "Class number must be between 1 and 10"),

  section: z
    .string()
    .min(1, "Section is required")
    .max(3, "Section is too long")
    .regex(/^[A-Za-z]+$/, "Section must only contain letters"),

  classTeacherId: z.string().nullable().optional(),

  studentCapacity: z.coerce
    .number()
    .min(10, "Minimum capacity is 10 students")
    .max(60, "Maximum capacity is 60 students"),
});

export type ClassFormData = z.infer<typeof classSchema>;

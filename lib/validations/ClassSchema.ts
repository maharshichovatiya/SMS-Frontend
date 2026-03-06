import z from "zod";

export const classSchema = z.object({
  className: z.string().min(1, "Class number is required"),

  section: z.string().regex(/^[A-Za-z]+$/, "Section must only contain letters"),

  classTeacherId: z.string().nullable().optional(),

  studentCapacity: z
    .union([
      z.coerce
        .number()
        .min(10, "Minimum capacity is 10 students")
        .max(120, "Maximum capacity is 120 students"),
      z.literal("").transform(() => undefined),
    ])
    .optional(),
});

export type ClassFormData = z.infer<typeof classSchema>;

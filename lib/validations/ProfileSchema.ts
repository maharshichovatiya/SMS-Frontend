import z from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .regex(/^[A-Za-z\s]+$/, "First name must contain only letters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long")
    .regex(/^[A-Za-z\s]+$/, "Last name must contain only letters"),
  password: z
    .string()
    .refine(val => val === "" || val.length >= 8, {
      message: "Password must be at least 8 characters",
    })
    .refine(val => val === "" || val.length <= 64, {
      message: "Password must be at most 64 characters",
    })
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

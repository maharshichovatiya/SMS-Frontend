import z from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .regex(/^[A-Za-z\s]+$/, "First name must contain only letters"),
  middleName: z
    .string()
    .max(50, "Middle name is too long")
    .regex(/^[A-Za-z\s]*$/, "Middle name must contain only letters")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long")
    .regex(/^[A-Za-z\s]+$/, "Last name must contain only letters"),
  phone: z
    .string()
    .trim()
    .transform(val => (val === "" ? undefined : val))
    .optional()
    .refine(val => !val || /^[0-9]{10}$/.test(val), {
      message: "Phone number must be exactly 10 digits",
    }),
  password: z
    .string()
    .trim()
    .transform(val => (val === "" ? undefined : val))
    .optional()
    .refine(
      val =>
        !val ||
        (val.length >= 8 &&
          val.length <= 20 &&
          /[A-Z]/.test(val) &&
          /[a-z]/.test(val) &&
          /[0-9]/.test(val) &&
          /[^a-zA-Z0-9]/.test(val)),
      {
        message:
          "Password must be 8 characters, include uppercase, lowercase, number and special character",
      },
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

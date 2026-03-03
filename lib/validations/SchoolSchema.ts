import z from "zod";

export const schoolSchema = z.object({
  name: z.string().min(1, "School name is required").max(200, "Too long"),
  affiliationBoard: z.string().optional(),
  address: z.string().max(100, "Address is too long").optional(),
  establishmentYear: z
    .string()
    .refine(
      val =>
        val === "" ||
        (Number(val) >= 1800 && Number(val) <= new Date().getFullYear()),
      {
        message: `Year must be between 1800 and ${new Date().getFullYear()}`,
      },
    )
    .optional(),
  emailOfficial: z
    .string()
    .refine(val => val === "" || z.string().email().safeParse(val).success, {
      message: "Please enter a valid email address",
    })
    .max(50, "email is too long ")
    .optional(),
  type: z.string().optional(),
  contact: z
    .string()
    .trim()
    .transform(val => (val === "" ? undefined : val))
    .optional()
    .refine(val => !val || /^[0-9]{10}$/.test(val), {
      message: "Contact number must be exactly 10 digits",
    }),
  schoolCode: z.string().max(20, "School code is too long").optional(),
  mediumOfInstruction: z.string().optional(),
  schoolTimingStart: z.string().optional(),
  schoolTimingEnd: z.string().optional(),
  websiteUrl: z
    .string()
    .refine(val => val === "" || z.string().url().safeParse(val).success, {
      message: "Please enter a valid URL",
    })
    .optional(),
});

export type SchoolFormData = z.infer<typeof schoolSchema>;

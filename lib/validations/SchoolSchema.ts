import z from "zod";

export const schoolSchema = z
  .object({
    name: z.string().min(1, "School name is required").max(200, "Too long"),
    affiliationBoard: z.string().min(1, "Affiliation board is required"),
    address: z
      .string()
      .min(1, "Address is required")
      .max(100, "Address is too long"),
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
      .max(50, "Email is too long")
      .optional(),
    emailAdmin: z
      .string()
      .refine(val => val === "" || z.string().email().safeParse(val).success, {
        message: "Please enter a valid email address",
      })
      .max(50, "Email is too long")
      .optional(),
    type: z.string().min(1, "Type is required"),
    contact: z
      .string()
      .trim()
      .transform(val => (val === "" ? undefined : val))
      .optional()
      .refine(val => !val || /^[0-9]{10}$/.test(val), {
        message: "Contact number must be exactly 10 digits",
      }),
    schoolCode: z.string().max(20, "School code is too long").optional(),
    mediumOfInstruction: z.string().min(1, "Medium of instruction is required"),
    schoolTimingStart: z
      .string()
      .refine(
        val => {
          if (!val || val.trim() === "") return true;
          const [h, m] = val.split(":").map(Number);
          const mins = h * 60 + m;
          return mins >= 6 * 60 && mins <= 16 * 60;
        },
        { message: "Start time must be between 06:00 and 16:00" },
      )
      .optional(),
    schoolTimingEnd: z.string().optional(),
    websiteUrl: z
      .string()
      .refine(val => val === "" || z.string().url().safeParse(val).success, {
        message: "Please enter a valid URL",
      })
      .optional(),
  })
  .refine(
    data => {
      const start = data.schoolTimingStart?.trim();
      const end = data.schoolTimingEnd?.trim();
      if (!start && !end) return true;
      if (start && !end) return false;
      if (!start && end) return false;
      return true;
    },
    {
      message: "Both start and end timing are required",
      path: ["schoolTimingEnd"],
    },
  )
  .refine(
    data => {
      const start = data.schoolTimingStart?.trim();
      const end = data.schoolTimingEnd?.trim();
      if (!start || !end) return true;
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      const diff = eh * 60 + em - (sh * 60 + sm);
      return diff > 0 && diff <= 480;
    },
    {
      message: "End time must be after start and within 8 hours",
      path: ["schoolTimingEnd"],
    },
  );

export type SchoolFormData = z.infer<typeof schoolSchema>;

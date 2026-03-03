import { z } from "zod";

export const personalDetailsSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
    .trim(),
  middleName: z
    .string()
    .max(50, "Middle name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Middle name can only contain letters and spaces")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .max(100, "Email must be less than 100 characters")
    .email("Invalid email address")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[6-9]\d{9}$/,
      "Phone number must be exactly 10 digits starting with 6, 7, 8, or 9",
    )
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    )
    .regex(/^(?!.*\s)/, "Password cannot contain spaces")
    .regex(
      /^(?!.*(.)\1{2,})/,
      "Password cannot contain 3 or more repeated characters",
    ),
  roleId: z.string().min(1, "Role is required").uuid("Invalid role selection"),
});

export const schoolDetailsSchema = z.object({
  schoolName: z
    .string()
    .min(1, "School name is required")
    .min(3, "School name must be at least 3 characters")
    .max(100, "School name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s&.,'-]+$/, "School name contains invalid characters")
    .trim(),
  schoolType: z.enum(["private", "govt"], {
    message: "Please select a valid school type",
  }),
  address: z
    .string()
    .min(1, "Address is required")
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must be less than 200 characters")
    .regex(/^[a-zA-Z0-9\s,.-/#]+$/, "Address contains invalid characters")
    .trim(),
  officialEmail: z
    .string()
    .min(1, "Official email is required")
    .max(100, "Email must be less than 100 characters")
    .email("Invalid official email address")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .toLowerCase()
    .trim(),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .regex(
      /^[6-9]\d{9}$/,
      "Contact number must be exactly 10 digits starting with 6, 7, 8, or 9",
    )
    .trim(),
  mediumOfInstruction: z.enum(["english", "hindi", "gujarati", "other"], {
    message: "Please select a valid medium of instruction",
  }),
  affiliationBoard: z.enum(["cbse", "icse", "state"], {
    message: "Please select a valid affiliation board",
  }),
  schoolCode: z
    .string()
    .max(20, "School code must be less than 20 characters")
    .regex(
      /^[A-Z0-9]*$/,
      "School code must contain only uppercase letters and numbers",
    )
    .optional(),
  establishmentYear: z
    .string()
    .regex(/^(18|19|20)\d{2}$/, "Invalid establishment year")
    .refine(val => {
      const year = parseInt(val);
      return year >= 1800 && year <= new Date().getFullYear();
    }, "Establishment year must be between 1800 and current year")
    .optional(),
  adminEmail: z
    .string()
    .optional()
    .refine(val => !val || val.length <= 100, {
      message: "Admin email must be less than 100 characters",
    })
    .refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid admin email format",
    })
    .refine(val => !val || val.trim().length > 0, {
      message: "Admin email cannot be only whitespace",
    }),
  websiteUrl: z
    .string()
    .max(200, "Website URL must be less than 200 characters")
    .optional()
    .refine(val => !val || /^https?:\/\/.+/.test(val), {
      message: "Website URL must start with http:// or https://",
    })
    .refine(val => !val || /^https?:\/\/[^\s/$.?#][^\s]*$/.test(val), {
      message: "Invalid website URL format",
    }),
});

export type PersonalDetails = z.infer<typeof personalDetailsSchema>;
export type SchoolDetails = z.infer<typeof schoolDetailsSchema>;

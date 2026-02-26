import { z } from "zod";

export const personalDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  roleId: z.string().min(1, "Role is required"),
});

export const schoolDetailsSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  schoolType: z.enum(["private", "govt", "aided"]),
  address: z.string().min(1, "Address is required"),
  officialEmail: z
    .string()
    .email("Invalid email address")
    .min(1, "Official email is required"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits"),
  mediumOfInstruction: z.enum(["english", "hindi"]),
  affiliationBoard: z.enum(["cbse", "icse", "state", "ib", "cambridge"]),
  schoolCode: z.string().optional(),
  establishmentYear: z.string().optional(),
  adminEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  websiteUrl: z
    .string()
    .url("Invalid website URL")
    .optional()
    .or(z.literal("")),
});

export type PersonalDetails = z.infer<typeof personalDetailsSchema>;
export type SchoolDetails = z.infer<typeof schoolDetailsSchema>;

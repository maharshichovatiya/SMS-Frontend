import z from "zod";

const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(20, "Password cannot exceed 20 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character",
  );

export const createTeacherSchema = (mode: "add" | "edit" = "add") =>
  z.object({
    email: z
      .string()
      .email("Invalid email address")
      .max(50, "email cannot exceed 50 characters"),
    password:
      mode === "add"
        ? passwordValidation
        : passwordValidation.optional().or(z.literal("")),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(20, "First name cannot exceed 20 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(20, "Last name cannot exceed 20 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters"),
    phone: z
      .string()
      .max(10, "Enter a valid phone number")
      .regex(/^[0-9+\s-]+$/, "Invalid phone number"),
    gender: z
      .string()
      .min(1, "Select a gender")
      .refine(
        val => ["male", "female", "other"].includes(val),
        "Invalid gender",
      ),
    dob: z
      .string()
      .min(1, "Date of birth is required")
      .refine(val => {
        const dob = new Date(val);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        return age >= 18 && age <= 70;
      }, "Teacher must be between 18 and 70 years old"),
    department: z
      .string()
      .min(1, "Department is required")
      .refine(
        val =>
          ["academic", "administration", "sports", "laboratory"].includes(val),
        "Invalid department",
      ),
    designation: z
      .string()
      .min(2, "Designation is required")
      .max(30, "Designation is too long")
      .regex(/^[a-zA-Z\s'-]+$/, "Designation can only contain letters"),
    dateOfJoining: z.string().min(1, "Date of joining is required"),
    salaryPackage: z.coerce
      .number()
      .min(60000, "Minimum salary is ₹60,000/year")
      .max(10000000, "Salary cannot exceed ₹1 Crore/year"),
    highestQualification: z
      .string()
      .trim()
      .min(1, "Qualification is required")
      .max(40, "Qualification cannot exceed 40 characters")
      .regex(
        /^[a-zA-Z.\s]+$/,
        "Qualification can only contain letters, spaces and dot (.)",
      ),
    experienceYears: z.coerce
      .number()
      .min(0, "Experience cannot be negative")
      .max(60, "Experience cannot exceed 60 years"),
    profilePhoto: z.any().optional(),
  });

export type TeacherFormData = z.infer<ReturnType<typeof createTeacherSchema>>;

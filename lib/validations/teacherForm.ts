import z from "zod";

export const createTeacherSchema = (mode: "add" | "edit" = "add") =>
  z.object({
    email: z.string().email("Invalid email address"),
    password:
      mode === "add"
        ? z.string().min(8, "Password must be at least 8 characters")
        : z
            .string()
            .optional()
            .refine(
              val => !val || val.length >= 8,
              "Password must be at least 8 characters",
            ),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(10, "Enter a valid phone number"),
    gender: z
      .string()
      .min(1, "Select a gender")
      .refine(
        val => ["male", "female", "other"].includes(val),
        "Invalid gender",
      ),
    dob: z.string().min(1, "Date of birth is required"),
    employeeCode: z.string().min(1, "Employee code is required"),
    staffCategory: z.string().min(1, "Staff category is required"),
    department: z.string().min(1, "Department is required"),
    designation: z.string().min(1, "Designation is required"),
    dateOfJoining: z.string().min(1, "Date of joining is required"),
    salaryPackage: z.coerce.number().min(1, "Salary is required"),
    highestQualification: z.string().min(1, "Qualification is required"),
    experienceYears: z.coerce.number().min(0, "Experience is required"),
    profilePhoto: z.any().optional(),
  });

export type TeacherFormData = z.infer<ReturnType<typeof createTeacherSchema>>;

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
      .regex(
        /^[6-9]\d{9}$/,
        "Phone number must be a valid Indian mobile number (starting with 6, 7, 8, or 9)",
      ),
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
      .min(0, "Cannot be negative")
      .max(60, "Cannot exceed 60 years"),
    experienceMonths: z.coerce
      .number()
      .min(0, "Cannot be negative")
      .max(11, "Months must be between 0 and 11"),
    profilePhoto: z.any().optional(),
    bloodGroup: z
      .string()
      .optional()
      .refine(val => {
        if (!val || val.trim() === "") return true;
        const validBloodGroups = [
          "A+",
          "A-",
          "B+",
          "B-",
          "O+",
          "O-",
          "AB+",
          "AB-",
        ];
        return validBloodGroups.includes(val);
      }, "Invalid blood group value"),
    aadhaarNo: z
      .string()
      .optional()
      .refine(val => {
        if (!val || val.trim() === "") return true;
        return /^\d{12}$/.test(val);
      }, "Aadhaar number must be exactly 12 digits"),
    panNo: z
      .string()
      .optional()
      .refine(val => {
        if (!val || val.trim() === "") return true;
        // PAN must be exactly 10 characters: 5 uppercase letters, 4 digits, 1 uppercase letter
        const pan = val.trim();
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
      }, "Invalid PAN number"),
    permanentAddress: z
      .string()
      .max(200, "Address cannot exceed 200 characters")
      .optional(),
    currentAddress: z
      .string()
      .max(200, "Address cannot exceed 200 characters")
      .optional(),
    sameAsPermanent: z.boolean().optional(),
    bankName: z
      .string()
      .max(50, "Bank name cannot exceed 50 characters")
      .optional()
      .refine(val => {
        if (!val || val.trim() === "") return true;
        return /^[a-zA-Z\s&.-]+$/.test(val);
      }, "Bank name can only contain letters, spaces, & . -"),
    accountNo: z
      .string()
      .optional()
      .refine(val => {
        if (!val || val.trim() === "") return true;
        return /^\d{9,18}$/.test(val);
      }, "Account number must be 9-18 digits"),
    ifscCode: z
      .string()
      .optional()
      .refine(val => {
        if (!val || val.trim() === "") return true;
        return /^[A-Za-z]{4}[0][A-Za-z0-9]{6}$/.test(val);
      }, "IFSC code must be 11 characters: 4 letters + 0 + 6 alphanumeric"),
    branch: z
      .string()
      .max(50, "Branch name cannot exceed 50 characters")
      .optional()
      .refine(val => {
        if (!val || val.trim() === "") return true;
        return /^[a-zA-Z\s&.-]+$/.test(val);
      }, "Branch name can only contain letters, spaces, & . -"),
  });

export type TeacherFormData = z.infer<ReturnType<typeof createTeacherSchema>>;

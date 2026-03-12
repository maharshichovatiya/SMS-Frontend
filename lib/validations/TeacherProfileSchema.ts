import z from "zod";

export const teacherProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .regex(/^[A-Za-z\s]+$/, "First name must contain only letters"),
  middleName: z
    .string()
    .max(50, "Middle name is too long")
    .regex(/^[A-Za-z\s]*$/, "Middle name must contain only letters")
    .nullable()
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
    .refine(val => !val || /^[6-9]\d{9}$/.test(val), {
      message:
        "Phone number must be a valid Indian mobile number (starting with 6, 7, 8, or 9)",
    }),
  gender: z
    .string()
    .min(1, "Select a gender")
    .refine(val => ["male", "female", "other"].includes(val), "Invalid gender"),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine(val => {
      const dob = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      return age >= 18 && age <= 70;
    }, "Teacher must be between 18 and 70 years old"),
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
    }, "Account number must be between 9 and 18 digits"),
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

export type TeacherProfileFormData = z.infer<typeof teacherProfileSchema>;

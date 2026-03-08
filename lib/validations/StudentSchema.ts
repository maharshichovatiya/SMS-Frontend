import { z } from "zod";

export const createStudentSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name cannot exceed 30 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  middleName: z
    .string()
    .max(30, "Middle name cannot exceed 30 characters")
    .regex(/^[a-zA-Z\s]*$/, "Middle name can only contain letters and spaces")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name cannot exceed 30 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .max(40, "Email cannot exceed 40 characters")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(10, "Phone cannot exceed 10 digits")
    .min(10, "Phone must be exactly 10 digits")
    .regex(
      /^[6-9]\d{9}$/,
      "Phone number must be a valid Indian mobile number (starting with 6, 7, 8, or 9)",
    ),
  rollNo: z
    .string()
    .min(1, "Roll No is required")
    .max(10, "Roll No cannot exceed 10 characters")
    .regex(/^\d+$/, "Must be a number"),
  admissionDate: z
    .string()
    .min(1, "Admission date is required")
    .refine(val => {
      const date = new Date(val);
      const today = new Date();
      return !isNaN(date.getTime()) && date <= today;
    }, "Admission date must be a valid date and cannot be in the future"),
  dob: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true; // Allow empty/undefined
      const birthDate = new Date(val);
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 25,
        today.getMonth(),
        today.getDate(),
      );
      const maxDate = new Date(
        today.getFullYear() - 5,
        today.getMonth(),
        today.getDate(),
      );
      return (
        !isNaN(birthDate.getTime()) &&
        birthDate <= maxDate &&
        birthDate >= minDate
      );
    }, "Student age must be between 5 and 25 years"),
  fatherName: z
    .string()
    .max(30, "Father name cannot exceed 30 characters")
    .regex(/^[a-zA-Z\s]*$/, "Father name can only contain letters and spaces")
    .refine(
      val => !val || val.trim().length >= 2,
      "Father name must be at least 2 characters if provided",
    )
    .optional(),
  fatherPhone: z
    .string()
    .max(10, "Father phone cannot exceed 10 digits")
    .regex(
      /^[6-9]\d{9}$/,
      "Father phone must be a valid Indian mobile number (starting with 6, 7, 8, or 9)",
    )
    .or(z.literal(""))
    .optional(),
  motherName: z
    .string()
    .max(30, "Mother name cannot exceed 30 characters")
    .regex(/^[a-zA-Z\s]*$/, "Mother name can only contain letters and spaces")
    .refine(
      val => !val || val.trim().length >= 2,
      "Mother name must be at least 2 characters if provided",
    )
    .optional(),
  guardianName: z
    .string()
    .max(30, "Guardian name cannot exceed 30 characters")
    .regex(/^[a-zA-Z\s]*$/, "Guardian name can only contain letters and spaces")
    .refine(
      val => !val || val.trim().length >= 2,
      "Guardian name must be at least 2 characters if provided",
    )
    .optional(),
  familyAnnualIncome: z
    .string()
    .optional()
    .refine(
      val => !val || /^\d*$/.test(val),
      "Family income must contain only numbers",
    )
    .refine(
      val => !val || parseInt(val) > 0,
      "Family income must be greater than 0 if provided",
    ),
  medicalConditions: z
    .string()
    .max(100, "Medical conditions cannot exceed 100 characters")
    .refine(
      val => !val || val.trim().length >= 3,
      "Medical conditions must be at least 3 characters if provided",
    )
    .optional(),
  bloodGroup: z
    .string()
    .optional()
    .refine(
      val => !val || /^(A|B|AB|O)[+-]?$/i.test(val),
      "Invalid blood group format (e.g., A+, B-, AB+, O+)",
    ),
  aadhaarNo: z
    .string()
    .optional()
    .refine(
      val => !val || (/^\d{12}$/.test(val) && !/[a-zA-Z]/.test(val)),
      "Aadhaar number must contain only digits and be exactly 12 digits",
    ),
  panNo: z
    .string()
    .optional()
    .refine(
      val =>
        !val ||
        (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val) &&
          !/[a-z0-9]/.test(val.slice(0, 5)) &&
          !/[a-z]/.test(val.slice(5, 9)) &&
          !/[0-9]/.test(val.slice(9, 10))),
      "PAN must follow format: 5 letters, 4 digits, 1 letter (case-sensitive)",
    ),
  permanentAddress: z
    .string()
    .optional()
    .refine(
      val => !val || val.trim().length >= 5,
      "Permanent address must be at least 5 characters if provided",
    ),
  currentAddress: z
    .string()
    .optional()
    .refine(
      val => !val || val.trim().length >= 5,
      "Current address must be at least 5 characters if provided",
    ),
  bankName: z
    .string()
    .optional()
    .refine(
      val => !val || (val.trim().length >= 2 && /^[a-zA-Z\s&.-]+$/.test(val)),
      "Bank name must be at least 2 characters and contain only letters, spaces, &, ., -",
    )
    .optional(),
  accountNo: z
    .string()
    .optional()
    .refine(
      val => !val || (/^\d+$/.test(val) && val.trim().length >= 8),
      "Account number must contain only digits and be at least 8 characters",
    ),
  ifscCode: z
    .string()
    .optional()
    .refine(
      val => !val || (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(val) && !/[a-z]/.test(val)),
      "IFSC code must contain only uppercase letters and digits (e.g., SBIN0001234)",
    ),
  branch: z
    .string()
    .optional()
    .refine(
      val =>
        !val || (val.trim().length >= 2 && /^[a-zA-Z0-9\s&.-]+$/.test(val)),
      "Branch name must be at least 2 characters and contain only letters, numbers, spaces, &, ., -",
    )
    .optional(),
  gender: z.enum(["male", "female", "other"]).or(z.literal("")).optional(),
  // Optional class assignment fields for create student
  classId: z.string().optional(),
  academicYearId: z.string().optional(),
});

export const updateStudentSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name cannot exceed 30 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  middleName: z
    .string()
    .max(30, "Middle name cannot exceed 30 characters")
    .regex(/^[a-zA-Z\s]*$/, "Middle name can only contain letters and spaces")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name cannot exceed 30 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .max(40, "Email cannot exceed 40 characters")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .max(10, "Phone cannot exceed 10 digits")
    .regex(
      /^[6-9]\d{9}$/,
      "Phone number must be a valid Indian mobile number (starting with 6, 7, 8, or 9)",
    )
    .or(z.literal(""))
    .optional(),
  rollNo: z
    .string()
    .min(1, "Roll No is required")
    .max(10, "Roll No cannot exceed 10 characters")
    .regex(/^\d+$/, "Roll No must contain only numbers"),
  admissionDate: z
    .string()
    .min(1, "Admission date is required")
    .refine(val => {
      const date = new Date(val);
      const today = new Date();
      return !isNaN(date.getTime()) && date <= today;
    }, "Admission date must be a valid date and cannot be in the future"),
  dob: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true; // Allow empty/undefined
      const birthDate = new Date(val);
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 25,
        today.getMonth(),
        today.getDate(),
      );
      const maxDate = new Date(
        today.getFullYear() - 5,
        today.getMonth(),
        today.getDate(),
      );
      return (
        !isNaN(birthDate.getTime()) &&
        birthDate <= maxDate &&
        birthDate >= minDate
      );
    }, "Student age must be between 5 and 25 years"),
  fatherName: z
    .string()
    .max(30, "Father name cannot exceed 30 characters")
    .regex(/^[a-zA-Z\s]*$/, "Father name can only contain letters and spaces")
    .refine(
      val => !val || val.trim().length >= 2,
      "Father name must be at least 2 characters if provided",
    )
    .optional(),
  fatherPhone: z
    .string()
    .max(10, "Father phone cannot exceed 10 digits")
    .regex(
      /^[6-9]\d{9}$/,
      "Father phone must be a valid Indian mobile number (starting with 6, 7, 8, or 9)",
    )
    .or(z.literal(""))
    .optional(),
  motherName: z
    .string()
    .max(30, "Mother name cannot exceed 30 characters")
    .regex(/^[a-zA-Z\s]*$/, "Mother name can only contain letters and spaces")
    .refine(
      val => !val || val.trim().length >= 2,
      "Mother name must be at least 2 characters if provided",
    )
    .optional(),
  guardianName: z
    .string()
    .max(30, "Guardian name cannot exceed 30 characters")
    .regex(/^[a-zA-Z\s]*$/, "Guardian name can only contain letters and spaces")
    .refine(
      val => !val || val.trim().length >= 2,
      "Guardian name must be at least 2 characters if provided",
    )
    .optional(),
  familyAnnualIncome: z
    .string()
    .optional()
    .refine(
      val => !val || /^\d*$/.test(val),
      "Family income must contain only numbers",
    )
    .refine(
      val => !val || parseInt(val) > 0,
      "Family income must be greater than 0 if provided",
    ),
  medicalConditions: z
    .string()
    .max(100, "Medical conditions cannot exceed 100 characters")
    .refine(
      val => !val || val.trim().length >= 3,
      "Medical conditions must be at least 3 characters if provided",
    )
    .optional(),
  bloodGroup: z
    .string()
    .optional()
    .refine(
      val => !val || /^(A|B|AB|O)[+-]?$/i.test(val),
      "Invalid blood group format (e.g., A+, B-, AB+, O+)",
    ),
  aadhaarNo: z
    .string()
    .optional()
    .refine(
      val => !val || (/^\d{12}$/.test(val) && !/[a-zA-Z]/.test(val)),
      "Aadhaar number must contain only digits and be exactly 12 digits",
    ),
  panNo: z
    .string()
    .optional()
    .refine(
      val =>
        !val ||
        (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val) &&
          !/[a-z0-9]/.test(val.slice(0, 5)) &&
          !/[a-z]/.test(val.slice(5, 9)) &&
          !/[0-9]/.test(val.slice(9, 10))),
      "PAN must follow format: 5 letters, 4 digits, 1 letter (case-sensitive)",
    ),
  permanentAddress: z
    .string()
    .optional()
    .refine(
      val => !val || val.trim().length >= 5,
      "Permanent address must be at least 5 characters if provided",
    ),
  currentAddress: z
    .string()
    .optional()
    .refine(
      val => !val || val.trim().length >= 5,
      "Current address must be at least 5 characters if provided",
    ),
  bankName: z
    .string()
    .optional()
    .refine(
      val => !val || (val.trim().length >= 2 && /^[a-zA-Z\s&.-]+$/.test(val)),
      "Bank name must be at least 2 characters and contain only letters, spaces, &, ., -",
    )
    .optional(),
  accountNo: z
    .string()
    .optional()
    .refine(
      val => !val || (/^\d+$/.test(val) && val.trim().length >= 8),
      "Account number must contain only digits and be at least 8 characters",
    ),
  ifscCode: z
    .string()
    .optional()
    .refine(
      val => !val || (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(val) && !/[a-z]/.test(val)),
      "IFSC code must contain only uppercase letters and digits (e.g., SBIN0001234)",
    ),
  branch: z
    .string()
    .optional()
    .refine(
      val =>
        !val || (val.trim().length >= 2 && /^[a-zA-Z0-9\s&.-]+$/.test(val)),
      "Branch name must be at least 2 characters and contain only letters, numbers, spaces, &, ., -",
    )
    .optional(),
  gender: z.enum(["male", "female", "other"]).or(z.literal("")).optional(),
  // Optional class assignment fields for update student
  classId: z.string().optional(),
  academicYearId: z.string().optional(),
});

export type StudentFormValues = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  rollNo: string;
  admissionDate: string;
  dob?: string;
  gender?: "male" | "female" | "other" | "";
  fatherName?: string;
  fatherPhone?: string;
  motherName?: string;
  guardianName?: string;
  familyAnnualIncome?: string;
  medicalConditions?: string;
  bloodGroup?: string;
  aadhaarNo?: string;
  panNo?: string;
  permanentAddress?: string;
  currentAddress?: string;
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
  branch?: string;
  classId?: string;
  academicYearId?: string;
};

export const STUDENT_FIELDS: {
  name: keyof StudentFormValues;
  label: string;
  type: string;
  placeholder: string;
  fullWidth?: boolean;
  optional?: boolean;
  section?: string;
}[] = [
  // Personal Details Section
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "e.g. Man",
    fullWidth: true,
    section: "Personal Details",
  },
  {
    name: "middleName",
    label: "Middle Name",
    type: "text",
    placeholder: "e.g. Kumar",
    optional: true,
    fullWidth: true,
    section: "Personal Details",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "e.g. Lakhani",
    fullWidth: true,
    section: "Personal Details",
  },

  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "e.g. student@gmail.com",
    fullWidth: true,
    section: "Personal Details",
  },

  {
    name: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "e.g. 9099330195",
    fullWidth: true,
    section: "Personal Details",
  },

  {
    name: "dob",
    label: "Date of Birth",
    type: "date",
    placeholder: "",
    optional: true,
    fullWidth: true,
    section: "Personal Details",
  },

  {
    name: "gender",
    label: "Gender",
    type: "select",
    placeholder: "Select gender",
    optional: true,
    fullWidth: true,
    section: "Personal Details",
  },

  {
    name: "bloodGroup",
    label: "Blood Group",
    type: "select",
    placeholder: "Select blood group",
    optional: true,
    fullWidth: true,
    section: "Personal Details",
  },

  {
    name: "aadhaarNo",
    label: "Aadhaar Number",
    type: "text",
    placeholder: "e.g. 123456789012",
    optional: true,
    fullWidth: true,
    section: "Personal Details",
  },
  {
    name: "panNo",
    label: "PAN Number",
    type: "text",
    placeholder: "e.g. ABCDE1234F",
    optional: true,
    fullWidth: true,
    section: "Personal Details",
  },
  {
    name: "permanentAddress",
    label: "Permanent Address",
    type: "text",
    placeholder: "e.g. 123 Main Street, City",
    optional: true,
    fullWidth: true,
    section: "Personal Details",
  },
  {
    name: "currentAddress",
    label: "Current Address",
    type: "text",
    placeholder: "e.g. 456 Temp Street, City",
    optional: true,
    fullWidth: true,
    section: "Personal Details",
  },

  // Academic Details Section
  {
    name: "rollNo",
    label: "Roll No",
    type: "text",
    placeholder: "e.g. 1",
    fullWidth: true,
    section: "Academic Details",
  },
  {
    name: "admissionDate",
    label: "Admission Date",
    type: "date",
    placeholder: "",
    fullWidth: true,
    section: "Academic Details",
  },

  {
    name: "academicYearId",
    label: "Academic Year",
    type: "classAssignment",
    placeholder: "Select Academic Year",
    optional: true,
    fullWidth: true,
    section: "Academic Details",
  },
  {
    name: "classId",
    label: "Class",
    type: "classAssignment",
    placeholder: "Select Class",
    optional: true,
    fullWidth: true,
    section: "Academic Details",
  },

  // Family Details Section
  {
    name: "fatherName",
    label: "Father Name",
    type: "text",
    placeholder: "e.g. John Doe",
    optional: true,
    fullWidth: true,
    section: "Family Details",
  },

  {
    name: "fatherPhone",
    label: "Father Phone",
    type: "tel",
    placeholder: "e.g. 9099330195",
    optional: true,
    fullWidth: true,
    section: "Family Details",
  },
  {
    name: "motherName",
    label: "Mother Name",
    type: "text",
    placeholder: "e.g. Jane Doe",
    optional: true,
    fullWidth: true,
    section: "Family Details",
  },

  {
    name: "guardianName",
    label: "Guardian Name",
    type: "text",
    placeholder: "e.g. Guardian Name",
    optional: true,
    fullWidth: true,
    section: "Family Details",
  },
  {
    name: "familyAnnualIncome",
    label: "Family Annual Income",
    type: "text",
    placeholder: "e.g. 500000",
    optional: true,
    fullWidth: true,
    section: "Family Details",
  },

  {
    name: "medicalConditions",
    label: "Medical Conditions",
    type: "text",
    placeholder: "e.g. Asthma, Allergies",
    optional: true,
    fullWidth: true,
    section: "Family Details",
  },

  // Bank Details Section
  {
    name: "bankName",
    label: "Bank Name",
    type: "text",
    placeholder: "e.g. State Bank of India",
    optional: true,
    fullWidth: true,
    section: "Bank Details",
  },
  {
    name: "accountNo",
    label: "Account Number",
    type: "text",
    placeholder: "e.g. 123456789012",
    optional: true,
    fullWidth: true,
    section: "Bank Details",
  },
  {
    name: "ifscCode",
    label: "IFSC Code",
    type: "text",
    placeholder: "e.g. SBIN0001234",
    optional: true,
    fullWidth: true,
    section: "Bank Details",
  },
  {
    name: "branch",
    label: "Branch Name",
    type: "text",
    placeholder: "e.g. Main Branch, Delhi",
    optional: true,
    fullWidth: true,
    section: "Bank Details",
  },
];

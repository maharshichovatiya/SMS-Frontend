import { z } from "zod";

export const createStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\d{10}$/, "Phone must be a 10-digit number"),
  admissionNo: z
    .string()
    .min(1, "Admission No is required")
    .regex(/^\d+$/, "Must be a number"),
  rollNo: z
    .string()
    .min(1, "Roll No is required")
    .regex(/^\d+$/, "Must be a number"),
  admissionDate: z.string().min(1, "Admission date is required"),
});

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;

export const STUDENT_FIELDS: {
  name: keyof CreateStudentFormValues;
  label: string;
  type: string;
  placeholder: string;
  fullWidth?: boolean;
  optional?: boolean;
}[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "e.g. Man",
  },
  {
    name: "middleName",
    label: "Middle Name",
    type: "text",
    placeholder: "e.g. Kumar",
    optional: true,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "e.g. Lakhani",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "e.g. student@gmail.com",
    fullWidth: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Min 6 characters",
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    placeholder: "e.g. 9099330195",
  },
  {
    name: "admissionNo",
    label: "Admission No",
    type: "text",
    placeholder: "e.g. 440",
  },
  { name: "rollNo", label: "Roll No", type: "text", placeholder: "e.g. 1" },
  {
    name: "admissionDate",
    label: "Admission Date",
    type: "date",
    placeholder: "",
    fullWidth: true,
  },
];

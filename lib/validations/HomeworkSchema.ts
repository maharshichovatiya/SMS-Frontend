import { z } from "zod";

export const createHomeworkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  subject: z.string().min(1, "Subject is required").uuid("Invalid subject ID"),
  assignedDate: z
    .string()
    .min(1, "Assigned date is required")
    .refine(date => !isNaN(Date.parse(date)), "Invalid assigned date format"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine(date => !isNaN(Date.parse(date)), "Invalid due date format")
    .refine(
      date => new Date(date) > new Date(),
      "Due date must be in the future",
    ),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  classno: z
    .string()
    .max(20, "Class number cannot exceed 20 characters")
    .optional(),
  instructions: z
    .string()
    .max(1000, "Instructions cannot exceed 1000 characters")
    .optional(),
  assignToClasses: z
    .array(z.object({ classId: z.string().uuid("Invalid class ID") }))
    .optional(),
  assignToStudents: z
    .array(z.object({ studentId: z.string().uuid("Invalid student ID") }))
    .optional(),
  attachments: z
    .array(z.instanceof(File))
    .max(5, "Maximum 5 files allowed")
    .optional(),
});

export const assignToClassesSchema = z.object({
  classes: z.array(z.object({ classId: z.string().uuid("Invalid class ID") })),
});

export const assignToStudentsSchema = z.object({
  students: z.array(
    z.object({ studentId: z.string().uuid("Invalid student ID") }),
  ),
});

export const updateHomeworkSchema = createHomeworkSchema.partial();

export type CreateHomeworkFormData = z.infer<typeof createHomeworkSchema>;
export type AssignToClassesFormData = z.infer<typeof assignToClassesSchema>;
export type AssignToStudentsFormData = z.infer<typeof assignToStudentsSchema>;
export type UpdateHomeworkFormData = z.infer<typeof updateHomeworkSchema>;

export const homeworkFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),

  subjectId: z.string().min(1, "Subject is required"),

  chapterId: z.string().optional(),

  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine(date => !isNaN(Date.parse(date)), "Invalid date format"),

  assignedTo: z.enum(["singleClass", "singleStudent", "multipleStudents"], {
    required_error: "Please choose who to assign to",
  }),

  selectedClass: z.string().optional(),
  selectedClasses: z.array(z.string()).optional(),
  selectedGroup: z.string().optional(),
  selectedStudents: z.array(z.string()).optional(),

  allowLateSubmission: z.boolean().optional(),
  maxFileSize: z.number().optional(),

  // Files are managed outside RHF (state), validated manually
});

// Edit schema — only requires title, description, dueDate
export const editHomeworkFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),

  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine(date => !isNaN(Date.parse(date)), "Invalid date format"),
});

export type HomeworkFormValues = z.infer<typeof homeworkFormSchema>;
export type EditHomeworkFormValues = z.infer<typeof editHomeworkFormSchema>;

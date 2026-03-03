import { z } from "zod";

export const chapterSchema = z.object({
  chapterName: z
    .string()
    .min(1, "Chapter name is required")
    .max(50, "Chapter name cannot exceed 50 characters"),
  chapterNo: z.number().min(1, "Chapter number is required"),
});

export const createSubjectSchema = z
  .object({
    subjectName: z
      .string()
      .min(1, "Subject name is required")
      .max(40, "Subject name cannot exceed 40 characters"),
    subjectCode: z
      .string()
      .min(1, "Subject code is required")
      .max(30, "Subject code cannot exceed 30 characters"),
    passingMarks: z.number().min(1, "Passing marks must be greater than 0"),
    maxMarks: z.number().min(1, "Maximum marks must be greater than 0"),
    chapters: z.array(chapterSchema).min(1, "At least one chapter is required"),
  })
  .refine(data => data.passingMarks <= data.maxMarks, {
    message: "Passing marks cannot be greater than maximum marks",
    path: ["passingMarks"],
  });

export const updateSubjectSchema = z
  .object({
    subjectName: z
      .string()
      .min(1, "Subject name is required")
      .max(40, "Subject name cannot exceed 40 characters")
      .optional(),
    subjectCode: z
      .string()
      .min(1, "Subject code is required")
      .max(30, "Subject code cannot exceed 30 characters")
      .optional(),
    passingMarks: z
      .number()
      .min(1, "Passing marks must be greater than 0")
      .optional(),
    maxMarks: z
      .number()
      .min(1, "Maximum marks must be greater than 0")
      .optional(),
    chapters: z
      .array(chapterSchema)
      .min(1, "At least one chapter is required")
      .optional(),
    status: z.enum(["active", "inactive"]).optional(),
  })
  .refine(
    data => {
      if (data.passingMarks !== undefined && data.maxMarks !== undefined) {
        return data.passingMarks <= data.maxMarks;
      }
      return true;
    },
    {
      message: "Passing marks cannot be greater than maximum marks",
      path: ["passingMarks"],
    },
  );

export type CreateSubjectFormValues = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectFormValues = z.infer<typeof updateSubjectSchema>;

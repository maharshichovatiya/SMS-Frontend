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

// Schema for CreateChapterForm - multiple chapters with enhanced validation
export const createChaptersFormSchema = z.object({
  chapters: z
    .array(
      z.object({
        chapterName: z
          .string()
          .min(2, "Chapter name must be at least 2 characters")
          .max(50, "Chapter name cannot exceed 50 characters")
          .regex(
            /^[^<>"'&]*$/,
            "Chapter name cannot contain special characters like < > \" ' &",
          ),
        chapterNo: z
          .number()
          .int("Chapter number must be an integer")
          .min(1, "Chapter number must be at least 1"),
      }),
    )
    .min(1, "At least one chapter is required")
    .superRefine((chapters, ctx) => {
      // Check for duplicate chapter numbers
      const chapterNumbers = chapters.map(c => c.chapterNo);
      const uniqueNumbers = new Set(chapterNumbers);
      if (chapterNumbers.length !== uniqueNumbers.size) {
        chapters.forEach((chapter, index) => {
          const duplicates = chapterNumbers.filter(
            n => n === chapter.chapterNo,
          );
          if (duplicates.length > 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Chapter numbers must be unique",
              path: [`chapters`, index, "chapterNo"],
            });
          }
        });
      }

      // Check for duplicate chapter names (case-insensitive)
      const chapterNames = chapters.map(c =>
        c.chapterName.trim().toLowerCase(),
      );
      const uniqueNames = new Set(chapterNames);
      if (chapterNames.length !== uniqueNames.size) {
        chapters.forEach((chapter, index) => {
          const duplicates = chapterNames.filter(
            n => n === chapter.chapterName.trim().toLowerCase(),
          );
          if (duplicates.length > 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Chapter names must be unique",
              path: [`chapters`, index, "chapterName"],
            });
          }
        });
      }
    }),
});

export type CreateChaptersFormValues = z.infer<typeof createChaptersFormSchema>;

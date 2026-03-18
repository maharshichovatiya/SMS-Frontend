import { z } from "zod";

export const homeworkSubmissionSchema = z.object({
  homeworkId: z.string().min(1, "Homework ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
  attachments: z
    .array(z.instanceof(File))
    .min(1, "At least one file is required"),
  attachmentDate: z.string().min(1, "Attachment date is required"),
  notes: z.string().optional(),
});

export type HomeworkSubmissionFormData = z.infer<
  typeof homeworkSubmissionSchema
>;

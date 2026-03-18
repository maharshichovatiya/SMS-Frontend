import { z } from "zod";

export const homeworkSubmissionSchema = z.object({
  homeworkId: z.string().min(1, "Homework ID is required"),
  attachments: z
    .array(z.instanceof(File))
    .min(1, "At least one file is required"),
});

export type HomeworkSubmissionFormData = z.infer<
  typeof homeworkSubmissionSchema
>;

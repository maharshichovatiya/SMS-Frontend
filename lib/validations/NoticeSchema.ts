import { z } from "zod";

export const createNoticeSchema = z
  .object({
    type: z
      .enum(["general", "exam", "holiday", "event"])
      .refine(val => val !== undefined, {
        message: "Notice type is required",
      }),
    title: z
      .string()
      .min(1, "Notice title is required")
      .max(100, "Title cannot exceed 100 characters")
      .regex(
        /^[^<>"'&]*$/,
        "Title cannot contain special characters like < > \" ' &",
      ),
    body: z
      .string()
      .min(10, "Notice content must be at least 10 characters")
      .max(1000, "Notice content cannot exceed 1000 characters")
      .regex(
        /^[^<>"'&]*$/,
        "Content cannot contain special characters like < > \" ' &",
      ),
    priority: z
      .enum(["high", "medium", "low"])
      .refine(val => val !== undefined, {
        message: "Priority level is required",
      }),
    publishDate: z
      .string()
      .min(1, "Publish date is required")
      .refine(
        date => {
          const parsedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return parsedDate >= today;
        },
        {
          message: "Publish date cannot be in the past",
        },
      ),
    expireDate: z
      .string()
      .min(1, "Expiry date is required")
      .refine(
        date => {
          const parsedDate = new Date(date);
          return parsedDate > new Date();
        },
        {
          message: "Expiry date must be in the future",
        },
      ),
    targetType: z
      .enum(["school", "class", "teacher"])
      .refine(val => val !== undefined, {
        message: "Target type is required",
      }),
    targetIds: z.array(z.string()).optional(),
  })
  .refine(
    data => {
      const publishDate = new Date(data.publishDate);
      const expireDate = new Date(data.expireDate);
      return expireDate > publishDate;
    },
    {
      message: "Expiry date must be after publish date",
      path: ["expireDate"],
    },
  );

export type CreateNoticeFormValues = z.infer<typeof createNoticeSchema>;

import { z } from "zod";

export const createChapterResourceSchema = z
  .object({
    chapterId: z.string().min(1, "Chapter is required"),
    title: z
      .string()
      .min(1, "Resource title is required")
      .max(150, "Title cannot exceed 150 characters")
      .regex(
        /^[^<>"'&]*$/,
        "Title cannot contain special characters like < > \" ' &",
      ),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description cannot exceed 1000 characters")
      .regex(
        /^[^<>"'&]*$/,
        "Description cannot contain special characters like < > \" ' &",
      )
      .optional()
      .or(z.literal("")),
    resourceType: z.enum([
      "PDF",
      "Word",
      "PowerPoint",
      "Image",
      "Text",
      "Link",
      "Notes",
    ]),
    fileUrl: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    status: z.enum(["active", "inactive"]).optional().default("active"),
  })
  .refine(
    data => {
      // If resource type is Link, fileUrl is required
      if (data.resourceType === "Link") {
        return data.fileUrl && data.fileUrl.trim().length > 0;
      }
      return true;
    },
    {
      message: "File URL is required for Link type resources",
      path: ["fileUrl"],
    },
  );

export type CreateChapterResourceFormValues = z.input<
  typeof createChapterResourceSchema
>;

export interface ChapterResource {
  id: string;
  chapterId: string;
  title: string;
  description?: string;
  resourceType:
    | "PDF"
    | "Word"
    | "PowerPoint"
    | "Image"
    | "Text"
    | "Link"
    | "Notes";
  fileUrl?: string;
  uploadedBy: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

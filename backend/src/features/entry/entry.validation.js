import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const dateString = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

const timelineBlockSchema = z.object({
  type: z.enum(["work", "break"]),
  project: objectId.optional().nullable(),
  task: objectId.optional().nullable(),
  startTime: dateString,
  endTime: dateString,
  notes: z.string().max(1000).optional().nullable(),
});

export const createEntrySchema = z.object({
  body: z.object({
    date: dateString,
    employeeId: objectId.optional(),
    notes: z.string().max(2000).optional().nullable(),
    timeline: z.array(timelineBlockSchema).min(1, "Timeline is required"),
  }),
});

export const updateEntrySchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    date: dateString.optional(),
    employeeId: objectId.optional(),
    notes: z.string().max(2000).optional().nullable(),
    timeline: z.array(timelineBlockSchema).min(1).optional(),
  }),
});

export const updateEntryStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.enum(["approved", "rejected"]),
  }),
});

export const entryIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const getEntriesSchema = z.object({
  query: z.object({
    from: dateString.optional(),
    to: dateString.optional(),
    employeeId: objectId.optional(),
    projectId: objectId.optional(),
    taskId: objectId.optional(),
    status: z.enum(["submitted", "approved", "rejected"]).optional(),
    page: z
      .string()
      .transform(Number)
      .pipe(z.number().int().positive())
      .optional()
      .default("1"),
    limit: z
      .string()
      .transform(Number)
      .pipe(z.number().int().min(1).max(100))
      .optional()
      .default("20"),
  }),
});

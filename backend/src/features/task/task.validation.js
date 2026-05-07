import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createTaskSchema = z.object({
  body: z.object({
    project: objectId,
    title: z.string().min(2).max(200),
    description: z.string().max(2000).optional().nullable(),
    assignee: objectId.optional().nullable(),
    status: z.enum(["todo", "in-progress", "blocked", "done"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    startDate: z.string().optional().nullable(),
    dueDate: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    project: objectId.optional(),
    title: z.string().min(2).max(200).optional(),
    description: z.string().max(2000).optional().nullable(),
    assignee: objectId.optional().nullable(),
    status: z.enum(["todo", "in-progress", "blocked", "done"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    startDate: z.string().optional().nullable(),
    dueDate: z.string().optional().nullable(),
    completedAt: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export const taskIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const getTasksSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    project: objectId.optional(),
    assignee: objectId.optional(),
    status: z.enum(["todo", "in-progress", "blocked", "done"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    isActive: z
      .string()
      .transform((value) => value === "true")
      .optional(),
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

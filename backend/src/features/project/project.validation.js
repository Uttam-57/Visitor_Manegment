import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createProjectSchema = z.object({
  body: z.object({
    code: z.string().min(2).max(20),
    name: z.string().min(2).max(120),
    description: z.string().max(1000).optional().nullable(),
    department: objectId,
    manager: objectId,
    members: z.array(objectId).optional(),
    status: z.enum(["planned", "active", "on-hold", "completed"]).optional(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    code: z.string().min(2).max(20).optional(),
    name: z.string().min(2).max(120).optional(),
    description: z.string().max(1000).optional().nullable(),
    department: objectId.optional(),
    manager: objectId.optional(),
    members: z.array(objectId).optional(),
    status: z.enum(["planned", "active", "on-hold", "completed"]).optional(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export const projectIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const getProjectsSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    department: objectId.optional(),
    manager: objectId.optional(),
    status: z.enum(["planned", "active", "on-hold", "completed"]).optional(),
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

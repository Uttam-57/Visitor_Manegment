import { z } from "zod";

export const createDepartmentSchema = z.object({
  body: z.object({
    depName: z.string().min(2, "Department name must be at least 2 characters").max(100),
    depCode: z.string().min(2, "Department code must be at least 2 characters").max(20),
    isActive: z.boolean().optional(),
  }),
});

export const updateDepartmentSchema = z.object({
  body: z.object({
    depName: z.string().min(2).max(100).optional(),
    depCode: z.string().min(2).max(20).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Department ID"),
  }),
});

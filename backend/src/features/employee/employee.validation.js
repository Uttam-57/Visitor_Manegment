import { z } from "zod";

export const createEmployeeSchema = z.object({
  body: z.object({
    empId: z.string().min(2).max(50),
    empName: z.object({
      first: z.string().min(1).max(50),
      middle: z.string().max(50).optional(),
      last: z.string().min(1).max(50),
    }),
    emp_dep: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Department ID"),
    manager_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Manager ID").optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateEmployeeSchema = z.object({
  body: z.object({
    empId: z.string().min(2).max(50).optional(),
    empName: z.object({
      first: z.string().min(1).max(50).optional(),
      middle: z.string().max(50).optional(),
      last: z.string().min(1).max(50).optional(),
    }).optional(),
    emp_dep: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Department ID").optional(),
    manager_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Manager ID").optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Employee ID"),
  }),
});

import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const dateString = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

const baseRangeSchema = {
  from: dateString.optional(),
  to: dateString.optional(),
};

export const dailyLogsSchema = z.object({
  query: z.object({
    ...baseRangeSchema,
    employeeId: objectId.optional(),
    departmentId: objectId.optional(),
    projectId: objectId.optional(),
    taskId: objectId.optional(),
  }),
});

export const timesheetSummarySchema = z.object({
  query: z.object({
    ...baseRangeSchema,
    employeeId: objectId.optional(),
    departmentId: objectId.optional(),
    projectId: objectId.optional(),
    taskId: objectId.optional(),
  }),
});

export const projectProgressSchema = z.object({
  query: z.object({
    ...baseRangeSchema,
    projectId: objectId,
  }),
});

export const taskStatusSchema = z.object({
  query: z.object({
    ...baseRangeSchema,
    projectId: objectId.optional(),
    departmentId: objectId.optional(),
    assigneeId: objectId.optional(),
    status: z.enum(["todo", "in-progress", "blocked", "done"]).optional(),
  }),
});

export const attendanceSchema = z.object({
  query: z.object({
    ...baseRangeSchema,
    employeeId: objectId.optional(),
    departmentId: objectId.optional(),
  }),
});

export const missingEntriesSchema = z.object({
  query: z.object({
    date: dateString.optional(),
    departmentId: objectId.optional(),
  }),
});

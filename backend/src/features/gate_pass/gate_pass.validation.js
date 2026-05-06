import { z } from "zod";

export const createGatePassSchema = z.object({
  body: z.object({
    passType: z.enum(["singleday", "multipleday"]),
    dateFrom: z.string().datetime(),
    dateTo: z.string().datetime(),
    createdBy: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID"),
    employee_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Employee ID"),
    location_id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    visitingArea: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    visitorType: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    purpose: z.string().min(2),
    visitors: z.array(
      z.object({
        name: z.string().min(2),
        phone: z.string().min(5),
        email: z.string().email().optional(),
        company: z.string().optional(),
        idProofType: z.string().optional(),
        idProofNumber: z.string().optional(),
        photo: z.string().optional(),
        itemCarryWith: z.array(z.string()).optional(),
        visitorCount: z.number().optional(),
        description: z.string().optional(),
      })
    ).min(1, "At least one visitor is required"),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "approved", "reject", "check in", "check out", "cancelled"]),
  }),
});

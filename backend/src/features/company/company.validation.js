import { z } from "zod";

export const createCompanySchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    shortName: z.string().min(2),
    host: z.string().min(2),
    email: z.string().email(),
    logo: z.string().optional(),
    portNo: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateCompanySchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    shortName: z.string().min(2).optional(),
    host: z.string().min(2).optional(),
    email: z.string().email().optional(),
    logo: z.string().optional(),
    portNo: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Company ID"),
  }),
});

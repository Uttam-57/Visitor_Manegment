import { z } from "zod";

export const createSettingTemplateSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    type: z.string().min(2),
    fields: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
        fieldType: z.string(),
        required: z.boolean().optional(),
        options: z.array(z.string()).optional(),
      })
    ),
    isActive: z.boolean().optional(),
  }),
});

export const createSettingSchema = z.object({
  body: z.object({
    template: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Template ID"),
    type: z.string(),
    value: z.record(z.any()),
    isActive: z.boolean().optional(),
  }),
});

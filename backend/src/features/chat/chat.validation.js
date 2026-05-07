import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createConversationSchema = z.object({
  body: z.object({
    type: z.enum(["direct", "group", "department"]),
    name: z.string().min(2).max(120).optional().nullable(),
    memberId: objectId.optional(),
    memberIds: z.array(objectId).optional(),
    departmentId: objectId.optional(),
  }),
});

export const conversationIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const listMessagesSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  query: z.object({
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
      .default("30"),
  }),
});

export const sendMessageSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    content: z.string().min(1).max(2000),
  }),
});

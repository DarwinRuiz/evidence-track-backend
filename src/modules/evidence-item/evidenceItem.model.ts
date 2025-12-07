import { z } from 'zod';

const evidenceItemBaseSchema = z.object({
    caseFileId: z.number().int().positive(),
    description: z
        .string()
        .min(3, 'The description must have at least 3 characters')
        .max(500, 'The description must not exceed 500 characters'),
    color: z
        .string()
        .max(50, 'The color must not exceed 50 characters')
        .optional()
        .nullable(),
    size: z
        .string()
        .max(50, 'The size must not exceed 50 characters')
        .optional()
        .nullable(),
    weight: z
        .string()
        .max(50, 'The weight must not exceed 50 characters')
        .optional()
        .nullable(),
    locationFound: z
        .string()
        .max(
            200,
            'The location where the item was found must not exceed 200 characters'
        )
        .optional()
        .nullable(),
    technicianId: z.number().int().positive(),
    createdAt: z.date(),
});

export const evidenceItemEntitySchema = evidenceItemBaseSchema.extend({
    evidenceItemId: z.number().int().positive(),
});

export type EvidenceItem = z.infer<typeof evidenceItemEntitySchema>;

export const createEvidenceItemBodySchema = z.object({
    caseFileId: evidenceItemBaseSchema.shape.caseFileId,
    description: evidenceItemBaseSchema.shape.description,
    color: evidenceItemBaseSchema.shape.color,
    size: evidenceItemBaseSchema.shape.size,
    weight: evidenceItemBaseSchema.shape.weight,
    locationFound: evidenceItemBaseSchema.shape.locationFound,
});

export type CreateEvidenceItemInput = z.infer<
    typeof createEvidenceItemBodySchema
>;

export const updateEvidenceItemBodySchema = z.object({
    description: evidenceItemBaseSchema.shape.description.optional(),
    color: evidenceItemBaseSchema.shape.color.optional(),
    size: evidenceItemBaseSchema.shape.size.optional(),
    weight: evidenceItemBaseSchema.shape.weight.optional(),
    locationFound: evidenceItemBaseSchema.shape.locationFound.optional(),
});

export type UpdateEvidenceItemInput = z.infer<
    typeof updateEvidenceItemBodySchema
>;

// Listar evidencias por caso
export const listEvidenceItemsQuerySchema = z.object({
    caseFileId: z.coerce
        .number()
        .int()
        .positive('The case file id must be a positive number'),
    offset: z.coerce.number().int().min(0).optional(),
    limit: z.coerce.number().int().positive().optional(),
});

export type ListEvidenceItemsQuery = z.infer<
    typeof listEvidenceItemsQuerySchema
>;

export const evidenceItemIdParamsSchema = z.object({
    evidenceItemId: z
        .string()
        .regex(/^\d+$/, 'The evidence item id must be a numeric value'),
});

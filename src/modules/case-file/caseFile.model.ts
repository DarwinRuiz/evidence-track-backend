import { z } from 'zod';

const caseFileBaseSchema = z.object({
    caseCode: z
        .string()
        .min(3, 'The case code must have at least 3 characters')
        .max(50, 'The case code must not exceed 50 characters'),
    description: z.string().optional(),
    registeredAt: z.date(),
    status: z.enum(['REGISTERED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']),
    rejectionReason: z.string().max(500).nullable().optional(),
    technicianId: z.number().int().positive(),
});

export const caseFileEntitySchema = caseFileBaseSchema.extend({
    caseFileId: z.number().int().positive(),
});

export type CaseFile = z.infer<typeof caseFileEntitySchema>;

export const createCaseFileBodySchema = z.object({
    caseCode: caseFileBaseSchema.shape.caseCode,
    description: caseFileBaseSchema.shape.description.optional(),
});

export type CreateCaseFileInput = z.infer<typeof createCaseFileBodySchema>;

export const updateCaseFileBodySchema = z
    .object({
        status: caseFileBaseSchema.shape.status.optional(),
        description: caseFileBaseSchema.shape.description.optional(),
        rejectionReason: caseFileBaseSchema.shape.rejectionReason.optional(),
        technicianId: caseFileBaseSchema.shape.technicianId.optional(),
    })
    .superRefine((data, refinementContext) => {
        if (data.status === 'REJECTED' && !data.rejectionReason) {
            refinementContext.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['rejectionReason'],
                message: 'Rejection reason is required when status is REJECTED',
            });
        }
    });

export type UpdateCaseFileInput = z.infer<typeof updateCaseFileBodySchema>;

export const listCaseFilesQuerySchema = z.object({
    status: caseFileBaseSchema.shape.status.optional(),
    initialRegisteredDate: z.string().optional(),
    finalRegisteredDate: z.string().optional(),
    offset: z.coerce.number().int().min(0).optional(),
    limit: z.coerce.number().int().min(1).positive().optional(),
});

export type ListCaseFilesQuery = z.infer<typeof listCaseFilesQuerySchema>;

export const caseFileIdParamsSchema = z.object({
    caseFileId: z
        .string()
        .regex(/^\d+$/, 'The case file id must be a numeric value'),
});

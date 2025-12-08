import { z } from 'zod';

export const reportFiltersSchema = z.object({
    status: z
        .enum(['REGISTERED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'])
        .optional(),
    initialRegisteredDate: z.string().datetime().optional(),
    finalRegisteredDate: z.string().datetime().optional(),
    technicianId: z
        .string()
        .regex(/^\d+$/)
        .transform((value) => Number(value))
        .optional(),
    daysBack: z
        .string()
        .regex(/^\d+$/)
        .transform((value) => Number(value))
        .optional(),
    top: z
        .string()
        .regex(/^\d+$/)
        .transform((value) => Number(value))
        .optional(),
});

export type ReportFilters = z.infer<typeof reportFiltersSchema>;

export const dashboardOverviewValidation = {
    querySchema: reportFiltersSchema,
};

export const caseFilesStatusByDayValidation = {
    querySchema: reportFiltersSchema,
};

export const technicianActivityValidation = {
    querySchema: reportFiltersSchema,
};

export const evidenceDensityValidation = {
    querySchema: reportFiltersSchema,
};

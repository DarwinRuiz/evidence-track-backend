import { z } from 'zod';

const userBaseSchema = z.object({
    fullName: z
        .string()
        .min(3, 'The full name must have at least 3 characters')
        .max(120, 'The full name must not exceed 120 characters'),
    email: z.string().email('A valid email address is required'),
    roleId: z.number().int().positive(),
});

export const userEntitySchema = userBaseSchema.extend({
    userId: z.number().int().positive(),
});

export type User = z.infer<typeof userEntitySchema>;

export const createUserBodySchema = userBaseSchema.extend({
    password: z
        .string()
        .min(6, 'The password must contain at least 6 characters'),
});

export type CreateUserInput = z.infer<typeof createUserBodySchema>;

export const updateUserBodySchema = userBaseSchema.extend({
    fullName: z
        .string()
        .min(3, 'The full name must have at least 3 characters')
        .max(120, 'The full name must not exceed 120 characters')
        .optional(),
    password: z
        .string()
        .min(6, 'The password must contain at least 6 characters')
        .optional(),
    email: z.string().email('A valid email address is required').optional(),
    roleId: z.number().int().positive().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserBodySchema>;

export const listUsersQuerySchema = z.object({
    offset: z.coerce.number().int().min(0).optional(),
    limit: z.coerce.number().int().min(0).optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

export const userIdParamsSchema = z.object({
    userId: z.string().regex(/^\d+$/, 'The user id must be a numeric value'),
});

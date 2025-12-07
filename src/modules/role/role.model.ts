import { z } from 'zod';

const roleBaseSchema = z.object({
    roleName: z
        .string()
        .min(1, 'The role name must have at least 1 character')
        .max(50, 'The role name must not exceed 50 characters'),
});

export const roleEntitySchema = roleBaseSchema.extend({
    roleId: z.number().int().positive(),
});

export type Role = z.infer<typeof roleEntitySchema>;

export const createRoleBodySchema = roleBaseSchema.extend({});

export type CreateRoleInput = z.infer<typeof createRoleBodySchema>;

export const updateRoleBodySchema = roleBaseSchema.extend({
    roleName: z
        .string()
        .min(1, 'The role name must have at least 1 character')
        .max(50, 'The role name must not exceed 50 characters')
        .optional(),
});

export type UpdateRoleInput = z.infer<typeof updateRoleBodySchema>;

export const listRolesQuerySchema = z.object({
    offset: z.coerce.number().int().min(0).optional(),
    limit: z.coerce.number().int().min(0).optional(),
});

export type ListRolesQuery = z.infer<typeof listRolesQuerySchema>;

export const roleIdParamsSchema = z.object({
    roleId: z.string().regex(/^\d+$/, 'The role id must be a numeric value'),
});

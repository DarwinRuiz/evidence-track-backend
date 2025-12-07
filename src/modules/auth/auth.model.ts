import { z } from 'zod';

export const userEntitySchema = z.object({
    userId: z.number().int().positive(),
    fullName: z.string().max(120),
    email: z.string().email().max(120),
    password: z.string(),
    roleName: z.string(),
});

export type User = z.infer<typeof userEntitySchema>;

// Login input from the client
export const loginInputSchema = z.object({
    email: z.string().max(120).email('A valid email address is required'),
    password: z.string().min(6, 'Password must contain at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Payload stored inside JWT
export const authTokenPayloadSchema = z.object({
    userId: z.number().int().positive(),
    email: z.string().max(120).email(),
    roleName: z.string(),
    fullName: z.string(),
});

export type AuthTokenPayload = z.infer<typeof authTokenPayloadSchema>;

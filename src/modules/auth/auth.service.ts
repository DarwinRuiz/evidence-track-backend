import { ApiError } from '../../core/http/ApiError';
import { jwtSecurity } from '../../core/security/jwt';
import { passwordSecurity } from '../../core/security/password';
import type { AuthTokenPayload, LoginInput, User } from './auth.model';
import { authRepository } from './auth.repository';

export const authService = {
    async login(input: LoginInput): Promise<{ token: string; user: User }> {
        const user = await authRepository.findUserByEmail(input.email);

        const passwordS = await passwordSecurity.hashPassword(input.password);

        if (!user) {
            throw ApiError.unauthorized(
                'Invalid credentials',
                'INVALID_CREDENTIALS'
            );
        }

        const isValidPassword = await passwordSecurity.comparePassword(
            input.password,
            user.password
        );

        if (!isValidPassword) {
            throw ApiError.unauthorized(
                'Invalid credentials',
                'INVALID_CREDENTIALS'
            );
        }

        const payload: AuthTokenPayload = {
            userId: user.userId,
            email: user.email,
            roleName: user.roleName,
            fullName: user.fullName,
        };

        const token = jwtSecurity.signAccessToken(payload);

        return { token, user };
    },
};

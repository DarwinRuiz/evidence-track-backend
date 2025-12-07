import { ApiError } from '../../core/http/ApiError';
import { passwordSecurity } from '../../core/security/password';
import {
    type CreateUserInput,
    type ListUsersQuery,
    type UpdateUserInput,
    type User,
} from './user.model';
import { userRepository } from './user.repository';

export const userService = {
    async createUser(input: CreateUserInput): Promise<User> {
        const password = await passwordSecurity.hashPassword(input.password);

        return userRepository.createUser(
            input.fullName,
            input.email,
            password,
            input.roleId
        );
    },

    async updateUser(userId: number, input: UpdateUserInput): Promise<User> {
        const existingUser: {
            fullName: string;
            email: string;
            roleId: number;
            userId: number;
        } | null = await userRepository.getUserById(userId);

        if (!existingUser) {
            throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
        }

        let password: string | undefined;

        if (input.password) {
            password = await passwordSecurity.hashPassword(input.password);
        }

        for (const key of Object.keys(input) as (keyof UpdateUserInput)[]) {
            if (input[key] !== undefined) {
                (existingUser as Record<string, unknown>)[key] = input[key]!;
            }
        }

        return userRepository.updateUser(
            userId,
            existingUser.fullName,
            existingUser.email,
            existingUser.roleId,
            password
        );
    },

    async deleteUser(userId: number): Promise<void> {
        const existingUser = await userRepository.getUserById(userId);

        if (!existingUser) {
            throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
        }

        await userRepository.deleteUser(userId);
    },

    async getUserById(userId: number): Promise<User> {
        const user = await userRepository.getUserById(userId);

        if (!user) {
            throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
        }

        return user;
    },

    async listUsers(query: ListUsersQuery): Promise<User[]> {
        return userRepository.listUsers(query);
    },

    async getTotalUserCount(): Promise<number> {
        return userRepository.getTotalUserCount();
    },
};

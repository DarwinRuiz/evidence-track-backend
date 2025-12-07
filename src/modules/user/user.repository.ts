import { databaseConnection } from '../../database/connection';
import { userEntitySchema, type ListUsersQuery, type User } from './user.model';

export const userRepository = {
    async createUser(
        fullName: string,
        email: string,
        password: string,
        roleId: number
    ): Promise<User> {
        const result = await databaseConnection.raw(
            'EXEC admin.sp_user_create @full_name = ?, @email = ?, @password = ?, @role_id = ?',
            [fullName, email, password, roleId]
        );

        const row = result[0];

        return userEntitySchema.parse({
            userId: row.user_id,
            fullName: row.full_name,
            email: row.email,
            password: row.password,
            roleId: row.role_id,
        });
    },

    async updateUser(
        userId: number,
        fullName: string,
        email: string,
        roleId: number,
        password?: string
    ): Promise<User> {
        const result = await databaseConnection.raw(
            'EXEC admin.sp_user_update @user_id = ?, @full_name = ?, @email = ?, @role_id = ?, @password = ?',
            [userId, fullName, email, roleId, password ?? null]
        );

        const row = result[0];

        return userEntitySchema.parse({
            userId: row.user_id,
            fullName: row.full_name,
            email: row.email,
            password: row.password,
            roleId: row.role_id,
        });
    },

    async deleteUser(userId: number): Promise<void> {
        await databaseConnection.raw('EXEC admin.sp_user_delete @user_id = ?', [
            userId,
        ]);
    },

    async getUserById(userId: number): Promise<User | null> {
        const result = await databaseConnection.raw(
            'EXEC admin.sp_user_get_by_id @user_id = ?',
            [userId]
        );

        const row = result[0];

        if (!row) {
            return null;
        }

        return userEntitySchema.parse({
            userId: row.user_id,
            fullName: row.full_name,
            email: row.email,
            password: row.password,
            roleId: row.role_id,
        });
    },

    async listUsers(query: ListUsersQuery): Promise<User[]> {
        const offset = query.offset ?? 0;
        const limit = query.limit ?? 10;

        const result = await databaseConnection.raw(
            'EXEC admin.sp_user_list @offset = ?, @limit = ?',
            [offset, limit]
        );

        const rows = result;

        return rows.map((row: any) =>
            userEntitySchema.parse({
                userId: row.user_id,
                fullName: row.full_name,
                email: row.email,
                password: row.password,
                roleId: row.role_id,
            })
        );
    },

    async getTotalUserCount(): Promise<number> {
        const result = await databaseConnection.raw(
            'EXEC admin.sp_user_get_total_count'
        );

        const row = result[0];

        return Number(row.total_rows);
    },
};

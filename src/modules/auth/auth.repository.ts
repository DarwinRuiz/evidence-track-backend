import { Knex } from 'knex';
import { databaseConnection } from '../../database/connection';
import { userEntitySchema, type User } from './auth.model';

export const authRepository = {
    async findUserByEmail(email: string): Promise<User | null> {
        const pool: Knex = databaseConnection;

        const result = await pool.raw(
            'EXEC admin.sp_user_find_by_email @email = ?',
            [email]
        );

        const row = result[0];
        if (!row) return null;

        return userEntitySchema.parse({
            userId: row.user_id,
            fullName: row.full_name,
            email: row.email,
            password: row.password,
            roleName: row.role_name,
        });
    },
};

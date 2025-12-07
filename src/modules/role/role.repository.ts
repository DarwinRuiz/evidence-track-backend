import { databaseConnection } from '../../database/connection';
import { ListRolesQuery, roleEntitySchema, type Role } from './role.model';

export const roleRepository = {
    async createRole(roleName: string): Promise<Role> {
        const result = await databaseConnection.raw(
            'EXEC admin.sp_role_create @role_name = ?',
            [roleName]
        );

        const row = result[0];

        return roleEntitySchema.parse({
            roleId: row.role_id,
            roleName: row.role_name,
        });
    },

    async updateRole(roleId: number, roleName: string): Promise<Role> {
        const result = await databaseConnection.raw(
            'EXEC admin.sp_role_update @role_id = ?, @role_name = ?',
            [roleId, roleName]
        );

        const row = result[0];

        return roleEntitySchema.parse({
            roleId: row.role_id,
            roleName: row.role_name,
        });
    },

    async deleteRole(roleId: number): Promise<void> {
        await databaseConnection.raw('EXEC admin.sp_role_delete @role_id = ?', [
            roleId,
        ]);
    },

    async getRoleById(roleId: number): Promise<Role | null> {
        const result = await databaseConnection.raw(
            'EXEC admin.sp_role_get_by_id @role_id = ?',
            [roleId]
        );

        const row = result[0];

        if (!row) {
            return null;
        }

        return roleEntitySchema.parse({
            roleId: row.role_id,
            roleName: row.role_name,
        });
    },

    async listRoles(query: ListRolesQuery): Promise<Role[]> {
        const offset = query.offset ?? 0;
        const limit = query.limit ?? 10;

        const result = await databaseConnection.raw(
            'EXEC admin.sp_role_list @offset = ?, @limit = ?',
            [offset, limit]
        );

        const rows = result;

        return rows.map((row: any) =>
            roleEntitySchema.parse({
                roleId: row.role_id,
                roleName: row.role_name,
            })
        );
    },

    async getTotalRoleCount(): Promise<number> {
        const result = await databaseConnection.raw(
            'EXEC admin.sp_role_get_total_count'
        );

        const row = result[0];

        return Number(row.total_rows);
    },
};

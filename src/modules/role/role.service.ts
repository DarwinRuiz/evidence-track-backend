import { ApiError } from '../../core/http/ApiError';
import {
    ListRolesQuery,
    UpdateRoleInput,
    type CreateRoleInput,
    type Role,
} from './role.model';
import { roleRepository } from './role.repository';

export const roleService = {
    async createRole(input: CreateRoleInput): Promise<Role> {
        return roleRepository.createRole(input.roleName);
    },

    async updateRole(roleId: number, input: UpdateRoleInput): Promise<Role> {
        const existingRole: {
            roleId: number;
            roleName: string;
        } | null = await roleRepository.getRoleById(roleId);

        if (!existingRole) {
            throw ApiError.notFound('Role not found', 'ROLE_NOT_FOUND');
        }

        for (const key of Object.keys(input) as (keyof UpdateRoleInput)[]) {
            if (input[key] !== undefined) {
                (existingRole as Record<string, unknown>)[key] = input[key]!;
            }
        }

        return roleRepository.updateRole(roleId, existingRole.roleName);
    },

    async deleteRole(roleId: number): Promise<void> {
        const existingRole = await roleRepository.getRoleById(roleId);

        if (!existingRole) {
            throw ApiError.notFound('Role not found', 'ROLE_NOT_FOUND');
        }

        await roleRepository.deleteRole(roleId);
    },

    async getRoleById(roleId: number): Promise<Role> {
        const role = await roleRepository.getRoleById(roleId);
        if (!role) {
            throw ApiError.notFound('Role not found', 'ROLE_NOT_FOUND');
        }

        return role;
    },

    async listRoles(query: ListRolesQuery): Promise<Role[]> {
        return roleRepository.listRoles(query);
    },

    async getTotalRoleCount(): Promise<number> {
        return roleRepository.getTotalRoleCount();
    },
};

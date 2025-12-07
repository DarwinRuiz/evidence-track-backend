import type { Request, Response } from 'express';
import { sendSuccess } from '../../core/http/responseHelpers';
import { roleService } from './role.service';

export const createRole = async (request: Request, response: Response) => {
    const createdRole = await roleService.createRole(request.body);

    return sendSuccess(
        response,
        201,
        {
            role: {
                roleId: createdRole.roleId,
                roleName: createdRole.roleName,
            },
        },
        'Role created successfully'
    );
};

export const updateRole = async (request: Request, response: Response) => {
    const roleId = Number(request.params.roleId);
    const updatedRole = await roleService.updateRole(roleId, request.body);

    return sendSuccess(
        response,
        200,
        {
            role: {
                roleId: updatedRole.roleId,
                roleName: updatedRole.roleName,
            },
        },
        'Role updated successfully'
    );
};

export const deleteRole = async (request: Request, response: Response) => {
    const roleId = Number(request.params.roleId);

    await roleService.deleteRole(roleId);

    return sendSuccess(response, 200, null, 'Role deleted successfully');
};

export const getRoleById = async (request: Request, response: Response) => {
    const roleId = Number(request.params.roleId);
    const role = await roleService.getRoleById(roleId);

    return sendSuccess(response, 200, {
        role: {
            roleId: role.roleId,
            roleName: role.roleName,
        },
    });
};

export const listRoles = async (request: Request, response: Response) => {
    const roles = await roleService.listRoles(request.query as any);

    const roleList = roles.map((role) => ({
        roleId: role.roleId,
        roleName: role.roleName,
    }));

    return sendSuccess(response, 200, { roles: roleList });
};

export const getTotalRoleCount = async (
    request: Request,
    response: Response
) => {
    const totalRoleCount = await roleService.getTotalRoleCount();
    return sendSuccess(response, 200, { totalRows: totalRoleCount });
};

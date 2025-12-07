import type { Request, Response } from 'express';
import { sendSuccess } from '../../core/http/responseHelpers';
import { userService } from './user.service';

export const createUser = async (request: Request, response: Response) => {
    const createdUser = await userService.createUser(request.body);

    return sendSuccess(
        response,
        201,
        {
            user: {
                userId: createdUser.userId,
                fullName: createdUser.fullName,
                email: createdUser.email,
                roleId: createdUser.roleId,
            },
        },
        'User created successfully'
    );
};

export const updateUser = async (request: Request, response: Response) => {
    const userId = Number(request.params.userId);
    const updatedUser = await userService.updateUser(userId, request.body);

    return sendSuccess(
        response,
        200,
        {
            user: {
                userId: updatedUser.userId,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                roleId: updatedUser.roleId,
            },
        },
        'User updated successfully'
    );
};

export const deleteUser = async (request: Request, response: Response) => {
    const userId = Number(request.params.userId);

    await userService.deleteUser(userId);

    return sendSuccess(response, 200, null, 'User deleted successfully');
};

export const getUserById = async (request: Request, response: Response) => {
    const userId = Number(request.params.userId);
    const user = await userService.getUserById(userId);

    return sendSuccess(response, 200, {
        user: {
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            roleId: user.roleId,
        },
    });
};

export const listUsers = async (request: Request, response: Response) => {
    const users = await userService.listUsers(request.query as any);

    const userList = users.map((user) => ({
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        roleId: user.roleId,
    }));

    return sendSuccess(response, 200, { users: userList });
};

export const getTotalUserCount = async (
    request: Request,
    response: Response
) => {
    const totalUserCount = await userService.getTotalUserCount();

    return sendSuccess(response, 200, { totalRows: totalUserCount });
};

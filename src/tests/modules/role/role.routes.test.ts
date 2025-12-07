import request from 'supertest';
import app from '../../../app';
import { jwtSecurity } from '../../../core/security/jwt';
import { roleRepository } from '../../../modules/role/role.repository';

// Mocks
jest.mock('../../../modules/role/role.repository');
jest.mock('../../../core/security/jwt');

const mockedRoleRepository = roleRepository as jest.Mocked<
    typeof roleRepository
>;

const mockedJwtSecurity = jwtSecurity as jest.Mocked<typeof jwtSecurity>;

const coordinatorTokenPayload = {
    userId: 2,
    email: 'admin@mp.com',
    roleName: 'COORDINATOR',
    fullName: 'Administrador',
};

const coordinatorAuthorizationHeader = 'Bearer test-coordinator-token';

describe('Roles routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Por defecto, cualquier token válido representa a un COORDINATOR
        mockedJwtSecurity.verifyAccessToken.mockReturnValue(
            coordinatorTokenPayload
        );
    });

    describe('Authorization and authentication', () => {
        it('should return 401 when Authorization header is missing on protected route', async () => {
            const response = await request(app).get('/roles');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('MISSING_AUTH_HEADER');
        });

        it('should return 403 when user role is not allowed', async () => {
            mockedJwtSecurity.verifyAccessToken.mockReturnValue({
                userId: 3,
                email: 'technician@mp.com',
                roleName: 'TECHNICIAN',
                fullName: 'Technician User',
            });

            const response = await request(app)
                .get('/roles')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
        });
    });

    describe('POST /roles', () => {
        it('should create a roles successfully', async () => {
            mockedRoleRepository.createRole.mockResolvedValue({
                roleId: 10,
                roleName: 'New Role',
            });

            const response = await request(app)
                .post('/roles')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    roleName: 'New Role',
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Role created successfully');
            expect(response.body.data.role).toEqual({
                roleId: 10,
                roleName: 'New Role',
            });

            expect(mockedRoleRepository.createRole).toHaveBeenCalledWith(
                'New Role'
            );
        });

        it('should return 400 when body is invalid', async () => {
            const response = await request(app)
                .post('/roles')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    roleName: '', // Nombre de rol inválido
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('VALIDATION_ERROR');
            expect(Array.isArray(response.body.validationErrors)).toBe(true);
            expect(response.body.validationErrors.length).toBeGreaterThan(0);
        });
    });

    describe('PUT /roles/:roleId', () => {
        it('should update a role successfully including password', async () => {
            const createdAt = new Date('2025-01-01T00:00:00.000Z');

            mockedRoleRepository.getRoleById.mockResolvedValue({
                roleId: 5,
                roleName: 'Existing Role',
            });

            mockedRoleRepository.updateRole.mockResolvedValue({
                roleId: 5,
                roleName: 'Updated Role',
            });

            const response = await request(app)
                .put('/roles/5')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    roleName: 'Updated Role',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Role updated successfully');
            expect(response.body.data.role).toEqual({
                roleId: 5,
                roleName: 'Updated Role',
            });

            expect(mockedRoleRepository.getRoleById).toHaveBeenCalledWith(5);

            expect(mockedRoleRepository.updateRole).toHaveBeenCalledWith(
                5,
                'Updated Role'
            );
        });

        it('should return 404 when role does not exist', async () => {
            mockedRoleRepository.getRoleById.mockResolvedValue(null);

            const response = await request(app)
                .put('/roles/999')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    roleName: 'Updated Role',
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('ROLE_NOT_FOUND');
        });
    });

    describe('DELETE /roles/:roleId', () => {
        it('should delete an existing role', async () => {
            mockedRoleRepository.getRoleById.mockResolvedValue({
                roleId: 7,
                roleName: 'Role To Delete',
            });

            mockedRoleRepository.deleteRole.mockResolvedValue();

            const response = await request(app)
                .delete('/roles/7')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Role deleted successfully');
            expect(mockedRoleRepository.getRoleById).toHaveBeenCalledWith(7);
            expect(mockedRoleRepository.deleteRole).toHaveBeenCalledWith(7);
        });

        it('should return 404 when role to delete does not exist', async () => {
            mockedRoleRepository.getRoleById.mockResolvedValue(null);

            const response = await request(app)
                .delete('/roles/999')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('ROLE_NOT_FOUND');
        });
    });

    describe('GET /roles/:roleId', () => {
        it('should return a role by id', async () => {
            mockedRoleRepository.getRoleById.mockResolvedValue({
                roleId: 3,
                roleName: 'Some Role',
            });

            const response = await request(app)
                .get('/roles/3')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.role).toEqual({
                roleId: 3,
                roleName: 'Some Role',
            });
        });

        it('should return 404 when role is not found', async () => {
            mockedRoleRepository.getRoleById.mockResolvedValue(null);

            const response = await request(app)
                .get('/roles/999')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('ROLE_NOT_FOUND');
        });
    });

    describe('GET /roles', () => {
        it('should list roles without explicit pagination', async () => {
            mockedRoleRepository.listRoles.mockResolvedValue([
                {
                    roleId: 1,
                    roleName: 'Role One',
                },
                {
                    roleId: 2,
                    roleName: 'Role Two',
                },
            ]);

            const response = await request(app)
                .get('/roles')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.roles).toEqual([
                {
                    roleId: 1,
                    roleName: 'Role One',
                },
                {
                    roleId: 2,
                    roleName: 'Role Two',
                },
            ]);

            expect(mockedRoleRepository.listRoles).toHaveBeenCalledWith({});
        });
    });

    describe('GET /roles/count/total', () => {
        it('should return total role count', async () => {
            mockedRoleRepository.getTotalRoleCount.mockResolvedValue(42);

            const response = await request(app)
                .get('/roles/count/total')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.totalRows).toBe(42);
            expect(mockedRoleRepository.getTotalRoleCount).toHaveBeenCalled();
        });
    });
});

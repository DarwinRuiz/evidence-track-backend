import request from 'supertest';
import app from '../../../app';
import { jwtSecurity } from '../../../core/security/jwt';
import { passwordSecurity } from '../../../core/security/password';
import { userRepository } from '../../../modules/user/user.repository';

// Mocks
jest.mock('../../../modules/user/user.repository');
jest.mock('../../../core/security/password');
jest.mock('../../../core/security/jwt');

const mockedUserRepository = userRepository as jest.Mocked<
    typeof userRepository
>;
const mockedPasswordSecurity = passwordSecurity as jest.Mocked<
    typeof passwordSecurity
>;
const mockedJwtSecurity = jwtSecurity as jest.Mocked<typeof jwtSecurity>;

const coordinatorTokenPayload = {
    userId: 2,
    email: 'admin@mp.com',
    roleName: 'COORDINATOR',
    fullName: 'Administrador',
};

const coordinatorAuthorizationHeader = 'Bearer test-coordinator-token';

describe('User routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Por defecto, cualquier token válido representa a un COORDINATOR
        mockedJwtSecurity.verifyAccessToken.mockReturnValue(
            coordinatorTokenPayload
        );
    });

    describe('Authorization and authentication', () => {
        it('should return 401 when Authorization header is missing on protected route', async () => {
            const response = await request(app).get('/users');

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
                .get('/users')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
        });
    });

    describe('POST /users', () => {
        it('should create a user successfully', async () => {
            mockedPasswordSecurity.hashPassword.mockResolvedValue(
                'hashed-password'
            );

            mockedUserRepository.createUser.mockResolvedValue({
                userId: 10,
                fullName: 'New User',
                email: 'new.user@mp.com',
                roleId: 2,
            });

            const response = await request(app)
                .post('/users')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    fullName: 'New User',
                    email: 'new.user@mp.com',
                    password: 'MyStrongPassword',
                    roleId: 2,
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User created successfully');
            expect(response.body.data.user).toEqual({
                userId: 10,
                fullName: 'New User',
                email: 'new.user@mp.com',
                roleId: 2,
            });

            expect(mockedPasswordSecurity.hashPassword).toHaveBeenCalledWith(
                'MyStrongPassword'
            );
            expect(mockedUserRepository.createUser).toHaveBeenCalledWith(
                'New User',
                'new.user@mp.com',
                'hashed-password',
                2
            );
        });

        it('should return 400 when body is invalid', async () => {
            const response = await request(app)
                .post('/users')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    fullName: 'N', // demasiado corto
                    email: 'not-an-email',
                    password: '123',
                    roleId: 0,
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('VALIDATION_ERROR');
            expect(Array.isArray(response.body.validationErrors)).toBe(true);
            expect(response.body.validationErrors.length).toBeGreaterThan(0);
        });
    });

    describe('PUT /users/:userId', () => {
        it('should update a user successfully including password', async () => {
            mockedUserRepository.getUserById.mockResolvedValue({
                userId: 5,
                fullName: 'Existing User',
                email: 'existing.user@mp.com',
                roleId: 2,
            });

            mockedPasswordSecurity.hashPassword.mockResolvedValue('new-hash');

            mockedUserRepository.updateUser.mockResolvedValue({
                userId: 5,
                fullName: 'Updated User',
                email: 'updated.user@mp.com',
                roleId: 3,
            });

            const response = await request(app)
                .put('/users/5')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    fullName: 'Updated User',
                    email: 'updated.user@mp.com',
                    password: 'NewStrongPassword',
                    roleId: 3,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User updated successfully');
            expect(response.body.data.user).toEqual({
                userId: 5,
                fullName: 'Updated User',
                email: 'updated.user@mp.com',
                roleId: 3,
            });

            expect(mockedUserRepository.getUserById).toHaveBeenCalledWith(5);
            expect(mockedPasswordSecurity.hashPassword).toHaveBeenCalledWith(
                'NewStrongPassword'
            );
            expect(mockedUserRepository.updateUser).toHaveBeenCalledWith(
                5,
                'Updated User',
                'updated.user@mp.com',
                3,
                'new-hash'
            );
        });

        it('should return 404 when user does not exist', async () => {
            mockedUserRepository.getUserById.mockResolvedValue(null);

            const response = await request(app)
                .put('/users/999')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    fullName: 'Updated User',
                    email: 'updated.user@mp.com',
                    roleId: 3,
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('USER_NOT_FOUND');
        });
    });

    describe('DELETE /users/:userId', () => {
        it('should delete an existing user', async () => {
            mockedUserRepository.getUserById.mockResolvedValue({
                userId: 7,
                fullName: 'User To Delete',
                email: 'delete.me@mp.com',
                roleId: 2,
            });

            mockedUserRepository.deleteUser.mockResolvedValue();

            const response = await request(app)
                .delete('/users/7')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User deleted successfully');
            expect(mockedUserRepository.getUserById).toHaveBeenCalledWith(7);
            expect(mockedUserRepository.deleteUser).toHaveBeenCalledWith(7);
        });

        it('should return 404 when user to delete does not exist', async () => {
            mockedUserRepository.getUserById.mockResolvedValue(null);

            const response = await request(app)
                .delete('/users/999')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('USER_NOT_FOUND');
        });
    });

    describe('GET /users/:userId', () => {
        it('should return a user by id', async () => {
            mockedUserRepository.getUserById.mockResolvedValue({
                userId: 3,
                fullName: 'Some User',
                email: 'some.user@mp.com',
                roleId: 2,
            });

            const response = await request(app)
                .get('/users/3')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toEqual({
                userId: 3,
                fullName: 'Some User',
                email: 'some.user@mp.com',
                roleId: 2,
            });
        });

        it('should return 404 when user is not found', async () => {
            mockedUserRepository.getUserById.mockResolvedValue(null);

            const response = await request(app)
                .get('/users/999')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('USER_NOT_FOUND');
        });
    });

    describe('GET /users', () => {
        it('should list users without explicit pagination', async () => {
            mockedUserRepository.listUsers.mockResolvedValue([
                {
                    userId: 1,
                    fullName: 'User One',
                    email: 'user.one@mp.com',
                    roleId: 2,
                },
                {
                    userId: 2,
                    fullName: 'User Two',
                    email: 'user.two@mp.com',
                    roleId: 3,
                },
            ]);

            const response = await request(app)
                .get('/users')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.users).toEqual([
                {
                    userId: 1,
                    fullName: 'User One',
                    email: 'user.one@mp.com',
                    roleId: 2,
                },
                {
                    userId: 2,
                    fullName: 'User Two',
                    email: 'user.two@mp.com',
                    roleId: 3,
                },
            ]);

            expect(mockedUserRepository.listUsers).toHaveBeenCalledWith({});
        });
    });

    describe('GET /users/count/total', () => {
        it('should return total user count', async () => {
            mockedUserRepository.getTotalUserCount.mockResolvedValue(42);

            const response = await request(app)
                .get('/users/count/total')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.totalRows).toBe(42);
            expect(mockedUserRepository.getTotalUserCount).toHaveBeenCalled();
        });
    });
});

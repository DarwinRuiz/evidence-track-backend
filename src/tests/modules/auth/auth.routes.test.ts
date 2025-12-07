import request from 'supertest';
import app from '../../../app';
import { jwtSecurity } from '../../../core/security/jwt';
import { passwordSecurity } from '../../../core/security/password';
import { authRepository } from '../../../modules/auth/auth.repository';

// Mock de las dependencias internas del módulo auth
jest.mock('../../../modules/auth/auth.repository');
jest.mock('../../../core/security/password');
jest.mock('../../../core/security/jwt');

const mockedAuthRepository = authRepository as jest.Mocked<
    typeof authRepository
>;
const mockedPasswordSecurity = passwordSecurity as jest.Mocked<
    typeof passwordSecurity
>;
const mockedJwtSecurity = jwtSecurity as jest.Mocked<typeof jwtSecurity>;

describe('Authentication routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/login', () => {
        it('should authenticate successfully with valid credentials', async () => {
            mockedAuthRepository.findUserByEmail.mockResolvedValue({
                userId: 2,
                fullName: 'Administrador',
                email: 'admin@mp.com',
                password: 'fake-hashed-password',
                roleName: 'COORDINATOR',
            });

            mockedPasswordSecurity.comparePassword.mockResolvedValue(true);

            mockedJwtSecurity.signAccessToken.mockReturnValue(
                'test-access-token'
            );

            const response = await request(app).post('/auth/login').send({
                email: 'admin@mp.com',
                password: 'Admin#2025',
            });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Authenticated successfully');

            expect(response.body.data).toBeDefined();
            expect(response.body.data.token).toBe('test-access-token');
            expect(response.body.data.user).toEqual({
                userId: 2,
                fullName: 'Administrador',
                email: 'admin@mp.com',
                roleName: 'COORDINATOR',
            });

            expect(mockedAuthRepository.findUserByEmail).toHaveBeenCalledWith(
                'admin@mp.com'
            );
            expect(mockedPasswordSecurity.comparePassword).toHaveBeenCalledWith(
                'Admin#2025',
                'fake-hashed-password'
            );
            expect(mockedJwtSecurity.signAccessToken).toHaveBeenCalledWith({
                userId: 2,
                email: 'admin@mp.com',
                roleName: 'COORDINATOR',
                fullName: 'Administrador',
            });
        });

        it('should return 401 when user is not found', async () => {
            mockedAuthRepository.findUserByEmail.mockResolvedValue(null);

            const response = await request(app).post('/auth/login').send({
                email: 'unknown.user@mp.com',
                password: 'SomePassword123',
            });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('INVALID_CREDENTIALS');
        });

        it('should return 401 when password is incorrect', async () => {
            mockedAuthRepository.findUserByEmail.mockResolvedValue({
                userId: 2,
                fullName: 'Administrador',
                email: 'admin@mp.com',
                password: 'fake-hashed-password',
                roleName: 'COORDINATOR',
            });

            mockedPasswordSecurity.comparePassword.mockResolvedValue(false);

            const response = await request(app).post('/auth/login').send({
                email: 'admin@mp.com',
                password: 'WrongPassword',
            });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('INVALID_CREDENTIALS');
        });

        it('should return 400 when body is invalid (validation error)', async () => {
            const response = await request(app).post('/auth/login').send({
                email: 'not-an-email',
                password: '123',
            });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('VALIDATION_ERROR');
            expect(Array.isArray(response.body.validationErrors)).toBe(true);
            expect(response.body.validationErrors.length).toBeGreaterThan(0);
        });
    });

    describe('GET /auth/profile', () => {
        it('should return 401 when Authorization header is missing', async () => {
            const response = await request(app).get('/auth/profile');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('MISSING_AUTH_HEADER');
        });

        it('should return authenticated user profile when token is valid', async () => {
            mockedJwtSecurity.verifyAccessToken.mockReturnValue({
                userId: 2,
                email: 'admin@mp.com',
                roleName: 'COORDINATOR',
                fullName: 'Administrador',
            });

            const response = await request(app)
                .get('/auth/profile')
                .set('Authorization', 'Bearer test-access-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toEqual({
                userId: 2,
                email: 'admin@mp.com',
                roleName: 'COORDINATOR',
                fullName: 'Administrador',
            });
        });
    });
});

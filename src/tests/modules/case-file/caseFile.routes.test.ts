import request from 'supertest';
import app from '../../../app';
import { jwtSecurity } from '../../../core/security/jwt';
import { caseFileRepository } from '../../../modules/case-file/caseFile.repository';

// Mocks
jest.mock('../../../modules/case-file/caseFile.repository');
jest.mock('../../../core/security/jwt');

const mockedCaseFileRepository = caseFileRepository as jest.Mocked<
    typeof caseFileRepository
>;

const mockedJwtSecurity = jwtSecurity as jest.Mocked<typeof jwtSecurity>;

const coordinatorTokenPayload = {
    userId: 2,
    email: 'admin@mp.com',
    roleName: 'COORDINATOR',
    fullName: 'Administrador',
};

const coordinatorAuthorizationHeader = 'Bearer test-coordinator-token';

describe('Case file routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Por defecto, cualquier token válido representa a un COORDINATOR
        mockedJwtSecurity.verifyAccessToken.mockReturnValue(
            coordinatorTokenPayload
        );
    });

    describe('Authorization and authentication', () => {
        it('should return 401 when Authorization header is missing on protected route', async () => {
            const response = await request(app).get('/case-files');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('MISSING_AUTH_HEADER');
        });

        it('should return 403 when user role is not allowed', async () => {
            mockedJwtSecurity.verifyAccessToken.mockReturnValue({
                userId: 3,
                email: 'reviewer@mp.com',
                roleName: 'REVIEWER',
                fullName: 'Reviewer User',
            });

            const response = await request(app)
                .get('/case-files')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
        });
    });

    describe('POST /case-files', () => {
        it('should create a case file successfully', async () => {
            const createdAt = new Date('2025-01-01T00:00:00.000Z');

            mockedCaseFileRepository.createCaseFile.mockResolvedValue({
                caseFileId: 10,
                caseCode: 'CF-2025-0000',
                description: 'Description of the new case file',
                status: 'REGISTERED',
                technicianId: 1,
                rejectionReason: null,
                registeredAt: createdAt,
            });

            const response = await request(app)
                .post('/case-files')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    caseCode: 'CF-2025-0000',
                    description: 'Description of the new case file',
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(
                'Case file created successfully'
            );
            expect(response.body.data.caseFile).toEqual({
                caseFileId: 10,
                caseCode: 'CF-2025-0000',
                description: 'Description of the new case file',
                status: 'REGISTERED',
                technicianId: 1,
                rejectionReason: null,
                registeredAt: '2025-01-01T00:00:00.000Z',
            });

            expect(
                mockedCaseFileRepository.createCaseFile
            ).toHaveBeenCalledWith(
                'CF-2025-0000',
                2,
                'Description of the new case file'
            );
        });

        it('should return 400 when body is invalid', async () => {
            const response = await request(app)
                .post('/case-files')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    caseCode: '', // Código de caso inválido
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('VALIDATION_ERROR');
            expect(Array.isArray(response.body.validationErrors)).toBe(true);
            expect(response.body.validationErrors.length).toBeGreaterThan(0);
        });
    });

    describe('PUT /case-files/:caseFileId', () => {
        it('should update a case file successfully', async () => {
            const createdAt = new Date('2025-01-01T00:00:00.000Z');

            mockedCaseFileRepository.getCaseFileById.mockResolvedValue({
                caseFileId: 5,
                caseCode: 'CF-2025-0005',
                description: 'Original Description',
                status: 'REGISTERED',
                technicianId: 2,
                rejectionReason: null,
                registeredAt: createdAt,
            });

            mockedCaseFileRepository.updateCaseFile.mockResolvedValue({
                caseFileId: 5,
                caseCode: 'CF-2025-0005',
                description: 'Updated Description',
                status: 'UNDER_REVIEW',
                technicianId: 2,
                rejectionReason: null,
                registeredAt: createdAt,
            });

            const response = await request(app)
                .put('/case-files/5')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    description: 'Updated Description',
                    status: 'UNDER_REVIEW',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(
                'Case file updated successfully'
            );
            expect(response.body.data.caseFile).toEqual({
                caseFileId: 5,
                caseCode: 'CF-2025-0005',
                description: 'Updated Description',
                status: 'UNDER_REVIEW',
                technicianId: 2,
                rejectionReason: null,
                registeredAt: '2025-01-01T00:00:00.000Z',
            });
            expect(
                mockedCaseFileRepository.getCaseFileById
            ).toHaveBeenCalledWith(5);

            expect(
                mockedCaseFileRepository.updateCaseFile
            ).toHaveBeenCalledWith(
                5,
                'Updated Description',
                'UNDER_REVIEW',
                null
            );
        });

        it('should return 404 when case file does not exist', async () => {
            mockedCaseFileRepository.getCaseFileById.mockResolvedValue(null);

            const response = await request(app)
                .put('/case-files/999')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    description: 'Updated Description',
                    status: 'UNDER_REVIEW',
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('CASE_FILE_NOT_FOUND');
        });
    });

    describe('DELETE /case-files/:caseFileId', () => {
        it('should delete an existing case file', async () => {
            mockedCaseFileRepository.getCaseFileById.mockResolvedValue({
                caseFileId: 7,
                caseCode: 'CF-2025-0007',
                description: 'Case File To Delete',
                status: 'REGISTERED',
                technicianId: 2,
                rejectionReason: null,
                registeredAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            mockedCaseFileRepository.deleteCaseFile.mockResolvedValue();

            const response = await request(app)
                .delete('/case-files/7')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(
                'Case file deleted successfully'
            );
            expect(
                mockedCaseFileRepository.getCaseFileById
            ).toHaveBeenCalledWith(7);
            expect(
                mockedCaseFileRepository.deleteCaseFile
            ).toHaveBeenCalledWith(7);
        });

        it('should return 404 when case file to delete does not exist', async () => {
            mockedCaseFileRepository.getCaseFileById.mockResolvedValue(null);
            const response = await request(app)
                .delete('/case-files/999')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('CASE_FILE_NOT_FOUND');
        });
    });

    describe('GET /case-files/:caseFileId', () => {
        it('should return a case file by id', async () => {
            mockedCaseFileRepository.getCaseFileById.mockResolvedValue({
                caseFileId: 3,
                caseCode: 'CF-2025-0003',
                description: 'Some Case File',
                status: 'UNDER_REVIEW',
                technicianId: 1,
                rejectionReason: null,
                registeredAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const response = await request(app)
                .get('/case-files/3')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.caseFile).toEqual({
                caseFileId: 3,
                caseCode: 'CF-2025-0003',
                description: 'Some Case File',
                status: 'UNDER_REVIEW',
                technicianId: 1,
                rejectionReason: null,
                registeredAt: '2025-01-01T00:00:00.000Z',
            });
        });

        it('should return 404 when case file is not found', async () => {
            mockedCaseFileRepository.getCaseFileById.mockResolvedValue(null);

            const response = await request(app)
                .get('/case-files/999')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('CASE_FILE_NOT_FOUND');
        });
    });

    describe('GET /case-files', () => {
        it('should list case files without explicit pagination', async () => {
            mockedCaseFileRepository.listCaseFiles.mockResolvedValue([
                {
                    caseFileId: 1,
                    caseCode: 'CF-2025-0001',
                    description: 'First Case File',
                    status: 'REGISTERED',
                    technicianId: 1,
                    rejectionReason: null,
                    registeredAt: new Date('2025-01-01T00:00:00.000Z'),
                },
                {
                    caseFileId: 2,
                    caseCode: 'CF-2025-0002',
                    description: 'Second Case File',
                    status: 'UNDER_REVIEW',
                    technicianId: 2,
                    rejectionReason: null,
                    registeredAt: new Date('2025-01-02T00:00:00.000Z'),
                },
            ]);

            const response = await request(app)
                .get('/case-files')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.caseFiles).toEqual([
                {
                    caseFileId: 1,
                    caseCode: 'CF-2025-0001',
                    description: 'First Case File',
                    status: 'REGISTERED',
                    technicianId: 1,
                    rejectionReason: null,
                    registeredAt: '2025-01-01T00:00:00.000Z',
                },
                {
                    caseFileId: 2,
                    caseCode: 'CF-2025-0002',
                    description: 'Second Case File',
                    status: 'UNDER_REVIEW',
                    technicianId: 2,
                    rejectionReason: null,
                    registeredAt: '2025-01-02T00:00:00.000Z',
                },
            ]);

            expect(mockedCaseFileRepository.listCaseFiles).toHaveBeenCalledWith(
                {}
            );
        });
    });

    describe('GET /case-files/count/total', () => {
        it('should return total case file count', async () => {
            mockedCaseFileRepository.getTotalCaseFileCount.mockResolvedValue(
                42
            );

            const response = await request(app)
                .get('/case-files/count/total')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.totalRows).toBe(42);
            expect(
                mockedCaseFileRepository.getTotalCaseFileCount
            ).toHaveBeenCalled();
        });
    });
});

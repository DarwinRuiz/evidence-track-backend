import request from 'supertest';
import app from '../../../app';
import { jwtSecurity } from '../../../core/security/jwt';
import { evidenceItemRepository } from '../../../modules/evidence-item/evidenceItem.repository';

// Mocks
jest.mock('../../../modules/evidence-item/evidenceItem.repository');
jest.mock('../../../core/security/jwt');

const mockedEvidenceItemRepository = evidenceItemRepository as jest.Mocked<
    typeof evidenceItemRepository
>;
const mockedJwtSecurity = jwtSecurity as jest.Mocked<typeof jwtSecurity>;

const coordinatorTokenPayload = {
    userId: 2,
    email: 'admin@mp.com',
    roleName: 'COORDINATOR',
    fullName: 'Administrador',
};

const technicianTokenPayload = {
    userId: 3,
    email: 'technician@mp.com',
    roleName: 'TECHNICIAN',
    fullName: 'Technician User',
};

const coordinatorAuthorizationHeader = 'Bearer test-coordinator-token';
const technicianAuthorizationHeader = 'Bearer test-technician-token';

describe('Evidence item routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Por defecto, cualquier token válido representa a un COORDINATOR
        mockedJwtSecurity.verifyAccessToken.mockReturnValue(
            coordinatorTokenPayload
        );
    });

    describe('Authorization and authentication', () => {
        it('should return 401 when Authorization header is missing on protected route', async () => {
            const response = await request(app).get('/evidence-items');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('MISSING_AUTH_HEADER');
        });

        it('should return 403 when user role is not allowed to access evidence items list', async () => {
            mockedJwtSecurity.verifyAccessToken.mockReturnValue({
                userId: 4,
                email: 'reviewer@mp.com',
                roleName: 'REVIEWER',
                fullName: 'Reviewer User',
            });

            const response = await request(app)
                .get('/evidence-items?caseFileId=1')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
        });
    });

    describe('POST /evidence-items', () => {
        it('should create an evidence item successfully', async () => {
            const createdAt = new Date('2025-01-01T00:00:00.000Z');

            mockedJwtSecurity.verifyAccessToken.mockReturnValue(
                technicianTokenPayload
            );

            mockedEvidenceItemRepository.createEvidenceItem.mockResolvedValue({
                evidenceItemId: 10,
                caseFileId: 5,
                description:
                    'Black backpack found near the crime scene containing personal belongings.',
                color: 'Black',
                size: 'Medium',
                weight: '1.2 kg',
                locationFound: 'Near the main entrance of the warehouse',
                technicianId: 3,
                createdAt,
            });

            const response = await request(app)
                .post('/evidence-items')
                .set('Authorization', technicianAuthorizationHeader)
                .send({
                    caseFileId: 5,
                    description:
                        'Black backpack found near the crime scene containing personal belongings.',
                    color: 'Black',
                    size: 'Medium',
                    weight: '1.2 kg',
                    locationFound: 'Near the main entrance of the warehouse',
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(
                'Evidence item created successfully'
            );
            expect(response.body.data.evidenceItem).toEqual({
                evidenceItemId: 10,
                caseFileId: 5,
                description:
                    'Black backpack found near the crime scene containing personal belongings.',
                color: 'Black',
                size: 'Medium',
                weight: '1.2 kg',
                locationFound: 'Near the main entrance of the warehouse',
                technicianId: 3,
                createdAt: createdAt.toISOString(),
            });

            expect(
                mockedEvidenceItemRepository.createEvidenceItem
            ).toHaveBeenCalledWith(
                5,
                'Black backpack found near the crime scene containing personal belongings.',
                'Black',
                'Medium',
                '1.2 kg',
                'Near the main entrance of the warehouse',
                3
            );
        });

        it('should return 400 when body is invalid', async () => {
            mockedJwtSecurity.verifyAccessToken.mockReturnValue(
                technicianTokenPayload
            );

            const response = await request(app)
                .post('/evidence-items')
                .set('Authorization', technicianAuthorizationHeader)
                .send({
                    caseFileId: -1,
                    description: '', // descripción inválida
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('VALIDATION_ERROR');
            expect(Array.isArray(response.body.validationErrors)).toBe(true);
            expect(response.body.validationErrors.length).toBeGreaterThan(0);
        });
    });

    describe('PUT /evidence-items/:evidenceItemId', () => {
        it('should update an evidence item successfully', async () => {
            const createdAt = new Date('2025-01-01T00:00:00.000Z');

            mockedEvidenceItemRepository.getEvidenceItemById.mockResolvedValue({
                evidenceItemId: 5,
                caseFileId: 3,
                description: 'Original description',
                color: 'Red',
                size: 'Small',
                weight: '0.5 kg',
                locationFound: 'Living room',
                technicianId: 3,
                createdAt,
            });

            mockedEvidenceItemRepository.updateEvidenceItem.mockResolvedValue({
                evidenceItemId: 5,
                caseFileId: 3,
                description: 'Updated description',
                color: 'Blue',
                size: 'Medium',
                weight: '0.7 kg',
                locationFound: 'Bedroom',
                technicianId: 3,
                createdAt,
            });

            const response = await request(app)
                .put('/evidence-items/5')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    description: 'Updated description',
                    color: 'Blue',
                    size: 'Medium',
                    weight: '0.7 kg',
                    locationFound: 'Bedroom',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(
                'Evidence item updated successfully'
            );
            expect(response.body.data.evidenceItem).toEqual({
                evidenceItemId: 5,
                caseFileId: 3,
                description: 'Updated description',
                color: 'Blue',
                size: 'Medium',
                weight: '0.7 kg',
                locationFound: 'Bedroom',
                technicianId: 3,
                createdAt: createdAt.toISOString(),
            });

            expect(
                mockedEvidenceItemRepository.getEvidenceItemById
            ).toHaveBeenCalledWith(5);
            expect(
                mockedEvidenceItemRepository.updateEvidenceItem
            ).toHaveBeenCalledWith(
                5,
                'Updated description',
                'Blue',
                'Medium',
                '0.7 kg',
                'Bedroom'
            );
        });

        it('should return 404 when evidence item does not exist', async () => {
            mockedEvidenceItemRepository.getEvidenceItemById.mockResolvedValue(
                null
            );

            const response = await request(app)
                .put('/evidence-items/999')
                .set('Authorization', coordinatorAuthorizationHeader)
                .send({
                    description: 'Updated description',
                    color: 'Blue',
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('EVIDENCE_ITEM_NOT_FOUND');
        });
    });

    describe('DELETE /evidence-items/:evidenceItemId', () => {
        it('should delete an existing evidence item', async () => {
            const createdAt = new Date('2025-01-01T00:00:00.000Z');

            mockedEvidenceItemRepository.getEvidenceItemById.mockResolvedValue({
                evidenceItemId: 7,
                caseFileId: 3,
                description: 'Evidence item to delete',
                color: 'Green',
                size: 'Large',
                weight: '2 kg',
                locationFound: 'Garage',
                technicianId: 3,
                createdAt,
            });

            mockedEvidenceItemRepository.deleteEvidenceItem.mockResolvedValue();

            const response = await request(app)
                .delete('/evidence-items/7')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(
                'Evidence item deleted successfully'
            );
            expect(
                mockedEvidenceItemRepository.getEvidenceItemById
            ).toHaveBeenCalledWith(7);
            expect(
                mockedEvidenceItemRepository.deleteEvidenceItem
            ).toHaveBeenCalledWith(7);
        });

        it('should return 404 when evidence item to delete does not exist', async () => {
            mockedEvidenceItemRepository.getEvidenceItemById.mockResolvedValue(
                null
            );

            const response = await request(app)
                .delete('/evidence-items/999')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('EVIDENCE_ITEM_NOT_FOUND');
        });
    });

    describe('GET /evidence-items/:evidenceItemId', () => {
        it('should return an evidence item by id', async () => {
            const createdAt = new Date('2025-01-01T00:00:00.000Z');

            mockedEvidenceItemRepository.getEvidenceItemById.mockResolvedValue({
                evidenceItemId: 3,
                caseFileId: 2,
                description: 'Some evidence',
                color: 'Gray',
                size: 'Small',
                weight: '0.3 kg',
                locationFound: 'Kitchen',
                technicianId: 3,
                createdAt,
            });

            const response = await request(app)
                .get('/evidence-items/3')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.evidenceItem).toEqual({
                evidenceItemId: 3,
                caseFileId: 2,
                description: 'Some evidence',
                color: 'Gray',
                size: 'Small',
                weight: '0.3 kg',
                locationFound: 'Kitchen',
                technicianId: 3,
                createdAt: createdAt.toISOString(),
            });
        });

        it('should return 404 when evidence item is not found', async () => {
            mockedEvidenceItemRepository.getEvidenceItemById.mockResolvedValue(
                null
            );

            const response = await request(app)
                .get('/evidence-items/999')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('EVIDENCE_ITEM_NOT_FOUND');
        });
    });

    describe('GET /evidence-items', () => {
        it('should list evidence items for a case file with pagination', async () => {
            const createdAtOne = new Date('2025-01-01T00:00:00.000Z');
            const createdAtTwo = new Date('2025-01-02T00:00:00.000Z');

            mockedEvidenceItemRepository.listEvidenceItems.mockResolvedValue([
                {
                    evidenceItemId: 1,
                    caseFileId: 5,
                    description: 'First evidence item',
                    color: 'Black',
                    size: 'Small',
                    weight: '0.5 kg',
                    locationFound: 'Hallway',
                    technicianId: 3,
                    createdAt: createdAtOne,
                },
                {
                    evidenceItemId: 2,
                    caseFileId: 5,
                    description: 'Second evidence item',
                    color: 'White',
                    size: 'Medium',
                    weight: '0.8 kg',
                    locationFound: 'Office',
                    technicianId: 3,
                    createdAt: createdAtTwo,
                },
            ]);

            const response = await request(app)
                .get('/evidence-items?caseFileId=5&offset=0&limit=2')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.evidenceItems).toEqual([
                {
                    evidenceItemId: 1,
                    caseFileId: 5,
                    description: 'First evidence item',
                    color: 'Black',
                    size: 'Small',
                    weight: '0.5 kg',
                    locationFound: 'Hallway',
                    technicianId: 3,
                    createdAt: createdAtOne.toISOString(),
                },
                {
                    evidenceItemId: 2,
                    caseFileId: 5,
                    description: 'Second evidence item',
                    color: 'White',
                    size: 'Medium',
                    weight: '0.8 kg',
                    locationFound: 'Office',
                    technicianId: 3,
                    createdAt: createdAtTwo.toISOString(),
                },
            ]);

            expect(
                mockedEvidenceItemRepository.listEvidenceItems
            ).toHaveBeenCalledWith({
                caseFileId: '5',
                offset: '0',
                limit: '2',
            });
        });

        it('should return 400 when required query parameter caseFileId is missing', async () => {
            const response = await request(app)
                .get('/evidence-items')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errorCode).toBe('VALIDATION_ERROR');
            expect(Array.isArray(response.body.validationErrors)).toBe(true);
            expect(response.body.validationErrors.length).toBeGreaterThan(0);
        });
    });

    describe('GET /evidence-items/count/total', () => {
        it('should return total evidence item count for case file', async () => {
            mockedEvidenceItemRepository.getTotalEvidenceItemCountByCaseFile.mockResolvedValue(
                7
            );

            const response = await request(app)
                .get('/evidence-items/count/total?caseFileId=5')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.totalRows).toBe(7);
            expect(
                mockedEvidenceItemRepository.getTotalEvidenceItemCountByCaseFile
            ).toHaveBeenCalledWith(5);
        });
    });
});

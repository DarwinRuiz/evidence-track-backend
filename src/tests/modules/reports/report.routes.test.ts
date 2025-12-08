import request from 'supertest';
import app from '../../../app';
import { jwtSecurity } from '../../../core/security/jwt';
import { reportRepository } from '../../../modules/reports/report.repository';

jest.mock('../../../modules/reports/report.repository');
jest.mock('../../../core/security/jwt');

const mockedReportRepository = reportRepository as jest.Mocked<
    typeof reportRepository
>;
const mockedJwtSecurity = jwtSecurity as jest.Mocked<typeof jwtSecurity>;

const coordinatorTokenPayload = {
    userId: 2,
    email: 'admin@mp.com',
    roleName: 'COORDINATOR',
    fullName: 'Administrador',
};

const adminTokenPayload = {
    userId: 1,
    email: 'root@mp.com',
    roleName: 'ADMIN',
    fullName: 'Root User',
};

const coordinatorAuthorizationHeader = 'Bearer test-coordinator-token';
const adminAuthorizationHeader = 'Bearer test-admin-token';

describe('Report routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedJwtSecurity.verifyAccessToken.mockImplementation(
            (token: string) => {
                if (token === 'test-admin-token') {
                    return adminTokenPayload;
                }
                return coordinatorTokenPayload;
            }
        );
    });

    describe('Authorization and authentication', () => {
        it('should return 401 when Authorization header is missing', async () => {
            const response = await request(app).get('/reports/overview');

            expect(response.status).toBe(401);
            expect(response.body.errorCode).toBe('MISSING_AUTH_HEADER');
        });

        it('should return 403 when user role is not allowed', async () => {
            mockedJwtSecurity.verifyAccessToken.mockReturnValue({
                userId: 3,
                email: 'tech@mp.com',
                roleName: 'TECHNICIAN',
                fullName: 'Technician User',
            });

            const response = await request(app)
                .get('/reports/overview')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(403);
            expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
        });
    });

    describe('GET /reports/overview', () => {
        it('should return dashboard overview successfully', async () => {
            mockedReportRepository.getDashboardOverview.mockResolvedValue({
                totalCaseFiles: 10,
                totalRegistered: 4,
                totalUnderReview: 3,
                totalApproved: 2,
                totalRejected: 1,
                totalLast7Days: 5,
                totalLast30Days: 10,
            });

            const response = await request(app)
                .get('/reports/overview')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.data.overview).toEqual({
                totalCaseFiles: 10,
                totalRegistered: 4,
                totalUnderReview: 3,
                totalApproved: 2,
                totalRejected: 1,
                totalLast7Days: 5,
                totalLast30Days: 10,
            });

            const firstCall =
                mockedReportRepository.getDashboardOverview.mock.calls[0]!;
            const filtersArg = firstCall[0] as any;

            expect(filtersArg).toMatchObject({});
        });

        it('should return null overview when repo returns null', async () => {
            mockedReportRepository.getDashboardOverview.mockResolvedValue(null);

            const response = await request(app)
                .get('/reports/overview')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.data.overview).toBeNull();
        });

        it('should return 400 when invalid filters are provided', async () => {
            const response = await request(app)
                .get('/reports/overview?initialRegisteredDate=INVALID')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(400);
            expect(response.body.errorCode).toBe('VALIDATION_ERROR');
        });
    });

    describe('GET /reports/case-files/status-by-day', () => {
        it('should return rows successfully', async () => {
            mockedReportRepository.getCaseFilesStatusByDay.mockResolvedValue([
                {
                    registeredDate: '2025-01-01',
                    status: 'REGISTERED',
                    totalCaseFiles: 3,
                },
                {
                    registeredDate: '2025-01-02',
                    status: 'APPROVED',
                    totalCaseFiles: 2,
                },
            ]);

            const response = await request(app)
                .get('/reports/case-files/status-by-day?daysBack=7')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.data.rows.length).toBe(2);

            const firstCall =
                mockedReportRepository.getCaseFilesStatusByDay.mock.calls[0]!;
            const filtersArg = firstCall[0] as any;

            expect(filtersArg).toMatchObject({ daysBack: '7' });
        });
    });

    describe('GET /reports/technicians/activity', () => {
        it('should return technician activity successfully', async () => {
            mockedReportRepository.getTechnicianActivity.mockResolvedValue([
                {
                    technicianId: 2,
                    technicianName: 'Tech One',
                    totalCaseFiles: 5,
                    totalEvidenceItems: 12,
                },
            ]);

            const response = await request(app)
                .get('/reports/technicians/activity?daysBack=30')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.data.rows.length).toBe(1);

            const firstCall =
                mockedReportRepository.getTechnicianActivity.mock.calls[0]!;
            const filtersArg = firstCall[0] as any;

            expect(filtersArg).toMatchObject({ daysBack: '30' });
        });
    });

    describe('GET /reports/evidence/density', () => {
        it('should return evidence density successfully', async () => {
            mockedReportRepository.getEvidenceDensity.mockResolvedValue({
                summary: {
                    averageEvidencePerCase: 2,
                    totalCasesWithEvidence: 3,
                },
                topCases: [
                    {
                        caseFileId: 10,
                        caseCode: 'CF-2025-0010',
                        status: 'APPROVED',
                        technicianId: 2,
                        evidenceCount: 4,
                    },
                ],
            });

            const response = await request(app)
                .get('/reports/evidence/density?top=5')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.data.summary.totalCasesWithEvidence).toBe(3);

            const firstCall =
                mockedReportRepository.getEvidenceDensity.mock.calls[0]!;
            const filtersArg = firstCall[0] as any;

            expect(filtersArg).toMatchObject({ top: '5' });
        });

        it('should return empty if repository returns empty', async () => {
            mockedReportRepository.getEvidenceDensity.mockResolvedValue({
                summary: {
                    averageEvidencePerCase: 0,
                    totalCasesWithEvidence: 0,
                },
                topCases: [],
            });

            const response = await request(app)
                .get('/reports/evidence/density')
                .set('Authorization', coordinatorAuthorizationHeader);

            expect(response.status).toBe(200);
            expect(response.body.data.topCases).toEqual([]);
        });
    });
});

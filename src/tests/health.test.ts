import request from 'supertest';
import app from '../app';

describe('EvidenceTrack API - Root endpoint', () => {
    it('should return a welcome message on GET /', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            message: 'Welcome to EvidenceTrack API',
            data: {
                service: 'EvidenceTrack API',
            },
        });
    });
});

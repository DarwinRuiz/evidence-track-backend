import { Router } from 'express';
import { sendSuccess } from '../core/http/responseHelpers';

const router: Router = Router();

router.get('/', (request, response) => {
    return sendSuccess(
        response,
        200,
        { service: 'EvidenceTrack API' },
        'Welcome to EvidenceTrack API'
    );
});

export default router;

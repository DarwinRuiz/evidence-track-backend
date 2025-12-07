import { Router } from 'express';
import { sendSuccess } from '../core/http/responseHelpers';
import authRouter from '../modules/auth/auth.routes';
import RoleRouter from '../modules/role/role.routes';
import userRouter from '../modules/user/user.routes';

const router: Router = Router();

router.get('/', (request, response) => {
    return sendSuccess(
        response,
        200,
        { service: 'EvidenceTrack API' },
        'Welcome to EvidenceTrack API'
    );
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/roles', RoleRouter);

export default router;

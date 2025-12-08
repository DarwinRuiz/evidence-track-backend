import { Router } from 'express';
import { authenticationMiddleware } from '../../middlewares/auth.middleware';
import { createRoleAuthorizationMiddleware } from '../../middlewares/role.middleware';
import { validateRequest } from '../../middlewares/validation.middleware';

import {
    caseFilesStatusByDayValidation,
    dashboardOverviewValidation,
    evidenceDensityValidation,
    technicianActivityValidation,
} from './report.validators';

import {
    getCaseFilesStatusByDay,
    getDashboardOverview,
    getEvidenceDensity,
    getTechnicianActivity,
} from './report.controller';

const reportRouter: Router = Router();

const adminOrCoordinator = createRoleAuthorizationMiddleware([
    'ADMINISTRATOR',
    'COORDINATOR',
]);

reportRouter.get(
    '/overview',
    authenticationMiddleware,
    adminOrCoordinator,
    validateRequest(dashboardOverviewValidation),
    getDashboardOverview
);

reportRouter.get(
    '/case-files/status-by-day',
    authenticationMiddleware,
    adminOrCoordinator,
    validateRequest(caseFilesStatusByDayValidation),
    getCaseFilesStatusByDay
);

reportRouter.get(
    '/technicians/activity',
    authenticationMiddleware,
    adminOrCoordinator,
    validateRequest(technicianActivityValidation),
    getTechnicianActivity
);

reportRouter.get(
    '/evidence/density',
    authenticationMiddleware,
    adminOrCoordinator,
    validateRequest(evidenceDensityValidation),
    getEvidenceDensity
);

export default reportRouter;

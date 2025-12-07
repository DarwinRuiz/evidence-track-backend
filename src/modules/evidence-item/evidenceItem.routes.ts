import { Router } from 'express';
import { authenticationMiddleware } from '../../middlewares/auth.middleware';
import { createRoleAuthorizationMiddleware } from '../../middlewares/role.middleware';
import { validateRequest } from '../../middlewares/validation.middleware';
import {
    createEvidenceItem,
    deleteEvidenceItem,
    getEvidenceItemById,
    getTotalEvidenceItemCountByCaseFile,
    listEvidenceItems,
    updateEvidenceItem,
} from './evidenceItem.controller';
import {
    createEvidenceItemValidation,
    deleteEvidenceItemValidation,
    getEvidenceItemByIdValidation,
    listEvidenceItemsValidation,
    updateEvidenceItemValidation,
} from './evidenceItem.validators';

const evidenceItemRouter: Router = Router();

const technicianOrCoordinator = createRoleAuthorizationMiddleware([
    'TECHNICIAN',
    'COORDINATOR',
]);
const coordinatorOnly = createRoleAuthorizationMiddleware(['COORDINATOR']);

evidenceItemRouter.post(
    '/',
    authenticationMiddleware,
    technicianOrCoordinator,
    validateRequest(createEvidenceItemValidation),
    createEvidenceItem
);

evidenceItemRouter.get(
    '/',
    authenticationMiddleware,
    technicianOrCoordinator,
    validateRequest(listEvidenceItemsValidation),
    listEvidenceItems
);

evidenceItemRouter.get(
    '/count/total',
    authenticationMiddleware,
    technicianOrCoordinator,
    getTotalEvidenceItemCountByCaseFile
);

evidenceItemRouter.get(
    '/:evidenceItemId',
    authenticationMiddleware,
    technicianOrCoordinator,
    validateRequest(getEvidenceItemByIdValidation),
    getEvidenceItemById
);

evidenceItemRouter.put(
    '/:evidenceItemId',
    authenticationMiddleware,
    technicianOrCoordinator,
    validateRequest(updateEvidenceItemValidation),
    updateEvidenceItem
);

evidenceItemRouter.delete(
    '/:evidenceItemId',
    authenticationMiddleware,
    coordinatorOnly,
    validateRequest(deleteEvidenceItemValidation),
    deleteEvidenceItem
);

export default evidenceItemRouter;

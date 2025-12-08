import { Router } from 'express';

import { authenticationMiddleware } from '../../middlewares/auth.middleware';
import { createRoleAuthorizationMiddleware } from '../../middlewares/role.middleware';
import { validateRequest } from '../../middlewares/validation.middleware';
import {
    createCaseFile,
    deleteCaseFile,
    getCaseFileById,
    getTotalCaseFileCount,
    listCaseFiles,
    updateCaseFile,
} from './caseFile.controller';
import {
    createCaseFileValidation,
    deleteCaseFileValidation,
    getCaseFileByIdValidation,
    listCaseFilesValidation,
    updateCaseFileValidation,
} from './caseFile.validators';

const caseFileRouter: Router = Router();

const technicianOrCoordinator = createRoleAuthorizationMiddleware([
    'TECHNICIAN',
    'COORDINATOR',
]);
const coordinatorOnly = createRoleAuthorizationMiddleware(['COORDINATOR']);

caseFileRouter.post(
    '/',
    authenticationMiddleware,
    technicianOrCoordinator,
    validateRequest(createCaseFileValidation),
    createCaseFile
);

caseFileRouter.put(
    '/:caseFileId',
    authenticationMiddleware,
    technicianOrCoordinator,
    validateRequest(updateCaseFileValidation),
    updateCaseFile
);

caseFileRouter.delete(
    '/:caseFileId',
    authenticationMiddleware,
    coordinatorOnly,
    validateRequest(deleteCaseFileValidation),
    deleteCaseFile
);

caseFileRouter.get(
    '/:caseFileId',
    authenticationMiddleware,
    technicianOrCoordinator,
    validateRequest(getCaseFileByIdValidation),
    getCaseFileById
);

caseFileRouter.get(
    '/',
    authenticationMiddleware,
    technicianOrCoordinator,
    validateRequest(listCaseFilesValidation),
    listCaseFiles
);

caseFileRouter.get(
    '/count/total',
    authenticationMiddleware,
    technicianOrCoordinator,
    getTotalCaseFileCount
);

export default caseFileRouter;

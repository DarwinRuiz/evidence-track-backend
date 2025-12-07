import {
    caseFileIdParamsSchema,
    createCaseFileBodySchema,
    listCaseFilesQuerySchema,
    updateCaseFileBodySchema,
} from './caseFile.model';

export const createCaseFileValidation = {
    bodySchema: createCaseFileBodySchema,
};

export const updateCaseFileValidation = {
    paramsSchema: caseFileIdParamsSchema,
    bodySchema: updateCaseFileBodySchema,
};

export const getCaseFileByIdValidation = {
    paramsSchema: caseFileIdParamsSchema,
};

export const deleteCaseFileValidation = {
    paramsSchema: caseFileIdParamsSchema,
};

export const listCaseFilesValidation = {
    querySchema: listCaseFilesQuerySchema,
};

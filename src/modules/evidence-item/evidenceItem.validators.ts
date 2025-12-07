import {
    createEvidenceItemBodySchema,
    evidenceItemIdParamsSchema,
    listEvidenceItemsQuerySchema,
    updateEvidenceItemBodySchema,
} from './evidenceItem.model';

export const createEvidenceItemValidation = {
    bodySchema: createEvidenceItemBodySchema,
};

export const updateEvidenceItemValidation = {
    paramsSchema: evidenceItemIdParamsSchema,
    bodySchema: updateEvidenceItemBodySchema,
};

export const getEvidenceItemByIdValidation = {
    paramsSchema: evidenceItemIdParamsSchema,
};

export const deleteEvidenceItemValidation = {
    paramsSchema: evidenceItemIdParamsSchema,
};

export const listEvidenceItemsValidation = {
    querySchema: listEvidenceItemsQuerySchema,
};

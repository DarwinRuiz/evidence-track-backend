import type { Request, Response } from 'express';
import { sendSuccess } from '../../core/http/responseHelpers';
import { evidenceItemService } from './evidenceItem.service';

export const createEvidenceItem = async (
    request: Request,
    response: Response
) => {
    const authenticatedUser = (
        request as Request & { user?: { userId: number } }
    ).user;

    const createdEvidenceItem = await evidenceItemService.createEvidenceItem(
        request.body,
        authenticatedUser!.userId
    );

    return sendSuccess(
        response,
        201,
        {
            evidenceItem: createdEvidenceItem,
        },
        'Evidence item created successfully'
    );
};

export const getEvidenceItemById = async (
    request: Request,
    response: Response
) => {
    const evidenceItemId = Number(request.params.evidenceItemId);

    const evidenceItem = await evidenceItemService.getEvidenceItemById(
        evidenceItemId
    );

    return sendSuccess(response, 200, {
        evidenceItem,
    });
};

export const listEvidenceItems = async (
    request: Request,
    response: Response
) => {
    const evidenceItems = await evidenceItemService.listEvidenceItems(
        request.query as any
    );

    return sendSuccess(response, 200, { evidenceItems });
};

export const getTotalEvidenceItemCountByCaseFile = async (
    request: Request,
    response: Response
) => {
    const caseFileId = Number(request.query.caseFileId);

    const totalRows =
        await evidenceItemService.getTotalEvidenceItemCountByCaseFile(
            caseFileId
        );

    return sendSuccess(response, 200, { totalRows });
};

export const updateEvidenceItem = async (
    request: Request,
    response: Response
) => {
    const evidenceItemId = Number(request.params.evidenceItemId);

    const updatedEvidenceItem = await evidenceItemService.updateEvidenceItem(
        evidenceItemId,
        request.body
    );

    return sendSuccess(
        response,
        200,
        {
            evidenceItem: updatedEvidenceItem,
        },
        'Evidence item updated successfully'
    );
};

export const deleteEvidenceItem = async (
    request: Request,
    response: Response
) => {
    const evidenceItemId = Number(request.params.evidenceItemId);

    await evidenceItemService.deleteEvidenceItem(evidenceItemId);

    return sendSuccess(
        response,
        200,
        null,
        'Evidence item deleted successfully'
    );
};

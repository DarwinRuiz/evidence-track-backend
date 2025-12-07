import type { Request, Response } from 'express';
import { sendSuccess } from '../../core/http/responseHelpers';
import { caseFileService } from './caseFile.service';

export const createCaseFile = async (request: Request, response: Response) => {
    const authenticatedUser = (
        request as Request & { user?: { userId: number } }
    ).user;

    const createdCaseFile = await caseFileService.createCaseFile(
        request.body,
        authenticatedUser!.userId
    );

    return sendSuccess(
        response,
        201,
        {
            caseFile: createdCaseFile,
        },
        'Case file created successfully'
    );
};

export const updateCaseFile = async (request: Request, response: Response) => {
    const caseFileId = Number(request.params.caseFileId);

    const updatedCaseFile = await caseFileService.updateCaseFile(
        caseFileId,
        request.body
    );

    return sendSuccess(
        response,
        200,
        {
            caseFile: updatedCaseFile,
        },
        'Case file updated successfully'
    );
};

export const deleteCaseFile = async (request: Request, response: Response) => {
    const caseFileId = Number(request.params.caseFileId);

    await caseFileService.deleteCaseFile(caseFileId);

    return sendSuccess(response, 200, null, 'Case file deleted successfully');
};

export const getCaseFileById = async (request: Request, response: Response) => {
    const caseFileId = Number(request.params.caseFileId);

    const caseFile = await caseFileService.getCaseFileById(caseFileId);

    return sendSuccess(response, 200, {
        caseFile,
    });
};

export const listCaseFiles = async (request: Request, response: Response) => {
    const caseFiles = await caseFileService.listCaseFiles(request.query as any);

    return sendSuccess(response, 200, { caseFiles });
};

export const getTotalCaseFileCount = async (
    request: Request,
    response: Response
) => {
    const totalCaseFileCount = await caseFileService.getTotalCaseFileCount();
    return sendSuccess(response, 200, { totalRows: totalCaseFileCount });
};

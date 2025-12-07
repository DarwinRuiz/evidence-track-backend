import { ApiError } from '../../core/http/ApiError';
import {
    type CaseFile,
    type CreateCaseFileInput,
    type ListCaseFilesQuery,
    type UpdateCaseFileInput,
} from './caseFile.model';
import { caseFileRepository } from './caseFile.repository';

export const caseFileService = {
    async createCaseFile(
        input: CreateCaseFileInput,
        technicianUserId: number
    ): Promise<CaseFile> {
        return caseFileRepository.createCaseFile(
            input.caseCode,
            technicianUserId,
            input.description
        );
    },

    async getCaseFileById(caseFileId: number): Promise<CaseFile> {
        const caseFile = await caseFileRepository.getCaseFileById(caseFileId);

        if (!caseFile) {
            throw ApiError.notFound(
                'Case file not found',
                'CASE_FILE_NOT_FOUND'
            );
        }

        return caseFile;
    },

    async listCaseFiles(filters: ListCaseFilesQuery): Promise<CaseFile[]> {
        return caseFileRepository.listCaseFiles(filters);
    },

    async updateCaseFile(
        caseFileId: number,
        input: UpdateCaseFileInput
    ): Promise<CaseFile> {
        const existingCaseFile = await caseFileRepository.getCaseFileById(
            caseFileId
        );

        if (!existingCaseFile) {
            throw ApiError.notFound(
                'Case file not found',
                'CASE_FILE_NOT_FOUND'
            );
        }

        for (const key of Object.keys(input) as (keyof UpdateCaseFileInput)[]) {
            if (input[key] !== undefined) {
                (existingCaseFile as Record<string, unknown>)[key] =
                    input[key]!;
            }
        }

        return caseFileRepository.updateCaseFile(
            caseFileId,
            existingCaseFile.description ?? null,
            existingCaseFile.status,
            existingCaseFile.status === 'REJECTED'
                ? existingCaseFile.rejectionReason ?? null
                : null
        );
    },

    async deleteCaseFile(caseFileId: number): Promise<void> {
        const existingCaseFile = await caseFileRepository.getCaseFileById(
            caseFileId
        );

        if (!existingCaseFile) {
            throw ApiError.notFound(
                'Case file not found',
                'CASE_FILE_NOT_FOUND'
            );
        }

        await caseFileRepository.deleteCaseFile(caseFileId);
    },

    async getTotalCaseFileCount(): Promise<number> {
        return caseFileRepository.getTotalCaseFileCount();
    },
};

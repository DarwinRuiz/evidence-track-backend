import { ApiError } from '../../core/http/ApiError';
import {
    type CreateEvidenceItemInput,
    type EvidenceItem,
    type ListEvidenceItemsQuery,
    type UpdateEvidenceItemInput,
} from './evidenceItem.model';
import { evidenceItemRepository } from './evidenceItem.repository';

export const evidenceItemService = {
    async createEvidenceItem(
        input: CreateEvidenceItemInput,
        technicianUserId: number
    ): Promise<EvidenceItem> {
        return evidenceItemRepository.createEvidenceItem(
            input.caseFileId,
            input.description,
            input.color ?? null,
            input.size ?? null,
            input.weight ?? null,
            input.locationFound ?? null,
            technicianUserId
        );
    },

    async getEvidenceItemById(evidenceItemId: number): Promise<EvidenceItem> {
        const evidenceItem = await evidenceItemRepository.getEvidenceItemById(
            evidenceItemId
        );

        if (!evidenceItem) {
            throw ApiError.notFound(
                'Evidence item not found',
                'EVIDENCE_ITEM_NOT_FOUND'
            );
        }

        return evidenceItem;
    },

    async listEvidenceItems(
        query: ListEvidenceItemsQuery
    ): Promise<EvidenceItem[]> {
        return evidenceItemRepository.listEvidenceItems(query);
    },

    async getTotalEvidenceItemCountByCaseFile(
        caseFileId: number
    ): Promise<number> {
        return evidenceItemRepository.getTotalEvidenceItemCountByCaseFile(
            caseFileId
        );
    },

    async updateEvidenceItem(
        evidenceItemId: number,
        input: UpdateEvidenceItemInput
    ): Promise<EvidenceItem> {
        const existingEvidenceItem =
            await evidenceItemRepository.getEvidenceItemById(evidenceItemId);

        if (!existingEvidenceItem) {
            throw ApiError.notFound(
                'Evidence item not found',
                'EVIDENCE_ITEM_NOT_FOUND'
            );
        }

        for (const key of Object.keys(
            input
        ) as (keyof UpdateEvidenceItemInput)[]) {
            if (input[key] !== undefined) {
                (existingEvidenceItem as Record<string, unknown>)[key] =
                    input[key]!;
            }
        }

        return evidenceItemRepository.updateEvidenceItem(
            evidenceItemId,
            existingEvidenceItem.description,
            existingEvidenceItem.color ?? null,
            existingEvidenceItem.size ?? null,
            existingEvidenceItem.weight ?? null,
            existingEvidenceItem.locationFound ?? null
        );
    },

    async deleteEvidenceItem(evidenceItemId: number): Promise<void> {
        const existingEvidenceItem =
            await evidenceItemRepository.getEvidenceItemById(evidenceItemId);

        if (!existingEvidenceItem) {
            throw ApiError.notFound(
                'Evidence item not found',
                'EVIDENCE_ITEM_NOT_FOUND'
            );
        }

        await evidenceItemRepository.deleteEvidenceItem(evidenceItemId);
    },
};

import { databaseConnection } from '../../database/connection';
import {
    evidenceItemEntitySchema,
    type EvidenceItem,
    type ListEvidenceItemsQuery,
} from './evidenceItem.model';

const mapRowToEvidenceItem = (row: any): EvidenceItem =>
    evidenceItemEntitySchema.parse({
        evidenceItemId: row.evidence_item_id,
        caseFileId: row.case_file_id,
        description: row.description,
        color: row.color,
        size: row.size,
        weight: row.weight,
        locationFound: row.location_found,
        technicianId: row.technician_id,
        createdAt: row.created_at,
    });

export const evidenceItemRepository = {
    async createEvidenceItem(
        caseFileId: number,
        description: string,
        color: string | null,
        size: string | null,
        weight: string | null,
        locationFound: string | null,
        technicianId: number
    ): Promise<EvidenceItem> {
        const result = await databaseConnection.raw(
            'EXEC dicri.sp_evidence_item_create @case_file_id = ?, @description = ?, @color = ?, @size = ?, @weight = ?, @location_found = ?, @technician_id = ?',
            [
                caseFileId,
                description,
                color,
                size,
                weight,
                locationFound,
                technicianId,
            ]
        );

        const row = result[0];
        return mapRowToEvidenceItem(row);
    },

    async getEvidenceItemById(
        evidenceItemId: number
    ): Promise<EvidenceItem | null> {
        const result = await databaseConnection.raw(
            'EXEC dicri.sp_evidence_item_get_by_id @evidence_item_id = ?',
            [evidenceItemId]
        );

        const row = result[0];

        if (!row) {
            return null;
        }

        return mapRowToEvidenceItem(row);
    },

    async listEvidenceItems(
        query: ListEvidenceItemsQuery
    ): Promise<EvidenceItem[]> {
        const offset = query.offset ?? 0;
        const limit = query.limit ?? 10;

        const result = await databaseConnection.raw(
            'EXEC dicri.sp_evidence_item_list_by_case_file @case_file_id = ?, @offset = ?, @limit = ?',
            [query.caseFileId, offset, limit]
        );

        const rows = result;

        return rows.map((row: any) => mapRowToEvidenceItem(row));
    },

    async getTotalEvidenceItemCountByCaseFile(
        caseFileId: number
    ): Promise<number> {
        const result = await databaseConnection.raw(
            'EXEC dicri.sp_evidence_item_get_total_count_by_case_file @case_file_id = ?',
            [caseFileId]
        );

        const row = result[0];

        return Number(row.total_rows);
    },

    async updateEvidenceItem(
        evidenceItemId: number,
        description: string,
        color: string | null,
        size: string | null,
        weight: string | null,
        locationFound: string | null
    ): Promise<EvidenceItem> {
        const result = await databaseConnection.raw(
            'EXEC dicri.sp_evidence_item_update @evidence_item_id = ?, @description = ?, @color = ?, @size = ?, @weight = ?, @location_found = ?',
            [evidenceItemId, description, color, size, weight, locationFound]
        );

        const row = result[0];
        return mapRowToEvidenceItem(row);
    },

    async deleteEvidenceItem(evidenceItemId: number): Promise<void> {
        await databaseConnection.raw(
            'EXEC dicri.sp_evidence_item_delete @evidence_item_id = ?',
            [evidenceItemId]
        );
    },
};

import { databaseConnection } from '../../database/connection';
import {
    caseFileEntitySchema,
    type CaseFile,
    type ListCaseFilesQuery,
} from './caseFile.model';

const mapRowToCaseFile = (row: any): CaseFile =>
    caseFileEntitySchema.parse({
        caseFileId: row.case_file_id,
        caseCode: row.case_code,
        registeredAt: row.registered_at,
        status: row.status,
        rejectionReason: row.rejection_reason,
        technicianId: row.technician_id,
        description: row.description,
    });

export const caseFileRepository = {
    async createCaseFile(
        caseCode: string,
        technicianId: number,
        description?: string
    ): Promise<CaseFile> {
        const result = await databaseConnection.raw(
            'EXEC dicri.sp_case_file_create @case_code = ?, @technician_id = ?, @description = ?',
            [caseCode, technicianId, description ?? null]
        );

        const row = result[0];
        return mapRowToCaseFile(row);
    },

    async getCaseFileById(caseFileId: number): Promise<CaseFile | null> {
        const result = await databaseConnection.raw(
            'EXEC dicri.sp_case_file_get_by_id @case_file_id = ?',
            [caseFileId]
        );

        const row = result[0];

        if (!row) {
            return null;
        }

        return mapRowToCaseFile(row);
    },

    async listCaseFiles(filters: ListCaseFilesQuery): Promise<CaseFile[]> {
        const offset = filters.offset ?? 0;
        const limit = filters.limit ?? 10;

        const result = await databaseConnection.raw(
            'EXEC dicri.sp_case_file_list @status = ?, @initial_registered_date = ?, @final_registered_date = ?, @offset = ?, @limit = ?',
            [
                filters.status ?? null,
                filters.initialRegisteredDate ?? null,
                filters.finalRegisteredDate ?? null,
                offset,
                limit,
            ]
        );

        const rows = result;

        return rows.map((row: any) => mapRowToCaseFile(row));
    },

    async updateCaseFile(
        caseFileId: number,
        description: string | null,
        status: string,
        rejectionReason: string | null
    ): Promise<CaseFile> {
        const result = await databaseConnection.raw(
            'EXEC dicri.sp_case_file_update @case_file_id = ?, @description = ?, @status = ?, @rejection_reason = ?',
            [caseFileId, description, status, rejectionReason]
        );

        const row = result[0];

        return mapRowToCaseFile(row);
    },

    async deleteCaseFile(caseFileId: number): Promise<void> {
        await databaseConnection.raw(
            'EXEC dicri.sp_case_file_delete @case_file_id = ?',
            [caseFileId]
        );
    },

    async getTotalCaseFileCount(): Promise<number> {
        const result = await databaseConnection.raw(
            'EXEC dicri.sp_case_file_get_total_count'
        );

        const row = result[0];

        return Number(row.total_rows);
    },
};

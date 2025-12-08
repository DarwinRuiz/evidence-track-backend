import { databaseConnection } from '../../database/connection';
import type {
    CaseFilesStatusByDayRow,
    DashboardOverview,
    EvidenceDensityResult,
    EvidenceDensitySummary,
    EvidenceDensityTopCase,
    TechnicianActivityRow,
} from './report.model';
import type { ReportFilters } from './report.validators';

const mapRowToDashboardOverview = (row: any): DashboardOverview => ({
    totalCaseFiles: Number(row.total_case_files ?? 0),
    totalRegistered: Number(row.total_registered ?? 0),
    totalUnderReview: Number(row.total_under_review ?? 0),
    totalApproved: Number(row.total_approved ?? 0),
    totalRejected: Number(row.total_rejected ?? 0),
    totalLast7Days: Number(row.total_last_7_days ?? 0),
    totalLast30Days: Number(row.total_last_30_days ?? 0),
});

const mapRowToCaseFilesStatusByDay = (row: any): CaseFilesStatusByDayRow => ({
    registeredDate:
        row.registered_date instanceof Date
            ? row.registered_date.toISOString().substring(0, 10)
            : String(row.registered_date),
    status: row.status,
    totalCaseFiles: Number(row.total_case_files ?? 0),
});

const mapRowToTechnicianActivity = (row: any): TechnicianActivityRow => ({
    technicianId: Number(row.technician_id),
    technicianName: row.technician_name,
    totalCaseFiles: Number(row.total_case_files ?? 0),
    totalEvidenceItems: Number(row.total_evidence_items ?? 0),
});

const mapRowToEvidenceDensitySummary = (row: any): EvidenceDensitySummary => ({
    averageEvidencePerCase: Number(row.average_evidence_per_case ?? 0),
    totalCasesWithEvidence: Number(row.total_cases_with_evidence ?? 0),
});

const mapRowToEvidenceDensityTopCase = (row: any): EvidenceDensityTopCase => ({
    caseFileId: Number(row.case_file_id),
    caseCode: row.case_code,
    status: row.status,
    technicianId: Number(row.technician_id),
    evidenceCount: Number(row.evidence_count ?? 0),
});

export const reportRepository = {
    async getDashboardOverview(
        filters: ReportFilters
    ): Promise<DashboardOverview | null> {
        const {
            status = undefined,
            initialRegisteredDate = undefined,
            finalRegisteredDate = undefined,
            technicianId = undefined,
        } = filters;

        const result = await databaseConnection.raw(
            `EXEC dicri.sp_dashboard_overview
                @status = ?,
                @initial_registered_date = ?,
                @final_registered_date = ?,
                @technician_id = ?`,
            [
                status ?? null,
                initialRegisteredDate ?? null,
                finalRegisteredDate ?? null,
                technicianId ?? null,
            ]
        );

        const row = result[0];

        if (!row) {
            return null;
        }

        return mapRowToDashboardOverview(row);
    },

    async getCaseFilesStatusByDay(
        filters: ReportFilters
    ): Promise<CaseFilesStatusByDayRow[]> {
        const {
            status = undefined,
            initialRegisteredDate = undefined,
            finalRegisteredDate = undefined,
            technicianId = undefined,
            daysBack = 30,
        } = filters;

        const result = await databaseConnection.raw(
            `EXEC dicri.sp_dashboard_case_files_by_status_and_day
                @days_back = ?,
                @status = ?,
                @initial_registered_date = ?,
                @final_registered_date = ?,
                @technician_id = ?`,
            [
                daysBack ?? 30,
                status ?? null,
                initialRegisteredDate ?? null,
                finalRegisteredDate ?? null,
                technicianId ?? null,
            ]
        );

        const rows = result as any[];

        if (!rows || rows.length === 0) {
            return [];
        }

        return rows.map((row) => mapRowToCaseFilesStatusByDay(row));
    },

    async getTechnicianActivity(
        filters: ReportFilters
    ): Promise<TechnicianActivityRow[]> {
        const {
            status = undefined,
            initialRegisteredDate = undefined,
            finalRegisteredDate = undefined,
            technicianId = undefined,
            daysBack = 30,
        } = filters;

        const result = await databaseConnection.raw(
            `EXEC dicri.sp_dashboard_technician_activity
                @days_back = ?,
                @status = ?,
                @initial_registered_date = ?,
                @final_registered_date = ?,
                @technician_id = ?`,
            [
                daysBack ?? 30,
                status ?? null,
                initialRegisteredDate ?? null,
                finalRegisteredDate ?? null,
                technicianId ?? null,
            ]
        );

        const rows = result as any[];

        if (!rows || rows.length === 0) {
            return [];
        }

        return rows.map((row) => mapRowToTechnicianActivity(row));
    },

    async getEvidenceDensity(
        filters: ReportFilters
    ): Promise<EvidenceDensityResult> {
        const {
            status = undefined,
            initialRegisteredDate = undefined,
            finalRegisteredDate = undefined,
            technicianId = undefined,
            top = 10,
        } = filters;

        const result = await databaseConnection.raw(
            `EXEC dicri.sp_dashboard_evidence_density
                @top = ?,
                @status = ?,
                @initial_registered_date = ?,
                @final_registered_date = ?,
                @technician_id = ?`,
            [
                top ?? 10,
                status ?? null,
                initialRegisteredDate ?? null,
                finalRegisteredDate ?? null,
                technicianId ?? null,
            ]
        );

        const rows = (result ?? []) as any[];

        if (!rows || rows.length === 0) {
            return {
                summary: {
                    averageEvidencePerCase: 0,
                    totalCasesWithEvidence: 0,
                },
                topCases: [],
            };
        }

        const topCases: EvidenceDensityTopCase[] = rows.map((row: any) => ({
            caseFileId: Number(row.case_file_id),
            caseCode: row.case_code,
            status: row.status,
            technicianId: Number(row.technician_id),
            evidenceCount: Number(row.evidence_count ?? 0),
        }));

        const totalCasesWithEvidence = topCases.length;
        const sumEvidence = topCases.reduce(
            (acc, item) => acc + item.evidenceCount,
            0
        );

        const summary: EvidenceDensitySummary = {
            averageEvidencePerCase:
                totalCasesWithEvidence > 0
                    ? sumEvidence / totalCasesWithEvidence
                    : 0,
            totalCasesWithEvidence,
        };

        return {
            summary,
            topCases,
        };
    },
};

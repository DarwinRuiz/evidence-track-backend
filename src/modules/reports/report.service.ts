import type {
    CaseFilesStatusByDayRow,
    DashboardOverview,
    EvidenceDensityResult,
    TechnicianActivityRow,
} from './report.model';
import { reportRepository } from './report.repository';
import type { ReportFilters } from './report.validators';

export const reportService = {
    async getDashboardOverview(
        filters: ReportFilters
    ): Promise<DashboardOverview | null> {
        return reportRepository.getDashboardOverview(filters);
    },

    async getCaseFilesStatusByDay(
        filters: ReportFilters
    ): Promise<CaseFilesStatusByDayRow[]> {
        return reportRepository.getCaseFilesStatusByDay(filters);
    },

    async getTechnicianActivity(
        filters: ReportFilters
    ): Promise<TechnicianActivityRow[]> {
        return reportRepository.getTechnicianActivity(filters);
    },

    async getEvidenceDensity(
        filters: ReportFilters
    ): Promise<EvidenceDensityResult> {
        return reportRepository.getEvidenceDensity(filters);
    },
};

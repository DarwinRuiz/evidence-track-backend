export interface DashboardOverview {
    totalCaseFiles: number;
    totalRegistered: number;
    totalUnderReview: number;
    totalApproved: number;
    totalRejected: number;
    totalLast7Days: number;
    totalLast30Days: number;
}

export interface CaseFilesStatusByDayRow {
    registeredDate: string; // ISO date (yyyy-mm-dd)
    status: 'REGISTERED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
    totalCaseFiles: number;
}

export interface TechnicianActivityRow {
    technicianId: number;
    technicianName: string;
    totalCaseFiles: number;
    totalEvidenceItems: number;
}

export interface EvidenceDensitySummary {
    averageEvidencePerCase: number;
    totalCasesWithEvidence: number;
}

export interface EvidenceDensityTopCase {
    caseFileId: number;
    caseCode: string;
    status: 'REGISTERED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
    technicianId: number;
    evidenceCount: number;
}

export interface EvidenceDensityResult {
    summary: EvidenceDensitySummary | null;
    topCases: EvidenceDensityTopCase[];
}

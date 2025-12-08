import type { Request, Response } from 'express';
import { sendSuccess } from '../../core/http/responseHelpers';
import { reportService } from './report.service';
import type { ReportFilters } from './report.validators';

export const getDashboardOverview = async (
    request: Request,
    response: Response
) => {
    const filters = request.query as unknown as ReportFilters;

    const overview = await reportService.getDashboardOverview(filters);

    return sendSuccess(
        response,
        200,
        { overview: overview ?? null },
        'Dashboard overview retrieved successfully'
    );
};

export const getCaseFilesStatusByDay = async (
    request: Request,
    response: Response
) => {
    const filters = request.query as unknown as ReportFilters;

    const rows = await reportService.getCaseFilesStatusByDay(filters);

    return sendSuccess(
        response,
        200,
        { rows },
        'Case files status by day retrieved successfully'
    );
};

export const getTechnicianActivity = async (
    request: Request,
    response: Response
) => {
    const filters = request.query as unknown as ReportFilters;

    const rows = await reportService.getTechnicianActivity(filters);

    return sendSuccess(
        response,
        200,
        { rows },
        'Technician activity retrieved successfully'
    );
};

export const getEvidenceDensity = async (
    request: Request,
    response: Response
) => {
    const filters = request.query as unknown as ReportFilters;

    const result = await reportService.getEvidenceDensity(filters);

    return sendSuccess(
        response,
        200,
        {
            summary: result.summary ?? null,
            topCases: result.topCases ?? [],
        },
        'Evidence density retrieved successfully'
    );
};

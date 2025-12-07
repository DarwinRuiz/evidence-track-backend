import { createLogger, format, transports } from 'winston';
import { appEnvironment } from './env';

const { combine, timestamp, printf, json, colorize, errors } = format;

// Formato legible en desarrollo
const developmentFormat = combine(
    colorize(),
    timestamp(),
    errors({ stack: true }),
    printf(({ level, message, timestamp, stack, ...meta }) => {
        return `[${timestamp}] ${level}: ${stack || message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
        }`;
    })
);

// Formato JSON para producción (ideal para logs centralizados)
const productionFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format:
        appEnvironment.nodeEnvironment === 'development'
            ? developmentFormat
            : productionFormat,
    transports: [new transports.Console()],
});

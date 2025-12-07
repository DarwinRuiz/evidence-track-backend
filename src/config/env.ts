import { config as loadEnvironmentVariables } from 'dotenv';
import env from 'env-var';

loadEnvironmentVariables();

export const appEnvironment = {
    nodeEnvironment: env.get('NODE_ENV').default('development').asString(),
    port: env.get('PORT').required().asPortNumber(),

    jwtSecret: env.get('JWT_SECRET').required().asString(),
    jwtExpiration: env.get('JWT_EXPIRATION').default(3600).asInt(),

    database: {
        host: env.get('DB_HOST').required().asString(),
        port: env.get('DB_PORT').default(1433).asInt(),
        user: env.get('DB_USER').required().asString(),
        password: env.get('DB_PASSWORD').required().asString(),
        name: env.get('DB_NAME').required().asString(),
    },
};

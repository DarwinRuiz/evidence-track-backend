import type { Knex } from 'knex';
import { appEnvironment } from './env';

const knexConfiguration: Knex.Config = {
    client: 'mssql',
    connection: {
        host: appEnvironment.database.host,
        port: appEnvironment.database.port,
        user: appEnvironment.database.user,
        password: appEnvironment.database.password,
        database: appEnvironment.database.name,
        options: {
            enableArithAbort: true,
            encrypt: appEnvironment.nodeEnvironment !== 'development',
        },
    },
    pool: {
        min: 1,
        max: 10,
    },
};

export default knexConfiguration;

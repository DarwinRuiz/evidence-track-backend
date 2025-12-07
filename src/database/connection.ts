import knex from 'knex';
import knexConfiguration from '../config/knexfile';

export const databaseConnection = knex(knexConfiguration);

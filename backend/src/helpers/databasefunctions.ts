import { PoolConfig, QueryResultRow, Pool } from 'pg';
import { ErrorHandler } from './error';
import { executeQuery, validateSQLStatement } from '../utils';

require('dotenv').config();

const pgconfig: PoolConfig = {
  user: process.env.DBUSER,
  database: process.env.DATABASENAME,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: Number(process.env.DBPORT),
};

const pool = new Pool(pgconfig);

pool.on(
  'error',
  async (err: Error): Promise<never> => {
    throw new ErrorHandler(500, String(err));
  },
);

export const createTable = async (
  sqlStatement: string,
): Promise<QueryResultRow | never> => {
  const sqlKeyword = 'create table';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    return executeQuery(pool, sqlStatement);
  } catch (err) {
    throw err;
  }
};

export const insertSingleRow = async (
  sqlStatement: string,
  data: string[],
): Promise<QueryResultRow | never> => {
  const sqlKeyword = 'insert into';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    return executeQuery(pool, sqlStatement, data);
  } catch (err) {
    throw err;
  }
};

export const getRows = async (
  sqlStatement: string,
  data: string[] = [],
): Promise<QueryResultRow | never> => {
  const sqlKeyword = 'select';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    return executeQuery(pool, sqlStatement, data);
  } catch (err) {
    throw err;
  }
};

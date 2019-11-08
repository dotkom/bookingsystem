import {
  PoolConfig,
  ClientConfig,
  PoolClient,
  QueryResultRow,
} from 'pg';
import { ErrorHandler } from './error';
const { Pool } = require('pg');
require('dotenv').config();

const pgconfig: PoolConfig = {
  user: process.env.DBUSER,
  database: process.env.DATABASENAME,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: Number(process.env.DBPORT),
};

const pool = new Pool(pgconfig);

pool.on('error', async (err: Error, client: ClientConfig) => {
  throw new ErrorHandler(500, String(err));
});

const validateSQLStatement = async (
  sqlKeyword: string,
  sqlStatement: string,
): Promise<ErrorHandler | void> => {
  const isValidSqlStatement = sqlStatement.includes(sqlKeyword);
  if (!isValidSqlStatement) {
    throw new ErrorHandler(500, 'Invalid SQL statement');
  }
};

const executeQuery = async (
  sqlStatement: string,
  data?: Array<String>,
): Promise<QueryResultRow | ErrorHandler> => {
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    if (client !== undefined) {
      const res = data
        ? await client.query(sqlStatement, data)
        : await client.query(sqlStatement);
      return res;
    }
    throw new ErrorHandler(500, 'Failed to execute SQL query');
  } finally {
    if (client !== undefined) {
      client.release();
    } else {
      throw new ErrorHandler(500, 'Failed to release SQL client');
    }
  }
};
export const createTable = async (
  sqlStatement: string,
): Promise<QueryResultRow | ErrorHandler> => {
  const sqlKeyword = 'create table';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    return executeQuery(sqlStatement);
  } catch (err) {
    throw err;
  }
};

export const insertSingleRow = async (
  sqlStatement: string,
  data: string[],
): Promise<QueryResultRow | ErrorHandler> => {
  const sqlKeyword = 'insert into';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    return executeQuery(sqlStatement, data);
  } catch (err) {
    throw err;
  }
};

export const getRows = async (
  sqlStatement: string,
  data: string[] = [],
): Promise<QueryResultRow | ErrorHandler> => {
  const sqlKeyword = 'select';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    return executeQuery(sqlStatement, data);
  } catch (err) {
    throw err;
  }
};

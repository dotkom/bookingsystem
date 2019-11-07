import { PoolConfig, ClientConfig } from 'pg';
import { ErrorHandler } from './helpers/error';
const { Pool } = require('pg');
require('dotenv').config();

const pgconfig: PoolConfig = {
  user: process.env.DBUSER,
  database: process.env.DATABASENAME,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: parseInt(process.env.DBPORT),
};

const pool = new Pool(pgconfig);

pool.on('error', async (err: Error, client: ClientConfig) => {
  throw new ErrorHandler(500, String(err), client);
});

const validateSQLStatement = async (
  sqlKeyword: string,
  sqlStatement: string,
) => {
  const isValidSqlStatement = sqlStatement.includes(sqlKeyword)
  if (!isValidSqlStatement) {
    throw new ErrorHandler(500, 'Invalid SQL statement');
  }
};

const executeQuery = async (
  sqlStatement: string,
  data?: Array<String>,
) => {
  let client;
  try {
    client = await pool.connect();
    const res = data
      ? await client.query(sqlStatement, data)
      : await client.query(sqlStatement);
    return res;
  } catch (err) {
    throw new ErrorHandler(500, 'Failed to execute SQL query');
  } finally {
    try {
      client.release();
    } catch (err) {
      throw new ErrorHandler(500, 'Failed to release SQL client');
    }
  }
};
export const createTable = async (sqlStatement: string) => {
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
) => {
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
) => {
  const sqlKeyword = 'select';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    return executeQuery(sqlStatement, data);
  } catch (err) {
    throw err;
  }
};

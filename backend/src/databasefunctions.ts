import { PoolConfig, ClientConfig } from 'pg';
const { ErrorHandler } = require('./helpers/error');
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
pool.on('error', (err: Error, client: ClientConfig) => {
  throw new ErrorHandler(500, err, client);
});

const validSQLStatment = (type: string, sqlStatement: string) => {
  if (!sqlStatement.includes(type)) {
    throw new ErrorHandler(500, 'Invalid SQL statement');
  }
};
const executeQuery = async (
  type: string,
  sqlStatement: string,
  data?: Array<String>,
) => {
  let client;
  if (type === 'create table') {
    try {
      client = await pool.connect();
      const res = await client.query(sqlStatement);
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
  } else {
    try {
      client = await pool.connect();
      const res = await client.query(sqlStatement, data);
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
  }
};
export const createTable = async (sqlStatement: string) => {
  const type = 'create table';
  try {
    validSQLStatment(type, sqlStatement);
    return executeQuery(type, sqlStatement);
  } catch (err) {
    throw err;
  }
};

export const insertSingleRow = async (
  sqlStatement: string,
  data: string[],
) => {
  const type = 'insert into';
  try {
    validSQLStatment(type, sqlStatement);
    return executeQuery(type, sqlStatement, data);
  } catch (err) {
    throw err;
  }
};

export const getRows = async (
  sqlStatement: string,
  data: string[] = [],
) => {
  const type = 'select';
  try {
    validSQLStatment(type, sqlStatement);
    return executeQuery(type, sqlStatement, data);
  } catch (err) {
    throw err;
  }
};

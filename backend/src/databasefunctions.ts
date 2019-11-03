import { PoolConfig, ClientConfig } from 'pg';

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
  console.error(err, client);
});

const validSQLStatment = (type: string, sqlStatement: string) => {
  switch (type) {
    case 'create':
      if (sqlStatement && !sqlStatement.toLowerCase().includes('create table')) {
        throw new Error('wrong type of SQL statement');
      }
      break;
    case 'insert':
      if (sqlStatement && !sqlStatement.toLowerCase().includes('insert into')) {
        throw new Error('wrong type of SQL statement');
      }
      break;
    case 'select':
      if (sqlStatement && !sqlStatement.toLowerCase().includes('select')) {
        throw new Error('wrong type of SQL statement');
      }
    default:
      break;
  }

}
const executeQuery = async (type: string, sqlStatement: string, data?: Array<String>) => {
  let client;
  if (type === 'create') {
    try {
      client = await pool.connect();
      const res = await client.query(sqlStatement);
      return res;
    } catch (err) { console.error(err) }
    finally {
      try {
        client.release();
      } catch (err) {
        console.error(err);
      }
    }

  }
  else {
    try {
      client = await pool.connect();
      const res = await client.query(sqlStatement, data);
      return res;
    } catch (err) { console.error(err) }
    finally {
      try {
        client.release();
      } catch (err) {
        console.error(err);
      }
    }

  }
}
export const createTable = async (sqlStatement: string) => {
  const type = 'create'
  validSQLStatment(type, sqlStatement)
  return executeQuery(type, sqlStatement)
};

export const insertSingleRow = async (
  sqlStatement: string,
  data: string[],
) => {
  const type = 'insert'
  validSQLStatment(type, sqlStatement)
  return executeQuery(type, sqlStatement, data)

};

export const getRows = async (
  sqlStatement: string,
  data: string[] = [],
) => {
  const type = 'select'
  validSQLStatment(type, sqlStatement)
  return executeQuery(type, sqlStatement, data)
};

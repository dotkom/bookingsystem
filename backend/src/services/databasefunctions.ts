import { PoolConfig, QueryResultRow, Pool, PoolClient, Client } from 'pg';
import { ErrorHandler } from './error';
import { envConfig } from '../config';
import { isClient, isPoolClient, isPool, parsePgError, PgError } from '../utils';
import format from 'pg-format';

const pgconfig: PoolConfig = {
  user: envConfig.DBUSER,
  database: envConfig.DATABASENAME,
  password: envConfig.DBPASSWORD,
  host: envConfig.DBHOST,
  port: Number(envConfig.DBPORT),
};
const pool = new Pool(pgconfig);

const hasConnection = async () => {
  try {
    await (await pool.connect()).query('SELECT NOW()');
  } catch (e) {
    await parsePgError(e);
  }
};

const disconnectClient = async (client: PoolClient | Client) => {
  if (isPoolClient(client)) {
    client.release();
    return true;
  } else if (isClient(client)) {
    client.end();
    return true;
  }
};

const validateSQLStatement = async (sqlKeyword: string, sqlStatement: string): Promise<never | void> => {
  const isValidSqlStatement = sqlStatement.toLowerCase().includes(sqlKeyword);
  if (!isValidSqlStatement) {
    throw new ErrorHandler(400, { status: 'Invalid SQL statment' });
  }
};

const executeQuery = async (
  sqlStatement: string,
  client: PoolClient | Client,
  data?: string[],
): Promise<QueryResultRow | void> => {
  await hasConnection();
  try {
    const res = data ? await client.query(sqlStatement, data) : await client.query(sqlStatement);
    return res;
  } catch (e) {
    if (e instanceof ErrorHandler) {
      throw e;
    } else {
      await parsePgError(e, sqlStatement);
    }
  } finally {
    try {
      await disconnectClient(client);
    } catch (e) {
      throw e;
    }
  }
};

export const executeTransaction = async (
  actions: Array<{
    sqlStatement: string;
    data: string[];
  }>,
  client: PoolClient | Client,
): Promise<Array<any> | never> => {
  const output: any = [];

  const shouldAbort = async (err: PgError): Promise<void> => {
    try {
      if (err) {
        await (client as PoolClient | Client).query('ROLLBACK');
        throw err;
      }
    } catch (e) {
      await parsePgError(e);
    }
  };

  try {
    await hasConnection();
    await client.query('BEGIN');
    for (const action of actions) {
      try {
        await (client as PoolClient | Client).query(action.sqlStatement, action.data);
      } catch (error) {
        await shouldAbort(error);
      }
    }
    await client.query('COMMIT');
    return output;
  } catch (error) {
    throw error;
  } finally {
    try {
      await disconnectClient(client);
    } catch (e) {
      throw e;
    }
  }
};

export const createTable = async (
  sqlStatement: string,
  client: PoolClient | Client,
): Promise<QueryResultRow | never> => {
  const sqlKeyword = 'create table';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    return executeQuery(sqlStatement, client) as QueryResultRow;
  } catch (err) {
    throw err;
  }
};

export const insertSingleRow = async (
  sqlStatement: string,
  data: string[] = [],
  client: PoolClient | Client,
): Promise<QueryResultRow | never> => {
  const sqlKeyword = 'insert into';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    return executeQuery(sqlStatement, client, data) as QueryResultRow;
  } catch (err) {
    throw err;
  }
};

export const getRows = async (
  sqlStatement: string,
  data: string[] = [],
  client: PoolClient | Client,
): Promise<QueryResultRow | never> => {
  const sqlKeyword = 'select';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    return executeQuery(sqlStatement, client, data) as QueryResultRow;
  } catch (err) {
    throw err;
  }
};

export const updateRow = async (
  sqlStatement: string,
  data: string[] = [],
  client: PoolClient | Client,
): Promise<QueryResultRow | never> => {
  const sqlKeyword = 'update';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    return executeQuery(sqlStatement, client, data) as QueryResultRow;
  } catch (e) {
    throw e;
  }
};

export const UpdateMultipleRows = async (
  sqlStatement: string,
  data: string[][],
  client: PoolClient | Client,
  data2?: string[][],
): Promise<QueryResultRow | never> => {
  const sqlKeyword = 'update';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    const stat: string = data2 ? format(sqlStatement, data, data2) : format(sqlStatement, data);
    return executeQuery(stat, client) as QueryResultRow;
  } catch (e) {
    throw e;
  }
};

export const generateClientConnection = async (user: string, password: string): Promise<Client | void> => {
  const psqlconfig: PoolConfig = {
    user: user,
    database: process.env.DATABASENAME,
    password: password,
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT),
  };
  try {
    let connection = undefined;
    connection = new Client(psqlconfig);
    return connection;
  } catch (e) {
    await parsePgError(e);
  }
};

export const generatePoolConnection = async (user: string, password: string, type: string): Promise<Pool | void> => {
  const psqlconfig: PoolConfig = {
    user: user,
    database: process.env.DATABASENAME,
    password: password,
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT),
  };
  try {
    let connection = undefined;
    connection = new Pool(psqlconfig);
    return connection;
  } catch (e) {
    await parsePgError(e);
  }
};

export const genereateAdminConnection = async (): Promise<Pool> => {
  return pool;
};

export const getClient = async (connection: Client): Promise<Client> => {
  let client: any;
  if (isClient(connection)) {
    client = connection;
    return client as Client;
  } else {
    throw new ErrorHandler(400, { status: 'Database Error' });
  }
};

export const getPoolClient = async (connection: Pool): Promise<PoolClient | never> => {
  let client: any;
  if (isPool(connection)) {
    client = await connection.connect();
    return client as PoolClient;
  } else {
    throw new ErrorHandler(400, { status: 'Database Error' });
  }
};

export const createRole = async (sqlStatement: string, data: string[] = []): Promise<QueryResultRow | never> => {
  const sqlKeyword = 'create role';
  try {
    await validateSQLStatement(sqlKeyword, sqlStatement);
    const client = await getPoolClient(pool);
    return executeQuery(sqlStatement, client, data) as QueryResultRow;
  } catch (err) {
    throw err;
  }
};

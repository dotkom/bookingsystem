import { PoolClient, QueryResultRow, Pool } from 'pg';
import { ErrorHandler } from '../helpers/error';

export const validateSQLStatement = async (
  sqlKeyword: string,
  sqlStatement: string,
): Promise<ErrorHandler | void> => {
  const isValidSqlStatement = sqlStatement.includes(sqlKeyword);
  if (!isValidSqlStatement) {
    throw new ErrorHandler(500, 'Invalid SQL statement');
  }
};

export const executeQuery = async (
  pool: Pool,
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

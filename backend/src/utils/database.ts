import { PoolClient, QueryResultRow, Pool, Client } from 'pg';
import { ErrorHandler } from '../helpers/error';
import { errorCodes } from './databaseErrorCode';
export interface PgError extends Error {
  message: string;
  name: string;
  length: string;
  severity: string;
  code: string;
  detail: string;
  hint: string;
  position: string;
  internalPosition: string;
  internalQuery: string;
  where: string;
  schema: string;
  table: string;
  column: string;
  dataType: string;
  constraint: string;
  file: string;
  line: string;
  routine: string;
}

export const foundData = async (payload: QueryResultRow): Promise<boolean> => {
  return payload.rows.length !== 0 ? true : false;
};
export const isPool = (connection: Pool | Client | PoolClient): connection is Pool => {
  return (connection as Pool).connect !== undefined;
};
export const isClient = (connection: Pool | Client | PoolClient): connection is Client => {
  return (connection as Client).end !== undefined;
};
export const isPoolClient = (connection: Pool | Client | PoolClient): connection is PoolClient => {
  return (connection as PoolClient).release !== undefined;
};
export const parsePgError = async (err: PgError, sqlStatement?: string): Promise<never> => {
  const { message, code, severity, position, constraint } = err;
  const output = {} as any;
  try {
    if (message !== undefined) {
      output.message = message;
    }
    output.errorcode = errorCodes[code];
    output.severity = severity;
    if (position !== undefined) {
      output.position = position;
    }
    if (constraint !== undefined) {
      output.constraint = constraint;
    }
    if (sqlStatement !== undefined) {
      const pos = parseInt(position);
      // get the end of the error pos
      let end = pos + 7;
      if (pos + 7 >= sqlStatement.length) {
        end = sqlStatement.length;
      }
      // get the start position for SQL error
      let start = pos - 2;
      if (pos - 2 <= 1) {
        start = 0;
      }
      output.sql = sqlStatement.substring(start, end);
    }
  } catch (e) {
    throw new ErrorHandler(500, { type: 'Internal Error' });
  }
  if (err.code === undefined && err.position === undefined) {
    throw new ErrorHandler(400, { type: `Unknown error` });
  } else {
    throw new ErrorHandler(400, {
      type: 'database error',
      payload: output,
    });
  }
};

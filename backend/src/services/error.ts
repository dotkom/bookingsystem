import express, { NextFunction } from 'express';
import { isformidableError } from '../utils';
import { logger } from './logger';

interface Payload {
  status: string;
  payload?: any;
}

export class ErrorHandler extends Error {
  statusCode: number;
  payload: Payload;
  constructor(statusCode: number, payload: Payload) {
    super();
    this.statusCode = statusCode;
    this.payload = payload;
  }
}
export const handleError = async ({ err, res }: { err: ErrorHandler; res: express.Response }): Promise<void> => {
  const { statusCode, payload } = err;
  logger.error(err);
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    payload,
  });
};

export const formidableErrorHandler = async (
  err: ErrorHandler | Error,
  _req: express.Request,
  res: express.Response,
  next: NextFunction,
): Promise<void> => {
  if (isformidableError(err)) {
    res.status(400).json({
      statusCode: 400,
      payload: { status: 'Invalid JSON' },
    });
  } else {
    next(err);
  }
};

export const centralErrorHandler = async (
  err: ErrorHandler,
  _req: express.Request,
  res: express.Response,
  _next: NextFunction,
): Promise<void> => {
  if (!isformidableError(err)) {
    await handleError({ err, res });
  }
};

import express, { NextFunction } from 'express';
import { logger } from './logger';

interface Payload {
  status: string;
  payload?: object | string;
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

export const centralErrorHandler = async (
  err: ErrorHandler,
  _req: express.Request,
  res: express.Response,
  next: NextFunction,
): Promise<void> => {
  await handleError({ err, res });
};

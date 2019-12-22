import { ErrorHandler, handleError } from '../../helpers/error';
import express, { NextFunction } from 'express';

import { isformidableError } from '../../utils';
export const formidableErrorHandler = async (
  err: ErrorHandler | Error,
  _req: express.Request,
  res: express.Response,
  next: NextFunction,
): Promise<void> => {
  if (isformidableError(err)) {
    res.status(400).json({
      status: 'error',
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

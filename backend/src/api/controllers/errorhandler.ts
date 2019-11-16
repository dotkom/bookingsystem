import { ErrorHandler, handleError } from '../../helpers/error';
import express, { NextFunction } from 'express';

export const formidableErrorHandler = async (
  err: ErrorHandler | Error,
  _req: express.Request,
  res: express.Response,
  next: NextFunction,
) => {
  if (
    err instanceof SyntaxError &&
    String(err.stack).includes('formidable')
  ) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      payload: { status: 'Invalid JSON' },
    });
  } else {
    next();
  }
};

export const centralErrorHandler = async (
  err: ErrorHandler,
  _req: express.Request,
  res: express.Response,
  _next: NextFunction,
): Promise<void> => {
  if (!(err instanceof SyntaxError)) {
    await handleError(err, res);
  }
};

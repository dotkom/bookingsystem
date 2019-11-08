import express from 'express'
export class ErrorHandler extends Error {
  statusCode: number;
  constructor(
    statusCode: number,
    message: string,
  ) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
export const handleError = async (err: ErrorHandler, res: express.Response) => {
  const { statusCode, message } = err;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

import express from 'express';

interface Payload {
  type: string;
  payload?: object;
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
  res.status(statusCode).json({
    statusCode,
    payload,
  });
};

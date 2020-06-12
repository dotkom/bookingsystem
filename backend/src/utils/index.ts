import express from 'express';
import { ErrorHandler } from '../services/error';

export const extractPayload = async (
  req: express.Request,
): Promise<never | Record<string, string | number | boolean>> => {
  const noPayload = req.body === undefined || req.body === null || Object.keys(req.body).length === 0;
  if (!noPayload) {
    return req.body as Record<string, string | number | boolean>;
  } else {
    throw new ErrorHandler(400, { status: 'No Payload' });
  }
};

export * from './interfaces';
export * from './database';
export * from './validators';

import express from 'express';
import { ErrorHandler } from '../services/error';
export const extractPayload = async (
  payload: express.Request,
): Promise<never | Record<string, string | number | boolean>> => {
  try {
    const isPayload = payload.body !== undefined;
    if (isPayload) {
      return payload.body as Record<string, string | number | boolean>;
    } else {
      throw new ErrorHandler(400, { status: 'No Payload' });
    }
  } catch (e) {
    throw new ErrorHandler(400, { status: 'No Payload' });
  }
};
export * from './interfaces';
export * from './database';
export * from './validators';

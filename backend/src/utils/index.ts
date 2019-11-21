import express from 'express';
import { ErrorHandler } from '../helpers/error';
import { Fields } from 'formidable';

export const extractPayload = async (
  payload: express.Request,
): Promise<never | Fields | undefined> => {
  try {
    const isPayload = payload.fields !== undefined;
    if (isPayload) {
      return payload.fields as Fields;
    } else {
      throw new ErrorHandler(400, { status: 'No Payload' });
    }
  } catch (e) {
    throw new ErrorHandler(400, { status: 'No Payload' });
  }
};

export * from './database';
export * from './validators';

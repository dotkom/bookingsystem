import {
  insertSingleRow,
  getRows,
} from '../helpers/databasefunctions';
import express from 'express';
import { QueryResultRow } from 'pg';
import { NextFunction } from 'connect';
import { extractPayload, foundData } from '../utils';
import { Fields } from 'formidable';
import { ErrorHandler } from '../helpers/error';
const app = (module.exports = require('express')());

app.post(
  '/accesstoken',
  async (
    req: express.Request,
    res: express.Response,
    next: NextFunction,
  ): Promise<void | never> => {
    try {
      const values = (await extractPayload(req)) as Fields;
      // if we generate our own accesstokens we should validate them somehow.
      const accesstoken =
        values[0] !== undefined && typeof values[0] === 'string'
          ? (values[0] as string)
          : false;
      if (accesstoken) {
        await insertSingleRow(
          'insert into keys (accesstoken) VALUES ($1) on conflict do nothing',
          [accesstoken],
        );
        const payload: Object = { status: 'success' };
        res.status(200).send(payload);
      } else {
        throw new ErrorHandler(404, { status: 'Validation Error' });
      }
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  '/company/login',
  async (
    req: express.Request,
    res: express.Response,
    next: NextFunction,
  ): Promise<void | never> => {
    try {
      const values = (await extractPayload(req)) as Fields;
      const accesstoken =
        values[0] !== undefined && typeof values[0] === 'string'
          ? (values[0] as string)
          : false;
      if (accesstoken) {
        const query: QueryResultRow = await getRows(
          'select * from keys where accesstoken = $1',
          [accesstoken],
        );
        const tokenExists = await foundData(query);
        if (tokenExists) {
          res.status(200).send(tokenExists);
          return;
        }
        throw new ErrorHandler(404, { status: 'Auth Error' });
      } else {
        //This is if you recieve a payload containing something other than a string.
        throw new ErrorHandler(404, { status: 'Auth Error' });
      }
    } catch (error) {
      next(error);
    }
  },
);

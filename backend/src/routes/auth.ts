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
  ) => {
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
        throw new ErrorHandler(500, 'No valid acesstoken received');
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
  ) => {
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
        }
        throw new ErrorHandler(
          500,
          'Failed to login, found no matching accesstokens',
        );
      } else {
        throw new ErrorHandler(500, 'No valid acesstoken received');
      }
    } catch (error) {
      next(error);
    }
  },
);

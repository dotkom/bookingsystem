import {
  insertSingleRow,
  getRows,
} from '../helpers/databasefunctions';
import express from 'express';
import { QueryResultRow } from 'pg';
import { NextFunction } from 'connect';
import { extractPayload } from '../utils';
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
      const accesstoken =
        values[0] !== undefined ? (values[0] as string) : false;
      // Should split the part where we add the accesstoken to the database into it's own function.
      if (accesstoken) {
        await insertSingleRow(
          'insert into keys (accesstoken) VALUES ($1) on conflict do nothing',
          [accesstoken],
        );
        const payload: Object = { status: 'success' };
        res.status(200).send(payload);
      }
      throw new ErrorHandler(500, 'No acesstoken retrived');
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
      const query: QueryResultRow = await getRows(
        'select * from keys where accesstoken = $1',
        [values[0] as string],
      );
      const foundData: boolean =
        query.rows[0] && query.rows.length !== 0 ? true : false;
      res.status(200).send(foundData);
    } catch (error) {
      next(error);
    }
  },
);

import { insertSingleRow, getRows } from '../databasefunctions';
import express from 'express'
import { QueryResultRow } from 'pg';
import { NextFunction } from 'connect';
import { Fields } from 'formidable';
import { ErrorHandler } from '../helpers/error';

const app = (module.exports = require('express')());

app.post('/accesstoken', async (req: express.Request, res: express.Response, next: NextFunction) => {
  try {
    //might consider cohersing types, but that will not catch errors when no value is sent.
    const values = req.fields;
    const accesstoken = values !== undefined && values[0] !== undefined ? values[0] : false
    if (accesstoken) {
      await insertSingleRow(
        'insert into keys (accesstoken) VALUES ($1) on conflict do nothing',
        [accesstoken as string],
      );
      res.status(200).send({ status: 'success' });
    }
    throw new ErrorHandler(500, 'Did not recieve accesstoken')

  } catch (error) {
    next(error);
  }
});

app.post('/company/login', async (req: express.Request, res: express.Response, next: NextFunction) => {
  try {
    const values: Fields = req.fields;
    const query: QueryResultRow = await getRows(
      'select * from keys where accesstoken = $1',
      [values[0] as string],
    );
    const data: boolean =
      query.rows[0] && query.rows.length !== 0 ? true : false;
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

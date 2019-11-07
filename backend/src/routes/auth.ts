import { insertSingleRow, getRows } from '../databasefunctions';

import { QueryResultRow } from 'pg';
const app = (module.exports = require('express')());

app.post('/accesstoken', async (req, res, next) => {
  try {
    const values = req.fields;
    await insertSingleRow(
      'insert into keys (accesstoken) VALUES ($1) on conflict do nothing',
      [values[0] as string],
    );
    res.status(200).send({ status: 'success' });
  } catch (error) {
    next(error);
  }
});

app.post('/company/login', async (req, res, next) => {
  try {
    const values = req.fields;
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

import { insertSingleRow, getRows } from './databasefunctions';
import express = require('express');
import { QueryResultRow } from 'pg';
import cors from 'cors';
import formidableMiddleware = require('express-formidable');
import { handleError, ErrorHandler } from './helpers/error';

// Create a new express application instance
const app: express.Application = express();
app.use(formidableMiddleware());
app.use('*', cors());

app.post('/accesstoken', (req, res, next) => {
  try {
    const values = req.fields; // This is a string[]
    insertSingleRow(
      'insert into keys (accesstoken) VALUES ($1) on conflict do nothing',
      [values[0] as string],
    );
    res.status(200).send({ status: 'success' });
  } catch (error) {
    next(error);
  }
});

app.post('/company/login', async (req, res) => {
  const values = req.fields;
  const query: QueryResultRow = await getRows(
    'select * from keys where accesstoken = $1',
    [values[0] as string],
  );
  const data: boolean =
    query.rows[0] && query.rows.length !== 0 ? true : false;
  res.status(200).send(data);
});

app.get('/error', (req, res) => {
  throw new ErrorHandler(500, 'Internal server error');
});

app.use((err, req, res, next) => {
  handleError(err, res);
});
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

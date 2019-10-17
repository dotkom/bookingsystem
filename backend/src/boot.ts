import { insertSingleRow, getRows } from './databasefunctions';
import express = require('express');
import { QueryResultRow } from 'pg';
import cors from 'cors';
import formidable from 'express-formidable';

// Create a new express application instance
const app: express.Application = express();
app.use(formidable());
app.use('*', cors());

app.post('/accesstoken/new', (req, res) => {
    const values = req.fields; // This is a string[]
    insertSingleRow('insert into keys (accesstoken) VALUES ($1) on conflict do nothing', [values[0] as string]);
    res.status(200).send({ status: 'success' });
});

app.post('/company/login', async (req, res) => {
    const values = req.fields;
    const query: QueryResultRow = await getRows('select * from keys where accesstoken = $1', [values[0] as string]);
    const data: boolean = query.rows[0] && query.rows.length !== 0 ? true : false;
    res.status(200).send(data);
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});

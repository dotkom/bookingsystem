import express from 'express';
import cors from 'cors';
import formidableMiddleware from 'express-formidable';
import { handleError } from './helpers/error';
const routes = require('./routes');
const app: express.Application = express();

app.use(formidableMiddleware());
app.use('*', cors());
app.use(routes);
app.use(async (err, req, res, next) => {
  await handleError(err, res);
});
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

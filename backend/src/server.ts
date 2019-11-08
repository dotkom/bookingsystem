import express from 'express';
import cors from 'cors';
import formidableMiddleware from 'express-formidable';
import { handleError, ErrorHandler } from './helpers/error';
const routes = require('./routes');
const app: express.Application = express();

const whitelist = ['http://localhost:8080'];
const corsOptions: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: whitelist,
  preflightContinue: false,
};

app.use(formidableMiddleware());
app.use('*', cors(corsOptions));
app.use(routes);
app.use(
  async (
    err: ErrorHandler,
    _req: express.Request,
    res: express.Response,
  ): Promise<void> => {
    await handleError(err, res);
  },
);
app.listen(3000, (): void => {
  console.log(
    `Example app listening on port ${process.env.RUNPORT}!`,
  );
});

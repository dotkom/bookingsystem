import express from 'express';
import cors from 'cors';
import formidableMiddleware from 'express-formidable';
import { ErrorHandler } from '../helpers/error';
import {
  formidableErrorHandler,
  centralErrorHandler,
} from './controllers';

const routes = require('./routes');
const app: express.Application = express();

const whitelist = ['http://localhost:8080'];

const corsOptions: object = {
  origin: (origin: string, callback: Function): void | never => {
    //allows things without origin to connect to the API (CORS,mobile, ++)
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      return callback(
        new ErrorHandler(400, { status: 'Origin Denied' }),
        false,
      );
    }
    return callback(null, true);
  },
};

app.use(formidableMiddleware());
app.use('*', cors(corsOptions));
app.use(routes);

app.use(formidableErrorHandler);
app.use(centralErrorHandler);

app.listen(3000, (): void => {
  console.log(`Example app listening on port 3000!`);
});

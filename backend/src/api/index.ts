const routes = require('./routes');
const app: express.Application = express();
import { corsOptions } from './config';
import express from 'express';
import cors from 'cors';
import formidableMiddleware from 'express-formidable';
import {
  formidableErrorHandler,
  centralErrorHandler,
} from './controllers';

app.use(formidableMiddleware());
app.use('*', cors(corsOptions));
app.use(routes);

app.use(formidableErrorHandler);
app.use(centralErrorHandler);

app.listen(3000, (): void => {
  console.log(`Example app listening on port 3000!`);
});

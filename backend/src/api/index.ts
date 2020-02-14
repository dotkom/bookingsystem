import { corsOptions } from './config';
import express from 'express';
import cors from 'cors';
import formidableMiddleware from 'express-formidable';
import {
  formidableErrorHandler,
  centralErrorHandler,
} from './controllers';
import routes from './routes';

const app: express.Application = express();

app.use(formidableMiddleware());
app.use('*', cors(corsOptions));
app.use(routes);

app.use(formidableErrorHandler);
app.use(centralErrorHandler);

const server = app.listen(3000, (): void => {
  console.log(`Example app listening on port 3000!`);
});

export default { app, server };

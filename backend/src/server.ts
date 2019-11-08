import express from 'express';
import cors from 'cors';
import formidableMiddleware from 'express-formidable';
import { handleError, ErrorHandler } from './helpers/error';
const routes = require('./routes');
const app: express.Application = express();


const whitelist = ['http://example1.com', 'http://example2.com']
const corsOptions = {
  origin: (origin: string, callback: Function) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new ErrorHandler(500, 'Not allowed by CORS'))
    }
  }
}


app.use(formidableMiddleware());
app.use('*', cors());
app.use(routes);
app.use(async (err: ErrorHandler, req: express.Request, res: express.Response): Promise<void> => {

  await handleError(err, res);
});
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

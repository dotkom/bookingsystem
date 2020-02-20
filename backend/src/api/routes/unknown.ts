import { ErrorHandler } from '../../helpers/error';

import express from 'express';
const app: express.Application = express();
app.all(
  '/*',
  async (_req: express.Request, _res: express.Response, next: express.NextFunction): Promise<void> => {
    next(new ErrorHandler(404, { type: 'Route Not Found' }));
  },
);

export default app;

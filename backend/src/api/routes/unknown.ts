const app = (module.exports = require('express')());
import { ErrorHandler } from '../../helpers/error';
import express from 'express';

app.all(
  '/*',
  async (
    _req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ): Promise<void> => {
    next(new ErrorHandler(404, { status: 'Route Not Found' }));
  },
);

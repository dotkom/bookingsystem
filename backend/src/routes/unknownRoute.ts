const app = (module.exports = require('express')());
import { ErrorHandler } from '../helpers/error';
import express from 'express';

app.all(
  '/*',
  (
    _req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    next(new ErrorHandler(500, 'Unknown Route'));
  },
);

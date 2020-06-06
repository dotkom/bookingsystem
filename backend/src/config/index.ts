import { ErrorHandler } from '../services/error';

const whitelist = [
  'http://localhost:8080',
  'http://localhost:80',
  'http://localhost:80/api',
  'http://localhost',
  'http://localhost/api',
];

export const corsOptions: object = {
  origin: (origin: string, callback: Function): void => {
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      return callback(new ErrorHandler(400, { status: 'Origin Denied' }), false);
    }
    return callback(null, true);
  },
};

export * from './env';

import dotenv from 'dotenv';
import { ErrorHandler } from '../services/error';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config({
  path: __dirname + '/.env',
});
if (!envFound) {
  throw new ErrorHandler(500, {
    status: "⚠️  Couldn't find .env file  ⚠️",
  });
}

export const envConfig = {
  DBUSER: process.env.DBUSER,
  DBPASSWORD: process.env.DBPASSWORD,
  DBHOST: process.env.DBHOST,
  DBPORT: process.env.DBPORT,
  DATABASENAME: process.env.DATABASENAME,
  SENDER: undefined,
  EMAILSERVICECLIENT: undefined,
  EMAILPRIVATEKEY: undefined,
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
};

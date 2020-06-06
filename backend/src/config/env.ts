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
  AUTH_ENDPOINT: process.env.AUTH_ENDPOINT || 'https://online.ntnu.no/openid',
  AUTH_SCOPE: process.env.AUTH_SCOPE || 'openid profile onlineweb4',
  AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET || '__REPLACE_ME__',
  AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID || '__REPLACE_ME__',
  AUTH_REDIRECT_URL: process.env.AUTH_REDIRECT_URL || 'http://localhost:3000',
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
};

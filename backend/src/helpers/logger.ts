import fs from 'fs';
import { createLogger, format, transports } from 'winston';
const { printf } = format;

const standardFormat = printf(
  ({ level, message, service, timestamp }) => {
    return `${timestamp} ${service} ${level}: ${message}`;
  },
);

const errorFormat = printf(
  ({ statusCode, service, timestamp, stack, payload }) => {
    return `${timestamp} Service: ${service} Status: ${statusCode} Message:${JSON.stringify(
      payload,
    )} | ${stack}`;
  },
);

const ignorePrivate = format((info, _opts) => {
  if (info.private) {
    return false;
  }
  return info;
});

const dir = './logs';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    ignorePrivate(),
    format.errors({ stack: true }),
  ),
  defaultMeta: { service: 'bookingsystem' },
  transports: [
    new transports.File({
      filename: dir + '/error.log',
      level: 'error',
      format: errorFormat,
    }),
    new transports.File({
      filename: dir + '/debug.log',
      level: 'debug',
      format: standardFormat,
    }),
    new transports.File({
      filename: dir + '/info.log',
      level: 'info',
      format: standardFormat,
    }),
    new transports.File({
      filename: dir + '/warn.log',
      level: 'warn',
      format: standardFormat,
    }),
  ],
});

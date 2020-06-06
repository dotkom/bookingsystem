import { corsOptions } from '../config';
import express from 'express';
import cors from 'cors';
import { centralErrorHandler } from '../services/error';
import routes from './routes';
import passport from 'passport';
import { configurePassport } from '../services/authenticator';
import session from 'express-session';

const sessionMiddleware = session({
  name: 'sess',
  secret: 'SESSION_SECRET',
  cookie: {
    maxAge: 60 * 60 * 8, // 8 hours,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  },
  resave: false,
  saveUninitialized: true,
});

const app: express.Application = express();
const setup = async (): Promise<void> => {
  await configurePassport();
  app.use(express.json());
  app.use(sessionMiddleware);
  app.use('*', cors(corsOptions));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(routes);
  app.use(centralErrorHandler);
  return;
};
(async (): Promise<void> => {
  await setup();
  if (!module.parent) {
    app.listen(3000);
    console.log('listening on port 3000 ');
  }
})();

export default app;

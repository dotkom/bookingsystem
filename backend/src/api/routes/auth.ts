import express, { NextFunction } from 'express';
import passport from 'passport';
import { ErrorHandler } from '../../services/error';
import { logger } from '../../services/logger';
import { getAdminPoolClient, executeQuery } from '../../services/databasefunctions';
import { OWUser } from '../../utils';
const app: express.Application = express();

app.get('/ow/login', (req: express.Request, res: express.Response, next: NextFunction) => {
  const returnToPath = req.query.returnToPath || '/';
  if (req.session) {
    req.session.returnTo = returnToPath;
    passport.authenticate('oidc')(req, res, next);
  } else {
    next(new ErrorHandler(500, { status: 'Sessions not activate on server' }));
  }
});

app.get('/callback', async (req, res, next) => {
  return passport.authenticate(
    'oidc',
    async (error, user, info): Promise<void> => {
      try {
        if (error) {
          logger.error('Unknown Error', error);
          throw new Error();
        } else if (info && info.message !== undefined) {
          logger.info('Unknown info attached to authenticator', info.message);
          throw new Error();
        } else {
          req.logIn(user as OWUser, async err => {
            if (err) {
              logger.error('Unknown Error', err);
              throw new Error();
            }
            try {
              await executeQuery('INSERT INTO onlineuser(OID) VALUES ($1);', await getAdminPoolClient(), true, [
                parseInt(user.id),
              ]);
            } catch (e) {
              if (
                e &&
                e.payload &&
                e.payload.payload &&
                e.payload.payload.message &&
                e.payload.payload.constraint === 'onlineuser_pkey'
              ) {
                res.redirect('/');
              } else {
                res.redirect('/failure');
              }
            }
            return;
          });
        }
      } catch (e) {
        res.redirect('/failure');
      }
      return;
    },
  )(req, res, next);
});

app.post('/local/login', (req: express.Request, res: express.Response, next: NextFunction): void => {
  passport.authenticate(
    'local',
    async (error, user, info): Promise<void> => {
      const failedLogin = 'invalid username or password';
      try {
        if (error) {
          const err = new ErrorHandler(500, { status: 'Unknown Passport Error', payload: error });
          next(err);
        } else if (info) {
          if (info.message == failedLogin) {
            const err = new ErrorHandler(400, { status: 'Email or password not existing or incorrect' });
            next(err);
          } else {
            logger.info('Unknown info attached to authenticator', info.message);
            const err = new ErrorHandler(500, { status: 'Unknown Passport Error' });
            next(err);
          }
        } else {
          req.logIn(user, err => {
            if (err) {
              const err = new ErrorHandler(500, { status: 'Error setting loginvalue to Session' });
              return next(err);
            }
            logger.info('Logged in user', user.username);
            res.status(200).send('success');
          });
        }
      } catch (e) {
        next(e);
      }
    },
  )(req, res, next);
});

export default app;

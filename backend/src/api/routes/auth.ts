import express, { NextFunction } from 'express';
import passport from 'passport';
import { ErrorHandler } from '../../services/error';
import { logger } from '../../services/logger';
import { isLocalAuthenticated } from '../../utils';
const app: express.Application = express();

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

app.get('/local/user', async (req, res) => {
  res.send(req.user);
});
app.get('/local/test', isLocalAuthenticated, (req, res) => {
  res.send('sucess');
});

export default app;

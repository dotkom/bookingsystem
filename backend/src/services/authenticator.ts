import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

/* eslint-disable  @typescript-eslint/camelcase */

import { Query, foundData } from '../utils';
import bcrypt from 'bcrypt';
import { getAdminPoolClient, executeQuery } from './databasefunctions';
import { QueryResultRow } from 'pg';
import { localRole } from '../utils/constants';
import { logger } from './logger';
import { Strategy } from 'passport-local';

const authenticateLocalUser = async (username: string, password: string, done: Function): Promise<void> => {
  try {
    logger.debug('Authenticating Local User');
    const query: Query = {
      sqlStatement: 'SELECT username ,passhash from companyuser where username = $1',
      data: [username],
    };
    const dbRows = (await executeQuery(
      query.sqlStatement,
      await getAdminPoolClient(),
      false,
      query.data,
    )) as QueryResultRow;
    if (foundData(dbRows)) {
      const user = dbRows.rows[0];
      if (user === null || user === undefined) {
        throw new Error();
      } else {
        if (await bcrypt.compare(password, user.passhash)) {
          const userWithRole = { ...user, role: localRole };
          logger.debug('User Logged In', user.username);
          done(null, userWithRole);
        } else {
          throw new Error();
        }
      }
    }
  } catch (e) {
    done(null, false, { message: 'invalid username or password' });
  }
};
const getLocalStrategy = async (): Promise<Strategy> => {
  return new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticateLocalUser);
};

export const configurePassport = async (): Promise<void> => {
  const localStrategy = await getLocalStrategy();
  passport.use(localStrategy);
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};

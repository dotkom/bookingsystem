import passport, { Strategy } from 'passport';
const LocalStrategy = require('passport-local').Strategy;
import {
  Issuer,
  Strategy as OIDCStrategy,
  StrategyOptions,
  AuthorizationParameters,
  StrategyVerifyCallbackUserInfo,
  UserinfoResponse,
  TokenSet,
  Client,
} from 'openid-client';

/* eslint-disable  @typescript-eslint/camelcase */

import { envConfig } from '../config';
import { Query, foundData, OWUser, User } from '../utils';
const { AUTH_ENDPOINT, AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_REDIRECT_URL, AUTH_SCOPE } = envConfig;
import bcrypt from 'bcrypt';
import { getAdminPoolClient, executeQuery } from './databasefunctions';
import { QueryResultRow } from 'pg';
import { localRole, OWRole } from '../utils/constants';
import { logger } from './logger';

const OIDC_CLIENT_NAME = 'oidc';

export const parseOidcUserData = async (userData: UserinfoResponse, tokenData: TokenSet): Promise<OWUser> => {
  return {
    id: userData.sub,
    name: userData.name as string,
    role: OWRole,
    token: {
      accessToken: tokenData.access_token || '',
      expiresAt: tokenData.expires_at || Date.now(),
    },
  };
};

type StrategyVerification<TUser> = StrategyVerifyCallbackUserInfo<TUser>;
const getIssuer = async (): Promise<Issuer<Client>> => {
  return Issuer.discover(AUTH_ENDPOINT);
};
const getClient = async (): Promise<Client> => {
  const issuer = await getIssuer();
  return new issuer.Client({
    client_id: AUTH_CLIENT_ID,
    client_secret: AUTH_CLIENT_SECRET,
  });
};

const getOWStrategy = async (): Promise<OIDCStrategy<OWUser, Client>> => {
  const client = await getClient();
  const params: AuthorizationParameters = {
    redirect_uri: AUTH_REDIRECT_URL,
    scope: AUTH_SCOPE,
  };
  const config: StrategyOptions<typeof client> = { client, params, passReqToCallback: false, usePKCE: false };
  const verify: StrategyVerification<OWUser> = async (tokenData, userInfo, done) => {
    const user = await parseOidcUserData(userInfo, tokenData);
    return done(null, user);
  };
  return new OIDCStrategy(config, verify);
};

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

const serializeUser = (user: User, done: Function): void => {
  done(null, user);
};
const deserializeUser = (user: User, done: Function): void => {
  done(null, user);
};

export const configurePassport = async (): Promise<void> => {
  const localStrategy = await getLocalStrategy();
  passport.use(localStrategy);
  const OIDCstrategy = await getOWStrategy();
  passport.use(OIDC_CLIENT_NAME, OIDCstrategy);
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
};

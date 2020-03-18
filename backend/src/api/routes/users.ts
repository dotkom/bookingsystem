import express, { NextFunction } from 'express';
import { extractPayload, Company, Query, CompanyUser, instanceOfCompany, instanceOfCompanyUser } from '../../utils';
import { Fields } from 'formidable';
import { genereateAdminConnection, getPoolClient, executeTransaction } from '../../services/databasefunctions';
import { logger } from '../../services/logger';
import { PoolClient, Pool } from 'pg';
const app: express.Application = express();

const newCompany = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void | never> => {
  try {
    const values = ((await extractPayload(req)) as Fields) as unknown;
    if (instanceOfCompany(values)) {
      const { email, orgnum, username, salt, passhash, name }: Company = values;
      logger.info(`Creating new company ${username}`);
      const pool: Pool = await genereateAdminConnection();
      const poolClient: PoolClient = await getPoolClient(pool);
      logger.info(`Tested Connection to db ${username}`);
      const actions: Array<Query> = [
        {
          sqlStatement: 'INSERT INTO company(email,orgnum,username,salt,passhash,name) VALUES ($1,$2,$3,$4,$5,$6);',
          data: [email, String(orgnum), username, salt, passhash, name],
        },
        {
          sqlStatement: 'CREATE ROLE %I LOGIN INHERIT;',
          data: [username],
        },
        {
          sqlStatement: 'GRANT companies to %I;',
          data: [username],
        },
      ];
      await executeTransaction(actions, poolClient);
      res.send({ status: 'success' });
    }
  } catch (error) {
    next(error);
  }
};

const newCompanyUser = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction,
): Promise<void | never> => {
  try {
    const values = ((await extractPayload(req)) as Fields) as unknown;
    if (instanceOfCompanyUser(values)) {
      const { email, username, salt, passhash, givenname, surename, company }: CompanyUser = values;
      logger.info(`Creating new companyuser ${username}`);
      const pool: Pool = await genereateAdminConnection();
      const poolClient: PoolClient = await getPoolClient(pool);
      logger.info(`Tested Connection to db ${username}`);
      const actions: Array<Query> = [
        {
          sqlStatement:
            'INSERT INTO companyuser(email, username, salt, passhash, givenname, surename,CID) VALUES ($1,$2,$3,$4,$5,$6, (SELECT CID FROM company where username = $7));',
          data: [email, username, salt, passhash, givenname, surename, company],
        },
        {
          sqlStatement: 'CREATE ROLE %I LOGIN INHERIT;',
          data: [username],
        },
        {
          sqlStatement: 'GRANT companyUsers to %I;',
          data: [username],
        },
      ];
      await executeTransaction(actions, poolClient);
      res.send({ status: 'success' });
    }
  } catch (error) {
    next(error);
  }
};

app.post('/new/companyuser', async (req, res, next) => {
  await newCompanyUser(req, res, next);
});

app.post('/new/company', async (req, res, next) => {
  await newCompany(req, res, next);
});

export default app;

import express, { NextFunction } from 'express';
import { extractPayload, Company, Query, instanceOfCompany } from '../../utils';
import { Fields } from 'formidable';
import { genereateAdminConnection, getPoolClient, executeTransaction } from '../../services/databasefunctions';
import { logger } from '../../services/logger';
import { PoolClient, Pool } from 'pg';
import { ErrorHandler } from '../../services/error';
const app: express.Application = express();

const newCompany = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void | never> => {
  try {
    const values = ((await extractPayload(req)) as Fields) as unknown;
    if (instanceOfCompany(values)) {
      const data: Company = values;
      const { email, orgnum, username, salt, passhash, name } = data;
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

app.post('/new/company', async (req, res, next) => {
  await newCompany(req, res, next);
});

export default app;

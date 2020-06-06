import express, { NextFunction } from 'express';
import {
  extractPayload,
  Company,
  Query,
  instanceOfCompany,
  instanceOfCompanyUser,
  ComapnyRepresentative,
} from '../../utils';
import { executeTransaction, getAdminPoolClient, executeQuery } from '../../services/databasefunctions';
import { logger } from '../../services/logger';
import bcrypt from 'bcrypt';
const app: express.Application = express();

const newCompany = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void | never> => {
  try {
    const payload = (await extractPayload(req)) as Record<string, string | number | boolean>;
    if (instanceOfCompany(payload)) {
      const { email, orgnum, name }: Company = payload;
      logger.info(`Creating new company ${name}`);
      const actions: Query = {
        sqlStatement: 'INSERT INTO company(email,orgnum,name) VALUES ($1,$2,$3);',
        data: [email, String(orgnum), name],
      };
      await executeQuery(actions.sqlStatement, await getAdminPoolClient(), true, actions.data);
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
    const values = (await extractPayload(req)) as Record<string, string | number | boolean>;
    if (instanceOfCompanyUser(values)) {
      const { email, username, password, givenname, surename, company }: ComapnyRepresentative = values;
      const telephone = values.telephone ? values.telephone : null;
      const passhash = await bcrypt.hash(password, 10);
      logger.info(`Creating new companyuser ${username}`);
      const actions: Array<Query> = [
        {
          sqlStatement:
            'INSERT INTO companyuser(email, username, passhash, givenname, surename, telephone ,CID) VALUES ($1,$2,$3,$4,$5,$6,(SELECT CID FROM company where name = $7));',
          data: [email, username, passhash, givenname, surename, telephone, company],
        },
        {
          sqlStatement: "CREATE ROLE %I WITH LOGIN  ENCRYPTED PASSWORD '%I' INHERIT;",
          data: [username, password],
        },
        {
          sqlStatement: 'GRANT companyUsers to %I;',
          data: [username],
        },
      ];
      await executeTransaction(actions, await getAdminPoolClient(), true);
      res.send({ status: 'success' });
    }
  } catch (error) {
    next(error);
  }
};

app.post('/companyuser', async (req, res, next) => {
  await newCompanyUser(req, res, next);
});

app.post('/company', async (req, res, next) => {
  await newCompany(req, res, next);
});

export default app;

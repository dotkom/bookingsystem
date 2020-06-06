import Ajv from 'ajv';
import { Company, ComapnyRepresentative, User } from './interfaces';
import { company, companyUser } from './schemas';
import { ErrorHandler } from '../services/error';
import { NextFunction } from 'express';
import { OWRole, localRole } from './constants';

const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}

export const validEmail = (email: string): boolean => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

export const validateSQLStatement = async (sqlKeyword: string, sqlStatement: string): Promise<never | void> => {
  const isValidSqlStatement = sqlStatement.toLowerCase().includes(sqlKeyword);
  if (!isValidSqlStatement) {
    throw new ErrorHandler(400, { status: 'Invalid SQL statment' });
  }
};

const testAJV = (data: object, func: Ajv.ValidateFunction): boolean | never => {
  const valid = func(data);
  if (valid) return true;
  else throw new ErrorHandler(400, { status: 'Failed validation', payload: ajv.errorsText(func.errors) });
};

const instanceOfX = (object: object, schema: boolean | object): boolean | never => {
  const validX = ajv.compile(schema);
  const isValidX = testAJV(object, validX);
  return isValidX;
};

export const instanceOfCompany = (object: object): object is Company | never => {
  return instanceOfX(object, company);
};

export const instanceOfCompanyUser = (object: object): object is ComapnyRepresentative | never => {
  return instanceOfX(object, companyUser);
};

export const isLocalAuthenticated = async (
  req: Express.Request,
  res: Express.Response,
  next: NextFunction,
): Promise<never | void> => {
  try {
    if (req.user) {
      const user = req.user as User;
      if (user.role == localRole) {
        next();
      } else {
        throw new ErrorHandler(400, { status: 'User not correct role' });
      }
    } else {
      throw new ErrorHandler(400, { status: 'User not logged into service' });
    }
  } catch (e) {
    next(e);
  }
};

export const isOWAuthenticated = async (
  req: Express.Request,
  res: Express.Response,
  next: NextFunction,
): Promise<never | void> => {
  try {
    if (req.user) {
      const user = req.user as User;
      if (user.role == OWRole) {
        next();
      } else {
        throw new ErrorHandler(400, { status: 'User not correct role' });
      }
    } else {
      throw new ErrorHandler(400, { status: 'User not logged into service' });
    }
  } catch (e) {
    next(e);
  }
};

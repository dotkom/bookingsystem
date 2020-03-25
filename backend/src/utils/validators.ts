import Ajv from 'ajv';
import { Company, CompanyUser } from './interfaces';
import { company, companyUser } from './schemas';
import { ErrorHandler } from '../services/error';

const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}

export const isformidableError = (err: Error) => {
  return err instanceof SyntaxError && String(err.stack).includes('formidable');
};

export const validEmail = (email: string) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

export const validateSQLStatement = async (sqlKeyword: string, sqlStatement: string): Promise<never | void> => {
  const isValidSqlStatement = sqlStatement.toLowerCase().includes(sqlKeyword);
  if (!isValidSqlStatement) {
    throw new ErrorHandler(400, { status: 'Invalid SQL statment' });
  }
};

const testAJV = (data: any, func: any): boolean | never => {
  const valid = func(data);
  if (valid) return true;
  else throw new ErrorHandler(400, { status: 'Failed validation', payload: ajv.errorsText(func.errors) });
};

const instanceOfX = (object: any, schema: any): boolean | never => {
  const validX = ajv.compile(schema);
  const isValidX = testAJV(object, validX);
  return isValidX;
};

export const instanceOfCompany = (object: any): object is Company | never => {
  return instanceOfX(object, company);
};

export const instanceOfCompanyUser = (object: any): object is CompanyUser | never => {
  return instanceOfX(object, companyUser);
};

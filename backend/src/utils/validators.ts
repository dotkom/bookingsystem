import { Company } from './interfaces';
import Ajv from 'ajv';
import companySchema from './schemas/company.json';
import { ErrorHandler } from '../services/error';

const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}

export const isformidableError = (err: Error) => {
  return err instanceof SyntaxError && String(err.stack).includes('formidable');
};

export const validEmail = (email: string) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

export const instanceOfCompany = (object: any): object is Company | never => {
  const validateCompany = ajv.compile(companySchema);
  const isValidCompany = testAJV(object, validateCompany);
  return isValidCompany;
};

const testAJV = (data: any, func: any): boolean | never => {
  const valid = func(data);
  if (valid) return true;
  else throw new ErrorHandler(400, { status: 'Failed validation', payload: ajv.errorsText(func.errors) });
};

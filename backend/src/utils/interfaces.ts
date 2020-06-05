export interface Company extends Object {
  email: string;
  orgnum: bigint;
  name: string;
}

export interface LoggedInComapnyRepresentative {
  username: string;
  passhash: string;
  role: string;
}

export interface CompanyUser extends Object {
  email: string;
  telephone?: string;
  username: string;
  password: string;
  givenname: string;
  surename: string;
  company: string;
}

export interface Query extends Object {
  sqlStatement: string;
  data: Array<string | null>;
}

export type User = CompanyUser | Company;

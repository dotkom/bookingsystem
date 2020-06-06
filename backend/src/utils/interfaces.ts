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

export interface OWUser extends Object {
  id: string;
  name: string;
  role: string;
  token: {
    accessToken: string;
    expiresAt: number;
  };
}

export interface LoggedInUser {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  nickname: string;
  image: string;
  // email: string;
  isStaff: boolean;
  isLoggedIn: true;
  token: {
    accessToken: string;
    expiresAt: number;
  };
}

export interface ComapnyRepresentative extends Object {
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
  data: Array<string | null | number>;
}

export type User = LoggedInComapnyRepresentative | OWUser;

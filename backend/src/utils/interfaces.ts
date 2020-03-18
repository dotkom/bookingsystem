//TODO find a way to enforce regex format for email inside an interface.
export interface Company extends Object {
  email: string;
  orgnum: bigint;
  username: string;
  salt: string;
  passhash: string;
  name: string;
}

export interface Query extends Object {
  sqlStatement: string;
  data: string[];
}
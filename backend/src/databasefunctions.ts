import { PoolConfig, ClientConfig } from "pg";

const { Pool } = require("pg");
require("dotenv").config();

const pgconfig: PoolConfig = {
  user: process.env.DBUSER,
  database: process.env.DATABASENAME,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: parseInt(process.env.DBPORT)
};

const pool = new Pool(pgconfig);

pool.on("error", (err: Error, client: ClientConfig) => {
  console.error(err, client);
});
export const createTable = async (sqlStatement: string) => {
  if (sqlStatement && !sqlStatement.toLowerCase().includes("create table")) {
    throw new Error("wrong type of SQL statement");
  }
  let client;
  try {
    client = await pool.connect();
    const res = await client.query(sqlStatement);
    return res;
  } finally {
    try {
      client.release();
    } catch (err) {
      console.error(err);
    }
  }
};

export const insertSingleRow = async (sqlStatement: string, data: string[]) => {
  if (!sqlStatement.toLowerCase().includes("insert into")) {
    throw new Error("wrong type of SQL statement");
  }
  let client;
  try {
    client = await pool.connect();
    const res = await client.query(sqlStatement, data);
    return res;
  } finally {
    try {
      client.release();
    } catch (err) {
      console.error(err);
    }
  }
};

export const getRows = async (sqlStatement: string, data: string[] = []) => {
  if (!sqlStatement.toLowerCase().includes("select")) {
    throw new Error("wrong type of SQL statement");
  }
  let client;
  try {
    client = await pool.connect();
    const res = await client.query(sqlStatement, data);
    return res;
  } finally {
    try {
      client.release();
    } catch (err) {
      console.error(err);
    }
  }
};

import * as pg from "pg"
require("dotenv").config()



const pgconfig: pg.PoolConfig = {
  user: process.env.DBUSER,
  database: process.env.DATABASENAME,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: parseInt(process.env.DBPORT)
}

const pool = new pg.Pool(pgconfig)


pool.on("error", (err: Error,client: pg.PoolClient) => {
  console.error(err,client)
})


export const createTable = async (sqlStatement: string) => {
  if (!sqlStatement.toLowerCase().includes("create table")) {
    throw new Error("wrong type of SQL statement")
  }
  const client = await pool.connect()
  try {
    const res = await client.query(sqlStatement)
    return res
  } finally {
    try {
      client.release()
    } catch (err) {
      console.error(err)
    }
  }
}

export const insertSingleRow = async (sqlStatement: string,data: string[]) => {
  if (!sqlStatement.toLowerCase().includes("insert into")) {
    throw new Error("wrong type of SQL statement")
  }
  const client = await pool.connect()
  try {
    const res = await client.query(sqlStatement,data)
    return res
  } finally {
    try {
      client.release()
    } catch (err) {
      console.error(err)
    }
  }
}

export const getRows = async (sqlStatement: string,data: string[] = []) => {
  if (!sqlStatement.toLowerCase().includes("select")) {
    throw new Error("wrong type of SQL statement")
  }
  const client = await pool.connect()
  try {
    const res = await client.query(sqlStatement,data)
    return res
  } finally {
    try {
      client.release()
    } catch (err) {
      console.error(err)
    }
  }
}
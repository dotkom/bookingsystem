import * as pg from 'pg';
require('dotenv').config();



const pgconfig = {
  user: process.env.DBUSER,
  database: process.env.DATABASENAME,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: process.env.DBPORT
}

const pool = new pg.Pool(pgconfig);


pool.on('error', function (err:Error, client:pg.Client) {
    console.error(err)
});

  
export const createTable = async (sqlStatement) => {
    if (!sqlStatement.toLowerCase().includes('create table')) {
        throw new Error('wrong type of SQL statement')
    }
    const client = await pool.connect();
    try {
      const res = await client.query(sqlStatement);
      return res;
    } finally {
      try {
        await client.end();
      } catch (err) {
        console.error(err)
      }
    }
  };



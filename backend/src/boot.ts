import {createTable} from './databasefunctions'
import express = require('express');


// lib/app.ts


// Create a new express application instance
const app: express.Application = express();

app.get('/', (req, res) => {
  console.log('lol')
  createTable('CREATE TABLE if not exists account(user_id serial PRIMARY KEY,username VARCHAR (50) UNIQUE NOT NULL,password VARCHAR (50) NOT NULL,email VARCHAR (355) UNIQUE NOT NULL,created_on TIMESTAMP NOT NULL,last_login TIMESTAMP);')
  res.status(400).send(null)
});

app.listen(3000, () =>  {
  console.log('Example app listening on port 3000!');
});
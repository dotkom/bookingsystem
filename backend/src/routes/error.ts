import { createTable } from '../databasefunctions';
const app = (module.exports = require('express')());

app.get('/', async (req, res, next) => {
  try {
    await createTable('create table');
  } catch (err) {
    next(err);
  }
});

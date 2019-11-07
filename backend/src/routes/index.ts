const app = (module.exports = require('express')());

app.use('/auth', require('./auth'));

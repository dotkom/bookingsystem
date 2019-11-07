const app = (module.exports = require('express')());

app.use('/auth', require('./auth'));
app.use('/error', require('./error'));

const app = (module.exports = require('express')());

app.use('/auth', require('./auth'));

//must be the last, it's the catch all for unknown routes
app.use('/', require('./unknownRoute'));

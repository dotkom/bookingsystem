import express from 'express';

import auth from './auth';
import users from './users';

import unknown from './unknown';

const app: express.Application = express();

app.use('/auth', auth);
app.use('/users', users);

app.use('/', unknown);

export default app;

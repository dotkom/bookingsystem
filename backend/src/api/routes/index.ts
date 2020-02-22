import express from 'express';

import auth from './auth';
import unknown from './unknown';

const app: express.Application = express();

app.use('/auth', auth);

app.use('/', unknown);

export default app;

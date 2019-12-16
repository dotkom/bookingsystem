import { newAccesstoken, companyLogin } from '../controllers';
import express from 'express';
const app: express.Application = express();

app.post('/accesstoken', newAccesstoken);

app.post('/company/login', companyLogin);

export default app;

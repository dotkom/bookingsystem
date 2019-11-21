import { newAccesstoken, companyLogin } from '../controllers';
const app = (module.exports = require('express')());

app.post('/accesstoken', newAccesstoken);

app.post('/company/login', companyLogin);

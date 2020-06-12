import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as mocks from 'node-mocks-http';
import request from 'supertest';
import * as sinon from 'sinon';
import rewiremock from 'rewiremock';

import * as dbf from '../services/databasefunctions';
import app from '../api';
import { newCompanyUser, newCompany } from '../api/routes/register';

chai.use(chaiAsPromised);

describe('Register', function() {
  describe('New Company', () => {
    let payload: {
      email?: string | number | boolean | null;
      orgnum?: string | number | boolean | null;
      name?: string | number | boolean | null;
      telephone?: number;
      surename?: string;
    };
    beforeEach(() => {
      sinon.stub(dbf, 'getAdminPoolClient').resolves();
      sinon.stub(dbf, 'executeQuery').resolves(undefined);
      payload = { email: 'endremau@gmail.com', orgnum: 2, name: 'knowit' };
    });
    //integreation tests
    describe('Routes', () => {
      it('should return ok status', done => {
        request(app)
          .post('/register/company')
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .end(() => {
            done();
          });
      });
    });
    //Unit tests
    describe('Functions correctly', () => {
      const request = mocks.createRequest({
        method: 'POST',
        body: { email: 'endremau@gmail.com', orgnum: 2, name: 'knowit' },
      });
      it('When a new company is registered with correct format', async () => {
        await expect(newCompany(request));
      });
    });
    describe('Too few parameters', () => {
      it('When a new company is registered without email', async () => {
        payload.email = undefined;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });

        await expect(newCompany(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new company is registered without orgnum', async () => {
        payload.orgnum = undefined;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });

        await expect(newCompany(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new company is registered without name', async () => {
        payload.name = undefined;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });

        await expect(newCompany(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
    });
    describe('Too many parameters', () => {
      it('When a new company is registered with addition of telephone', async () => {
        payload.telephone = 282827727;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });

        await expect(newCompany(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new company is registered with addition of telephone and surename', async () => {
        payload.telephone = 314124;
        payload.surename = 'Ulberg';
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });

        await expect(newCompany(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
    });
    describe('Incorrect types on parameters', () => {
      it('When a new company is registered with incorrect type for email', async () => {
        payload.email = 12;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });

        await expect(newCompany(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new company is registered with incorrect type for orgnum', async () => {
        payload.orgnum = '1';
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });

        await expect(newCompany(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new company is registered with incorrect type for name', async () => {
        payload.name = true;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });

        await expect(newCompany(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
    });
    describe('No payload', () => {
      payload = {};
      it('When a new company is registered without any data', async () => {
        const request = mocks.createRequest({
          method: 'POST',
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'No Payload');
        });
      });
    });
    afterEach(sinon.restore);
  });
  describe('New Companyrepresentative', () => {
    let file: any;
    let payload: {
      salary?: number;
      position?: string;
      company?: string | number | boolean | null;
      givenname?: string | number | boolean | null;
      username?: string | number | boolean | null;
      password?: string | number | boolean | null;
      email?: string | number | boolean | null;
      orgnum?: string | number | boolean | null;
      name?: string | number | boolean | null;
      telephone?: number;
      surename?: string | null;
    };
    beforeEach(() => {
      sinon.stub(dbf, 'getAdminPoolClient').resolves();
      sinon.stub(dbf, 'executeTransaction').resolves(undefined);
      file = rewiremock.proxy(() => require('../api/routes/register'), {
        '../../services/databasefunctions': {
          executeTransaction: sinon.stub().resolves(),
          getAdminPoolClient: sinon.stub().resolves(),
        },
      });
      payload = {
        email: 'endremau@gmail.com',
        username: 'endremau',
        password: 'lol',
        givenname: 'Endre',
        surename: 'Ulberg',
        company: 'knowit',
      };
    });

    //integreation tests

    describe('Routes', () => {
      it('should return error status', done => {
        request(app)
          .post('/register/companyuser')
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .end(() => {
            done();
          });
      });
    });

    //Unit tests
    describe('Functions correctly', () => {
      it('When a new companyrepresentative is registered correctly without telephone', async () => {
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(file.newCompanyUser(request));
      });

      it('When a new companyrepresentative is registered correctly with telephone', async () => {
        payload.telephone = 4209928;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        sinon.stub(dbf, 'poolClientHelper').resolves();
        await expect(file.newCompanyUser(request));
      });
    });
    describe('Too few parameters', () => {
      it('When a new companyrepresentative is registered without email', async () => {
        payload.email = undefined;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered without username', async () => {
        payload.username = undefined;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered without password', async () => {
        payload.password = undefined;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered without givenname', async () => {
        payload.givenname = undefined;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered without surename', async () => {
        payload.surename = undefined;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered without company', async () => {
        payload.company = undefined;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered without several values', async () => {
        payload.email = undefined;
        payload.password = undefined;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
    });
    describe('Too many parameters', () => {
      it('When a new companyrepresentative is registered with position', async () => {
        payload.position = 'Boss';
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered with posistion and salary', async () => {
        payload.salary = 40 * 350 * 52;
        payload.position = 'Boss';
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
    });
    describe('Incorrect types', () => {
      it('When a new companyrepresentative is registered with incorrect type for email', async () => {
        payload.email = 123;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered with incorrect type for username', async () => {
        payload.username = true;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered with incorrect type for password', async () => {
        payload.password = null;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered with incorrect type for givenname', async () => {
        payload.givenname = 123;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });

        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered with incorrect type for surename', async () => {
        payload.surename = null;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });

        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered with incorrect type for  company', async () => {
        payload.company = 123;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });

        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
      it('When a new companyrepresentative is registered with incorrect type for several values', async () => {
        payload.username = 213213;
        payload.company = null;
        const request = mocks.createRequest({
          method: 'POST',
          body: payload,
        });

        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Failed validation');
        });
      });
    });
    describe('No payload', () => {
      it('When a new companyrepresentative is registered without any data', async () => {
        const request = mocks.createRequest({
          method: 'POST',
        });
        await expect(newCompanyUser(request)).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'No Payload');
        });
      });
    });

    afterEach(sinon.restore);
  });
});

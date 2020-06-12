import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as mocks from 'node-mocks-http';
import * as pg from 'pg';
import * as fc from 'fast-check';
import * as sinon from 'sinon';

import { validEmail, validateSQLStatement, isOWAuthenticated, isLocalAuthenticated } from '../utils';
import { localRole, OWRole } from '../utils/constants';
import { ErrorHandler } from '../services/error';
import * as dbf from '../services/databasefunctions';
import * as db from '../utils/database';

chai.use(chaiAsPromised);

describe('Validators', function() {
  let hasConnection: sinon.SinonStub;
  let isPool: sinon.SinonStub;
  this.beforeAll(() => {
    hasConnection = sinon.stub(dbf, 'hasConnection').resolves();
    isPool = sinon.stub(db, 'isPool').returns(true);
  });
  describe('Authenticate Users', () => {
    describe('Correct', () => {
      it('When a logged in OWuser tries to access a protected endpoint', async () => {
        const req = mocks.createRequest({
          method: 'GET',
          user: { role: OWRole },
        });
        const res = mocks.createResponse();
        await expect(
          isOWAuthenticated(req, res, (val: any) => {
            if (val instanceof ErrorHandler) {
              throw val;
            } else {
              return true;
            }
          }),
        );
      });

      it('When a logged in local user tries to access a protected endpoint', async () => {
        const req = mocks.createRequest({
          method: 'GET',
          user: { role: localRole },
        });
        const res = mocks.createResponse();
        await expect(
          isLocalAuthenticated(req, res, (val: any) => {
            if (val instanceof ErrorHandler) {
              throw val;
            } else {
              return true;
            }
          }),
        );
      });
    });
    describe('Incorrect Role', () => {
      it('When a logged in OWuser tries to access a protected endpoint made for local users', async () => {
        const req = mocks.createRequest({
          method: 'GET',
          user: { role: OWRole },
        });
        const res = mocks.createResponse();
        await expect(
          isLocalAuthenticated(req, res, (val: any) => {
            if (val instanceof ErrorHandler) {
              throw val;
            } else {
              return true;
            }
          }),
        ).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'User not correct role');
        });
      });

      it('When a logged in local user tries to access a protected endpoint made for OWUsers', async () => {
        const req = mocks.createRequest({
          method: 'GET',
          user: { role: localRole },
        });
        const res = mocks.createResponse();
        await expect(
          isOWAuthenticated(req, res, (val: any) => {
            if (val instanceof ErrorHandler) {
              throw val;
            } else {
              return true;
            }
          }),
        ).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'User not correct role');
        });
      });
    });
    describe('Not Logged in', () => {
      it('When an unauthenticated user tries to access a protected endpoint made for local users', async () => {
        const req = mocks.createRequest({
          method: 'GET',
          user: {},
        });
        const res = mocks.createResponse();
        await expect(
          isLocalAuthenticated(req, res, (val: any) => {
            if (val instanceof ErrorHandler) {
              throw val;
            } else {
              return true;
            }
          }),
        ).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'User not logged into service');
        });
      });

      it('When an unauthenticated user tries to access a protected endpoint made for OWusers', async () => {
        const req = mocks.createRequest({
          method: 'GET',
          user: {},
        });
        const res = mocks.createResponse();
        await expect(
          isOWAuthenticated(req, res, (val: any) => {
            if (val instanceof ErrorHandler) {
              throw val;
            } else {
              return true;
            }
          }),
        ).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 400);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'User not logged into service');
        });
      });
    });
    describe('Unknown Error', () => {
      it('When no role object is present on the user for local users', async () => {
        const req = mocks.createRequest({
          method: 'GET',
        });
        const res = mocks.createResponse();
        await expect(
          isLocalAuthenticated(req, res, (val: any) => {
            if (val instanceof ErrorHandler) {
              throw val;
            } else {
              return true;
            }
          }),
        ).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 500);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Passport Middleware not present');
        });
      });

      it('When no role object is present on the user for OW users', async () => {
        const req = mocks.createRequest({
          method: 'GET',
        });
        const res = mocks.createResponse();
        await expect(
          isOWAuthenticated(req, res, (val: any) => {
            if (val instanceof ErrorHandler) {
              throw val;
            } else {
              return true;
            }
          }),
        ).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 500);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Passport Middleware not present');
        });
      });
    });
  });
  describe('Email Test', () => {
    describe('Correct', () => {
      it('Permutations of email addresses', async () => {
        fc.assert(
          fc.asyncProperty(fc.emailAddress(), async (email: string) => {
            await expect(validEmail(email)).to.equal(true);
          }),
        );
      });
    });
  });

  this.afterAll(sinon.restore);
});

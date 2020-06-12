import request from 'supertest';
import passport from 'passport';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as mocks from 'node-mocks-http';
import * as sinon from 'sinon';
import * as pg from 'pg';

import app from '../api';
import { OWUser } from '../utils';
import { owLogin, callback } from '../api/routes/auth';
import { authenticateLocalUser } from '../services/authenticator';
import { localRole } from '../utils/constants';
import * as dbf from '../services/databasefunctions';

chai.use(chaiAsPromised);

describe('Auth', function() {
  const CorrectUser = {
    username: 'endremau',
    passhash: '$2b$10$UetzqiczYlveWG0az9YnueGXzNWpsOJOi6Fczt8Uly4ZnWQkOk4xq',
  };
  beforeEach(() => {
    sinon.stub(dbf, 'getAdminPoolClient').resolves();
    sinon.stub(dbf, 'executeQuery').resolves({
      rows: [CorrectUser],
    });
    const mPool = { query: sinon.stub().resolves({ rows: [] }), connect: sinon.stub().resolves() };
    sinon.stub(pg, 'Pool').callsFake(() => mPool);
  });
  describe('Authenticate OW User', () => {
    describe('Routes', () => {
      it('Should return ok state', done => {
        request(app)
          .get('/auth/ow/login')
          .expect(200)
          .end(() => {
            done();
          });
      });
    });

    describe('Functioning correctly', () => {
      sinon.stub(passport, 'authenticate').callsFake((strategy, options, callback: any) => {
        callback(null, { username: 'test@techbrij.com' }, null);
        return;
      });

      const request = mocks.createRequest({
        method: 'GET',
        session: { returnTo: 'string' },
      });
      const response = mocks.createResponse();
      it('When a user logs into OW with correct credentials', async () => {
        await expect(
          owLogin(request, response, () => {
            return;
          }),
        );
      });
    });
    describe('No Session', () => {
      const request = mocks.createRequest({
        method: 'GET',
        session: undefined,
      });
      const response = mocks.createResponse();
      it('When a user logs into OW and the server lacks session management', async () => {
        await expect(
          owLogin(request, response, () => {
            return;
          }),
        ).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 500);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Sessions not activate on server');
        });
      });
    });
  });
  describe('Callback', () => {
    //Integration Test

    //Unit test

    describe('Correct', () => {
      const request = mocks.createRequest({
        method: 'GET',
      });
      const response = mocks.createResponse();
      it('When a user recieves a callback from the OIDC server', async () => {
        await expect(
          callback(request, response, () => {
            return;
          }),
        );
      });
    });
  });
  describe('Authenticate Local User', () => {
    describe('Functioning correctly', () => {
      it('When a local user is present in the database.', async () => {
        let contents;
        sinon.stub(passport, 'authenticate').returns(null);
        await authenticateLocalUser(
          'endremau',
          'lol',
          (callback: Function, user: boolean | OWUser, message: object) => {
            if (message) {
              contents = message;
            } else if (user) {
              contents = user;
            }
          },
        );
        expect(contents).to.eql({ ...CorrectUser, role: localRole });
      });
    });

    describe('Incorrect userinfo', () => {
      it('When a local user sends wrong password.', async () => {
        let contents;
        await authenticateLocalUser(
          'endremau',
          '2fsa3',
          (callback: Function, user: boolean | OWUser, message: object) => {
            if (message) {
              contents = message;
            } else if (user) {
              contents = user;
            }
          },
        );
        expect(contents).to.have.property('message', 'invalid username or password');
      });

      it('When a local user sends invalid username.', async () => {
        let contents;
        await authenticateLocalUser(
          '213214124',
          'sssddsa',
          (callback: Function, user: boolean | OWUser, message: object) => {
            if (message) {
              contents = message;
            } else if (user) {
              contents = user;
            }
          },
        );
        expect(contents).to.have.property('message', 'invalid username or password');
      });
    });
  });

  this.afterEach(sinon.restore);
});

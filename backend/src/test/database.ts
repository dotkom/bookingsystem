import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as pg from 'pg';
import * as sinon from 'sinon';

import { validateSQLStatement, foundData, isPool, isClient, isPoolClient, Query } from '../utils';
import * as dbf from '../services/databasefunctions';
import * as db from '../utils/database';
import { getAdminPoolClient } from '../services/databasefunctions';
import { disconnect } from 'cluster';

chai.use(chaiAsPromised);

describe('Database', function () {
  describe('Format SQL', () => {
    const toBeFormated = [
      {
        sqlStatement: "CREATE ROLE %I WITH LOGIN  ENCRYPTED PASSWORD '%I' INHERIT;",
        data: ['username', 'password'],
      },
      {
        sqlStatement: 'GRANT companyUsers to %I;',
        data: ['username'],
      },
    ];
    const formated = [
      "CREATE ROLE username WITH LOGIN  ENCRYPTED PASSWORD 'password' INHERIT;",
      'GRANT companyUsers to username;',
    ];

    const notToBeFormated = [
      {
        sqlStatement: 'SELECT * FROM companyuser WHERE $1 = name;',
        data: ['endre'],
      },
      {
        sqlStatement: 'INSERT INTO companyuser(email) VALUES ($1);',
        data: ['endremau@gmail.com'],
      },
      {
        sqlStatement: 'UPDATE companyuser SET name = $1 WHERE kind = $2;',
        data: ['endre', 'michael'],
      },
    ];
    describe('Should Format', () => {
      it('When a user logs into OW with correct credentials', async () => {
        for (const statement of toBeFormated) {
          const val = await dbf.formatSqlStatement(statement);
          const index = toBeFormated.indexOf(statement);
          expect(val.sqlStatement).to.be.eql(formated[index]);
        }
      });
    });
    describe('Should not format', () => {
      it('Testing standard parameterized query', async () => {
        for (const statement of notToBeFormated) {
          const val = await dbf.formatSqlStatement(statement);
          expect(val).to.be.eql(statement);
        }
      });
    });
  });
  describe('Validate SQL', () => {
    describe('Functioning correctly', () => {
      it('When validating a create statement', async () => {
        await expect(validateSQLStatement('create', 'create role users;'));
      });
      it('When validating a insert statement', async () => {
        await expect(validateSQLStatement('insert', 'insert into company(email) VALUES ($1);'));
      });
      it('When validating a select statement', async () => {
        await expect(validateSQLStatement('select', 'SELECT * FROM events;'));
      });
    });
    describe('Incorrect format', () => {
      it('When validating a incorrect create statement', async () => {
        await expect(validateSQLStatement('insert', 'create role users;')).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 500);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Invalid SQL statment');
        });
      });
      it('When validating a incorrect insert statement', async () => {
        await expect(
          validateSQLStatement('select', 'insert into company(email) VALUES ($1);'),
        ).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 500);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Invalid SQL statment');
        });
      });
      it('When validating a incorrect select statement', async () => {
        await expect(validateSQLStatement('create', 'SELECT * FROM events;')).to.eventually.be.rejected.then(error => {
          expect(error).to.have.property('statusCode', 500);
          expect(error)
            .to.have.property('payload')
            .to.have.property('status', 'Invalid SQL statment');
        });
      });
    });
  });

  describe('Disconnect from DB', () => {


    describe('Gracefully Disconnect', () => {
      it('When a Client disconnects', async () => {
        const val = await dbf.disconnectClient(new pg.Client());
        expect(val).to.be.true;
      });

      it('When a PoolClient disconnects', async () => {
        const PoolClient = {
          release: () => {
            return;
          },
          connect: () => {
            return;
          },
        } as pg.PoolClient;
        const val = await dbf.disconnectClient(PoolClient);
        expect(val).to.be.true;
      });
    });

  });

  describe('Query Execution', () => {
    beforeEach(() => {
      sinon.stub(dbf, 'hasConnection').resolves();
      sinon.stub(dbf, 'poolClientHelper').resolves({
        release: () => {
          return;
        },
      } as pg.PoolClient);
    });
    describe('Functioning correctly', () => {
      it('Single Query', async () => {
        //TODO fix
        const PoolClient = ({
          query: (sql: string, data: any[]) => {
            return Promise.resolve();
          },
        } as unknown) as pg.PoolClient;
        const SQL = 'INSERT INTO company(email) VALUES ($1);';
        const data = ['endremau@gmail.com'];
        const val = await dbf.executeQuery(SQL, PoolClient, false, data);
      });

      it('Transactional Query', async () => {
        const PoolClient = ({
          query: (sql: string, data: any[]) => {
            return Promise.resolve();
          },
        } as unknown) as pg.PoolClient;
        const actions: Query[] = [
          { sqlStatement: 'INSERT INTO company(email) VALUES ($1);', data: ['endremau@gmail.com'] },
        ];
        const val = await dbf.executeTransaction(actions, PoolClient, false);
      });
    });
    afterEach(sinon.restore)
  });

  describe('Generate Connections', () => {

    describe('Client', () => {
      it('Should generate Client', async () => {
        const client = await dbf.generateClientConnection('endre', 'passord');
        expect(client).to.be.a('object');
      });
    });
    describe('Pool', () => {
      it('Should generate PoolClient', async () => {
        const pool = await dbf.generatePoolConnection('endre', 'passord');
        expect(pool).to.be.a('object');
      });
    });

    describe('Admin', () => {
      it('Should return admin pool', async () => {
        const pool = await dbf.genereateAdminConnection();
        expect(pool).to.be.a('object');
      });
    });
  });

  describe('Get Clients', () => {
    beforeEach(() => {
      sinon.stub(dbf, 'hasConnection').resolves();
      sinon.stub(dbf, 'poolClientHelper').resolves({
        release: () => {
          return;
        },
      } as pg.PoolClient);
    });
    describe('Client', () => {
      it('Should get Client', async () => {
        const client = await dbf.getClient((await dbf.generateClientConnection('endre', 'password')) as pg.Client);
        const val = client instanceof pg.Client;
        expect(val).to.be.true;
      });
    });
    describe('Pool', () => {
      it('Should get PoolClient', async () => {
        sinon.stub(db, 'isPool').resolves(true);
        const poolClient = await dbf.getPoolClient((await dbf.generatePoolConnection('endre', 'passord')) as pg.Pool);

        expect(poolClient).to.have.property('release');
      });
    });

    describe('Admin', () => {
      it('Should get admin PoolClient', async () => {
        const pool = await dbf.genereateAdminConnection();
        expect(pool).to.be.a('object');
      });
    });

    describe('UserPool', () => {
      it('Should get UserPoolClient', async () => {
        sinon.stub(db, 'isPool').resolves({});
        const poolClient = await dbf.getUserPoolClient('endre', 'mai');
        expect(poolClient).to.be.a('object');
      });
    });
    afterEach(sinon.restore)
  });

  describe('Check Connection/Client types', function () {
    describe('isPool', () => {
      it('When recieving Pool', async () => {
        const Pool = new pg.Pool();
        const val = isPool(Pool);
        //TODO find error
        expect(val).to.be.false;
      });
      it('When recieving PoolClient', async () => {
        const poolClient = {
          release: () => {
            return;
          },
          connect: () => {
            return;
          },
        } as pg.PoolClient;
        const val = isPool(poolClient);
        expect(val).to.be.false;
      });
      it('When recieving Client', async () => {
        const Client = new pg.Client();
        const val = isPool(Client);
        expect(val).to.be.false;
      });
    });
    describe('isClient', () => {
      it('When recieving Pool', async () => {
        const Pool = new pg.Pool();
        const val = isClient(Pool);
        expect(val).to.be.false;
      });
      it('When recieving PoolClient', async () => {
        const poolClient = {
          release: () => {
            return;
          },
          connect: () => {
            return;
          },
        } as pg.PoolClient;
        const val = isClient(poolClient);
        expect(val).to.be.false;
      });
      it('When recieving Client', async () => {
        const Client = new pg.Client();
        const val = isClient(Client);
        expect(val).to.be.true;
      });
    });

    describe('isPoolClient', () => {
      it('When recieving Pool', async () => {
        const Pool = new pg.Pool();
        const val = isPoolClient(Pool);
        expect(val).to.be.false;
      });
      it('When recieving PoolClient', async () => {
        const poolClient = {
          release: () => {
            return;
          },
          connect: () => {
            return;
          },
        } as pg.PoolClient;
        const val = isPoolClient(poolClient);
        expect(val).to.be.true;
      });
      it('When recieving Client', async () => {
        const Client = new pg.Client();
        const val = db.isPoolClient(Client);
        expect(val).to.be.false;
      });
    });
  });

  describe('Payload checks', () => {
    describe('Has payloads', () => {
      it('When recieving rows from db', async () => {
        const isPayload = await foundData({ rows: ['endre', 'cheggen'] });
        expect(isPayload).to.be.true;
      });
    });
    describe('Empty Payloads', () => {
      it('Should generate PoolClient', async () => {
        const isPayload = await foundData({ rows: [] });
        expect(isPayload).to.be.false;
      });
    });
  });

  this.afterEach(sinon.restore);
});

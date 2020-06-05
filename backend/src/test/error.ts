import request from 'supertest';
import app from '../api';

describe('Unit testing the /error route', () => {
  it('should return error status', done => {
    request(app)
      .get('/error')
      .expect(500)
      .end(() => {
        done();
      });
  });
});

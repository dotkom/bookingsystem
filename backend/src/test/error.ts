import request from 'supertest';
import app from '../api';
//Integration test
describe('Unit testing the /error route', () => {
  it('should return error status', done => {
    request(app)
      .get('/error')
      .expect(404)
      .end(() => {
        done();
      });
  });
});

import * as assert from 'assert';
import { expect } from 'chai';
import request from 'supertest';

import express from 'express';
import api from '../api';

describe('Unit testing the /error route', () => {
  it('should return error status', done => {
    request(api.app)
      .get('/error')
      .expect(500)
      .end(() => {
        api.server.close();
        done();
      });
  });
});

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');

describe.skip('POST /properties/zoopla/import', () => {
  it('should import properties from Zoopla', done => {
    request(app)
      .post('/properties/zoopla/import')
      .send({})
      .expect(200)
      .expect(res => {
        expect(res.body.count).toBe(20);
      })
      .end(done);
  });
});

const request = require('supertest');
const app = require('../index');
const User = require('../models/User');
const chai = require('chai');
const expect = chai.expect; // Import expect from chai

describe('User Authentication', function() {
  this.timeout(5000);

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('token');
  });

  it('should not register a user with an existing email', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Another User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).to.equal(400);
  });

  it('should login an existing user', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('token');
  });
});

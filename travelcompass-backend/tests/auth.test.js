const request = require('supertest');
const app = require('../index');
const User = require('../models/User');

describe('User Authentication', function() {
  this.timeout(5000);
  beforeEach(async () => {
    console.log('Deleting existing users...');
    await User.deleteMany({});
    console.log('Users deleted');
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
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

    expect(res.statusCode).toEqual(400);
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

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

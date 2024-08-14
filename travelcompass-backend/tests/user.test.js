// tests/user.test.js
const request = require('supertest');
const { expect } = require('chai');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');
const Adventure = require('../models/Adventure');
const jwt = require('jsonwebtoken');

describe('User Authentication and Profile Management', () => {
  let userToken;
  let userId;

  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteMany({});
    await Adventure.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('token');
    expect(res.body.user).to.have.property('id');
    expect(res.body.user).to.have.property('name', 'Test User');
    expect(res.body.user).to.have.property('email', 'testuser@example.com');
    userId = res.body.user.id;
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('token');
    expect(res.body.user).to.have.property('id');
    expect(res.body.user).to.have.property('name', 'Test User');

    userToken = res.body.token;
  });

  it('should retrieve the user profile', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('name', 'Test User');
    expect(res.body).to.have.property('email', 'testuser@example.com');
  });

  it('should update the user profile', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Updated User',
        email: 'updateduser@example.com',
        password: 'newpassword123',
      });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('name', 'Updated User');
    expect(res.body).to.have.property('email', 'updateduser@example.com');
  });

  it('should add an adventure to user favorites', async () => {
    // Create a new adventure
    const adventure = new Adventure({
      title: 'Test Adventure',
      description: 'Exciting adventure!',
      price: 100,
      availability: new Date(),
      provider: userId,
      difficulty: 'Moderate',
      activityType: 'Hiking',
      duration: 2,
    });
    await adventure.save();

    const res = await request(app)
      .post('/api/users/profile/save-adventure')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ adventureId: adventure._id });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');});

  it('should retrieve user\'s favorite adventures', async () => {
    const res = await request(app)
      .get('/api/users/profile/favorites')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should retrieve user\'s booking history', async () => {
    const res = await request(app)
      .get('/api/users/profile/bookings')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});

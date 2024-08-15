const request = require('supertest');
const { expect } = require('chai');
const app = require('../index');
const mongoose = require('mongoose');
const Provider = require('../models/Provider');
const User = require('../models/User');
const Adventure = require('../models/Adventure');

describe('Provider API', function() {
  let token;
  let providerId;
  
  // Set timeout for all tests within this suite
  this.timeout(5000);

  before(async function() {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Cleanup: Delete all users, providers, and adventures
    await User.deleteMany({});
    await Provider.deleteMany({});
    await Adventure.deleteMany({});

    // Create a test user
    const user = await new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      roles: ['user', 'provider'],
    }).save();

    // Login the user to get a JWT token
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'testuser@example.com', password: 'password123' });
    
    token = res.body.token;

    // Check if login was successful and token is retrieved
    expect(res.statusCode).to.equal(200);
    expect(token).to.be.a('string');
  });

  after(async function() {
    // Cleanup: Delete created user, provider, and adventures
    await User.deleteMany({});
    await Provider.deleteMany({});
    await Adventure.deleteMany({});
    await mongoose.connection.close();
  });

  it('should create a new provider profile', async function() {
    const res = await request(app)
      .post('/api/providers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Provider',
        description: 'This is a test provider.',
        contactEmail: 'provider@example.com',
        contactPhone: '1234567890',
      });

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('name', 'Test Provider');
    providerId = res.body._id;
  });

  it('should return 400 for missing required fields', async function() {
    const res = await request(app)
      .post('/api/providers')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).to.equal(400);
    expect(res.body).to.have.property('message');
  });

  it('should retrieve a provider by ID', async function() {
    const res = await request(app)
      .get(`/api/providers/${providerId}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('name', 'Test Provider');
  });

  it('should return 404 for an invalid provider ID', async function() {
    const res = await request(app)
      .get('/api/providers/invalidid');

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.have.property('message', 'Provider not found');
  });

  it('should update a provider\'s information', async function() {
    const res = await request(app)
      .put(`/api/providers/${providerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Updated provider description.' });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('description', 'Updated provider description.');
  });

  it('should return 404 if provider not found', async function() {
    const res = await request(app)
      .put('/api/providers/invalidid')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Should not update.' });

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.have.property('message', 'Provider not found');
  });

  it('should delete a provider by ID', async function() {
    const res = await request(app)
      .delete(`/api/providers/${providerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('message', 'Provider deleted');
  });

  it('should return 404 if provider not found for deletion', async function() {
    const res = await request(app)
      .delete('/api/providers/invalidid')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.have.property('message', 'Provider not found');
  });

  it('should retrieve all adventures for a provider', async function() {
    const res = await request(app)
      .get(`/api/providers/${providerId}/adventures`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should return 404 for an invalid provider ID when retrieving adventures', async function() {
    const res = await request(app)
      .get('/api/providers/invalidid/adventures');

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.have.property('message', 'No adventures found for this provider');
  });
});

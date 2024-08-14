const request = require('supertest');
const { expect } = require('chai');
const app = require('../index'); 
const mongoose = require('mongoose');
const Provider = require('../models/Provider');
const User = require('../models/User');
const Adventure = require('../models/Adventure');
const bcrypt = require('bcrypt');

let token;
let providerId;
let userId;

before(async () => {

    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    
        await User.deleteMany({});
        await Provider.deleteMany({});
        await Adventure.deleteMany({});

  // Create a test user
  const user = new User({
    name: 'Test User',
    email: 'testuser@example.com',
    password: await bcrypt.hash('password', await bcrypt.genSalt(10)),
    roles: ['user'],
  });

  await user.save();
  userId = user._id;

  // Login to get a token
  const res = await request(app)
    .post('/api/users/login')
    .send({ email: 'testuser@example.com', password: 'password' });

  token = res.body.token;
});

after(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Provider Feature Tests', () => {
  it('should create a provider for the authenticated user', async () => {
    const res = await request(app)
      .post('/api/providers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Provider',
        description: 'We provide amazing adventures!',
        contactEmail: 'contact@provider.com',
        contactPhone: '1234567890',
      });

    expect(res.statusCode).to.equal(201);
    expect(res.body.name).toBe('Test Provider');
    providerId = res.body._id;

    const user = await User.findById(userId);
    expect(user.roles).toContain('provider');
    expect(user.provider.toString()).toBe(providerId);
  });

  it('should not allow creating a provider with an existing email', async () => {
    const res = await request(app)
      .post('/api/providers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Another Provider',
        description: 'Another description',
        contactEmail: 'contact@provider.com',
        contactPhone: '0987654321',
      });

    expect(res.statusCode).to.equal(500);
    expect(res.body.message).toContain('duplicate key error');
  });

  it('should retrieve the provider by ID', async () => {
    const res = await request(app)
      .get(`/api/providers/${providerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body._id).toBe(providerId);
  });

  it('should not retrieve a provider with an invalid ID', async () => {
    const res = await request(app)
      .get(`/api/providers/invalid-id`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(500); // Mongoose CastError will cause a 500
  });

  it('should update the provider', async () => {
    const res = await request(app)
      .put(`/api/providers/${providerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Provider',
      });

    expect(res.statusCode).to.equal(200);
    expect(res.body.name).toBe('Updated Provider');
  });

  it('should not update the provider if not the owner', async () => {
    // Create another user
    const otherUser = new User({
      name: 'Other User',
      email: 'otheruser@example.com',
      password: await bcrypt.hash('password', 10),
    });
    await otherUser.save();

    const otherTokenRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'otheruser@example.com', password: 'password' });

    const otherToken = otherTokenRes.body.token;

    const res = await request(app)
      .put(`/api/providers/${providerId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        name: 'Malicious Update',
      });

    expect(res.statusCode).to.equal(403);
  });

  it('should delete the provider', async () => {
    // First add an adventure to the provider
    const adventure = new Adventure({
      name: 'Test Adventure',
      description: 'An awesome test adventure',
      provider: providerId,
    });
    await adventure.save();

    const provider = await Provider.findById(providerId);
    provider.adventures.push(adventure._id);
    await provider.save();

    const res = await request(app)
      .delete(`/api/providers/${providerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.message).toBe('Provider deleted');

    const deletedProvider = await Provider.findById(providerId);
    expect(deletedProvider).toBeNull();

    const deletedAdventure = await Adventure.findById(adventure._id);
    expect(deletedAdventure).toBeNull();

    const user = await User.findById(userId);
    expect(user.provider).toBeNull();
    expect(user.roles).not.toContain('provider');
  });

  it('should not delete the provider if not the owner', async () => {
    // Re-create the provider
    const provider = new Provider({
      name: 'Re-created Provider',
      description: 'Just for testing',
      contactEmail: 'recreated@provider.com',
      user: userId,
    });
    await provider.save();
    providerId = provider._id;

    const otherUser = new User({
      name: 'Other User',
      email: 'otheruser2@example.com',
      password: await bcrypt.hash('password', 10),
    });
    await otherUser.save();

    const otherTokenRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'otheruser2@example.com', password: 'password' });

    const otherToken = otherTokenRes.body.token;

    const res = await request(app)
      .delete(`/api/providers/${providerId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.statusCode).to.equal(403);
  });

  it('should retrieve all adventures for a provider', async () => {
    const adventure = new Adventure({
      name: 'Test Adventure for Retrieval',
      description: 'Test adventure description',
      provider: providerId,
    });
    await adventure.save();

    const res = await request(app)
      .get(`/api/providers/${providerId}/adventures`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id).toBe(adventure._id.toString());
  });

  it('should return 404 if no adventures found for a provider', async () => {
    const res = await request(app)
      .get(`/api/providers/${new mongoose.Types.ObjectId()}/adventures`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(404);
    expect(res.body.message).toBe('No adventures found for this provider');
  });
});

// tests/user.test.js
import { use, expect } from 'chai'
import chaiHttp from 'chai-http'
import app from '../index.js';
import User from '../models/User.js';


const server = use(chaiHttp);

describe('User Authentication', () => {
  before(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', (done) => {
    server.request(app)
      .post('/api/users/register')
      .send({ name: 'John Doe', email: 'john@example.com', password: '123456' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should log in the user', (done) => {
    server.request(app)
      .post('/api/users/login')
      .send({ email: 'john@example.com', password: '123456' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should fail to log in with incorrect credentials', (done) => {
    server.request(app)
      .post('/api/users/login')
      .send({ email: 'john@example.com', password: 'wrongpassword' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should get user profile', (done) => {
    let token;

    server.request(app)
      .post('/api/users/login')
      .send({ email: 'john@example.com', password: '123456' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        token = res.body.token;

        server.request(app)
          .get('/api/users/profile')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name');
            expect(res.body).to.have.property('email');
            done();
          });
      });
  });
});

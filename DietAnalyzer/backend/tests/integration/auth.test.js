// backend/tests/integration/auth.test.js
import request from 'supertest';
import app from '../../src/app.js';
import { User } from "../../src/models/user.model.js";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  const testUser = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    firstName: "Test",
    lastName: "User"
  };

  describe('User Registration and Authentication Flow', () => {
    test('Complete auth flow - register, login, access protected route, logout', async () => {
      // 1. Register new user
      const signupRes = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(signupRes.status).toBe(201);
      expect(signupRes.body.data).toHaveProperty('username', testUser.username);
      expect(signupRes.body.data).toHaveProperty('email', testUser.email);
      expect(signupRes.body.data).not.toHaveProperty('password');

      // 2. Login with created user
      const loginRes = await request(app)
        .post('/api/auth/signin')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.data).toHaveProperty('user');
      
      // Store cookies for next requests
      const cookies = loginRes.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.length).toBeGreaterThan(0);

      // 3. Logout with valid token
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.message).toBe('User logged out successfully');
    });

    test('Should prevent unauthorized access to protected routes', async () => {
      const logoutRes = await request(app)
        .post('/api/auth/logout');

      expect(logoutRes.status).toBe(401);
    });

    test('Should prevent duplicate user registration', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      // Try to register same user again
      const duplicateRes = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(duplicateRes.status).toBe(409);
      expect(duplicateRes.body.message).toBe('Username or email already exists');
    });
  });
});
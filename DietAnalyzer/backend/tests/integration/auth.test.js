import dotenv from 'dotenv';
import request from 'supertest';
import {app} from '../../src/app.js';
import { User } from "../../src/models/user.model.js";
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Load environment variables
dotenv.config({ path: '.env.test' });
let mongoServer;

// Verify environment variables are loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('Connected to in-memory database');
    } catch (error) {
      console.error('Error connecting to test database:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await mongoose.disconnect();
      await mongoServer.stop();
      console.log('Disconnected from in-memory database');
    } catch (error) {
      console.error('Error cleaning up test database:', error);
      throw error;
    }
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
      expect(signupRes.body.statusCode).toBe(201);
      expect(signupRes.body.data).toHaveProperty('username', testUser.username);
      expect(signupRes.body.data).toHaveProperty('email', testUser.email);
      expect(signupRes.body.data).not.toHaveProperty('password');
      expect(signupRes.body.message).toBe('User created successfully');

      // 2. Login with created user
      const loginRes = await request(app)
        .post('/api/auth/signin')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.statusCode).toBe(200);
      expect(loginRes.body.data).toHaveProperty('user');
      expect(loginRes.body.message).toBe('User logged in successfully');
      
      // Store cookies for next requests
      const cookies = loginRes.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.length).toBeGreaterThan(0);

      // 3. Logout with valid token
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.statusCode).toBe(200);
      expect(logoutRes.body.message).toBe('User logged out successfully');
    });

    test('Should handle token in Authorization header for logout', async () => {
      // 1. Register and login first
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      const loginRes = await request(app)
        .post('/api/auth/signin')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      const accessToken = loginRes.headers['set-cookie']
        .find(cookie => cookie.startsWith('accessToken='))
        .split(';')[0]
        .replace('accessToken=', '');

      // 2. Logout using Authorization header
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.statusCode).toBe(200);
      expect(logoutRes.body.message).toBe('User logged out successfully');
    });

    test('Should prevent unauthorized access to protected routes', async () => {
      const logoutRes = await request(app)
        .post('/api/auth/logout');

      expect(logoutRes.status).toBe(401);
      expect(logoutRes.body.statusCode).toBe(401);
      expect(logoutRes.body.message).toBe('Unauthorized Request');
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
      expect(duplicateRes.body.statusCode).toBe(409);
      expect(duplicateRes.body.message).toBe('Username or email already exists');
    });

    test('Should handle missing required fields during registration', async () => {
      const incompleteUser = {
        username: "testuser",
        // missing email and password
      };

      const signupRes = await request(app)
        .post('/api/auth/signup')
        .send(incompleteUser);

      expect(signupRes.status).toBe(400);
      expect(signupRes.body.statusCode).toBe(400);
      expect(signupRes.body.message).toBe('Username, email, and password are required');
    });

    test('Should handle missing username during login', async () => {
      const loginRes = await request(app)
        .post('/api/auth/signin')
        .send({
          password: testUser.password
        });

      expect(loginRes.status).toBe(400);
      expect(loginRes.body.statusCode).toBe(400);
      expect(loginRes.body.message).toBe('Username is required');
    });

    test('Should handle missing password during login', async () => {
      const loginRes = await request(app)
        .post('/api/auth/signin')
        .send({
          username: testUser.username
        });

      expect(loginRes.status).toBe(400);
      expect(loginRes.body.statusCode).toBe(400);
      expect(loginRes.body.message).toBe('Password is required');
    });

    test('Should handle non-existent user login attempt', async () => {
      const loginRes = await request(app)
        .post('/api/auth/signin')
        .send({
          username: 'nonexistentuser',
          password: 'somepassword'
        });

      expect(loginRes.status).toBe(404);
      expect(loginRes.body.statusCode).toBe(404);
      expect(loginRes.body.message).toBe('User not found');
    });

    test('Should handle invalid access token', async () => {
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(logoutRes.status).toBe(401);
      expect(logoutRes.body.statusCode).toBe(401);
      expect(logoutRes.body.message).toMatch(/invalid/i);
    });

    test('Should handle malformed Authorization header', async () => {
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'malformed-token');

      expect(logoutRes.status).toBe(401);
      expect(logoutRes.body.statusCode).toBe(401);
      expect(logoutRes.body.message).toMatch(/invalid/i);
    });

    test('Should refresh access token with valid refresh token', async () => {
      // 1. Register and login to get tokens
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      const loginRes = await request(app)
        .post('/api/auth/signin')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      const cookies = loginRes.headers['set-cookie'];
      
      // 2. Try to refresh token
      const refreshRes = await request(app)
        .post('/api/auth/refresh-token')
        .set('Cookie', cookies);

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.statusCode).toBe(200);
      expect(refreshRes.body.message).toBe('Access token refreshed successfully');
      expect(refreshRes.headers['set-cookie']).toBeDefined();
    });

    test('Should handle refresh token with invalid signature', async () => {
      const refreshRes = await request(app)
        .post('/api/auth/refresh-token')
        .set('Cookie', ['refreshToken=invalid.token.here']);

      expect(refreshRes.status).toBe(401);
      expect(refreshRes.body.statusCode).toBe(401);
      expect(refreshRes.body.message).toMatch(/invalid/i);
    });

    test('Should handle missing refresh token in refresh attempt', async () => {
      const refreshRes = await request(app)
        .post('/api/auth/refresh-token');

      expect(refreshRes.status).toBe(401);
      expect(refreshRes.body.statusCode).toBe(401);
      expect(refreshRes.body.message).toBe('Unauthorized request');
    });

    test('Should handle invalid password during login', async () => {
      // First register the user
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      // Try to login with wrong password
      const loginRes = await request(app)
        .post('/api/auth/signin')
        .send({
          username: testUser.username,
          password: 'wrongpassword'
        });

      expect(loginRes.status).toBe(401);
      expect(loginRes.body.statusCode).toBe(401);
      expect(loginRes.body.message).toBe('Invalid credentials');
    });
  });
});